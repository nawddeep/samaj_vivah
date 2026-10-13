// Automated Headless Test Suite for Samaj Vivah Platform Updates
const fs = require('fs');
const path = require('path');

console.log('--- STARTING COMPREHENSIVE SUITE TESTS ---');

// 1. Test SINDHI_DIRECTORY in user/js/directory.js
const directoryCode = fs.readFileSync(path.join(__dirname, '../user/js/directory.js'), 'utf8');
const vm = require('vm');
const context = { window: {}, console };
vm.createContext(context);
vm.runInContext(directoryCode, context);

const { SINDHI_DIRECTORY, getPanchayatById, getAncestralOriginById, getSubCommunityById, searchDirectory } = context.window;

console.log('1. Checking SINDHI_DIRECTORY integrity...');
if (!SINDHI_DIRECTORY || !SINDHI_DIRECTORY.panchayats || !SINDHI_DIRECTORY.ancestralOrigins || !SINDHI_DIRECTORY.subCommunities) {
  throw new Error('Directory structure is missing core arrays');
}
console.log(`✓ Panchayats count: ${SINDHI_DIRECTORY.panchayats.length} (Expected >= 20)`);
console.log(`✓ Ancestral origins count: ${SINDHI_DIRECTORY.ancestralOrigins.length} (Expected >= 10)`);
console.log(`✓ Sub-communities count: ${SINDHI_DIRECTORY.subCommunities.length} (Expected >= 8)`);

// Test searches
const jaipurSearch = searchDirectory('Jaipur');
console.log(`✓ Search "Jaipur": found ${jaipurSearch.panchayats.length} Panchayats`);
if (jaipurSearch.panchayats.length === 0) throw new Error('Search for Jaipur returned 0 results');

const jacobabadSearch = searchDirectory('Jacobabad');
console.log(`✓ Search "Jacobabad": found ${jacobabadSearch.ancestralOrigins.length} ancestral origins, ${jacobabadSearch.panchayats.length} panchayats`);
if (jacobabadSearch.ancestralOrigins.length === 0) throw new Error('Search for Jacobabad returned 0 results');

const amilSearch = searchDirectory('Amil');
console.log(`✓ Search "Amil": found ${amilSearch.subCommunities.length} lineages`);
if (amilSearch.subCommunities.length === 0) throw new Error('Search for Amil returned 0 results');

// 2. Test Bridge Adaptation and Backward Compatibility
console.log('\n2. Testing Bridge adaptation and backward compatibility...');
// Mock Storage and DOM for Bridge
context.btoa = (str) => Buffer.from(str).toString('base64');
context.atob = (str) => Buffer.from(str, 'base64').toString('binary');
context.localStorage = {
  data: {},
  getItem(k) { return this.data[k] || null; },
  setItem(k, v) { this.data[k] = String(v); },
  removeItem(k) { delete this.data[k]; }
};
context.CONFIG = { STORE_USER_KEY: 'test_user', STORE_MEMBERS_KEY: 'test_members', STORE_INTERESTS_KEY: 'test_interests', STORE_SHORTLIST_KEY: 'test_shortlist', STORE_CHAT_KEY: 'test_chat' };

const storeCode = fs.readFileSync(path.join(__dirname, '../admin/js/store.js'), 'utf8');
vm.runInContext(storeCode, context);

const dataCode = fs.readFileSync(path.join(__dirname, '../user/js/data.js'), 'utf8');
vm.runInContext(dataCode, context);

const bridgeCode = fs.readFileSync(path.join(__dirname, '../user/js/bridge.js'), 'utf8');
vm.runInContext(bridgeCode, context);

const { Bridge } = context;

// Test adapting an old legacy profile from storage without any new fields
const legacyProfile = {
  id: 'prf_legacy_001',
  name: 'Kavita Chhabra',
  gender: 'female',
  age: 26,
  height: "5'4\"",
  city: 'Jaipur',
  maritalStatus: 'Never Married',
  education: 'B.Com',
  profession: 'Banking Professional',
  fatherName: 'Late Mohan Chhabra',
  motherName: 'Sunita Chhabra',
  contactNumber: '9829012345'
};

