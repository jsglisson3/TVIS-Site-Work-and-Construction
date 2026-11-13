/*!
 * site-notes.js  ·  Stray Wolf Technology  ·  v2
 *
 * Lets a client mark up their own site for Stray Wolf: tap "Add a note", tap the
 * part of the page they mean, say what they want, add photos, send.
 * Normal visitors never see any of it. The site itself never changes.
 *
 * On every page of the client's site:
 *   <script src="/js/site-notes.js" data-site="cedar-street"
 *           data-api="https://YOUR-SERVICE.workers.dev" defer></script>
 *
 * On the client's own page (/portal/index.html: login + their boxes + the
 * Edit mode button) the same tag plus:
 *           data-hub
 * That page is the only way in. Its Edit mode button (any element with
 * data-edit-mode="/") opens the live site with Edit mode on. "Exit edit mode"
 * brings them back to their page.
 *
 * Options:
 *   data-site       the client's short name (must match the admin page)
 *   data-api        the service address, or "demo" to try it with no service
 *                   (demo password: wolf)
 *   data-to         who the notes go to (default: Stray Wolf)
 *   data-hub        this page is the client's own page (and the password page)
 *   data-login-url  where that page lives (default: /portal/)
 *   data-door       the hidden way in (default: the "Powered by Stray Wolf" badge).
 *                   Press and hold it for 2 seconds: a soft moonlight grows from it
 *                   (the wolf's eyes glow), washes over the screen, and the client's
 *                   page comes up out of it. A normal tap works as usual. Any CSS
 *                   selector works, several too (".swt-badge, .moon-door"); inside
 *                   it, an element marked data-door-center is where the light starts.
 *                   data-door="none" turns it off.
 *   data-name       the business name ("Welcome, TVIS Construction")
 *   data-logo       their logo picture, shown big on the login box
 *   data-caption-example  a photo caption that fits this client ("the new shed pad"), shown as
 *                   the example under the first photo of a note. Empty = no example.
 * On the client's page:
 *   data-edit-mode="/"      on a button or card: opens the site in Edit mode
 *   data-edit-mode="soon"   the mockup isn't ready yet (says so when tapped)
 *   data-note-box           a box that opens a note with one tap
 *     data-area / data-note-ask / data-note-hint   its name, question, example
 *     data-note-fields="Facebook|Instagram"         one line to fill in for each
 *     data-note-now="Phone=423-555-0100|Email=..."  what's on the site now: those lines show the
 *                   current value with a Change button, so they only type what's new
 * "Show me on the site": a page opened with #sw-find={...} (the admin builds it from a note's
 *   sel/path/fx/fy/snip) scrolls to that spot and rings it. Each note sends url, sel, path,
 *   fx, fy, py (how far down the page, 0 to 1), snip (its words) and vw (screen width), plus
 *   shot: a small picture of the spot (uploaded like a photo; needs html2canvas.min.js next
 *   to this file, or data-shot-lib="its address"; data-shot-lib="none" = no pictures).
 *   data-booking-url  on the Let's talk box: a booking page (like a Google Calendar
 *                   appointment schedule). Set = tapping it opens that page; empty = a note.
 *   data-alert-key  optional Web3Forms key: emails a heads-up when notes arrive
 * The Photos page (their own page only): a box with data-photos-page opens a full page instead of
 *   a small note (also at <portal>#photos). Adding photos (drag and drop, a few words each), then
 *   "Photos you sent", each marked "On your site" or "Not on your site yet" (Stray Wolf ticks
 *   "On the site" in the admin; POST /api/my-photos and /api/my-photo {key}), then
 *   "On your site now" from <template data-site-photos> on their page:
 *     <img src="small.jpg" data-big="big.jpg" alt="what it shows" data-on="Homepage|About page">
 *   data-more="Your project pages have more photos." data-more-url="/projects" on the template adds a link.
 */
