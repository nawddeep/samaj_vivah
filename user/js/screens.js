/* screens.js: reusable screen pieces and every screen template. Data comes from data.js, navigation from app.js. */

/* =====================================================================
   PART 1A: SCREEN SCAFFOLD AND FORM COMPONENTS
   ===================================================================== */

// Screen({ back, progress: {from, to}, right, body, footer, className }) -> { el, body, mounted }
function Screen(o) {
  var header = null;
  var fill = null;
  if (o.back || o.progress || o.right) {
    header = h('div', { class: 'screen-header' });
    if (o.back) {
      header.appendChild(h('button', { type: 'button', class: 'icon-btn', 'aria-label': 'Go back', onClick: function () { Router.back(); } }, Icon('back')));
    }
    if (o.progress) {
      fill = h('div', { class: 'progress-fill' });
      fill.style.width = Math.round(o.progress.from * 100) + '%';
      header.appendChild(h('div', { class: 'progress', role: 'progressbar', 'aria-label': 'Profile progress', 'aria-valuemin': '0', 'aria-valuemax': '100', 'aria-valuenow': String(Math.round(o.progress.to * 100)) }, fill));
    } else {
      header.appendChild(h('div', { class: 'spacer' }));
    }
    if (o.right) header.appendChild(o.right);
  }
  var body = h('div', { class: 'screen-body ' + (o.bodyClass || '') }, o.body);
  var footer = o.footer ? h('div', { class: 'screen-footer' }, o.footer) : null;
  var el = h('section', { class: o.className || '' }, [header, body, footer]);
  return {
    el: el,
    body: body,
    mounted: function () {
      if (fill) requestAnimationFrame(function () { fill.style.width = Math.round(o.progress.to * 100) + '%'; });
    }
  };
}

function bigButton(text, onClick, kind) {
  return h('button', { type: 'button', class: 'btn btn-block btn-' + (kind || 'primary'), text: text, onClick: onClick });
}

// Shows a spinner and a label inside a button, and disables it.
function setButtonBusy(button, label) {
  button.disabled = true;
  clearNode(button);
  button.appendChild(h('span', { class: 'btn-content' }, [h('span', { class: 'spinner', 'aria-hidden': 'true' }), label]));
}

function resetButton(button, label) {
  button.disabled = false;
  button.textContent = label;
}

/* ---------- Field wrapper and error display ---------- */

function fieldWrap(label, control, errKey, hint, forId) {
  var field = h('div', { class: 'field' });
  if (label) field.appendChild(h('label', { for: forId || false, text: label }));
  field.appendChild(control);
  if (hint) field.appendChild(h('p', { class: 'hint', text: hint }));
  if (errKey) field.appendChild(h('div', { class: 'field-error', 'data-error': errKey, role: 'alert' }));
  return field;
}

// errors: [[fieldKey, message], ...]. Shows friendly red text and scrolls to the first problem.
function showErrors(root, errors) {
  Array.prototype.forEach.call(root.querySelectorAll('.field-error'), function (node) {
    node.textContent = '';
    node.parentNode.classList.remove('has-error');
  });
  var first = null;
  errors.forEach(function (pair) {
    var node = root.querySelector('[data-error="' + pair[0] + '"]');
    if (!node) return;
    node.textContent = pair[1];
    node.parentNode.classList.add('has-error');
    if (!first) first = node.parentNode;
  });
  if (first) {
    first.scrollIntoView({ behavior: 'smooth', block: 'center' });
    var control = first.querySelector('input, select, button, textarea');
    if (control) control.focus({ preventScroll: true });
  }
}

// Clears a field's error as soon as the person touches it again.
function clearErrorsOnEdit(root) {
  ['input', 'change', 'click'].forEach(function (type) {
    root.addEventListener(type, function (event) {
      var field = event.target.closest && event.target.closest('.field, .consent-wrap');
      if (!field || !field.classList.contains('has-error')) return;
      field.classList.remove('has-error');
      var message = field.querySelector('.field-error');
      if (message) message.textContent = '';
    });
  });
}

/* ---------- Inputs bound to a state object: (obj, key, ...) ---------- */

function textInput(obj, key, label, o) {
  o = o || {};
  var id = uid('f');
  var input = h('input', {
    class: 'input', id: id, type: o.type || 'text', placeholder: o.placeholder || '',
    maxlength: o.maxlength || false, autocomplete: o.autocomplete || 'off'
  });
  input.value = obj[key] || '';
  input.addEventListener('input', function () { obj[key] = input.value; });
  return fieldWrap(label, input, key, o.hint, id);
}

// Opens a searchable list in a bottom sheet. Resolves with the picked option (or undefined).
function openPickList(title, options, selected) {
  return UI.sheet({
    title: title,
    dismissValue: undefined,
    render: function (close) {
      var list = h('div', { class: 'pick-list', role: 'listbox' });
      function paint(query) {
        clearNode(list);
        var shown = options.filter(function (opt) { return !query || opt.toLowerCase().indexOf(query.toLowerCase()) !== -1; });
        if (!shown.length) list.appendChild(h('p', { class: 'muted', text: 'No results found.' }));
        shown.forEach(function (opt) {
          var on = opt === selected;
          list.appendChild(h('button', {
            type: 'button', class: 'pick-item' + (on ? ' on' : ''), role: 'option', 'aria-selected': on ? 'true' : 'false',
            onClick: function () { close(opt); }
          }, [h('span', { text: opt }), on ? Icon('check') : null]));
        });
      }
      var kids = [];
      if (options.length > 8) {
        var search = h('input', { class: 'input', type: 'search', placeholder: 'Search', 'aria-label': 'Search the list' });
        search.addEventListener('input', function () { paint(search.value); });
        kids.push(h('div', { class: 'field' }, search));
      }
      paint('');
      kids.push(list);
      return { body: h('div', {}, kids), footer: null };
    }
  }).promise;
}

// A dropdown-style button that opens openPickList. o: { placeholder, hint, guard(): message|null, onChange(value) }
function pickerField(obj, key, label, getOptions, o) {
  o = o || {};
  var id = uid('pick');
  var button = h('button', { type: 'button', class: 'picker-btn', id: id, 'aria-haspopup': 'dialog' });
  function paint() {
    clearNode(button);
    button.appendChild(h('span', { class: obj[key] ? '' : 'placeholder', text: obj[key] || o.placeholder || 'Select' }));
    button.appendChild(Icon('down'));
  }
  button.addEventListener('click', function () {
    var problem = o.guard ? o.guard() : null;
    if (problem) { UI.toast(problem, 'error'); return; }
    openPickList(label, getOptions(), obj[key]).then(function (value) {
      if (value === undefined) return;
      obj[key] = value;
      paint();
      var field = button.closest('.field');
      if (field) { field.classList.remove('has-error'); var msg = field.querySelector('.field-error'); if (msg) msg.textContent = ''; }
      if (o.onChange) o.onChange(value);
    });
  });
  paint();
  var wrap = fieldWrap(label, button, key, o.hint, id);
  wrap.repaint = paint;
  return wrap;
}

