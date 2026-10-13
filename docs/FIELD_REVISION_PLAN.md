# 📋 Samaj Vivah — Client Form Revision Plan & Field Inventory

**Document Version:** 1.0.0  
**Date:** October 2026  
**Auditor / Lead Engineer:** Senior Product Analyst & Frontend Architect  
**Source of Truth:** Client Matrimonial Biodata Form (Scanned Pages 1 & 2)

---

## 1. Executive Summary of Field Revisions

The client supplied two traditional matrimonial biodata form pages annotated with handwritten marks:
- **Checkmark (✓):** Retain and support field in the modern member registration workflow.
- **Cross (✗):** Remove from member-facing collection and validation (e.g. outdated, discriminatory, or invasive fields).
- **Plus Sign (+):** Add new required/optional fields to the digital biodata schema.

Every field from Page 1 and Page 2 has been systematically classified below. To prevent data corruption, removed fields are deprecated from active collection while preserving backward compatibility in the data store for existing records.

---

## 2. Page 1: Candidate & Family Biodata Analysis

| Field Name | Source / Printed Label | Annotation Mark | Classification | Implementation Decision & UI Behavior | Data Model Property |
| :--- | :--- | :---: | :--- | :--- | :--- |
| **Registration Number** | Reg. No. / पंजी. क्र. | ✓ | **Retain (System)** | Auto-generated unique candidate identifier (e.g. `SV100245`). Displayed on profile header; not manually typed by candidate. | `profileCode` / `id` |
| **Registration Date** | Date / दिनांक | ✓ | **Retain (System)** | Auto-captured ISO timestamp of profile submission. Displayed in admin and member profile overview. | `createdAt` |
| **Candidate Gender** | Gender / लिंग | ✓ | **Retain** | Core demographic selection: Male / Female. Controls opposite-gender match filtering. | `gender` |
| **First Name** | Name / नाम | ✓ | **Retain** | Candidate given name. Required validation. | `firstName` |
| **Surname** | Surname / उपनाम (अटक) | ✓ | **Retain** | Traditional Sindhi surname (Atak). Required validation. | `lastName` / `surname` |
| **Date of Birth** | D.O.B. / जन्म दिनांक | ✓ | **Retain** | Day, Month, Year pickers. Auto-calculates age (18–70 limit). Required validation. | `dobDay`, `dobMonth`, `dobYear` |
| **Weekday of Birth** | Day / वार (दिन) | ✓ | **Retain (Auto)** | Automatically computed from Date of Birth (e.g. Monday, Tuesday). Displayed in horoscope section. | `birthWeekday` |
| **Birth Time & AM/PM**| Time / जन्म समय | ✓ | **Retain** | Time input with AM/PM toggle (e.g. `06:30 AM`). Critical for Kundali horoscope matching. | `birthTime` |
| **Birth City / Place** | Place of Birth / जन्म स्थान | ✓ | **Retain** | City/town where candidate was born. Required validation. | `birthPlace` |
| **Height** | Height / कद (ऊंचाई) | ✓ | **Retain** | Standard height selector in feet and inches (e.g. `5' 10"`). Required validation. | `heightIn` / `height` |
| **Weight** | Weight / वजन (कि.ग्रा.) | ✓ / (+) | **Retain (Optional)**| Weight in Kilograms (kg). Kept optional in personal step; not required for form submission. | `weightKg` |
| **Complexion / Colour**| Complexion / वर्ण (रंग) | ✗ | **Remove** | **Removed from registration UI and required validation.** Discriminatory physical metric. Preserved as dormant optional field for legacy records. | `complexion` (deprecated) |
| **Education** | Education / शैक्षणिक योग्यता | ✓ | **Retain** | Degree qualification (B.Tech, MBBS, CA, MBA, etc.) and institution/college name. Required validation. | `education`, `college`, `fieldOfStudy` |
| **Occupation / Career**| Occupation / व्यवसाय | ✓ | **Retain** | Employment sector (Private, Govt, Business, Self-Employed) and designation/profession. Required validation. | `employment`, `profession`, `company` |
| **Annual Income** | Income / वार्षिक आय | ✓ | **Retain** | Individual annual earnings range (e.g. `12-18 LPA`). Required validation. | `income` |
| **Address** | Address / वर्तमान पता | ✓ | **Retain** | Street address, City, State, Country, and Living with family status. | `city`, `state`, `address` |
| **Hobbies** | Hobbies / रुचियां | ✓ | **Retain** | Multi-select lifestyle interests (Reading, Travelling, Cooking, Yoga, Music, etc.). | `hobbies` |
| **Father's Name** | Father's Name / पिता का नाम | ✓ | **Retain** | Full name of father. Required validation. | `fatherName` |
| **Father's Occupation** | Father's Occ. / पिता का व्यवसाय | ✓ | **Retain** | Father's profession (Business, Govt Service, Retired, etc.). Required validation. | `fatherOcc` / `fatherOccupation` |
| **Father's Mobile No.** | Mobile / पिता का मोबाइल नं. | **+** | **Add (New)** | 10-digit contact number for father. Essential for family-to-family parent discussions. Validated: `^[6-9]\d{9}$`. | `fatherMobile` |
| **Father's Income** | Approx. Income / पिता की आय | ✓ | **Retain (Optional)**| Family financial bracket (e.g. `10-20 LPA`). Optional. | `familyIncome` |
| **Mother's Name** | Mother's Name / माता का नाम | ✓ | **Retain** | Full name of mother. Required validation. | `motherName` |
| **Mother's Occupation** | Mother's Occ. / माता का व्यवसाय| ✓ | **Retain** | Mother's occupation (Homemaker, Teacher, Business, etc.). | `motherOcc` |
| **Mother's Mobile No.** | Mobile / माता का मोबाइल नं. | **+** | **Add (New)** | 10-digit contact number for mother. Optional family contact coordination. | `motherMobile` |
| **Grandfather's Name** | Dada / दादाजी का नाम | **+** | **Add (New)** | Paternal grandfather's name. Traditional Sindhi lineage marker. | `dadaName` |
| **Grandmother's Name** | Dadi / दादीजी का नाम | **+** | **Add (New)** | Paternal grandmother's name. Traditional lineage marker. | `dadiName` |
| **House / Flat Size** | House Size / मकान/फ्लैट का नाप | **+** | **Add (New)** | Residential property specification (e.g. `2 BHK Flat`, `3 BHK Row House`, `1500 sq ft Independent House`). | `houseSize` |
| **Owned vs Rented** | Property Status / खुद का या किराये का | **+** | **Add (New)** | Housing tenure: `Owned (खुद का)` vs `Rented (किराये का)`. | `houseType` |

