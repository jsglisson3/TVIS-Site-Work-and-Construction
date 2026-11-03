// TVIS site behavior: phone menu, More Services dropdown, before/after sliders,
// ad tracking (call taps and leads) and remembering which ad brought the visitor.
(function () {
  'use strict';

  // ---- tracking ----
  // Fires a Google Analytics / Google Ads / Meta Pixel event when those tags are installed.
  function track(name, params) {
    params = params || {};
    var t = window.TVIS_TRACKING || {};
    try {
      if (typeof window.gtag === 'function') {
        window.gtag('event', name === 'lead' ? 'generate_lead' : 'phone_call_click', params);
        if (name === 'lead' && t.adsId && t.adsLeadLabel) window.gtag('event', 'conversion', { send_to: t.adsId + '/' + t.adsLeadLabel });
      }
      if (typeof window.fbq === 'function') window.fbq('track', name === 'lead' ? 'Lead' : 'Contact', params);
    } catch (e) { /* tracking must never break the page */ }
  }
  window.tvisTrack = track;

  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href^="tel:"]');
    if (a) track('call', { link_location: a.className || 'link' });
  });

  // ---- remember the ad (UTM tags) and the first page, for the estimate form ----
  try {
    var q = new URLSearchParams(location.search);
    var keys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'fbclid', 'gclid'];
    var seen = JSON.parse(sessionStorage.getItem('tvis_src') || '{}');
    keys.forEach(function (k) { if (q.get(k)) seen[k] = q.get(k); });
    if (!seen.landing_page) { seen.landing_page = location.pathname + location.hash; seen.referrer = document.referrer || ''; }
    sessionStorage.setItem('tvis_src', JSON.stringify(seen));
  } catch (e) { /* storage blocked: the form still works without it */ }

  // ---- phone menu ----
  var menuBtn = document.querySelector('.menu-btn');
  var menu = document.getElementById('mmenu');
  function setMenu(open) {
    if (!menuBtn || !menu) return;
    menuBtn.setAttribute('aria-expanded', String(open));
    menu.hidden = !open;
    document.body.classList.toggle('menu-open', open);
    menuBtn.querySelector('.menu-label').textContent = open ? 'Close' : 'Menu';
    if (open) { var first = menu.querySelector('a'); if (first) first.focus(); }
  }
  if (menuBtn) menuBtn.addEventListener('click', function () { setMenu(menuBtn.getAttribute('aria-expanded') !== 'true'); });
  document.addEventListener('keydown', function (e) {
    var open = menuBtn && menuBtn.getAttribute('aria-expanded') === 'true';
    if (!open) return;
    if (e.key === 'Escape') { setMenu(false); menuBtn.focus(); return; }
    // while the menu covers the page, Tab cycles through the Close button and the menu's own links
    // instead of wandering into the hidden page underneath
    if (e.key === 'Tab') {
      var stops = [menuBtn].concat([].slice.call(menu.querySelectorAll('a[href], button')));
      var i = stops.indexOf(document.activeElement);
      if (e.shiftKey && i <= 0) { e.preventDefault(); stops[stops.length - 1].focus(); }
      else if (!e.shiftKey && (i === -1 || i === stops.length - 1)) { e.preventDefault(); stops[0].focus(); }
    }
  });
  if (menu) menu.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });

  // ---- header: a soft shadow once the page scrolls under it ----
  var hdr = document.querySelector('.hdr');
  if (hdr) {
    // on wide screens the header also settles to a slimmer bar after a real scroll (and only grows back near the top,
    // so a few pixels of scrolling back and forth never makes it flicker)
    var compact = false;
    var onScroll = function () {
      var y = window.scrollY;
      hdr.classList.toggle('is-scrolled', y > 8);
      if (!compact && y > 140) compact = true; else if (compact && y < 48) compact = false;
      document.documentElement.classList.toggle('hdr-compact', compact);
      // the reading line: the header's bottom edge fills olive as the page is read (CSS --read on .hdr::after)
      var room = document.documentElement.scrollHeight - window.innerHeight;
      document.documentElement.style.setProperty('--read', (room > 0 ? Math.min(100, y / room * 100) : 0).toFixed(1) + '%');
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // ---- desktop menu: one olive marker on the ground line slides to the link under the pointer, then home to the page you are on ----
  var nav = document.querySelector('.hdr .nav'), mark = nav && nav.querySelector('.nav-mark');
  if (nav && mark) {
    var home = nav.querySelector('a[aria-current]');
    var place = function (a, show) {
      if (!a) { mark.style.setProperty('--mo', 0); return; }
      var r = a.getBoundingClientRect(), n = nav.getBoundingClientRect();
      mark.style.setProperty('--mx', (r.left - n.left).toFixed(1) + 'px');
      mark.style.setProperty('--mw', r.width.toFixed(1) + 'px');
      mark.style.setProperty('--mo', show ? 1 : 0);
    };
    var rest = function () { if (home) place(home, true); else place(nav.querySelector('a'), false); };
    document.documentElement.classList.add('nav-js');
    rest();
    nav.addEventListener('mouseover', function (e) { var a = e.target.closest('a'); if (a) place(a, true); });
    nav.addEventListener('mouseleave', rest);
    nav.addEventListener('focusin', function (e) { var a = e.target.closest('a'); if (a) place(a, true); });
    nav.addEventListener('focusout', function (e) { if (!nav.contains(e.relatedTarget)) rest(); });
    window.addEventListener('resize', rest);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(rest);
  }

  // ---- before / after sliders ----
  // The range input is for keyboard and screen readers. Pointer drags are read on the box itself,
  // so a thumb swiping up or down scrolls the page (touch-action: pan-y) and only sideways drags move the handle.
  document.querySelectorAll('[data-ba]').forEach(function (ba) {
    var r = ba.querySelector('.ba-range');
    function set() { ba.style.setProperty('--pos', r.value + '%'); }
    function fromX(x) {
      var box = ba.getBoundingClientRect();
      r.value = Math.round(Math.max(0, Math.min(100, (x - box.left) / box.width * 100)));
      set();
    }
    var dragging = false;
    ba.addEventListener('pointerdown', function (e) {
      if (e.button) return;
      dragging = true; fromX(e.clientX);
      try { ba.setPointerCapture(e.pointerId); } catch (x) {}
    });
    ba.addEventListener('pointermove', function (e) { if (dragging) fromX(e.clientX); });
    ['pointerup', 'pointercancel', 'lostpointercapture'].forEach(function (t) { ba.addEventListener(t, function () { dragging = false; }); });
    r.addEventListener('input', set);
    set();
    // desktop: resting the pointer on a project card glides the handle across to the finished photo, and back on
    // leave (.ba-glide carries the transition). Once the visitor drags it themselves, their position is kept.
    var card = ba.closest('.proj');
    if (card && ba.querySelector('.ba-after') && window.matchMedia('(hover:hover) and (pointer:fine)').matches && !window.matchMedia('(prefers-reduced-motion:reduce)').matches) {
      var home = null, taken = false, back;
      card.addEventListener('mouseenter', function () { if (taken) return; home = r.value; clearTimeout(back); ba.classList.add('ba-glide'); r.value = 6; set(); });
      card.addEventListener('mouseleave', function () { if (taken || home === null) return; r.value = home; set(); back = setTimeout(function () { ba.classList.remove('ba-glide'); }, 850); });
      ba.addEventListener('pointerdown', function () { taken = true; clearTimeout(back); ba.classList.remove('ba-glide'); }, true);
    }
  });

  // ---- current year in the footer ----
  document.querySelectorAll('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });
})();

// ---- phones, homepage: the Call / Get an Estimate bar waits until the opening has scrolled away,
//      because the opening already carries both buttons ----
(function () {
  var hero = document.querySelector('.hero');
  if (!hero) return;
  var phone = window.matchMedia('(max-width: 900px)');
  var shown = false, ticking = false;
  // Slides in once the opening's buttons have scrolled away, and only slides back out near the top,
  // so a few pixels of scrolling back and forth never makes it flicker.
  var act = hero.querySelector('.hero-act') || hero;
  function update() {
    ticking = false;
    var below = window.innerHeight - act.getBoundingClientRect().bottom; // room under the opening's buttons
    if (!phone.matches) shown = true;
    else if (!shown && below > 240) shown = true;
    else if (shown && below < 160) shown = false;
    document.body.classList.toggle('mbar-wait', !shown);
  }
  window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  window.addEventListener('resize', update);
  update();
})();

// ---- ?slots shows the file name each empty photo spot wants (for adding photos, not for visitors) ----
if (/[?&]slots\b/.test(location.search)) {
  document.body.classList.add('show-slots');
  document.querySelectorAll('.slot-note').forEach(function (n) { n.hidden = false; n.closest('[hidden]') && (n.closest('[hidden]').hidden = false); });
}

// ---- footer dozer: rolls in once when the footer comes into view ----
(function () {
  var g = document.querySelector('[data-ground]');
  if (!g || !('IntersectionObserver' in window)) return;
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  g.classList.add('armed');
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        // two frames after the armed state has painted, so the roll never starts from a state the phone hasn't drawn yet
        requestAnimationFrame(function () { requestAnimationFrame(function () { g.classList.add('go'); }); });
        io.disconnect();
      }
    });
  }, { threshold: 0.6 });
  io.observe(g);
})();

