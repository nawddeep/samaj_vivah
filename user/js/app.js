/* app.js: helpers, in-memory state, toasts, popups, bottom sheets and the screen router. Screens live in screens.js. */

/* ---------- DOM helper (always textContent, never innerHTML for data) ---------- */

// h('button', { class: 'btn', text: 'Hi', onClick: fn }, [children])
function h(tag, props, children) {
  var node = document.createElement(tag);
  Object.keys(props || {}).forEach(function (key) {
    var value = props[key];
    if (key === 'class') node.className = value;
    else if (key === 'text') node.textContent = value;
    else if (key.indexOf('on') === 0 && typeof value === 'function') node.addEventListener(key.slice(2).toLowerCase(), value);
    else if (value !== false && value !== null && value !== undefined) node.setAttribute(key, value === true ? '' : value);
  });
  [].concat(children === undefined ? [] : children).forEach(function (child) {
    if (child === null || child === undefined || child === false) return;
    node.appendChild(typeof child === 'string' ? document.createTextNode(child) : child);
  });
  return node;
}

function clearNode(node) {
  while (node.firstChild) node.removeChild(node.firstChild);
}

var uidCounter = 0;
function uid(prefix) { uidCounter += 1; return (prefix || 'id') + '-' + uidCounter; }

function debounce(fn, ms) {
  var timer = null;
  return function () {
    var args = arguments;
    clearTimeout(timer);
    timer = setTimeout(function () { fn.apply(null, args); }, ms);
  };
}

/* ---------- Icons (fixed markup, no user data inside) ---------- */

var ICON_PATHS = {
  back: '<path d="M15 5l-7 7 7 7"/>',
  close: '<path d="M6 6l12 12M18 6L6 18"/>',
  check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
  down: '<path d="M6 9l6 6 6-6"/>',
  right: '<path d="M9 6l6 6-6 6"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  minus: '<path d="M5 12h14"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>',
  camera: '<path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="4"/>',
  image: '<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="M21 16l-5-5-8 9"/>',
  upload: '<path d="M12 16V4M7 9l5-5 5 5"/><path d="M4 16v4h16v-4"/>',
  file: '<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4"/>',
  lock: '<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
  shield: '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M8.5 12l2.5 2.5 4.5-5"/>',
  users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6"/><circle cx="17.5" cy="9" r="2.5"/><path d="M17 14c2.7.2 4.5 2 4.5 5"/>',
  heart: '<path d="M12 21s-8-5.2-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 5.8-8 11-8 11z"/>',
  star: '<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/>',
  trash: '<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/>',
  home: '<path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/>',
  match: '<circle cx="9" cy="12" r="6"/><circle cx="15" cy="12" r="6"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',
  chat: '<path d="M4 5h16v11H9l-5 4z"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7"/>',
  bell: '<path d="M6 17V11a6 6 0 0 1 12 0v6l2 2H4z"/><path d="M10 21h4"/>',
  filter: '<path d="M4 6h16M7 12h10M10 18h4"/>',
  crown: '<path d="M3 8l4.5 4L12 5l4.5 7L21 8l-2 11H5z"/>',
  share: '<circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="6" r="2.5"/><circle cx="18" cy="18" r="2.5"/><path d="M8.2 10.8l7.6-3.6M8.2 13.2l7.6 3.6"/>',
  dots: '<circle cx="12" cy="5" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="12" cy="19" r="1.6"/>',
  phone: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A15 15 0 0 1 3 6a2 2 0 0 1 2-2z"/>',
  copy: '<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  edit: '<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="M13.5 6.5l4 4"/>',
  eye: '<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  ban: '<circle cx="12" cy="12" r="9"/><path d="M5.6 5.6l12.8 12.8"/>',
  flag: '<path d="M5 21V4h12l-2 4 2 4H5"/>',
  send: '<path d="M3 11l18-8-8 18-2-8z"/>',
  alert: '<circle cx="12" cy="12" r="9"/><path d="M12 7v6M12 16.5v.5"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.5"/>',
  grid: '<rect x="4" y="4" width="7" height="7" rx="1"/><rect x="13" y="4" width="7" height="7" rx="1"/><rect x="4" y="13" width="7" height="7" rx="1"/><rect x="13" y="13" width="7" height="7" rx="1"/>',
  list: '<path d="M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01"/>',
  card: '<rect x="5" y="3" width="14" height="18" rx="3"/>',
  settings: '<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2"/>',
  help: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.6 2.6 0 0 1 5 1c0 1.8-2.5 2-2.5 3.8M12 17v.5"/>',
  logout: '<path d="M10 4H5v16h5M15 8l4 4-4 4M19 12H9"/>',
  gift: '<rect x="4" y="9" width="16" height="11" rx="1"/><path d="M12 9v11M3 9h18M12 9c-3 0-4.5-4-1.5-4.5S12 9 12 9zm0 0c3 0 4.5-4 1.5-4.5S12 9 12 9z"/>',
  hourglass: '<path d="M7 3h10M7 21h10M8 3c0 5 8 5 8 9s-8 4-8 9M16 3c0 5-8 5-8 9s8 4 8 9"/>',
  verified: '<path d="M12 2l2.4 2 3.1-.3 1 3 2.6 1.8-1 3 1 3-2.6 1.8-1 3-3.1-.3L12 22l-2.4-2-3.1.3-1-3L2.9 15.5l1-3-1-3 2.6-1.8 1-3 3.1.3z"/><path d="M8.5 12l2.5 2.5 4.5-5"/>'
};