---

## 3. Page 2: Marital Status & Family Structure Analysis

| Field Name | Source / Printed Label | Annotation Mark | Classification | Implementation Decision & UI Behavior | Data Model Property |
| :--- | :--- | :---: | :--- | :--- | :--- |
| **Marital Status** | Marital Status / वैवाहिक स्थिति | ✓ | **Retain & Expand** | Expanded options: `Never Married`, `Divorced`, `Abandoned / Separated (परित्यक्ता)`, `Widowed (विधवा/विधुर)`, `Annulled`. | `maritalStatus` |
| **Divorced / Separated Nuance** | Abandoned / तलाकशुदा / परित्यक्ता | **+** | **Add (Nuance)** | Specific support for `Abandoned / Separated (परित्यक्ता)`. Conditional children fields displayed when not Never Married. | `maritalStatus`, `hasChildren` |
| **Widow / Widower Status** | Widow/Widower / विधवा/विधुर | ✓ | **Retain** | Standard option with conditional children disclosure. | `maritalStatus` |
| **Community Restriction** | Caste Restriction / समाज का बंधन | ✓ | **Retain** | Community preference choice: `Sindhi Community Only (केवल सिंधी समाज)` vs `All Communities Acceptable (अन्य समाज भी मान्य)`. | `casteRestriction` |
| **Ancestral Place in Pakistan** | Origin / पाकिस्तान में पैतृक स्थान | ✓ / **+** | **Retain & Elevate** | Ancestral hometown in Sindh (e.g. Jacobabad, Shikarpur, Larkana, Sukkur, Hyderabad Sindh). Integrated with Community Directory! | `ancestralOriginId`, `ancestralPlace` |
| **Brothers Count** | No. of Brothers / भाइयों की संख्या | ✓ | **Retain** | Selector (0, 1, 2, 3). Conditionally generates structured brother detail rows. | `brothersCount` |
| **Brother 1, 2, 3 Details** | Brother Rows / भाई का विवरण | **+** | **Add (Structured)**| For each brother: Full Name, Marital Status (`Unmarried` / `Married`), *if married:* Wife's Name / Spouse Details, Occupation, Mobile Number. | `brothersList: [{ name, marital, wifeName, occ, phone }]` |
| **Sisters Count** | No. of Sisters / बहनों की संख्या | ✓ | **Retain** | Selector (0, 1, 2, 3). Conditionally generates structured sister detail rows. | `sistersCount` |
| **Sister 1, 2, 3 Details** | Sister Rows / बहन का विवरण | **+** | **Add (Structured)**| For each sister: Full Name, Marital Status (`Unmarried` / `Married`), *if married:* Husband's Name, In-laws City/Family, Mother-in-law Name / Family Name, Phone Number. | `sistersList: [{ name, marital, husbandName, inlawsCity, sasurName, phone }]` |

