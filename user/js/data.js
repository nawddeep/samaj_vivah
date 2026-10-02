/* data.js: ALL fake data for the demo. Nobody here is a real person. Photos are drawn with inline SVG. */

var APP_NAME = 'Samaj Vivah';
var TAGLINE = 'Find your life partner in the Sindhi community';
var SUPPORT_NUMBER = '90000 99999';
var DEMO_OTP = '1234';
var REJECTION_REASON = 'Photo is not clear, please upload a clear face photo.';

/* ---------- Small formatting helpers ---------- */

function fmtHeight(totalInches) {
  return Math.floor(totalInches / 12) + ' ft ' + (totalInches % 12) + ' in';
}

function cmFromInches(totalInches) {
  return Math.round(totalInches * 2.54);
}

function fmtPhone(number) {
  return number.slice(0, 5) + ' ' + number.slice(5);
}

var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function calcAge(day, monthName, year) {
  var month = MONTHS.indexOf(monthName);
  if (!day || month < 0 || !year) return null;
  var today = new Date();
  var age = today.getFullYear() - Number(year);
  var hadBirthday = today.getMonth() > month || (today.getMonth() === month && today.getDate() >= Number(day));
  return hadBirthday ? age : age - 1;
}

/* ---------- Option lists used by the questions and filters ---------- */

var OPTIONS = {
  profileFor: [
    { value: 'Myself', gender: '' }, { value: 'Son', gender: 'male' }, { value: 'Daughter', gender: 'female' },
    { value: 'Brother', gender: 'male' }, { value: 'Sister', gender: 'female' }, { value: 'Relative', gender: '' },
    { value: 'Friend', gender: '' }
  ],
  maritalStatus: ['Never Married', 'Divorced', 'Widowed', 'Awaiting Divorce', 'Annulled'],
  religions: ['Hindu', 'Sikh'],
  languages: ['Sindhi', 'Hindi', 'Gujarati', 'Marathi', 'Punjabi', 'English'],
  countries: ['India', 'United States', 'United Kingdom', 'Canada', 'United Arab Emirates', 'Australia', 'Singapore'],
  residency: ['Citizen', 'Permanent resident', 'Work permit', 'Student visa', 'Temporary visa'],
  qualifications: ['High school', 'Diploma', 'B.A.', 'B.Com', 'B.Sc', 'B.Tech', 'B.E.', 'B.Des', 'B.Pharm', 'MBBS', 'CA', 'CS', 'MBA', 'M.Com', 'M.Sc', 'M.Tech', 'M.Ed', 'PhD'],
  fields: ['Computer Science', 'Mechanical Engineering', 'Civil Engineering', 'Commerce', 'Management', 'Medicine', 'Design', 'Education', 'Science', 'Arts', 'Finance', 'Law'],
  employment: ['Private', 'Government', 'Business', 'Self-employed', 'Student', 'Not working'],
  professions: ['Software Engineer', 'Doctor', 'Chartered Accountant', 'School Teacher', 'College Lecturer', 'Business Owner', 'Government Officer', 'Designer', 'Bank Manager', 'Civil Engineer', 'Marketing Manager', 'Project Manager', 'Accounts Executive', 'Lawyer', 'Architect', 'Student'],
  incomes: ['Below 3 LPA', '3-5 LPA', '5-8 LPA', '8-12 LPA', '12-18 LPA', '18-25 LPA', '25-35 LPA', 'Above 35 LPA'],
  diets: ['Vegetarian', 'Non-vegetarian', 'Eggetarian'],
  habits: ['No', 'Occasionally', 'Yes'],
  hobbies: ['Reading', 'Travelling', 'Cooking', 'Music', 'Dancing', 'Yoga', 'Cricket', 'Photography', 'Movies', 'Gardening', 'Painting', 'Fitness', 'Trekking', 'Volunteering'],
  manglik: ['Yes', 'No', 'Anshik', 'Don\'t know'],
  rashi: ['Mesh (Aries)', 'Vrishabh (Taurus)', 'Mithun (Gemini)', 'Kark (Cancer)', 'Singh (Leo)', 'Kanya (Virgo)', 'Tula (Libra)', 'Vrishchik (Scorpio)', 'Dhanu (Sagittarius)', 'Makar (Capricorn)', 'Kumbh (Aquarius)', 'Meen (Pisces)'],
  nakshatra: ['Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra', 'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni', 'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha', 'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishta', 'Shatabhisha', 'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati'],
  fatherOcc: ['Business', 'Government service', 'Private service', 'Professional', 'Farmer', 'Retired', 'Not alive'],
  motherOcc: ['Homemaker', 'Teacher', 'Business', 'Government service', 'Private service', 'Retired', 'Not alive'],
  familyTypes: ['Nuclear', 'Joint'],
  familyValues: ['Traditional', 'Moderate', 'Liberal'],
  familyIncomes: ['Below 5 LPA', '5-10 LPA', '10-20 LPA', '20-40 LPA', 'Above 40 LPA'],
  photoPrivacy: [
    { value: 'all', label: 'Visible to all members', sub: 'Every member of the Sindhi community can see my photos.' },
    { value: 'approved', label: 'Only approved members', sub: 'Only members with an approved profile can see my photos.' },
    { value: 'interest', label: 'Only after I accept interest', sub: 'Photos stay hidden until I accept an interest.' }
  ],
  idTypes: ['Aadhaar', 'PAN', 'Driving licence'],
  sampleFiles: ['My_Biodata.pdf', 'Biodata_scan_page1.jpg', 'Family_biodata_2026.pdf'],
  sampleIdFiles: ['aadhaar_front.jpg', 'pan_card.jpg', 'driving_licence.pdf'],
  sampleKundali: ['kundali_rahul.pdf', 'janam_patri.jpg']
};