function Icon(name, size) {
  var node = h('span', { class: 'icon', 'aria-hidden': 'true' });
  node.innerHTML = '<svg viewBox="0 0 24 24"' + (size ? ' style="width:' + size + 'px;height:' + size + 'px"' : '') + '>' + (ICON_PATHS[name] || '') + '</svg>';
  return node;
}

/* ---------- In-memory state (nothing is saved after refresh) ---------- */

var State = {};

function resetState() {
  State.phone = '';
  State.userId = null;         // id of the record in the admin's mm_users
  State.rejectReason = '';     // the reason the admin typed when rejecting
  State.approvalPending = false; // approved but the congratulations screen was not shown yet
  State.loggedIn = false;
  State.status = 'none';       // none | pending | approved | rejected | blocked
  State.cameFromWelcome = false; // the mobile number screen shows a back arrow only after the welcome slides
  State.app = null;            // main-app state (shortlist, interests, filters) is created on first use
  State.editSnapshot = null;   // copy of the profile taken when the member starts editing, to detect unsaved changes
  State.autoSave = false;      // save quietly when the member returns from editing preferences or documents
  State.editing = false;       // true while a step was opened from "Edit" on the review screen
  State.editBase = 0;          // history position of the review screen while editing
  State.fromBiodata = false;
  State.consent = false;
  State.profile = blankProfile();
}
resetState();

/* ---------- Access rules: the ONE place that says what each status may do ---------- */

// pending = under review (browse only). rejected and blocked can only see their own status screen.
// "none" = signed in but has not filled the form yet, treated like pending (browse only).
var ACCESS = {
  none:     { browse: true },
  pending:  { browse: true },
  approved: { browse: true, viewContact: true, sendInterest: true, acceptInterest: true, chat: true, shortlist: true, premium: true, report: true },
  rejected: {},
  blocked:  {}
};

// canUse('sendInterest') etc. Every button and every route asks here; nothing else checks the status.
function canUse(action) { return Boolean((ACCESS[State.status] || {})[action]); }

// Screens subscribe here to repaint (banner, locked buttons) the moment the status changes, with no reload.
var Access = {
  listeners: [],
  lastStatus: null,
  check: function () {
    if (State.status === Access.lastStatus) return;
    Access.lastStatus = State.status;
    Access.listeners.forEach(function (fn) { fn(); });
  }
};

/* ---------- Popups: toast, dialog, bottom sheet ---------- */

