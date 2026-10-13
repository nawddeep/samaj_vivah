# 🏗️ Samaj Vivah — Production Architecture Migration Plan

**Document Version:** 1.0.0  
**Date:** October 2026  
**Auditor / Architect:** Senior Software Architect & Full-Stack Engineer  
**Objective:** Migration Blueprint from Browser-Only Vanilla Prototype to Production-Grade Enterprise Platform  

---

## 1. Current Architecture vs. Production Limitations

The current prototype operates entirely within the browser using `localStorage`, static HTML/CSS/JS files, and client-side JavaScript routers. While this enables 100% offline functionality, immediate local testing, and rapid validation of UX and form schemas, it has distinct architectural limitations that must be addressed for production deployment:

| Capability | Current Prototype (Offline Browser) | Production Risk | Target Production Architecture |
| :--- | :--- | :--- | :--- |
| **Authentication** | Demo OTP (1234) stored client-side | Insecure; any user can spoof phone | SMS Gateway (MSG91/Twilio) + Cryptographic JWT with HttpOnly cookies |
| **Identity Verification** | Client-side DigiLocker/XML simulator | Cannot verify UIDAI digital signatures without exposing server private keys | Secure Node.js/Go backend proxy to DigiLocker OAuth & UIDAI XML signature validator |
| **Data Storage** | LocalStorage (`mm_users`, `mm_profiles`) | Single device/browser only; easily wiped; limited to 5MB | Scalable PostgreSQL 16 database with connection pooling (PgBouncer) |
| **Photos & Documents** | Base64 in LocalStorage | Quickly exhausts browser storage quotas; unencrypted | AWS S3 / Google Cloud Storage with private buckets and time-limited pre-signed URLs |
| **Chat & Interests** | LocalStorage polling | No cross-device delivery or offline push notifications | WebSocket (Socket.io) / WebRTC with Redis Pub/Sub backplane + FCM mobile push notifications |
| **Data Privacy** | Client-side contact masking | Tech-savvy users can inspect network/localStorage objects | Server-side field-level masking; phone numbers revealed ONLY upon explicit admin/mutual consent |
| **Audit & Governance** | Client-side `mm_activity` array | Non-repudiation impossible; easily tampered | Immutable append-only PostgreSQL audit log with IP, user-agent, and actor IDs |

---

## 2. Target Production Stack

```
┌────────────────────────────────────────────────────────────────────────┐
│                        TARGET ARCHITECTURE STACK                       │
├───────────────────┬────────────────────────────────────────────────────┤
│ Frontend (Web)    │ React 19 / Next.js 15 or Enhanced Vanilla ES6 SPA  │
├───────────────────┼────────────────────────────────────────────────────┤
│ Mobile App        │ Flutter (Android & iOS) with shared REST/WS API    │
├───────────────────┼────────────────────────────────────────────────────┤
│ API Gateway       │ NGINX / Cloudflare with Rate Limiting & WAF        │
├───────────────────┼────────────────────────────────────────────────────┤
│ Backend Services  │ Node.js (NestJS / Express) + TypeScript            │
├───────────────────┼────────────────────────────────────────────────────┤
│ Primary Database  │ PostgreSQL 16 (Relational Schema with Row Security)│
├───────────────────┼────────────────────────────────────────────────────┤
│ Cache / Realtime  │ Redis 7 (Session Store, Rate Limits, Socket PubSub)│
├───────────────────┼────────────────────────────────────────────────────┤
│ Object Storage    │ AWS S3 / MinIO (Private Buckets + Pre-signed URLs) │
├───────────────────┼────────────────────────────────────────────────────┤
│ Identity Gateway  │ DigiLocker OAuth 2.0 + Offline e-KYC Decryptor     │
├───────────────────┼────────────────────────────────────────────────────┤
│ SMS / WhatsApp    │ MSG91 / Gupshup / Twilio SMS OTP Gateway           │
└───────────────────┴────────────────────────────────────────────────────┘
```

---

## 3. Database Schema Blueprint (PostgreSQL DDL)