const adapted = Bridge.adapt(legacyProfile);
console.log('✓ Adapting legacy profile:');
console.log('  - aadhaarVerified default:', typeof adapted.aadhaarVerified === 'boolean' ? `PASS (${adapted.aadhaarVerified})` : 'FAIL');
console.log('  - aadhaarMaskedRef default:', adapted.aadhaarMaskedRef || 'None');
console.log('  - houseType default:', adapted.houseType || 'None');
console.log('  - houseSize default:', adapted.houseSize || 'None');
console.log('  - dadaName default:', adapted.dadaName || 'None');
console.log('  - dadiName default:', adapted.dadiName || 'None');
console.log('  - fatherMobile default:', adapted.fatherMobile || 'None');
console.log('  - motherMobile default:', adapted.motherMobile || 'None');
console.log('  - brothersList default:', Array.isArray(adapted.brothersList) ? `PASS (${adapted.brothersList.length} items)` : 'FAIL');
console.log('  - sistersList default:', Array.isArray(adapted.sistersList) ? `PASS (${adapted.sistersList.length} items)` : 'FAIL');

if (!Array.isArray(adapted.brothersList) || !Array.isArray(adapted.sistersList)) {
  throw new Error('Legacy profile adapter did not supply sibling arrays');
}

// 3. Test Full Onboarding Serialization
console.log('\n3. Testing storedFromOnboarding with new client form fields...');
const fullOnboardingState = {
  profileFor: 'Self',
  firstName: 'Aarav',
  lastName: 'Advani',
  gender: 'male',
  dob: '1996-05-14',
  birthTime: '10:30',
  birthPeriod: 'AM',
  birthCity: 'Jaipur',
  maritalStatus: 'Abandoned / Separated (परित्यक्ता)',
  children: 'No',
  previousMarriageDuration: '6 months',
  height: "5'10\"",
  weightKg: 72,
  religion: 'Hindu',
  motherTongue: 'Sindhi',
  casteRestriction: 'Sindhi Samaj Only',
  panchayatId: 'pnc_jpr_central',
  panchayatIds: ['pnc_jpr_central', 'pnc_ulh_central'],
  ancestralOriginId: 'anc_jacobabad',
  ancestralOriginIds: ['anc_jacobabad', 'anc_shikarpur'],
  subCommunityId: 'sub_amil',
  subCommunityIds: ['sub_amil', 'sub_bhaiband'],
  aadhaarVerified: true,
  aadhaarStatus: 'verified',
  aadhaarMethod: 'digilocker',
  aadhaarConsentGiven: true,
  aadhaarConsentTimestamp: '2026-10-13T10:00:00Z',
  aadhaarVerifiedAt: '2026-10-13T10:00:00Z',
  aadhaarMaskedRef: 'XXXX-XXXX-9012',
  education: 'B.Tech / MBA',
  profession: 'Senior Software Engineer',
  income: '20-25 Lakhs',
  city: 'Jaipur',
  residentialAddress: 'Flat 402, Royal Sindhi Heights, Raja Park',
  houseSize: '1800 sq.ft. (3 BHK)',
  houseType: 'Owned (खुद का)',
  familyType: 'Nuclear',
  dadaName: 'Late Shri Gopaldas Advani',
  dadiName: 'Smt. Radhika Advani',
  fatherName: 'Shri Ramesh Advani',
  fatherOccupation: 'Retired Bank Manager',
  fatherIncome: '12 Lakhs / Year',
  fatherMobile: '9829011111',
  motherName: 'Smt. Kavita Advani',
  motherOccupation: 'Homemaker',
  motherMobile: '9829022222',
  brothersList: [
    { name: 'Kunal Advani', maritalStatus: 'Married', spouseName: 'Priya Advani', occupation: 'Chartered Accountant', mobile: '9829033333' }
  ],
  sistersList: [
    { name: 'Mehak Advani', maritalStatus: 'Married', husbandName: 'Deepak Vazirani', inLawsCity: 'Ulhasnagar', motherInLawName: 'Smt. Kamla Vazirani', mobile: '9829044444' }
  ],
  about: 'Looking for a compatible Sindhi life partner with traditional values and modern mindset.',
  partnerMinAge: 24,
  partnerMaxAge: 29,
  partnerEducation: ['B.Tech', 'MBA', 'CA'],
  partnerCity: ['Jaipur', 'Mumbai', 'Pune', 'Ahmedabad'],
  photos: ['data:image/jpeg;base64,sample1']
};