var UI = (function () {
  var TOAST_MS = 3000;
  var stack = [];

  function toast(message, type) {
    var root = document.getElementById('toast-root');
    var node = h('div', { class: 'toast toast-' + (type || 'success'), text: message });
    root.appendChild(node);
    setTimeout(function () { if (node.parentNode) node.parentNode.removeChild(node); }, TOAST_MS);
  }

  function focusables(container) {
    return Array.prototype.slice.call(
      container.querySelectorAll('a[href], button:not([disabled]), input:not([type=hidden]), select, textarea, [tabindex]:not([tabindex="-1"])')
    );
  }

  // One popup layer on top of the stack. Esc and a tap outside close it.
  function openLayer(className, buildPanel, dismissValue) {
    var previousFocus = document.activeElement;
    var finished = false;
    var resolveFn;
    var promise = new Promise(function (resolve) { resolveFn = resolve; });
    var layer = h('div', { class: 'layer ' + className });
    var entry = { dismissValue: dismissValue };

    function close(value) {
      if (finished) return;
      finished = true;
      var at = stack.indexOf(entry);
      if (at !== -1) stack.splice(at, 1);
      if (layer.parentNode) layer.parentNode.removeChild(layer);
      if (previousFocus && previousFocus.focus) previousFocus.focus();
      resolveFn(value);
    }

    var panel = buildPanel(close);
    layer.appendChild(panel);
    layer.addEventListener('mousedown', function (event) {
      if (event.target === layer) close(dismissValue);
    });
    entry.close = close;
    entry.root = panel;
    stack.push(entry);
    document.getElementById('layer-root').appendChild(layer);

    var preferred = panel.querySelector('[data-autofocus]') || focusables(panel)[0];
    if (preferred) preferred.focus();
    return { close: close, promise: promise };
  }

  document.addEventListener('keydown', function (event) {
    var top = stack[stack.length - 1];
    if (!top) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      top.close(top.dismissValue);
    } else if (event.key === 'Tab') {
      var items = focusables(top.root);
      if (!items.length) return;
      var first = items[0];
      var last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
  });

  // dialog({ title, body (string | Node), actions: [{ label, value, kind, autofocus }], dismissValue }) -> Promise
  function dialog(options) {
    var titleId = uid('dlg');
    return openLayer('', function (close) {
      var body = typeof options.body === 'string' ? h('p', { text: options.body }) : options.body;
      var buttons = (options.actions || []).map(function (action) {
        return h('button', {
          type: 'button',
          class: 'btn btn-block btn-' + (action.kind || 'outline'),
          text: action.label,
          'data-autofocus': action.autofocus ? 'true' : false,
          onClick: function () { close(action.value); }
        });
      });
      return h('div', { class: 'dialog', role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': titleId }, [
        h('h2', { id: titleId, text: options.title }), body, h('div', { class: 'dialog-actions' }, buttons)
      ]);
    }, options.dismissValue).promise;
  }

  // confirm({ title, message, confirmText, cancelText, danger }) -> Promise<boolean>
  function confirm(options) {
    return dialog({
      title: options.title, body: options.message, dismissValue: false,
      actions: [
        { label: options.confirmText || 'Yes', value: true, kind: options.danger ? 'danger' : 'primary', autofocus: true },
        { label: options.cancelText || 'Cancel', value: false, kind: 'outline' }
      ]
    });
  }

  // sheet({ title, render: function (close) -> { body: Node, footer: Node|null }, dismissValue }) -> { close, promise }
  function sheet(options) {
    var titleId = uid('sheet');
    return openLayer('sheet', function (close) {
      var parts = options.render(close);
      var panel = h('div', { class: 'sheet-panel', role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': titleId }, [
        h('div', { class: 'sheet-grip', 'aria-hidden': 'true' }),
        h('div', { class: 'sheet-head' }, [
          h('h2', { id: titleId, text: options.title }),
          h('button', { type: 'button', class: 'icon-btn', 'aria-label': 'Close', onClick: function () { close(options.dismissValue); } }, Icon('close'))
        ]),
        h('div', { class: 'sheet-body' }, parts.body),
        parts.footer ? h('div', { class: 'sheet-foot' }, parts.footer) : null
      ]);
      return panel;
    }, options.dismissValue);
  }

  function skeletons(count) {
    var box = h('div', { 'aria-busy': 'true' });
    for (var i = 0; i < count; i++) box.appendChild(h('div', { class: 'skeleton', 'aria-hidden': 'true' }));
    return box;
  }

  // 9000000001 -> 90XXXXXX01
  function maskPhone(phone) {
    var digits = String(phone || '').replace(/\D/g, '');
    if (digits.length < 4) return 'XXXXXXXXXX';
    return digits.slice(0, 2) + new Array(digits.length - 3).join('X') + digits.slice(-2);
  }

  return { toast: toast, dialog: dialog, confirm: confirm, sheet: sheet, skeletons: skeletons, maskPhone: maskPhone };
})();