var LOCATIONS = {
  'India': {
    'Maharashtra': ['Mumbai', 'Ulhasnagar', 'Pune', 'Nagpur', 'Nashik'],
    'Rajasthan': ['Jaipur', 'Ajmer', 'Jodhpur', 'Udaipur', 'Kota'],
    'Gujarat': ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot'],
    'Madhya Pradesh': ['Indore', 'Bhopal', 'Gwalior', 'Jabalpur'],
    'Delhi NCR': ['New Delhi', 'Gurugram', 'Noida'],
    'Karnataka': ['Bengaluru', 'Mysuru'],
    'Telangana': ['Hyderabad'],
    'Tamil Nadu': ['Chennai', 'Coimbatore'],
    'West Bengal': ['Kolkata'],
    'Uttar Pradesh': ['Lucknow', 'Kanpur', 'Agra'],
    'Punjab and Chandigarh': ['Chandigarh', 'Ludhiana']
  },
  'United States': { 'California': ['San Jose', 'Los Angeles'], 'Texas': ['Dallas', 'Austin'], 'New Jersey': ['Edison'] },
  'United Kingdom': { 'England': ['London', 'Leicester'] },
  'Canada': { 'Ontario': ['Toronto'] },
  'United Arab Emirates': { 'Dubai': ['Dubai'], 'Abu Dhabi': ['Abu Dhabi'] },
  'Australia': { 'Victoria': ['Melbourne'], 'New South Wales': ['Sydney'] },
  'Singapore': { 'Singapore': ['Singapore'] }
};

function statesOf(country) {
  return Object.keys(LOCATIONS[country] || {});
}

function citiesOf(country, state) {
  return (LOCATIONS[country] && LOCATIONS[country][state]) || [];
}

function stateOfCity(city) {
  var india = LOCATIONS.India;
  var names = Object.keys(india);
  for (var i = 0; i < names.length; i++) {
    if (india[names[i]].indexOf(city) !== -1) return names[i];
  }
  return '';
}

function allCities() {
  var list = [];
  Object.keys(LOCATIONS.India).forEach(function (s) { list = list.concat(LOCATIONS.India[s]); });
  return list.sort();
}

/* ---------- Illustrated avatars (inline SVG, no real people) ---------- */

var SKINS = ['#F3D2B3', '#E5B48A', '#CC8F63', '#A9704A', '#85502F'];
var HAIR_COLORS = ['#1B1210', '#2C1B14', '#4A2E1C', '#6B4A2B', '#8A8A8A'];
var BACKGROUNDS = [
  ['#F8E6D6', '#EDBFA5'], ['#DDE9F4', '#9FBEDB'], ['#E5F1DD', '#A9D1A2'],
  ['#F4DFEB', '#DBA7C5'], ['#FBF0CE', '#EBC875'], ['#E3DEF4', '#B4A8DC']
];
var CLOTHES = ['#7B1E2B', '#2F5D7C', '#3F7A55', '#B7791F', '#5B3F8C', '#2E3A59', '#A63D58'];

