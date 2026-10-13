# 🛡️ Aadhaar Identity Verification — Production Specification & Legal Analysis

**Document Version:** 2.0.0  
**Date:** October 2026  
**Project:** Samaj Vivah Matrimonial Platform  
**Authors:** Senior Full-Stack Architect & Legal-Tech Compliance Analyst  

---

## 1. Regulatory, Legal & Technical Framework (India)

### 1.1 The Legal Baseline
Aadhaar-based identification in India is governed by:
1. **The Aadhaar (Targeted Delivery of Financial and Other Subsidies, Benefits and Services) Act, 2016**
2. **The Aadhaar and Other Laws (Amendment) Act, 2019**
3. **Supreme Court Constitution Bench Judgment in *Justice K.S. Puttaswamy (Retd.) v. Union of India (2018)***
4. **UIDAI Circulars on Private Entity Authentication & Offline Verification**
5. **Digital Personal Data Protection (DPDP) Act, 2023**

### 1.2 Can a Private Matrimonial Platform Use Direct Online UIDAI Biometric / OTP Authentication (AUA/KUA)?
**No, direct AUA/KUA integration is legally prohibited for private matrimonial platforms.**

* **Legal Rationale:** Following the *Puttaswamy* ruling and Section 57 amendment, Section 4(4) of the Aadhaar Act explicitly restricts direct Authentication User Agency (AUA) / KYC User Agency (KUA) licensing to:
  - Government departments administering subsidies/benefits funded from the Consolidated Fund of India.
  - Entities allowed by specific Parliamentary statutes (e.g. Banks under PMLA and RBI guidelines, Telecom providers under DoT directives).
- A private matrimonial matchmaking service has **no statutory backing** to request or process direct online Aadhaar biometric or direct central UIDAI OTP authentication.
- Imposing mandatory online UIDAI authentication on members is punishable under Section 42 of the Aadhaar Act.

---

## 2. Permitted & Legally Approved Verification Mechanisms

Under **Section 4(4)(ii) of the Aadhaar Act (as amended 2019)**, private entities may verify individuals through **voluntary offline verification mechanisms** that do not expose the central UIDAI CIDR database or collect biometric data:

```
┌────────────────────────────────────────────────────────────────────────┐
│                   PERMITTED PRIVATE VERIFICATION PATHS                 │
├────────────────────────────────┬───────────────────────────────────────┤
│ 1. DigiLocker OAuth 2.0        │ Government-operated citizen portal     │
│    (Recommended & Most Secure) │ Issuing digitally signed JSON/XML      │
├────────────────────────────────┼───────────────────────────────────────┤
│ 2. Aadhaar Paperless Offline   │ Citizen downloads encrypted ZIP file   │
│    e-KYC (XML with Share Code) │ Platform decrypts & verifies XML sig   │
├────────────────────────────────┼───────────────────────────────────────┤
│ 3. Licensed TSP Sub-KYC        │ Setu / Cashfree / Karza / Bureau       │
│    (Authorized Intermediaries) │ Managed DigiLocker & Offline API       │
├────────────────────────────────┼───────────────────────────────────────┤
│ 4. Alternative Govt ID Fallback│ Non-exclusionary manual verification   │
│    (Panchayat / Voter / Pass)  │ For candidates without Aadhaar/mobile  │
└────────────────────────────────┴───────────────────────────────────────┘
```

### Method 1: DigiLocker Integration (Recommended)
1. **Flow:**
   - Candidate clicks *"Verify with DigiLocker"*.
   - Platform redirects to `https://api.digitallocker.gov.in/public/oauth2/1/authorize`.
   - Candidate logs in directly on the government domain and grants consent for profile verification.
   - DigiLocker redirects back to platform backend with an authorization code.
   - Backend exchanges code for access token and downloads the digitally signed Aadhaar credential.
2. **Data Returned:**
   - Name, Date of Birth, Gender, Masked Aadhaar (`XXXX-XXXX-1234`).
   - Digital signature from `National Informatics Centre (NIC) / DigiLocker`.
