/* ==========================================================================
   STORE.JS - Single Source of Truth for Data Storage & Seed Data
   ========================================================================== */

const STORAGE_KEYS = {
  USERS: 'mm_users',
  PROFILES: 'mm_profiles',
  SESSION: 'mm_admin_session',
  ACTIVITY: 'mm_activity'
};

// SVG Avatar generator helper to produce lightweight, realistic seed photos offline
function generateSvgAvatar(name, gender, bgColor, textStyle = '#ffffff') {
  const initials = name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  const icon = gender === 'female' ? '👩' : '👨';
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300">
    <rect width="300" height="300" fill="${bgColor}" rx="12"/>
    <circle cx="150" cy="120" r="60" fill="rgba(255,255,255,0.2)"/>
    <text x="150" y="135" font-family="sans-serif" font-size="64" text-anchor="middle" fill="${textStyle}">${icon}</text>
    <text x="150" y="230" font-family="sans-serif" font-size="28" font-weight="bold" text-anchor="middle" fill="${textStyle}">${initials}</text>
  </svg>`;
  return 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svg)));
}

// Seed Initial Data if localStorage keys do not exist
function seedIfEmpty() {
  try {
    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
      const initialUsers = [
        { id: 'usr_1', name: 'Rajesh Advani', phone: '9000000001', city: 'Mumbai', relation: 'self', status: 'pending', rejectReason: '', createdAt: new Date(Date.now() - 86400000 * 1).toISOString() },
        { id: 'usr_2', name: 'Sunita Chandiramani', phone: '9000000002', city: 'Delhi', relation: 'parent', status: 'pending', rejectReason: '', createdAt: new Date(Date.now() - 86400000 * 2).toISOString() },
        { id: 'usr_3', name: 'Amit Bhojwani', phone: '9000000003', city: 'Pune', relation: 'self', status: 'pending', rejectReason: '', createdAt: new Date(Date.now() - 86400000 * 3).toISOString() },
        { id: 'usr_4', name: 'Pooja Mirchandani', phone: '9000000004', city: 'Bengaluru', relation: 'sibling', status: 'pending', rejectReason: '', createdAt: new Date(Date.now() - 86400000 * 4).toISOString() },
        { id: 'usr_5', name: 'Haresh Daryani', phone: '9000000005', city: 'Hyderabad', relation: 'relative', status: 'approved', rejectReason: '', createdAt: new Date(Date.now() - 86400000 * 10).toISOString() },
        { id: 'usr_6', name: 'Meena Kriplani', phone: '9000000006', city: 'Ahmedabad', relation: 'parent', status: 'approved', rejectReason: '', createdAt: new Date(Date.now() - 86400000 * 12).toISOString() },
        { id: 'usr_7', name: 'Vikram Thadani', phone: '9000000007', city: 'Jaipur', relation: 'self', status: 'approved', rejectReason: '', createdAt: new Date(Date.now() - 86400000 * 15).toISOString() },
        { id: 'usr_8', name: 'Kavita Ramchandani', phone: '9000000008', city: 'Nagpur', relation: 'parent', status: 'approved', rejectReason: '', createdAt: new Date(Date.now() - 86400000 * 18).toISOString() },
        { id: 'usr_9', name: 'Rohan Hotchandani', phone: '9000000009', city: 'Nashik', relation: 'self', status: 'rejected', rejectReason: 'Incomplete contact details provided', createdAt: new Date(Date.now() - 86400000 * 20).toISOString() },
        { id: 'usr_10', name: 'Sanjay Jagtiani', phone: '9000000010', city: 'Surat', relation: 'relative', status: 'rejected', rejectReason: 'Outside community verification scope', createdAt: new Date(Date.now() - 86400000 * 22).toISOString() },
        { id: 'usr_11', name: 'Dinesh Gidwani', phone: '9000000011', city: 'Indore', relation: 'parent', status: 'blocked', rejectReason: '', createdAt: new Date(Date.now() - 86400000 * 30).toISOString() },
        { id: 'usr_12', name: 'Neha Tolani', phone: '9000000012', city: 'Lucknow', relation: 'self', status: 'blocked', rejectReason: '', createdAt: new Date(Date.now() - 86400000 * 35).toISOString() }
      ];
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(initialUsers));
    }

    if (!localStorage.getItem(STORAGE_KEYS.PROFILES)) {
      const initialProfiles = [
        {
          id: 'prf_101',
          name: 'Aarav Advani',
          gender: 'male',
          age: 28,
          height: `5'10"`,
          maritalStatus: 'Never Married',
          education: 'M.Tech Software Engineering',
          profession: 'Senior Software Engineer',
          income: '24-30 LPA',
          city: 'Mumbai',
          religionDetails: 'Hindu - Sindhi',
          fatherName: 'Ramesh Advani',
          fatherOccupation: 'Retired Bank Manager',
          motherName: 'Sunita Advani',
          siblings: '1 Sister (Married)',
          familyType: 'Nuclear',
          expectations: 'Looking for an educated, family-oriented partner working in IT/Healthcare.',
          contactNumber: '9876543210',
          photos: [
            generateSvgAvatar('Aarav Advani', 'male', '#7B1E2B'),
            generateSvgAvatar('Aarav Casual', 'male', '#5A1220')
          ],
          biodataFile: { name: 'Aarav_Biodata.pdf', data: 'data:application/pdf;base64,JVBERi0xLjQK' },
          status: 'published',
          createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
          updatedAt: new Date(Date.now() - 86400000 * 2).toISOString()
        },
        {
          id: 'prf_102',
          name: 'Ananya Lalwani',
          gender: 'female',
          age: 26,
          height: `5'5"`,
          maritalStatus: 'Never Married',
          education: 'MBA Finance',
          profession: 'Financial Analyst',
          income: '15-18 LPA',
          city: 'Delhi',
          religionDetails: 'Hindu - Sindhi',
          fatherName: 'Suresh Lalwani',
          fatherOccupation: 'Government Officer',
          motherName: 'Radha Lalwani',
          siblings: '1 Brother (Studying)',
          familyType: 'Joint',
          expectations: 'Well-settled professional with good family values.',
          contactNumber: '9876543211',
          photos: [
            generateSvgAvatar('Ananya Lalwani', 'female', '#C9A24D', '#2E1F1A')
          ],
          biodataFile: null,
          status: 'published',
          createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
          updatedAt: new Date(Date.now() - 86400000 * 3).toISOString()
        },
        {
          id: 'prf_103',
          name: 'Rohan Chandiramani',
          gender: 'male',
          age: 30,
          height: `6'0"`,
          maritalStatus: 'Never Married',
          education: 'MS Data Science',
          profession: 'Data Architect',
          income: '35+ LPA',
          city: 'Bengaluru',
          religionDetails: 'Hindu - Sindhi',
          fatherName: 'Subramanian Chandiramani',
          fatherOccupation: 'Professor',
          motherName: 'Lakshmi Chandiramani',
          siblings: 'None',
          familyType: 'Nuclear',
          expectations: 'Independent and caring individual living in Bengaluru/Abroad.',
          contactNumber: '9876543212',
          photos: [
            generateSvgAvatar('Rohan Chandiramani', 'male', '#2E7D4F')
          ],
          biodataFile: null,
          status: 'published',
          createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
          updatedAt: new Date(Date.now() - 86400000 * 5).toISOString()
        },
        {
          id: 'prf_104',
          name: 'Priya Mirchandani',
          gender: 'female',
          age: 27,
          height: `5'4"`,
          maritalStatus: 'Never Married',
          education: 'B.Arch Architecture',
          profession: 'Architect',
          income: '12-15 LPA',
          city: 'Pune',
          religionDetails: 'Hindu - Sindhi',
          fatherName: 'Anant Mirchandani',
          fatherOccupation: 'Civil Engineer',
          motherName: 'Aarti Mirchandani',
          siblings: '1 Sister (Unmarried)',
          familyType: 'Nuclear',
          expectations: 'Creative, open-minded professional in Maharashtra.',
          contactNumber: '9876543213',
          photos: [
            generateSvgAvatar('Priya Mirchandani', 'female', '#7B1E2B')
          ],
          biodataFile: null,
          status: 'published',
          createdAt: new Date(Date.now() - 86400000 * 6).toISOString(),
          updatedAt: new Date(Date.now() - 86400000 * 6).toISOString()
        },
        {
          id: 'prf_105',
          name: 'Aditya Bhojwani',
          gender: 'male',
          age: 29,
          height: `5'11"`,
          maritalStatus: 'Never Married',
          education: 'CA (Chartered Accountant)',
          profession: 'Senior Audit Manager',
          income: '25-30 LPA',
          city: 'Ahmedabad',
          religionDetails: 'Hindu - Sindhi',
          fatherName: 'Mahesh Bhojwani',
          fatherOccupation: 'Business Owner',
          motherName: 'Rekha Bhojwani',
          siblings: '1 Brother (Married)',
          familyType: 'Joint',
          expectations: 'Educated partner with traditional yet modern outlook.',
          contactNumber: '9876543214',
          photos: [
            generateSvgAvatar('Aditya Bhojwani', 'male', '#1976D2')
          ],
          biodataFile: null,
          status: 'published',
          createdAt: new Date(Date.now() - 86400000 * 8).toISOString(),
          updatedAt: new Date(Date.now() - 86400000 * 8).toISOString()
        },
        {
          id: 'prf_106',
          name: 'Sneha Melwani',
          gender: 'female',
          age: 25,
          height: `5'3"`,
          maritalStatus: 'Never Married',
          education: 'MBBS Doctor',
          profession: 'Resident Doctor',
          income: '15-20 LPA',
          city: 'Surat',
          religionDetails: 'Hindu - Sindhi',
          fatherName: 'Jitin Melwani',
          fatherOccupation: 'Doctor',
          motherName: 'Nisha Melwani',
          siblings: 'None',
          familyType: 'Nuclear',
          expectations: 'Medical professional or well-educated engineer/CA.',
          contactNumber: '9876543215',
          photos: [
            generateSvgAvatar('Sneha Melwani', 'female', '#B7791F')
          ],
          biodataFile: null,
          status: 'published',
          createdAt: new Date(Date.now() - 86400000 * 9).toISOString(),
          updatedAt: new Date(Date.now() - 86400000 * 9).toISOString()
        },
        {
          id: 'prf_107',
          name: 'Vikram Daryani',
          gender: 'male',
          age: 31,
          height: `6'1"`,
          maritalStatus: 'Never Married',
          education: 'B.Tech IIT Bombay',
          profession: 'Product Manager',
          income: '40+ LPA',
          city: 'Hyderabad',
          religionDetails: 'Hindu - Sindhi',
          fatherName: 'Prakash Daryani',
          fatherOccupation: 'Advocate',
          motherName: 'Shobha Daryani',
          siblings: '1 Sister (Married)',
          familyType: 'Nuclear',
          expectations: 'Career-oriented, cultured partner.',
          contactNumber: '9876543216',
          photos: [
            generateSvgAvatar('Vikram', 'male', '#5A1220')
          ],
          biodataFile: null,
          status: 'published',
          createdAt: new Date(Date.now() - 86400000 * 11).toISOString(),
          updatedAt: new Date(Date.now() - 86400000 * 11).toISOString()
        },
        {
          id: 'prf_108',
          name: 'Divya Kriplani',
          gender: 'female',
          age: 28,
          height: `5'6"`,
          maritalStatus: 'Never Married',
          education: 'M.Sc Biotechnology',
          profession: 'Research Scientist',
          income: '14-16 LPA',
          city: 'Nagpur',
          religionDetails: 'Hindu - Sindhi',
          fatherName: 'Vijay Kriplani',
          fatherOccupation: 'Bank Officer',
          motherName: 'Usha Kriplani',
          siblings: '1 Brother (Unmarried)',
          familyType: 'Nuclear',
          expectations: 'Respectful, educated groom from metro cities.',
          contactNumber: '9876543217',
          photos: [
            generateSvgAvatar('Divya Kriplani', 'female', '#7B1E2B')
          ],
          biodataFile: null,
          status: 'published',
          createdAt: new Date(Date.now() - 86400000 * 13).toISOString(),
          updatedAt: new Date(Date.now() - 86400000 * 13).toISOString()
        },
        {
          id: 'prf_109',
          name: 'Karan Thadani',
          gender: 'male',
          age: 27,
          height: `5'9"`,
          maritalStatus: 'Never Married',
          education: 'B.E Computer Science',
          profession: 'DevOps Engineer',
          income: '18-22 LPA',
          city: 'Indore',
          religionDetails: 'Hindu - Sindhi',
          fatherName: 'Gopal Thadani',
          fatherOccupation: 'Government Servant',
          motherName: 'Anita Thadani',
          siblings: '1 Brother',
          familyType: 'Joint',
          expectations: 'Family loving partner willing to relocate if needed.',
          contactNumber: '9876543218',
          photos: [
            generateSvgAvatar('Karan Thadani', 'male', '#C9A24D', '#2E1F1A')
          ],
          biodataFile: null,
          status: 'published',
          createdAt: new Date(Date.now() - 86400000 * 14).toISOString(),
          updatedAt: new Date(Date.now() - 86400000 * 14).toISOString()
        },
        {
          id: 'prf_110',
          name: 'Pooja Ramchandani',
          gender: 'female',
          age: 29,
          height: `5'4"`,
          maritalStatus: 'Never Married',
          education: 'LL.M Corporate Law',
          profession: 'Legal Counsel',
          income: '20-25 LPA',
          city: 'Mumbai',
          religionDetails: 'Hindu - Sindhi',
          fatherName: 'Rajendra Ramchandani',
          fatherOccupation: 'Industrialist',
          motherName: 'Kiran Ramchandani',
          siblings: '1 Sister',
          familyType: 'Nuclear',
          expectations: 'Groom based in Mumbai with strong professional background.',
          contactNumber: '9876543219',
          photos: [
            generateSvgAvatar('Pooja Ramchandani', 'female', '#2E7D4F')
          ],
          biodataFile: null,
          status: 'published',
          createdAt: new Date(Date.now() - 86400000 * 16).toISOString(),
          updatedAt: new Date(Date.now() - 86400000 * 16).toISOString()
        },
        {
          id: 'prf_111',
          name: 'Siddharth Hotchandani',
          gender: 'male',
          age: 32,
          height: `5'11"`,
          maritalStatus: 'Divorced',
          education: 'MBA Marketing',
          profession: 'Marketing Director',
          income: '30-35 LPA',
          city: 'Delhi',
          religionDetails: 'Hindu - Sindhi',
          fatherName: 'Harish Hotchandani',
          fatherOccupation: 'Retired IAS',
          motherName: 'Saroj Hotchandani',
          siblings: '1 Sister (Married)',
          familyType: 'Nuclear',
          expectations: 'Understanding and mature life partner.',
          contactNumber: '9876543220',
          photos: [
            generateSvgAvatar('Siddharth Hotchandani', 'male', '#1976D2')
          ],
          biodataFile: null,
          status: 'published',
          createdAt: new Date(Date.now() - 86400000 * 18).toISOString(),
          updatedAt: new Date(Date.now() - 86400000 * 18).toISOString()
        },
        {
          id: 'prf_112',
          name: 'Meenal Jagtiani',
          gender: 'female',
          age: 30,
          height: `5'5"`,
          maritalStatus: 'Never Married',
          education: 'Ph.D Physics',
          profession: 'Assistant Professor',
          income: '12-14 LPA',
          city: 'Jaipur',
          religionDetails: 'Hindu - Sindhi',
          fatherName: 'Vinod Jagtiani',
          fatherOccupation: 'Principal',
          motherName: 'Manju Jagtiani',
          siblings: '1 Brother',
          familyType: 'Joint',
          expectations: 'Academician or IT professional with intellectual interests.',
          contactNumber: '9876543221',
          photos: [
            generateSvgAvatar('Meenal Jagtiani', 'female', '#5A1220')
          ],
          biodataFile: null,
          status: 'published',
          createdAt: new Date(Date.now() - 86400000 * 20).toISOString(),
          updatedAt: new Date(Date.now() - 86400000 * 20).toISOString()
        },
        {
          id: 'prf_113',
          name: 'Varun Gidwani',
          gender: 'male',
          age: 26,
          height: `5'8"`,
          maritalStatus: 'Never Married',
          education: 'B.Tech IT',
          profession: 'UI/UX Designer',
          income: '14-16 LPA',
          city: 'Pune',
          religionDetails: 'Hindu - Sindhi',
          fatherName: 'Pradeep Gidwani',
          fatherOccupation: 'Architect',
          motherName: 'Suman Gidwani',
          siblings: 'None',
          familyType: 'Nuclear',
          expectations: 'Creative, cheerful person living in Maharashtra.',
          contactNumber: '9876543222',
          photos: [
            generateSvgAvatar('Varun Gidwani', 'male', '#7B1E2B')
          ],
          biodataFile: null,
          status: 'hidden',
          createdAt: new Date(Date.now() - 86400000 * 22).toISOString(),
          updatedAt: new Date(Date.now() - 86400000 * 2).toISOString()
        },
        {
          id: 'prf_114',
          name: 'Ritu Tolani',
          gender: 'female',
          age: 27,
          height: `5'4"`,
          maritalStatus: 'Never Married',
          education: 'M.Com Finance',
          profession: 'Accountant',
          income: '8-10 LPA',
          city: 'Nashik',
          religionDetails: 'Hindu - Sindhi',
          fatherName: 'Bhaskar Tolani',
          fatherOccupation: 'Businessman',
          motherName: 'Lata Tolani',
          siblings: '1 Sister',
          familyType: 'Joint',
          expectations: 'Family oriented groom from Maharashtra.',
          contactNumber: '9876543223',
          photos: [
            generateSvgAvatar('Ritu Tolani', 'female', '#B7791F')
          ],
          biodataFile: null,
          status: 'hidden',
          createdAt: new Date(Date.now() - 86400000 * 25).toISOString(),
          updatedAt: new Date(Date.now() - 86400000 * 4).toISOString()
        },
        {
          id: 'prf_115',
          name: 'Gaurav Nankani',
          gender: 'male',
          age: 29,
          height: `5'10"`,
          maritalStatus: 'Never Married',
          education: 'MS Mechanical Engineering',
          profession: 'Automotive Design Engineer',
          income: '22-26 LPA',
          city: 'Bengaluru',
          religionDetails: 'Hindu - Sindhi',
          fatherName: 'Nitin Nankani',
          fatherOccupation: 'Engineer',
          motherName: 'Nalini Nankani',
          siblings: '1 Sister (Married)',
          familyType: 'Nuclear',
          expectations: 'Draft profile - details being updated.',
          contactNumber: '9876543224',
          photos: [
            generateSvgAvatar('Gaurav Nankani', 'male', '#1976D2')
          ],
          biodataFile: null,
          status: 'draft',
          createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
          updatedAt: new Date(Date.now() - 86400000 * 1).toISOString()
        }
      ];
      localStorage.setItem(STORAGE_KEYS.PROFILES, JSON.stringify(initialProfiles));
    }

    if (!localStorage.getItem(STORAGE_KEYS.ACTIVITY)) {
      const initialActivity = [
        { id: 'act_1', action: 'approved', target: 'User: Haresh Daryani', time: new Date(Date.now() - 3600000 * 4).toISOString() },
        { id: 'act_2', action: 'profile added', target: 'Profile: Aarav Advani', time: new Date(Date.now() - 3600000 * 8).toISOString() },
        { id: 'act_3', action: 'approved', target: 'User: Meena Kriplani', time: new Date(Date.now() - 3600000 * 18).toISOString() },
        { id: 'act_4', action: 'rejected', target: 'User: Rohan Hotchandani', time: new Date(Date.now() - 3600000 * 26).toISOString() },
        { id: 'act_5', action: 'hidden', target: 'Profile: Varun Gidwani (Marriage fixed)', time: new Date(Date.now() - 3600000 * 40).toISOString() },
        { id: 'act_6', action: 'blocked', target: 'User: Dinesh Gidwani', time: new Date(Date.now() - 3600000 * 50).toISOString() },
        { id: 'act_7', action: 'profile added', target: 'Profile: Ananya Lalwani', time: new Date(Date.now() - 3600000 * 60).toISOString() },
        { id: 'act_8', action: 'approved', target: 'User: Vikram Thadani', time: new Date(Date.now() - 3600000 * 72).toISOString() }
      ];
      localStorage.setItem(STORAGE_KEYS.ACTIVITY, JSON.stringify(initialActivity));
    }
  } catch (err) {
    console.error('Failed to seed localStorage:', err);
  }
}