// ---- shed pad cross-section: layers build up once when it scrolls into view ----
(function () {
  var x = document.querySelector('[data-xsec]');
  if (!x || !('IntersectionObserver' in window)) return;
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  x.classList.add('armed');
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { requestAnimationFrame(function () { x.classList.add('go'); }); io.disconnect(); }
    });
  }, { threshold: 0.45 });
  io.observe(x);
})();

// ---- jump links: underline the section currently on screen ----
(function () {
  var links = [].slice.call(document.querySelectorAll('.jump a[href^="#"]'));
  if (!links.length || !('IntersectionObserver' in window)) return;
  var byId = {};
  links.forEach(function (a) { byId[a.getAttribute('href').slice(1)] = a; });
  var seen = {};
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { seen[e.target.id] = e.isIntersecting; });
    var cur = Object.keys(byId).filter(function (id) { return seen[id]; })[0];
    links.forEach(function (a) { a.classList.remove('on'); a.removeAttribute('aria-current'); });
    var a = cur && byId[cur];
    if (a) { a.classList.add('on'); a.setAttribute('aria-current', 'location'); var bar = a.closest('ul'); if (bar && bar.scrollWidth > bar.clientWidth) bar.scrollTo({ left: Math.max(0, a.offsetLeft - 24), behavior: 'smooth' }); }
  }, { rootMargin: '-40% 0px -55% 0px' });
  Object.keys(byId).forEach(function (id) { var s = document.getElementById(id); if (s) io.observe(s); });
})();