---

## 4. Summary of Additions, Removals, and Preservations

### Newly Added Fields (+)
1. **Father's Mobile Number** (`fatherMobile`)
2. **Mother's Mobile Number** (`motherMobile`)
3. **Paternal Grandfather's Name (Dada)** (`dadaName`)
4. **Paternal Grandmother's Name (Dadi)** (`dadiName`)
5. **House / Flat Size** (`houseSize`)
6. **Property Ownership Status** (`houseType`: Owned vs Rented)
7. **Marital Sub-category:** `Abandoned / Separated (परित्यक्ता)`
8. **Structured Sibling Details:**
   - Up to 3 Brothers: Name, Marital status, Wife's name, Occupation, Contact.
   - Up to 3 Sisters: Name, Marital status, Husband's name, In-laws city, Mother-in-law/family name, Contact.
9. **Aadhaar Demo Verification Flag:** `aadhaarVerified: true`, `aadhaarVerifiedAt: ISO timestamp`
10. **Sindhi Samaj / Panchayat Organization Selection:** `panchayatId`, `panchayatName`, `ancestralOriginId`, `subCommunityId`

### Deprecated / Removed Fields (✗)
1. **Complexion / Colour (`complexion`):** Removed from member registration flow and validator checks to adhere to ethical standards. Existing records retain value silently if already present.

### Preserved Core Fields (✓)
All remaining fields from the existing 18-step questionnaire—including candidate photos, PDF biodata attachments, education, profession, income, diet, lifestyle, horoscope details (Manglik, Rashi, Nakshatra), partner expectations, and privacy settings—are **100% preserved**.

---

## 5. Backward Compatibility Safeguards

1. **Legacy Record Safety:** Pre-existing profiles (e.g. `prf_101` to `prf_115` and demo profiles `p1` to `p20`) do not have the newly added fields. The data adapter in `bridge.js` safely provides fallback values (`brothersList: []`, `sistersList: []`, `houseSize: 'Not specified'`, `houseType: 'Owned'`).
2. **Admin Panel Compatibility:** The Admin profile details modal and profile editor (`add-profile.html`) are updated to render both new and legacy records without throw errors or blank screens.