// o: gender, skin, hair (style), hairColor, bg, cloth, beard, glasses, scale
function makeAvatar(o) {
  var female = o.gender === 'female';
  var skin = o.skin || SKINS[1];
  var hairC = o.hairColor || HAIR_COLORS[0];
  var cloth = o.cloth || CLOTHES[0];
  var bg = o.bg || BACKGROUNDS[0];
  var style = o.hair || (female ? 'long' : 'short');
  var s = o.scale || 1;
  var p = [];

  p.push('<defs><linearGradient id="b" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="' + bg[0] + '"/><stop offset="1" stop-color="' + bg[1] + '"/></linearGradient></defs>');
  p.push('<rect width="600" height="750" fill="url(#b)"/>');
  p.push('<circle cx="110" cy="130" r="90" fill="rgba(255,255,255,0.28)"/><circle cx="520" cy="610" r="140" fill="rgba(255,255,255,0.2)"/>');
  p.push('<g transform="translate(300 750) scale(' + s + ') translate(-300 -750)">');

  // hair behind the head
  if (style === 'long' || style === 'braid') p.push('<path d="M168 330C158 120 442 120 432 330L460 620L140 620Z" fill="' + hairC + '"/>');
  if (style === 'bob') p.push('<path d="M172 335C160 130 440 130 428 335L436 455Q300 490 164 455Z" fill="' + hairC + '"/>');
  if (style === 'bun') p.push('<circle cx="300" cy="150" r="52" fill="' + hairC + '"/>');

  // shoulders and clothing
  p.push('<path d="M40 750C40 610 170 560 300 560C430 560 560 610 560 750Z" fill="' + cloth + '"/>');
  if (female) {
    p.push('<path d="M120 750C140 650 230 598 330 600" stroke="#C9A24D" stroke-width="10" fill="none" stroke-linecap="round"/>');
    p.push('<path d="M236 592Q300 650 364 592" stroke="#C9A24D" stroke-width="7" fill="none" stroke-linecap="round"/>');
  } else {
    p.push('<path d="M246 566L300 640L354 566L336 556L300 600L264 556Z" fill="rgba(255,255,255,0.85)"/>');
  }

  // neck, ears, head
  p.push('<rect x="260" y="440" width="80" height="150" rx="34" fill="' + skin + '"/><ellipse cx="300" cy="466" rx="64" ry="24" fill="rgba(0,0,0,0.13)"/>');
  p.push('<ellipse cx="193" cy="345" rx="17" ry="28" fill="' + skin + '"/><ellipse cx="407" cy="345" rx="17" ry="28" fill="' + skin + '"/>');
  p.push('<ellipse cx="300" cy="335" rx="106" ry="130" fill="' + skin + '"/>');

  // beard before the face details
  if (o.beard === 'full') p.push('<path d="M196 350C196 480 404 480 404 350C388 420 212 420 196 350Z" fill="' + hairC + '" opacity="0.95"/><path d="M262 418Q300 400 338 418Q300 432 262 418Z" fill="' + hairC + '"/>');
  if (o.beard === 'stubble') p.push('<path d="M200 360C204 470 396 470 400 360C384 430 216 430 200 360Z" fill="' + hairC + '" opacity="0.28"/>');

  // front hair
  if (style === 'long' || style === 'bob' || style === 'bun' || style === 'braid') {
    p.push('<path d="M186 322C190 150 410 150 414 322C396 256 346 226 300 226C254 226 204 256 186 322Z" fill="' + hairC + '"/>');
  }
  if (style === 'braid') p.push('<path d="M424 430C456 510 446 590 434 650" stroke="' + hairC + '" stroke-width="34" fill="none" stroke-linecap="round"/>');
  if (style === 'short') p.push('<path d="M192 306C184 150 416 150 408 306C398 252 352 214 300 214C248 214 202 252 192 306Z" fill="' + hairC + '"/>');
  if (style === 'side') p.push('<path d="M190 312C176 140 424 130 410 308C396 246 330 212 252 232C214 242 198 272 190 312Z" fill="' + hairC + '"/>');
  if (style === 'curly') {
    [[228, 238, 46], [286, 208, 52], [346, 218, 48], [388, 258, 40], [206, 290, 34], [406, 296, 32]].forEach(function (c) {
      p.push('<circle cx="' + c[0] + '" cy="' + c[1] + '" r="' + c[2] + '" fill="' + hairC + '"/>');
    });
  }

  // face
  p.push('<ellipse cx="254" cy="338" rx="12" ry="8" fill="#241713"/><ellipse cx="346" cy="338" rx="12" ry="8" fill="#241713"/>');
  p.push('<circle cx="258" cy="335" r="3" fill="#fff"/><circle cx="350" cy="335" r="3" fill="#fff"/>');
  p.push('<path d="M232 308Q254 296 276 306M324 306Q346 296 368 308" stroke="' + hairC + '" stroke-width="7" fill="none" stroke-linecap="round"/>');
  p.push('<path d="M300 346Q288 384 304 394" stroke="rgba(0,0,0,0.18)" stroke-width="5" fill="none" stroke-linecap="round"/>');
  p.push('<path d="M266 414Q300 440 334 414" stroke="#9A4A4A" stroke-width="7" fill="none" stroke-linecap="round"/>');
  p.push('<ellipse cx="226" cy="388" rx="20" ry="11" fill="rgba(214,90,90,0.16)"/><ellipse cx="374" cy="388" rx="20" ry="11" fill="rgba(214,90,90,0.16)"/>');

  if (female) {
    p.push('<circle cx="300" cy="292" r="7" fill="#B3261E"/>');
    p.push('<circle cx="193" cy="384" r="9" fill="#C9A24D"/><circle cx="407" cy="384" r="9" fill="#C9A24D"/>');
  }
  if (o.glasses) p.push('<circle cx="254" cy="338" r="30" fill="none" stroke="#2E1F1A" stroke-width="5"/><circle cx="346" cy="338" r="30" fill="none" stroke="#2E1F1A" stroke-width="5"/><path d="M284 336H316" stroke="#2E1F1A" stroke-width="5"/>');

  p.push('</g>');
  var svg = '<svg xmlns="http://www.w3.org/2000/svg" width="600" height="750" viewBox="0 0 600 750">' + p.join('') + '</svg>';
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
}

