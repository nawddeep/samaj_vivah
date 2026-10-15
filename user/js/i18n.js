/* i18n.js: the app's two languages, the t() lookup and the saved language choice.
   Loaded before app.js. To add a language: add one I18N.xx dictionary below and one entry in I18N.LANGS. */

var I18N = {
  STORAGE_KEY: 'mm_user_lang',
  DEFAULT: 'en',
  // Shown on the chooser and in Settings. `sub` is the name in the other language, so both readers recognise it.
  LANGS: [
    { code: 'hi', label: 'हिन्दी', sub: 'Hindi' },
    { code: 'en', label: 'English', sub: 'अंग्रेज़ी' }
  ],
  lang: 'en',
  listeners: [],
  missing: {},
  // Missing-key warnings only when the address has ?i18nDebug=1, so normal use stays quiet.
  debug: /[?&]i18nDebug=1/.test(window.location.search)
};

/* ---------- English ---------- */

I18N.en = {
  'app.name': 'Samaj Vivah',
  'app.tagline': 'Find your life partner in the Sindhi community',
  'app.demo': 'Demo Version',

  'common.yes': 'Yes',
  'common.cancel': 'Cancel',
  'common.close': 'Close',
  'common.back': 'Go back',
  'common.next': 'Next',
  'common.skip': 'Skip',
  'common.select': 'Select',
  'common.search': 'Search',
  'common.searchList': 'Search the list',
  'common.noResults': 'No results found.',
  'common.progress': 'Profile progress',
  'common.on': '{label} on',
  'common.off': '{label} off',

  'lang.switchTo': 'Switch to Hindi',
  'lang.pill': 'हिन्दी',

  'nav.main': 'Main',
  'nav.home': 'Home',
  'nav.matches': 'Matches',
  'nav.interests': 'Interests',
  'nav.messages': 'Messages',
  'nav.account': 'Account',

  'banner.pending': 'Your profile is under review. You can browse now. Messaging and contact unlock after approval.',
  'banner.guest': 'You are browsing as a guest. Create your profile to send interests and message after approval.',
  'banner.viewStatus': 'View status',
  'banner.createProfile': 'Create profile',
  'toast.approved': 'Your profile was approved!',

  'splash.title': 'Welcome',

  'welcome.title': 'Welcome',
  'welcome.intro': 'Introduction',
  'welcome.s1.title': 'Find verified matches in the Sindhi community',
  'welcome.s1.text': 'Every profile is checked by our team before you see it.',
  'welcome.s2.title': 'Your privacy is protected',
  'welcome.s2.text': 'You choose who can see your photos and details.',
  'welcome.s3.title': 'Contact only after approval',
  'welcome.s3.text': 'Phone numbers are shown only to approved members.',
  'welcome.start': 'Get started',

  'phone.title': 'What’s your mobile number?',
  'phone.helper': 'We will use it to log you in safely.',
  'phone.screen': 'Mobile number',
  'phone.placeholder': 'Mobile number',
  'phone.clear': 'Clear number',
  'phone.country': 'Country code plus 91',
  'phone.hint': 'We’ll send you a 4 digit OTP.',
  'phone.send': 'Send OTP',
  'phone.sending': 'Sending OTP...',
  'phone.invalid': 'Please enter a valid 10-digit mobile number.',

  'otp.title': 'Enter the 4 digit OTP',
  'otp.screen': 'Verify OTP',
  'otp.sentTo': 'We sent a code to {phone}.',
  'otp.yourNumber': 'your number',
  'otp.digit': 'Digit {n} of 4',
  'otp.resend': 'Resend OTP',
  'otp.resendIn': 'Resend code in {time}',
  'otp.resent': 'A new OTP has been sent.',
  'otp.verify': 'Verify',
  'otp.verifying': 'Verifying...',
  'otp.invalid': 'Please enter the 4 digit OTP.',
  'otp.verified': 'Mobile number verified',
  'otp.change': 'Change number',
  'otp.demo': 'Demo OTP: {code}',
  'otp.autoRead': 'OTP read from SMS',

  'settings.title': 'Settings',
  'settings.notifications': 'Notifications',
  'settings.newMatches': 'New matches',
  'settings.interests': 'Interests',
  'settings.messages': 'Messages',
  'settings.language': 'Language',
  'settings.privacy': 'Privacy',
  'settings.hide': 'Hide my profile',
  'settings.hideSub': 'Others will not see it until you turn this off',
  'settings.hideAria': 'Hide my profile temporarily',
  'settings.hidden': 'Your profile is hidden for now',
  'settings.visible': 'Your profile is visible again',
  'settings.account': 'Account',
  'settings.delete': 'Delete account',
  'settings.deleteTitle': 'Delete your account?',
  'settings.deleteMsg': 'Your profile, shortlist and messages will be removed. This cannot be undone.',
  'settings.loggedOut': 'You have been logged out',
  'settings.deleteFail': 'Could not delete the account. Please try again.',
  'settings.deleted': 'Your account was deleted'
};