/* ---------- Router: #/name/param routes, one history stack, slide transitions ---------- */

var Router = (function () {
  var routes = {};
  var currentI = 0;     // position in our own history stack, used to tell forward from back
  var stage = null;
  var nav = null;
  var APP_TITLE = APP_NAME;

  // register(name, build, { auth: 'login' | 'browse' | 'member' | 'approved', only: 'pending' | 'rejected' | ... })
  // 'browse' = canUse('browse'); 'member' = pending or approved; 'approved' = only members the admin approved
  // build(param) returns { el, tab, leave(), mounted() }
  function register(name, build, options) {
    if (routes[name]) console.error('Router: the route "' + name + '" is registered twice. The second one replaces the first.');
    routes[name] = { build: build, auth: (options && options.auth) || null, only: (options && options.only) || null };
  }

  function hashFor(name, param) {
    return '#/' + name + (param !== undefined && param !== null && param !== '' ? '/' + encodeURIComponent(param) : '');
  }

  function parse() {
    var parts = window.location.hash.replace(/^#\/?/, '').split('/').filter(Boolean);
    var param = '';
    try { param = parts[1] ? decodeURIComponent(parts[1]) : ''; } catch (error) { param = ''; }
    return { name: parts[0] || '', param: param };
  }

  // Where the app should be for the current login and profile status.
  function gateName() {
    if (!State.loggedIn) return 'phone';
    if (State.status === 'blocked') return 'blocked';
    if (State.status === 'rejected') return 'rejected';
    if (State.status === 'approved' && State.approvalPending) return 'approved'; // show the congratulations once
    return 'home'; // pending, approved and new members can browse; approval unlocks the actions
  }

  // The status screen that matches a status, used when the admin changes it while that screen is open.
  function statusScreen(status) {
    if (status === 'approved') return State.approvalPending ? 'approved' : 'home';
    if (status === 'pending' || status === 'rejected' || status === 'blocked') return status;
    return 'home';
  }

  function allowed(route) {
    if (route.only && State.status !== route.only) return false; // a status screen only for that status
    if (State.loggedIn && State.status === 'blocked' && route.auth) return false; // blocked: the Blocked screen only
    if (route.auth === 'approved') return State.status === 'approved';
    if (route.auth === 'member') return State.status === 'pending' || State.status === 'approved'; // may edit the profile
    if (route.auth === 'browse') return State.loggedIn && canUse('browse'); // rejected and blocked cannot browse
    if (route.auth === 'login') return State.loggedIn;
    return true;
  }

  function go(name, param, dir) {
    var hash = hashFor(name, param);
    if (window.location.hash === hash) return;
    currentI += 1;
    window.history.pushState({ i: currentI }, '', hash);
    render(dir || 'fwd');
  }

  // Replace the current entry, so the user cannot go "back" into a finished step.
  function replace(name, param) {
    window.history.replaceState({ i: currentI }, '', hashFor(name, param));
    render('fade');
  }

  function back(fallbackName) {
    if (currentI > 0) window.history.back();
    else replace(fallbackName || gateName());
  }

  // Position in our history stack, and a way to step back several screens at once (used by "Edit" on Review).
  function index() { return currentI; }
  function backBy(steps) {
    if (steps > 0 && currentI >= steps) window.history.go(-steps);
    else replace(gateName());
  }

  function render(dir) {
    if (window.Bridge) Bridge.sync(); // the admin may have changed this user's status
    Access.check();
    var parsed = parse();
    var route = routes[parsed.name];
    if (!route) {
      // Unknown address: logged-in people go to the screen that matches their status, others to the splash.
      var fallback = State.loggedIn ? gateName() : 'splash';
      parsed = { name: fallback, param: '' };
      route = routes[fallback];
      window.history.replaceState({ i: currentI }, '', hashFor(fallback));
      dir = 'fade';
    }
    if (!allowed(route)) {
      var target = gateName();
      parsed = { name: target, param: '' };
      route = routes[target];
      window.history.replaceState({ i: currentI }, '', hashFor(target));
      dir = 'fade';
    }
    show(parsed, route, dir);
  }

  function show(parsed, route, dir) {
    var view = route.build(parsed.param);
    var old = stage.querySelector('.screen.current');
    if (old && old._view && old._view.leave) old._view.leave();

    var el = view.el;
    el.classList.add('screen', 'current');
    el._view = view;
    if (!old || dir === 'fade') {
      el.classList.add('anim-fade');
    } else if (dir === 'fwd') {
      el.classList.add('anim-in-right');
      old.classList.add('anim-out-left');
    } else {
      el.classList.add('anim-in-left');
      old.classList.add('anim-out-right');
    }
    if (old) {
      old.classList.remove('current');
      old.setAttribute('aria-hidden', 'true');
      setTimeout(function () { if (old.parentNode) old.parentNode.removeChild(old); }, 320);
    }
    stage.appendChild(el);

    nav.hidden = !view.tab;
    Array.prototype.forEach.call(nav.querySelectorAll('button'), function (button) {
      var active = button.getAttribute('data-tab') === view.tab;
      button.classList.toggle('active', active);
      if (active) button.setAttribute('aria-current', 'page');
      else button.removeAttribute('aria-current');
    });

    if (typeof AccessUI !== 'undefined') AccessUI.update(view); // sticky "under review" banner
    document.title = (view.title ? view.title + ' · ' : '') + APP_TITLE;
    var heading = el.querySelector('h1');
    if (heading) {
      heading.setAttribute('tabindex', '-1');
      heading.focus({ preventScroll: true });
    }
    if (view.mounted) view.mounted();
  }

  // Called when another tab (the admin panel) changed shared data, or this tab was focused again.
  function recheck() {
    if (!window.Bridge || !stage) return;
    var before = State.status;
    Bridge.sync();
    Access.check();
    var route = routes[parse().name];
    if (!route) return;
    if (State.loggedIn && before === 'pending' && State.status === 'approved') {
      UI.toast('Your profile was approved!');
      replace('approved');
    } else if (!allowed(route)) {
      replace(route.only && State.loggedIn ? statusScreen(State.status) : gateName());
    }
  }

  function start() {
    stage = document.getElementById('stage');
    nav = document.getElementById('bottom-nav');
    Array.prototype.forEach.call(nav.querySelectorAll('button'), function (button) {
      button.addEventListener('click', function () { go(button.getAttribute('data-tab'), '', 'fade'); });
    });
    window.addEventListener('popstate', function (event) {
      var i = (event.state && event.state.i) || 0;
      var dir = i < currentI ? 'back' : 'fwd';
      currentI = i;
      render(dir);
    });
    window.addEventListener('storage', function (event) {
      if (event.key === null || event.key === 'mm_users' || event.key === 'mm_profiles') recheck();
    });
    document.addEventListener('visibilitychange', function () { if (!document.hidden) recheck(); });
    window.addEventListener('focus', recheck);
    // A refresh starts again at the splash, which restores a saved login.
    currentI = 0;
    window.history.replaceState({ i: 0 }, '', hashFor('splash'));
    render('fade');
  }

  return { register: register, start: start, go: go, replace: replace, back: back, backBy: backBy, index: index, gateName: gateName, recheck: recheck };
})();