// Three photo variations for one person (different background, clothes and framing).
function makePhotoSet(spec, seed) {
  return [0, 1, 2].map(function (variant) {
    return makeAvatar({
      gender: spec.gender, skin: SKINS[spec.skin], hair: spec.hair, hairColor: HAIR_COLORS[spec.hairColor],
      beard: spec.beard, glasses: spec.glasses,
      bg: BACKGROUNDS[(seed + variant * 2) % BACKGROUNDS.length],
      cloth: CLOTHES[(seed + variant * 3) % CLOTHES.length],
      scale: [1, 0.94, 1.07][variant]
    });
  });
}

/* ---------- 20 fake approved profiles (10 women, 10 men) ---------- */

var HOBBY_SETS = [
  ['Cooking', 'Travelling', 'Music'], ['Reading', 'Yoga', 'Gardening'], ['Photography', 'Travelling', 'Movies'],
  ['Cricket', 'Fitness', 'Music'], ['Painting', 'Reading', 'Cooking'], ['Trekking', 'Photography', 'Fitness'],
  ['Dancing', 'Movies', 'Cooking'], ['Volunteering', 'Reading', 'Yoga']
];

var ACTIVE_TEXT = ['Online now', 'Active today', 'Active 2 hours ago', 'Active yesterday', 'Active 3 days ago'];