/* ---------- Hindi (natural, respectful आप form; common English words like OTP stay) ---------- */

I18N.hi = {
  'app.name': 'समाज विवाह',
  'app.tagline': 'सिंधी समाज में अपना जीवनसाथी खोजें',
  'app.demo': 'डेमो संस्करण',

  'common.yes': 'हाँ',
  'common.cancel': 'रद्द करें',
  'common.close': 'बंद करें',
  'common.back': 'पीछे जाएँ',
  'common.next': 'आगे',
  'common.skip': 'छोड़ें',
  'common.select': 'चुनें',
  'common.search': 'खोजें',
  'common.searchList': 'सूची में खोजें',
  'common.noResults': 'कोई परिणाम नहीं मिला।',
  'common.progress': 'प्रोफ़ाइल की प्रगति',
  'common.on': '{label} चालू',
  'common.off': '{label} बंद',

  'lang.switchTo': 'अंग्रेज़ी में बदलें',
  'lang.pill': 'EN',

  'nav.main': 'मुख्य',
  'nav.home': 'होम',
  'nav.matches': 'रिश्ते',
  'nav.interests': 'रुचियाँ',
  'nav.messages': 'संदेश',
  'nav.account': 'खाता',

  'banner.pending': 'आपकी प्रोफ़ाइल की जाँच चल रही है। आप अभी प्रोफ़ाइल देख सकते हैं। मंज़ूरी के बाद संदेश और संपर्क की सुविधा खुल जाएगी।',
  'banner.guest': 'आप मेहमान के रूप में देख रहे हैं। रुचि भेजने और मंज़ूरी के बाद संदेश करने के लिए अपनी प्रोफ़ाइल बनाएँ।',
  'banner.viewStatus': 'स्थिति देखें',
  'banner.createProfile': 'प्रोफ़ाइल बनाएँ',
  'toast.approved': 'आपकी प्रोफ़ाइल स्वीकृत हो गई है!',

  'splash.title': 'स्वागत है',

  'welcome.title': 'स्वागत है',
  'welcome.intro': 'परिचय',
  'welcome.s1.title': 'सिंधी समाज में सत्यापित रिश्ते पाएँ',
  'welcome.s1.text': 'आपको दिखाने से पहले हर प्रोफ़ाइल की जाँच हमारी टीम करती है।',
  'welcome.s2.title': 'आपकी निजता सुरक्षित है',
  'welcome.s2.text': 'आपकी फ़ोटो और जानकारी कौन देखे, यह आप तय करते हैं।',
  'welcome.s3.title': 'मंज़ूरी के बाद ही संपर्क',
  'welcome.s3.text': 'फ़ोन नंबर केवल स्वीकृत सदस्यों को ही दिखाए जाते हैं।',
  'welcome.start': 'शुरू करें',

  'phone.title': 'आपका मोबाइल नंबर क्या है?',
  'phone.helper': 'इसी नंबर से आप सुरक्षित रूप से लॉग इन करेंगे।',
  'phone.screen': 'मोबाइल नंबर',
  'phone.placeholder': 'मोबाइल नंबर',
  'phone.clear': 'नंबर मिटाएँ',
  'phone.country': 'देश कोड +91',
  'phone.hint': 'हम आपको 4 अंकों का OTP भेजेंगे।',
  'phone.send': 'OTP भेजें',
  'phone.sending': 'OTP भेजा जा रहा है...',
  'phone.invalid': 'कृपया सही 10 अंकों का मोबाइल नंबर डालें।',

  'otp.title': '4 अंकों का OTP डालें',
  'otp.screen': 'OTP सत्यापन',
  'otp.sentTo': 'हमने {phone} पर कोड भेजा है।',
  'otp.yourNumber': 'आपके नंबर',
  'otp.digit': '4 में से अंक {n}',
  'otp.resend': 'OTP दोबारा भेजें',
  'otp.resendIn': '{time} बाद कोड दोबारा भेज सकेंगे',
  'otp.resent': 'नया OTP भेज दिया गया है।',
  'otp.verify': 'सत्यापित करें',
  'otp.verifying': 'सत्यापित हो रहा है...',
  'otp.invalid': 'कृपया 4 अंकों का OTP डालें।',
  'otp.verified': 'मोबाइल नंबर सत्यापित हो गया',
  'otp.change': 'नंबर बदलें',
  'otp.demo': 'डेमो OTP: {code}',
  'otp.autoRead': 'SMS से OTP अपने आप भर गया',

  'settings.title': 'सेटिंग्स',
  'settings.notifications': 'सूचनाएँ',
  'settings.newMatches': 'नए रिश्ते',
  'settings.interests': 'रुचियाँ',
  'settings.messages': 'संदेश',
  'settings.language': 'भाषा',
  'settings.privacy': 'गोपनीयता',
  'settings.hide': 'मेरी प्रोफ़ाइल छिपाएँ',
  'settings.hideSub': 'जब तक आप इसे बंद नहीं करते, दूसरे सदस्य इसे नहीं देख पाएँगे',
  'settings.hideAria': 'मेरी प्रोफ़ाइल कुछ समय के लिए छिपाएँ',
  'settings.hidden': 'आपकी प्रोफ़ाइल अभी छिपी हुई है',
  'settings.visible': 'आपकी प्रोफ़ाइल फिर से दिखने लगी है',
  'settings.account': 'खाता',
  'settings.delete': 'खाता हटाएँ',
  'settings.deleteTitle': 'क्या आप अपना खाता हटाना चाहते हैं?',
  'settings.deleteMsg': 'आपकी प्रोफ़ाइल, शॉर्टलिस्ट और संदेश हटा दिए जाएँगे। इसे वापस नहीं लाया जा सकता।',
  'settings.loggedOut': 'आप लॉग आउट हो गए हैं',
  'settings.deleteFail': 'खाता हटाया नहीं जा सका। कृपया फिर से कोशिश करें।',
  'settings.deleted': 'आपका खाता हटा दिया गया है'
};