// Safely Parse JSON from LocalStorage
function safeGetItem(key, fallback = []) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (err) {
    console.error(`Error reading ${key} from localStorage:`, err);
    return fallback;
  }
}

// Safely Save JSON to LocalStorage
function safeSetItem(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (err) {
    console.error(`Error saving ${key} to localStorage:`, err);
    if (typeof showToast === 'function') {
      showToast('Browser storage full or blocked. Could not save changes.', 'error');
    } else {
      alert('Browser storage full or blocked. Could not save changes.');
    }
    return false;
  }
}

// ==========================================
// STORE API FUNCTIONS
// ==========================================

// USERS
function getUsers() {
  seedIfEmpty();
  return safeGetItem(STORAGE_KEYS.USERS, []);
}

function saveUser(user) {
  const users = getUsers();
  const existingIdx = users.findIndex(u => u.id === user.id);
  if (existingIdx >= 0) {
    users[existingIdx] = { ...users[existingIdx], ...user };
  } else {
    if (!user.id) user.id = 'usr_' + Date.now();
    if (!user.createdAt) user.createdAt = new Date().toISOString();
    users.unshift(user);
  }
  return safeSetItem(STORAGE_KEYS.USERS, users);
}

function deleteUser(id) {
  const users = getUsers().filter(u => u.id !== id);
  return safeSetItem(STORAGE_KEYS.USERS, users);
}