// name, gender, age, city, education, college, profession, employment, company, income, heightIn, marital,
// religion, community (always Sindhi), motherTongue, diet, avatar { skin, hair, hairColor, beard, glasses }
var PEOPLE = [
  ['Priya Wadhwani', 'female', 26, 'Jaipur', 'MBA', 'IIM Udaipur', 'Marketing Manager', 'Private', 'BrightLeaf Foods', '8-12 LPA', 64, 'Never Married', 'Hindu', 'Sindhi', 'Sindhi', 'Vegetarian', { skin: 1, hair: 'long', hairColor: 1 }],
  ['Ananya Keswani', 'female', 27, 'Ahmedabad', 'M.Sc', 'Gujarat University', 'College Lecturer', 'Private', 'City Arts College', '5-8 LPA', 63, 'Never Married', 'Hindu', 'Sindhi', 'Sindhi', 'Vegetarian', { skin: 2, hair: 'bun', hairColor: 0 }],
  ['Diya Motwani', 'female', 25, 'Mumbai', 'B.Des', 'NID Ahmedabad', 'Designer', 'Private', 'Studio Kalpana', '5-8 LPA', 65, 'Never Married', 'Hindu', 'Sindhi', 'Sindhi', 'Vegetarian', { skin: 0, hair: 'bob', hairColor: 2 }],
  ['Ishita Asrani', 'female', 24, 'New Delhi', 'B.Com', 'Delhi University', 'Accounts Executive', 'Private', 'Nova Traders', '3-5 LPA', 62, 'Never Married', 'Hindu', 'Sindhi', 'Hindi', 'Vegetarian', { skin: 1, hair: 'braid', hairColor: 0 }],
  ['Saanvi Vaswani', 'female', 29, 'Pune', 'MBBS', 'BJ Medical College', 'Doctor', 'Private', 'Sahyadri Hospital', '18-25 LPA', 63, 'Never Married', 'Hindu', 'Sindhi', 'Sindhi', 'Eggetarian', { skin: 2, hair: 'long', hairColor: 1, glasses: true }],
  ['Kavya Sachdev', 'female', 28, 'Indore', 'CA', 'ICAI', 'Chartered Accountant', 'Self-employed', 'Maheshwari and Co.', '12-18 LPA', 64, 'Never Married', 'Hindu', 'Sindhi', 'Sindhi', 'Vegetarian', { skin: 0, hair: 'bob', hairColor: 0 }],
  ['Myra Makhija', 'female', 23, 'Bengaluru', 'B.Tech', 'RV College', 'Software Engineer', 'Private', 'CloudNine Tech', '8-12 LPA', 65, 'Never Married', 'Hindu', 'Sindhi', 'Sindhi', 'Vegetarian', { skin: 1, hair: 'long', hairColor: 2 }],
  ['Tanvi Chhabria', 'female', 31, 'Jaipur', 'M.Ed', 'Rajasthan University', 'School Teacher', 'Government', 'Govt. Girls School', '5-8 LPA', 62, 'Divorced', 'Hindu', 'Sindhi', 'Hindi', 'Vegetarian', { skin: 2, hair: 'bun', hairColor: 1 }],
  ['Riya Khubchandani', 'female', 22, 'Chandigarh', 'B.Des', 'Chitkara University', 'Designer', 'Private', 'Pixel Loom', '3-5 LPA', 64, 'Never Married', 'Hindu', 'Sindhi', 'Sindhi', 'Eggetarian', { skin: 0, hair: 'braid', hairColor: 2 }],
  ['Neha Kewalramani', 'female', 33, 'Hyderabad', 'MBA', 'ISB Hyderabad', 'Bank Manager', 'Private', 'Deccan Bank', '18-25 LPA', 63, 'Divorced', 'Hindu', 'Sindhi', 'Sindhi', 'Vegetarian', { skin: 1, hair: 'bob', hairColor: 4, glasses: true }],
  ['Aarav Israni', 'male', 29, 'Pune', 'B.Tech', 'COEP Pune', 'Software Engineer', 'Private', 'Infrabyte', '12-18 LPA', 70, 'Never Married', 'Hindu', 'Sindhi', 'Sindhi', 'Vegetarian', { skin: 1, hair: 'short', hairColor: 0 }],
  ['Kabir Harjani', 'male', 31, 'Indore', 'CA', 'ICAI', 'Chartered Accountant', 'Self-employed', 'Joshi Associates', '18-25 LPA', 68, 'Never Married', 'Hindu', 'Sindhi', 'Hindi', 'Vegetarian', { skin: 2, hair: 'side', hairColor: 1, glasses: true }],
  ['Vihaan Lakhiani', 'male', 33, 'New Delhi', 'MBBS', 'AIIMS Delhi', 'Doctor', 'Private', 'Capital Care Hospital', '25-35 LPA', 71, 'Divorced', 'Hindu', 'Sindhi', 'Sindhi', 'Non-vegetarian', { skin: 1, hair: 'short', hairColor: 4, beard: 'stubble' }],
  ['Reyansh Balani', 'male', 28, 'Mumbai', 'MBA', 'NMIMS', 'Business Owner', 'Business', 'Bansal Exports', '18-25 LPA', 69, 'Never Married', 'Hindu', 'Sindhi', 'Sindhi', 'Vegetarian', { skin: 0, hair: 'curly', hairColor: 0 }],
  ['Arjun Daswani', 'male', 27, 'Ahmedabad', 'B.E.', 'LD Engineering College', 'Civil Engineer', 'Government', 'State PWD', '8-12 LPA', 67, 'Never Married', 'Hindu', 'Sindhi', 'Sindhi', 'Vegetarian', { skin: 2, hair: 'side', hairColor: 2 }],
  ['Rohan Bhatia', 'male', 35, 'Bengaluru', 'M.Tech', 'IIT Madras', 'Project Manager', 'Private', 'Vertex Systems', '25-35 LPA', 72, 'Divorced', 'Hindu', 'Sindhi', 'Hindi', 'Vegetarian', { skin: 1, hair: 'short', hairColor: 4, beard: 'full', glasses: true }],
  ['Yash Ahuja', 'male', 30, 'Jaipur', 'B.Com', 'Rajasthan University', 'Business Owner', 'Business', 'Kothari Jewels', 'Above 35 LPA', 69, 'Never Married', 'Hindu', 'Sindhi', 'Sindhi', 'Vegetarian', { skin: 0, hair: 'curly', hairColor: 1, beard: 'stubble' }],
  ['Advait Rohra', 'male', 26, 'Nagpur', 'B.Pharm', 'Nagpur University', 'Government Officer', 'Government', 'Health Department', '5-8 LPA', 68, 'Never Married', 'Hindu', 'Sindhi', 'Sindhi', 'Vegetarian', { skin: 3, hair: 'short', hairColor: 0 }],
  ['Dhruv Punjabi', 'male', 36, 'Kolkata', 'MBA', 'XLRI Jamshedpur', 'Bank Manager', 'Private', 'Eastern Bank', '18-25 LPA', 70, 'Widowed', 'Hindu', 'Sindhi', 'Sindhi', 'Vegetarian', { skin: 2, hair: 'side', hairColor: 4, beard: 'full' }],
  ['Karan Nankani', 'male', 24, 'Chennai', 'B.Des', 'SRM University', 'Designer', 'Private', 'Studio Orbit', '5-8 LPA', 69, 'Never Married', 'Hindu', 'Sindhi', 'Hindi', 'Eggetarian', { skin: 3, hair: 'curly', hairColor: 0, glasses: true }]
];

var COMPAT = [94, 91, 88, 86, 84, 92, 82, 79, 77, 74, 90, 87, 83, 89, 81, 76, 85, 78, 73, 80];

