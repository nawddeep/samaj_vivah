/* autocomplete.js: type-ahead search for long lists (colleges today) and the field that shows it.
   Part 1 is pure text matching (no DOM). Part 2 is autocompleteField(), built with h() like every other control.
   Loaded after app.js and before screens.js; fieldWrap() comes from screens.js and is only used when a screen is built. */

/* ---------- Part 1: matching ---------- */

// Words left out of initials, so "Shri Ram College of Commerce" can be found as "srcc".
var AC_SKIP_WORDS = { of: true, and: true, the: true, for: true, in: true, at: true };

// "I.I.T. Bombay," -> "iit bombay". Dots, commas and apostrophes vanish (so I.I.T = IIT), other symbols become one space.
// map[i] is the position in the original text of normalized character i, used to bold the typed part.
function acNormalizeMap(text) {
  var source = String(text || '');
  var out = '';
  var map = [];
  for (var i = 0; i < source.length; i++) {
    var ch = source.charAt(i).toLowerCase();
    if (/[.,'’`]/.test(ch)) continue;
    if (!/[a-z0-9ऀ-ॿ]/.test(ch)) {
      if (!out || out.charAt(out.length - 1) === ' ') continue;
      ch = ' ';
    }
    out += ch;
    map.push(i);
  }
  if (out.charAt(out.length - 1) === ' ') { out = out.slice(0, -1); map.pop(); }
  return { text: out, map: map };
}

function acNormalize(text) { return acNormalizeMap(text).text; }

function acInitials(normalized) {
  return normalized.split(' ').filter(function (w) { return w && !AC_SKIP_WORDS[w]; }).map(function (w) { return w.charAt(0); }).join('');
}

// True when every typed word starts some word of the text, in any order ("bombay iit" finds "iit bombay").
function acAllWordsStart(normalized, tokens) {
  var padded = ' ' + normalized;
  return tokens.every(function (tok) { return padded.indexOf(' ' + tok) !== -1; });
}

// Builds the search index once: list items plus their normalized names, aliases and initials.
function acIndex(list, nameOf, aliasesOf) {
  return list.map(function (item, i) {
    var name = acNormalize(nameOf(item));
    var aliases = (aliasesOf(item) || []).map(acNormalize).filter(Boolean);
    return { item: item, order: i, name: name, aliases: aliases, initials: acInitials(name) };
  });
}

// Lower is better; -1 means no match. The order follows the agreed ranking:
// 0 the name starts with the text (or the text is exactly a known short form like "du" or "srcc"),
// 1 a word in the name starts with it, 2 the name contains it, 3 all typed words start words of the name,
// 4 a short form, old name or the initials match.
function acTier(entry, q, tokens) {
  var padded = ' ' + entry.name;
  if (entry.name.indexOf(q) === 0) return 0;
  if (entry.aliases.indexOf(q) !== -1 || entry.initials === q) return 0;
  if (padded.indexOf(' ' + q) !== -1) return 1;
  if (entry.name.indexOf(q) !== -1) return 2;
  if (tokens.length > 1 && acAllWordsStart(entry.name, tokens)) return 3;
  var aliasHit = entry.aliases.some(function (a) {
    return a.indexOf(q) === 0 || (' ' + a).indexOf(' ' + q) !== -1 || acAllWordsStart(a, tokens);
  });
  if (aliasHit || entry.initials.indexOf(q) === 0) return 4;
  return -1;
}

// Returns up to `limit` items, best first. Ties keep the list order.
function acSearch(index, query, limit) {
  var q = acNormalize(query);
  if (!q) return [];
  var tokens = q.split(' ');
  var hits = [];
  index.forEach(function (entry) {
    var tier = acTier(entry, q, tokens);
    if (tier !== -1) hits.push({ entry: entry, tier: tier });
  });
  hits.sort(function (a, b) { return a.tier - b.tier || a.entry.order - b.entry.order; });
  return hits.slice(0, limit || 8).map(function (hit) { return hit.entry.item; });
}

// Splits `text` into plain strings and <strong> nodes around the part that matches what was typed.
// Text only (no innerHTML), so names with apostrophes or user input stay safe.
function acHighlight(text, query) {
  var norm = acNormalizeMap(text);
  var q = acNormalize(query);
  var ranges = [];
  function addRange(start, len) {
    if (start < 0 || !len) return;
    ranges.push([norm.map[start], norm.map[start + len - 1] + 1]);
  }
  if (q) {
    var padded = ' ' + norm.text;
    var at = padded.indexOf(' ' + q);
    if (at !== -1) addRange(at, q.length);
    else if (norm.text.indexOf(q) !== -1) addRange(norm.text.indexOf(q), q.length);
    else q.split(' ').forEach(function (tok) { var w = padded.indexOf(' ' + tok); if (w !== -1) addRange(w, tok.length); });
  }
  ranges.sort(function (a, b) { return a[0] - b[0]; });
  var parts = [];
  var pos = 0;
  ranges.forEach(function (r) {
    if (r[0] < pos) return; // overlapping word matches: keep the first
    if (r[0] > pos) parts.push(text.slice(pos, r[0]));
    parts.push(h('strong', { text: text.slice(r[0], r[1]) }));
    pos = r[1];
  });
  if (pos < text.length) parts.push(text.slice(pos));
  return parts;
}

/* ---------- Part 2: the field ---------- */

// autocompleteField(obj, key, label, searchFn, o)
//   searchFn(query) -> [{ value, sub, badge }] (best first). Whatever is typed is saved too, so names
//   missing from the list still work. o: { placeholder, hint, maxlength (80), max (8), onChange(value) }
function autocompleteField(obj, key, label, searchFn, o) {
  o = o || {};
  var id = uid('ac');
  var listId = id + '-list';
  var maxLen = o.maxlength || 80;
  var input = h('input', {
    class: 'input ac-input', id: id, type: 'text', role: 'combobox', autocomplete: 'off', spellcheck: 'false',
    'aria-autocomplete': 'list', 'aria-expanded': 'false', 'aria-controls': listId,
    maxlength: String(maxLen), placeholder: o.placeholder || ''
  });
  var clearBtn = h('button', { type: 'button', class: 'icon-btn ac-clear', 'aria-label': t('ac.clear') }, Icon('close'));
  var list = h('ul', { class: 'ac-list', id: listId, role: 'listbox', 'aria-label': label, hidden: true });
  var live = h('span', { class: 'visually-hidden', 'aria-live': 'polite' });
  var items = [];
  var active = -1;
  var blurTimer = null;

  input.value = obj[key] || '';

  function save(value) {
    obj[key] = value;
    if (o.onChange) o.onChange(value);
  }
  function paintClear() { clearBtn.hidden = !input.value; }

  function setActive(i) {
    active = i;
    Array.prototype.forEach.call(list.children, function (node, k) {
      var on = k === i;
      node.classList.toggle('active', on);
      node.setAttribute('aria-selected', on ? 'true' : 'false');
      if (on) node.scrollIntoView({ block: 'nearest' });
    });
    if (i >= 0) input.setAttribute('aria-activedescendant', id + '-o' + i);
    else input.removeAttribute('aria-activedescendant');
  }

  function close() {
    list.hidden = true;
    clearNode(list);
    items = [];
    active = -1;
    input.setAttribute('aria-expanded', 'false');
    input.removeAttribute('aria-activedescendant');
  }

  function open() {
    var typed = input.value.trim();
    if (!typed) { close(); return; }
    var found = searchFn(typed).slice(0, o.max || 8);
    // Nothing in the list: offer the typed text itself, so any college can be entered.
    items = found.length ? found : [{ value: typed.slice(0, maxLen), custom: true }];
    clearNode(list);
    items.forEach(function (item, i) {
      var name = item.custom ? [t('ac.use', { text: item.value })] : acHighlight(item.value, typed);
      var option = h('li', { id: id + '-o' + i, role: 'option', class: 'ac-option' + (item.custom ? ' ac-custom' : ''), 'aria-selected': 'false' }, [
        h('span', { class: 'ac-main' }, [h('span', { class: 'ac-name' }, name), item.badge ? h('span', { class: 'ac-badge', text: item.badge }) : null]),
        item.sub ? h('span', { class: 'ac-sub', text: item.sub }) : null
      ]);
      // mousedown would move focus out of the input and close the list before the tap lands.
      option.addEventListener('mousedown', function (event) { event.preventDefault(); });
      option.addEventListener('click', function () { choose(i); });
      list.appendChild(option);
    });
    list.hidden = false;
    input.setAttribute('aria-expanded', 'true');
    live.textContent = found.length ? t('ac.count', { n: found.length }) : t('ac.none');
    setActive(-1);
  }

  function choose(i) {
    var item = items[i];
    if (!item) return;
    input.value = item.value;
    save(item.value);
    close();
    paintClear();
    live.textContent = t('ac.chosen', { text: item.value });
  }

  input.addEventListener('input', function () {
    // maxlength stops typing, but not every paste or autofill, so trim here too.
    if (input.value.length > maxLen) input.value = input.value.slice(0, maxLen);
    save(input.value);
    paintClear();
    open();
  });
  input.addEventListener('keydown', function (event) {
    var isOpen = !list.hidden && items.length;
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (!isOpen) open(); else setActive((active + 1) % items.length);
    } else if (event.key === 'ArrowUp') {
      if (!isOpen) return;
      event.preventDefault();
      setActive(active <= 0 ? items.length - 1 : active - 1);
    } else if (event.key === 'Enter' && isOpen) {
      // Enter picks the highlighted suggestion (or just closes the list) instead of moving to the next step.
      event.preventDefault();
      event.stopPropagation();
      if (active >= 0) choose(active); else close();
    } else if (event.key === 'Escape' && isOpen) {
      event.preventDefault();
      event.stopPropagation();
      close();
    } else if (event.key === 'Tab') {
      close();
    }
  });
  input.addEventListener('blur', function () { blurTimer = setTimeout(close, 150); });
  input.addEventListener('focus', function () { clearTimeout(blurTimer); });
  clearBtn.addEventListener('click', function () {
    input.value = '';
    save('');
    close();
    paintClear();
    input.focus();
  });

  paintClear();
  var box = h('div', { class: 'ac-wrap' }, [h('div', { class: 'ac-box' }, [input, clearBtn]), list, live]);
  return fieldWrap(label, box, key, o.hint, id);
}