// ---- projects page: category filter buttons (?type=drainage deep links work too) ----
(function () {
  var bar = document.querySelector('[data-filters]');
  if (!bar) return;
  var cards = [].slice.call(document.querySelectorAll('.proj-all .proj'));
  var empty = document.querySelector('[data-empty]');
  var status = document.querySelector('.filter-status');
  bar.hidden = false;
  // the build writes a button only for categories that have a project, so nothing is hidden here after paint
  function apply(cat, push) {
    var shown = 0;
    cards.forEach(function (c) { var on = cat === 'all' || c.getAttribute('data-category') === cat; c.hidden = !on; if (on) shown++; });
    bar.querySelectorAll('button').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-filter') === cat)); });
    if (empty) empty.hidden = shown > 0;
    if (status) status.textContent = shown + (shown === 1 ? ' project' : ' projects') + ' shown';
    if (push) { try { var u = new URL(location.href); if (cat === 'all') u.searchParams.delete('type'); else u.searchParams.set('type', cat); history.replaceState(null, '', u); } catch (e) {} }
  }
  bar.addEventListener('click', function (e) { var b = e.target.closest('button'); if (b) apply(b.getAttribute('data-filter'), true); });
  var start = new URLSearchParams(location.search).get('type');
  if (start && bar.querySelector('[data-filter="' + start.replace(/[^a-z-]/g, '') + '"]')) apply(start, false);
})();

