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
    if (e.key !== 'Escape') return;
    if (menuBtn && menuBtn.getAttribute('aria-expanded') === 'true') { setMenu(false); menuBtn.focus(); }
    document.querySelectorAll('.has-sub.open').forEach(function (li) { li.classList.remove('open'); li.querySelector('.sub-btn').setAttribute('aria-expanded', 'false'); });
  });
  if (menu) menu.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });

  // ---- More Services dropdown (click / tap / keyboard) ----
  document.querySelectorAll('.sub-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var li = btn.parentElement, open = !li.classList.contains('open');
      li.classList.toggle('open', open);
      btn.setAttribute('aria-expanded', String(open));
    });
  });
  document.addEventListener('click', function (e) {
    document.querySelectorAll('.has-sub.open').forEach(function (li) {
      if (!li.contains(e.target)) { li.classList.remove('open'); li.querySelector('.sub-btn').setAttribute('aria-expanded', 'false'); }
    });
  });

  // ---- before / after sliders ----
  document.querySelectorAll('[data-ba]').forEach(function (ba) {
    var r = ba.querySelector('.ba-range');
    function set() { ba.style.setProperty('--pos', r.value + '%'); }
    r.addEventListener('input', set);
    set();
  });

  // ---- current year in the footer ----
  document.querySelectorAll('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });
})();

// ---- header: white-on-colour over olive and charcoal sections, solid white elsewhere ----
(function () {
  var hdr = document.querySelector('[data-hdr]');
  if (!hdr || !('IntersectionObserver' in window)) return;
  var fields = [].slice.call(document.querySelectorAll('[data-chapter]'));
  var io, on = {};
  function build() {
    if (io) io.disconnect();
    // only the band the header covers counts, so the switch happens exactly at a section edge
    io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { on[e.target.getAttribute('data-id')] = e.isIntersecting ? e.target.getAttribute('data-chapter') : ''; });
      var kinds = fields.map(function (f) { return on[f.getAttribute('data-id')]; });
      hdr.classList.toggle('over-field', kinds.indexOf('olive') !== -1);
      hdr.classList.toggle('over-dark', kinds.indexOf('olive') === -1 && kinds.indexOf('dark') !== -1);
    }, { rootMargin: '0px 0px -' + Math.max(0, window.innerHeight - hdr.offsetHeight) + 'px 0px' });
    fields.forEach(function (f, i) { f.setAttribute('data-id', String(i)); io.observe(f); });
  }
  build();
  var t; window.addEventListener('resize', function () { clearTimeout(t); t = setTimeout(build, 150); });
  // tuck the header away while reading down the page; bring it back on the first scroll up
  var last = window.scrollY, ticking = false;
  window.addEventListener('scroll', function () {
    if (ticking) return; ticking = true;
    requestAnimationFrame(function () {
      var y = window.scrollY, down = y > last + 4, up = y < last - 4;
      if (down && y > 240 && !document.body.classList.contains('menu-open')) hdr.classList.add('tucked');
      else if (up || y <= 240) hdr.classList.remove('tucked');
      last = y; ticking = false;
    });
  }, { passive: true });
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
    entries.forEach(function (e) { if (e.isIntersecting) { g.classList.add('go'); io.disconnect(); } });
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
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      links.forEach(function (a) { a.classList.remove('on'); a.removeAttribute('aria-current'); });
      var a = byId[e.target.id];
      if (a) { a.classList.add('on'); a.setAttribute('aria-current', 'location'); a.scrollIntoView({ block: 'nearest', inline: 'nearest' }); }
    });
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
    if (err) err.hidden = !bad;
    return !bad;
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
    el.addEventListener('input', function () { if (el.getAttribute('aria-invalid') === 'true') validate(); });
  });

  function showThanks() {
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