function buildProfile(row, i) {
  var spec = row[16];
  spec.gender = row[1];
  var firstName = row[0].split(' ')[0];
  var hobbies = HOBBY_SETS[i % HOBBY_SETS.length];
  var female = row[1] === 'female';
  var state = stateOfCity(row[3]);
  var photos = makePhotoSet(spec, i);
  return {
    id: 'p' + (i + 1),
    profileCode: 'SV' + (100200 + i * 37),
    name: row[0], firstName: firstName, gender: row[1], age: row[2], heightIn: row[10], maritalStatus: row[11],
    religion: row[12], community: 'Sindhi', motherTongue: row[14],
    country: 'India', state: state, city: row[3], residency: 'Citizen', livingWithFamily: i % 3 !== 0,
    education: row[4], college: row[5], fieldOfStudy: OPTIONS.fields[i % OPTIONS.fields.length],
    employment: row[7], profession: row[6], company: row[8], income: row[9],
    diet: row[15], drinking: i % 4 === 0 ? 'Occasionally' : 'No', smoking: 'No', hobbies: hobbies,
    birthTime: (5 + (i % 12)) + ':' + (i % 2 ? '30' : '10') + (i % 2 ? ' AM' : ' PM'),
    birthPlace: row[3], manglik: OPTIONS.manglik[i % 3], rashi: OPTIONS.rashi[i % 12], nakshatra: OPTIONS.nakshatra[(i * 2) % 27],
    fatherOcc: OPTIONS.fatherOcc[i % 4], motherOcc: OPTIONS.motherOcc[i % 3],
    brothers: i % 3, sisters: (i + 1) % 3, familyType: i % 2 ? 'Nuclear' : 'Joint', familyValues: OPTIONS.familyValues[i % 2],
    nativePlace: i % 2 ? row[3] : 'Jaipur',
    about: 'I am a ' + row[6].toLowerCase() + ' living in ' + row[3] + '. I value family, honesty and a simple life. In my free time I enjoy ' +
      hobbies[0].toLowerCase() + ' and ' + hobbies[1].toLowerCase() + '. I am looking for a kind and understanding partner to build a happy home together.',
    partnerPrefs: {
      ageMin: female ? row[2] : Math.max(22, row[2] - 5), ageMax: female ? row[2] + 6 : row[2] + 2,
      heightMin: female ? 64 : 58, heightMax: female ? 74 : 68,
      maritalStatus: ['Never Married'], religion: row[12], motherTongue: i % 3 === 0 ? 'Sindhi' : 'Open to all',
      education: ['Graduate or above'], profession: 'Open to all', income: 'Open to all',
      location: 'Open to all', diet: i % 2 ? 'Open to all' : row[15], manglik: 'Open to all'
    },
    contactNumber: '90000' + ('00000' + (i + 1)).slice(-5), // fake, 90000 00001 style
    photos: photos, verified: i % 5 !== 4, lastActive: ACTIVE_TEXT[i % ACTIVE_TEXT.length],
    compat: COMPAT[i], hasBiodata: i % 3 === 0
  };
}

var PROFILES = PEOPLE.map(buildProfile);

/* ---------- The logged-in demo user (also used by the "create from biodata" path) ---------- */

function blankPrefs() {
  return {
    ageMin: 23, ageMax: 28, heightMin: 58, heightMax: 68,
    open: { marital: true, religion: true, education: true, profession: true, income: true, location: true, diet: true, manglik: true },
    marital: [], religion: [], education: [], profession: [], income: [], location: [], diet: [], manglik: []
  };
}

function blankProfile() {
  return {
    profileFor: '', gender: '', firstName: '', lastName: '', dobDay: '', dobMonth: '', dobYear: '', maritalStatus: '', heightIn: 68,
    religion: '', community: 'Sindhi', motherTongue: '',
    country: 'India', state: '', city: '', residency: '', livingWithFamily: '',
    education: '', college: '', fieldOfStudy: '',
    employment: '', profession: '', company: '', income: '',
    diet: '', drinking: '', smoking: '', hobbies: [],
    birthTime: '', birthPlace: '', manglik: '', rashi: '', nakshatra: '', kundali: '',
    fatherOcc: '', motherOcc: '', brothers: 0, sisters: 0, familyType: '', familyValues: '', familyIncome: '', nativePlace: '',
    about: '', prefs: blankPrefs(), photos: [], photoPrivacy: 'approved', biodataFile: '', idType: '', idFile: ''
  };
}