// ---- estimate form: prefill, photo previews and shrinking, spam checks, send, thank-you ----
(function () {
  var box = document.querySelector('[data-estimate]');
  if (!box) return;
  var form = box.querySelector('form');
  form.noValidate = true; // the inline messages below replace the browser's own bubbles (kept for visitors without JavaScript)
  var typeSel = form.querySelector('#f-type');
  var whoRadios = [].slice.call(form.querySelectorAll('input[name="I am a"]'));
  var fileInput = form.querySelector('input[type=file]');
  var thumbs = form.querySelector('[data-thumbs]');
  var photoErr = form.querySelector('[data-photo-err]');
  var hint = form.querySelector('[data-hint]');
  var pdfNote = form.querySelector('[data-pdf-note]');
  var sendBtn = form.querySelector('.est-send');
  var fail = form.querySelector('[data-fail]');
  var thanks = box.querySelector('[data-thanks]');
  var MAX_FILES = 10, MAX_BYTES = 25 * 1024 * 1024, MAX_PX = 1600;
  var files = [];                 // the running list of photos the visitor picked
  var opened = Date.now();        // for the "sent too fast" spam check

  // the visible label is what gets emailed, so make it the value too
  [].forEach.call(typeSel.options, function (o) { if (o.textContent && o.value === '') o.value = o.textContent; });
  typeSel.options[0].value = '';

  // ---- prefill from the button that sent the visitor (?type=pad&who=builder), or the page's defaults
  var q = new URLSearchParams(location.search);
  var type = q.get('type') || box.getAttribute('data-type');
  var who = q.get('who') || box.getAttribute('data-who');
  if (type) { var opt = typeSel.querySelector('option[data-type="' + type.replace(/[^a-z]/g, '') + '"]'); if (opt) opt.selected = true; }
  if (who) whoRadios.forEach(function (r) { if (r.getAttribute('data-who') === who.replace(/[^a-z]/g, '')) r.checked = true; });

  // ---- remembers a half-finished request on this device for a week, so a call or a closed tab doesn't mean retyping
  var DRAFT = 'tvis_estimate_draft', saveTimer;
  var draftFields = [].filter.call(form.elements, function (el) { return el.name && !el.hasAttribute('data-src') && el.name !== '_gotcha' && el.type !== 'file' && el.type !== 'hidden' && el.type !== 'submit'; });
  function saveDraft() {
    var d = { t: Date.now(), v: {} };
    draftFields.forEach(function (el) { if (el.type === 'radio') { if (el.checked) d.v[el.name] = el.value; } else if (el.value) d.v[el.name] = el.value; });
    try { localStorage.setItem(DRAFT, JSON.stringify(d)); } catch (e) {}
  }
  function clearDraft() { try { localStorage.removeItem(DRAFT); } catch (e) {} }
  form.addEventListener('input', function () { clearTimeout(saveTimer); saveTimer = setTimeout(saveDraft, 300); });
  form.addEventListener('change', saveDraft);
  (function restoreDraft() {
    var d = null;
    try { d = JSON.parse(localStorage.getItem(DRAFT) || 'null'); } catch (e) {}
    if (!d || !d.v || Date.now() - d.t > 7 * 864e5) { if (d) clearDraft(); return; }
    var typed = false;
    draftFields.forEach(function (el) {
      var v = d.v[el.name]; if (v === undefined) return;
      if (el.type === 'radio') { if (!q.get('who')) el.checked = el.value === v; return; } // a button that said who they are wins
      if (el === typeSel && q.get('type')) return;                                          // and so does one that named the job
      el.value = v;
      if (el.tagName === 'TEXTAREA' || /^(text|tel|email)$/.test(el.type)) typed = true;
    });
    if (!typed) return;
    var note = document.createElement('p');
    note.className = 'draft-note'; note.setAttribute('role', 'status');
    note.innerHTML = '<span>We kept what you typed earlier.</span><button type="button">Start over</button>';
    note.querySelector('button').addEventListener('click', function () { clearDraft(); location.reload(); });
    form.insertAdjacentElement('afterbegin', note);
  })();

  // ---- hidden source fields, from what site.js remembered on the first page
  var src = {};
  try { src = JSON.parse(sessionStorage.getItem('tvis_src') || '{}'); } catch (e) {}
  src.page = location.pathname + location.search;
  if (!src.landing_page) src.landing_page = location.pathname;
  if (src.referrer === undefined) src.referrer = document.referrer || '';
  form.querySelectorAll('[data-src]').forEach(function (h) { h.value = src[h.getAttribute('data-src')] || ''; });

  // ---- builders can attach PDF plans
  function syncWho() {
    var builder = whoRadios.some(function (r) { return r.checked && r.getAttribute('data-who') === 'builder'; });
    fileInput.setAttribute('accept', builder ? fileInput.getAttribute('data-accept-builder') : 'image/*');
    if (hint) hint.textContent = builder ? 'Photos of the lot, plus PDF plans or a plat if you have them. Up to 10 files.' : 'Take new ones or pick from your phone. Up to 10 photos.';
    if (pdfNote) pdfNote.hidden = builder;
  }
  whoRadios.forEach(function (r) { r.addEventListener('change', syncWho); });
  syncWho();

  // ---- photos: keep a list with thumbnails, so picking twice adds instead of replacing
  function renderThumbs() {
    thumbs.innerHTML = '';
    files.forEach(function (f, i) {
      var li = document.createElement('li');
      if (/pdf/i.test(f.type) || /\.pdf$/i.test(f.name)) {
        var d = document.createElement('div'); d.className = 'pdf'; d.textContent = f.name; li.appendChild(d);
      } else {
        var img = document.createElement('img'); img.alt = 'Photo ' + (i + 1); img.src = URL.createObjectURL(f);
        img.onload = function () { URL.revokeObjectURL(img.src); };
        li.appendChild(img);
      }
      var rm = document.createElement('button'); rm.type = 'button'; rm.textContent = '×'; rm.setAttribute('aria-label', 'Remove ' + f.name);
      rm.addEventListener('click', function () { files.splice(i, 1); renderThumbs(); });
      li.appendChild(rm);
      thumbs.appendChild(li);
    });
  }
  fileInput.addEventListener('change', function () {
    var msg = '';
    [].forEach.call(fileInput.files, function (f) {
      if (files.length >= MAX_FILES) { msg = 'That\'s the limit of ' + MAX_FILES + ' files. You can send more after we talk.'; return; }
      if (f.size > MAX_BYTES) { msg = f.name + ' is too large (over 25 MB).'; return; }
      files.push(f);
    });
    fileInput.value = '';
    photoErr.textContent = msg; photoErr.hidden = !msg;
    renderThumbs();
  });

  // Shrinks a photo to ~1600px JPEG before upload (phone photos are often 4000px+ and 5 MB each).
  // Returns the original if the browser can't decode it (HEIC in Chrome) or it's already small.
  function shrink(file) {
    return new Promise(function (resolve) {
      if (!/^image\//.test(file.type) || /gif|svg/.test(file.type) || file.size < 400 * 1024) return resolve(file);
      var img = new Image(), url = URL.createObjectURL(file);
      img.onload = function () {
        URL.revokeObjectURL(url);
        var s = Math.min(1, MAX_PX / Math.max(img.naturalWidth, img.naturalHeight));
        if (s === 1 && file.size < 1.5 * 1024 * 1024) return resolve(file);
        var c = document.createElement('canvas');
        c.width = Math.round(img.naturalWidth * s); c.height = Math.round(img.naturalHeight * s);
        c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
        c.toBlob(function (b) {
          if (!b) return resolve(file);
          resolve(new File([b], file.name.replace(/\.\w+$/, '') + '.jpg', { type: 'image/jpeg', lastModified: file.lastModified }));
        }, 'image/jpeg', 0.82);
      };
      img.onerror = function () { URL.revokeObjectURL(url); resolve(file); };
      img.src = url;
    });
  }
  window.tvisShrinkPhoto = shrink; // for the future "Visualize your project" page

  // ---- inline validation
  function setErr(el, bad) {
    var err = el.closest('.f').querySelector('.f-err');
    el.setAttribute('aria-invalid', bad ? 'true' : 'false');
    if (err) {
      err.hidden = !bad;
      // tie the message to its field, so a screen reader reads it out when the field gets focus
      if (!err.id) err.id = el.id + '-err';
      if (bad) el.setAttribute('aria-describedby', err.id); else el.removeAttribute('aria-describedby');
    }
    return !bad;
  }
  // one field on its own (used while the visitor fixes it, so focus stays where they are typing)
  function checkField(el) {
    var bad = el.required && !el.value.trim();
    if (el.type === 'tel' && !bad && el.value.trim()) bad = el.value.replace(/\D/g, '').length < 10;
    if (el.type === 'email' && !bad && el.value.trim()) bad = !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(el.value);
    return setErr(el, bad);
  }
  function validate() {
    var ok = true, first = null;
    form.querySelectorAll('[required]').forEach(function (el) {
      var bad = !el.value.trim();
      if (el.type === 'tel' && !bad) bad = el.value.replace(/\D/g, '').length < 10;
      if (!setErr(el, bad)) { ok = false; first = first || el; }
    });
    var em = form.querySelector('#f-email');
    if (em && em.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em.value)) { setErr(em, true); ok = false; first = first || em; }
    if (first) first.focus();
    return ok;
  }
  form.querySelectorAll('[required], #f-email').forEach(function (el) {
    // once a field has been flagged, clear (or update) its own message as the visitor types; never move focus
    var recheck = function () { if (el.getAttribute('aria-invalid') === 'true') checkField(el); };
    el.addEventListener('input', recheck);
    el.addEventListener('change', recheck);
  });

  function showThanks() {
    clearDraft();
    form.hidden = true;
    var notice = box.querySelector('.form-off'); if (notice) notice.hidden = true;
    thanks.hidden = false;
    var h = thanks.querySelector('.thanks-h'); if (h) h.focus({ preventScroll: true });
    thanks.scrollIntoView({ block: 'start', behavior: 'smooth' });
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    fail.hidden = true;
    if (!form.getAttribute('action')) {
      var off = box.querySelector('.form-off');
      if (off) { off.classList.remove('flash'); void off.offsetWidth; off.classList.add('flash'); off.scrollIntoView({ block: 'center', behavior: 'smooth' }); }
      return;
    }
    if (!validate()) return;
    // honeypot filled or sent within 3 seconds: almost certainly a bot, so pretend it worked
    if (form.querySelector('[name=_gotcha]').value || Date.now() - opened < 3000) { showThanks(); return; }
    sendBtn.disabled = true; sendBtn.textContent = files.length ? 'Sending photos…' : 'Sending…';
    var fd = new FormData(form);
    fd.delete('photos[]');
    Promise.all(files.map(shrink)).then(function (ready) {
      ready.forEach(function (f) { fd.append('photos[]', f, f.name); });
      return fetch(form.getAttribute('action'), { method: 'POST', body: fd, headers: { Accept: 'application/json' } });
    }).then(function (r) {
      if (!r.ok) throw new Error('HTTP ' + r.status);
      if (window.tvisTrack) window.tvisTrack('lead', { project_type: typeSel.value, customer_type: (whoRadios.filter(function (x) { return x.checked; })[0] || {}).value, photos: files.length });
      showThanks();
    }).catch(function () {
      fail.hidden = false;
      sendBtn.disabled = false; sendBtn.textContent = 'Send estimate request';
    });
  });
})();