// PROFILES
function getProfiles() {
  seedIfEmpty();
  return safeGetItem(STORAGE_KEYS.PROFILES, []);
}

function getProfileById(id) {
  const profiles = getProfiles();
  return profiles.find(p => p.id === id) || null;
}

function saveProfile(profile) {
  const profiles = getProfiles();
  const existingIdx = profiles.findIndex(p => p.id === profile.id);
  const now = new Date().toISOString();

  if (existingIdx >= 0) {
    profile.updatedAt = now;
    profiles[existingIdx] = { ...profiles[existingIdx], ...profile };
  } else {
    if (!profile.id) profile.id = 'prf_' + Date.now();
    profile.createdAt = now;
    profile.updatedAt = now;
    profiles.unshift(profile);
  }
  return safeSetItem(STORAGE_KEYS.PROFILES, profiles);
}

function deleteProfile(id) {
  const profiles = getProfiles().filter(p => p.id !== id);
  return safeSetItem(STORAGE_KEYS.PROFILES, profiles);
}

// SESSION
function getSession() {
  try {
    const sess = localStorage.getItem(STORAGE_KEYS.SESSION);
    return sess ? JSON.parse(sess) : null;
  } catch (err) {
    return null;
  }
}

function setSession(sessionData) {
  return safeSetItem(STORAGE_KEYS.SESSION, sessionData);
}

function clearSession() {
  try {
    localStorage.removeItem(STORAGE_KEYS.SESSION);
  } catch (err) {
    console.error('Error clearing session:', err);
  }
}

// ACTIVITY LOGS
function getActivity() {
  seedIfEmpty();
  return safeGetItem(STORAGE_KEYS.ACTIVITY, []);
}

function logActivity(action, target) {
  const activities = getActivity();
  const newEntry = {
    id: 'act_' + Date.now(),
    action,
    target,
    time: new Date().toISOString()
  };
  activities.unshift(newEntry);
  // Keep last 50 activities
  if (activities.length > 50) activities.pop();
  safeSetItem(STORAGE_KEYS.ACTIVITY, activities);
}

// RESET DEMO DATA
function resetDemoData() {
  try {
    localStorage.removeItem(STORAGE_KEYS.USERS);
    localStorage.removeItem(STORAGE_KEYS.PROFILES);
    localStorage.removeItem(STORAGE_KEYS.ACTIVITY);
    seedIfEmpty();
    return true;
  } catch (err) {
    console.error('Failed to reset demo data:', err);
    return false;
  }
}

// Execute initial seed check on script load
seedIfEmpty();