/* ---------- Month names for display (stored dates keep the English month names) ---------- */

I18N.months = {
  en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  hi: ['जनवरी', 'फ़रवरी', 'मार्च', 'अप्रैल', 'मई', 'जून', 'जुलाई', 'अगस्त', 'सितंबर', 'अक्टूबर', 'नवंबर', 'दिसंबर']
};

/* ---------- Display labels for stored English option values (filled in Phase 4) ---------- */

I18N.opt = { hi: {} };

/* ---------- Lookup ---------- */

// t('otp.sentTo', { phone: '+91 ...' }). Falls back to English, then to the key, never to ''.
function t(key, params) {
  var text = I18N[I18N.lang] && I18N[I18N.lang][key];
  if (text === undefined) {
    if (I18N.debug && !I18N.missing[I18N.lang + ':' + key]) {
      I18N.missing[I18N.lang + ':' + key] = true;
      console.warn('i18n: missing "' + key + '" in ' + I18N.lang);
    }
    text = I18N.en[key];
  }
  if (text === undefined) text = key;
  if (!params) return text;
  return text.replace(/\{(\w+)\}/g, function (whole, name) {
    return params[name] === undefined || params[name] === null ? whole : String(params[name]);
  });
}

// The month name for a stored English month ('March') or a 0-based index, in the current language.
function monthLabel(monthOrIndex) {
  var i = typeof monthOrIndex === 'number' ? monthOrIndex : I18N.months.en.indexOf(monthOrIndex);
  if (i < 0) return String(monthOrIndex || '');
  return (I18N.months[I18N.lang] || I18N.months.en)[i];
}

// Display text for a stored value, for example optLabel('diet', 'Vegetarian'). The stored value never changes.
function optLabel(group, value) {
  var table = I18N.opt[I18N.lang] && I18N.opt[I18N.lang][group];
  return (table && table[value]) || value;
}

/* ---------- Language state ---------- */

I18N.get = function () { return I18N.lang; };

I18N.isSupported = function (code) {
  return I18N.LANGS.some(function (l) { return l.code === code; });
};

// The saved choice, or null when the person has never chosen (shows the language screen once).
I18N.saved = function () {
  var value = null;
  try { value = window.localStorage.getItem(I18N.STORAGE_KEY); } catch (error) { value = null; } // storage may be blocked
  return I18N.isSupported(value) ? value : null;
};

I18N.apply = function (code) {
  I18N.lang = code;
  document.documentElement.setAttribute('lang', code);
};

// Changes the language, remembers it, and tells the app to repaint the open screen.
I18N.set = function (code) {
  if (!I18N.isSupported(code)) return;
  var changed = code !== I18N.lang;
  I18N.apply(code);
  try { window.localStorage.setItem(I18N.STORAGE_KEY, code); } catch (error) { /* blocked: works for this visit only */ }
  if (changed) I18N.listeners.forEach(function (fn) { fn(code); });
};

I18N.onChange = function (fn) { I18N.listeners.push(fn); };

// Fixed markup in index.html (bottom nav) carries data-i18n / data-i18n-aria keys.
I18N.translateStatic = function (root) {
  var scope = root || document;
  Array.prototype.forEach.call(scope.querySelectorAll('[data-i18n]'), function (node) { node.textContent = t(node.getAttribute('data-i18n')); });
  Array.prototype.forEach.call(scope.querySelectorAll('[data-i18n-aria]'), function (node) { node.setAttribute('aria-label', t(node.getAttribute('data-i18n-aria'))); });
};

I18N.apply(I18N.saved() || I18N.DEFAULT);