// ---- /thanks (Basin's redirect for browsers without JavaScript): count the lead here instead ----
if (document.body.classList.contains('page-thanks') && window.tvisTrack) window.tvisTrack('lead', { via: 'redirect' });

// ---- project pages: tap a gallery photo to see it full screen; swipe, arrow keys or the buttons move through the job ----
// Without JavaScript the tile is still a plain link to the big photo, so nothing is lost.
(function () {
  var tiles = [].slice.call(document.querySelectorAll('.pd-photo'));
  if (!tiles.length || typeof HTMLDialogElement !== 'function') return;
  var dlg = document.createElement('dialog');
  dlg.className = 'lb';
  dlg.setAttribute('aria-label', 'Photo viewer');
  dlg.innerHTML = '<figure class="lb-fig"><img class="lb-img" alt=""><figcaption class="lb-cap"><span class="lb-n" aria-live="polite"></span></figcaption></figure>' +
    '<button class="lb-btn lb-prev" type="button" aria-label="Previous photo"><svg viewBox="0 0 24 24" aria-hidden="true"><use href="#i-arrow"/></svg></button>' +
    '<button class="lb-btn lb-next" type="button" aria-label="Next photo"><svg viewBox="0 0 24 24" aria-hidden="true"><use href="#i-arrow"/></svg></button>' +
    '<button class="lb-btn lb-close" type="button" aria-label="Close photo viewer"><svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.6" d="M6 6l12 12M18 6L6 18"/></svg></button>';
  document.body.appendChild(dlg);
  var img = dlg.querySelector('.lb-img'), num = dlg.querySelector('.lb-n'), at = 0, from = null;
  var many = tiles.length > 1;
  if (!many) dlg.classList.add('lb-one');

  function show(i, dir) {
    at = (i + tiles.length) % tiles.length;
    var src = tiles[at].querySelector('img');
    img.classList.remove('lb-in', 'lb-l', 'lb-r'); void img.offsetWidth;
    img.removeAttribute('srcset');
    img.src = tiles[at].getAttribute('href');
    if (src) { img.srcset = src.getAttribute('srcset') || ''; img.sizes = '100vw'; img.alt = src.alt; }
    img.classList.add('lb-in', dir < 0 ? 'lb-l' : dir > 0 ? 'lb-r' : 'lb-c');
    num.textContent = many ? (at + 1) + ' / ' + tiles.length : '';
    // warm up the neighbours so the next swipe is instant
    [1, -1].forEach(function (d) { var t = tiles[(at + d + tiles.length) % tiles.length]; if (t) new Image().src = t.getAttribute('href'); });
  }
  function close() { dlg.classList.add('lb-out'); setTimeout(function () { dlg.close(); }, 180); }

  tiles.forEach(function (t, i) {
    t.addEventListener('click', function (e) {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button) return; // a new tab still gets the plain photo
      e.preventDefault();
      from = t;
      dlg.classList.remove('lb-out');
      show(i, 0);
      dlg.showModal();
      document.documentElement.classList.add('lb-open');
    });
  });
  dlg.addEventListener('close', function () {
    document.documentElement.classList.remove('lb-open');
    dlg.classList.remove('lb-out');
    if (from) from.focus({ preventScroll: true });
  });
  dlg.addEventListener('cancel', function (e) { e.preventDefault(); close(); });
  dlg.querySelector('.lb-prev').addEventListener('click', function () { show(at - 1, -1); });
  dlg.querySelector('.lb-next').addEventListener('click', function () { show(at + 1, 1); });
  dlg.querySelector('.lb-close').addEventListener('click', close);
  dlg.addEventListener('keydown', function (e) {
    if (!many) return;
    if (e.key === 'ArrowLeft') { e.preventDefault(); show(at - 1, -1); }
    if (e.key === 'ArrowRight') { e.preventDefault(); show(at + 1, 1); }
  });
  // a tap on the dark backdrop (not the photo or a button) closes; a sideways swipe moves through the photos
  var sx = null, sy = 0, moved = false;
  dlg.addEventListener('pointerdown', function (e) { sx = e.clientX; sy = e.clientY; moved = false; });
  dlg.addEventListener('pointerup', function (e) {
    if (sx === null) return;
    var dx = e.clientX - sx, dy = e.clientY - sy; sx = null;
    if (many && Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) { moved = true; show(at + (dx < 0 ? 1 : -1), dx < 0 ? 1 : -1); }
  });
  dlg.addEventListener('click', function (e) {
    if (moved) { moved = false; return; }
    if (e.target === dlg || e.target.classList.contains('lb-fig')) close();
  });
})();