// Single or multiple choice chips. o: { multi, max, onChange }
function chipGroup(obj, key, options, o) {
  o = o || {};
  var box = h('div', { class: 'chips', role: o.multi ? 'group' : 'radiogroup' });
  var buttons = options.map(function (opt) {
    var b = h('button', { type: 'button', class: 'chip', text: opt });
    b.addEventListener('click', function () {
      if (o.multi) {
        var at = obj[key].indexOf(opt);
        if (at === -1) {
          if (o.max && obj[key].length >= o.max) { UI.toast('You can choose up to ' + o.max + '.', 'error'); return; }
          obj[key].push(opt);
        } else {
          obj[key].splice(at, 1);
        }
      } else {
        obj[key] = opt;
      }
      refresh();
      if (o.onChange) o.onChange(opt);
    });
    box.appendChild(b);
    return b;
  });
  function refresh() {
    buttons.forEach(function (b, i) {
      var on = o.multi ? obj[key].indexOf(options[i]) !== -1 : obj[key] === options[i];
      b.classList.toggle('on', on);
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
  }
  refresh();
  return box;
}

// Radio-style cards. options: strings or { value, label, sub }
function optionCards(obj, key, options, o) {
  o = o || {};
  var box = h('div', { class: 'opt-list', role: 'radiogroup' });
  var cards = options.map(function (opt) {
    var item = typeof opt === 'string' ? { value: opt, label: opt } : opt;
    var card = h('button', { type: 'button', class: 'opt-card', role: 'radio' }, [
      h('span', { class: 'opt-text' }, [h('span', { text: item.label }), item.sub ? h('span', { class: 'opt-sub', text: item.sub }) : null]),
      h('span', { class: 'radio-dot', 'aria-hidden': 'true' })
    ]);
    card._value = item.value;
    card.addEventListener('click', function () { obj[key] = item.value; refresh(); if (o.onChange) o.onChange(item.value); });
    box.appendChild(card);
    return card;
  });
  function refresh() {
    cards.forEach(function (card) {
      var on = obj[key] === card._value;
      card.classList.toggle('on', on);
      card.setAttribute('aria-checked', on ? 'true' : 'false');
    });
  }
  refresh();
  return box;
}

function segmented(obj, key, options, label) {
  var box = h('div', { class: 'segmented', role: 'radiogroup', 'aria-label': label || key });
  var buttons = options.map(function (opt) {
    var b = h('button', { type: 'button', role: 'radio', text: opt });
    b.addEventListener('click', function () { obj[key] = opt; refresh(); });
    box.appendChild(b);
    return b;
  });
  function refresh() {
    buttons.forEach(function (b, i) {
      var on = obj[key] === options[i];
      b.classList.toggle('on', on);
      b.setAttribute('aria-checked', on ? 'true' : 'false');
    });
  }
  refresh();
  return box;
}

function stepper(obj, key, min, max, label) {
  var out = h('output', { 'aria-live': 'polite', text: String(obj[key]) });
  var minus = h('button', { type: 'button', 'aria-label': 'Decrease ' + label }, Icon('minus'));
  var plus = h('button', { type: 'button', 'aria-label': 'Increase ' + label }, Icon('plus'));
  function paint() {
    out.textContent = String(obj[key]);
    minus.disabled = obj[key] <= min;
    plus.disabled = obj[key] >= max;
  }
  minus.addEventListener('click', function () { obj[key] = Math.max(min, obj[key] - 1); paint(); });
  plus.addEventListener('click', function () { obj[key] = Math.min(max, obj[key] + 1); paint(); });
  paint();
  return h('div', { class: 'stepper' }, [minus, out, plus]);
}

function switchButton(checked, label, onChange) {
  var button = h('button', { type: 'button', class: 'switch', role: 'switch', 'aria-label': label, 'aria-checked': checked ? 'true' : 'false' });
  button.addEventListener('click', function () {
    var next = button.getAttribute('aria-checked') !== 'true';
    button.setAttribute('aria-checked', next ? 'true' : 'false');
    onChange(next);
  });
  return button;
}

/* ---------- Fake file picker (demo only) ---------- */

function pickFakeFile(title, files) {
  return UI.sheet({
    title: title,
    dismissValue: undefined,
    render: function (close) {
      var list = h('div', { class: 'pick-list' }, files.map(function (name) {
        return h('button', { type: 'button', class: 'pick-item', onClick: function () { close(name); } }, [
          h('span', { class: 'btn-content' }, [Icon('file'), h('span', { text: name })])
        ]);
      }));
      return { body: h('div', {}, [h('p', { class: 'muted', text: 'Choose a file from your phone.' }), list]), footer: null };
    }
  }).promise;
}

// Upload card that turns into a file chip once a file is chosen.
function fileField(obj, key, label, files, o) {
  o = o || {};
  var holder = h('div');
  function paint() {
    clearNode(holder);
    if (obj[key]) {
      holder.appendChild(h('div', { class: 'file-chip' }, [
        Icon('check'),
        h('span', { class: 'name', text: obj[key] }),
        h('button', { type: 'button', class: 'icon-btn', 'aria-label': 'Remove ' + obj[key], onClick: function () { obj[key] = ''; paint(); UI.toast('File removed', 'info'); } }, Icon('trash'))
      ]));
    } else {
      holder.appendChild(h('button', {
        type: 'button', class: 'upload-card',
        onClick: function () {
          pickFakeFile(label, files).then(function (name) {
            if (!name) return;
            obj[key] = name;
            paint();
            var field = holder.closest('.field');
            if (field) { field.classList.remove('has-error'); var msg = field.querySelector('.field-error'); if (msg) msg.textContent = ''; }
            UI.toast('File added');
          });
        }
      }, [Icon('upload'), h('strong', { text: o.cta || 'Tap to upload' }), h('span', { class: 'muted', text: o.formats || 'PDF, JPG or PNG' })]));
    }
  }
  paint();
  return fieldWrap(label, holder, key, o.hint);
}

/* =====================================================================
   PART 1B: ONBOARDING WIZARD (one question per screen)
   ===================================================================== */

var ONBOARDING = ['profileFor', 'gender', 'name', 'dob', 'marital', 'height', 'community', 'location', 'education', 'work', 'lifestyle', 'horoscope', 'family', 'about', 'partner', 'photos', 'documents', 'review'];

// While editing from Review, a few steps belong together and continue one after another.
var EDIT_NEXT = { profileFor: 'gender', name: 'dob', dob: 'marital', marital: 'height' };

function startEditing(step) {
  State.editing = true;
  State.editBase = Router.index();
  Router.go(step);
}

function finishOrContinueEditing(step) {
  if (EDIT_NEXT[step]) { Router.go(EDIT_NEXT[step]); return; }
  State.editing = false;
  Router.backBy(Router.index() - State.editBase);
}

// cfg: { title, helper, optional, nextText, render(content), validate() -> errors, mounted(content) }
function registerStep(name, cfg) {
  Router.register(name, function () {
    var index = ONBOARDING.indexOf(name);
    var total = ONBOARDING.length;
    var content = h('div', { class: 'q-content' });
    var body = [
      h('h1', { class: 'q-title', text: typeof cfg.title === 'function' ? cfg.title() : cfg.title }),
      cfg.helper ? h('p', { class: 'q-helper', text: typeof cfg.helper === 'function' ? cfg.helper() : cfg.helper }) : null,
      content
    ];
    cfg.render(content);

    function goNext() {
      if (State.editing) finishOrContinueEditing(name);
      else Router.go(ONBOARDING[index + 1]);
    }
    function proceed() {
      var errors = cfg.validate ? cfg.validate() : [];
      if (errors.length) { showErrors(content, errors); return; }
      goNext();
    }

    var skip = cfg.optional ? h('button', { type: 'button', class: 'link-btn', text: 'Skip', onClick: goNext }) : null;
    var screen = Screen({
      back: true, progress: { from: index / total, to: (index + 1) / total }, right: skip,
      body: body, footer: bigButton(cfg.nextText || 'Next', proceed)
    });
    clearErrorsOnEdit(content);
    content.addEventListener('keydown', function (event) {
      if (event.key === 'Enter' && event.target.tagName === 'INPUT') { event.preventDefault(); proceed(); }
    });
    return {
      el: screen.el, title: 'Create profile',
      mounted: function () { screen.mounted(); if (cfg.mounted) cfg.mounted(content); }
    };
  }, { auth: 'login' });
}

function isBlank(value) { return !String(value || '').trim(); }
function cap(text) { return text ? text.charAt(0).toUpperCase() + text.slice(1) : ''; }
function whoText(own, other) { return State.profile.profileFor === 'Myself' ? own : other; }

/* ---------- 5. Profile created for ---------- */
registerStep('profileFor', {
  title: 'Who are you creating this profile for?',
  helper: 'This helps us ask the right questions.',
  render: function (content) {
    var p = State.profile;
    var grid = h('div', { class: 'avatar-grid', role: 'radiogroup', 'aria-label': 'Profile created for' });
    var cards = OPTIONS.profileFor.map(function (opt) {
      var card = h('button', { type: 'button', class: 'avatar-card', role: 'radio' }, [
        h('img', { src: PROFILE_FOR_ART[opt.value], alt: '' }), h('span', { text: opt.value })
      ]);
      card.addEventListener('click', function () {
        p.profileFor = opt.value;
        if (opt.gender) p.gender = opt.gender;
        refresh();
      });
      grid.appendChild(card);
      return card;
    });
    function refresh() {
      cards.forEach(function (card, i) {
        var on = p.profileFor === OPTIONS.profileFor[i].value;
        card.classList.toggle('on', on);
        card.setAttribute('aria-checked', on ? 'true' : 'false');
      });
    }
    refresh();
    content.appendChild(fieldWrap('', grid, 'profileFor'));
  },
  validate: function () { return State.profile.profileFor ? [] : [['profileFor', 'Please choose one option to continue.']]; }
});

/* ---------- 6. Gender ---------- */
registerStep('gender', {
  title: 'Select gender',
  helper: 'This decides which matches you will see.',
  render: function (content) {
    var p = State.profile;
    var grid = h('div', { class: 'gender-grid', role: 'radiogroup', 'aria-label': 'Gender' });
    var cards = ['male', 'female'].map(function (value) {
      var card = h('button', { type: 'button', class: 'gender-card', role: 'radio' }, [
        h('img', { src: GENDER_ART[value], alt: '' }),
        h('span', { text: cap(value) }),
        h('span', { class: 'tick', 'aria-hidden': 'true' }, Icon('check'))
      ]);
      card.addEventListener('click', function () { p.gender = value; refresh(); });
      grid.appendChild(card);
      return card;
    });
    function refresh() {
      cards.forEach(function (card, i) {
        var on = p.gender === ['male', 'female'][i];
        card.classList.toggle('on', on);
        card.setAttribute('aria-checked', on ? 'true' : 'false');
      });
    }
    refresh();
    content.appendChild(fieldWrap('', grid, 'gender'));
    content.appendChild(h('div', { class: 'warn-note' }, [Icon('alert'), h('span', { text: 'Please double check, you cannot change this later.' })]));
  },
  validate: function () { return State.profile.gender ? [] : [['gender', 'Please select male or female.']]; }
});

/* ---------- 7. Name ---------- */
registerStep('name', {
  title: function () { return whoText('What is your name?', 'What is the name?'); },
  helper: 'Enter the name exactly as it should appear on the profile.',
  render: function (content) {
    var p = State.profile;
    content.appendChild(textInput(p, 'firstName', 'First name', { maxlength: 30, autocomplete: 'given-name', placeholder: 'First name' }));
    content.appendChild(textInput(p, 'lastName', 'Last name', { maxlength: 30, autocomplete: 'family-name', placeholder: 'Last name' }));
  },
  validate: function () {
    var p = State.profile;
    var errors = [];
    p.firstName = p.firstName.trim();
    p.lastName = p.lastName.trim();
    if (p.firstName.length < 2) errors.push(['firstName', 'Please enter the first name (at least 2 letters).']);
    if (p.lastName.length < 2) errors.push(['lastName', 'Please enter the last name (at least 2 letters).']);
    return errors;
  }
});

/* ---------- 8. Date of birth ---------- */
registerStep('dob', {
  title: function () { return whoText('What is your date of birth?', 'What is the date of birth?'); },
  helper: 'The age is worked out for you.',
  render: function (content) {
    var p = State.profile;
    var ageLine = h('div', { class: 'age-line', 'aria-live': 'polite' });
    function paintAge() {
      var age = calcAge(p.dobDay, p.dobMonth, p.dobYear);
      ageLine.hidden = age === null;
      if (age !== null) ageLine.textContent = 'Age: ' + age + ' years';
    }
    function select(key, label, values, placeholder) {
      var sel = h('select', { class: 'select', 'aria-label': label }, [h('option', { value: '', text: placeholder })].concat(
        values.map(function (v) { return h('option', { value: String(v), text: String(v) }); })
      ));
      sel.value = p[key];
      sel.addEventListener('change', function () { p[key] = sel.value; paintAge(); });
      return sel;
    }
    var days = []; for (var d = 1; d <= 31; d++) days.push(d);
    var years = []; for (var y = new Date().getFullYear() - 18; y >= new Date().getFullYear() - 60; y--) years.push(y);
    var row = h('div', { class: 'row-3' }, [select('dobDay', 'Day', days, 'Day'), select('dobMonth', 'Month', MONTHS, 'Month'), select('dobYear', 'Year', years, 'Year')]);
    var wrap = fieldWrap('', h('div', {}, [row, ageLine]), 'dob');
    content.appendChild(wrap);
    paintAge();
  },
  validate: function () {
    var p = State.profile;
    if (!p.dobDay || !p.dobMonth || !p.dobYear) return [['dob', 'Please select the day, month and year.']];
    var month = MONTHS.indexOf(p.dobMonth);
    var date = new Date(Number(p.dobYear), month, Number(p.dobDay));
    if (date.getMonth() !== month) return [['dob', 'This date does not exist. Please check the day.']];
    if (calcAge(p.dobDay, p.dobMonth, p.dobYear) < 18) return [['dob', 'The profile must be for someone who is 18 or older.']];
    return [];
  }
});

/* ---------- 9. Marital status ---------- */
registerStep('marital', {
  title: 'What is the marital status?',
  helper: 'Please choose the one that fits best.',
  render: function (content) {
    content.appendChild(fieldWrap('', optionCards(State.profile, 'maritalStatus', OPTIONS.maritalStatus), 'maritalStatus'));
  },
  validate: function () { return State.profile.maritalStatus ? [] : [['maritalStatus', 'Please select the marital status.']]; }
});

/* ---------- 10. Height (scroll picker) ---------- */
registerStep('height', {
  title: function () { return whoText('How tall are you?', 'How tall is ' + (State.profile.firstName || 'the person') + '?'); },
  helper: 'Scroll to select the height.',
  render: function (content) {
    var p = State.profile;
    var MIN = 48;
    var MAX = 84;
    var readout = h('div', { class: 'height-readout' }, [h('strong'), h('span', { class: 'muted' })]);
    var wheel = h('div', { class: 'wheel', tabindex: '0', role: 'listbox', 'aria-label': 'Height' });
    var items = [];
    for (var inches = MIN; inches <= MAX; inches++) {
      items.push(h('div', { class: 'wheel-item', role: 'option', 'data-in': String(inches), text: Math.floor(inches / 12) + '′ ' + (inches % 12) + '″' }));
    }
    items.forEach(function (item) { wheel.appendChild(item); });

    function paint() {
      readout.firstChild.textContent = fmtHeight(p.heightIn);
      readout.lastChild.textContent = cmFromInches(p.heightIn) + ' cm';
      items.forEach(function (item, i) {
        var on = MIN + i === p.heightIn;
        item.classList.toggle('on', on);
        item.setAttribute('aria-selected', on ? 'true' : 'false');
      });
    }
    function scrollToValue(value, smooth) {
      wheel.scrollTo({ top: (value - MIN) * 56, behavior: smooth ? 'smooth' : 'auto' });
    }
    wheel.addEventListener('scroll', debounce(function () {
      var value = MIN + Math.max(0, Math.min(items.length - 1, Math.round(wheel.scrollTop / 56)));
      if (value !== p.heightIn) { p.heightIn = value; paint(); }
    }, 60));
    wheel.addEventListener('click', function (event) {
      var item = event.target.closest('.wheel-item');
      if (item) { p.heightIn = Number(item.getAttribute('data-in')); paint(); scrollToValue(p.heightIn, true); }
    });
    wheel.addEventListener('keydown', function (event) {
      var step = event.key === 'ArrowUp' ? -1 : event.key === 'ArrowDown' ? 1 : 0;
      if (!step) return;
      event.preventDefault();
      p.heightIn = Math.max(MIN, Math.min(MAX, p.heightIn + step));
      paint();
      scrollToValue(p.heightIn, true);
    });
    content.appendChild(readout);
    content.appendChild(h('div', { class: 'wheel-wrap' }, wheel));
    content._scrollToValue = function () { scrollToValue(p.heightIn, false); };
    paint();
  },
  mounted: function (content) { content._scrollToValue(); }
});

/* ---------- 11. Community details ---------- */
registerStep('community', {
  title: 'Community details',
  helper: 'This helps families from the same community find each other.',
  render: function (content) {
    var p = State.profile;
    var communityField;
    var religion = pickerField(p, 'religion', 'Religion', function () { return OPTIONS.religions; }, {
      onChange: function () { p.community = ''; communityField.repaint(); }
    });
    communityField = pickerField(p, 'community', 'Community', function () { return OPTIONS.communities[p.religion] || []; }, {
      guard: function () { return p.religion ? null : 'Please select the religion first.'; }
    });
    content.appendChild(religion);
    content.appendChild(communityField);
    content.appendChild(pickerField(p, 'subCommunity', 'Sub-community (sub-caste)', function () { return OPTIONS.subCommunities; }, { hint: 'Optional' }));
    content.appendChild(pickerField(p, 'gotra', 'Gotra', function () { return OPTIONS.gotras; }, { hint: 'Optional' }));
    content.appendChild(pickerField(p, 'motherTongue', 'Mother tongue', function () { return OPTIONS.languages; }));
  },
  validate: function () {
    var p = State.profile;
    var errors = [];
    if (!p.religion) errors.push(['religion', 'Please select the religion.']);
    if (!p.community) errors.push(['community', 'Please select the community.']);
    if (!p.motherTongue) errors.push(['motherTongue', 'Please select the mother tongue.']);
    return errors;
  }
});

/* ---------- 12. Location ---------- */
registerStep('location', {
  title: function () { return whoText('Where do you live?', 'Where does ' + (State.profile.firstName || 'the person') + ' live?'); },
  helper: 'Your city helps us show nearby matches.',
  render: function (content) {
    var p = State.profile;
    var stateField;
    var cityField;
    var countryField = pickerField(p, 'country', 'Country', function () { return OPTIONS.countries; }, {
      onChange: function () { p.state = ''; p.city = ''; stateField.repaint(); cityField.repaint(); }
    });
    stateField = pickerField(p, 'state', 'State', function () { return statesOf(p.country); }, {
      guard: function () { return p.country ? null : 'Please select the country first.'; },
      onChange: function () { p.city = ''; cityField.repaint(); }
    });
    cityField = pickerField(p, 'city', 'City', function () { return citiesOf(p.country, p.state); }, {
      guard: function () { return p.state ? null : 'Please select the state first.'; }
    });
    content.appendChild(countryField);
    content.appendChild(stateField);
    content.appendChild(cityField);
    content.appendChild(pickerField(p, 'residency', 'Residency status', function () { return OPTIONS.residency; }, { hint: 'Optional' }));
    content.appendChild(fieldWrap('Living with family?', segmented(p, 'livingWithFamily', ['Yes', 'No'], 'Living with family'), 'livingWithFamily'));
  },
  validate: function () {
    var p = State.profile;
    var errors = [];
    if (!p.state) errors.push(['state', 'Please select the state.']);
    if (!p.city) errors.push(['city', 'Please select the city.']);
    return errors;
  }
});

/* ---------- 13. Education ---------- */
registerStep('education', {
  title: 'Education',
  helper: 'Tell us about the highest qualification.',
  render: function (content) {
    var p = State.profile;
    content.appendChild(pickerField(p, 'education', 'Highest qualification', function () { return OPTIONS.qualifications; }));
    content.appendChild(textInput(p, 'college', 'College or university', { maxlength: 60, placeholder: 'Name of the college', hint: 'Optional' }));
    content.appendChild(pickerField(p, 'fieldOfStudy', 'Field of study', function () { return OPTIONS.fields; }, { hint: 'Optional' }));
  },
  validate: function () { return State.profile.education ? [] : [['education', 'Please select the highest qualification.']]; }
});

/* ---------- 14. Work ---------- */
registerStep('work', {
  title: 'Work and income',
  helper: 'This is shown on the profile to approved members.',
  render: function (content) {
    var p = State.profile;
    content.appendChild(fieldWrap('Employment type', chipGroup(p, 'employment', OPTIONS.employment), 'employment'));
    content.appendChild(pickerField(p, 'profession', 'Profession', function () { return OPTIONS.professions; }));
    content.appendChild(textInput(p, 'company', 'Company or organisation', { maxlength: 60, placeholder: 'Where do you work?', hint: 'Optional' }));
    content.appendChild(pickerField(p, 'income', 'Annual income', function () { return OPTIONS.incomes; }, { hint: 'Optional' }));
  },
  validate: function () {
    var p = State.profile;
    var errors = [];
    if (!p.employment) errors.push(['employment', 'Please select the employment type.']);
    if (!p.profession) errors.push(['profession', 'Please select the profession.']);
    return errors;
  }
});

/* ---------- 15. Lifestyle ---------- */
registerStep('lifestyle', {
  title: 'Lifestyle and interests',
  helper: 'Small details that help find a good match.',
  render: function (content) {
    var p = State.profile;
    content.appendChild(fieldWrap('Diet', chipGroup(p, 'diet', OPTIONS.diets), 'diet'));
    content.appendChild(fieldWrap('Drinking', chipGroup(p, 'drinking', OPTIONS.habits), 'drinking'));
    content.appendChild(fieldWrap('Smoking', chipGroup(p, 'smoking', OPTIONS.habits), 'smoking'));
    content.appendChild(fieldWrap('Hobbies and interests', chipGroup(p, 'hobbies', OPTIONS.hobbies, { multi: true, max: 6 }), 'hobbies', 'Choose up to 6.'));
  },
  validate: function () { return State.profile.diet ? [] : [['diet', 'Please select the diet.']]; }
});

/* ---------- 16. Horoscope (optional) ---------- */
registerStep('horoscope', {
  title: 'Horoscope details',
  helper: 'Optional. You can skip this and add it later.',
  optional: true,
  render: function (content) {
    var p = State.profile;
    content.appendChild(textInput(p, 'birthTime', 'Time of birth', { type: 'time' }));
    content.appendChild(textInput(p, 'birthPlace', 'Place of birth', { maxlength: 40, placeholder: 'City of birth' }));
    content.appendChild(fieldWrap('Manglik', chipGroup(p, 'manglik', OPTIONS.manglik), 'manglik'));
    content.appendChild(pickerField(p, 'rashi', 'Rashi', function () { return OPTIONS.rashi; }));
    content.appendChild(pickerField(p, 'nakshatra', 'Nakshatra', function () { return OPTIONS.nakshatra; }));
    content.appendChild(fileField(p, 'kundali', 'Kundali', OPTIONS.sampleKundali, { cta: 'Upload kundali', formats: 'PDF, JPG or PNG' }));
  }
});

/* ---------- 17. Family details ---------- */
registerStep('family', {
  title: 'Family details',
  helper: 'Families matter. A few details about the family.',
  render: function (content) {
    var p = State.profile;
    content.appendChild(pickerField(p, 'fatherOcc', 'Father’s occupation', function () { return OPTIONS.fatherOcc; }));
    content.appendChild(pickerField(p, 'motherOcc', 'Mother’s occupation', function () { return OPTIONS.motherOcc; }));
    content.appendChild(h('div', { class: 'row-2' }, [
      fieldWrap('Brothers', stepper(p, 'brothers', 0, 6, 'brothers')),
      fieldWrap('Sisters', stepper(p, 'sisters', 0, 6, 'sisters'))
    ]));
    content.appendChild(fieldWrap('Family type', segmented(p, 'familyType', OPTIONS.familyTypes, 'Family type'), 'familyType'));
    content.appendChild(fieldWrap('Family values', chipGroup(p, 'familyValues', OPTIONS.familyValues), 'familyValues'));
    content.appendChild(pickerField(p, 'familyIncome', 'Family income', function () { return OPTIONS.familyIncomes; }, { hint: 'Optional' }));
    content.appendChild(textInput(p, 'nativePlace', 'Native place', { maxlength: 40, placeholder: 'Family’s home town', hint: 'Optional' }));
  },
  validate: function () {
    var p = State.profile;
    var errors = [];
    if (!p.fatherOcc) errors.push(['fatherOcc', 'Please select the father’s occupation.']);
    if (!p.motherOcc) errors.push(['motherOcc', 'Please select the mother’s occupation.']);
    if (!p.familyType) errors.push(['familyType', 'Please select the family type.']);
    return errors;
  }
});

/* ---------- 18. About me ---------- */

// A friendly sample paragraph built from what was already entered.
function composeAbout() {
  var p = State.profile;
  var self = !p.profileFor || p.profileFor === 'Myself';
  var subject = self ? 'I am' : (p.firstName || 'This person') + ' is';
  var pronoun = self ? 'I' : (p.gender === 'female' ? 'She' : 'He');
  var job = (p.profession || 'working professional').toLowerCase();
  var place = p.city ? ' based in ' + p.city : '';
  var hobbies = p.hobbies.length ? p.hobbies.slice(0, 3).join(', ').toLowerCase() : 'spending time with family';
  return subject + ' a ' + job + place + '. Family values and honesty are very important. ' +
    pronoun + (self ? ' enjoy ' : ' enjoys ') + hobbies + '. ' +
    (self ? 'I am' : (p.gender === 'female' ? 'She is' : 'He is')) +
    ' looking for a kind, educated and understanding life partner to build a happy home together.';
}

registerStep('about', {
  title: function () { return whoText('Tell us about yourself', 'Tell us about ' + (State.profile.firstName || 'the person')); },
  helper: 'A few warm lines make a great first impression.',
  render: function (content) {
    var p = State.profile;
    var limit = 500;
    var area = h('textarea', { class: 'input', id: 'about-text', maxlength: String(limit), placeholder: 'Write a few lines about interests, values and what matters to you.', 'aria-describedby': 'about-count' });
    var counter = h('p', { class: 'hint', id: 'about-count', 'aria-live': 'polite' });
    area.value = p.about;
    function paint() { counter.textContent = area.value.length + ' / ' + limit + ' characters'; }
    area.addEventListener('input', function () { p.about = area.value; paint(); });
    var helpButton = h('button', { type: 'button', class: 'btn btn-outline btn-small' }, [Icon('star', 20), 'Help me write']);
    helpButton.addEventListener('click', function () {
      helpButton.disabled = true;
      helpButton.textContent = 'Writing...';
      setTimeout(function () {
        area.value = composeAbout().slice(0, limit);
        p.about = area.value;
        paint();
        helpButton.disabled = false;
        clearNode(helpButton);
        helpButton.appendChild(Icon('star', 20));
        helpButton.appendChild(document.createTextNode('Help me write'));
        UI.toast('We wrote a draft. You can change it.');
      }, 700);
    });
    content.appendChild(fieldWrap('About', area, 'about', null, 'about-text'));
    content.appendChild(counter);
    content.appendChild(helpButton);
    paint();
  }
});

/* ---------- 19. Partner preferences ---------- */

var PREF_ROWS = [
  { key: 'marital', label: 'Marital status', options: OPTIONS.maritalStatus },
  { key: 'religion', label: 'Religion', options: OPTIONS.religions },
  { key: 'education', label: 'Education', options: ['Graduate', 'Post graduate', 'Professional degree', 'Doctorate', 'Diploma'] },
  { key: 'profession', label: 'Profession', options: OPTIONS.professions },
  { key: 'income', label: 'Income', options: OPTIONS.incomes },
  { key: 'location', label: 'Location', options: ['Pune', 'Mumbai', 'Jaipur', 'Indore', 'New Delhi', 'Ahmedabad', 'Bengaluru', 'Hyderabad'] },
  { key: 'diet', label: 'Diet', options: OPTIONS.diets },
  { key: 'manglik', label: 'Manglik', options: ['No', 'Yes', 'Anshik'] }
];

function rangeBlock(label, prefs, minKey, maxKey, lo, hi, format) {
  var line = h('div', { class: 'range-line' }, [h('span', { class: 'field-label', text: label }), h('strong', { 'aria-live': 'polite' })]);
  var minInput = h('input', { type: 'range', min: String(lo), max: String(hi), 'aria-label': label + ' from' });
  var maxInput = h('input', { type: 'range', min: String(lo), max: String(hi), 'aria-label': label + ' up to' });
  minInput.value = prefs[minKey];
  maxInput.value = prefs[maxKey];
  function paint() { line.lastChild.textContent = format(prefs[minKey]) + ' to ' + format(prefs[maxKey]); }
  minInput.addEventListener('input', function () {
    prefs[minKey] = Number(minInput.value);
    if (prefs[minKey] > prefs[maxKey]) { prefs[maxKey] = prefs[minKey]; maxInput.value = prefs[maxKey]; }
    paint();
  });
  maxInput.addEventListener('input', function () {
    prefs[maxKey] = Number(maxInput.value);
    if (prefs[maxKey] < prefs[minKey]) { prefs[minKey] = prefs[maxKey]; minInput.value = prefs[minKey]; }
    paint();
  });
  paint();
  return h('div', { class: 'field' }, [line, minInput, maxInput]);
}

registerStep('partner', {
  title: 'Partner preferences',
  helper: 'All optional. Keep "Open to all" on if you have no preference.',
  render: function (content) {
    var prefs = State.profile.prefs;
    content.appendChild(rangeBlock('Age', prefs, 'ageMin', 'ageMax', 18, 60, function (v) { return v + ' yrs'; }));
    content.appendChild(rangeBlock('Height', prefs, 'heightMin', 'heightMax', 48, 84, fmtHeight));
    PREF_ROWS.forEach(function (row) {
      var chipsBox = h('div', { class: 'pref-chips' }, chipGroup(prefs, row.key, row.options, { multi: true }));
      chipsBox.hidden = prefs.open[row.key];
      var toggle = switchButton(prefs.open[row.key], 'Open to all ' + row.label, function (on) {
        prefs.open[row.key] = on;
        chipsBox.hidden = on;
        if (on) prefs[row.key] = [];
      });
      content.appendChild(h('div', { class: 'pref-row' }, [
        h('div', { class: 'pref-head' }, [
          h('span', { class: 'pref-name', text: row.label }),
          h('span', { class: 'open-label' }, [h('span', { text: 'Open to all' }), toggle])
        ]),
        chipsBox
      ]));
    });
  }
});

/* ---------- 20. Photos ---------- */

var MAX_PHOTOS = 6;

// Photos from the fake gallery picker: tap to select, then Add.
function openGalleryPicker(photos, onAdded) {
  var room = MAX_PHOTOS - photos.length;
  if (room <= 0) { UI.toast('You can add up to ' + MAX_PHOTOS + ' photos.', 'error'); return; }
  var chosen = [];
  UI.sheet({
    title: 'Choose photos',
    dismissValue: null,
    render: function (close) {
      var addBtn = h('button', { type: 'button', class: 'btn btn-primary', text: 'Add photos', disabled: true });
      var grid = h('div', { class: 'gallery-pick' });
      GALLERY_SAMPLES.forEach(function (src, i) {
        var b = h('button', { type: 'button', 'aria-label': 'Photo ' + (i + 1), 'aria-pressed': 'false' }, [h('img', { src: src, alt: '' }), h('span', { class: 'check' }, Icon('check'))]);
        b.addEventListener('click', function () {
          var at = chosen.indexOf(src);
          if (at === -1) {
            if (chosen.length >= room) { UI.toast('You can add ' + room + ' more photo' + (room === 1 ? '' : 's') + '.', 'error'); return; }
            chosen.push(src);
          } else {
            chosen.splice(at, 1);
          }
          b.classList.toggle('on', at === -1);
          b.setAttribute('aria-pressed', at === -1 ? 'true' : 'false');
          addBtn.disabled = !chosen.length;
          addBtn.textContent = chosen.length ? 'Add ' + chosen.length + ' photo' + (chosen.length === 1 ? '' : 's') : 'Add photos';
        });
        grid.appendChild(b);
      });
      addBtn.addEventListener('click', function () { close(chosen.slice()); });
      return { body: grid, footer: addBtn };
    }
  }).promise.then(function (list) {
    if (list && list.length) { onAdded(list); UI.toast(list.length + ' photo' + (list.length === 1 ? '' : 's') + ' added'); }
  });
}

// A pretend camera: a face guide and a shutter button.
function openSelfie(photos, onAdded) {
  if (photos.length >= MAX_PHOTOS) { UI.toast('You can add up to ' + MAX_PHOTOS + ' photos.', 'error'); return; }
  UI.sheet({
    title: 'Take a selfie',
    dismissValue: null,
    render: function (close) {
      var flash = h('div', { class: 'flash' });
      var camera = h('div', { class: 'camera', 'aria-label': 'Camera preview' }, [h('div', { class: 'face-guide' }), flash]);
      var shutter = h('button', { type: 'button', class: 'btn btn-primary', text: 'Capture' });
      shutter.addEventListener('click', function () {
        shutter.disabled = true;
        flash.classList.add('go');
        setTimeout(function () {
          close(makeAvatar({
            gender: State.profile.gender || 'male', skin: SKINS[1], hair: State.profile.gender === 'female' ? 'long' : 'short',
            hairColor: HAIR_COLORS[0], bg: BACKGROUNDS[photos.length % BACKGROUNDS.length], cloth: CLOTHES[photos.length % CLOTHES.length]
          }));
        }, 450);
      });
      return { body: h('div', {}, [camera, h('p', { class: 'muted center', text: 'Keep your face inside the circle.' })]), footer: shutter };
    }
  }).promise.then(function (src) {
    if (src) { onAdded([src]); UI.toast('Selfie added'); }
  });
}

registerStep('photos', {
  title: 'Add your photos',
  helper: 'The first photo is the main photo.',
  render: function (content) {
    var p = State.profile;
    var grid = h('div', { class: 'photo-grid' });
    function paint() {
      clearNode(grid);
      for (var i = 0; i < MAX_PHOTOS; i++) {
        var slot = h('div', { class: 'photo-slot' });
        if (p.photos[i]) {
          (function (index) {
            slot.appendChild(h('img', { src: p.photos[index], alt: 'Photo ' + (index + 1) }));
            slot.appendChild(h('button', {
              type: 'button', class: 'remove', 'aria-label': 'Remove photo ' + (index + 1),
              onClick: function () { p.photos.splice(index, 1); paint(); UI.toast('Photo removed', 'info'); }
            }, Icon('close')));
            if (index === 0) slot.appendChild(h('span', { class: 'main-tag', text: 'Main' }));
          })(i);
        } else {
          slot.appendChild(h('button', { type: 'button', class: 'add', 'aria-label': 'Add a photo', onClick: function () { openGalleryPicker(p.photos, added); } }, Icon('plus', 30)));
        }
        grid.appendChild(slot);
      }
    }
    function added(list) { list.forEach(function (src) { if (p.photos.length < MAX_PHOTOS) p.photos.push(src); }); paint(); }

    content.appendChild(grid);
    content.appendChild(h('div', { class: 'btn-row' }, [
      h('button', { type: 'button', class: 'btn btn-outline btn-small', onClick: function () { openGalleryPicker(p.photos, added); } }, [Icon('image', 20), 'Add from gallery']),
      h('button', { type: 'button', class: 'btn btn-outline btn-small', onClick: function () { openSelfie(p.photos, added); } }, [Icon('camera', 20), 'Take selfie'])
    ]));
    content.appendChild(h('h3', { class: 'section-label', text: 'Photo tips' }));
    content.appendChild(h('ul', { class: 'tips' }, [
      h('li', { text: 'Use a clear photo of your face.' }), h('li', { text: 'Avoid group photos and sunglasses.' }), h('li', { text: 'Good light makes a big difference.' })
    ]));
    content.appendChild(h('h3', { class: 'section-label', text: 'Who can see my photos?' }));
    content.appendChild(optionCards(p, 'photoPrivacy', OPTIONS.photoPrivacy));
    paint();
  }
});

/* ---------- 21. Biodata and documents (optional) ---------- */
registerStep('documents', {
  title: 'Biodata and documents',
  helper: 'Optional. You can add these later.',
  optional: true,
  render: function (content) {
    var p = State.profile;
    content.appendChild(fileField(p, 'biodataFile', 'Biodata', OPTIONS.sampleFiles, { cta: 'Upload biodata', formats: 'PDF, JPG or PNG' }));
    content.appendChild(fieldWrap('ID proof type', chipGroup(p, 'idType', OPTIONS.idTypes), 'idType'));
    content.appendChild(fileField(p, 'idFile', 'ID proof', OPTIONS.sampleIdFiles, { cta: 'Upload ID proof', formats: 'Aadhaar, PAN or Driving licence' }));
    content.appendChild(h('div', { class: 'info-note' }, [Icon('lock'), h('span', { text: 'Used only for verification, never shown to members.' })]));
  }
});

/* =====================================================================
   PART 1C: SPLASH, WELCOME, LOGIN, OTP, CHOICE, BIODATA PATH, REVIEW
   ===================================================================== */

var INDIA_FLAG = '<svg class="flag" viewBox="0 0 28 20" aria-hidden="true"><rect width="28" height="7" fill="#FF9933"/><rect y="7" width="28" height="6" fill="#fff"/><rect y="13" width="28" height="7" fill="#138808"/><circle cx="14" cy="10" r="2.4" fill="none" stroke="#000080" stroke-width="0.8"/></svg>';

function logoMark() {
  var mark = h('div', { class: 'logo-mark', 'aria-hidden': 'true' });
  mark.innerHTML = '<svg viewBox="0 0 48 48"><circle cx="19" cy="24" r="10"/><circle cx="29" cy="24" r="10"/><path d="M24 15.5c2.2 2.4 2.2 6.8 0 9"/></svg>';
  return mark;
}

/* ---------- 1. Splash ---------- */
Router.register('splash', function () {
  var timer = null;
  var el = h('section', { class: 'splash' }, [
    logoMark(), h('h1', { text: APP_NAME }), h('p', { class: 'tagline', text: TAGLINE }), h('span', { class: 'demo-chip', text: 'Demo Version' })
  ]);
  return {
    el: el, title: 'Welcome',
    mounted: function () { timer = setTimeout(function () { Router.replace('welcome'); }, 1500); },
    leave: function () { clearTimeout(timer); }
  };
});

/* ---------- 2. Welcome slides ---------- */
Router.register('welcome', function () {
  var slides = [
    { icon: 'verified', a: 'users', b: 'heart', title: 'Find verified matches in your community', text: 'Every profile is checked by our team before you see it.' },
    { icon: 'shield', a: 'lock', b: 'eye', title: 'Your privacy is protected', text: 'You choose who can see your photos and details.' },
    { icon: 'phone', a: 'check', b: 'lock', title: 'Contact only after approval', text: 'Phone numbers are shown only to approved members.' }
  ];
  var track = h('div', { class: 'intro-track', role: 'group', 'aria-label': 'Introduction', tabindex: '0' });
  var dots = h('div', { class: 'intro-dots', 'aria-hidden': 'true' });
  slides.forEach(function (s, i) {
    var art = h('div', { class: 'intro-art' }, [
      h('div', { class: 'big' }, Icon(s.icon, 60)), h('div', { class: 'float a' }, Icon(s.a)), h('div', { class: 'float b' }, Icon(s.b))
    ]);
    track.appendChild(h('div', { class: 'intro-slide' }, [art, h('h1', { text: s.title }), h('p', { class: 'muted', text: s.text })]));
    dots.appendChild(h('span', { class: i === 0 ? 'on' : '' }));
  });
  track.addEventListener('scroll', function () {
    var index = Math.round(track.scrollLeft / Math.max(track.clientWidth, 1));
    Array.prototype.forEach.call(dots.children, function (dot, i) { dot.classList.toggle('on', i === index); });
  });
  var screen = Screen({ body: [], footer: bigButton('Get started', function () { State.cameFromWelcome = true; Router.go('phone'); }) });
  screen.el.insertBefore(track, screen.el.querySelector('.screen-body'));
  screen.el.insertBefore(dots, screen.el.querySelector('.screen-body'));
  screen.el.removeChild(screen.el.querySelector('.screen-body'));
  return { el: screen.el, title: 'Welcome' };
});

/* ---------- 3. Mobile number ---------- */
Router.register('phone', function () {
  var timer = null;
  var input = h('input', { class: 'input', id: 'phone-input', type: 'tel', inputmode: 'numeric', maxlength: '10', placeholder: '10-digit mobile number', autocomplete: 'tel-national', 'aria-label': 'Mobile number' });
  var clearBtn = h('button', { type: 'button', class: 'icon-btn', 'aria-label': 'Clear number' }, Icon('close'));
  var flag = h('span', { class: 'icon' });
  flag.innerHTML = INDIA_FLAG;
  var row = h('div', { class: 'phone-row' }, [
    h('div', { class: 'country-box', 'aria-label': 'Country code plus 91' }, [flag, h('span', { text: '+91' })]),
    h('div', { class: 'phone-input-wrap' }, [input, clearBtn])
  ]);
  var wrap = fieldWrap('', row, 'phone', 'We’ll send you a 4 digit OTP.');
  var button = bigButton('Send OTP', send);

  input.value = State.phone;
  function paintClear() { clearBtn.hidden = !input.value; }
  input.addEventListener('input', function () {
    input.value = input.value.replace(/\D/g, '');
    State.phone = input.value;
    paintClear();
  });
  clearBtn.addEventListener('click', function () { input.value = ''; State.phone = ''; paintClear(); input.focus(); });
  input.addEventListener('keydown', function (event) { if (event.key === 'Enter') { event.preventDefault(); send(); } });
  clearErrorsOnEdit(wrap);

  function send() {
    if (!/^\d{10}$/.test(input.value)) { showErrors(wrap, [['phone', 'Please enter a valid 10-digit mobile number.']]); return; }
    setButtonBusy(button, 'Sending OTP...');
    timer = setTimeout(function () { Router.go('otp'); resetButton(button, 'Send OTP'); }, 1000);
  }

  var screen = Screen({
    back: State.cameFromWelcome,
    body: [h('h1', { class: 'q-title', text: 'What’s your mobile number?' }), h('p', { class: 'q-helper', text: 'We will use it to log you in safely.' }), wrap],
    footer: button
  });
  paintClear();
  return { el: screen.el, title: 'Mobile number', leave: function () { clearTimeout(timer); }, mounted: function () { input.focus({ preventScroll: true }); } };
});

/* ---------- 4. OTP ---------- */
Router.register('otp', function () {
  var ticker = null;
  var verifyTimer = null;
  var autoFill = [];
  var seconds = 30;
  var boxes = [0, 1, 2, 3].map(function (i) {
    return h('input', { class: 'otp-box', type: 'text', inputmode: 'numeric', maxlength: '1', autocomplete: i === 0 ? 'one-time-code' : 'off', 'aria-label': 'Digit ' + (i + 1) + ' of 4' });
  });
  var row = h('div', { class: 'otp-row' }, boxes);
  var wrap = fieldWrap('', row, 'otp');
  var timerLine = h('p', { class: 'muted center', 'aria-live': 'off' });
  var resend = h('button', { type: 'button', class: 'link-btn', text: 'Resend OTP' });
  var button = bigButton('Verify', verify);

  function code() { return boxes.map(function (b) { return b.value; }).join(''); }
  boxes.forEach(function (box, i) {
    box.addEventListener('input', function () {
      box.value = box.value.replace(/\D/g, '').slice(-1);
      if (box.value && i < 3) boxes[i + 1].focus();
    });
    box.addEventListener('keydown', function (event) {
      if (event.key === 'Backspace' && !box.value && i > 0) { boxes[i - 1].focus(); boxes[i - 1].value = ''; }
      if (event.key === 'Enter') { event.preventDefault(); verify(); }
    });
    box.addEventListener('paste', function (event) {
      var text = (event.clipboardData || window.clipboardData).getData('text').replace(/\D/g, '').slice(0, 4);
      if (!text) return;
      event.preventDefault();
      text.split('').forEach(function (digit, k) { boxes[k].value = digit; });
      boxes[Math.min(text.length, 3)].focus();
    });
  });
  clearErrorsOnEdit(wrap);

  function paintTimer() {
    timerLine.hidden = seconds <= 0;
    resend.hidden = seconds > 0;
    timerLine.textContent = 'Resend code in 0:' + (seconds < 10 ? '0' : '') + seconds;
  }
  function startTimer() {
    clearInterval(ticker);
    seconds = 30;
    paintTimer();
    ticker = setInterval(function () { seconds -= 1; paintTimer(); if (seconds <= 0) clearInterval(ticker); }, 1000);
  }
  resend.addEventListener('click', function () { startTimer(); UI.toast('A new OTP has been sent.'); boxes[0].focus(); });

  function verify() {
    if (code().length < 4) { showErrors(wrap, [['otp', 'Please enter the 4 digit OTP.']]); return; }
    setButtonBusy(button, 'Verifying...');
    verifyTimer = setTimeout(function () {
      State.loggedIn = true;
      UI.toast('Mobile number verified');
      Router.replace(Router.gateName()); // new users start the profile, returning users go to their status screen
    }, 800);
  }

  var phoneText = State.phone ? '+91 ' + fmtPhone(State.phone) : 'your number';
  var screen = Screen({
    back: true,
    body: [
      h('h1', { class: 'q-title', text: 'Enter the 4 digit OTP' }),
      h('p', { class: 'q-helper', text: 'We sent a code to ' + phoneText + '.' }),
      wrap, timerLine, h('div', { class: 'otp-foot' }, [resend, h('button', { type: 'button', class: 'link-btn', text: 'Change number', onClick: function () { Router.back(); } })]),
      h('p', { class: 'muted center', text: 'Demo OTP: ' + DEMO_OTP.split('').join(' ') })
    ],
    footer: button
  });
  return {
    el: screen.el, title: 'Verify OTP',
    mounted: function () {
      startTimer();
      // Pretend the SMS arrived and was read automatically: the hardcoded code fills in digit by digit.
      DEMO_OTP.split('').forEach(function (digit, i) {
        autoFill.push(setTimeout(function () { boxes[i].value = digit; if (i < 3) boxes[i + 1].focus({ preventScroll: true }); else { boxes[3].blur(); UI.toast('OTP read from SMS', 'info'); } }, 900 + i * 220));
      });
    },
    leave: function () { clearInterval(ticker); clearTimeout(verifyTimer); autoFill.forEach(clearTimeout); }
  };
});

/* ---------- Choice: manual or from biodata ---------- */
Router.register('choice', function () {
  var local = { mode: 'manual' };
  var cards = optionCards(local, 'mode', [
    { value: 'manual', label: 'Create profile manually', sub: 'Answer a few simple questions. It takes about 5 minutes.' },
    { value: 'biodata', label: 'Create profile using biodata', sub: 'Upload your biodata and we will fill in the details for you.' }
  ]);
  var screen = Screen({
    back: true,
    body: [h('h1', { class: 'q-title', text: 'How would you like to create the profile?' }), h('p', { class: 'q-helper', text: 'You can change any detail before you submit.' }), cards],
    footer: bigButton('Proceed', function () {
      State.fromBiodata = local.mode === 'biodata';
      Router.go(local.mode === 'biodata' ? 'bioUpload' : 'profileFor');
    })
  });
  return { el: screen.el, title: 'Create profile' };
}, { auth: 'login' });

/* ---------- Biodata path: upload, then "reading" animation ---------- */
Router.register('bioUpload', function () {
  var p = State.profile;
  var field = fileField(p, 'biodataFile', 'Your biodata', OPTIONS.sampleFiles, { cta: 'Upload your biodata', formats: 'PDF, JPG or PNG, up to 5 MB' });
  var screen = Screen({
    back: true,
    body: [h('h1', { class: 'q-title', text: 'Upload your biodata' }), h('p', { class: 'q-helper', text: 'We will read it and fill in your profile.' }), field],
    footer: bigButton('Proceed', function () {
      if (!p.biodataFile) { showErrors(screen.body, [['biodataFile', 'Please choose your biodata file first.']]); return; }
      Router.go('bioReading');
    })
  });
  clearErrorsOnEdit(screen.body);
  return { el: screen.el, title: 'Upload biodata' };
}, { auth: 'login' });

Router.register('bioReading', function () {
  var timers = [];
  var labels = ['Reading text', 'Finding details', 'Filling your profile'];
  var items = labels.map(function (label) {
    return h('li', {}, [h('span', { class: 'mark', 'aria-hidden': 'true' }), h('span', { text: label })]);
  });
  var fill = h('div', { class: 'progress-fill' });
  fill.style.transition = 'width 3s linear';
  var el = h('section', { class: 'reading' }, [
    h('div', { class: 'scan-art', 'aria-hidden': 'true' }),
    h('h1', { text: 'Reading your biodata...' }),
    h('p', { class: 'muted', text: 'This takes just a moment.' }),
    h('ul', { class: 'steps-list', 'aria-live': 'polite' }, items),
    h('div', { class: 'progress', style: 'width:260px;margin:12px auto 0' }, fill)
  ]);
  function mark(i, state) {
    items[i].classList.toggle('active', state === 'active');
    items[i].classList.toggle('done', state === 'done');
    items[i].firstChild.textContent = '';
    if (state === 'done') items[i].firstChild.appendChild(Icon('check'));
  }
  return {
    el: el, title: 'Reading biodata',
    mounted: function () {
      requestAnimationFrame(function () { fill.style.width = '100%'; });
      labels.forEach(function (label, i) {
        timers.push(setTimeout(function () { mark(i, 'active'); }, i * 1000));
        timers.push(setTimeout(function () { mark(i, 'done'); }, i * 1000 + 900));
      });
      timers.push(setTimeout(function () {
        State.profile = sampleProfile();
        State.fromBiodata = true;
        UI.toast('We filled in your profile. Please check the details.');
        Router.replace('review');
      }, 3100));
    },
    leave: function () { timers.forEach(clearTimeout); }
  };
}, { auth: 'login' });

/* ---------- 22. Review and submit ---------- */

function show(value) { return isBlank(value) ? 'Not added' : String(value); }
function listText(list) { return list && list.length ? list.join(', ') : 'Open to all'; }

function reviewSections() {
  var p = State.profile;
  var age = calcAge(p.dobDay, p.dobMonth, p.dobYear);
  var prefs = p.prefs;
  function pref(key) { return prefs.open[key] ? 'Open to all' : listText(prefs[key]); }
  return [
    { title: 'Profile for', step: 'profileFor', rows: [['Created for', show(p.profileFor)], ['Gender', show(cap(p.gender))]] },
    { title: 'Personal details', step: 'name', rows: [
      ['Name', show((p.firstName + ' ' + p.lastName).trim())],
      ['Date of birth', p.dobDay ? p.dobDay + ' ' + p.dobMonth + ' ' + p.dobYear + (age !== null ? ' (' + age + ' years)' : '') : 'Not added'],
      ['Marital status', show(p.maritalStatus)], ['Height', fmtHeight(p.heightIn) + ' (' + cmFromInches(p.heightIn) + ' cm)']
    ] },
    { title: 'Community', step: 'community', rows: [['Religion', show(p.religion)], ['Community', show(p.community)], ['Sub-community', show(p.subCommunity)], ['Gotra', show(p.gotra)], ['Mother tongue', show(p.motherTongue)]] },
    { title: 'Location', step: 'location', rows: [['Country', show(p.country)], ['State', show(p.state)], ['City', show(p.city)], ['Residency', show(p.residency)], ['Living with family', show(p.livingWithFamily)]] },
    { title: 'Education', step: 'education', rows: [['Qualification', show(p.education)], ['College', show(p.college)], ['Field of study', show(p.fieldOfStudy)]] },
    { title: 'Work', step: 'work', rows: [['Employment', show(p.employment)], ['Profession', show(p.profession)], ['Company', show(p.company)], ['Annual income', show(p.income)]] },
    { title: 'Lifestyle', step: 'lifestyle', rows: [['Diet', show(p.diet)], ['Drinking', show(p.drinking)], ['Smoking', show(p.smoking)], ['Hobbies', p.hobbies.length ? p.hobbies.join(', ') : 'Not added']] },
    { title: 'Horoscope', step: 'horoscope', rows: [['Time of birth', show(p.birthTime)], ['Place of birth', show(p.birthPlace)], ['Manglik', show(p.manglik)], ['Rashi', show(p.rashi)], ['Nakshatra', show(p.nakshatra)], ['Kundali', show(p.kundali)]] },
    { title: 'Family', step: 'family', rows: [['Father', show(p.fatherOcc)], ['Mother', show(p.motherOcc)], ['Brothers', String(p.brothers)], ['Sisters', String(p.sisters)], ['Family type', show(p.familyType)], ['Family values', show(p.familyValues)], ['Family income', show(p.familyIncome)], ['Native place', show(p.nativePlace)]] },
    { title: 'About', step: 'about', rows: [['About', show(p.about)]] },
    { title: 'Partner preferences', step: 'partner', rows: [
      ['Age', prefs.ageMin + ' to ' + prefs.ageMax + ' years'], ['Height', fmtHeight(prefs.heightMin) + ' to ' + fmtHeight(prefs.heightMax)],
      ['Marital status', pref('marital')], ['Religion', pref('religion')], ['Education', pref('education')], ['Profession', pref('profession')],
      ['Income', pref('income')], ['Location', pref('location')], ['Diet', pref('diet')], ['Manglik', pref('manglik')]
    ] },
    { title: 'Photos', step: 'photos', photos: p.photos, rows: [['Photo privacy', show((OPTIONS.photoPrivacy.filter(function (o) { return o.value === p.photoPrivacy; })[0] || {}).label)]] },
    { title: 'Documents', step: 'documents', rows: [['Biodata', show(p.biodataFile)], ['ID proof', p.idFile ? p.idType + ': ' + p.idFile : 'Not added']] }
  ];
}

Router.register('review', function () {
  State.editing = false;
  var consentBox = h('input', { type: 'checkbox', id: 'consent' });
  consentBox.checked = State.consent;
  consentBox.addEventListener('change', function () { State.consent = consentBox.checked; });
  var consentWrap = h('div', { class: 'consent-wrap field' }, [
    h('label', { class: 'consent-row', for: 'consent' }, [consentBox, h('span', { text: 'I confirm all details are true and agree to share them with approved community members.' })]),
    h('div', { class: 'field-error', 'data-error': 'consent', role: 'alert' })
  ]);

  var cards = reviewSections().map(function (section) {
    var card = h('div', { class: 'card sum-card' }, [
      h('div', { class: 'sum-head' }, [
        h('h3', { text: section.title }),
        h('button', { type: 'button', class: 'link-btn', 'aria-label': 'Edit ' + section.title, onClick: function () { startEditing(section.step); } }, 'Edit')
      ])
    ]);
    if (section.photos && section.photos.length) {
      card.appendChild(h('div', { class: 'sum-photos' }, section.photos.map(function (src, i) { return h('img', { src: src, alt: 'Photo ' + (i + 1) }); })));
    }
    section.rows.forEach(function (row) {
      card.appendChild(h('div', { class: 'sum-row' }, [h('span', { class: 'k', text: row[0] }), h('span', { class: 'v', text: row[1] })]));
    });
    return card;
  });

  var button = bigButton('Submit for approval', submit);
  function submit() {
    if (!State.consent) {
      showErrors(consentWrap, [['consent', 'Please tick the box to confirm and continue.']]);
      return;
    }
    setButtonBusy(button, 'Submitting...');
    setTimeout(function () {
      State.status = 'pending';
      UI.toast('Profile submitted for approval');
      Router.replace('pending');
    }, 1000);
  }

  var banner = State.fromBiodata
    ? h('div', { class: 'info-note', style: 'margin:0 0 16px' }, [Icon('check'), h('span', { text: 'We filled in your profile from your biodata. Please check each section.' })])
    : null;
  var screen = Screen({
    back: true, progress: { from: 17 / 18, to: 1 },
    body: [h('h1', { class: 'q-title', text: 'Review your profile' }), h('p', { class: 'q-helper', text: 'Check everything. Tap Edit to change a section.' }), banner].concat(cards, [consentWrap]),
    footer: button
  });
  clearErrorsOnEdit(consentWrap);
  return { el: screen.el, title: 'Review', mounted: screen.mounted };
}, { auth: 'login' });

/* =====================================================================
   PART 2A: SHARED HELPERS FOR THE MAIN APP
   ===================================================================== */

function seeking() { return State.profile.gender === 'male' ? 'female' : 'male'; }
function oppositeProfiles() { return PROFILES.filter(function (p) { return p.gender === seeking(); }); }
function myName() { return (State.profile.firstName + ' ' + State.profile.lastName).trim() || 'Member'; }
function myAge() { return calcAge(State.profile.dobDay, State.profile.dobMonth, State.profile.dobYear) || 28; }

function blankFilters() {
  var multi = {};
  FILTER_FIELDS.forEach(function (f) { multi[f[0]] = []; });
  return { ageMin: 18, ageMax: 60, heightMin: 48, heightMax: 84, multi: multi, photoOnly: false, verifiedOnly: false, recentOnly: false };
}

var FILTER_FIELDS = [
  ['maritalStatus', 'Marital status'], ['religion', 'Religion'], ['community', 'Community'], ['subCommunity', 'Sub-community'],
  ['gotra', 'Gotra'], ['motherTongue', 'Mother tongue'], ['country', 'Country'], ['state', 'State'], ['city', 'City'],
  ['education', 'Education'], ['profession', 'Profession'], ['income', 'Income'], ['diet', 'Diet'],
  ['drinking', 'Drinking'], ['smoking', 'Smoking'], ['manglik', 'Manglik']
];

// Everything the signed-in member does after approval lives here (in memory only).
function appState() {
  if (!State.app) {
    var o = oppositeProfiles();
    State.app = {
      shortlist: [], viewed: [o[2].id, o[5].id, o[8].id], blocked: [], hidden: [], passed: [],
      filters: blankFilters(), search: '', sort: 'best', view: 'list', page: 1, focusSearch: false, savedSearch: false,
      notifications: NOTIFICATIONS.map(function (n) { return Object.assign({}, n); }),
      interests: INTERESTS.map(function (i) { return { id: i.id, profileId: o[i.slot].id, dir: i.dir, status: i.status, time: i.time }; })
    };
  }
  return State.app;
}

function visibleProfiles() {
  var a = appState();
  return oppositeProfiles().filter(function (p) { return a.blocked.indexOf(p.id) === -1 && a.hidden.indexOf(p.id) === -1; });
}

function profileById(id) {
  for (var i = 0; i < PROFILES.length; i++) if (PROFILES[i].id === id) return PROFILES[i];
  return null;
}

/* ---------- Things that must stay in sync on every screen (hearts, interest buttons) ---------- */

var boundPainters = [];
function bindPaint(node, paint) { boundPainters.push({ node: node, paint: paint }); paint(); }
function repaintBound() {
  boundPainters = boundPainters.filter(function (b) { return document.body.contains(b.node); });
  boundPainters.forEach(function (b) { b.paint(); });
}

function isShortlisted(id) { return appState().shortlist.indexOf(id) !== -1; }

function toggleShortlist(id) {
  var list = appState().shortlist;
  var at = list.indexOf(id);
  if (at === -1) list.unshift(id); else list.splice(at, 1);
  repaintBound();
  return at === -1;
}

function heartButton(p, large) {
  var button = h('button', { type: 'button', class: 'heart-btn' + (large ? ' large' : '') }, Icon('heart'));
  button.addEventListener('click', function (event) {
    event.preventDefault();
    event.stopPropagation();
    var saved = toggleShortlist(p.id);
    if (saved) { button.classList.add('pop'); setTimeout(function () { button.classList.remove('pop'); }, 450); }
    UI.toast(saved ? 'Added to shortlist' : 'Removed from shortlist', saved ? 'success' : 'info');
  });
  bindPaint(button, function () {
    var on = isShortlisted(p.id);
    button.classList.toggle('on', on);
    button.setAttribute('aria-pressed', on ? 'true' : 'false');
    button.setAttribute('aria-label', (on ? 'Remove ' : 'Add ') + p.name + (on ? ' from' : ' to') + ' shortlist');
  });
  return button;
}

function interestSent(id) {
  return appState().interests.some(function (i) { return i.profileId === id && i.dir === 'sent'; });
}

function sendInterest(p) {
  if (interestSent(p.id)) { UI.toast('You already sent an interest to ' + p.firstName + '.', 'info'); return; }
  appState().interests.unshift({ id: uid('int'), profileId: p.id, dir: 'sent', status: 'pending', time: 'Just now' });
  repaintBound();
  UI.toast('Interest sent to ' + p.firstName);
}

function interestButton(p, extraClass) {
  var button = h('button', { type: 'button', class: 'btn ' + (extraClass || 'btn-primary btn-small') });
  button.addEventListener('click', function (event) { event.preventDefault(); event.stopPropagation(); sendInterest(p); });
  bindPaint(button, function () {
    var sent = interestSent(p.id);
    clearNode(button);
    button.appendChild(Icon(sent ? 'check' : 'send', 20));
    button.appendChild(document.createTextNode(sent ? 'Interest sent' : 'Send interest'));
    button.classList.toggle('btn-outline', sent);
    button.classList.toggle('btn-primary', !sent);
  });
  return button;
}

function verifiedBadge() { return h('span', { class: 'badge-verified' }, [Icon('verified', 14), 'Verified']); }

function openProfile(id) { Router.go('profile', id); }

// Short loading skeleton, then the real list.
function loadList(container, render, ms) {
  var token = (container._loadToken || 0) + 1;
  container._loadToken = token;
  clearNode(container);
  container.appendChild(UI.skeletons(3));
  setTimeout(function () {
    if (container._loadToken !== token) return;
    clearNode(container);
    render();
  }, ms === undefined ? 500 : ms);
}

function emptyBlock(art, title, text, buttonText, onClick) {
  var kids = [h('div', { class: 'empty-art', 'aria-hidden': 'true' }, Icon(art, 56)), h('h3', { text: title }), h('p', { class: 'muted', text: text })];
  if (buttonText) kids.push(h('button', { type: 'button', class: 'btn btn-primary', text: buttonText, onClick: onClick }));
  return h('div', { class: 'empty-block', role: 'status' }, kids);
}

function copyText(text, okMessage) {
  function fallback() {
    var box = h('textarea', { style: 'position:fixed;opacity:0', 'aria-hidden': 'true' });
    box.value = text;
    document.body.appendChild(box);
    box.select();
    var done = false;
    try { done = document.execCommand('copy'); } catch (error) { done = false; }
    document.body.removeChild(box);
    UI.toast(done ? okMessage : 'Could not copy. Please copy it by hand.', done ? 'success' : 'error');
  }
  if (navigator.clipboard && navigator.clipboard.writeText) {
    // Some browsers never answer the clipboard permission, so fall back after a short wait.
    var settled = false;
    var timer = setTimeout(function () { if (!settled) { settled = true; fallback(); } }, 1200);
    navigator.clipboard.writeText(text).then(function () {
      if (settled) return;
      settled = true; clearTimeout(timer); UI.toast(okMessage);
    }, function () {
      if (settled) return;
      settled = true; clearTimeout(timer); fallback();
    });
  } else {
    fallback();
  }
}

function showSupport() {
  UI.dialog({
    title: 'Contact support',
    dismissValue: true,
    body: h('div', {}, [
      h('p', { class: 'muted', text: 'Our team is available from 10 AM to 6 PM, Monday to Saturday.' }),
      h('p', { class: 'contact-number', text: SUPPORT_NUMBER }),
      h('a', { class: 'btn btn-primary btn-block', href: 'tel:+9190000' + '99999' }, [Icon('phone', 20), 'Call support'])
    ]),
    actions: [{ label: 'Close', value: true, kind: 'outline' }]
  });
}

function logout() {
  UI.confirm({ title: 'Log out?', message: 'You will need to verify your mobile number again.', confirmText: 'Log out', danger: true }).then(function (yes) {
    if (!yes) return;
    State.loggedIn = false;
    State.cameFromWelcome = false;
    UI.toast('You have been logged out');
    Router.replace('phone');
  });
}

/* ---------- Profile completion ---------- */

function completionItems() {
  var p = State.profile;
  var photos = p.photos.length;
  return [
    { label: 'Basic details', points: 20, earned: p.firstName && p.dobYear && p.maritalStatus ? 20 : 0, step: 'name', tip: 'Add your basic details' },
    { label: 'Education and work', points: 15, earned: p.education && p.profession ? 15 : 0, step: 'education', tip: 'Add education and work' },
    { label: 'Family details', points: 10, earned: p.fatherOcc ? 10 : 0, step: 'family', tip: 'Add family details' },
    { label: 'Lifestyle', points: 5, earned: p.diet ? 5 : 0, step: 'lifestyle', tip: 'Add lifestyle details' },
    { label: 'About me', points: 10, earned: p.about.trim().length >= 30 ? 10 : 0, step: 'about', tip: 'Write a few lines about yourself' },
    { label: 'Horoscope', points: 10, earned: p.rashi || p.kundali ? 10 : 0, step: 'horoscope', tip: 'Add horoscope details' },
    { label: 'Photos', points: 15, earned: photos >= 3 ? 15 : photos >= 1 ? 8 : 0, step: 'photos', tip: 'Add at least 3 photos' },
    { label: 'Biodata', points: 5, earned: p.biodataFile ? 5 : 0, step: 'documents', tip: 'Upload your biodata' },
    { label: 'ID proof', points: 10, earned: p.idFile ? 10 : 0, step: 'documents', tip: 'Upload an ID proof to get verified' }
  ];
}

function completionPercent() {
  return completionItems().reduce(function (sum, item) { return sum + item.earned; }, 0);
}

// Circular progress. ring.node goes in the page; call ring.start() after it is mounted to animate it.
function progressRing(percent, size, label) {
  var r = 36;
  var c = 2 * Math.PI * r;
  var wrap = h('div', { class: 'ring', style: 'width:' + size + 'px;height:' + size + 'px', role: 'img', 'aria-label': label + ' ' + percent + ' percent' });
  wrap.innerHTML = '<svg viewBox="0 0 88 88"><circle cx="44" cy="44" r="' + r + '" class="ring-track"/><circle cx="44" cy="44" r="' + r + '" class="ring-fill" stroke-dasharray="' + c + '" stroke-dashoffset="' + c + '" transform="rotate(-90 44 44)"/></svg>';
  wrap.appendChild(h('div', { class: 'ring-text' }, [h('strong', { text: percent + '%' })]));
  return {
    node: wrap,
    start: function () { requestAnimationFrame(function () { wrap.querySelector('.ring-fill').style.strokeDashoffset = String(c * (1 - percent / 100)); }); }
  };
}

/* =====================================================================
   PART 2B: STATUS SCREENS (23 pending, 24 approved, 25 rejected, 26 blocked)
   ===================================================================== */

function statusIcon(name, className) {
  return h('div', { class: 'status-art ' + (className || ''), 'aria-hidden': 'true' }, Icon(name, 54));
}

function profilePreview() {
  var p = State.profile;
  var details = [p.education, p.profession, p.city].filter(Boolean).join(' • ');
  return h('div', { class: 'card preview-card' }, [
    h('img', { src: p.photos[0] || GENDER_ART[p.gender || 'male'], alt: 'Main photo' }),
    h('div', { class: 'preview-info' }, [
      h('span', { class: 'preview-tag', text: 'Preview' }),
      h('h3', { text: myName() }),
      h('p', { class: 'muted', text: myAge() + ' years • ' + fmtHeight(p.heightIn) }),
      h('p', { class: 'muted', text: details })
    ])
  ]);
}

/* ---------- 23. Pending approval ---------- */
Router.register('pending', function () {
  var percent = completionPercent();
  var ring = progressRing(percent, 96, 'Profile completion');
  var missing = completionItems().filter(function (item) { return item.earned < item.points; });

  var tips = missing.length
    ? h('div', {}, [h('h3', { class: 'section-label', text: 'Reach 100%' })].concat(missing.map(function (item) {
      return h('div', { class: 'tip-row' }, [
        h('span', { class: 'tip-text' }, [h('strong', { text: '+' + (item.points - item.earned) + '%' }), ' ' + item.tip]),
        h('button', { type: 'button', class: 'link-btn', 'aria-label': item.tip, text: 'Add', onClick: function () { startEditing(item.step); } })
      ]);
    })))
    : h('p', { class: 'muted center', text: 'Your profile is 100% complete. Great work!' });

  function simulate(status, route, message) {
    return function () { State.status = status; UI.toast(message, status === 'approved' ? 'success' : 'info'); Router.replace(route); };
  }

  var el = Screen({
    body: [
      h('div', { class: 'status-hero' }, [
        statusIcon('hourglass', 'spin-slow'),
        h('h1', { class: 'center', text: 'Your profile is under review' }),
        h('p', { class: 'muted center', text: 'Usually takes 24 hours. We will let you know as soon as it is approved.' })
      ]),
      h('div', { class: 'card completion-card' }, [ring.node, h('div', { class: 'completion-text' }, [h('h3', { text: 'Profile completion' }), h('p', { class: 'muted', text: percent >= 100 ? 'Complete' : 'A complete profile gets more interest.' })])]),
      tips,
      h('h3', { class: 'section-label', text: 'How others will see you' }),
      profilePreview(),
      h('div', { class: 'demo-tools' }, [
        h('h2', { text: 'DEMO TOOLS' }),
        h('p', { text: 'For the client demo only. These buttons will not exist in the live app.' }),
        h('button', { type: 'button', class: 'btn btn-primary btn-block', text: 'Simulate approval', onClick: simulate('approved', 'approved', 'Profile approved') }),
        h('button', { type: 'button', class: 'btn btn-outline btn-block', text: 'Simulate rejection', onClick: simulate('rejected', 'rejected', 'Profile rejected') }),
        h('button', { type: 'button', class: 'btn btn-outline btn-block', text: 'Simulate block', onClick: simulate('blocked', 'blocked', 'Account blocked') })
      ]),
      h('button', { type: 'button', class: 'link-btn block-link', text: 'Log out', onClick: logout })
    ]
  });
  return { el: el.el, title: 'Pending approval', mounted: ring.start };
}, { auth: 'login' });

/* ---------- 24. Approved celebration ---------- */
Router.register('approved', function () {
  var colors = ['#7B1E2B', '#C9A24D', '#2E7D4F', '#E8B4B8', '#F3D48A'];
  var confetti = h('div', { class: 'confetti', 'aria-hidden': 'true' });
  for (var i = 0; i < 60; i++) {
    var piece = h('span');
    piece.style.left = (Math.random() * 100) + '%';
    piece.style.background = colors[i % colors.length];
    piece.style.animationDelay = (Math.random() * 1.6) + 's';
    piece.style.animationDuration = (2.6 + Math.random() * 2) + 's';
    piece.style.transform = 'rotate(' + Math.round(Math.random() * 360) + 'deg)';
    if (i % 3 === 0) piece.style.borderRadius = '50%';
    confetti.appendChild(piece);
  }
  var screen = Screen({
    body: [
      h('div', { class: 'status-hero celebrate' }, [
        statusIcon('verified', 'success pulse'),
        h('h1', { class: 'center', text: 'Congratulations!' }),
        h('p', { class: 'center', text: 'Your profile is approved.' }),
        h('p', { class: 'muted center', text: 'You can now find matches in your community.' })
      ])
    ],
    footer: bigButton('Find matches', function () { Router.replace('home'); })
  });
  screen.el.appendChild(confetti);
  return { el: screen.el, title: 'Approved' };
}, { auth: 'login' });

/* ---------- 25. Rejected ---------- */
Router.register('rejected', function () {
  var screen = Screen({
    body: [
      h('div', { class: 'status-hero' }, [
        statusIcon('alert', 'danger'),
        h('h1', { class: 'center', text: 'Profile not approved' }),
        h('p', { class: 'muted center', text: 'Our team could not approve your profile for this reason:' })
      ]),
      h('div', { class: 'reason-box' }, [Icon('info'), h('span', { text: REJECTION_REASON })]),
      h('button', { type: 'button', class: 'link-btn block-link', text: 'Contact support', onClick: showSupport }),
      h('button', { type: 'button', class: 'link-btn block-link', text: 'Log out', onClick: logout })
    ],
    footer: bigButton('Edit and resubmit', function () { Router.go('review'); })
  });
  return { el: screen.el, title: 'Profile not approved' };
}, { auth: 'login' });

/* ---------- 26. Blocked ---------- */
Router.register('blocked', function () {
  var screen = Screen({
    body: [
      h('div', { class: 'status-hero' }, [
        statusIcon('ban', 'danger'),
        h('h1', { class: 'center', text: 'Account blocked' }),
        h('p', { class: 'muted center', text: 'Your account is blocked. Contact support.' })
      ]),
      h('button', { type: 'button', class: 'link-btn block-link', text: 'Log out', onClick: logout })
    ],
    footer: bigButton('Contact support', showSupport)
  });
  return { el: screen.el, title: 'Account blocked' };
}, { auth: 'login' });

/* =====================================================================
   PART 2C: PROFILE CARDS, NOTIFICATIONS, HOME
   ===================================================================== */

function compatBadge(p) { return h('span', { class: 'compat-badge', text: p.compat + '% match' }); }

// Small card used in the horizontal rows on Home.
function miniCard(p) {
  var link = h('a', { class: 'mini-link', href: '#/profile/' + p.id, 'aria-label': 'Open profile of ' + p.name }, [
    h('div', { class: 'mini-photo' }, [h('img', { src: p.photos[0], alt: 'Photo of ' + p.name, loading: 'lazy' }), compatBadge(p)]),
    h('div', { class: 'mini-body' }, [
      h('h3', { text: p.name }),
      p.verified ? verifiedBadge() : null,
      h('p', { class: 'p-line', text: p.age + ' yrs • ' + fmtHeight(p.heightIn) }),
      h('p', { class: 'p-line', text: p.profession }),
      h('p', { class: 'p-line', text: p.city }),
      h('p', { class: 'p-active', text: p.lastActive })
    ])
  ]);
  link.addEventListener('click', function (event) { event.preventDefault(); openProfile(p.id); });
  return h('article', { class: 'mini-card' }, [link, heartButton(p)]);
}

// Full-width card used in Matches and Shortlist.
function listCard(p, o) {
  o = o || {};
  var link = h('a', { class: 'list-link', href: '#/profile/' + p.id, 'aria-label': 'Open profile of ' + p.name }, [
    h('div', { class: 'list-photo' }, [h('img', { src: p.photos[0], alt: 'Photo of ' + p.name, loading: 'lazy' }), compatBadge(p)]),
    h('div', { class: 'list-info' }, [
      h('h3', { text: p.name }),
      p.verified ? verifiedBadge() : null,
      h('p', { class: 'p-line', text: p.age + ' yrs • ' + fmtHeight(p.heightIn) }),
      h('p', { class: 'p-line', text: p.profession }),
      h('p', { class: 'p-line', text: p.city + ', ' + p.state }),
      h('p', { class: 'p-active', text: p.lastActive })
    ])
  ]);
  link.addEventListener('click', function (event) { event.preventDefault(); openProfile(p.id); });
  var actions = h('div', { class: 'list-actions' }, o.actions || interestButton(p, 'btn-primary btn-small btn-block'));
  return h('article', { class: 'card list-card' }, [link, heartButton(p), actions]);
}

/* ---------- 35. Notifications ---------- */

function notificationText(n) {
  var o = oppositeProfiles();
  return n.text.replace('{n}', n.slot >= 0 && o[n.slot] ? o[n.slot].name : 'Someone');
}
function unreadCount() { return appState().notifications.filter(function (n) { return !n.read; }).length; }

Router.register('notifications', function () {
  var a = appState();
  var list = h('div', { class: 'notif-list' });
  var markAll = h('button', { type: 'button', class: 'link-btn', text: 'Mark all read' });
  var icons = { interest: 'heart', match: 'users', view: 'eye', approved: 'verified' };

  function paint() {
    clearNode(list);
    markAll.hidden = !unreadCount();
    if (!a.notifications.length) { list.appendChild(emptyBlock('bell', 'No notifications', 'New activity will show up here.')); return; }
    a.notifications.forEach(function (n) {
      var item = h('button', { type: 'button', class: 'notif-item' + (n.read ? '' : ' unread') }, [
        h('span', { class: 'notif-icon' }, Icon(icons[n.kind] || 'bell')),
        h('span', { class: 'notif-text' }, [h('span', { class: 'notif-title', text: notificationText(n) }), h('span', { class: 'p-active', text: n.time })]),
        n.read ? null : h('span', { class: 'unread-dot', 'aria-label': 'Unread' })
      ]);
      item.addEventListener('click', function () {
        n.read = true;
        paint();
        if (n.kind === 'match') Router.go('matches');
        else if (n.kind === 'interest') Router.go('interests');
        else if (n.kind === 'view') Router.go('home');
      });
      list.appendChild(item);
    });
  }
  markAll.addEventListener('click', function () { a.notifications.forEach(function (n) { n.read = true; }); paint(); UI.toast('All caught up'); });

  var screen = Screen({ back: true, right: markAll, body: [h('h1', { class: 'q-title', text: 'Notifications' }), list] });
  loadList(list, paint, 500);
  return { el: screen.el, title: 'Notifications' };
}, { auth: 'approved' });

/* ---------- 27. Home ---------- */

function homeSections() {
  var a = appState();
  var all = visibleProfiles();
  var byId = function (ids) { return ids.map(profileById).filter(function (p) { return p && all.indexOf(p) !== -1; }); };
  var o = oppositeProfiles();
  var myCity = State.profile.city;
  var nearby = all.filter(function (p) { return p.city === myCity; });
  if (nearby.length < 3) nearby = nearby.concat(all.filter(function (p) { return p.state === State.profile.state && nearby.indexOf(p) === -1; }));
  if (nearby.length < 3) nearby = nearby.concat(all.filter(function (p) { return nearby.indexOf(p) === -1; }).slice(0, 4 - nearby.length));
  var slots = function (list) { return list.map(function (i) { return o[i]; }).filter(function (p) { return p && all.indexOf(p) !== -1; }); };
  return [
    { title: 'Recommended for you', list: all.slice().sort(function (x, y) { return y.compat - x.compat; }).slice(0, 8) },
    { title: 'New matches', list: all.slice().reverse().slice(0, 6) },
    { title: 'Nearby matches', list: nearby.slice(0, 6) },
    { title: 'Recently viewed', list: byId(a.viewed).slice(0, 6) },
    { title: 'Shortlisted you', list: slots([3, 6, 9]) },
    { title: 'Viewed your profile', list: slots([1, 4, 7]) }
  ];
}

function openCompletionTips() {
  var missing = completionItems().filter(function (item) { return item.earned < item.points; });
  UI.sheet({
    title: 'Complete your profile', dismissValue: null,
    render: function (close) {
      var body = missing.length
        ? h('div', {}, missing.map(function (item) {
          return h('div', { class: 'tip-row' }, [
            h('span', { class: 'tip-text' }, [h('strong', { text: '+' + (item.points - item.earned) + '%' }), ' ' + item.tip]),
            h('button', { type: 'button', class: 'btn btn-outline btn-small', text: 'Add', onClick: function () { close(null); startEditing(item.step); } })
          ]);
        }))
        : h('p', { class: 'muted center', text: 'Your profile is 100% complete.' });
      return { body: body, footer: null };
    }
  });
}

Router.register('home', function () {
  var a = appState();
  var host = h('div');
  var percent = completionPercent();
  var bell = h('button', { type: 'button', class: 'icon-btn', 'aria-label': 'Notifications', onClick: function () { Router.go('notifications'); } }, [Icon('bell')]);
  if (unreadCount()) bell.appendChild(h('span', { class: 'notif-dot', 'aria-label': unreadCount() + ' unread' }));
  var searchBtn = h('button', { type: 'button', class: 'icon-btn', 'aria-label': 'Search matches', onClick: function () { a.focusSearch = true; Router.go('matches', '', 'fade'); } }, Icon('search'));

  var header = h('div', { class: 'home-header on-maroon' }, [
    h('div', { class: 'home-hello' }, [h('span', { class: 'hello-small', text: 'Welcome back' }), h('h1', { text: 'Hello, ' + (State.profile.firstName || 'there') })]),
    searchBtn, bell
  ]);

  var banner = percent >= 100 ? null : h('button', { type: 'button', class: 'card banner-card', onClick: openCompletionTips }, [
    h('span', { class: 'banner-top' }, [h('strong', { text: 'Your profile is ' + percent + '% complete' }), Icon('right')]),
    h('span', { class: 'progress' }, h('span', { class: 'progress-fill', style: 'width:' + percent + '%' })),
    h('span', { class: 'muted', text: 'Complete it to get more interest.' })
  ]);

  var idInput = h('input', { class: 'input', id: 'id-search', type: 'search', placeholder: 'Search by Profile ID', 'aria-label': 'Search by Profile ID', autocomplete: 'off' });
  function searchById() {
    var code = idInput.value.trim().toUpperCase();
    var found = PROFILES.filter(function (p) { return p.profileCode === code; })[0];
    if (!code) { UI.toast('Please enter a Profile ID, for example ' + PROFILES[11].profileCode + '.', 'error'); return; }
    if (!found) { UI.toast('No profile found with this ID.', 'error'); return; }
    openProfile(found.id);
  }
  idInput.addEventListener('keydown', function (event) { if (event.key === 'Enter') searchById(); });
  var idRow = h('div', { class: 'id-search' }, [idInput, h('button', { type: 'button', class: 'btn btn-primary btn-small', text: 'Find', onClick: searchById })]);

  function renderSections() {
    var shown = 0;
    homeSections().forEach(function (section) {
      if (!section.list.length) return;
      shown += 1;
      host.appendChild(h('div', { class: 'row-head' }, [
        h('h2', { text: section.title }),
        h('button', { type: 'button', class: 'link-btn', text: 'See all', onClick: function () { Router.go('matches', '', 'fade'); } })
      ]));
      host.appendChild(h('div', { class: 'h-scroll' }, section.list.map(miniCard)));
    });
    if (!shown) host.appendChild(emptyBlock('users', 'No matches yet', 'Check back soon. New profiles are added every day.'));
  }

  var screen = Screen({ body: [banner, idRow, host], className: 'with-home-header' });
  screen.el.insertBefore(header, screen.el.firstChild);
  loadList(host, renderSections, 500);
  return { el: screen.el, tab: 'home', title: 'Home' };
}, { auth: 'approved' });

/* =====================================================================
   PART 2D: MATCHES, SORTING, FILTERS (screens 28 and 29)
   ===================================================================== */

function deriveOptions(field) {
  var seen = {};
  oppositeProfiles().forEach(function (p) { seen[p[field]] = true; });
  var list = Object.keys(seen);
  if (field === 'income') list.sort(function (x, y) { return OPTIONS.incomes.indexOf(x) - OPTIONS.incomes.indexOf(y); });
  else list.sort();
  return list;
}

function isRecentlyActive(p) { return /Online|today|hours/.test(p.lastActive); }

function applyFilters(list, f) {
  return list.filter(function (p) {
    if (p.age < f.ageMin || p.age > f.ageMax) return false;
    if (p.heightIn < f.heightMin || p.heightIn > f.heightMax) return false;
    for (var i = 0; i < FILTER_FIELDS.length; i++) {
      var key = FILTER_FIELDS[i][0];
      if (f.multi[key].length && f.multi[key].indexOf(p[key]) === -1) return false;
    }
    if (f.photoOnly && !p.photos.length) return false;
    if (f.verifiedOnly && !p.verified) return false;
    if (f.recentOnly && !isRecentlyActive(p)) return false;
    return true;
  });
}

function sortProfiles(list, mode) {
  var copy = list.slice();
  var myCity = State.profile.city;
  if (mode === 'best') copy.sort(function (x, y) { return y.compat - x.compat; });
  else if (mode === 'age') copy.sort(function (x, y) { return x.age - y.age; });
  else if (mode === 'nearby') copy.sort(function (x, y) { return (y.city === myCity) - (x.city === myCity); });
  else copy.reverse(); // newest first
  return copy;
}

function activeFilterChips(f) {
  var chips = [];
  var base = blankFilters();
  if (f.ageMin !== base.ageMin || f.ageMax !== base.ageMax) chips.push({ label: 'Age ' + f.ageMin + '-' + f.ageMax, remove: function () { f.ageMin = base.ageMin; f.ageMax = base.ageMax; } });
  if (f.heightMin !== base.heightMin || f.heightMax !== base.heightMax) chips.push({ label: fmtHeight(f.heightMin) + ' to ' + fmtHeight(f.heightMax), remove: function () { f.heightMin = base.heightMin; f.heightMax = base.heightMax; } });
  FILTER_FIELDS.forEach(function (field) {
    f.multi[field[0]].forEach(function (value) {
      chips.push({ label: value, remove: function () { f.multi[field[0]].splice(f.multi[field[0]].indexOf(value), 1); } });
    });
  });
  if (f.photoOnly) chips.push({ label: 'With photo', remove: function () { f.photoOnly = false; } });
  if (f.verifiedOnly) chips.push({ label: 'Verified only', remove: function () { f.verifiedOnly = false; } });
  if (f.recentOnly) chips.push({ label: 'Recently active', remove: function () { f.recentOnly = false; } });
  return chips;
}

function openFilterSheet(onApply) {
  var a = appState();
  var draft = JSON.parse(JSON.stringify(a.filters));
  var saveFlag = { save: false };
  UI.sheet({
    title: 'Filters', dismissValue: null,
    render: function (close) {
      var kids = [
        rangeBlock('Age', draft, 'ageMin', 'ageMax', 18, 60, function (v) { return v + ' yrs'; }),
        rangeBlock('Height', draft, 'heightMin', 'heightMax', 48, 84, fmtHeight)
      ];
      FILTER_FIELDS.forEach(function (field) {
        var options = deriveOptions(field[0]);
        if (!options.length) return;
        kids.push(h('h3', { class: 'filter-label', text: field[1] }));
        kids.push(chipGroup(draft.multi, field[0], options, { multi: true }));
      });
      [['photoOnly', 'With photo only'], ['verifiedOnly', 'Verified profiles only'], ['recentOnly', 'Recently active']].forEach(function (row) {
        kids.push(h('div', { class: 'switch-row' }, [h('span', { text: row[1] }), switchButton(draft[row[0]], row[1], function (on) { draft[row[0]] = on; })]));
      });
      kids.push(h('div', { class: 'switch-row' }, [h('span', { text: 'Save this search' }), switchButton(false, 'Save this search', function (on) { saveFlag.save = on; })]));
      var apply = h('button', { type: 'button', class: 'btn btn-primary', text: 'Apply', onClick: function () { close('apply'); } });
      var reset = h('button', { type: 'button', class: 'btn btn-outline', text: 'Reset', onClick: function () { close('reset'); } });
      return { body: h('div', {}, kids), footer: [reset, apply] };
    }
  }).promise.then(function (choice) {
    if (choice === 'apply') {
      a.filters = draft;
      a.page = 1;
      if (saveFlag.save) { a.savedSearch = true; UI.toast('Search saved. We will notify you about new matches.'); }
      onApply();
    } else if (choice === 'reset') {
      a.filters = blankFilters();
      a.page = 1;
      onApply();
    }
  });
}

var PAGE_SIZE = 6;
var SORT_OPTIONS = [['new', 'Newest'], ['best', 'Best match'], ['age', 'Age'], ['nearby', 'Nearby']];

Router.register('matches', function () {
  var a = appState();
  var results = h('div', { class: 'results' });
  var chipsBox = h('div', { class: 'chips filter-chips' });
  var countLine = h('p', { class: 'muted result-count', 'aria-live': 'polite' });
  var filterBadge = h('span', { class: 'count-badge' });

  var search = h('input', { class: 'input', type: 'search', placeholder: 'Search by name or city', 'aria-label': 'Search by name or city', autocomplete: 'off' });
  search.value = a.search;
  var filterBtn = h('button', { type: 'button', class: 'btn btn-outline btn-small filter-btn', 'aria-label': 'Open filters' }, [Icon('filter', 20), 'Filter', filterBadge]);
  var sort = h('select', { class: 'select sort-select', 'aria-label': 'Sort matches' }, SORT_OPTIONS.map(function (o) { return h('option', { value: o[0], text: 'Sort: ' + o[1] }); }));
  sort.value = a.sort;

  var viewToggle = h('div', { class: 'view-toggle', role: 'group', 'aria-label': 'View' });
  var listBtn = h('button', { type: 'button', class: 'icon-btn', 'aria-label': 'List view' }, Icon('list'));
  var cardBtn = h('button', { type: 'button', class: 'icon-btn', 'aria-label': 'Swipe card view' }, Icon('card'));
  viewToggle.appendChild(listBtn);
  viewToggle.appendChild(cardBtn);

  function filtered() {
    var q = a.search.trim().toLowerCase();
    var list = visibleProfiles().filter(function (p) { return !q || p.name.toLowerCase().indexOf(q) !== -1 || p.city.toLowerCase().indexOf(q) !== -1; });
    return sortProfiles(applyFilters(list, a.filters), a.sort);
  }

  function renderChips() {
    clearNode(chipsBox);
    var chips = activeFilterChips(a.filters);
    filterBadge.textContent = chips.length ? String(chips.length) : '';
    filterBadge.hidden = !chips.length;
    chips.forEach(function (chip) {
      chipsBox.appendChild(h('span', { class: 'chip on static-chip' }, [chip.label, h('button', {
        type: 'button', class: 'chip-x', 'aria-label': 'Remove filter ' + chip.label, text: '×',
        onClick: function () { chip.remove(); a.page = 1; refresh(); }
      })]));
    });
    if (chips.length > 1) chipsBox.appendChild(h('button', { type: 'button', class: 'link-btn', text: 'Clear all', onClick: function () { a.filters = blankFilters(); a.page = 1; refresh(); } }));
  }

  /* --- list view --- */
  function renderList(list) {
    var shown = list.slice(0, a.page * PAGE_SIZE);
    countLine.textContent = 'Showing ' + shown.length + ' of ' + list.length + ' matches';
    if (!list.length) {
      results.appendChild(emptyBlock('search', 'No profiles match your search', 'Try changing or clearing some filters.', 'Clear filters', function () { a.filters = blankFilters(); a.search = ''; search.value = ''; refresh(); }));
      return;
    }
    shown.forEach(function (p) { results.appendChild(listCard(p)); });
    if (shown.length < list.length) {
      results.appendChild(h('button', { type: 'button', class: 'btn btn-outline btn-block', text: 'Load more', onClick: function () { a.page += 1; refresh(true); } }));
    }
  }

  /* --- swipe-card view --- */
  function renderDeck(list) {
    var deck = list.filter(function (p) { return a.passed.indexOf(p.id) === -1; });
    countLine.textContent = deck.length + ' left to see';
    if (!deck.length) {
      results.appendChild(emptyBlock('check', 'You have seen everyone', 'Come back later for new matches.', 'Start again', function () { a.passed = []; refresh(); }));
      return;
    }
    var p = deck[0];
    var card = h('article', { class: 'swipe-card', tabindex: '0', 'aria-label': p.name + ', ' + p.age + ' years. Swipe right to send interest, left to skip.' }, [
      h('img', { src: p.photos[0], alt: 'Photo of ' + p.name, draggable: 'false' }),
      compatBadge(p),
      h('div', { class: 'swipe-info' }, [
        h('h2', { text: p.name + ', ' + p.age }), p.verified ? verifiedBadge() : null,
        h('p', { text: p.profession + ' • ' + p.city }), h('p', { class: 'p-active', text: p.lastActive })
      ])
    ]);
    function advance(kind) {
      card.classList.add(kind === 'interest' ? 'fly-right' : 'fly-left');
      setTimeout(function () {
        if (kind === 'interest') sendInterest(p);
        a.passed.push(p.id);
        refresh();
      }, 260);
    }
    var startX = null;
    var dx = 0;
    var moved = false;
    card.addEventListener('pointerdown', function (event) { startX = event.clientX; dx = 0; moved = false; card.setPointerCapture(event.pointerId); });
    card.addEventListener('pointermove', function (event) {
      if (startX === null) return;
      dx = event.clientX - startX;
      if (Math.abs(dx) > 6) moved = true;
      card.style.transform = 'translateX(' + dx + 'px) rotate(' + dx / 18 + 'deg)';
    });
    function endDrag() {
      if (startX === null) return;
      startX = null;
      if (dx > 90) advance('interest');
      else if (dx < -90) advance('pass');
      else { card.style.transform = ''; if (!moved) openProfile(p.id); }
    }
    card.addEventListener('pointerup', endDrag);
    card.addEventListener('pointercancel', function () { startX = null; card.style.transform = ''; });
    card.addEventListener('keydown', function (event) {
      if (event.key === 'ArrowRight') advance('interest');
      else if (event.key === 'ArrowLeft') advance('pass');
      else if (event.key === 'Enter') openProfile(p.id);
    });
    results.appendChild(card);
    results.appendChild(h('div', { class: 'swipe-actions' }, [
      h('button', { type: 'button', class: 'round-btn', 'aria-label': 'Skip ' + p.firstName, onClick: function () { advance('pass'); } }, Icon('close', 28)),
      heartButton(p, true),
      h('button', { type: 'button', class: 'round-btn primary', 'aria-label': 'Send interest to ' + p.firstName, onClick: function () { advance('interest'); } }, Icon('send', 28))
    ]));
    results.appendChild(h('p', { class: 'muted center', text: 'Swipe right to send interest, left to skip.' }));
  }

  function refresh(skipLoading) {
    renderChips();
    listBtn.classList.toggle('active', a.view === 'list');
    cardBtn.classList.toggle('active', a.view === 'card');
    listBtn.setAttribute('aria-pressed', a.view === 'list' ? 'true' : 'false');
    cardBtn.setAttribute('aria-pressed', a.view === 'card' ? 'true' : 'false');
    var list = filtered();
    var render = function () { if (a.view === 'card') renderDeck(list); else renderList(list); };
    if (skipLoading) { clearNode(results); render(); } else loadList(results, render, 500);
  }

  search.addEventListener('input', debounce(function () { a.search = search.value; a.page = 1; refresh(true); }, 200));
  sort.addEventListener('change', function () { a.sort = sort.value; a.page = 1; refresh(); });
  filterBtn.addEventListener('click', function () { openFilterSheet(refresh); });
  listBtn.addEventListener('click', function () { a.view = 'list'; refresh(true); });
  cardBtn.addEventListener('click', function () { a.view = 'card'; refresh(true); });

  var screen = Screen({
    right: viewToggle,
    body: [
      h('h1', { class: 'q-title tight', text: 'Matches' }),
      h('div', { class: 'field search-field' }, search),
      h('div', { class: 'toolbar' }, [filterBtn, sort]),
      chipsBox, countLine, results
    ]
  });
  refresh();
  return {
    el: screen.el, tab: 'matches', title: 'Matches',
    mounted: function () { if (a.focusSearch) { a.focusSearch = false; search.focus(); } }
  };
}, { auth: 'approved' });

/* =====================================================================
   PART 2E: PROFILE DETAIL (screen 30) AND CONTACT REVEAL
   ===================================================================== */

// How well the signed-in member fits what this profile is looking for: 10 simple checks.
function preferenceMatches(p) {
  var pr = p.partnerPrefs;
  var me = State.profile;
  var age = myAge();
  var open = function (v) { return v === 'Open to all'; };
  var graduate = ['B.A.', 'B.Com', 'B.Sc', 'B.Tech', 'B.E.', 'B.Des', 'B.Pharm', 'MBBS', 'CA', 'CS', 'MBA', 'M.Com', 'M.Sc', 'M.Tech', 'M.Ed', 'PhD'];
  return [
    { label: 'Age', want: pr.ageMin + ' to ' + pr.ageMax + ' years', ok: age >= pr.ageMin && age <= pr.ageMax },
    { label: 'Height', want: fmtHeight(pr.heightMin) + ' to ' + fmtHeight(pr.heightMax), ok: me.heightIn >= pr.heightMin && me.heightIn <= pr.heightMax },
    { label: 'Marital status', want: pr.maritalStatus.join(', '), ok: pr.maritalStatus.indexOf(me.maritalStatus) !== -1 },
    { label: 'Religion', want: pr.religion, ok: open(pr.religion) || pr.religion === me.religion },
    { label: 'Community', want: pr.community, ok: open(pr.community) || pr.community === me.community },
    { label: 'Education', want: pr.education.join(', '), ok: graduate.indexOf(me.education) !== -1 },
    { label: 'Profession', want: pr.profession, ok: open(pr.profession) || pr.profession === me.profession },
    { label: 'Income', want: pr.income, ok: open(pr.income) },
    { label: 'Location', want: pr.location, ok: open(pr.location) },
    { label: 'Diet', want: pr.diet, ok: open(pr.diet) || pr.diet === me.diet }
  ];
}

function watermarkLayer() {
  var text = myName();
  var spans = [];
  for (var i = 0; i < 90; i++) spans.push(h('span', { text: text }));
  return h('div', { class: 'watermark', 'aria-hidden': 'true' }, h('div', { class: 'watermark-inner' }, spans));
}

function buildGallery(p) {
  var track = h('div', { class: 'gallery-track', tabindex: '0', role: 'group', 'aria-label': 'Photos of ' + p.name }, p.photos.map(function (src, i) {
    return h('div', { class: 'slide' }, h('img', { src: src, alt: 'Photo ' + (i + 1) + ' of ' + p.photos.length + ' of ' + p.name }));
  }));
  var dots = h('div', { class: 'dots', 'aria-hidden': 'true' }, p.photos.map(function (src, i) { return h('span', { class: 'dot' + (i === 0 ? ' on' : '') }); }));
  track.addEventListener('scroll', function () {
    var index = Math.round(track.scrollLeft / Math.max(track.clientWidth, 1));
    Array.prototype.forEach.call(dots.children, function (dot, i) { dot.classList.toggle('on', i === index); });
  });
  return h('div', { class: 'gallery' }, [track, dots, watermarkLayer()]);
}

function infoCard(id, title, rows) {
  return h('section', { class: 'card info-card', id: id }, [
    h('h3', { text: title }),
    h('dl', { class: 'info-list' }, rows.map(function (row) {
      return h('div', { class: 'info-row' }, [h('dt', { text: row[0] }), h('dd', { text: row[1] })]);
    }))
  ]);
}

function showNumberDialog(p) {
  var number = p.contactNumber;
  UI.dialog({
    title: 'Contact details', dismissValue: true,
    body: h('div', {}, [
      h('p', { class: 'muted', text: 'Contact number of ' + p.name }),
      h('p', { class: 'contact-number', text: fmtPhone(number) }),
      h('div', { class: 'contact-actions' }, [
        h('a', { class: 'btn btn-primary', href: 'tel:+91' + number }, [Icon('phone', 20), 'Call']),
        h('a', { class: 'btn btn-outline', href: 'https://wa.me/91' + number, target: '_blank', rel: 'noopener' }, [Icon('chat', 20), 'WhatsApp']),
        h('button', { type: 'button', class: 'btn btn-outline', onClick: function () { copyText(number, 'Number copied'); } }, [Icon('copy', 20), 'Copy number'])
      ]),
      h('p', { class: 'note-soft', text: 'Please be respectful when contacting the family.' })
    ]),
    actions: [{ label: 'Close', value: true, kind: 'outline' }]
  });
}

// The number stays masked until the member confirms the popup.
function revealContact(p, onRevealed) {
  var a = appState();
  a.revealed = a.revealed || [];
  if (a.revealed.indexOf(p.id) !== -1) { showNumberDialog(p); return; }
  UI.confirm({ title: 'Show contact?', message: 'Contact only for genuine marriage proposals. Continue?', confirmText: 'Continue', cancelText: 'Cancel' }).then(function (yes) {
    if (!yes) return;
    a.revealed.push(p.id);
    if (onRevealed) onRevealed();
    showNumberDialog(p);
  });
}

function openMoreMenu(p) {
  var a = appState();
  UI.sheet({
    title: 'More options', dismissValue: null,
    render: function (close) {
      function row(icon, label, action, danger) {
        return h('button', { type: 'button', class: 'menu-row' + (danger ? ' danger' : ''), onClick: function () { close(null); action(); } }, [Icon(icon), h('span', { text: label })]);
      }
      return {
        footer: null,
        body: h('div', {}, [
          row('share', 'Share profile', function () { copyText('https://samajvivah.example/profile/' + p.profileCode, 'Profile link copied'); }),
          row('flag', 'Report profile', function () { openReport(p); }),
          row('ban', 'Block this member', function () {
            UI.confirm({ title: 'Block ' + p.firstName + '?', message: 'You will no longer see this profile, and they will not see yours.', confirmText: 'Block', danger: true }).then(function (yes) {
              if (!yes) return;
              a.blocked.push(p.id);
              UI.toast(p.firstName + ' has been blocked');
              Router.back('home');
            });
          }, true),
          row('close', 'Not interested', function () {
            a.hidden.push(p.id);
            UI.toast('We will not show this profile again', 'info');
            Router.back('home');
          })
        ])
      };
    }
  });
}

function openReport(p) {
  var reasons = ['Fake or wrong details', 'Inappropriate photos', 'Asked for money', 'Rude behaviour', 'Other'];
  var choice = { reason: '' };
  UI.sheet({
    title: 'Report ' + p.firstName, dismissValue: null,
    render: function (close) {
      var send = h('button', { type: 'button', class: 'btn btn-primary', text: 'Submit report' });
      var error = h('div', { class: 'field-error', role: 'alert' });
      send.addEventListener('click', function () {
        if (!choice.reason) { error.textContent = 'Please choose a reason.'; return; }
        close('sent');
      });
      return { body: h('div', {}, [h('p', { class: 'muted', text: 'Why are you reporting this profile?' }), optionCards(choice, 'reason', reasons, { onChange: function () { error.textContent = ''; } }), error]), footer: send };
    }
  }).promise.then(function (result) { if (result === 'sent') UI.toast('Thank you. Our team will review this profile.'); });
}

function openBiodata(p) {
  var lines = [];
  for (var i = 0; i < 9; i++) lines.push(h('span', { class: 'doc-line', style: 'width:' + (60 + (i * 13) % 40) + '%' }));
  UI.sheet({
    title: 'Biodata', dismissValue: null,
    render: function (close) {
      return {
        body: h('div', {}, [h('div', { class: 'doc-page' }, [h('strong', { text: p.name }), h('span', { class: 'muted', text: p.profileCode })].concat(lines)), h('p', { class: 'muted center', text: p.name.split(' ')[0].toLowerCase() + '_biodata.pdf' })]),
        footer: [h('button', { type: 'button', class: 'btn btn-outline', text: 'Close', onClick: function () { close(null); } }),
          h('button', { type: 'button', class: 'btn btn-primary', onClick: function () { UI.toast('Download started (demo)'); } }, [Icon('upload', 20), 'Download'])]
      };
    }
  });
}

Router.register('profile', function (id) {
  var a = appState();
  var p = profileById(id);
  if (!p || a.blocked.indexOf(p.id) !== -1) {
    var gone = Screen({
      back: true,
      body: [emptyBlock('alert', 'This profile is no longer available', 'It may have been removed or hidden.', 'Back to matches', function () { Router.replace('matches'); })]
    });
    return { el: gone.el, title: 'Profile' };
  }
  if (a.viewed.indexOf(p.id) !== -1) a.viewed.splice(a.viewed.indexOf(p.id), 1);
  a.viewed.unshift(p.id);

  var matches = preferenceMatches(p);
  var matched = matches.filter(function (m) { return m.ok; }).length;
  var ring = progressRing(p.compat, 70, 'Compatibility');
  var contactLine = h('dd', { id: 'contact-line' });
  function paintContact() { contactLine.textContent = a.revealed && a.revealed.indexOf(p.id) !== -1 ? fmtPhone(p.contactNumber) : UI.maskPhone(p.contactNumber); }
  paintContact();

  var sections = [
    ['about', 'About', h('section', { class: 'card info-card', id: 'sec-about' }, [h('h3', { text: 'About ' + p.firstName }), h('p', { text: p.about })])],
    ['basic', 'Basic', infoCard('sec-basic', 'Basic details', [['Age', p.age + ' years'], ['Height', fmtHeight(p.heightIn) + ' (' + cmFromInches(p.heightIn) + ' cm)'], ['Marital status', p.maritalStatus], ['Profile ID', p.profileCode], ['Location', p.city + ', ' + p.state + ', ' + p.country]])],
    ['community', 'Community', infoCard('sec-community', 'Community and horoscope', [['Religion', p.religion], ['Community', p.community], ['Sub-community', p.subCommunity], ['Gotra', p.gotra], ['Mother tongue', p.motherTongue], ['Manglik', p.manglik], ['Rashi', p.rashi], ['Nakshatra', p.nakshatra], ['Time of birth', p.birthTime], ['Place of birth', p.birthPlace]])],
    ['work', 'Education and work', infoCard('sec-work', 'Education and work', [['Qualification', p.education], ['College', p.college], ['Field of study', p.fieldOfStudy], ['Employment', p.employment], ['Profession', p.profession], ['Company', p.company], ['Annual income', p.income]])],
    ['lifestyle', 'Lifestyle', h('section', { class: 'card info-card', id: 'sec-lifestyle' }, [
      h('h3', { text: 'Lifestyle' }),
      h('dl', { class: 'info-list' }, [['Diet', p.diet], ['Drinking', p.drinking], ['Smoking', p.smoking]].map(function (row) { return h('div', { class: 'info-row' }, [h('dt', { text: row[0] }), h('dd', { text: row[1] })]); })),
      h('div', { class: 'chips hobby-chips' }, p.hobbies.map(function (hobby) { return h('span', { class: 'chip static-chip', text: hobby }); }))
    ])],
    ['family', 'Family', infoCard('sec-family', 'Family', [['Father', p.fatherOcc], ['Mother', p.motherOcc], ['Brothers', String(p.brothers)], ['Sisters', String(p.sisters)], ['Family type', p.familyType], ['Family values', p.familyValues], ['Native place', p.nativePlace]])],
    ['partner', 'Partner preferences', h('section', { class: 'card info-card', id: 'sec-partner' }, [
      h('h3', { text: 'Partner preferences' }),
      h('p', { class: 'match-line' }, [h('strong', { text: 'You match ' + matched + ' of ' + matches.length + ' preferences' })]),
      h('div', { class: 'match-bar', role: 'img', 'aria-label': matched + ' of ' + matches.length + ' preferences matched' }, h('span', { style: 'width:' + (matched / matches.length * 100) + '%' })),
      h('ul', { class: 'match-list' }, matches.map(function (m) {
        return h('li', { class: m.ok ? 'ok' : 'no' }, [
          h('span', { class: 'match-icon', 'aria-label': m.ok ? 'Matches' : 'Does not match' }, Icon(m.ok ? 'check' : 'close', 18)),
          h('span', { class: 'match-text' }, [h('strong', { text: m.label }), h('span', { class: 'muted', text: m.want })])
        ]);
      }))
    ])],
    ['biodata', 'Biodata', h('section', { class: 'card info-card', id: 'sec-biodata' }, [
      h('h3', { text: 'Biodata' }),
      p.hasBiodata
        ? h('div', { class: 'file-chip' }, [Icon('file'), h('span', { class: 'name', text: p.firstName.toLowerCase() + '_biodata.pdf' }), h('button', { type: 'button', class: 'btn btn-outline btn-small', text: 'View', onClick: function () { openBiodata(p); } })])
        : h('p', { class: 'muted', text: 'No biodata file has been uploaded.' })
    ])]
  ];

  var tabs = h('div', { class: 'tabs-row', role: 'tablist', 'aria-label': 'Profile sections' }, sections.map(function (s, i) {
    var tab = h('button', { type: 'button', class: 'chip tab-chip' + (i === 0 ? ' on' : ''), role: 'tab', text: s[1] });
    tab.addEventListener('click', function () {
      Array.prototype.forEach.call(tabs.children, function (t) { t.classList.toggle('on', t === tab); });
      var target = body.querySelector('#sec-' + s[0]);
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    return tab;
  }));

  var content = h('div', { class: 'detail-content' }, [
    h('div', { class: 'detail-title' }, [
      h('div', {}, [h('h2', { text: p.name }), p.verified ? verifiedBadge() : null, h('p', { class: 'muted', text: p.lastActive })]),
      h('div', { class: 'compat-ring' }, [ring.node, h('span', { class: 'p-active', text: 'Compatibility' })])
    ]),
    h('div', { class: 'quick-facts' }, [
      [p.age + ' yrs', 'Age'], [fmtHeight(p.heightIn), 'Height'], [p.city, 'Location'], [p.profession, 'Work']
    ].map(function (f) { return h('div', { class: 'fact' }, [h('strong', { text: f[0] }), h('span', { class: 'muted', text: f[1] })]); })),
    tabs
  ].concat(sections.map(function (s) {
    // The Biodata and About sections need ids for the tabs to scroll to.
    s[2].id = 'sec-' + s[0];
    return s[2];
  })).concat([
    h('section', { class: 'card info-card', id: 'sec-contact' }, [h('h3', { text: 'Contact' }), h('dl', { class: 'info-list' }, h('div', { class: 'info-row' }, [h('dt', { text: 'Mobile' }), contactLine]))])
  ]));

  var body = h('div', { class: 'screen-body detail-body' }, [buildGallery(p), content]);
  var actions = h('div', { class: 'action-bar' }, [
    heartButton(p, true),
    interestButton(p, 'btn-primary btn-small action-main'),
    h('button', { type: 'button', class: 'btn btn-outline btn-small action-main', text: 'Show contact', onClick: function () { revealContact(p, paintContact); } })
  ]);
  var header = h('div', { class: 'detail-header on-maroon' }, [
    h('button', { type: 'button', class: 'icon-btn', 'aria-label': 'Go back', onClick: function () { Router.back('matches'); } }, Icon('back')),
    h('h1', { text: p.name }),
    h('button', { type: 'button', class: 'icon-btn', 'aria-label': 'More options', onClick: function () { openMoreMenu(p); } }, Icon('dots'))
  ]);
  var el = h('section', {}, [header, body, actions]);
  return { el: el, title: p.name, mounted: ring.start };
}, { auth: 'approved' });

/* ---------- Tabs built in Part 3 (temporary placeholders so no tab is empty) ---------- */
['interests', 'messages', 'account'].forEach(function (name) {
  Router.register(name, function () {
    var screen = Screen({ body: [h('h1', { class: 'q-title', text: cap(name) }), emptyBlock('clock', 'Coming in Part 3', 'This tab is built in the next part of the demo.')] });
    return { el: screen.el, tab: name, title: cap(name) };
  }, { auth: 'approved' });
});