3. **Storage Rule:** The full 12-digit UID is never visible or stored. Only the verification token and masked reference are retained.

### Method 2: Aadhaar Paperless Offline e-KYC (XML + 4-Digit Share Code)
1. **Flow:**
   - Candidate visits UIDAI Resident Portal (`myaadhaar.uidai.gov.in`).
   - Candidate enters their Aadhaar number + OTP, creates a 4-digit Share Code (e.g. `4567`), and downloads a password-protected `.zip` file.
   - Candidate uploads the `.zip` file and types the 4-digit Share Code into Samaj Vivah.
   - Platform backend unzips the payload using the Share Code as the AES-256 decryption key.
   - Backend verifies the XML digital signature against the public certificate of UIDAI (`uidai.gov.in`).
2. **Data Minimization:**
   - XML contains: Masked Aadhaar (last 4 digits), Name, Photo (JPEG byte array), Gender, DOB.
   - Zero biometrics are present in the XML.

### Method 3: Alternative Verification (Panchayat / Manual ID)
To comply with the Supreme Court's anti-exclusion doctrine, **no member can be denied service solely due to lack of Aadhaar**.
- Candidates may choose manual verification by submitting alternative Government ID (Voter ID, Passport, Driving License) or a verified **Sindhi Panchayat Membership Certificate**.
- The profile enters `MANUAL_PENDING_ADMIN_VERIFICATION` and is manually validated by the Samaj Admin.

---

## 3. Security, Privacy & LocalStorage Prohibitions

In adherence to DPDP Act 2023 and UIDAI Security Guidelines:
1. **Zero Raw Aadhaar Storage:** The full 12-digit Aadhaar number is **NEVER** stored in LocalStorage, SessionStorage, cookies, or client logs.
2. **Zero Biometric Processing:** Fingerprints, iris scans, and facial vector embeddings are strictly forbidden.
3. **Masked UID Format:** Only masked strings (`XXXX-XXXX-9012`) may be rendered on screens.
4. **Purpose-Limited Consent:** Explicit disclosure displayed before any verification is initiated:
   > *"Consent for Matrimonial Identity Verification: I voluntarily provide my consent to verify my identity for my Samaj Vivah matrimonial profile. I understand that my data will be used solely to confirm candidate authenticity and prevent fraudulent profiles."*

---

## 4. Frontend Implementation Architecture

In this browser-based prototype:
* We provide a **full-featured, production-ready UI** that supports:
  - Explicit UIDAI/DPDP-compliant Consent Disclosure.
  - Three verification modes: DigiLocker Gateway, Offline e-KYC XML, and Manual Panchayat ID fallback.
  - Complete error states, simulated network timeouts, test failure toggles, and retry flows.
  - Transparent state persistence: `VERIFIED_DIGILOCKER`, `VERIFIED_OFFLINE_XML`, `MANUAL_PENDING`, or `SKIPPED`.
* We clearly label prototype simulations as **"Sandbox Simulation / Gateway Simulator"** so users and evaluators are never misled into believing an unauthorized real connection took place.

---

## 5. Backend Production Requirements (Migration Blueprint)

When migrating to the production server:
1. **API Endpoints Required:**
   - `POST /api/v1/auth/digilocker/initiate`: Generates PKCE code verifier and returns redirect URL.
   - `GET /api/v1/auth/digilocker/callback`: Handles OAuth code exchange, validates NIC certificate, and emits JWT verification token.
   - `POST /api/v1/auth/offline-xml/verify`: Receives multipart `.zip` + `share_code`, decrypts AES-256 stream, verifies UIDAI RSA signature, extracts masked reference.
2. **Environment Variables:**
   ```bash
   DIGILOCKER_CLIENT_ID="SAMAAJ_VIVAH_PROD_102"
   DIGILOCKER_CLIENT_SECRET="<VAULT_STORED_SECRET>"
   DIGILOCKER_REDIRECT_URI="https://api.samajvivah.org/v1/auth/digilocker/callback"
   UIDAI_PUBLIC_CERT_PATH="/etc/certs/uidai_auth_sign.cer"
   ```
