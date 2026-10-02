/*
 * bridge.js: connects the user app to the admin panel through the SAME localStorage keys.
 * It uses the admin's own store.js (loaded first), so there is one data layer and one source of truth:
 *   mm_users      user records. The admin approves, rejects or blocks them; this app only reads the status.
 *   mm_profiles   profiles. Only status "published" is shown to members.
 *   mm_activity   the admin's activity feed. Our actions are logged there too.
 * Keys that only this app adds: mm_user_session, mm_shortlist, mm_contact_views, mm_user_demo_seed.
 */

// store.js calls showToast() when storage is full or blocked.
window.showToast = function (message, type) { UI.toast(message, type === 'error' ? 'error' : 'info'); };

var Bridge = (function () {
  var KEY = { session: 'mm_user_session', shortlist: 'mm_shortlist', views: 'mm_contact_views', seedMark: 'mm_user_demo_seed' };
  var RELATION = { Myself: 'self', Son: 'parent', Daughter: 'parent', Brother: 'sibling', Sister: 'sibling', Relative: 'relative', Friend: 'relative' };
  var FATHERS = ['Ramesh', 'Suresh', 'Mahesh', 'Dinesh', 'Rajesh', 'Mukesh', 'Naresh'];
  var MOTHERS = ['Sunita', 'Kavita', 'Anita', 'Meena', 'Savita', 'Rekha', 'Usha'];
  var FAKE_PDF = 'data:application/pdf;base64,JVBERi0xLjQK';

  /* ---------- Small helpers ---------- */

  function heightText(inches) { return Math.floor(inches / 12) + '\'' + (inches % 12) + '"'; }

  function hashOf(text) {
    var n = 0;
    for (var i = 0; i < text.length; i++) n = (n * 31 + text.charCodeAt(i)) % 1000003;
    return n;
  }

  function findUser(id) {
    var users = getUsers();
    for (var i = 0; i < users.length; i++) if (users[i].id === id) return users[i];
    return null;
  }

  function nowIso() { return new Date().toISOString(); }

  /* ---------- Demo profiles: add the 20 illustrated profiles to the shared store ---------- */

  function demoToStored(rich, i) {
    var surname = rich.name.split(' ')[1] || '';
    var stored = Object.assign({}, rich);
    stored.id = 'prf_d' + (i + 1);
    stored.height = heightText(rich.heightIn);
    stored.religionDetails = rich.religion + ' - Sindhi';
    stored.fatherName = FATHERS[i % FATHERS.length] + ' ' + surname;
    stored.fatherOccupation = rich.fatherOcc;
    stored.motherName = MOTHERS[i % MOTHERS.length] + ' ' + surname;
    stored.siblings = rich.brothers + ' brother(s), ' + rich.sisters + ' sister(s)';
    stored.expectations = 'Looking for a kind, educated and family-oriented partner from the Sindhi community.';
    stored.biodataFile = rich.hasBiodata ? { name: rich.firstName.toLowerCase() + '_biodata.pdf', data: FAKE_PDF } : null;
    stored.status = 'published';
    var created = new Date(Date.now() - 86400000 * (i + 1)).toISOString();
    stored.createdAt = created;
    stored.updatedAt = created;
    stored.demoSource = true;
    return stored;
  }

  // Adds the demo profiles once, and again if the admin used "Reset Demo Data" (that makes new seed dates).
  function seedDemoProfiles() {
    var profiles = getProfiles();
    var anchor = profiles.filter(function (p) { return p.id === 'prf_101'; })[0];
    var mark = (anchor ? anchor.createdAt : 'none') + '|sindhi-v1'; // changes when the demo data changes, so old browsers refresh
    if (safeGetItem(KEY.seedMark, '') === mark && profiles.some(function (p) { return p.demoSource; })) return;
    profiles = profiles.filter(function (p) { return !p.demoSource; });
    PROFILES.forEach(function (rich, i) { profiles.push(demoToStored(rich, i)); });
    safeSetItem('mm_profiles', profiles);
    safeSetItem(KEY.seedMark, mark);
  }

  /* ---------- Reading profiles: admin shape -> the richer shape the screens use ---------- */

  function adapt(p) {
    var name = p.name || 'Member';
    var seed = hashOf(p.id || name);
    var hm = /(\d+)\s*'\s*(\d+)/.exec(p.height || '');
    var brothers = /(\d+)\s*brother/i.exec(p.siblings || '');
    var sisters = /(\d+)\s*sister/i.exec(p.siblings || '');
    var defaults = {
      firstName: name.split(' ')[0],
      heightIn: hm ? Number(hm[1]) * 12 + Number(hm[2]) : 66,
      religion: /sikh/i.test(p.religionDetails || '') ? 'Sikh' : 'Hindu', community: 'Sindhi', motherTongue: 'Sindhi',
      country: 'India', state: stateOfCity(p.city) || '', residency: 'Citizen', livingWithFamily: true,
      college: '', fieldOfStudy: '', employment: 'Private', company: '',
      diet: 'Vegetarian', drinking: 'No', smoking: 'No', hobbies: [],
      birthTime: '', birthPlace: p.city || '', manglik: 'Don\'t know', rashi: '', nakshatra: '',
      fatherOcc: p.fatherOccupation || 'Not shared', motherOcc: 'Homemaker',
      brothers: brothers ? Number(brothers[1]) : 0, sisters: sisters ? Number(sisters[1]) : 0,
      familyValues: 'Moderate', nativePlace: p.city || '',
      about: name.split(' ')[0] + ' is a ' + (p.profession || 'working professional').toLowerCase() + ' based in ' + (p.city || 'India') + '. ' + (p.expectations || ''),
      partnerPrefs: { ageMin: 22, ageMax: 40, heightMin: 48, heightMax: 84, maritalStatus: OPTIONS.maritalStatus.slice(), religion: 'Open to all', motherTongue: 'Open to all', education: ['Graduate or above'], profession: 'Open to all', income: 'Open to all', location: 'Open to all', diet: 'Open to all', manglik: 'Open to all' },
      compat: 70 + (seed % 25), verified: true, lastActive: ACTIVE_TEXT[seed % ACTIVE_TEXT.length],
      profileCode: 'SV' + (100000 + (seed % 900000)), hasBiodata: Boolean(p.biodataFile)
    };
    var out = Object.assign(defaults, p);
    // The admin's built-in sample photos are emoji tiles. Show the illustrated people instead; real uploads pass through.
    var placeholder = !out.photos || !out.photos.length || out.photos.every(function (src) { return /^data:image\/svg\+xml;base64,/.test(src); });
    if (placeholder) {
      var female = out.gender === 'female';
      out.photos = makePhotoSet({
        gender: out.gender === 'female' ? 'female' : 'male', skin: seed % 4,
        hair: female ? ['long', 'bob', 'bun', 'braid'][seed % 4] : ['short', 'side', 'curly'][seed % 3], hairColor: seed % 3
      }, seed);
    }
    return out;
  }

  // Everything members may see: published profiles only. Draft and hidden never leave the admin side.
  // The adapted list is cached until the stored data changes, so the same profile is always the same object.
  var cache = { raw: null, list: [] };

  function publishedProfiles() {
    var raw = null;
    try { raw = window.localStorage.getItem('mm_profiles'); } catch (error) { raw = null; }
    if (raw === null || raw !== cache.raw) {
      cache = { raw: raw, list: getProfiles().filter(function (p) { return p.status === 'published'; }).map(adapt) };
    }
    return cache.list;
  }

  function publishedProfile(id) {
    var list = publishedProfiles();
    for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i];
    return null;
  }

  /* ---------- Writing the member's own profile: onboarding shape -> admin shape ---------- */

  function listOrOpen(prefs, key, allValues) {
    return prefs.open[key] || !prefs[key].length ? allValues : prefs[key].slice();
  }

  function textOrOpen(prefs, key) {
    return prefs.open[key] || !prefs[key].length ? 'Open to all' : prefs[key].join(', ');
  }

  function storedFromOnboarding(p, user, profileId) {
    var prefs = p.prefs;
    var age = calcAge(p.dobDay, p.dobMonth, p.dobYear) || 28;
    return {
      id: profileId, userId: user.id, userSubmitted: true,
      name: (p.firstName + ' ' + p.lastName).trim(), firstName: p.firstName, gender: p.gender, age: age,
      height: heightText(p.heightIn), heightIn: p.heightIn, maritalStatus: p.maritalStatus,
      education: p.education, profession: p.profession, income: p.income || 'Not shared', city: p.city,
      religionDetails: p.religion + ' - Sindhi',
      fatherName: '', fatherOccupation: p.fatherOcc, motherName: '', siblings: p.brothers + ' brother(s), ' + p.sisters + ' sister(s)',
      familyType: p.familyType, expectations: p.about, contactNumber: user.phone,
      photos: p.photos.slice(), biodataFile: p.biodataFile ? { name: p.biodataFile, data: FAKE_PDF } : null,
      status: 'draft',
      religion: p.religion, community: 'Sindhi', motherTongue: p.motherTongue,
      country: p.country, state: p.state, residency: p.residency, livingWithFamily: p.livingWithFamily === 'Yes',
      college: p.college, fieldOfStudy: p.fieldOfStudy, employment: p.employment, company: p.company,
      diet: p.diet, drinking: p.drinking, smoking: p.smoking, hobbies: p.hobbies.slice(),
      birthTime: p.birthTime, birthPlace: p.birthPlace, manglik: p.manglik, rashi: p.rashi, nakshatra: p.nakshatra,
      fatherOcc: p.fatherOcc, motherOcc: p.motherOcc, brothers: p.brothers, sisters: p.sisters,
      familyValues: p.familyValues, nativePlace: p.nativePlace, about: p.about,
      partnerPrefs: {
        ageMin: prefs.ageMin, ageMax: prefs.ageMax, heightMin: prefs.heightMin, heightMax: prefs.heightMax,
        maritalStatus: listOrOpen(prefs, 'marital', OPTIONS.maritalStatus), religion: textOrOpen(prefs, 'religion'), motherTongue: 'Open to all',
        education: prefs.open.education || !prefs.education.length ? ['Graduate or above'] : prefs.education.slice(),
        profession: textOrOpen(prefs, 'profession'), income: textOrOpen(prefs, 'income'), location: textOrOpen(prefs, 'location'),
        diet: textOrOpen(prefs, 'diet'), manglik: textOrOpen(prefs, 'manglik')
      }
    };
  }

  /* ---------- Users and the session ---------- */

  function guessGender(name) {
    // Demo guess for admin-created users who have no gender on record. Real accounts store it.
    var first = (name || '').split(' ')[0].toLowerCase();
    return /(a|i|ee)$/.test(first) && first !== 'rishi' ? 'female' : 'male';
  }

  // Rebuilds the in-memory onboarding profile for a stored user.
  function profileFor(user) {
    var p = blankProfile();
    if (user.profileData) {
      Object.assign(p, user.profileData);
      p.prefs = Object.assign(blankPrefs(), user.profileData.prefs || {});
      var own = user.profileId ? getProfileById(user.profileId) : null;
      p.photos = own && own.photos ? own.photos.slice() : [];
      return p;
    }
    var names = (user.name || '').split(' ');
    p.firstName = names[0] || '';
    p.lastName = names.slice(1).join(' ');
    p.gender = guessGender(user.name);
    p.city = user.city || '';
    p.state = stateOfCity(user.city) || '';
    var relation = user.relation || 'self';
    p.profileFor = relation === 'self' ? 'Myself' : relation === 'parent' ? (p.gender === 'male' ? 'Son' : 'Daughter') : relation === 'sibling' ? (p.gender === 'male' ? 'Brother' : 'Sister') : 'Relative';
    return p;
  }

  function applyUser(user) {
    State.userId = user.id;
    State.loggedIn = true;
    State.phone = user.phone;
    State.status = user.status;
    State.rejectReason = user.rejectReason || '';
    State.approvalPending = user.status === 'approved' && !user.seenApproved;
    State.profile = profileFor(user);
    return user;
  }

  function writeSession(userId, phone) { safeSetItem(KEY.session, { userId: userId, phone: phone || State.phone, loggedInAt: nowIso() }); }

  function restore() {
    var session = safeGetItem(KEY.session, null);
    var user = session && session.userId ? findUser(session.userId) : null;
    if (user) return applyUser(user);
    if (session && !session.userId && session.phone) { // signed in but has not created a profile yet
      State.loggedIn = true; State.userId = null; State.phone = session.phone; State.status = 'none';
    }
    return null;
  }

  // After OTP: an existing phone number signs in to its account, a new one starts the profile.
  function login(phone) {
    var users = getUsers();
    var user = null;
    for (var i = 0; i < users.length; i++) if (users[i].phone === phone) user = users[i];
    if (user) { writeSession(user.id); return applyUser(user); }
    State.loggedIn = true;
    State.userId = null;
    State.status = 'none';
    writeSession(null, phone); // stay signed in across a refresh even before a profile exists
    return null;
  }

  function logout() {
    try { localStorage.removeItem(KEY.session); } catch (error) { /* storage blocked: nothing to clear */ }
  }

  // Re-reads the status the admin may have changed, on every screen change and when the tab is focused again.
  function sync() {
    if (!State.userId) return;
    var user = findUser(State.userId);
    if (!user) { State.loggedIn = false; State.userId = null; State.status = 'none'; logout(); return; }
    if (user.status !== State.status) {
      State.status = user.status;
      State.approvalPending = user.status === 'approved' && !user.seenApproved;
    }
    State.rejectReason = user.rejectReason || '';
  }

  function markApprovalSeen() {
    var user = State.userId ? findUser(State.userId) : null;
    if (user) { user.seenApproved = true; saveUser(user); }
    State.approvalPending = false;
  }

  // Creates or updates the user (status "pending") and saves the profile as a draft that the admin can see.
  function submitProfile() {
    var p = State.profile;
    var user = State.userId ? findUser(State.userId) : null;
    if (!user) user = { id: 'usr_' + Date.now(), phone: State.phone, createdAt: nowIso() };
    user.name = (p.firstName + ' ' + p.lastName).trim();
    user.city = p.city;
    user.relation = RELATION[p.profileFor] || 'self';
    user.status = 'pending';
    user.rejectReason = '';
    user.seenApproved = false;
    var profileId = user.profileId || 'prf_u' + Date.now();
    var stored = storedFromOnboarding(p, user, profileId);
    var existing = getProfileById(profileId);
    if (existing && existing.status === 'published') stored.status = 'hidden'; // an edited approved profile waits for the admin again
    user.profileId = profileId;
    user.profileData = JSON.parse(JSON.stringify(Object.assign({}, p, { photos: [] })));
    var saved = saveProfile(stored) && saveUser(user);
    if (!saved) return false;
    logActivity('registered', 'User: ' + user.name + ' (profile submitted)');
    writeSession(user.id);
    State.userId = user.id;
    State.status = 'pending';
    State.rejectReason = '';
    return true;
  }

  // DEMO TOOLS only: pretends to be the admin. The change is real, so the admin panel shows it too.
  function demoSetStatus(status, reason) {
    var user = State.userId ? findUser(State.userId) : null;
    if (!user) return false;
    user.status = status;
    user.rejectReason = status === 'rejected' ? (reason || REJECTION_REASON) : '';
    if (status !== 'approved') user.seenApproved = false;
    saveUser(user);
    logActivity(status, 'User: ' + user.name);
    State.status = status;
    State.rejectReason = user.rejectReason;
    State.approvalPending = status === 'approved';
    return true;
  }

  /* ---------- Shortlist and contact views ---------- */

  function loadShortlist(userId) {
    if (!userId) return [];
    return safeGetItem(KEY.shortlist, []).filter(function (i) { return i.userId === userId; })
      .sort(function (a, b) { return String(b.savedAt).localeCompare(String(a.savedAt)); })
      .map(function (i) { return i.profileId; });
  }

  function saveShortlist(userId, ids) {
    if (!userId) return;
    var all = safeGetItem(KEY.shortlist, []);
    var times = {};
    all.filter(function (i) { return i.userId === userId; }).forEach(function (i) { times[i.profileId] = i.savedAt; });
    var others = all.filter(function (i) { return i.userId !== userId; });
    var mine = ids.map(function (id, n) { return { userId: userId, profileId: id, savedAt: times[id] || new Date(Date.now() + n).toISOString() }; });
    safeSetItem(KEY.shortlist, others.concat(mine));
  }

  function logContactView(userId, profileId, profileName) {
    var views = safeGetItem(KEY.views, []);
    views.push({ id: 'cv_' + Date.now(), userId: userId, profileId: profileId, time: nowIso() });
    safeSetItem(KEY.views, views);
    var user = userId ? findUser(userId) : null;
    logActivity('contact viewed', (user ? user.name : 'A member') + ' viewed the contact of ' + profileName);
  }

  /* ---------- The member's own profile, settings and account ---------- */

  function ownCode() {
    var user = State.userId ? findUser(State.userId) : null;
    return 'SV' + (100000 + (hashOf((user && user.profileId) || State.phone || 'member') % 900000));
  }

  // The member's own profile in the same shape other members see ("how others see me").
  function ownPreview() {
    var user = State.userId ? findUser(State.userId) : null;
    var stored = storedFromOnboarding(State.profile, { id: State.userId, phone: State.phone }, (user && user.profileId) || 'prf_own');
    var preview = adapt(stored);
    preview.lastActive = 'Online now';
    preview.verified = State.status === 'approved';
    preview.profileCode = ownCode();
    preview.hasBiodata = Boolean(State.profile.biodataFile);
    return preview;
  }

  // Saves changes that do not need a new review (photo privacy, partner preferences, documents).
  function saveProfileData() {
    var user = State.userId ? findUser(State.userId) : null;
    if (!user) return false;
    user.profileData = JSON.parse(JSON.stringify(Object.assign({}, State.profile, { photos: [] })));
    var current = user.profileId ? getProfileById(user.profileId) : null;
    if (current) {
      var fresh = storedFromOnboarding(State.profile, user, user.profileId);
      fresh.status = current.status; // saving preferences must not change visibility
      saveProfile(Object.assign({}, current, fresh));
    }
    return saveUser(user);
  }

  // Removes the account from the shared store, so the admin panel no longer lists it.
  function deleteAccount() {
    var user = State.userId ? findUser(State.userId) : null;
    if (!user) return false;
    if (user.profileId) deleteProfile(user.profileId);
    safeSetItem(KEY.shortlist, safeGetItem(KEY.shortlist, []).filter(function (i) { return i.userId !== user.id; }));
    deleteUser(user.id);
    logActivity('deleted user', 'User: ' + user.name + ' (deleted by the member)');
    logout();
    return true;
  }

  seedDemoProfiles();

  return {
    ownCode: ownCode, ownPreview: ownPreview, saveProfileData: saveProfileData, deleteAccount: deleteAccount,
    publishedProfiles: publishedProfiles, publishedProfile: publishedProfile,
    restore: restore, login: login, logout: logout, sync: sync, markApprovalSeen: markApprovalSeen,
    submitProfile: submitProfile, demoSetStatus: demoSetStatus,
    loadShortlist: loadShortlist, saveShortlist: saveShortlist, logContactView: logContactView,
    seedDemoProfiles: seedDemoProfiles
  };
})();