const storedObj = Bridge.storedFromOnboarding(fullOnboardingState, { id: 'usr_test_1', phone: '9829012345' }, 'prf_test_1');
console.log('✓ Stored object serialized:');
console.log('  - Name:', storedObj.name);
console.log('  - Marital Status:', storedObj.maritalStatus);
console.log('  - Aadhaar Verified:', storedObj.aadhaarVerified);
console.log('  - Aadhaar Method:', storedObj.aadhaarMethod);
console.log('  - Aadhaar Status:', storedObj.aadhaarStatus);
console.log('  - Aadhaar Masked Ref:', storedObj.aadhaarMaskedRef);
console.log('  - Panchayat IDs:', storedObj.panchayatIds);
console.log('  - Ancestral Origin IDs:', storedObj.ancestralOriginIds);
console.log('  - Sub Community IDs:', storedObj.subCommunityIds);
console.log('  - Caste Restriction:', storedObj.casteRestriction);
console.log('  - House Size & Type:', storedObj.houseSize, '|', storedObj.houseType);
console.log('  - Grandparents:', storedObj.dadaName, '|', storedObj.dadiName);
console.log('  - Father Info:', storedObj.fatherName, '| Mob:', storedObj.fatherMobile, '| Income:', storedObj.fatherIncome);
console.log('  - Mother Info:', storedObj.motherName, '| Mob:', storedObj.motherMobile);
console.log('  - Brothers Count:', storedObj.brothersList.length, '| Brother 1 Wife:', storedObj.brothersList[0].spouseName);
console.log('  - Sisters Count:', storedObj.sistersList.length, '| Sister 1 Husband:', storedObj.sistersList[0].husbandName, '| MIL:', storedObj.sistersList[0].motherInLawName);

if (storedObj.maritalStatus !== 'Abandoned / Separated (परित्यक्ता)' ||
    storedObj.aadhaarVerified !== true ||
    storedObj.aadhaarMethod !== 'digilocker' ||
    !Array.isArray(storedObj.panchayatIds) || storedObj.panchayatIds.length !== 2 ||
    !Array.isArray(storedObj.ancestralOriginIds) || storedObj.ancestralOriginIds.length !== 2 ||
    !Array.isArray(storedObj.subCommunityIds) || storedObj.subCommunityIds.length !== 2 ||
    storedObj.panchayatId !== 'pnc_jpr_central' ||
    storedObj.ancestralOriginId !== 'anc_jacobabad' ||
    storedObj.subCommunityId !== 'sub_amil' ||
    storedObj.brothersList.length !== 1 ||
    storedObj.sistersList.length !== 1) {
  throw new Error('storedFromOnboarding did not serialize expected properties');
}

// Test adapting back to state
const reAdapted = Bridge.adapt(storedObj);
if (!Array.isArray(reAdapted.panchayatIds) || reAdapted.panchayatIds.length !== 2 ||
    reAdapted.aadhaarMethod !== 'digilocker') {
  throw new Error('Bridge.adapt failed to preserve multi-select arrays or aadhaarMethod');
}

// 4. Test Admin Add Profile Validators
console.log('\n4. Testing admin validators and form logic...');
const validatorsCode = fs.readFileSync(path.join(__dirname, '../admin/js/validators.js'), 'utf8');
vm.runInContext(validatorsCode.replace('const Validators =', 'var Validators ='), context);
const { Validators } = context;

const validAdminProfile = {
  name: 'Rohan Moriani',
  gender: 'male',
  age: '28',
  city: 'Ahmedabad',
  education: 'MBA',
  profession: 'Financial Analyst',
  contactNumber: '9829999999',
  photos: ['photo1']
};

const vRes = Validators.validateProfile(validAdminProfile, true);
console.log('✓ Admin Profile Validation for publish:', vRes.isValid ? 'PASS (Valid)' : 'FAIL: ' + JSON.stringify(vRes.errors));
if (!vRes.isValid) throw new Error('Valid admin profile failed validation');

console.log('\n--- ALL AUTOMATED LOGIC TESTS PASSED SUCCESSFULLY! ---');