(function () {
  "use strict";
  var S = document.currentScript; if (!S) return;
  var SITE = (S.getAttribute("data-site") || "site").toLowerCase();
  var API = (S.getAttribute("data-api") || "demo").replace(/\/+$/, "");
  var DEMO = API === "demo";
  var TO = S.getAttribute("data-to") || "Stray Wolf";
  var IS_HUB = S.hasAttribute("data-hub") || S.hasAttribute("data-login");
  var MODE = IS_HUB ? "hub" : "edit";   // hub = their own page; edit = Edit mode on the site
  var LOGIN_URL = S.getAttribute("data-login-url") || "/portal/";
  var DOOR = S.getAttribute("data-door") || ".swt-badge";   // the hidden way in: hold this for 2 seconds
  var NAME = S.getAttribute("data-name") || "";   // the business name, for "Welcome, ..." on the login box
  var LOGO = S.getAttribute("data-logo") || "";   // their logo, shown on the login box
  var CAPTION_EXAMPLE = S.getAttribute("data-caption-example") || "";   // "the new shed pad": the example caption under a note's first photo
  var ALERT_KEY = S.getAttribute("data-alert-key") || "";
  // html2canvas, for a small picture of the spot each note is about. Lives next to this file;
  // data-shot-lib="none" turns the pictures off.
  var SHOT_LIB = S.getAttribute("data-shot-lib") || (S.src || "").replace(/[^\/?#]*([?#].*)?$/, "html2canvas.min.js");
  var K = "swn:" + SITE + ":";
  var MAX_PICS = 20, MAX_SIDE = 2000;

  /* =========================================================== storage */

  function lsGet(k) { try { return localStorage.getItem(K + k); } catch (e) { return null; } }
  function lsSet(k, v) { try { v == null ? localStorage.removeItem(K + k) : localStorage.setItem(K + k, v); } catch (e) {} }

  /* =========================================================== session */
  // The login is kept as {t: token, at: when they logged in, seen: last time they did something}.
  // It ends after IDLE_MS with nothing done, or MAX_MS after logging in, whichever comes first,
  // and the service enforces the same limits on its side. A bare token saved by an older version
  // has no times on it, so it counts as ended and they log in once more.
  var IDLE_MS = 2 * 36e5, MAX_MS = 24 * 36e5;
  function sessRead() {
    var raw = lsGet("token"), s = null;
    try { s = JSON.parse(raw || "null"); } catch (e) {}
    return s && typeof s.t === "string" && s.at > 0 && s.seen > 0 ? s : null;
  }
  function sessLive(s, now) { now = now || Date.now(); return !!s && now - s.seen < IDLE_MS && now - s.at < MAX_MS && s.at <= now + 6e4; }
  function getToken() {
    var s = sessRead();
    if (!sessLive(s)) { if (lsGet("token") != null) lsSet("token", null); return null; }
    return s.t;
  }
  function setToken(t) { var now = Date.now(); lsSet("token", t ? JSON.stringify({ t: t, at: now, seen: now }) : null); }
  var lastTouch = 0;
  function touch() {   // something was done: push the idle limit back (at most once every 30 s)
    var now = Date.now(); if (now - lastTouch < 3e4) return; lastTouch = now;
    var s = sessRead(); if (!sessLive(s, now)) return;
    s.seen = now; lsSet("token", JSON.stringify(s));
  }
  // Log out: the service forgets the login too, then this browser does.
  function endSession() {
    var t = getToken() || (sessRead() || {}).t;
    if (t && !DEMO) { try { fetch(API + "/api/logout", { method: "POST", headers: { authorization: "Bearer " + t }, body: "{}", keepalive: true }).catch(function () {}); } catch (e) {} }
    setToken(null); lsSet("on", null);
  }

  var st = { notes: [], sent: false, intro: false, sentNotes: 0, sentPics: 0 };
  try { var saved = JSON.parse(lsGet("state") || "null"); if (saved && Array.isArray(saved.notes)) { for (var key in saved) st[key] = saved[key]; } } catch (e) {}
  function save() { lsSet("state", JSON.stringify(st)); }

  // Photos wait in the browser's own database until they're sent.
  var mem = {}, dbp = null, urls = {};
  function db() {
    if (!dbp) dbp = new Promise(function (res) {
      try {
        var r = indexedDB.open("swn-" + SITE, 1);
        r.onupgradeneeded = function () { r.result.createObjectStore("pics"); };
        r.onsuccess = function () { res(r.result); };
        r.onerror = r.onblocked = function () { res(null); };
      } catch (e) { res(null); }
    });
    return dbp;
  }
  function picOp(mode, fn) {
    return db().then(function (d) {
      if (!d) return null;
      return new Promise(function (res) {
        try { var tx = d.transaction("pics", mode), rq = fn(tx.objectStore("pics")); tx.oncomplete = function () { res(rq && rq.result); }; tx.onerror = tx.onabort = function () { res(null); }; }
        catch (e) { res(null); }
      });
    });
  }
  function picPut(id, rec) { mem[id] = rec; return picOp("readwrite", function (s) { return s.put(rec, id); }); }
  function picGet(id) { return mem[id] ? Promise.resolve(mem[id]) : picOp("readonly", function (s) { return s.get(id); }).then(function (r) { if (r) mem[id] = r; return r || null; }); }
  function picDel(id) { delete mem[id]; if (urls[id]) { URL.revokeObjectURL(urls[id]); delete urls[id]; } return picOp("readwrite", function (s) { return s.delete(id); }); }
  function picUrl(id) { return picGet(id).then(function (r) { if (!r) return ""; if (!urls[id]) urls[id] = URL.createObjectURL(r.blob); return urls[id]; }); }

  /* =========================================================== helpers */

  function h(tag, props, kids) {
    var e = document.createElement(tag), k;
    for (k in props || {}) {
      if (k === "class") e.className = props[k];
      else if (k === "text") e.textContent = props[k];
      else if (k === "style") e.style.cssText = props[k];            // via the style object, so strict security rules (CSP) allow it
      else if (k.slice(0, 2) === "on") e.addEventListener(k.slice(2), props[k]);
      else if (props[k] !== false && props[k] != null) e.setAttribute(k, props[k] === true ? "" : props[k]);
    }
    (kids || []).forEach(function (c) { if (c != null) e.appendChild(typeof c === "string" ? document.createTextNode(c) : c); });
    return e;
  }
  var ICONS = {
    note: ["M21 11.5a8.4 8.4 0 0 1-9 8.4 8.6 8.6 0 0 1-3.8-.9L3 21l1.9-5.2A8.4 8.4 0 0 1 12 3a8.4 8.4 0 0 1 9 8.5z", "M12 8.5v6", "M9 11.5h6"],
    photo: ["M4 5h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z", "M3 16l5-5 4 4 3-3 6 6", "M15.5 9.5h.01"],
    send: ["M22 2L11 13", "M22 2l-7 20-4-9-9-4z"],
    help: ["M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z", "M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3", "M12 17h.01"],
    x: ["M18 6L6 18", "M6 6l12 12"],
    trash: ["M3 6h18", "M8 6V4h8v2", "M19 6l-1 14H6L5 6", "M10 11v6", "M14 11v6"],
    pencil: ["M17 3a2.8 2.8 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5z"],
    check: ["M20 6L9 17l-5-5"],
    lock: ["M6 11h12a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-8a1 1 0 0 1 1-1z", "M8 11V7a4 4 0 0 1 8 0v4"],
    eye: ["M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z", "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"],
    tap: ["M9 11V5.5a1.5 1.5 0 0 1 3 0V11", "M12 10.5V9a1.5 1.5 0 0 1 3 0v2", "M15 10.5a1.5 1.5 0 0 1 3 0V15a6 6 0 0 1-6 6h-1a6 6 0 0 1-5-2.7L3.6 15a1.5 1.5 0 0 1 2.5-1.7L9 16"],
    power: ["M12 2v10", "M18.4 6.6a9 9 0 1 1-12.8 0"],
    arrow: ["M5 12h14", "M13 6l6 6-6 6"],
    plus: ["M12 5v14", "M5 12h14"]
  };
  // Social sites the portal knows by name: their own colors, logo and an example of the address to paste.
  var BRANDS = {
    facebook: { bg: "#1877F2", ph: "facebook.com/yourpage",
      svg: '<path fill="#fff" d="M13.6 21v-7.4h2.5l.4-2.9h-2.9V8.9c0-.8.2-1.4 1.4-1.4h1.6V4.9c-.3 0-1.2-.1-2.3-.1-2.3 0-3.8 1.4-3.8 3.9v2.1H8v2.9h2.5V21z"/>' },
    instagram: { bg: "radial-gradient(circle at 30% 107%,#fdf497 0%,#fdf497 5%,#fd5949 45%,#d6249f 60%,#285AEB 90%)", ph: "instagram.com/yourname",
      svg: '<g fill="none" stroke="#fff" stroke-width="2"><rect x="4" y="4" width="16" height="16" rx="4.5"/><circle cx="12" cy="12" r="3.8"/></g><circle cx="16.8" cy="7.2" r="1.2" fill="#fff"/>' },
    linkedin: { bg: "#0A66C2", ph: "linkedin.com/company/yourname",
      svg: '<g fill="#fff"><circle cx="7" cy="6.8" r="1.8"/><rect x="5.5" y="9.6" width="3" height="9.4" rx=".4"/><path d="M10.8 9.6h2.9v1.3c.5-.9 1.6-1.6 3.1-1.6 2.5 0 3.4 1.6 3.4 4.2V19h-3v-4.9c0-1.3-.3-2.2-1.6-2.2s-1.8.9-1.8 2.2V19h-3z"/></g>' },
    google: { bg: "#fff", ph: "Your Google Maps or business link",
      svg: '<g fill="none" stroke-width="3.2"><path stroke="#EA4335" d="M16.95 7.05A7 7 0 0 0 5.94 8.5"/><path stroke="#FBBC05" d="M5.94 8.5A7 7 0 0 0 5.94 15.5"/><path stroke="#34A853" d="M5.94 15.5A7 7 0 0 0 16.95 16.95"/><path stroke="#4285F4" d="M16.95 16.95A7 7 0 0 0 19 12H12"/></g>' }
  };
  function brandLogo(b) {
    var t = document.createElement("span"); t.className = "logo"; t.style.background = b.bg;
    if (b.bg === "#fff") t.style.boxShadow = "inset 0 0 0 1px #e2dcd2";
    t.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true">' + b.svg + "</svg>";
    return t;
  }
  function icon(name, size) {
    var ns = "http://www.w3.org/2000/svg", s = document.createElementNS(ns, "svg");
    s.setAttribute("viewBox", "0 0 24 24"); s.setAttribute("aria-hidden", "true"); s.setAttribute("class", "ic");
    if (size) { s.setAttribute("width", size); s.setAttribute("height", size); }
    (ICONS[name] || []).forEach(function (d) { var p = document.createElementNS(ns, "path"); p.setAttribute("d", d); s.appendChild(p); });
    return s;
  }
  function short(s, n) { s = String(s || "").replace(/\s+/g, " ").trim(); return s.length > n ? s.slice(0, n - 1) + "…" : s; }
  function plural(n, w) { return n + " " + w + (n === 1 ? "" : "s"); }
  function isPhone() { return window.innerWidth < 720; }
  var reduceMotion = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var canHover = window.matchMedia && matchMedia("(hover: hover) and (pointer: fine)").matches;

  /* =========================================================== look */

  var CSS = [
    ":host{all:initial;position:absolute;top:0;left:0;width:0;height:0;z-index:2147483000}",
    "*{box-sizing:border-box}",
    "[hidden]{display:none!important}",
    ".r{--ink:#1f1d1b;--muted:#5f5a53;--line:#e4dfd7;--soft:#f7f4ef;--paper:#fff;--accent:#c2541b;--accent-dk:#a3441a;--accent-soft:#fbeee6;--go:#2f7a4b;--go-dk:#26633d;--bad:#b3261e;",
    "  font:17px/1.5 system-ui,-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:var(--ink);-webkit-text-size-adjust:100%;letter-spacing:0}",
    "button{font:inherit;color:inherit;cursor:pointer;-webkit-tap-highlight-color:transparent}",
    "button:focus-visible,textarea:focus-visible,input:focus-visible,a:focus-visible{outline:3px solid #2563c9;outline-offset:2px}",
    ".ic{width:24px;height:24px;flex:none;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}",

    /* the frame and the strip on top of the dock: always say 'notes are on' */
    ".frame{position:fixed;inset:0;pointer-events:none;box-shadow:inset 0 0 0 4px var(--accent);transition:box-shadow .2s}",
    ".frame.picking{box-shadow:inset 0 0 0 6px var(--accent),inset 0 0 0 9999px rgba(194,84,27,.05)}",
    ".strip{background:var(--accent);color:#fff;padding:6px max(12px,env(safe-area-inset-right,0px)) 6px max(16px,env(safe-area-inset-left,0px))}",
    ".strip-in{max-width:1100px;margin:0 auto;display:flex;align-items:center;gap:8px;font-size:15px;line-height:1.2}",
    ".strip .lbl{display:flex;align-items:center;gap:8px;transform-origin:left center;font-weight:700;letter-spacing:.01em;min-width:0;white-space:nowrap}",
    ".strip .lbl .ic{width:20px;height:20px}",
    ".strip .dot{width:9px;height:9px;border-radius:50%;background:#fff;flex:none;box-shadow:0 0 0 0 rgba(255,255,255,.7);animation:beat 2s infinite}",
    "@keyframes beat{70%{box-shadow:0 0 0 7px rgba(255,255,255,0)}100%{box-shadow:0 0 0 0 rgba(255,255,255,0)}}",
    ".strip .sub{opacity:.95;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;min-width:0}",
    ".strip .gap{flex:1}",
    ".strip button{display:flex;align-items:center;gap:6px;background:rgba(255,255,255,.18);border:0;color:#fff;border-radius:999px;padding:6px 13px;font-size:15px;font-weight:600;min-height:38px;white-space:nowrap}",
    ".strip button:hover{background:rgba(255,255,255,.3)}",
    ".strip.hub{background:#3a3631}",
    ".strip button .ic{width:19px;height:19px}",
    ".strip .sm{display:none}",
    "@media (max-width:719px){.strip .lg{display:none}.strip .sm{display:inline}.strip .sub{display:none}.strip{padding-top:4px;padding-bottom:4px}.strip button{padding:5px 11px;font-size:14px;min-height:36px}}",

    /* the dock at the bottom */
    ".dock{position:fixed;left:0;right:0;bottom:0;background:var(--ink);color:#fff;box-shadow:0 -6px 24px rgba(0,0,0,.22)}",
    ".dock.quiet .dock-main{display:none}",
    ".dock.bare .strip{display:none}.dock.bare.quiet{display:none}",
    ".dock-main{padding:12px max(16px,env(safe-area-inset-right,0px)) calc(12px + env(safe-area-inset-bottom,0px)) max(16px,env(safe-area-inset-left,0px))}",
    ".dock-in{max-width:1100px;margin:0 auto;display:flex;align-items:center;gap:12px 16px}",
    ".dock .say{flex:1 1 auto;min-width:0;font-size:17px;line-height:1.35}",
    ".dock .say b{display:block;font-size:18px}",
    ".dock .say span{opacity:.82;font-size:15px}",
    ".dock .btns{display:flex;gap:10px;flex:none}",
    ".db{display:flex;align-items:center;justify-content:center;gap:9px;min-height:54px;padding:0 20px;border-radius:12px;border:2px solid transparent;font-size:18px;font-weight:600;white-space:nowrap;transition:background .15s,transform .1s}",
    ".db:active{transform:scale(.97)}",
    ".db.main{background:var(--accent);color:#fff}.db.main:hover{background:var(--accent-dk)}",
    ".db.second{background:transparent;color:#fff;border-color:rgba(255,255,255,.45)}.db.second:hover{background:rgba(255,255,255,.1)}",
    ".db.go{background:var(--go);color:#fff}.db.go:hover{background:var(--go-dk)}",
    ".db.go[disabled],.db.off{background:rgba(255,255,255,.12);color:rgba(255,255,255,.6);cursor:default}",
    ".badge{display:inline-grid;place-items:center;min-width:26px;height:26px;border-radius:999px;background:#fff;color:var(--go-dk);font-size:15px;font-weight:700;padding:0 7px}",
    "@media (max-width:719px){",
    "  .dock-main{padding-top:10px}.dock-in{flex-direction:column;align-items:stretch;gap:8px}",
    "  .dock .say{text-align:center;font-size:15px}.dock .say b{font-size:17px}.dock .say span{display:none}",
    "  .dock .btns{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}",
    "  .db{flex-direction:column;gap:4px;min-height:64px;padding:6px 4px;font-size:15px;border-radius:12px;white-space:normal;text-align:center;line-height:1.15}",
    "  .db .badge{position:absolute;margin:-30px 0 0 34px;min-width:22px;height:22px;font-size:13px}",
    "  .db{position:relative}",
    "  .dock .btns.n2{grid-template-columns:repeat(2,minmax(0,1fr))}",
    "  .dock .btns.n1{grid-template-columns:1fr}.dock .btns.n1 .db{flex-direction:row;gap:10px;min-height:58px;font-size:17px}",
    "  .dock .btns.n1 .db .badge{position:static;margin:0}",
    "}",

    /* pins on the page */
    ".pin{position:absolute;width:36px;height:36px;margin:-38px 0 0 -6px;border-radius:50% 50% 50% 6px;border:3px solid #fff;background:var(--accent);color:#fff;font-weight:700;font-size:16px;",
    "  display:grid;place-items:center;padding:0;box-shadow:0 3px 10px rgba(0,0,0,.35);font-variant-numeric:tabular-nums;transform-origin:6px 36px}",
    ".pin.on{transform:scale(1.15);box-shadow:0 0 0 5px rgba(194,84,27,.35),0 3px 10px rgba(0,0,0,.35)}",
    ".pin.drop{animation:drop .35s cubic-bezier(.2,1.4,.4,1)}",
    "@keyframes drop{from{transform:translateY(-16px) scale(.6);opacity:0}}",
    ".hl{position:absolute;pointer-events:none;border:3px solid var(--accent);background:rgba(194,84,27,.08);border-radius:6px;transition:all .08s}",
    ".hl span{position:absolute;left:-3px;top:-34px;background:var(--accent);color:#fff;font-size:15px;font-weight:600;padding:5px 10px;border-radius:8px 8px 8px 0;white-space:nowrap}",
    ".hl.below span{top:auto;bottom:-34px;border-radius:0 8px 8px 8px}",

    /* cards: the note box, the review list, help, login */
    ".card{position:fixed;background:var(--paper);border-radius:18px;box-shadow:0 18px 48px rgba(0,0,0,.3),0 0 0 1px rgba(0,0,0,.05);display:flex;flex-direction:column;overflow:hidden}",
    ".card .hd{display:flex;align-items:flex-start;gap:12px;padding:18px 20px 10px}",
    ".card .hd h2{margin:0;font-size:21px;line-height:1.25;font-weight:700}",
    ".card .hd p{margin:3px 0 0;color:var(--muted);font-size:15px;overflow-wrap:anywhere}",
    ".card .hd .grow{flex:1;min-width:0}",
    ".xbtn{flex:none;display:grid;place-items:center;width:44px;height:44px;margin:-6px -8px 0 0;border:0;background:none;border-radius:999px;color:var(--muted)}",
    ".xbtn:hover{background:var(--soft)}",
    ".card .bd{padding:6px 20px 16px;overflow:auto;display:grid;gap:14px;align-content:start}",
    ".card .ft{padding:14px 20px calc(16px + env(safe-area-inset-bottom,0px));border-top:1px solid var(--line);display:flex;gap:10px;align-items:center;background:var(--paper)}",
    ".num{display:inline-grid;place-items:center;flex:none;width:34px;height:34px;border-radius:50% 50% 50% 6px;background:var(--accent);color:#fff;font-weight:700;font-size:16px;font-variant-numeric:tabular-nums}",
    "label.q{font-weight:600;font-size:17px}",
    ".fields{display:grid;gap:10px}.field{display:grid;grid-template-columns:96px 1fr;align-items:center;gap:10px}.field label{font-weight:600;font-size:16px}",
    ".field input{font:inherit;font-size:17px;color:var(--ink);width:100%;min-width:0;min-height:50px;border:2px solid var(--line);border-radius:12px;padding:8px 12px;background:var(--soft)}",
    ".field input:focus{outline:none;border-color:var(--accent);background:#fff}",
    "@media (max-width:420px){.field{grid-template-columns:1fr;gap:4px}}.fields.stack .field{grid-template-columns:1fr;gap:4px}",
    /* social pages: one roomy row per site, with that site's own logo and an example address */
    ".fields.brands{gap:12px}",
    ".field .lb{font-weight:600;font-size:16px}.field.brand .lb{font-size:17px;line-height:1.2}",
    ".fv{min-width:0}.fv [hidden]{display:none!important}",
    ".cur{display:flex;align-items:center;gap:10px;min-height:50px;padding:5px 5px 5px 12px;border:1px solid var(--line);border-radius:12px;background:#fff}",
    ".cur svg{flex:none;width:18px;height:18px;color:var(--go)}",
    ".cur .val{flex:1;min-width:0;font-size:16.5px;line-height:1.3;overflow-wrap:break-word}",
    ".cur .chg,.ed .undo{flex:none;border:0;min-height:40px;padding:0 14px;border-radius:10px;font-size:15px;font-weight:600}",
    ".cur .chg{background:var(--accent-soft);color:var(--accent)}.cur .chg:hover{background:#f6dccd}",
    ".ed{display:flex;align-items:center;gap:8px}.ed input{flex:1}",
    ".ed .undo{background:transparent;color:var(--muted);text-decoration:underline;text-underline-offset:3px;padding:0 8px}",
    ".field.brand .cur{min-height:48px}",
    ".field.brand{grid-template-columns:48px minmax(0,1fr);gap:6px 14px;align-items:center;background:#fff;border:1px solid var(--line);border-radius:14px;padding:12px 14px}",
    ".field.brand .logo{grid-row:span 2;width:48px;height:48px;border-radius:12px;display:grid;place-items:center;color:#fff}",
    ".field.brand .logo svg{width:28px;height:28px}",
    ".field.brand label{font-size:17px;line-height:1.2}",
    ".field.brand input{min-height:48px;font-size:16.5px;background:var(--soft)}",
    ".field.brand:focus-within{border-color:var(--accent);box-shadow:0 0 0 3px rgba(194,84,27,.12)}",
    ".tip{display:flex;gap:10px;align-items:flex-start;margin:-4px 0 0;color:var(--muted);font-size:15px;line-height:1.45}.tip .ic{flex:none;width:20px;height:20px;margin-top:1px;color:var(--accent)}",
    ".note.wide{width:480px}",
    /* photos: a big tap/drop area, big pictures with their words under them, idea chips */
    ".note.photos{width:600px}",
    ".note.sheet.wide,.note.sheet.photos{width:auto}",
    ".add-ph.big{flex-direction:column;justify-content:center;text-align:center;gap:8px;min-height:150px;padding:22px 18px;border-width:2.5px;border-radius:16px;background:#fff}",
    ".add-ph.big .ic{width:44px;height:44px;stroke-width:1.6}.add-ph.big b{font-size:19px}.add-ph.big span{font-size:15px}",
    ".add-ph.busy{border-style:solid;border-color:var(--accent);background:var(--accent-soft)}.add-ph.busy .ic{animation:swn-pulse 1s ease-in-out infinite}",
    "@keyframes swn-pulse{50%{transform:scale(.85);opacity:.6}}",
    ".note.photos .add-ph.big:has(~ .thumbs:not([hidden])){min-height:88px;flex-direction:row;text-align:left;padding:14px 18px}",
    ".note.photos .add-ph.big:has(~ .thumbs:not([hidden])) .ic{width:32px;height:32px}",
    ".note.photos .thumbs.capt{grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}",
    ".note.photos .thumbs .cap{min-height:0;height:auto;field-sizing:content;font-size:14.5px;line-height:1.35;padding:7px 9px;resize:none;border-radius:9px}",
    ".note.photos .thumbs.capt .t{grid-template-columns:1fr;gap:8px;background:#fff;border:1px solid var(--line);border-radius:14px;padding:8px}",
    ".note.photos .thumbs.capt .ph{width:100%;height:auto;aspect-ratio:4/3}.note.photos .thumbs.capt img{width:100%;height:100%;border-radius:9px}",
    ".note.photos .thumbs.capt .rm{width:32px;height:32px;top:6px;right:6px}",
    ".note.photos .thumbs:not(.capt){display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px}",
    ".note.photos .thumbs:not(.capt) .t,.note.photos .thumbs:not(.capt) .ph{width:100%;height:auto;aspect-ratio:1}.note.photos .thumbs:not(.capt) img{width:100%;height:100%}",
    ".note.photos .thumbs .capts{grid-column:1/-1}",
    ".thumbs .cap.flash{border-color:var(--accent);background:#fff;box-shadow:0 0 0 4px rgba(194,84,27,.15)}",
    ".ideas p{margin:0 0 8px;font-size:15px;color:var(--muted)}.ideas p b{color:var(--ink)}",
    ".ideas .chips{display:flex;flex-wrap:wrap;gap:8px}",
    ".chip{border:1px solid #f0d3c2;background:var(--accent-soft);color:#8a3a12;border-radius:999px;padding:9px 14px;font-size:15px;font-weight:600;min-height:42px;text-align:left}",
    ".chip:hover{border-color:var(--accent);background:#fff}",
    "@media (max-width:719px){.note.photos .thumbs.capt{grid-template-columns:1fr 1fr;gap:10px}.note.photos .thumbs:not(.capt){grid-template-columns:repeat(3,minmax(0,1fr))}.add-ph.big{min-height:130px}}",
    /* files dragged over any note: the whole card says "Drop your photos here" */
    ".note .dropcover{display:none}",
    ".note.dropping .dropcover{position:absolute;inset:8px;z-index:3;display:grid;place-content:center;justify-items:center;gap:10px;border:3px dashed var(--accent);border-radius:16px;background:rgba(251,238,230,.94);color:var(--accent);pointer-events:none}",
    ".note .dropcover .ic{width:54px;height:54px}.note .dropcover b{font-size:21px}",
    "textarea{font:inherit;font-size:18px;color:var(--ink);width:100%;min-height:120px;border:2px solid var(--line);border-radius:12px;padding:12px 14px;background:var(--soft);resize:vertical}",
    "textarea:focus{border-color:var(--accent);background:#fff;outline:none}",
    "textarea::placeholder{color:#8d877e}",
    ".add-ph{display:flex;align-items:center;gap:14px;width:100%;text-align:left;border:2px dashed #cfc7bb;background:var(--soft);border-radius:12px;padding:14px 16px;min-height:64px}",
    ".add-ph:hover,.add-ph.over{border-color:var(--accent);background:var(--accent-soft)}",
    ".add-ph .ic{width:30px;height:30px;color:var(--accent)}",
    ".add-ph b{display:block;font-size:17px}",
    ".add-ph span{color:var(--muted);font-size:14px}",
    ".thumbs{display:flex;flex-wrap:wrap;gap:10px}",
    ".thumbs .t{position:relative;width:76px;height:76px}.thumbs .ph{position:relative;display:block}",
    ".thumbs img{width:76px;height:76px;object-fit:cover;border-radius:10px;display:block;background:var(--soft);border:1px solid var(--line)}",
    ".thumbs .rm{position:absolute;top:-8px;right:-8px;width:30px;height:30px;border-radius:50%;border:2px solid #fff;background:var(--ink);color:#fff;display:grid;place-items:center;padding:0;box-shadow:0 2px 6px rgba(0,0,0,.25)}",
    ".thumbs .rm .ic{width:16px;height:16px;stroke-width:3}",
    ".thumbs.small .t,.thumbs.small img{width:56px;height:56px}",
    /* a few photos: a short "What is this?" line beside each one (optional) */
    ".thumbs.capt{display:grid;gap:10px}",
    ".thumbs.capt .t{display:grid;grid-template-columns:64px minmax(0,1fr);gap:12px;align-items:center;width:auto;height:auto}",
    ".thumbs.capt .ph{position:relative;width:64px;height:64px}.thumbs.capt img{width:64px;height:64px}",
    ".thumbs.capt .rm{width:26px;height:26px;top:-7px;right:-7px}",
    ".thumbs .cap{font:inherit;font-size:16px;color:var(--ink);width:100%;min-width:0;min-height:46px;border:2px solid var(--line);border-radius:10px;padding:8px 11px;background:var(--soft)}",
    ".thumbs .cap:focus{outline:none;border-color:var(--accent);background:#fff}.thumbs .cap::placeholder{color:#8d877e}",
    ".capts{justify-self:start;border:0;background:none;padding:6px 0;color:var(--accent);font-weight:600;font-size:15px;text-decoration:underline;text-underline-offset:3px}",
    ".b{display:inline-flex;align-items:center;justify-content:center;gap:8px;min-height:52px;padding:0 20px;border-radius:12px;border:2px solid transparent;font-size:17px;font-weight:600;white-space:nowrap}",
    ".b.main{background:var(--accent);color:#fff}.b.main:hover{background:var(--accent-dk)}",
    ".b.go{background:var(--go);color:#fff}.b.go:hover{background:var(--go-dk)}",
    ".b.plain{background:#fff;border-color:var(--line);color:var(--ink)}.b.plain:hover{border-color:#bdb5a9}",
    ".b.quiet{background:none;color:var(--muted);padding:0 10px;font-weight:600}.b.quiet:hover{color:var(--ink)}",
    ".b.danger{background:none;color:var(--bad);padding:0 10px;font-weight:600}",
    ".b[disabled]{opacity:.55;cursor:default}",
    ".b.wide{width:100%}",
    ".push{margin-left:auto}",
    "@media (max-width:719px){.card .ft{flex-wrap:wrap}.card .ft .b.main,.card .ft .b.go{flex:1 1 100%;order:-1}.card .ft .b.plain{flex:1 1 100%}}",

    /* note box: popover on big screens, sheet on phones */
    ".note{width:400px;max-width:calc(100vw - 24px)}",
    ".note .where{display:flex;gap:8px;align-items:baseline;background:var(--soft);border-radius:10px;padding:9px 12px;font-size:15px;color:var(--muted)}",
    ".note .where b{color:var(--ink);font-weight:600;overflow-wrap:anywhere}",
    ".sheet{left:0;right:0;bottom:0;width:auto;max-width:none;max-height:88vh;border-radius:20px 20px 0 0}",
    ".sheet::before{content:'';display:block;width:44px;height:5px;border-radius:9px;background:#d6cfc4;margin:10px auto 0}",

    /* centered panels */
    ".veil{position:fixed;inset:0;background:rgba(24,22,20,.55);display:grid;place-items:center;padding:16px}",
    ".veil > .card{position:relative;width:min(560px,100%);max-height:calc(100vh - 32px)}",
    "@media (max-width:719px){.veil{place-items:end stretch;padding:0}.veil > .card{width:100%;max-height:92vh;border-radius:20px 20px 0 0}}",
    ".steps{list-style:none;margin:0;padding:0;display:grid;gap:10px}",
    ".steps li{display:grid;grid-template-columns:52px minmax(0,1fr);gap:16px;align-items:center;background:#fff;border:1px solid var(--line);border-radius:16px;padding:14px 18px 14px 14px}",
    ".steps .circ{width:52px;height:52px;border-radius:15px;background:var(--accent-soft);color:var(--accent);display:grid;place-items:center;position:relative}",
    ".steps .circ .ic{width:26px;height:26px}",
    ".steps .circ i{position:absolute;right:-7px;bottom:-7px;width:24px;height:24px;border-radius:50%;border:2px solid #fff;box-sizing:content-box;background:var(--accent);color:#fff;font:700 12.5px/24px system-ui,sans-serif;text-align:center;font-style:normal}",
    ".steps b{display:block;font-size:17.5px;line-height:1.3}",
    ".steps span{display:block;color:var(--muted);font-size:15px;line-height:1.45;margin-top:2px}",
    ".calm{display:flex;gap:12px;align-items:flex-start;background:#eef6f0;border:1px solid #d5e8db;color:#24563a;border-radius:14px;padding:14px 16px;font-size:15px;line-height:1.45;font-weight:500;margin-top:4px}",
    ".calm .ic{flex:none;width:20px;height:20px;margin-top:1px;color:var(--go)}",
    ".card.photo{width:min(960px,100%)}.card.photo .bd{padding:0 18px 4px;gap:10px}",
    ".card.photo .shot{position:relative;display:grid;place-items:center;background:#1e1c19;border-radius:12px;overflow:hidden}",
    ".card.photo .shot img{display:block;max-width:100%;max-height:calc(100vh - 230px);width:auto;height:auto}",
    ".card.photo .nav{position:absolute;top:50%;transform:translateY(-50%);width:48px;height:48px;border-radius:50%;border:0;background:rgba(255,255,255,.92);color:var(--ink);display:grid;place-items:center;box-shadow:0 4px 14px rgba(0,0,0,.3)}",
    ".card.photo .nav.l{left:10px}.card.photo .nav.r{right:10px}.card.photo .nav.l .ic{transform:scaleX(-1)}",
    ".card.photo .cap{margin:0;color:var(--muted);font-size:15px}",
    /* the Photos page: a whole page over their portal, with a Back button */
    ".pg{position:fixed;inset:0;overflow:auto;-webkit-overflow-scrolling:touch;overscroll-behavior:contain;background:#f4f2ee}",
    ".pg.note.photos{width:auto;max-width:none}",
    ".pg .dropcover{position:fixed!important;inset:10px!important}",
    ".pg-top{position:sticky;top:0;z-index:2;background:rgba(244,242,238,.95);-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);border-bottom:1px solid var(--line)}",
    ".pg-top-in{max-width:1040px;margin:0 auto;display:flex;align-items:center;gap:14px;padding:10px max(16px,env(safe-area-inset-right,0px)) 10px max(16px,env(safe-area-inset-left,0px))}",
    ".pg-back{display:inline-flex;align-items:center;gap:8px;min-height:48px;padding:0 18px 0 12px;border-radius:12px;border:2px solid var(--line);background:#fff;font-weight:600;font-size:16px;white-space:nowrap}",
    ".pg-back:hover{border-color:#bdb5a9}.pg-back .ic{transform:scaleX(-1)}",
    ".pg-top h1{margin:0;font:700 25px/1.15 'SW Zilla','Zilla Slab',Georgia,serif;letter-spacing:-.005em}",
    ".pg-in{max-width:1040px;margin:0 auto;padding:18px max(16px,env(safe-area-inset-right,0px)) 64px max(16px,env(safe-area-inset-left,0px));display:grid;gap:18px}",
    ".pg-sec{background:#fff;border:1px solid var(--line);border-radius:18px;padding:20px 22px 22px;display:grid;gap:14px;min-width:0}",
    ".pg-hd{display:flex;align-items:baseline;justify-content:space-between;gap:4px 14px;flex-wrap:wrap}",
    ".pg-sec h2{margin:0;font:700 22px/1.2 'SW Zilla','Zilla Slab',Georgia,serif}",
    ".pg-sub{margin:0;color:var(--muted);font-size:15px}",
    ".pg-act{display:flex;justify-content:flex-end}",
    ".pg-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:16px 12px}",
    ".pg-ph{display:grid;gap:6px;align-content:start;text-align:left;padding:0;border:0;background:none;min-width:0;color:inherit}",
    ".pg-ph .im{position:relative;display:block;aspect-ratio:4/3;border-radius:12px;overflow:hidden;background:var(--soft);border:1px solid var(--line)}",
    ".pg-ph img{display:block;width:100%;height:100%;object-fit:cover;transition:transform .2s}",
    ".pg-ph:hover img{transform:scale(1.04)}",
    ".pg-ph .im.gone::after{content:'Photo not found';position:absolute;inset:0;display:grid;place-items:center;color:var(--muted);font-size:13px}",
    ".pg-ph .cp{font-size:15px;line-height:1.3;font-weight:600;overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical}",
    ".pg-ph .dt{font-size:13.5px;color:var(--muted);line-height:1.3}",
    ".tag{white-space:nowrap;justify-self:start;display:inline-flex;align-items:center;gap:5px;font-size:13.5px;font-weight:600;line-height:1.1;padding:6px 10px 6px 9px;border-radius:999px}",
    ".tag .ic{width:15px;height:15px;stroke-width:3}",
    ".tag.on{background:#e3efe6;color:#22603a}.tag.off{background:#f0ebe4;color:#5f5a53;padding-left:10px}",
    ".pg-none{margin:0;padding:18px;border:2px dashed var(--line);border-radius:14px;color:var(--muted);text-align:center;font-size:15.5px}",
    ".pg-more{margin:0;font-size:15.5px;color:var(--muted)}.pg-more a{color:var(--accent);font-weight:600}",
    "@media (max-width:719px){.pg-grid{grid-template-columns:1fr 1fr;gap:14px 10px}.pg-sec{padding:16px;border-radius:16px}.pg-top h1{font-size:21px}.pg-back{min-height:44px;padding:0 14px 0 10px}.pg-in{padding-top:14px;gap:14px}.pg-act .b{width:100%}.tag{font-size:12.5px;padding:5px 8px}.tag.off{padding-left:8px}.card.photo .hd h2{font-size:17px}}",
    ".card.help .hd{padding:26px 26px 6px}.card.help .hd h2{font-size:23px}.card.help .hd p{font-size:16px;margin-top:5px}",
    ".card.help .bd{padding:14px 26px 22px;gap:12px}.card.help .ft{padding:16px 26px calc(20px + env(safe-area-inset-bottom,0px))}.card.help .ft .b{min-height:56px;font-size:18px}",
    "@media (max-width:719px){.card.help .hd{padding:22px 20px 4px}.card.help .bd{padding:12px 20px 18px}.card.help .ft{padding:14px 20px calc(16px + env(safe-area-inset-bottom,0px))}}",

    /* review list */
    ".list{list-style:none;margin:0;padding:0;display:grid;gap:12px}",
    ".item{display:grid;grid-template-columns:auto minmax(0,1fr);gap:6px 14px;border:1px solid var(--line);border-radius:14px;padding:14px}",
    ".item .w{font-size:14px;color:var(--muted);overflow-wrap:anywhere}",
    ".item .s{font-size:17px;overflow-wrap:anywhere;white-space:pre-line}",
    ".item .s.empty{color:var(--muted);font-style:italic}",
    ".item .acts{display:flex;flex-wrap:wrap;gap:4px 8px;margin:4px 0 0 -10px}",
    ".item .acts .b{min-height:44px;font-size:15px}",
    ".bar{height:10px;border-radius:9px;background:var(--soft);overflow:hidden}",
    ".bar i{display:block;height:100%;width:0;background:var(--go);transition:width .3s}",
    ".err{color:var(--bad);font-weight:600;font-size:15px;margin:0}",
    ".err a{color:inherit}",

    /* sent */
    ".done-ic{width:84px;height:84px;border-radius:50%;background:var(--go);color:#fff;display:grid;place-items:center;margin:10px auto 4px}",
    ".done-ic .ic{width:44px;height:44px;stroke-width:3}",
    ".done-ic.pop{animation:pop .45s cubic-bezier(.2,1.5,.4,1)}",
    "@keyframes pop{from{transform:scale(.3);opacity:0}}",
    ".center{text-align:center}",
    ".center h2{font-size:26px;margin:4px 0 6px}",
    ".center p{margin:0 auto;max-width:36ch;color:var(--muted);font-size:17px}",

    /* login */
    ".lock{width:64px;height:64px;border-radius:50%;background:var(--accent-soft);color:var(--accent);display:grid;place-items:center;margin:6px auto 0}",
    ".lock .ic{width:30px;height:30px}",
    ".veil.solid{background:transparent;top:70px;bottom:auto;min-height:calc(100vh - 70px);padding:40px 16px}@media (max-width:719px){.veil.solid{top:58px;min-height:calc(100vh - 58px);place-items:center stretch;padding:16px}.veil.solid > .card{border-radius:20px}}",
    ".veil.solid > .card{width:min(460px,100%);box-shadow:0 0 0 1px #e2dcd2,0 30px 60px -28px rgba(36,34,31,.45)}",
    ".veil.solid h2{font-family:'SW Zilla','Zilla Slab',Georgia,serif;font-size:30px;line-height:1.1;letter-spacing:-.005em}",
    ".kick{display:inline-flex;align-items:center;gap:6px}.kick .ic{width:14px;height:14px}",
    ".veil.solid .kick{color:#5F7152}",
    ".logo{display:grid;place-items:center;margin:4px auto 2px;max-width:260px}.logo img{width:240px;max-width:100%;height:auto;max-height:110px;object-fit:contain;display:block}",
    ".kick{margin:0 0 2px;font-size:13px!important;letter-spacing:.12em;text-transform:uppercase;color:var(--muted);font-weight:600}",
    ".pw{display:flex;align-items:stretch;border:2px solid var(--line);border-radius:12px;background:var(--soft);overflow:hidden}",
    ".pw:focus-within{border-color:var(--accent);background:#fff}",
    ".pw input{flex:1;min-width:0;font:inherit;font-size:20px;border:0;background:none;padding:12px 14px;color:var(--ink);outline:none;letter-spacing:.02em}",
    ".pw button{border:0;background:none;padding:0 14px;color:var(--muted);font-size:15px;font-weight:600;display:flex;align-items:center;gap:6px}",

    ".toast{position:fixed;left:50%;transform:translateX(-50%);top:calc(18px + env(safe-area-inset-top,0px));background:var(--ink);color:#fff;padding:12px 18px;border-radius:14px;font-size:16px;font-weight:600;",
    "  width:max-content;max-width:calc(100vw - 28px);box-sizing:border-box;text-align:left;box-shadow:0 8px 24px rgba(0,0,0,.3);display:flex;align-items:center;gap:10px}",
    ".toast .ic{color:#7fd39b}",
    ".toast{z-index:10}.toast .undo-t{flex:none;margin:-4px -6px -4px 4px;border:0;border-radius:10px;min-height:38px;padding:0 14px;background:rgba(255,255,255,.16);color:#fff;font-size:15px;font-weight:600}.toast .undo-t:hover{background:rgba(255,255,255,.28)}",
    ".sr{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap}",
    ".card:focus,.pg:focus{outline:none}",
    ".card .hd:has(+ .ft){padding-bottom:18px}",
    ".toast{animation:tin .25s ease-out}@keyframes tin{from{opacity:0;transform:translate(-50%,-10px)}}",
    "@media (prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}}"
  ].join("\n");

  var host, root, layer;
  // Styles go in as constructed sheets where possible, because sites with strict
  // security rules (a Content-Security-Policy) block <style> tags added by scripts.
  function addCss(target, css) {
    try {
      var sheet = new CSSStyleSheet(); sheet.replaceSync(css);
      target.adoptedStyleSheets = Array.prototype.slice.call(target.adoptedStyleSheets || []).concat([sheet]);
    } catch (e) {
      (target === document ? document.head : target).appendChild(h("style", { text: css }));
    }
  }
  function mount() {
    host = document.createElement("div");
    host.setAttribute("data-site-notes", "");
    root = host.attachShadow({ mode: "open" });
    addCss(root, CSS);
    layer = h("div", { class: "r" });
    els.live = h("div", { class: "sr", role: "status", "aria-live": "polite" });
    layer.appendChild(els.live);
    root.appendChild(layer);
    document.body.appendChild(host);
  }
  // A short message at the top. Screen readers hear it through one quiet message area that stays put.
  // Longer messages stay up longer. opts.undo adds an Undo button; opts.after runs once it's gone.
  var toastTimer, toastEl = null, toastUndo = null, toastAfter = null;
  function toast(text, opts) {
    clearToast(); opts = opts || {};
    toastUndo = opts.undo || null; toastAfter = opts.after || null;
    toastEl = h("div", { class: "toast" }, [icon("check"), h("span", { text: text }),
      toastUndo ? h("button", { class: "undo-t", type: "button", text: "Undo", onclick: function () { var u = toastUndo; toastUndo = toastAfter = null; clearToast(); if (u) u(); } }) : null]);
    layer.appendChild(toastEl);
    if (els.live) { els.live.textContent = ""; setTimeout(function () { els.live.textContent = text; }, 40); }
    toastTimer = setTimeout(clearToast, toastUndo ? 7000 : Math.min(8000, Math.max(3800, text.length * 65)));
  }
  function clearToast() {
    clearTimeout(toastTimer);
    if (toastEl) { toastEl.remove(); toastEl = null; }
    var after = toastAfter; toastAfter = toastUndo = null; if (after) after();
  }

  /* =========================================================== service */

  function api(path, opts) {
    opts = opts || {};
    var headers = {};
    if (opts.token) { headers.authorization = "Bearer " + opts.token; touch(); }
    if (opts.type) headers["content-type"] = opts.type;
    return fetch(API + path, { method: "POST", headers: headers, body: opts.raw || JSON.stringify(opts.body || {}) })
      .then(function (r) { return r.json().then(function (d) { d.status = r.status; return d; }, function () { return { ok: false, status: r.status, error: "Something went wrong on our end." }; }); },
            function () { return { ok: false, status: 0, error: "Your internet seems to be off." }; })
      .then(function (d) { if (d.status === 401 && opts.token) setToken(null); return d; });
  }

  /* =========================================================== login */

  // Their page stays hidden until they log in.
  function lock() { addCss(document, "html.swn-locked body>*:not([data-site-notes]):not([data-keep]){visibility:hidden!important}"); document.documentElement.classList.add("swn-locked"); }
  function unlock() { document.documentElement.classList.remove("swn-locked"); }
  function showLogin() {
    var pw = h("input", { type: "password", id: "swn-pw", autocapitalize: "off", autocomplete: "current-password", "aria-label": "Password" });
    var showBtn = h("button", { type: "button", onclick: function () {
      var on = pw.type === "password"; pw.type = on ? "text" : "password";
      showBtn.lastChild.textContent = on ? "Hide" : "Show"; pw.focus();
    } }, [icon("eye"), h("span", { text: "Show" })]);
    var err = h("p", { class: "err", hidden: true, role: "alert" });
    var btn = h("button", { class: "b main wide", type: "submit", text: "Log in" });
    var form = h("form", { class: "card", onsubmit: function (e) {
      e.preventDefault(); err.hidden = true;
      if (!pw.value.trim()) { err.textContent = "Type your password first."; err.hidden = false; pw.focus(); return; }
      btn.disabled = true; btn.textContent = "Checking…";
      var done = function (d) {
        btn.disabled = false; btn.textContent = "Log in";
        if (!d.ok) { err.textContent = d.status === 0 ? "Your internet seems to be off. Check it and try again." : (d.error || "That password isn't right. Check it and try again."); err.hidden = false; pw.select(); return; }
        setToken(d.token); watchSession();
        veil.remove(); unlock(); start();
      };
      if (DEMO) setTimeout(function () { done(pw.value.trim().toLowerCase() === "wolf" ? { ok: true, token: "demo" } : { ok: false, status: 401, error: "That password isn't right. (In this demo it's: wolf)" }); }, 350);
      else api("/api/login", { body: { site: SITE, password: pw.value.trim() } }).then(done);
    } }, [
      h("div", { class: "bd", style: "padding-top:22px;gap:14px" }, [
        LOGO ? h("div", { class: "logo" }, [h("img", { src: LOGO, alt: NAME || "Logo" })]) : h("div", { class: "lock" }, [icon("lock")]),
        h("div", { class: "center" }, [NAME ? h("p", { class: "kick" }, [icon("lock"), h("span", { text: IS_HUB ? "Client Portal" : "Owner login" })]) : null, h("h2", { text: NAME ? "Welcome, " + NAME : "Owner login" }), h("p", { text: "Type the password " + TO + " gave you." })]),
        h("label", { class: "q", for: "swn-pw", text: "Password" }),
        h("div", { class: "pw" }, [pw, showBtn]),
        err, btn,
        h("p", { class: "center", style: "font-size:15px;color:var(--muted);margin:0", text: DEMO ? "Demo password: wolf" : "Forgot it? Just ask " + TO + "." })
      ])
    ]);
    var veil = h("div", { class: "veil" + (IS_HUB ? " solid" : "") }, [form]);
    layer.appendChild(veil); pw.focus();
  }

  /* =========================================================== where on the page */

  function pathOf(node) { var p = []; while (node && node !== document.body && node.parentNode) { p.unshift(Array.prototype.indexOf.call(node.parentNode.children, node)); node = node.parentNode; } return p; }
  function nodeAt(path) { var n = document.body; for (var i = 0; n && i < path.length; i++) n = n.children[path[i]]; return n && n !== host ? n : null; }
  // A CSS selector for the spot: an id where there is one, otherwise tag:nth-of-type steps from <body>.
  // Holds up better than child counts when something is added to the page later.
  function selOf(el) {
    var parts = [];
    while (el && el.nodeType === 1 && el !== document.body && el !== document.documentElement) {
      if (el.id && /^[A-Za-z][\w-]*$/.test(el.id) && document.querySelectorAll("#" + el.id).length === 1) { parts.unshift("#" + el.id); return parts.join(" > "); }
      var tag = el.tagName.toLowerCase(), same = 0, at = 0;
      for (var s = el.parentNode.firstElementChild; s; s = s.nextElementSibling) if (s.tagName === el.tagName) { same++; if (s === el) at = same; }
      parts.unshift(same > 1 ? tag + ":nth-of-type(" + at + ")" : tag);
      el = el.parentNode;
    }
    return "body > " + parts.join(" > ");
  }
  // What the spot says (or a picture's name), one tidy line, so it can be found again by its words.
  function snipOf(el) {
    var img = el.tagName === "IMG" ? el : (!tidy(el.innerText) && el.querySelector("img"));
    if (img) return short(img.alt || decodeURIComponent((img.currentSrc || img.src || "").split(/[?#]/)[0].split("/").pop() || ""), 160);
    // a whole card is too much: its headline, or else its first line
    var all = tidy(textOf(el), true); if (all.length <= 90) return all;
    var head = el.querySelector("h1,h2,h3,h4,h5,strong,b");
    var first = head ? tidy(textOf(head), true) : tidy(textOf(el).split(/\n+/).filter(function (l) { return l.trim(); })[0] || "", true);
    return short(first || all, 90);
  }
  function pageName() {
    if (/^\/(index\.html?)?$/.test(location.pathname)) return "Home";
    return short((document.title || "").split(/\s*[|–—:·]\s*|\s-\s/)[0], 40) || location.pathname;
  }
  function tidy(text, oneLine) {
    text = String(text || "").replace(/\s*\n+\s*/g, oneLine ? " " : " · ").replace(/(\s*·\s*)+/g, " · ").replace(/\s+/g, " ").replace(/^[\s·]+|[\s·]+$/g, "");
    if (/[A-Z]/.test(text) && text === text.toUpperCase()) text = text.replace(/[A-Z][A-Z']{2,}/g, function (w) { return w.charAt(0) + w.slice(1).toLowerCase(); });
    return text;
  }
  // The words someone would read in an element, leaving out small print inside it
  // (like a little label sitting above a big headline).
  function textOf(el) {
    var size = parseFloat(getComputedStyle(el).fontSize) || 16, out = "";
    (function walk(n) {
      for (var c = n.firstChild; c; c = c.nextSibling) {
        if (c.nodeType === 3) out += c.nodeValue;
        else if (c.nodeType === 1) {
          if (c.tagName === "BR") { out += "\n"; continue; }
          var cs = getComputedStyle(c);
          if (cs.display === "none" || cs.visibility === "hidden") continue;
          if ((parseFloat(cs.fontSize) || size) < size * 0.6) continue;
          if (/^(block|flex|grid|list-item)$/.test(cs.display)) { out += "\n"; walk(c); out += "\n"; } else walk(c);
        }
      }
    })(el);
    return out;
  }
  function describe(t) {
    var area = t.closest("[data-area],section,article,header,footer,nav,aside,main"), where = "";
    if (area) {
      var head = area.getAttribute("data-area") ? null : area.querySelector("h1,h2,h3");
      where = area.getAttribute("data-area") || (head && area.tagName !== "MAIN" && !head.contains(t) && !t.contains(head) ? short(tidy(textOf(head), true).replace(/[.!?:,;]+$/, ""), 40) : "") ||
        ({ HEADER: "Top of the page", FOOTER: "Bottom of the page", NAV: "Menu" })[area.tagName] || "";
    }
    var what, inner = t.matches("h1,h2,h3,h4") ? null : t.querySelector("h1,h2,h3");
    var img = t.tagName === "IMG" ? t : (!tidy(t.innerText) && t.querySelector("img"));
    if (img) {   // a picture: name it by its alt text or caption, and call a logo a logo
      var fig = img.closest("figure"), cap = fig && fig.querySelector("figcaption");
      var file = decodeURIComponent((img.currentSrc || img.src || "").split(/[?#]/)[0].split("/").pop() || "");
      var name = tidy(img.alt || (cap && cap.innerText) || "");
      what = /logo/i.test(file + " " + img.className + " " + name) ? "Logo" + (name && !/^logo$/i.test(name) ? " (" + name + ")" : "")
        : name ? "Picture: " + name : "A picture";
    }
    else if (inner && (t.innerText || "").length > (inner.innerText || "").length + 20) what = tidy(textOf(inner), true);   // a block with a headline: name it by the headline
    else {
      var row = t.closest("li,tr,figure,dl > div,button,a,p,h1,h2,h3,h4,blockquote");
      var src = row && (row.innerText || "").length < 160 ? row : t;
      what = (src.innerText || "").length < 400 ? tidy(textOf(src), src.matches("h1,h2,h3,h4,h5")) : "";
    }
    what = short(what, 70);
    return where && what && what.indexOf(where) !== 0 ? where + ": " + what : (what || where || "This page");
  }
  // What to highlight when the pointer is over something: a sensible chunk, not a stray span.
  function targetOf(t) {
    if (!t || t.nodeType !== 1 || t === document.documentElement || t === document.body) return null;
    var good = t.closest("img,picture,figure,a,button,li,h1,h2,h3,h4,h5,p,blockquote,td,dt,dd,label,svg");
    if (good && good.tagName === "svg") good = good.parentElement || good;
    var c = good || t, r = c.getBoundingClientRect();
    if (r.width * r.height > window.innerWidth * window.innerHeight * 0.8) return null;   // a whole-page wrapper is no help
    return c;
  }

  /* =========================================================== notes mode */

  var picking = false, active = -1, busy = false, els = {}, panel = null, hlFor = null, lastPin = null;

  function picCount() { return st.notes.reduce(function (n, x) { return n + x.pics.length; }, 0); }

  function render() {
    // On their own page, "Sent" is only ever the message in the middle. However that message is closed
    // (Done, Esc, a tap outside), the page starts fresh: no leftover "Sent" bar at the bottom.
    if (MODE === "hub" && st.sent && !els.veil) {
      st.notes.forEach(function (x) { x.pics.forEach(picDel); if (x.shot) picDel(x.shot); });
      st.notes = []; st.sent = false; st.sentNotes = st.sentPics = 0; save();
    }
    var n = st.notes.length;
    els.frame.className = "frame" + (picking ? " picking" : "");
    // on their own page with nothing written yet, only the slim "logged in" bar shows, so the boxes stay clear
    var quiet = MODE === "hub" && !st.sent && !n && !picking && !(els.note && st.notes[active]);
    els.dock.className = "dock " + MODE + (picking ? " picking" : "") + (quiet ? " quiet" : "") + (els.bare ? " bare" : "");
    if (els.spacer) els.spacer.style.height = quiet && els.bare ? "0px" : "150px";
    els.btns.textContent = "";
    els.say.textContent = "";
    if (st.sent) {
      els.say.append(h("b", { text: "Sent to " + TO + ". Thank you!" }), h("span", { text: "Nothing on your site changes until " + TO + " makes the update." }));
      els.btns.append(dockBtn("plus", "Start new notes", "main", function () { newList(); }));
    } else if (picking) {
      els.say.append(h("b", { text: "Now tap the part you want changed." }), h("span", { text: "A word, a picture, a price, anything. You can scroll first." }));
      els.btns.append(
        dockBtn("pencil", "Write it without tapping", "second", function () { stopPicking(); addNote(null, "Something else"); }),
        dockBtn("x", "Cancel", "second", function () { stopPicking(); }));
    } else if (MODE === "hub" && !(els.note && st.notes[active])) {
      els.say.append(
        h("b", { text: n ? plural(n, "note") + " ready" : "Tap a box to add something." }),
        h("span", { text: n ? "Add more, or send them to " + TO + " when you're done." : "Or tap Edit mode to point at things on your website." }));
      els.btns.append(dockBtn("send", "Send to " + TO, n ? "go" : "go off", function () { reviewFrom = null; if (st.notes.length) openReview(); else toast("Tap a box first. Then you can send it."); }, n));
    } else if (els.note && st.notes[active]) {
      // one thing at a time: while a note is open, the bar only points at it
      els.say.append(h("b", { text: "You're writing note " + (active + 1) + "." }), h("span", { text: "Type what you'd like, then tap Save note." }));
      els.btns.append(dockBtn("check", "Save note", "main", saveNote));
    } else {
      els.say.append(
        h("b", { text: n ? plural(n, "note") + " ready" : "Want something changed?" }),
        h("span", { text: n ? "Add more, or send them to " + TO + " when you're done." : "Tap Add a note, then tap the part of the page." }));
      els.btns.append(
        dockBtn("note", "Add a note", "main", startPicking),
        dockBtn("photo", "Add photos", "second", function () { addNote(null, "Photos for the site", null, true); }),
        dockBtn("send", "Send to " + TO, n ? "go" : "go off", function () { reviewFrom = null; if (st.notes.length) openReview(); else toast("Add a note first. Then you can send it."); }, n));
    }
    els.btns.className = "btns n" + els.btns.children.length;
    placePins();
  }
  function dockBtn(ic, text, kind, fn, count) {
    var b = h("button", { class: "db " + kind, type: "button", onclick: fn }, [icon(ic), h("span", { text: text })]);
    if (count) b.appendChild(h("span", { class: "badge", text: String(count), "aria-label": plural(count, "note") }));
    return b;
  }

  function placePins() {
    if (!els.pins) return;
    els.pins.textContent = "";
    if (st.sent) return;
    var base = host.getBoundingClientRect();
    st.notes.forEach(function (n, i) {
      if (!n.path || n.page !== location.pathname) return;
      var node = nodeAt(n.path); if (!node) return;
      var r = node.getBoundingClientRect(); if (!r.width && !r.height) return;
      var pin = h("button", { class: "pin" + (i === active ? " on" : "") + (n.id === lastPin ? " drop" : ""), type: "button", "aria-label": "Note " + (i + 1) + ". Tap to open it.", text: String(i + 1),
        style: "left:" + (r.left - base.left + r.width * n.fx) + "px;top:" + (r.top - base.top + r.height * n.fy) + "px",
        onclick: function (e) { e.stopPropagation(); if (!picking) openNote(i); } });
      els.pins.appendChild(pin);
    });
    lastPin = null;
    if (panel === "note") placeNoteCard();
  }

  /* ----- picking a spot ----- */
  function startPicking() { closePanels(); picking = true; render(); }
  function stopPicking() { picking = false; hideHl(); render(); }
  function showHl(t) {
    if (!t) return hideHl();
    hlFor = t;
    var r = t.getBoundingClientRect(), base = host.getBoundingClientRect();
    els.hl.hidden = false;
    els.hl.className = "hl" + (r.top < 80 ? " below" : "");
    els.hl.style.cssText = "left:" + (r.left - base.left - 4) + "px;top:" + (r.top - base.top - 4) + "px;width:" + (r.width + 8) + "px;height:" + (r.height + 8) + "px";
  }
  function hideHl() { hlFor = null; if (els.hl) els.hl.hidden = true; }

  /* ----- one note ----- */
  function addNote(target, label, ev, wantPhotos) {
    closePanels();
    st.notes.push(makeNote(target, label, ev)); save();
    openNote(st.notes.length - 1, wantPhotos);
  }
  function makeNote(target, label, ev) {
    var note = { id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6), page: location.pathname, title: MODE === "hub" ? "Client Portal" : pageName(), hub: MODE === "hub", path: null, fx: .5, fy: .5, on: label || "", text: "", pics: [] };
    if (target) {
      var r = target.getBoundingClientRect();
      note.path = pathOf(target); note.on = label && target.hasAttribute("data-note-box") ? label : describe(target);
      if (target.hasAttribute("data-note-ask")) note.ask = target.getAttribute("data-note-ask");
      if (target.hasAttribute("data-note-hint")) note.hint = target.getAttribute("data-note-hint");
      if (target.hasAttribute("data-note-fields")) { note.fields = target.getAttribute("data-note-fields").split("|"); note.vals = {}; note.extra = ""; }
      if (target.hasAttribute("data-note-now")) {
        note.now = {};
        target.getAttribute("data-note-now").split("|").forEach(function (p) { var k = p.indexOf("="); if (k > 0) note.now[p.slice(0, k)] = p.slice(k + 1); });
      }
      if (target.hasAttribute("data-note-photos")) { note.photos = true; note.ideas = (target.getAttribute("data-note-photos") || "").split("|").filter(Boolean); }
      if (ev && r.width) note.fx = Math.min(1, Math.max(0, (ev.clientX - r.left) / r.width));
      if (ev && r.height) note.fy = Math.min(1, Math.max(0, (ev.clientY - r.top) / r.height));
      // so Stray Wolf can find the exact spot later ("Show me on the site")
      try {
        note.url = location.origin + location.pathname;
        note.snip = snipOf(target); note.vw = window.innerWidth;
        note.py = Math.round(Math.min(1, Math.max(0, (r.top + window.scrollY) / Math.max(1, document.documentElement.scrollHeight))) * 1000) / 1000;
        if (MODE !== "hub") note.sel = selOf(target).slice(0, 300);
      } catch (e) {}
      if (MODE !== "hub") snapSpot(note, target);
      lastPin = note.id;
    }
    return note;
  }

  function openNote(i, wantPhotos) {
    if (st.notes[i] && st.notes[i].pg && photosBox()) return openPhotos();   // the Photos box's note lives on the Photos page
    remember(); closePanels();
    active = i; panel = "note";
    var note = st.notes[i], phone = isPhone();
    var text = h("textarea", { id: "swn-text", placeholder: note.hint || "For example: Change the price to $32.", onkeydown: function (e) { if (e.key === "Escape") saveNote(); } });
    text.value = note.fields ? note.extra || "" : note.text;
    // A box can ask for a few named things, one line each (like Facebook, Instagram...).
    // "Label" or "Label=example text"
    var fieldEls = (note.fields || []).map(function (raw, k) {
      var f = raw.split("=")[0], ex = raw.split("=")[1];
      var b = !ex && BRANDS[f.toLowerCase()];
      var inp = h("input", ex ? { type: "text", id: "swn-f" + k, autocomplete: "off", placeholder: ex }
                              : { type: "text", id: "swn-f" + k, inputmode: "url", autocapitalize: "off", autocomplete: "off", placeholder: b ? b.ph : "Paste the link here" });
      inp.value = (note.vals && note.vals[f]) || "";
      // Already on their site: show it, with a Change button. Only a tap on Change opens the box,
      // filled in with what's there now, so they fix it instead of typing it all again.
      var now = note.now && note.now[f], slot = inp, fe = { name: f, input: inp, brand: !!b, now: now || "" };
      if (now) {
        var cur = h("div", { class: "cur" }), ed = h("div", { class: "ed" });
        var open = function (on, focus) {
          fe.editing = on; cur.hidden = on; ed.hidden = !on;
          if (on && !inp.value) inp.value = now;
          if (!on) inp.value = "";
          if (on && focus) { inp.focus(); try { inp.select(); } catch (e) {} }
        };
        cur.append(icon("check"), h("span", { class: "val" }, now.replace(/([@\/?])/g, "$1\u0001").split("\u0001").reduce(function (a, p, i) { if (i) a.push(h("wbr")); a.push(p); return a; }, [])), h("button", { class: "chg", type: "button", text: "Change", "aria-label": "Change " + f, onclick: function () { open(true, true); } }));
        ed.append(inp, h("button", { class: "undo", type: "button", text: "Undo", "aria-label": "Keep " + f + " as it is", onclick: function () { open(false); } }));
        slot = h("div", { class: "fv" }, [cur, ed]);
        open(!!inp.value && inp.value !== now);
      }
      fe.row = b ? h("div", { class: "field brand" }, [brandLogo(b), h(now ? "span" : "label", now ? { class: "lb", text: f === "Google" ? "Google business" : f } : { for: "swn-f" + k, text: f === "Google" ? "Google business" : f }), slot])
                 : h("div", { class: "field" }, [h(now ? "span" : "label", now ? { class: "lb", text: f } : { for: "swn-f" + k, text: f }), slot]);
      return fe;
    });
    var brands = fieldEls.length && fieldEls.every(function (f) { return f.brand; });
    var hasNow = fieldEls.some(function (f) { return f.now; });
    if (note.fields) { text.placeholder = "Anything else? (You can leave this empty.)"; text.style.minHeight = "70px"; }
    text.addEventListener("paste", function (e) { var f = e.clipboardData && e.clipboardData.files; if (f && f.length) { e.preventDefault(); addPictures(f); } });
    var thumbs = h("div", { class: "thumbs" });
    var drop = h("button", { class: "add-ph" + (note.photos ? " big" : ""), type: "button", onclick: function () { els.file.click(); } }, [
      icon("photo"), h("div", {}, [h("b", { text: dropTitle(note, phone) }), h("span", { text: phone ? "From your photos, or take a new one" : "Click to choose, or drag them here from your computer" })])]);
    // Ideas for what to send ("A shed on a finished gravel pad"): one tap puts the words on a photo.
    var ideas = note.photos && note.ideas && note.ideas.length ? h("div", { class: "ideas" }, [
      h("p", {}, [h("b", { text: "Need ideas?" }), " These would help most. Tap one to label a photo with it."]),
      h("div", { class: "chips" }, note.ideas.map(function (idea) {
        return h("button", { class: "chip", type: "button", text: idea, onclick: function () { useIdea(note, idea); } });
      }))]) : null;

    if (note.photos) { text.placeholder = "Anything else about these photos? (optional)"; text.style.minHeight = "70px"; }
    var card = h("div", { class: "card note" + (brands || hasNow || note.photos ? " wide" : "") + (note.photos ? " photos" : "") + (phone ? " sheet" : ""), role: "dialog", tabindex: "-1", "aria-label": "Note " + (i + 1) + ", about " + short(note.on, 60) }, [
      h("div", { class: "dropcover", "aria-hidden": "true" }, [icon("photo"), h("b", { text: "Drop your photos here" })]),
      h("div", { class: "hd" }, [
        h("span", { class: "num", text: String(i + 1) }),
        h("div", { class: "grow" }, [h("h2", { text: note.text || note.pics.length ? "Your note" : "New note" })]),
        h("button", { class: "xbtn", type: "button", "aria-label": "Close and keep this note", onclick: saveNote }, [icon("x")])
      ]),
      h("div", { class: "bd" }, [
        h("div", { class: "where" }, [h("span", { text: "About:" }), h("b", { text: note.on })]),
        h("label", { class: "q", for: note.fields ? "swn-f0" : "swn-text", text: note.ask || "What would you like changed?" }),
        brands ? h("p", { class: "tip" }, [icon("help"), h("span", { text: "Not sure where to find it? Open your page, then copy the address from the top of the screen." })]) : null,
        note.fields ? h("div", { class: "fields" + (brands ? " brands" : fieldEls.some(function (f) { return f.name.length > 11; }) ? " stack" : "") }, fieldEls.map(function (f) { return f.row; })) : null,
        note.photos ? drop : null, note.photos ? thumbs : null, ideas,
        text, note.photos ? null : thumbs, note.photos || note.fields ? null : drop
      ]),
      h("div", { class: "ft" }, [
        h("button", { class: "b danger", type: "button", onclick: function () { removeNote(active); } }, [icon("trash"), h("span", { text: "Delete" })]),
        h("button", { class: "b main push", type: "button", onclick: saveNote }, [icon("check"), h("span", { text: note.photos ? "Save photos" : "Save note" })])
      ])
    ]);
    // Files dragged anywhere over the note: the whole card lights up and takes them.
    var depth = 0, hasFiles = function (e) { var t = e.dataTransfer && e.dataTransfer.types; return t && Array.prototype.indexOf.call(t, "Files") >= 0; };
    card.addEventListener("dragenter", function (e) { if (!hasFiles(e)) return; e.preventDefault(); depth++; card.classList.add("dropping"); });
    card.addEventListener("dragover", function (e) { if (!hasFiles(e)) return; e.preventDefault(); e.dataTransfer.dropEffect = "copy"; });
    card.addEventListener("dragleave", function () { if (--depth <= 0) { depth = 0; card.classList.remove("dropping"); } });
    card.addEventListener("drop", function (e) { if (!hasFiles(e)) return; e.preventDefault(); e.stopPropagation(); depth = 0; card.classList.remove("dropping"); addPictures(e.dataTransfer.files); });
    els.note = { card: card, text: text, thumbs: thumbs, drop: drop, fields: fieldEls };
    layer.appendChild(card);
    els.dock.hidden = phone;
    drawThumbs(note, thumbs, true);
    render();
    if (phone && note.path) {               // keep the spot in view above the sheet
      var node = nodeAt(note.path);
      if (node) { var r = node.getBoundingClientRect(); window.scrollBy({ top: r.top - window.innerHeight * 0.18, behavior: reduceMotion ? "auto" : "smooth" }); }
    }
    placeNoteCard();
    if (wantPhotos) els.file.click();
    else if (!phone) { var first = fieldEls.length ? fieldEls[0].input : text; try { first.focus({ preventScroll: true }); } catch (e) { first.focus(); } }
    else { try { card.focus({ preventScroll: true }); } catch (e) {} }   // phones: no keyboard popping up yet, but focus is in the note
  }
  // Big screens: the note box sits next to its pin. Phones: it's a sheet at the bottom.
  function placeNoteCard() {
    if (!els.note || panel !== "note") return;
    var card = els.note.card, note = st.notes[active];
    if (isPhone()) { card.classList.add("sheet"); card.style.cssText = ""; return; }
    card.classList.remove("sheet");
    var vw = window.innerWidth, vh = window.innerHeight, dockH = els.dock.offsetHeight || 80, w = card.offsetWidth || 400, hh = card.offsetHeight || 420;
    var x = vw - w - 24, y = vh - dockH - hh - 16;                      // default: bottom right, above the dock
    var node = note && note.path && note.page === location.pathname ? nodeAt(note.path) : null;
    if (node) {
      var r = node.getBoundingClientRect(), px = r.left + r.width * note.fx, py = r.top + r.height * note.fy;
      if (py > -40 && py < vh) {
        x = px + 34 + w < vw - 16 ? px + 34 : px - w - 34;
        y = py - 60;
      }
    }
    x = Math.max(16, Math.min(x, vw - w - 16));
    y = Math.max(16, Math.min(y, vh - dockH - hh - 16));
    card.style.cssText = "left:" + Math.round(x) + "px;top:" + Math.round(y) + "px;max-height:" + (vh - dockH - 32) + "px";
  }
  // Up to CAPS_AT photos: a "What is this?" line beside each one. A bigger batch keeps it to one tap
  // ("Say what these are") so nobody has to label 15 photos. Words are optional either way.
  var CAPS_AT = 6;
  function drawThumbs(note, box, editable) {
    box.textContent = "";
    box.hidden = !note.pics.length;
    note.caps = note.caps || {};
    var withCaps = editable && note.pics.length && (note.pics.length <= CAPS_AT || note.showCaps || Object.keys(note.caps).length > 0);   // never hide words already typed
    box.className = box.className.replace(/\s*capt\b/, "") + (withCaps ? " capt" : "");
    note.pics.forEach(function (id, k) {
      var img = h("img", { alt: note.caps[id] || "Photo " + (k + 1), title: note.caps[id] || "" });
      picUrl(id).then(function (u) { if (u) img.src = u; });
      var ph = h("span", { class: "ph" }, [img, editable ? h("button", { class: "rm", type: "button", "aria-label": "Take out photo " + (k + 1), onclick: function () {
        note.pics.splice(note.pics.indexOf(id), 1); delete note.caps[id]; picDel(id); save(); drawThumbs(note, box, true); refreshDrop(note);
      } }, [icon("x")]) : null]);
      var cap = withCaps ? h(note.photos ? "textarea" : "input", { class: "cap", rows: note.photos ? "2" : null, type: note.photos ? null : "text", maxlength: "140", autocomplete: "off", "aria-label": "What is photo " + (k + 1) + "? (optional)",
        placeholder: k === 0 && !note.photos && CAPTION_EXAMPLE ? "What is this? For example: " + CAPTION_EXAMPLE : "What is this? (optional)",
        oninput: function () { var v = this.value.trim(); if (v) note.caps[id] = v; else delete note.caps[id]; img.alt = v || "Photo " + (k + 1); save(); } }) : null;
      if (cap) cap.value = note.caps[id] || "";
      box.appendChild(h("span", { class: "t", "data-id": id }, [ph, cap]));
    });
    if (editable && note.pics.length > CAPS_AT && !note.showCaps)
      box.appendChild(h("button", { class: "capts", type: "button", text: "Say what these are (optional)",
        onclick: function () { note.showCaps = true; save(); drawThumbs(note, box, true); var f = box.querySelector(".cap"); if (f) f.focus(); } }));
  }
  function dropTitle(note, phone) {
    if (note.pics.length) return "Add more photos";
    return note.photos ? (phone ? "Tap to choose photos" : "Choose photos, or drop them here") : "Add photos";
  }
  function refreshDrop(note) { if (els.note) { els.note.drop.classList.remove("busy"); els.note.drop.querySelector("b").textContent = dropTitle(note, isPhone()); } }
  // An idea chip: label the first photo with no words yet; with no photos yet, open the picker and label the first one added.
  function useIdea(note, idea) {
    note.caps = note.caps || {};
    var free = note.pics.filter(function (id) { return !note.caps[id]; })[0];
    if (!free) { note.pendingIdea = idea; save(); els.file.click(); return; }
    note.caps[free] = idea; note.showCaps = true; save();
    if (els.note) { drawThumbs(note, els.note.thumbs, true); var f = els.note.thumbs.querySelector('[data-id="' + free + '"] .cap'); if (f) { f.focus(); f.classList.add("flash"); } }
  }
  function saveNote() {
    var note = st.notes[active];
    if (note && els.note && note.fields) {
      note.extra = els.note.text.value.trim();
      var lines = [];
      els.note.fields.forEach(function (f) {
        var v = f.input.value.trim(), name = f.name.replace(/[?:.]+$/, "");
        if (f.now) { if (!f.editing || !v || v === f.now) v = ""; }   // left as it is
        note.vals[f.name] = v;
        if (v) lines.push(name + ": " + v + (f.now ? " (was " + f.now + ")" : ""));
      });
      note.text = lines.concat(note.extra ? [note.extra] : []).join("\n");
    } else if (note && els.note) note.text = els.note.text.value.trim();
    var kept = note && (note.text || note.pics.length);
    if (note && !kept) st.notes.splice(active, 1);                    // an empty note is dropped
    closePanels(); save(); render();
    if (kept) toast(st.notes.length === 1 ? "Note saved. Add another, or tap Send to " + TO + "." : "Note saved.");
  }
  // Delete is one tap, with Undo for a few seconds. Its photos are only thrown away once Undo is gone.
  function removeNote(i, inReview) {
    var note = st.notes[i]; if (!note) return;
    st.notes.splice(i, 1); closePanels(); save(); render();
    if (inReview && st.notes.length) openReview();
    var gone = true;
    toast(inReview && !st.notes.length ? "Note deleted. Nothing left to send." : "Note deleted.", {
      undo: function () { gone = false; st.notes.splice(Math.min(i, st.notes.length), 0, note); save(); closePanels(); render(); if (inReview) openReview(); toast("Your note is back."); },
      after: function () { if (gone) { note.pics.forEach(picDel); if (note.shot) picDel(note.shot); } }
    });
  }
  function closePanels() {
    closeLb();
    if (panel === "photos") leavePhotos();
    if (els.note) { els.note.card.remove(); els.note = null; }
    if (els.veil) { els.veil.remove(); els.veil = null; els.veilClose = null; }
    active = -1; panel = null; if (els.dock) els.dock.hidden = false;
    still(); giveBack();
  }
  // Pop-ups that need attention: the page behind stays still, Tab stays inside, and when the last
  // one closes, focus goes back to what opened it (or a button with the same words, if it was redrawn).
  var backTo = null, backText = "";
  function remember() {
    if (backTo) return;
    var a = root.activeElement || document.activeElement;
    if (!a || a === document.body || a === document.documentElement) return;
    backTo = a; backText = (a.textContent || "").trim();
  }
  function giveBack() {
    setTimeout(function () {
      if (panel || els.lb || els.veil || els.note || !backTo) return;
      var b = backTo; backTo = null;
      if (!b.isConnected && backText) b = Array.prototype.filter.call(root.querySelectorAll("button"), function (x) { return x.getClientRects().length && (x.textContent || "").trim() === backText; })[0];
      if (b && b.isConnected) try { b.focus({ preventScroll: true }); } catch (x) {}
    }, 0);
  }
  function still() { document.documentElement.classList.toggle("swn-still", !!(els.veil || els.lb || panel === "photos")); }
  function topModal() { return els.lb ? els.lb.firstChild : els.veil ? els.veil.firstChild : panel === "photos" && els.note ? els.note.card : null; }
  function trapTab(e) {
    var box = topModal(); if (e.key !== "Tab" || !box) return;
    var f = Array.prototype.filter.call(box.querySelectorAll('button:not([disabled]),a[href],input:not([type="hidden"]):not([disabled]),textarea,[tabindex]:not([tabindex="-1"])'), function (x) { return x.getClientRects().length; });
    if (!f.length) return;
    var a = root.activeElement, first = f[0], last = f[f.length - 1];
    if (!a || !box.contains(a)) { e.preventDefault(); (e.shiftKey ? last : first).focus(); }
    else if (e.shiftKey && a === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && a === last) { e.preventDefault(); first.focus(); }
  }

  /* ----- photos: shrunk in the browser, kept until sent ----- */
  function shrink(file) {
    return new Promise(function (res) {
      if (!file || !/^image\//.test(file.type)) return res(null);
      var url = URL.createObjectURL(file), im = new Image();
      im.onload = function () {
        var s = Math.min(1, MAX_SIDE / Math.max(im.width, im.height));
        var c = document.createElement("canvas"); c.width = Math.round(im.width * s); c.height = Math.round(im.height * s);
        var png = file.type === "image/png" && file.size < 1500000;          // keep small PNGs (logos) crisp and see-through
        var ctx = c.getContext("2d");
        if (!png) { ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, c.width, c.height); }
        ctx.drawImage(im, 0, 0, c.width, c.height); URL.revokeObjectURL(url);
        c.toBlob(function (b) { res(b ? { blob: b, type: b.type, name: file.name || "photo" } : null); }, png ? "image/png" : "image/jpeg", .86);
      };
      im.onerror = function () { URL.revokeObjectURL(url); res(null); };
      im.src = url;
    });
  }
  function addPictures(files) {
    var note = st.notes[active]; if (!note) return;
    var list = Array.prototype.slice.call(files || []), bad = 0, full = false, added = 0, k = 0;
    var dropB = els.note && els.note.drop && els.note.drop.querySelector("b");
    if (dropB && list.length) els.note.drop.classList.add("busy");
    return list.reduce(function (p, f) {
      return p.then(function () {
        k++; if (dropB) dropB.textContent = list.length > 1 ? "Adding photo " + k + " of " + list.length + "…" : "Adding your photo…";
        if (picCount() >= MAX_PICS) { full = true; return; }
        return shrink(f).then(function (rec) {
          if (!rec) { bad++; return; }
          var id = "p" + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
          return picPut(id, rec).then(function () {
            note.pics.push(id); added++;
            if (note.pendingIdea) { note.caps = note.caps || {}; note.caps[id] = note.pendingIdea; note.showCaps = true; delete note.pendingIdea; }
            if (els.note && st.notes[active] === note) drawThumbs(note, els.note.thumbs, true);   // each photo shows as soon as it's ready
          });
        });
      });
    }, Promise.resolve()).then(function () {
      save();
      if (els.note && st.notes[active] === note) { drawThumbs(note, els.note.thumbs, true); refreshDrop(note); placeNoteCard(); }
      else if (els.note) refreshDrop(note);
      if (full) toast("That's " + MAX_PICS + " photos, the most for one send. Send these first, then add more.");
      else if (bad) toast(bad === 1 ? "One file wasn't a photo, so it was left out." : bad + " files weren't photos, so they were left out.");
      else if (added) toast(added === 1 ? "Photo added." : added + " photos added.");
    });
  }

  /* ----- a small picture of the spot, so Stray Wolf sees exactly what they mean ----- */
  var shotLib = null;
  function loadShotLib() {
    if (window.html2canvas) return Promise.resolve(window.html2canvas);
    if (!SHOT_LIB || SHOT_LIB === "none") return Promise.reject(new Error("off"));
    return shotLib || (shotLib = new Promise(function (res, rej) {
      var s = document.createElement("script"); s.src = SHOT_LIB; s.async = true;
      s.onload = function () { window.html2canvas ? res(window.html2canvas) : rej(new Error("no lib")); };
      s.onerror = function () { shotLib = null; rej(new Error("lib failed")); };
      document.head.appendChild(s);
    }));
  }
  // About 640px wide: the element with some of the page around it, ringed, with a pin where they tapped.
  // Best effort and quiet: if anything goes wrong the note simply has no picture.
  function snapSpot(note, el) {
    var r = el.getBoundingClientRect(); if (!r.width || !r.height) return;
    var docW = document.documentElement.clientWidth, docH = document.documentElement.scrollHeight;
    var ex = r.left + window.scrollX, ey = r.top + window.scrollY;
    // always landscape (8:5), so the pictures line up in the admin
    var w = Math.min(docW, Math.max(r.width + 120, Math.min(docW, 900), (r.height + 120) * 1.6)), hgt = w / 1.6;
    var x = Math.max(0, Math.min(docW - w, ex + r.width / 2 - w / 2)), y = Math.max(0, Math.min(docH - hgt, ey + r.height / 2 - hgt / 2));
    var px = ex + r.width * (note.fx == null ? .5 : note.fx), py = ey + r.height * (note.fy == null ? .5 : note.fy);
    var keep = { left: ex - x, top: ey - y, w: r.width, h: r.height, px: px - x, py: py - y };
    var late = new Promise(function (res, rej) { setTimeout(function () { rej(new Error("slow")); }, 6000); });   // too slow = no picture
    Promise.race([late, loadShotLib().then(function (h2c) {
      return h2c(document.body, { x: x, y: y, width: w, height: hgt, scale: 1, useCORS: true, logging: false, backgroundColor: "#ffffff",
        windowWidth: docW, ignoreElements: function (n) { return n === host || n.hasAttribute && (n.hasAttribute("data-site-notes-spacer") || n.hasAttribute("data-site-notes-light")); } });
    })]).then(function (c) {
      var s = Math.min(1, 640 / c.width), out = document.createElement("canvas");
      out.width = Math.round(c.width * s); out.height = Math.round(c.height * s);
      var g = out.getContext("2d"); g.drawImage(c, 0, 0, out.width, out.height); g.scale(s, s);
      g.strokeStyle = "#c2541b"; g.lineWidth = 4 / s; g.strokeRect(keep.left - 4, keep.top - 4, keep.w + 8, keep.h + 8);
      g.beginPath(); g.arc(keep.px, keep.py, 12 / s, 0, Math.PI * 2); g.fillStyle = "rgba(194,84,27,.28)"; g.fill(); g.lineWidth = 3 / s; g.strokeStyle = "#c2541b"; g.stroke();   // see-through, so the words still show
      return new Promise(function (res) { out.toBlob(res, "image/jpeg", .72); });
    }).then(function (b) {
      if (!b || st.notes.indexOf(note) < 0) return;
      var id = "s" + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
      return picPut(id, { blob: b, type: b.type, name: "spot.jpg" }).then(function () {
        if (st.notes.indexOf(note) < 0) return picDel(id);
        if (note.shot) picDel(note.shot);
        note.shot = id; save();
      });
    }).catch(function () {});
  }

  /* ----- the review list and sending ----- */
  // A centered box over a dimmed page (a sheet from the bottom on phones). opts.focus: what to put focus
  // on first (default: the box itself, so it reads its name). opts.close: what Esc or a tap outside does.
  function veil(card, opts) {
    opts = opts || {};
    remember();
    var keep = panel; closePanels(); panel = keep;      // closing the last box mustn't forget which box this is
    if (!toastUndo) clearToast();                        // a big message replaces a small one (but keeps an Undo)
    card.setAttribute("aria-modal", "true"); card.setAttribute("tabindex", "-1");
    els.veilClose = opts.close || function () { closePanels(); render(); };
    els.veil = h("div", { class: "veil", onclick: function (e) { if (e.target === els.veil && !busy) els.veilClose(); } }, [card]);
    layer.appendChild(els.veil);
    still();
    try { (opts.focus || card).focus({ preventScroll: true }); } catch (x) {}
    return card;
  }
  function openReview(errText) {
    panel = "review";
    var n = st.notes.length, pics = picCount();
    var list = h("ul", { class: "list" });
    st.notes.forEach(function (note, i) {
      var here = note.page === location.pathname || !note.path;
      var th = h("div", { class: "thumbs small" }); drawThumbs(note, th, false);
      list.appendChild(h("li", { class: "item" }, [
        h("span", { class: "num", text: String(i + 1) }),
        h("div", { style: "min-width:0;display:grid;gap:4px" }, [
          // a short, plain "where": the box on their portal, or just the page on the website (the exact spot still goes to Stray Wolf)
          h("div", { class: "w", text: note.hub ? note.on : (note.title || "Home") + " page" }),
          h("div", { class: "s" + (note.text ? "" : " empty"), text: note.text || "(photos only)" }),
          note.pics.length ? th : null,
          h("div", { class: "acts" }, [
            here ? h("button", { class: "b quiet", type: "button", onclick: function () { openNote(i); } }, [icon("pencil"), h("span", { text: "Change" })])
                 : h("button", { class: "b quiet", type: "button", onclick: function () { if (!note.hub) lsSet("on", "1"); location.href = note.page; } }, [icon("arrow"), h("span", { text: note.hub ? "Go to your portal" : "Go to that page" })]),
            h("button", { class: "b danger", type: "button", onclick: function () { removeNote(i, true); } }, [icon("trash"), h("span", { text: "Delete" })])
          ])
        ])
      ]));
    });
    var progress = h("div", { class: "bar", hidden: true }, [h("i")]);
    var err = h("p", { class: "err", hidden: !errText, role: "alert" });
    if (errText) err.append.apply(err, [].concat(errText));
    var sendBtn = h("button", { class: "b go", type: "button", onclick: function () { send(sendBtn, progress, err); } }, [icon("send"), h("span", { text: "Send to " + TO })]);
    veil(h("div", { class: "card", role: "dialog", "aria-label": "Ready to send" }, [
      h("div", { class: "hd" }, [
        h("div", { class: "grow" }, [h("h2", { text: "Ready to send?" }), h("p", { text: plural(n, "note") + (pics ? " and " + plural(pics, "photo") : "") + ". Check them over, then tap Send." })]),
        h("button", { class: "xbtn", type: "button", "aria-label": "Close", onclick: function () { if (!busy) backFromReview(); } }, [icon("x")])
      ]),
      h("div", { class: "bd" }, [list, h("div", { class: "calm" }, [icon("check"), h("span", { text: "Your website stays exactly as it is until " + TO + " makes the change." })])]),
      h("div", { class: "ft", style: "flex-direction:column;align-items:stretch" }, [progress, err,
        h("div", { style: "display:flex;gap:10px;flex-wrap:wrap" }, [
          h("button", { class: "b plain", type: "button", text: reviewFrom === "photos" ? "Keep adding photos" : "Keep adding notes", onclick: function () { if (!busy) backFromReview(); } }),
          h("span", { class: "push" }), sendBtn])])
    ]), { close: backFromReview });
    els.dock.hidden = isPhone();
  }

  function send(btn, progress, err) {
    if (busy || !st.notes.length) return;
    busy = true; btn.disabled = true; err.hidden = true;
    var token = getToken(), total = picCount(), doneN = 0, label = btn.lastChild;
    var bar = progress.firstChild;
    var step = function (t, frac) { label.textContent = t; if (total) { progress.hidden = false; bar.style.width = Math.round(frac * 100) + "%"; } };
    var failWith = function (d) {
      busy = false; btn.disabled = false; label.textContent = "Try again"; progress.hidden = true;
      err.textContent = "";
      if (d.status === 401) {
        setToken(null);
        err.append("Your login timed out. Your notes are safe on this device. ", h("a", { href: LOGIN_URL, text: "Log in again" }), " and then tap Send.");
      } else err.textContent = (d.status === 0 ? "Your internet seems to be off." : "That didn't go through.") + " Your notes are safe on this device. Tap Try again in a minute.";
      err.hidden = false;
    };
    if (!token && !DEMO) { failWith({ status: 401 }); return; }
    step(total ? "Sending photo 1 of " + total + "…" : "Sending…", 0.02);
    var ids = []; st.notes.forEach(function (n) { n.pics.forEach(function (id) { ids.push(id); }); });
    var keys = {};
    ids.reduce(function (p, id) {
      return p.then(function (stop) {
        if (stop) return stop;
        return picGet(id).then(function (rec) {
          if (!rec) return null;                                   // photo lost from this device: skip it
          var next = function () { doneN++; step(doneN < total ? "Sending photo " + (doneN + 1) + " of " + total + "…" : "Sending notes…", doneN / (total + 1)); };
          if (rec.key) { keys[id] = rec.key; next(); return null; }
          var up = DEMO ? new Promise(function (r) { setTimeout(function () { r({ ok: true, key: "pic:demo:" + id }); }, 350); })
                        : api("/api/pic", { token: token, raw: rec.blob, type: rec.type });
          return up.then(function (d) {
            if (!d.ok) return d;
            rec.key = d.key; keys[id] = d.key; next();
            return picPut(id, rec).then(function () { return null; });
          });
        });
      });
    }, Promise.resolve(null)).then(function (stop) {
      if (stop) return failWith(stop);
      step("Sending notes…", total / (total + 1));
      // the pictures of the spots: best effort, a failed one just leaves that note without a picture
      return st.notes.reduce(function (p, n) {
        return p.then(function () {
          if (!n.shot) return;
          return picGet(n.shot).then(function (rec) {
            if (!rec) return;
            if (rec.key) { keys[n.shot] = rec.key; return; }
            var up = DEMO ? Promise.resolve({ ok: true, key: "pic:demo:" + n.shot }) : api("/api/pic", { token: token, raw: rec.blob, type: rec.type });
            return up.then(function (d) { if (d && d.ok) { rec.key = d.key; keys[n.shot] = d.key; return picPut(n.shot, rec); } });
          }).catch(function () {});
        });
      }, Promise.resolve()).then(function () { return null; });
    }).then(function (stop) {
      if (stop) return failWith(stop);
      var body = { notes: st.notes.map(function (n) {
        var sent = n.pics.filter(function (id) { return keys[id]; }), caps = n.caps || {};
        var said = sent.map(function (id) { return caps[id] || ""; });
        var lines = said.map(function (c, k) { return c ? "Photo " + (k + 1) + ": " + c : ""; }).filter(Boolean);
        return { page: n.page, title: n.title, on: n.on,
                 text: n.text + (lines.length ? (n.text ? "\n\n" : "") + lines.join("\n") : ""),
                 pics: sent.map(function (id) { return keys[id]; }),
                 picNotes: lines.length ? said : undefined,         // same order as pics; "" = no words
                 // where it was left, for "Show me on the site" in the admin
                 url: n.url || location.origin + n.page, path: n.hub || !n.path ? undefined : n.path.slice(0, 40),
                 sel: n.hub ? undefined : n.sel, fx: n.fx, fy: n.fy, py: n.py, snip: n.snip, vw: n.vw,
                 shot: n.shot && keys[n.shot] || undefined };      // a small picture of the spot (a pic key, like pics)
      }) };
      var go = DEMO ? new Promise(function (r) { setTimeout(function () { r({ ok: true }); }, 600); }) : api("/api/notes", { token: token, body: body });
      return go.then(function (d) {
        if (!d.ok) return failWith(d);
        busy = false;
        st.sent = true; st.sentNotes = body.notes.length; st.sentPics = total; save();
        heads_up(body.notes.length, total);
        showSent();
      });
    });
  }
  function showSent() {
    panel = "sent";
    var done = function () {
      if (MODE !== "hub") { closePanels(); render(); return; }
      var back = reviewFrom === "photos"; reviewFrom = null; newList(true);
      if (back) openPhotos();                       // back to the Photos page, where the new ones now show as sent
    };
    var doneBtn = h("button", { class: "b main wide", type: "button", text: "Done", onclick: done });
    veil(h("div", { class: "card", role: "dialog", "aria-label": "Sent" }, [
      h("div", { class: "bd center", style: "padding-top:26px;gap:8px" }, [
        h("div", { class: "done-ic pop" }, [icon("check")]),
        h("h2", { text: "Sent!" }),
        h("p", { text: TO + " has your " + (st.sentNotes === 1 ? "note" : plural(st.sentNotes, "note")) + (st.sentPics ? " and " + plural(st.sentPics, "photo") : "") + "." }),
        h("p", { text: "You'll hear back soon. Nothing on your website changes until " + TO + " makes the update." })
      ]),
      h("div", { class: "ft" }, [doneBtn])
    ]), { focus: doneBtn, close: done });
    render();
  }
  function newList(quietly) {
    st.notes.forEach(function (n) { n.pics.forEach(picDel); if (n.shot) picDel(n.shot); });
    st.notes = []; st.sent = false; st.sentNotes = st.sentPics = 0; save(); closePanels(); render();
    if (!quietly) toast("Ready for new notes.");
  }
  // A plain email saying "new notes came in". Best effort; the notes are already safely stored.
  function heads_up(notes, pictures) {
    if (!ALERT_KEY || DEMO) return;
    try {
      fetch("https://api.web3forms.com/submit", { method: "POST", headers: { "content-type": "application/json", accept: "application/json" },
        body: JSON.stringify({ access_key: ALERT_KEY, subject: "New site notes: " + SITE, from_name: "Site Notes",
          message: plural(notes, "note") + " and " + plural(pictures, "photo") + " just came in from " + SITE + " (" + location.hostname + "). Open your admin page to see them." }) }).catch(function () {});
    } catch (e) {}
  }

  /* ----- help, and turning notes off ----- */
  function showHelp(first) {
    panel = "help";
    var gotIt = h("button", { class: "b main wide", type: "button", text: first ? "Got it. Let's start." : "Got it", onclick: function () { st[MODE === "edit" ? "intro" : "introHub"] = true; save(); tuckAway(this.closest(".card")); } });
    var step = function (n, ic, title, text) { return h("li", {}, [h("div", { class: "circ" }, [icon(ic), h("i", { text: String(n) })]), h("div", {}, [h("b", { text: title }), h("span", { text: text })])]); };
    veil(h("div", { class: "card help", role: "dialog", "aria-label": "How this works" }, [
      h("div", { class: "hd" }, [
        h("div", { class: "grow" }, [h("h2", { text: first ? (MODE === "edit" ? "You're in Edit mode. Here's how it works." : "Welcome! Here's how it works.") : "How this works" }), h("p", { text: MODE === "edit" ? "Leave notes for " + TO + " right on your own website." : "This is your Client Portal for sending " + TO + " what you need." })]),
        h("button", { class: "xbtn", type: "button", "aria-label": "Close", onclick: function () { closePanels(); render(); } }, [icon("x")])
      ]),
      h("div", { class: "bd" }, [
        MODE === "edit" ? h("ol", { class: "steps" }, [
          step(1, "note", "Tap “Add a note”", "It's the orange button at the bottom of the screen."),
          step(2, "tap", "Tap the part you want changed", "A price, a sentence, a picture. Anything."),
          step(3, "pencil", "Say what you'd like", "Type it in your own words. Add photos if you have them."),
          step(4, "send", "Tap “Send to " + TO + "”", "Do this once you've added all your notes.")
        ]) : h("ol", { class: "steps" }, [
          step(1, "tap", "Tap a box", "Each box is one thing " + TO + " needs, like your logo or photos."),
          step(2, "photo", "Type it, or add photos", "Then tap Save note."),
          step(3, "pencil", "Want something changed on your website?", "Tap Edit mode. You'll go to your website and can tap the part you mean."),
          step(4, "send", "Tap “Send to " + TO + "”", "Do this once you're done.")
        ]),
        h("div", { class: "calm" }, [icon("check"), h("span", { text: "You can't break anything. Your website stays exactly as it is until " + TO + " makes the change." })])
      ]),
      h("div", { class: "ft" }, [gotIt])
    ]), { focus: gotIt });
    els.dock.hidden = isPhone();
  }
  // "Got it": the steps shrink down into the bar at the bottom ("Edit mode is on" / "You're logged in"),
  // so it's clear where they went and that the mode is still on. Help in that bar brings them back.
  // A photo, big. Close with the button, Esc or a tap outside; arrows step through.
  // items: [{ src, title, cap }]. swap (optional): "Swap this one", given the photo shown.
  function lightbox(items, at, swap) {
    var from = els.lb ? els.lbFrom : root.activeElement || document.activeElement;
    if (!panel && !els.veil) remember();
    closeLb(true); els.lbFrom = from;
    if (!items.length) return;
    var pic = h("img", { alt: "" }), cap = h("p", { class: "cap" }), title = h("h2", {});
    var show = function (i) {
      at = (i + items.length) % items.length; var it = items[at];
      pic.src = it.src; pic.alt = it.title || "";
      title.textContent = it.title || "Photo";
      cap.textContent = (items.length > 1 ? "Photo " + (at + 1) + " of " + items.length + (it.cap ? " · " : "") : "") + (it.cap || "");
    };
    var nav = items.length > 1 ? [h("button", { class: "nav l", type: "button", "aria-label": "Previous photo", onclick: function () { show(at - 1); } }, [icon("arrow")]),
                                  h("button", { class: "nav r", type: "button", "aria-label": "Next photo", onclick: function () { show(at + 1); } }, [icon("arrow")])] : [];
    var card = h("div", { class: "card photo", role: "dialog", "aria-modal": "true", "aria-label": "Photo" }, [
      h("div", { class: "hd" }, [h("div", { class: "grow" }, [title]), h("button", { class: "xbtn", type: "button", "aria-label": "Close", onclick: closeLb }, [icon("x")])]),
      h("div", { class: "bd" }, [h("div", { class: "shot" }, [pic].concat(nav)), cap]),
      h("div", { class: "ft" }, [
        swap ? h("button", { class: "b plain", type: "button", onclick: function () { var it = items[at]; closeLb(); swap(it); } }, [icon("photo"), h("span", { text: "Swap this one" })]) : null,
        h("button", { class: "b main push", type: "button", text: "Close", onclick: closeLb })
      ])
    ]);
    card.addEventListener("keydown", function (e) { if (e.key === "ArrowLeft") show(at - 1); if (e.key === "ArrowRight") show(at + 1); });
    els.lb = h("div", { class: "veil lb", onclick: function (e) { if (e.target === els.lb) closeLb(); } }, [card]);
    layer.appendChild(els.lb); still();
    show(at);
    try { card.querySelector(".b.main").focus({ preventScroll: true }); } catch (x) {}
  }
  // Over the Photos page, closing the photo puts focus back on the photo they tapped.
  function closeLb(quiet) {
    if (!els.lb) return;
    els.lb.remove(); els.lb = null; still();
    var from = els.lbFrom; els.lbFrom = null;
    if (quiet) return;
    if (panel && from && from.isConnected) { try { from.focus({ preventScroll: true }); } catch (x) {} }
    else giveBack();
  }

  // One of their site's photos on a box (data-big), big.
  function showPhoto(img) {
    var all = Array.prototype.slice.call(document.querySelectorAll("[data-big]"));
    var box = img.closest("[data-note-box]");
    lightbox(all.map(function (it) { return { src: it.getAttribute("data-big"), title: it.alt || "On your site now", cap: "on your website now" }; }), Math.max(0, all.indexOf(img)),
      box ? function (it) {
        if (box === photosBox()) { openPhotos(); askSwap(it.title); return; }
        addNote(box, box.getAttribute("data-area") || null);
        var t = els.note && els.note.text; if (t) { t.value = "Please swap this photo: " + it.title + ". "; try { t.focus(); t.setSelectionRange(t.value.length, t.value.length); } catch (x) {} }
      } : null);
  }

  /* ----- the Photos page ----- */
  // Opened by the Photos box (data-photos-page) or <portal>#photos. Three parts: add new photos
  // (one note, sent like any other), every photo they've sent with "On your site" / "Not on your
  // site yet", and the photos on their site now. Back (or the browser's Back) returns to the portal;
  // photos they added stay saved on this device until they send them.
  var reviewFrom = null;
  function photosBox() { return MODE === "hub" ? document.querySelector("[data-photos-page]") : null; }
  function sitePhotos() {
    var tpl = document.querySelector("template[data-site-photos]");
    var imgs = tpl && tpl.content ? tpl.content.querySelectorAll("img") : [];
    var list = Array.prototype.map.call(imgs, function (im) {
      return { thumb: im.getAttribute("src"), src: im.getAttribute("data-big") || im.getAttribute("src"), title: im.getAttribute("alt") || "",
               on: (im.getAttribute("data-on") || "").split("|").filter(Boolean) };
    });
    if (!list.length) list = Array.prototype.map.call(document.querySelectorAll("[data-photos-page] [data-big]"), function (im) {   // no list: the ones on the box
      return { thumb: im.getAttribute("src"), src: im.getAttribute("data-big"), title: im.alt || "", on: [] };
    });
    return { list: list, more: tpl && tpl.getAttribute("data-more"), moreUrl: tpl && tpl.getAttribute("data-more-url") };
  }
  function openPhotos(fromHistory) {
    var box = photosBox(); if (!box || busy) return;
    remember(); closePanels();
    var i = -1; st.notes.forEach(function (n, k) { if (n.pg) i = k; });
    if (i < 0) { var made = makeNote(box, box.getAttribute("data-area") || "Photos"); made.pg = true; made.photos = true; st.notes.push(made); save(); i = st.notes.length - 1; }
    active = i; panel = "photos";
    var note = st.notes[i], phone = isPhone();
    if (!fromHistory && location.hash !== "#photos") { try { history.pushState({ swnPhotos: 1 }, "", "#photos"); } catch (x) {} }

    // 1. new photos
    var thumbs = h("div", { class: "thumbs" });
    var drop = h("button", { class: "add-ph big", type: "button", onclick: function () { els.file.click(); } }, [
      icon("photo"), h("div", {}, [h("b", { text: dropTitle(note, phone) }), h("span", { text: phone ? "From your photos, or take a new one" : "Click to choose, or drag them here from your computer" })])]);
    var text = h("textarea", { id: "swn-text", placeholder: "Anything else about these photos? (optional)", oninput: function () { note.text = this.value.trim(); save(); } });
    text.value = note.text || ""; text.style.minHeight = "70px";
    text.addEventListener("paste", function (e) { var f = e.clipboardData && e.clipboardData.files; if (f && f.length) { e.preventDefault(); addPictures(f); } });
    var sendBtn = h("button", { class: "b go", type: "button", onclick: function () {
      note.text = text.value.trim(); save();
      if (!note.pics.length && !note.text) { toast("Add a photo first. Then you can send it."); return; }
      reviewFrom = "photos"; closePanels(); openReview();
    } }, [icon("send"), h("span", { text: "Send to " + TO })]);
    var addSec = h("section", { class: "pg-sec add", "aria-label": "Send new photos" }, [
      h("div", { class: "pg-hd" }, [h("h2", { text: "Send new photos" })]),
      drop, thumbs, text, h("div", { class: "pg-act" }, [sendBtn])]);

    // 2. what they've sent, and which of those are on the site
    var sentSum = h("p", { class: "pg-sub", text: "Loading…" }), sentGrid = h("div", { class: "pg-grid", hidden: true }), sentNone = h("p", { class: "pg-none", hidden: true });
    var sentSec = h("section", { class: "pg-sec sent", "aria-label": "Photos you sent" }, [h("div", { class: "pg-hd" }, [h("h2", { text: "Photos you sent" }), sentSum]), sentGrid, sentNone]);

    // 3. on the site now
    var site = sitePhotos(), siteSec = null;
    if (site.list.length) {
      var siteItems = site.list.map(function (p) { return { src: p.src, title: p.title || "On your site", cap: p.on.length ? p.on.join(", ") : "on your website now" }; });
      siteSec = h("section", { class: "pg-sec site", "aria-label": "On your site now" }, [
        h("div", { class: "pg-hd" }, [h("h2", { text: "On your site now" }), h("p", { class: "pg-sub", text: plural(site.list.length, "photo") + ". Tap one to see it bigger." })]),
        h("div", { class: "pg-grid" }, site.list.map(function (p, k) {
          return h("button", { class: "pg-ph", type: "button", "aria-label": (p.title || "Photo " + (k + 1)) + ". See it bigger.", onclick: function () { lightbox(siteItems, k, function (it) { askSwap(it.title); }); } }, [
            h("span", { class: "im" }, [h("img", { src: p.thumb, alt: "", loading: "lazy", decoding: "async" })]),
            h("span", { class: "tag on" }, [icon("check"), h("span", { text: "On your site" })]),
            p.on.length ? h("span", { class: "dt", text: p.on.join(", ") }) : null]);
        })),
        site.more ? h("p", { class: "pg-more" }, [site.more + " ", site.moreUrl ? h("a", { href: site.moreUrl, target: "_blank", rel: "noopener", text: "See them" }) : null]) : null]);
    }

    var page = h("div", { class: "pg note photos", role: "dialog", "aria-modal": "true", "aria-label": "Your photos" }, [
      h("div", { class: "dropcover", "aria-hidden": "true" }, [icon("photo"), h("b", { text: "Drop your photos here" })]),
      h("div", { class: "pg-top" }, [h("div", { class: "pg-top-in" }, [
        h("button", { class: "pg-back", type: "button", onclick: backFromPhotos }, [icon("arrow"), h("span", { text: phone ? "Back" : "Back to your portal" })]),
        h("h1", { text: "Your photos" })])]),
      h("div", { class: "pg-in" }, [addSec, sentSec, siteSec])
    ]);
    var depth = 0, hasFiles = function (e) { var t = e.dataTransfer && e.dataTransfer.types; return t && Array.prototype.indexOf.call(t, "Files") >= 0; };
    page.addEventListener("dragenter", function (e) { if (!hasFiles(e)) return; e.preventDefault(); depth++; page.classList.add("dropping"); });
    page.addEventListener("dragover", function (e) { if (!hasFiles(e)) return; e.preventDefault(); e.dataTransfer.dropEffect = "copy"; });
    page.addEventListener("dragleave", function () { if (--depth <= 0) { depth = 0; page.classList.remove("dropping"); } });
    page.addEventListener("drop", function (e) { if (!hasFiles(e)) return; e.preventDefault(); e.stopPropagation(); depth = 0; page.classList.remove("dropping"); addPictures(e.dataTransfer.files); });

    els.note = { card: page, text: text, thumbs: thumbs, drop: drop, fields: [], page: true };
    layer.appendChild(page);
    els.dock.hidden = true;
    els.scrollWas = document.documentElement.style.overflow; document.documentElement.style.overflow = "hidden";
    drawThumbs(note, thumbs, true);
    render(); still();
    loadSent(sentGrid, sentSum, sentNone);
    try { page.querySelector(".pg-back").focus({ preventScroll: true }); } catch (x) {}
  }
  // Leaving the page (Back, Esc, or Send): an empty photos note is dropped, the rest stays saved.
  function leavePhotos() {
    var note = st.notes[active];
    if (note && els.note && els.note.page) note.text = els.note.text.value.trim();
    if (note && note.pg && !note.text && !note.pics.length) { st.notes.splice(active, 1); }
    save();
    document.documentElement.style.overflow = els.scrollWas || "";
    if (location.hash === "#photos") { try { history.replaceState(null, "", location.pathname + location.search); } catch (x) {} }
  }
  function backFromPhotos() {
    var note = st.notes[active];
    if (note && note.pics.length) closedToast = "Your photos are saved. Tap Send when you're ready.";
    if (history.state && history.state.swnPhotos && location.hash === "#photos") { history.back(); return; }   // the browser's Back closes it
    photosClosed();
  }
  var closedToast = "";
  function photosClosed() { closePanels(); render(); if (closedToast) toast(closedToast); closedToast = ""; }
  function backFromReview() {
    var back = reviewFrom === "photos" && MODE === "hub"; reviewFrom = null;
    closePanels(); render();
    if (back) openPhotos();
  }
  // "Swap this one" on a photo of their site: the words go in the new photos' box, ready to add a photo.
  function askSwap(which) {
    var t = els.note && els.note.page && els.note.text; if (!t) return;
    var line = "Please swap this photo: " + which + ".";
    t.value = (t.value.trim() ? t.value.trim() + "\n" : "") + line + " ";
    var note = st.notes[active]; if (note) { note.text = t.value.trim(); save(); }
    try { t.scrollIntoView({ block: "center", behavior: reduceMotion ? "auto" : "smooth" }); t.focus({ preventScroll: true }); t.setSelectionRange(t.value.length, t.value.length); } catch (x) {}
    toast("Now add the new photo, then tap Send.");
  }

  // Their sent photos come from the notes service, newest first, with "used" set by Stray Wolf.
  var sentUrls = {}, imgQ = [], imgBusy = 0;
  function loadSent(grid, sum, none) {
    var got = DEMO ? new Promise(function (r) { setTimeout(function () { r(demoSent()); }, 350); }) : api("/api/my-photos", { token: getToken() });
    got.then(function (d) {
      if (!grid.isConnected) return;
      var list = d && d.ok && Array.isArray(d.photos) ? d.photos : null;
      if (!list) {
        sum.textContent = "";
        none.hidden = false; none.textContent = d && d.status === 401 ? "Your login timed out. Log in again to see them." : "They can't be shown right now. Try again later.";
        return;
      }
      if (!list.length) { sum.textContent = ""; none.hidden = false; none.textContent = "Nothing yet. Photos you send show up here."; return; }
      var on = list.filter(function (p) { return p.used; }).length;
      sum.textContent = plural(list.length, "photo") + ". " + (on ? on + " on your site." : "None on your site yet.");
      var items = list.map(function (p) { return { key: p.key, src: "", title: p.caption || "A photo you sent", cap: (p.at ? "Sent " + dayWord(p.at) + " · " : "") + (p.used ? "On your site" : "Not on your site yet") }; });
      grid.hidden = false; grid.textContent = "";
      list.forEach(function (p, k) {
        var img = h("img", { alt: "", decoding: "async" }), im = h("span", { class: "im" }, [img]);
        grid.appendChild(h("button", { class: "pg-ph", type: "button", "aria-label": (p.caption || "Photo " + (k + 1)) + ". " + items[k].cap + ". See it bigger.", onclick: function () {
          sentImg(items[k].key).then(function (u) {
            items[k].src = u;
            var shown = items.filter(function (it) { return it.src; });
            if (u) lightbox(shown, Math.max(0, shown.indexOf(items[k])));
          });
        } }, [
          im,
          p.used ? h("span", { class: "tag on" }, [icon("check"), h("span", { text: "On your site" })]) : h("span", { class: "tag off", text: "Not on your site yet" }),
          p.caption ? h("span", { class: "cp", text: p.caption }) : null,
          p.at ? h("span", { class: "dt", text: "Sent " + dayWord(p.at) }) : null]));
        imgQ.push([p.key, img, im, items[k]]);
      });
      pumpImgs();
    });
  }
  function pumpImgs() {
    while (imgBusy < 4 && imgQ.length) {
      var j = imgQ.shift(); imgBusy++;
      (function (img, im, it) {
        sentImg(j[0]).then(function (u) { imgBusy--; it.src = u; if (u) img.src = u; else im.classList.add("gone"); pumpImgs(); });
      })(j[1], j[2], j[3]);
    }
  }
  function sentImg(key) {
    if (!key) return Promise.resolve("");
    if (sentUrls[key]) return sentUrls[key];
    var p = DEMO ? Promise.resolve(demoPic(key))
      : fetch(API + "/api/my-photo", { method: "POST", headers: { authorization: "Bearer " + getToken() }, body: JSON.stringify({ key: key }) })
          .then(function (r) { return r.ok ? r.blob() : null; })
          .then(function (b) { return b && b.size && !/json|text/.test(b.type || "") ? URL.createObjectURL(b) : ""; }, function () { return ""; });
    sentUrls[key] = p;
    p.then(function (u) { if (!u) delete sentUrls[key]; });
    return p;
  }
  function dayWord(at) {
    var d = new Date(typeof at === "number" ? at : Date.parse(at)); if (isNaN(d)) return "";
    var o = { month: "short", day: "numeric" }; if (d.getFullYear() !== new Date().getFullYear()) o.year = "numeric";
    try { return d.toLocaleDateString(undefined, o); } catch (x) { return d.toDateString(); }
  }
  // Demo only: a few made-up photos so the page can be tried without the notes service.
  function demoSent() {
    var day = 864e5, now = Date.now();
    return { ok: true, photos: [
      { key: "demo1", at: now - day, caption: "The new sign out front", used: false },
      { key: "demo2", at: now - 3 * day, caption: "", used: false },
      { key: "demo3", at: now - 9 * day, caption: "Our crew this spring", used: true },
      { key: "demo4", at: now - 9 * day, caption: "Before and after", used: true },
      { key: "demo5", at: now - 20 * day, caption: "", used: false } ] };
  }
  function demoPic(key) {
    var c = document.createElement("canvas"); c.width = 640; c.height = 480;
    var g = c.getContext("2d"), hue = (key.charCodeAt(key.length - 1) * 67) % 360;
    var gr = g.createLinearGradient(0, 0, 640, 480); gr.addColorStop(0, "hsl(" + hue + ",35%,62%)"); gr.addColorStop(1, "hsl(" + (hue + 40) + ",30%,38%)");
    g.fillStyle = gr; g.fillRect(0, 0, 640, 480);
    g.fillStyle = "rgba(255,255,255,.85)"; g.font = "bold 34px system-ui,sans-serif"; g.textAlign = "center"; g.fillText("Sample photo", 320, 250);
    return c.toDataURL("image/jpeg", .8);
  }

  // A few headline numbers from Google Analytics for their page ([data-stats]). The notes service
  // asks GA4 and sends them back; with no numbers (or an older service) the card just stays hidden.
  // Same words as the admin's Analytics tab (admin-cockpit/analytics-wording.md), so client and Jeremy match.
  var MON = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  function shortDate(d) { return MON[d.getUTCMonth()] + " " + d.getUTCDate(); }
  function loadStats() {
    var box = document.querySelector("[data-stats]"); if (!box) return;
    var got = DEMO ? Promise.resolve({ ok: true, sample: true, days: 28, visitors: 109, visitorsPrev: 91, visitorsChange: 20, calls: 8, callsPrev: 4, callsChange: 100,
                                       leads: 3, leadsPrev: 0, leadsChange: 0, source: "Google", daily: { start: new Date(Date.now() - 28 * 864e5).toISOString().slice(0, 10) } })
                   : api("/api/stats", { token: getToken(), body: { site: SITE } });
    got.then(function (d) {
      if (!d || !d.ok || d.visitors == null) return;
      var n = function (v) { return (Number(v) || 0).toLocaleString("en-US"); };
      // say the period in plain words: 28 days = "4 weeks"
      var days = d.days || 28, span = days % 7 === 0 ? (days / 7) + " weeks" : days + " days";
      // no-break spaces keep "the 4 weeks before" together when the line wraps
      var before = ("the " + span + " before").replace(/ /g, "\u00a0");
      // ▲ 4 more than the 4 weeks before / ▼ 3 fewer than the 4 weeks before / Same as the 4 weeks before / None in the 4 weeks before
      var change = function (now, prev, pct) {
        if (typeof prev === "number") {
          if (prev === 0) return now ? { t: "None in " + before } : { t: "Same as " + before };
          var diff = now - prev;
          return diff > 0 ? { t: "▲ " + n(diff) + " more than " + before, c: "up" } : diff < 0 ? { t: "▼ " + n(-diff) + " fewer than " + before, c: "down" } : { t: "Same as " + before };
        }
        if (typeof pct === "number" && pct !== 0) return pct > 0 ? { t: "▲ " + pct + "% more than " + before, c: "up" } : { t: "▼ " + -pct + "% fewer than " + before, c: "down" };
        return null;
      };
      // nothing at all from the 4 weeks before (tracking is new): say it once in the footnote, not under every number
      var fresh = [d.visitorsPrev, d.callsPrev, d.leadsPrev].every(function (p) { return p === 0; });
      var put = function (k, now, prev, pct) {
        var el = box.querySelector('[data-stat="' + k + '"]'); if (!el) return;
        el.textContent = n(now);
        var ch = fresh ? null : change(Number(now) || 0, prev, pct); if (!ch) return;
        var slot = box.querySelector('[data-chg="' + k + '"]');
        if (slot) { slot.textContent = ch.t; slot.className = ch.c || ""; }
        else el.appendChild(h("small", { class: ch.c || "", text: ch.t }));
      };
      put("visitors", d.visitors, d.visitorsPrev, d.visitorsChange);
      put("calls", d.calls, d.callsPrev, d.callsChange);
      put("leads", d.leads, d.leadsPrev, d.leadsChange);
      // the period, with real dates when the service sends the daily numbers
      var r = box.querySelector('[data-stat="range"]');
      if (r) {
        var t = "Last " + span;
        if (d.daily && d.daily.start) { var s0 = new Date(d.daily.start + "T00:00:00Z"); if (!isNaN(s0)) t += " · " + shortDate(s0) + " – " + shortDate(new Date(s0.getTime() + (days - 1) * 864e5)); }
        r.textContent = t;
      }
      // one short line above the numbers: "109 people visited. 11 reached out."
      var sum = box.querySelector('[data-stat="summary"]');
      if (sum) {
        var out = (Number(d.calls) || 0) + (Number(d.leads) || 0), v = Number(d.visitors) || 0;
        sum.textContent = "";
        sum.append(h("b", { text: n(v) + (v === 1 ? " person" : " people") }), " visited. ");
        if (out) sum.append(h("b", { class: "out", text: n(out) + " reached out." }));
        else sum.append("Nobody reached out yet.");
      }
      var src = box.querySelector('[data-stat="note"]');
      if (fresh && src && !/compare/.test(src.textContent)) src.textContent += " · Nothing earlier to compare yet";
      if (d.sample) { var note = box.querySelector(".stats-f"); if (note && !note.querySelector(".sample")) note.appendChild(h("span", { class: "sample", text: "Sample" })); }
      box.hidden = false;
    });
  }

  // Photos dragged from the computer straight onto a box on their page: the box lights up
  // ("Drop photos here"), and letting go opens that box's note with the photos already in it.
  // A drop anywhere else never makes the browser leave the page.
  function dropOnBoxes() {
    var lit = null, files = function (e) { var t = e.dataTransfer && e.dataTransfer.types; return t && Array.prototype.indexOf.call(t, "Files") >= 0; };
    var light = function (box) { if (lit === box) return; if (lit) lit.classList.remove("swn-drop"); lit = box; if (box) box.classList.add("swn-drop"); };
    var boxAt = function (e) { return !st.sent && !els.note && !els.veil && e.target.closest ? e.target.closest("[data-note-box]") : null; };
    document.addEventListener("dragover", function (e) { if (!files(e)) return; e.preventDefault(); var b = boxAt(e); e.dataTransfer.dropEffect = b || els.note ? "copy" : "none"; light(b); });
    document.addEventListener("dragleave", function (e) { if (!e.relatedTarget) light(null); });
    document.addEventListener("drop", function (e) {
      if (!files(e)) return; e.preventDefault();
      var b = boxAt(e), list = e.dataTransfer.files; light(null);
      if (b && b.hasAttribute("data-photos-page")) { openPhotos(); addPictures(list); }
      else if (b) { addNote(b, b.getAttribute("data-area") || null); addPictures(list); }
      else if (els.note) addPictures(list);
    });
  }

  function tuckAway(card) {
    var to = els.stripLbl, v = els.veil;
    var finish = function () {
      closePanels(); render();
      if (to && to.animate && !reduceMotion) to.animate([{ transform: "scale(1)" }, { transform: "scale(1.12)", offset: .35 }, { transform: "scale(1)" }], { duration: 650, easing: "ease-out" });
    };
    if (!card || !card.animate || reduceMotion || !to) return finish();
    if (els.dock) els.dock.hidden = false;             // the bar has to be on screen to shrink into it
    var a = card.getBoundingClientRect(), b = to.getBoundingClientRect();
    if (!b.width) return finish();
    var dx = (b.left + b.width / 2) - (a.left + a.width / 2), dy = (b.top + b.height / 2) - (a.top + a.height / 2);
    card.style.pointerEvents = "none";
    if (v) v.animate([{ backgroundColor: "rgba(24,22,20,.55)" }, { backgroundColor: "rgba(24,22,20,0)" }], { duration: 520, easing: "ease-in", fill: "forwards" });
    card.animate([{ transform: "none", opacity: 1, borderRadius: "18px" },
                  { transform: "translate(" + dx + "px," + dy + "px) scale(.06)", opacity: .2, borderRadius: "60px" }],
                 { duration: 520, easing: "cubic-bezier(.5,0,.75,0)", fill: "forwards" }).onfinish = finish;
  }
  function goEdit(url) {
    if (!url || url === "soon") { toast("Your mockup isn't ready yet. " + TO + " will let you know when it is."); return; }
    lsSet("on", "1"); location.href = url;
  }
  function exitEdit() {                       // back to their own page; notes stay saved
    lsSet("on", null); location.href = LOGIN_URL;
  }
  function askLogOut() {
    panel = "off";
    var n = st.sent ? 0 : st.notes.length;
    var stay = h("button", { class: "b plain", type: "button", text: "Stay logged in", onclick: function () { closePanels(); render(); } });
    veil(h("div", { class: "card", role: "dialog", "aria-label": "Log out" }, [
      h("div", { class: "hd" }, [h("div", { class: "grow" }, [h("h2", { text: "Log out?" }),
        h("p", { text: (n ? "Your " + plural(n, "note") + " will stay saved on this device. " : "") + "To come back, open this page again and type your password." })])]),
      h("div", { class: "ft" }, [
        stay,
        h("button", { class: "b main push", type: "button", onclick: function () { endSession(); location.reload(); } }, [icon("power"), h("span", { text: "Log out" })])
      ])
    ]), { focus: stay });
  }

  /* =========================================================== start */

  function start() {
    els.file = h("input", { type: "file", accept: "image/*", multiple: true, hidden: true, onchange: function () { addPictures(els.file.files); els.file.value = ""; } });
    els.pins = h("div");
    els.hl = h("div", { class: "hl", hidden: true }, [h("span", { text: "Tap here" })]);
    els.frame = h("div", { class: "frame", "aria-hidden": "true", hidden: MODE !== "edit" });
    var helpBtn = h("button", { type: "button", onclick: function () { showHelp(false); } }, [icon("help"), h("span", { text: "Help" })]);
    var strip = MODE === "edit"
      ? h("div", { class: "strip" }, [h("div", { class: "strip-in" }, [
          els.stripLbl = h("span", { class: "lbl" }, [h("span", { class: "dot" }), h("span", { text: "Edit mode is on" })]),
          h("span", { class: "sub", text: "· Your website isn't changing" }),
          h("span", { class: "gap" }), helpBtn,
          h("button", { type: "button", onclick: exitEdit }, [icon("power"), h("span", { class: "lg", text: "Exit edit mode" }), h("span", { class: "sm", text: "Exit" })])
        ])])
      : h("div", { class: "strip hub" }, [h("div", { class: "strip-in" }, [
          els.stripLbl = h("span", { class: "lbl" }, [icon("lock"), h("span", { class: "lg", text: "You're logged in" }), h("span", { class: "sm", text: "Logged in" })]),
          h("span", { class: "sub", text: "· Only you can see this page" }),
          h("span", { class: "gap" }), helpBtn,
          h("button", { type: "button", onclick: askLogOut }, [icon("power"), h("span", { text: "Log out" })])
        ])]);
    els.say = h("div", { class: "say", "aria-live": "polite" });
    els.btns = h("div", { class: "btns" });
    // Their own page can hold Help and Log out up in its header ([data-portal-actions]). Then there's no
    // bar at the bottom at all until they have a note to send.
    var slot = MODE === "hub" && document.querySelector("[data-portal-actions]");
    if (slot) {
      els.bare = true;
      slot.textContent = "";
      slot.append(els.stripLbl = h("button", { type: "button", onclick: function () { showHelp(false); } }, [icon("help"), h("span", { text: "Help" })]),
                  h("button", { type: "button", onclick: askLogOut }, [icon("power"), h("span", { text: "Log out" })]));
    }
    els.dock = h("div", { class: "dock " + MODE }, [strip, h("div", { class: "dock-main" }, [h("div", { class: "dock-in" }, [els.say, els.btns])])]);
    [els.pins, els.hl, els.frame, els.dock, els.file].forEach(function (e) { layer.appendChild(e); });

    // room at the bottom of the page so the dock never hides the footer, and a pointer cursor while picking
    addCss(document, "html.swn-pick,html.swn-pick *{cursor:pointer!important}html.swn-still{overflow:hidden!important}");
    document.body.appendChild(els.spacer = h("div", { "aria-hidden": "true", "data-site-notes-spacer": "", style: "height:150px" }));
    document.body.appendChild(host);

    // While picking, a tap marks that spot instead of doing what it normally does.
    var inUs = function (e) { var p = e.composedPath ? e.composedPath() : []; return p.indexOf(host) >= 0; };
    document.addEventListener("click", function (e) {
      if (inUs(e)) return;
      var em = MODE === "hub" && !els.veil && e.target.closest && e.target.closest("[data-edit-mode]");
      if (em) { e.preventDefault(); goEdit(em.getAttribute("data-edit-mode") || em.getAttribute("href") || "/"); return; }
      // A photo with data-big (the Photos box on their page) opens bigger instead of starting a note.
      var big = MODE === "hub" && !picking && !els.note && !els.veil && e.target.closest && e.target.closest("[data-big]");
      if (big) { e.preventDefault(); e.stopPropagation(); showPhoto(big); return; }
      // Boxes made for notes (like on the welcome page) open a note with one tap, no "Add a note" first.
      var box = !picking && !st.sent && !els.note && !els.veil && e.target.closest && e.target.closest("[data-note-box]");
      // A booking page set on the box (Let's talk, later a Google Calendar schedule) opens that instead of a note.
      var book = box && (box.getAttribute("data-booking-url") || "").trim();
      if (book) { e.preventDefault(); window.open(book, "_blank", "noopener"); return; }
      if (box && box === photosBox()) { e.preventDefault(); openPhotos(); return; }   // the Photos box opens the Photos page
      if (box) { e.preventDefault(); addNote(box, box.getAttribute("data-area") || null, e); return; }
      if (!picking) return;
      e.preventDefault(); e.stopPropagation();
      var t = targetOf(e.target) || (e.target && e.target.nodeType === 1 ? e.target : null);
      stopPicking();
      if (!t || t === document.body || t === document.documentElement) addNote(null, "This page");
      else addNote(t, null, e);
    }, true);
    ["mousedown", "pointerdown", "submit"].forEach(function (n) { document.addEventListener(n, function (e) { if (picking && !inUs(e) && n === "submit") e.preventDefault(); }, true); });
    document.addEventListener("mousemove", function (e) { if (!picking || !canHover) return; if (inUs(e)) return hideHl(); var t = targetOf(e.target); if (t !== hlFor) showHl(t); }, true);
    document.addEventListener("keydown", function (e) {
      if (e.key !== "Escape") return;
      if (els.lb) closeLb();
      else if (picking) stopPicking();
      else if (panel && !busy) { if (panel === "note") saveNote(); else if (panel === "photos") backFromPhotos(); else if (els.veil && els.veilClose) els.veilClose(); else { closePanels(); render(); } }
    });
    document.addEventListener("keydown", trapTab);
    window.addEventListener("pagehide", function () { if (toastAfter) clearToast(); });   // a deleted note's photos go, even if they leave before Undo runs out
    var tick = false, again = function () { if (tick) return; tick = true; requestAnimationFrame(function () { tick = false; placePins(); if (hlFor) showHl(hlFor); }); };
    window.addEventListener("resize", again); window.addEventListener("scroll", again, { passive: true }); window.addEventListener("load", again);
    if (window.ResizeObserver) new ResizeObserver(again).observe(document.body);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(again);
    var syncPickClass = function () { document.documentElement.classList.toggle("swn-pick", picking); };
    var oldRender = render; render = function () { oldRender(); syncPickClass(); };

    if (MODE === "hub" && st.sent) newList(true);   // sent last time: their page starts fresh, no leftover "Sent" bar
    render();
    if (MODE === "hub") { loadStats(); dropOnBoxes(); }
    if (photosBox()) {
      window.addEventListener("popstate", function () {
        if (location.hash === "#photos") { if (panel !== "photos" && !els.veil && !busy) openPhotos(true); }
        else if (panel === "photos") photosClosed();
      });
      if (location.hash === "#photos") openPhotos(true);
    }
    var introKey = MODE === "edit" ? "intro" : "introHub";
    if (!st[introKey]) { st[introKey] = true; save(); showHelp(true); }   // only ever the first time; Help brings it back
    else if (st.sent) { /* the dock already says it was sent */ }
  }

  // The hidden door: press and hold the Stray Wolf badge (or data-door) for 2 seconds.
  // A soft moonlight grows from it (the wolf's eyes glow orange too), then the light
  // washes over the whole screen and the client's page comes up out of it. Let go
  // early and the light fades away; a normal tap still follows the badge's link.
  var WASH = "#FFFDF8", WASH_KEY = "swn-moonlight";
  function door() {
    if (!DOOR || DOOR === "none" || IS_HUB) return;
    // so a long press on a phone doesn't open the link menu, select text or scroll instead
    var prep = function () { Array.prototype.forEach.call(document.querySelectorAll(DOOR), function (el) { el.style.webkitTouchCallout = "none"; el.style.webkitUserSelect = "none"; el.style.userSelect = "none"; el.style.touchAction = "none"; }); };
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", prep); else prep();
    var HOLD = 2000, timer = 0, glow = null, glowAnim = null, eyes = [], opened = false, startX = 0, startY = 0;
    var calm = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
    function fixed(css) { var d = document.createElement("div"); d.setAttribute("aria-hidden", "true"); d.setAttribute("data-site-notes-light", ""); d.style.cssText = "position:fixed;pointer-events:none;z-index:2147483646;" + css; document.body.appendChild(d); return d; }
    function reset() {
      clearTimeout(timer); timer = 0;
      if (glow) {
        var g = glow; glow = null;
        if (glowAnim && g.animate) { var o = getComputedStyle(g).opacity, t = getComputedStyle(g).transform; glowAnim.cancel(); g.animate([{ opacity: o, transform: t }, { opacity: 0, transform: t }], { duration: 380, easing: "ease-out", fill: "forwards" }).onfinish = function () { g.remove(); }; }
        else g.remove();
      }
      eyes.forEach(function (e) { e.style.fill = ""; e.style.filter = ""; }); eyes = [];
    }
    function start(e, el) {
      if (e.button > 0) return;
      reset(); opened = false; startX = e.clientX; startY = e.clientY;
      var at = el.querySelector("[data-door-center]") || (el.matches(".swt-badge") && el.querySelector("svg g")) || el, r = at.getBoundingClientRect();
      var cx = r.left + r.width / 2, cy = r.top + r.height / 2, size = Math.max(110, Math.max(r.width, r.height) * 3.4);
      eyes = Array.prototype.slice.call(el.querySelectorAll(".swt-e"));
      eyes.forEach(function (x) { x.style.transition = "fill 1.6s ease, filter 1.6s ease"; });
      // the moonlight: a soft round glow centred on the door that slowly brightens and swells
      glow = fixed("left:" + (cx - size / 2) + "px;top:" + (cy - size / 2) + "px;width:" + size + "px;height:" + size + "px;border-radius:50%;opacity:0;" +
        "mix-blend-mode:screen;background:radial-gradient(circle," + WASH + " 0," + WASH + " 9%,rgba(255,250,236,.85) 18%,rgba(255,240,214,.4) 38%,rgba(255,236,206,.12) 54%,rgba(255,236,206,0) 70%)");
      requestAnimationFrame(function () { eyes.forEach(function (x) { x.style.fill = "#EE6A35"; x.style.filter = "drop-shadow(0 0 3px #EE6A35)"; }); });
      if (glow.animate) glowAnim = glow.animate([{ opacity: 0, transform: "scale(.35)" }, { opacity: .7, transform: "scale(.8)", offset: .45 }, { opacity: 1, transform: "scale(1.3)" }], { duration: HOLD, easing: "cubic-bezier(.4,0,.7,1)", fill: "forwards" });
      else glow.style.opacity = "1";
      timer = setTimeout(function () {
        opened = true; timer = 0;
        try { sessionStorage.setItem(WASH_KEY, "1"); } catch (x) {}
        if (navigator.vibrate) try { navigator.vibrate(12); } catch (x) {}
        // then the light washes over everything, from the door outwards
        var far = Math.max(Math.hypot(cx, cy), Math.hypot(innerWidth - cx, cy), Math.hypot(cx, innerHeight - cy), Math.hypot(innerWidth - cx, innerHeight - cy));
        var d = far * 4 + 200, from = Math.min(1, size * .9 / d), wash = fixed("left:" + (cx - d / 2) + "px;top:" + (cy - d / 2) + "px;width:" + d + "px;height:" + d + "px;border-radius:50%;background:radial-gradient(circle," + WASH + " 0," + WASH + " 50%,rgba(255,253,248,.85) 66%,rgba(255,250,236,.35) 84%,rgba(255,250,236,0) 100%);transform:scale(" + from + ")");
        var go = function () { location.href = LOGIN_URL; };
        if (calm || !wash.animate) { wash.style.transform = "none"; setTimeout(go, 120); return; }
        wash.animate([{ transform: "scale(" + from + ")" }, { transform: "scale(1)" }], { duration: 800, easing: "cubic-bezier(.6,0,.8,.5)", fill: "forwards" }).onfinish = go;
        setTimeout(go, 1200);                  // in case the animation never reports back
      }, HOLD);
    }
    document.addEventListener("pointerdown", function (e) { var el = e.target.closest && e.target.closest(DOOR); if (el) start(e, el); }, true);
    document.addEventListener("pointermove", function (e) { if (timer && Math.abs(e.clientX - startX) + Math.abs(e.clientY - startY) > 14) reset(); }, true);
    ["pointerup", "pointercancel"].forEach(function (n) { window.addEventListener(n, function () { if (timer && !opened) reset(); }, true); });
    // after a full hold, the badge's own link must not open as well
    document.addEventListener("click", function (e) { if (opened && e.target.closest && e.target.closest(DOOR)) { e.preventDefault(); e.stopPropagation(); } }, true);
    document.addEventListener("contextmenu", function (e) { if (e.target.closest && e.target.closest(DOOR) && (timer || opened)) e.preventDefault(); }, true);
    document.addEventListener("dragstart", function (e) { if (e.target.closest && e.target.closest(DOOR)) e.preventDefault(); }, true);
    // coming back with the browser's Back button: no leftover light
    window.addEventListener("pageshow", function (e) { if (e.persisted) { opened = false; Array.prototype.forEach.call(document.querySelectorAll("[data-site-notes-light]"), function (d) { d.remove(); }); } });
  }
  // The client's page, arrived at through the door: it comes up out of the moonlight
  function arrive() {
    var on = false; try { on = sessionStorage.getItem(WASH_KEY) === "1"; sessionStorage.removeItem(WASH_KEY); } catch (x) {}
    if (!on) return;
    var d = document.createElement("div"); d.setAttribute("aria-hidden", "true"); d.setAttribute("data-keep", "");
    d.style.cssText = "position:fixed;inset:0;z-index:2147483647;pointer-events:none;background:" + WASH;
    (document.body || document.documentElement).appendChild(d);
    var calm = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!d.animate || calm) { setTimeout(function () { d.remove(); }, calm ? 60 : 400); return; }
    d.animate([{ opacity: 1 }, { opacity: 1, offset: .15 }, { opacity: 0 }], { duration: 900, easing: "ease-out", fill: "forwards" }).onfinish = function () { d.remove(); };
  }
  // Stray Wolf opening "Show me on the site" from the admin: the page comes up with
  // #sw-find={s: selector, p: child counts, x, y: where inside, t: its words, w: screen width}.
  // Scroll to that spot and ring it, with a pin where they tapped. No login needed: it only points.
  function findSpot() {
    var m = /^#sw-find=(.+)$/.exec(location.hash || ""); if (!m) return;
    var f; try { f = JSON.parse(decodeURIComponent(m[1])); } catch (e) { return; }
    try { history.replaceState(null, "", location.pathname + location.search); } catch (e) {}
    var norm = function (s) { return String(s || "").replace(/\s+/g, " ").replace(/…$/, "").trim().toLowerCase(); };
    var t = norm(f.t), seen = function (el) { return el && el.getClientRects().length; };
    var fits = function (el) { return seen(el) && (!t || norm(snipOf(el)).indexOf(t.slice(0, 40)) >= 0 || norm(el.innerText).indexOf(t.slice(0, 40)) >= 0); };
    var el = null, moved = false;
    try { if (f.s) el = document.querySelector(f.s); } catch (e) {}
    if (!fits(el)) { var byPath = f.p && f.p.length ? nodeAt(f.p) : null; if (fits(byPath)) el = byPath; else if (!seen(el)) el = byPath; }
    if (t && !fits(el)) {   // the page changed: look for the same words
      var best = null;
      Array.prototype.forEach.call(document.body.querySelectorAll("h1,h2,h3,h4,h5,p,li,a,button,img,figure,td,dt,dd,blockquote,label,span"), function (c) {
        if (best || !seen(c)) return;
        if ((c.tagName === "IMG" ? norm(snipOf(c)) : norm(c.innerText)).indexOf(t.slice(0, 40)) >= 0) best = c;
      });
      if (best) { el = best; moved = true; }
    }
    if (!seen(el)) return;
    el.scrollIntoView({ block: "center", behavior: "smooth" });
    var ring = document.createElement("div"), pin = document.createElement("div"), tag = document.createElement("div");
    ring.setAttribute("aria-hidden", "true");
    ring.style.cssText = "position:absolute;z-index:2147483645;pointer-events:none;border:3px solid #c2541b;border-radius:8px;background:rgba(194,84,27,.08);box-shadow:0 0 0 9999px rgba(20,18,16,.28);transition:opacity .3s";
    pin.style.cssText = "position:absolute;width:22px;height:22px;margin:-11px 0 0 -11px;border-radius:50%;background:#c2541b;border:3px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,.35)";
    tag.style.cssText = "position:absolute;left:-3px;bottom:100%;margin-bottom:6px;background:#c2541b;color:#fff;font:600 14px/1.25 system-ui,-apple-system,Segoe UI,Roboto,sans-serif;padding:6px 10px;border-radius:8px;width:max-content;max-width:min(420px,calc(100vw - 24px));box-shadow:0 2px 8px rgba(0,0,0,.25)";
    tag.textContent = moved ? "Note left here (the page has changed a little)" : "Note left here";
    ring.append(tag, pin);
    var place = function () {
      var r = el.getBoundingClientRect();
      ring.style.left = (r.left + window.scrollX - 5) + "px"; ring.style.top = (r.top + window.scrollY - 5) + "px";
      ring.style.width = (r.width + 10) + "px"; ring.style.height = (r.height + 10) + "px";
      pin.style.left = (5 + r.width * (f.x == null ? .5 : f.x)) + "px"; pin.style.top = (5 + r.height * (f.y == null ? .5 : f.y)) + "px";
      if (r.top < 44) { tag.style.bottom = "auto"; tag.style.top = "100%"; tag.style.marginTop = "6px"; }
      tag.style.left = "-3px";                         // keep the label on screen near either edge
      var tr = tag.getBoundingClientRect(), vw = document.documentElement.clientWidth;
      if (tr.right > vw - 8) tag.style.left = (-3 - (tr.right - vw + 8)) + "px";
      else if (tr.left < 8) tag.style.left = (-3 + 8 - tr.left) + "px";
    };
    document.body.appendChild(ring); place();
    var off = function () { ring.style.opacity = "0"; setTimeout(function () { ring.remove(); }, 300); window.removeEventListener("resize", place); document.removeEventListener("keydown", esc); document.removeEventListener("pointerdown", off, true); };
    var esc = function (e) { if (e.key === "Escape") off(); };
    window.addEventListener("resize", place); document.addEventListener("keydown", esc);
    setTimeout(function () { document.addEventListener("pointerdown", off, true); }, 400);
    setTimeout(place, 700); window.addEventListener("load", place);
  }
  // While logged in: taps and keys count as activity; once a minute, check the limits.
  // A login that ends (here or in another tab) takes them back to the login box; their notes stay saved.
  var watching = false;
  function watchSession() {
    if (watching) return; watching = true;
    ["pointerdown", "keydown", "scroll"].forEach(function (ev) { window.addEventListener(ev, touch, { passive: true, capture: true }); });
    // On their portal, or in Edit mode on the site: back to the portal's login box (their unsent notes come along).
    // Just browsing their own site: nothing to do, the site looks the same either way.
    var ended = function () { if (IS_HUB) location.reload(); else if (lsGet("on") === "1") { lsSet("on", null); location.href = LOGIN_URL; } };
    setInterval(function () { if (!getToken()) ended(); }, 6e4);
    window.addEventListener("storage", function (e) { if (e.key === K + "token" && !getToken()) ended(); });
    document.addEventListener("visibilitychange", function () { if (document.visibilityState === "visible" && !getToken()) ended(); });
  }
  function boot() {
    findSpot();
    door();
    var token = getToken(), on = lsGet("on") === "1";
    if (token && (IS_HUB || on)) watchSession();
    if (IS_HUB) {
      arrive();
      lsSet("on", null);                       // on their page, Edit mode is off until they tap it
      if (token) { unlock(); mount(); start(); }
      else { lock(); mount(); showLogin(); }
    } else if (token && on) { mount(); start(); }
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot); else boot();
})();
