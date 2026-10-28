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