// ---- "Copied" notes: an email link also copies the address; the Share button on a project page opens the phone's
//      share sheet, or copies the page's link on a computer. The mail app still opens where there is one. ----
(function () {
  var canCopy = !!(navigator.clipboard && window.isSecureContext);
  function noteAfter(el, before) { var n = document.createElement('span'); n.className = 'copied'; n.setAttribute('role', 'status'); el.insertAdjacentElement(before ? 'beforebegin' : 'afterend', n); return n; }
  function flash(note, text) {
    note.textContent = text;
    note.classList.remove('on'); void note.offsetWidth; note.classList.add('on');
    clearTimeout(note.timer);
    note.timer = setTimeout(function () { note.classList.remove('on'); note.textContent = ''; }, 1800);
  }
  if (canCopy) [].forEach.call(document.querySelectorAll('a[href^="mailto:"]'), function (a) {
    var note = noteAfter(a);
    a.addEventListener('click', function () {
      navigator.clipboard.writeText(a.getAttribute('href').replace(/^mailto:/, '').split('?')[0]).then(function () { flash(note, 'Copied'); }).catch(function () {});
    });
  });
  var share = document.querySelector('[data-share]');
  if (!share) return;
  var url = location.origin + location.pathname;
  var sheet = !!navigator.share && window.matchMedia('(pointer:coarse)').matches;
  if (!sheet && !canCopy) return;
  share.hidden = false;
  var snote = noteAfter(share, true); // before the button, so it never runs past the page edge
  share.addEventListener('click', function () {
    if (sheet) { navigator.share({ title: document.title, url: url }).catch(function () {}); return; }
    navigator.clipboard.writeText(url).then(function () { flash(snote, 'Link copied'); }).catch(function () {});
  });
})();