function sampleProfile() {
  var p = blankProfile();
  var set = makePhotoSet({ gender: 'male', skin: 1, hair: 'short', hairColor: 0 }, 3);
  Object.assign(p, {
    profileFor: 'Myself', gender: 'male', firstName: 'Rahul', lastName: 'Lalwani', dobDay: '15', dobMonth: 'March', dobYear: '1998',
    maritalStatus: 'Never Married', heightIn: 69,
    religion: 'Hindu', community: 'Sindhi', motherTongue: 'Sindhi',
    country: 'India', state: 'Maharashtra', city: 'Pune', residency: 'Citizen', livingWithFamily: 'Yes',
    education: 'B.Tech', college: 'COEP Pune', fieldOfStudy: 'Computer Science',
    employment: 'Private', profession: 'Software Engineer', company: 'Infrabyte Technologies', income: '12-18 LPA',
    diet: 'Vegetarian', drinking: 'No', smoking: 'No', hobbies: ['Cricket', 'Travelling', 'Music'],
    birthTime: '6:30 AM', birthPlace: 'Jaipur', manglik: 'No', rashi: 'Mithun (Gemini)', nakshatra: 'Ardra', kundali: 'kundali_rahul.pdf',
    fatherOcc: 'Business', motherOcc: 'Homemaker', brothers: 0, sisters: 1, familyType: 'Nuclear', familyValues: 'Moderate',
    familyIncome: '10-20 LPA', nativePlace: 'Jaipur',
    about: 'I am a software engineer based in Pune. I value family, honesty and a simple life. I enjoy cricket, travelling and music. I am looking for a kind, educated and understanding partner to build a happy home together.',
    photos: [set[0], set[1], set[2]], photoPrivacy: 'approved', biodataFile: 'My_Biodata.pdf', idType: 'Aadhaar', idFile: 'aadhaar_front.jpg'
  });
  p.prefs = {
    ageMin: 23, ageMax: 28, heightMin: 60, heightMax: 68,
    open: { marital: false, religion: false, education: true, profession: true, income: true, location: false, diet: true, manglik: true },
    marital: ['Never Married'], religion: ['Hindu'], education: [], profession: [], income: [], location: ['Pune', 'Mumbai', 'Jaipur'], diet: [], manglik: []
  };
  return p;
}

// Pictures for the "Add from gallery" picker and the selfie camera.
var GALLERY_SAMPLES = (function () {
  var list = [];
  for (var i = 0; i < 12; i++) {
    list.push(makeAvatar({
      gender: 'male', skin: SKINS[1], hair: ['short', 'side', 'curly'][i % 3], hairColor: HAIR_COLORS[0],
      bg: BACKGROUNDS[i % BACKGROUNDS.length], cloth: CLOTHES[(i * 2) % CLOTHES.length], scale: [1, 0.94, 1.07][i % 3]
    }));
  }
  return list;
})();

// Illustrated cards for the gender step and the "profile created for" step.
var GENDER_ART = {
  male: makeAvatar({ gender: 'male', skin: SKINS[1], hair: 'side', hairColor: HAIR_COLORS[0], bg: BACKGROUNDS[1], cloth: CLOTHES[1] }),
  female: makeAvatar({ gender: 'female', skin: SKINS[1], hair: 'long', hairColor: HAIR_COLORS[1], bg: BACKGROUNDS[3], cloth: CLOTHES[0] })
};

var PROFILE_FOR_ART = {
  Myself: makeAvatar({ gender: 'male', skin: SKINS[1], hair: 'short', hairColor: HAIR_COLORS[0], bg: BACKGROUNDS[4], cloth: CLOTHES[0] }),
  Son: makeAvatar({ gender: 'male', skin: SKINS[2], hair: 'curly', hairColor: HAIR_COLORS[0], bg: BACKGROUNDS[1], cloth: CLOTHES[2], scale: 0.92 }),
  Daughter: makeAvatar({ gender: 'female', skin: SKINS[1], hair: 'braid', hairColor: HAIR_COLORS[0], bg: BACKGROUNDS[3], cloth: CLOTHES[6], scale: 0.92 }),
  Brother: makeAvatar({ gender: 'male', skin: SKINS[0], hair: 'side', hairColor: HAIR_COLORS[1], bg: BACKGROUNDS[2], cloth: CLOTHES[5] }),
  Sister: makeAvatar({ gender: 'female', skin: SKINS[2], hair: 'bob', hairColor: HAIR_COLORS[0], bg: BACKGROUNDS[5], cloth: CLOTHES[4] }),
  Relative: makeAvatar({ gender: 'male', skin: SKINS[3], hair: 'short', hairColor: HAIR_COLORS[4], beard: 'full', bg: BACKGROUNDS[0], cloth: CLOTHES[3] }),
  Friend: makeAvatar({ gender: 'female', skin: SKINS[0], hair: 'bun', hairColor: HAIR_COLORS[2], bg: BACKGROUNDS[4], cloth: CLOTHES[2] })
};

/* ---------- Interests, notifications, chats (slot = position in the list of opposite-gender profiles) ---------- */

var INTERESTS = [
  { id: 'i1', slot: 1, dir: 'received', status: 'pending', time: '2 hours ago' },
  { id: 'i2', slot: 2, dir: 'received', status: 'pending', time: 'Yesterday' },
  { id: 'i3', slot: 3, dir: 'received', status: 'pending', time: '2 days ago' },
  { id: 'i4', slot: 4, dir: 'sent', status: 'pending', time: '3 hours ago' },
  { id: 'i5', slot: 5, dir: 'sent', status: 'pending', time: 'Yesterday' },
  { id: 'i6', slot: 0, dir: 'sent', status: 'accepted', time: '2 days ago' },
  { id: 'i7', slot: 6, dir: 'received', status: 'accepted', time: '4 days ago' },
  { id: 'i8', slot: 7, dir: 'sent', status: 'declined', time: 'Last week' }
];