```sql
-- 1. Users Table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone VARCHAR(15) UNIQUE NOT NULL,
    phone_verified BOOLEAN DEFAULT FALSE,
    phone_verified_at TIMESTAMPTZ,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('none', 'pending', 'approved', 'rejected', 'blocked')),
    rejection_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Profiles Table (Revised Client Schema)
CREATE TABLE profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    profile_code VARCHAR(20) UNIQUE NOT NULL, -- e.g. SV100245
    profile_for VARCHAR(20) NOT NULL, -- Self, Son, Daughter, etc.
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    gender VARCHAR(10) NOT NULL CHECK (gender IN ('male', 'female')),
    dob DATE NOT NULL,
    birth_weekday VARCHAR(20),
    birth_time VARCHAR(20),
    birth_city VARCHAR(100),
    marital_status VARCHAR(50) NOT NULL,
    caste_restriction VARCHAR(100) DEFAULT 'Sindhi Samaj Only',
    height_inches INT NOT NULL,
    weight_kg INT,
    education VARCHAR(200) NOT NULL,
    profession VARCHAR(200) NOT NULL,
    annual_income VARCHAR(100),
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100),
    country VARCHAR(100) DEFAULT 'India',
    residential_address TEXT,
    house_size VARCHAR(100),
    house_type VARCHAR(50) CHECK (house_type IN ('Owned', 'Rented')),
    
    -- Grandparents & Family
    dada_name VARCHAR(100),
    dadi_name VARCHAR(100),
    father_name VARCHAR(100),
    father_occupation VARCHAR(100),
    father_income VARCHAR(100),
    father_mobile VARCHAR(15),
    mother_name VARCHAR(100),
    mother_occupation VARCHAR(100),
    mother_mobile VARCHAR(15),
    family_type VARCHAR(20) DEFAULT 'Nuclear',
    
    -- Sibling Arrays (JSONB for structural repeaters)
    brothers JSONB DEFAULT '[]'::jsonb, -- [{ name, maritalStatus, spouseName, occupation, phone }]
    sisters JSONB DEFAULT '[]'::jsonb,  -- [{ name, maritalStatus, husbandName, inlawsCity, motherInLawName, phone }]
    
    -- Community Directory Linkage (Normalized Array of Stable IDs)
    panchayat_ids TEXT[] DEFAULT '{}',
    ancestral_origin_ids TEXT[] DEFAULT '{}',
    sub_community_ids TEXT[] DEFAULT '{}',
    
    -- Moderation & Access Control
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'hidden', 'archived')),
    contact_number_masked VARCHAR(15),
    contact_number_unmasked VARCHAR(15), -- accessible strictly via authorized API
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Aadhaar & Identity Verification Audit Log (Zero raw UID stored)
CREATE TABLE identity_verifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    verification_method VARCHAR(50) NOT NULL CHECK (verification_method IN ('digilocker', 'offline_xml', 'manual_id')),
    verification_status VARCHAR(50) NOT NULL CHECK (verification_status IN ('VERIFIED', 'FAILED', 'PENDING_MANUAL', 'SKIPPED')),
    masked_uid_reference VARCHAR(20) NOT NULL, -- e.g. XXXX-XXXX-9012
    verified_name VARCHAR(100),
    dob_match BOOLEAN,
    name_match_score NUMERIC(5,2),
    raw_response_hash VARCHAR(64) NOT NULL, -- SHA-256 hash of verification response for non-repudiation
    consent_timestamp TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Interests Table
CREATE TABLE interests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_id UUID REFERENCES users(id) ON DELETE CASCADE,
    receiver_id UUID REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (sender_id, receiver_id)
);

-- 5. Chat Messages Table
CREATE TABLE chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id VARCHAR(100) NOT NULL,
    sender_id UUID REFERENCES users(id) ON DELETE CASCADE,
    recipient_id UUID REFERENCES users(id) ON DELETE CASCADE,
    message_text TEXT NOT NULL,
    read_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 4. Phased Implementation Roadmap

### Phase 1: Security Proxy & Identity Backend (Weeks 1–2)
- Deploy minimal Node.js/TypeScript backend API.
- Implement DigiLocker OAuth 2.0 server flow and PKCE token exchange.
- Implement Offline e-KYC XML decryption and UIDAI digital signature check.
- Frontend switches from local simulator to real backend endpoints.

### Phase 2: PostgreSQL Persistence & Authentication (Weeks 3–4)
- Migrate users and profiles from LocalStorage to PostgreSQL.
- Implement real SMS OTP gateway via MSG91/Twilio.
- Implement JWT session management and cookie-based authentication.

### Phase 3: Media Storage & Secure Contact Reveal (Weeks 5–6)
- Connect AWS S3 for profile photos and biodata PDFs.
- Implement automatic WebP image compression and thumbnail generation.
- Enforce server-side contact masking: phone numbers are never returned in public search queries.

### Phase 4: Real-time Communication & Native Mobile App (Weeks 7–8)
- Implement WebSocket real-time messaging with Redis backplane.
- Package Flutter mobile applications for Google Play Store and Apple App Store.