var NOTIFICATIONS = [
  { id: 'n1', slot: 0, text: '{n} accepted your interest', time: '10 minutes ago', read: false, kind: 'interest' },
  { id: 'n2', slot: -1, text: '5 new matches today', time: '1 hour ago', read: false, kind: 'match' },
  { id: 'n3', slot: -1, text: 'Your profile was viewed 12 times', time: '3 hours ago', read: false, kind: 'view' },
  { id: 'n4', slot: 1, text: '{n} sent you an interest', time: 'Yesterday', read: true, kind: 'interest' },
  { id: 'n5', slot: -1, text: 'Profile approved', time: '2 days ago', read: true, kind: 'approved' }
];

var CHATS = [
  { id: 'c1', slot: 0, unread: 2, messages: [
    { from: 'them', text: 'Hello Rahul, thank you for accepting my interest.', time: '10:02 AM' },
    { from: 'me', text: 'Hello! Nice to connect with you.', time: '10:05 AM' },
    { from: 'them', text: 'Could you share a little about your family?', time: '10:08 AM' },
    { from: 'them', text: 'My parents would like to talk to yours.', time: '10:09 AM' }
  ] },
  { id: 'c2', slot: 6, unread: 0, messages: [
    { from: 'me', text: 'Hello, I saw your profile and liked it.', time: 'Yesterday' },
    { from: 'them', text: 'Thank you! Yes, we can talk further.', time: 'Yesterday' }
  ] },
  { id: 'c3', slot: 2, unread: 1, messages: [
    { from: 'them', text: 'Good evening. Are you free for a call this weekend?', time: 'Mon' }
  ] }
];

var QUICK_REPLIES = ['Hello', 'Interested, please share family details', 'Thank you', 'Can we talk this weekend?'];

var STORIES = [
  { id: 's1', names: 'Mohit Lalwani and Shreya Advani', place: 'Jaipur', year: '2025', text: 'We found each other through the Sindhi community and our families connected instantly. We were married within six months.', art: [{ gender: 'male', skin: 1, hair: 'short' }, { gender: 'female', skin: 1, hair: 'long' }] },
  { id: 's2', names: 'Nikhil Mirchandani and Pooja Bhojwani', place: 'Indore', year: '2025', text: 'A simple interest and a few honest conversations. Both families met and everything felt right.', art: [{ gender: 'male', skin: 2, hair: 'side' }, { gender: 'female', skin: 2, hair: 'bun' }] },
  { id: 's3', names: 'Siddharth Daryani and Aisha Kriplani', place: 'Pune', year: '2026', text: 'We were looking for someone who shared our values. Samaj Vivah made it easy and respectful.', art: [{ gender: 'male', skin: 0, hair: 'curly' }, { gender: 'female', skin: 0, hair: 'bob' }] }
].map(function (story, i) {
  story.photos = story.art.map(function (a, j) {
    return makeAvatar({
      gender: a.gender, skin: SKINS[a.skin], hair: a.hair, hairColor: HAIR_COLORS[j],
      bg: BACKGROUNDS[(i * 2 + j) % BACKGROUNDS.length], cloth: CLOTHES[(i + j * 3) % CLOTHES.length]
    });
  });
  return story;
});

var PLANS = [
  { id: 'plan3', months: 3, price: '2,999', perMonth: '1,000', tag: '', features: ['See contact details of 25 profiles', 'Send unlimited interests', 'Chat with accepted members', 'See who viewed your profile'] },
  { id: 'plan6', months: 6, price: '4,999', perMonth: '833', tag: 'Most popular', features: ['See contact details of 60 profiles', 'Send unlimited interests', 'Chat with accepted members', 'See who viewed your profile', 'Profile highlighted in search'] },
  { id: 'plan12', months: 12, price: '7,999', perMonth: '667', tag: 'Best value', features: ['See contact details of 150 profiles', 'Send unlimited interests', 'Chat with accepted members', 'See who viewed your profile', 'Profile highlighted in search', 'Personal matchmaking support'] }
];

var FAQ = [
  { q: 'How long does profile approval take?', a: 'Most profiles are reviewed within 24 hours. You will get a notification as soon as it is approved.' },
  { q: 'Who can see my photos?', a: 'You decide. Open Account, then Photo privacy, and choose who may see your photos.' },
  { q: 'Is my contact number safe?', a: 'Your number is shown only to approved members who confirm they are contacting you for marriage.' },
  { q: 'What documents do I need?', a: 'An ID proof such as Aadhaar, PAN or Driving licence. It is used only for verification and never shown to members.' },
  { q: 'Can I hide my profile for some time?', a: 'Yes. Open Settings and turn on Hide my profile. You can turn it back on at any time.' },
  { q: 'How do I delete my account?', a: 'Open Settings and choose Delete account. You will be asked to confirm before anything is removed.' }
];
