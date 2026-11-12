/*!
 * site-notes.js  ·  Stray Wolf Technology  ·  v2
 *
 * Lets a client mark up their own site for Jeremy: tap "Add a note", tap the
 * part of the page they mean, say what they want, add photos, send.
 * Normal visitors never see any of it. The site itself never changes.
 *
 * On every page of the client's site:
 *   <script src="/js/site-notes.js" data-site="cedar-street"
 *           data-api="https://YOUR-SERVICE.workers.dev" defer></script>
 *
 * On the client's own page (/notes/index.html: login + their boxes + the
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
 *   data-to         who the notes go to (default: Jeremy)
 *   data-hub        this page is the client's own page (and the password page)
 *   data-login-url  where that page lives (default: /notes/)
 *   data-door       the hidden way in (default: the "Powered by Stray Wolf" badge).
 *                   Press and hold it for 2 seconds: the wolf's eyes glow, a ring
 *                   fills, and the client's page opens. A normal tap works as usual.
 *                   data-door="none" turns it off.
 *   data-name       the business name ("Welcome, TVIS Construction")
 *   data-logo       their logo picture, shown big on the login box
 * On the client's page:
 *   data-edit-mode="/"      on a button or card: opens the site in Edit mode
 *   data-edit-mode="soon"   the mockup isn't ready yet (says so when tapped)
 *   data-note-box           a box that opens a note with one tap
 *     data-area / data-note-ask / data-note-hint   its name, question, example
 *     data-note-fields="Facebook|Instagram"         one line to fill in for each
 *   data-alert-key  optional Web3Forms key: emails a heads-up when notes arrive
 */
(function () {
  "use strict";
  var S = document.currentScript; if (!S) return;
  var SITE = (S.getAttribute("data-site") || "site").toLowerCase();
  var API = (S.getAttribute("data-api") || "demo").replace(/\/+$/, "");
  var DEMO = API === "demo";
  var TO = S.getAttribute("data-to") || "Jeremy";
  var IS_HUB = S.hasAttribute("data-hub") || S.hasAttribute("data-login");
  var MODE = IS_HUB ? "hub" : "edit";   // hub = their own page; edit = Edit mode on the site
  var LOGIN_URL = S.getAttribute("data-login-url") || "/notes/";
  var DOOR = S.getAttribute("data-door") || ".swt-badge";   // the hidden way in: hold this for 2 seconds
  var NAME = S.getAttribute("data-name") || "";   // the business name, for "Welcome, ..." on the login box
  var LOGO = S.getAttribute("data-logo") || "";   // their logo, shown on the login box
  var ALERT_KEY = S.getAttribute("data-alert-key") || "";
  var K = "swn:" + SITE + ":";
  var MAX_PICS = 20, MAX_SIDE = 2000;

  /* =========================================================== storage */

  function lsGet(k) { try { return localStorage.getItem(K + k); } catch (e) { return null; } }
  function lsSet(k, v) { try { v == null ? localStorage.removeItem(K + k) : localStorage.setItem(K + k, v); } catch (e) {} }

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
    ".strip .lbl{display:flex;align-items:center;gap:8px;font-weight:800;letter-spacing:.01em;min-width:0;white-space:nowrap}",
    ".strip .lbl .ic{width:20px;height:20px}",
    ".strip .dot{width:9px;height:9px;border-radius:50%;background:#fff;flex:none;box-shadow:0 0 0 0 rgba(255,255,255,.7);animation:beat 2s infinite}",
    "@keyframes beat{70%{box-shadow:0 0 0 7px rgba(255,255,255,0)}100%{box-shadow:0 0 0 0 rgba(255,255,255,0)}}",
    ".strip .sub{opacity:.95;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;min-width:0}",
    ".strip .gap{flex:1}",
    ".strip button{display:flex;align-items:center;gap:6px;background:rgba(255,255,255,.18);border:0;color:#fff;border-radius:999px;padding:6px 13px;font-size:15px;font-weight:700;min-height:38px;white-space:nowrap}",
    ".strip button:hover{background:rgba(255,255,255,.3)}",
    ".strip.hub{background:#3a3631}",
    ".strip button .ic{width:19px;height:19px}",
    ".strip .sm{display:none}",
    "@media (max-width:719px){.strip .lg{display:none}.strip .sm{display:inline}.strip .sub{display:none}.strip{padding-top:4px;padding-bottom:4px}.strip button{padding:5px 11px;font-size:14px;min-height:36px}}",

    /* the dock at the bottom */
    ".dock{position:fixed;left:0;right:0;bottom:0;background:var(--ink);color:#fff;box-shadow:0 -6px 24px rgba(0,0,0,.22)}",
    ".dock-main{padding:12px max(16px,env(safe-area-inset-right,0px)) calc(12px + env(safe-area-inset-bottom,0px)) max(16px,env(safe-area-inset-left,0px))}",
    ".dock-in{max-width:1100px;margin:0 auto;display:flex;align-items:center;gap:12px 16px}",
    ".dock .say{flex:1 1 auto;min-width:0;font-size:17px;line-height:1.35}",
    ".dock .say b{display:block;font-size:18px}",
    ".dock .say span{opacity:.82;font-size:15px}",
    ".dock .btns{display:flex;gap:10px;flex:none}",
    ".db{display:flex;align-items:center;justify-content:center;gap:9px;min-height:54px;padding:0 20px;border-radius:12px;border:2px solid transparent;font-size:18px;font-weight:700;white-space:nowrap;transition:background .15s,transform .1s}",
    ".db:active{transform:scale(.97)}",
    ".db.main{background:var(--accent);color:#fff}.db.main:hover{background:var(--accent-dk)}",
    ".db.second{background:transparent;color:#fff;border-color:rgba(255,255,255,.45)}.db.second:hover{background:rgba(255,255,255,.1)}",
    ".db.go{background:var(--go);color:#fff}.db.go:hover{background:var(--go-dk)}",
    ".db.go[disabled],.db.off{background:rgba(255,255,255,.12);color:rgba(255,255,255,.6);cursor:default}",
    ".badge{display:inline-grid;place-items:center;min-width:26px;height:26px;border-radius:999px;background:#fff;color:var(--go-dk);font-size:15px;font-weight:800;padding:0 7px}",
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
    ".pin{position:absolute;width:36px;height:36px;margin:-38px 0 0 -6px;border-radius:50% 50% 50% 6px;border:3px solid #fff;background:var(--accent);color:#fff;font-weight:800;font-size:16px;",
    "  display:grid;place-items:center;padding:0;box-shadow:0 3px 10px rgba(0,0,0,.35);font-variant-numeric:tabular-nums;transform-origin:6px 36px}",
    ".pin.on{transform:scale(1.15);box-shadow:0 0 0 5px rgba(194,84,27,.35),0 3px 10px rgba(0,0,0,.35)}",
    ".pin.drop{animation:drop .35s cubic-bezier(.2,1.4,.4,1)}",
    "@keyframes drop{from{transform:translateY(-16px) scale(.6);opacity:0}}",
    ".hl{position:absolute;pointer-events:none;border:3px solid var(--accent);background:rgba(194,84,27,.08);border-radius:6px;transition:all .08s}",
    ".hl span{position:absolute;left:-3px;top:-34px;background:var(--accent);color:#fff;font-size:15px;font-weight:700;padding:5px 10px;border-radius:8px 8px 8px 0;white-space:nowrap}",
    ".hl.below span{top:auto;bottom:-34px;border-radius:0 8px 8px 8px}",

    /* cards: the note box, the review list, help, login */
    ".card{position:fixed;background:var(--paper);border-radius:18px;box-shadow:0 18px 48px rgba(0,0,0,.3),0 0 0 1px rgba(0,0,0,.05);display:flex;flex-direction:column;overflow:hidden}",
    ".card .hd{display:flex;align-items:flex-start;gap:12px;padding:18px 20px 10px}",
    ".card .hd h2{margin:0;font-size:21px;line-height:1.25;font-weight:800}",
    ".card .hd p{margin:3px 0 0;color:var(--muted);font-size:15px;overflow-wrap:anywhere}",
    ".card .hd .grow{flex:1;min-width:0}",
    ".xbtn{flex:none;display:grid;place-items:center;width:44px;height:44px;margin:-6px -8px 0 0;border:0;background:none;border-radius:999px;color:var(--muted)}",
    ".xbtn:hover{background:var(--soft)}",
    ".card .bd{padding:6px 20px 16px;overflow:auto;display:grid;gap:14px;align-content:start}",
    ".card .ft{padding:14px 20px calc(16px + env(safe-area-inset-bottom,0px));border-top:1px solid var(--line);display:flex;gap:10px;align-items:center;background:var(--paper)}",
    ".num{display:inline-grid;place-items:center;flex:none;width:34px;height:34px;border-radius:50% 50% 50% 6px;background:var(--accent);color:#fff;font-weight:800;font-size:16px;font-variant-numeric:tabular-nums}",
    "label.q{font-weight:700;font-size:17px}",
    ".fields{display:grid;gap:10px}.field{display:grid;grid-template-columns:96px 1fr;align-items:center;gap:10px}.field label{font-weight:700;font-size:16px}",
    ".field input{font:inherit;font-size:17px;color:var(--ink);width:100%;min-width:0;min-height:50px;border:2px solid var(--line);border-radius:12px;padding:8px 12px;background:var(--soft)}",
    ".field input:focus{outline:none;border-color:var(--accent);background:#fff}",
    "@media (max-width:420px){.field{grid-template-columns:1fr;gap:4px}}.fields.stack .field{grid-template-columns:1fr;gap:4px}",
    "textarea{font:inherit;font-size:18px;color:var(--ink);width:100%;min-height:120px;border:2px solid var(--line);border-radius:12px;padding:12px 14px;background:var(--soft);resize:vertical}",
    "textarea:focus{border-color:var(--accent);background:#fff;outline:none}",
    "textarea::placeholder{color:#8d877e}",
    ".add-ph{display:flex;align-items:center;gap:14px;width:100%;text-align:left;border:2px dashed #cfc7bb;background:var(--soft);border-radius:12px;padding:14px 16px;min-height:64px}",
    ".add-ph:hover,.add-ph.over{border-color:var(--accent);background:var(--accent-soft)}",
    ".add-ph .ic{width:30px;height:30px;color:var(--accent)}",
    ".add-ph b{display:block;font-size:17px}",
    ".add-ph span{color:var(--muted);font-size:14px}",
    ".thumbs{display:flex;flex-wrap:wrap;gap:10px}",
    ".thumbs .t{position:relative;width:76px;height:76px}",
    ".thumbs img{width:76px;height:76px;object-fit:cover;border-radius:10px;display:block;background:var(--soft);border:1px solid var(--line)}",
    ".thumbs .rm{position:absolute;top:-8px;right:-8px;width:30px;height:30px;border-radius:50%;border:2px solid #fff;background:var(--ink);color:#fff;display:grid;place-items:center;padding:0;box-shadow:0 2px 6px rgba(0,0,0,.25)}",
    ".thumbs .rm .ic{width:16px;height:16px;stroke-width:3}",
    ".thumbs.small .t,.thumbs.small img{width:56px;height:56px}",
    ".b{display:inline-flex;align-items:center;justify-content:center;gap:8px;min-height:52px;padding:0 20px;border-radius:12px;border:2px solid transparent;font-size:17px;font-weight:700;white-space:nowrap}",
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
    ".note .where b{color:var(--ink);font-weight:700;overflow-wrap:anywhere}",
    ".sheet{left:0;right:0;bottom:0;width:auto;max-width:none;max-height:88vh;border-radius:20px 20px 0 0}",
    ".sheet::before{content:'';display:block;width:44px;height:5px;border-radius:9px;background:#d6cfc4;margin:10px auto 0}",

    /* centered panels */
    ".veil{position:fixed;inset:0;background:rgba(24,22,20,.55);display:grid;place-items:center;padding:16px}",
    ".veil > .card{position:relative;width:min(560px,100%);max-height:calc(100vh - 32px)}",
    "@media (max-width:719px){.veil{place-items:end stretch;padding:0}.veil > .card{width:100%;max-height:92vh;border-radius:20px 20px 0 0}}",
    ".steps{list-style:none;margin:0;padding:0;display:grid;gap:12px}",
    ".steps li{display:grid;grid-template-columns:56px minmax(0,1fr);gap:14px;align-items:center;background:var(--soft);border-radius:14px;padding:12px 14px}",
    ".steps .circ{width:56px;height:56px;border-radius:50%;background:#fff;color:var(--accent);display:grid;place-items:center;position:relative;box-shadow:0 1px 0 var(--line)}",
    ".steps .circ .ic{width:28px;height:28px}",
    ".steps .circ i{position:absolute;top:-4px;left:-4px;width:24px;height:24px;border-radius:50%;background:var(--accent);color:#fff;font:800 13px/24px system-ui,sans-serif;text-align:center;font-style:normal}",
    ".steps b{display:block;font-size:18px}",
    ".steps span{color:var(--muted);font-size:15px}",
    ".calm{display:flex;gap:10px;align-items:center;background:#eef6f0;color:#24563a;border-radius:12px;padding:12px 14px;font-size:15px;font-weight:600}",
    ".calm .ic{color:var(--go)}",

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
    ".kick{margin:0 0 2px;font-size:13px!important;letter-spacing:.12em;text-transform:uppercase;color:var(--muted);font-weight:700}",
    ".pw{display:flex;align-items:stretch;border:2px solid var(--line);border-radius:12px;background:var(--soft);overflow:hidden}",
    ".pw:focus-within{border-color:var(--accent);background:#fff}",
    ".pw input{flex:1;min-width:0;font:inherit;font-size:20px;border:0;background:none;padding:12px 14px;color:var(--ink);outline:none;letter-spacing:.02em}",
    ".pw button{border:0;background:none;padding:0 14px;color:var(--muted);font-size:15px;font-weight:600;display:flex;align-items:center;gap:6px}",

    ".toast{position:fixed;left:50%;transform:translateX(-50%);top:calc(18px + env(safe-area-inset-top,0px));background:var(--ink);color:#fff;padding:12px 18px;border-radius:14px;font-size:16px;font-weight:600;",
    "  width:max-content;max-width:calc(100vw - 28px);box-sizing:border-box;text-align:left;box-shadow:0 8px 24px rgba(0,0,0,.3);display:flex;align-items:center;gap:10px}",
    ".toast .ic{color:#7fd39b}",
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
    root.appendChild(layer);
    document.body.appendChild(host);
  }
  var toastTimer;
  function toast(text) {
    clearTimeout(toastTimer);
    var old = layer.querySelector(".toast"); if (old) old.remove();
    var t = h("div", { class: "toast", role: "status" }, [icon("check"), h("span", { text: text })]);
    layer.appendChild(t); toastTimer = setTimeout(function () { t.remove(); }, 3800);
  }

  /* =========================================================== service */

  function api(path, opts) {
    opts = opts || {};
    var headers = {};
    if (opts.token) headers.authorization = "Bearer " + opts.token;
    if (opts.type) headers["content-type"] = opts.type;
    return fetch(API + path, { method: "POST", headers: headers, body: opts.raw || JSON.stringify(opts.body || {}) })
      .then(function (r) { return r.json().then(function (d) { d.status = r.status; return d; }, function () { return { ok: false, status: r.status, error: "Something went wrong on our end." }; }); },
            function () { return { ok: false, status: 0, error: "Your internet seems to be off." }; });
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
        lsSet("token", d.token);
        veil.remove(); unlock(); start();
      };
      if (DEMO) setTimeout(function () { done(pw.value.trim().toLowerCase() === "wolf" ? { ok: true, token: "demo" } : { ok: false, status: 401, error: "That password isn't right. (In this demo it's: wolf)" }); }, 350);
      else api("/api/login", { body: { site: SITE, password: pw.value.trim() } }).then(done);
    } }, [
      h("div", { class: "bd", style: "padding-top:22px;gap:14px" }, [
        LOGO ? h("div", { class: "logo" }, [h("img", { src: LOGO, alt: NAME || "Logo" })]) : h("div", { class: "lock" }, [icon("lock")]),
        h("div", { class: "center" }, [NAME ? h("p", { class: "kick" }, [icon("lock"), h("span", { text: IS_HUB ? "Private client login" : "Owner login" })]) : null, h("h2", { text: NAME ? "Welcome, " + NAME : "Owner login" }), h("p", { text: "Type the password " + TO + " gave you." })]),
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
    var n = st.notes.length;
    els.frame.className = "frame" + (picking ? " picking" : "");
    els.dock.className = "dock " + MODE + (picking ? " picking" : "");
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
      els.btns.append(dockBtn("send", "Send to " + TO, n ? "go" : "go off", function () { if (st.notes.length) openReview(); else toast("Tap a box first. Then you can send it."); }, n));
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
        dockBtn("send", "Send to " + TO, n ? "go" : "go off", function () { if (st.notes.length) openReview(); else toast("Add a note first. Then you can send it."); }, n));
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
    var note = { id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6), page: location.pathname, title: MODE === "hub" ? "Your page" : pageName(), hub: MODE === "hub", path: null, fx: .5, fy: .5, on: label || "", text: "", pics: [] };
    if (target) {
      var r = target.getBoundingClientRect();
      note.path = pathOf(target); note.on = label && target.hasAttribute("data-note-box") ? label : describe(target);
      if (target.hasAttribute("data-note-ask")) note.ask = target.getAttribute("data-note-ask");
      if (target.hasAttribute("data-note-hint")) note.hint = target.getAttribute("data-note-hint");
      if (target.hasAttribute("data-note-fields")) { note.fields = target.getAttribute("data-note-fields").split("|"); note.vals = {}; note.extra = ""; }
      if (ev && r.width) note.fx = Math.min(1, Math.max(0, (ev.clientX - r.left) / r.width));
      if (ev && r.height) note.fy = Math.min(1, Math.max(0, (ev.clientY - r.top) / r.height));
      lastPin = note.id;
    }
    st.notes.push(note); save();
    openNote(st.notes.length - 1, wantPhotos);
  }

  function openNote(i, wantPhotos) {
    closePanels();
    active = i; panel = "note";
    var note = st.notes[i], phone = isPhone();
    var text = h("textarea", { id: "swn-text", placeholder: note.hint || "For example: Change the price to $32.", onkeydown: function (e) { if (e.key === "Escape") saveNote(); } });
    text.value = note.fields ? note.extra || "" : note.text;
    // A box can ask for a few named things, one line each (like Facebook, Instagram...).
    // "Label" or "Label=example text"
    var fieldEls = (note.fields || []).map(function (raw, k) {
      var f = raw.split("=")[0], ex = raw.split("=")[1];
      var inp = h("input", ex ? { type: "text", id: "swn-f" + k, autocomplete: "off", placeholder: ex }
                              : { type: "text", id: "swn-f" + k, inputmode: "url", autocapitalize: "off", autocomplete: "off", placeholder: "Paste the link here" });
      inp.value = (note.vals && note.vals[f]) || "";
      return { name: f, input: inp, row: h("div", { class: "field" }, [h("label", { for: "swn-f" + k, text: f }), inp]) };
    });
    if (note.fields) { text.placeholder = "Anything else? (You can leave this empty.)"; text.style.minHeight = "70px"; }
    text.addEventListener("paste", function (e) { var f = e.clipboardData && e.clipboardData.files; if (f && f.length) { e.preventDefault(); addPictures(f); } });
    var thumbs = h("div", { class: "thumbs" });
    var drop = h("button", { class: "add-ph", type: "button", onclick: function () { els.file.click(); } }, [
      icon("photo"), h("div", {}, [h("b", { text: note.pics.length ? "Add more photos" : "Add photos" }), h("span", { text: phone ? "From your phone, or take a new one" : "Click to choose, or drag them here" })])]);
    ["dragenter", "dragover"].forEach(function (n) { drop.addEventListener(n, function (e) { e.preventDefault(); drop.classList.add("over"); }); });
    drop.addEventListener("dragleave", function () { drop.classList.remove("over"); });
    drop.addEventListener("drop", function (e) { e.preventDefault(); drop.classList.remove("over"); addPictures(e.dataTransfer.files); });

    var card = h("div", { class: "card note" + (phone ? " sheet" : ""), role: "dialog", "aria-label": "Note " + (i + 1) }, [
      h("div", { class: "hd" }, [
        h("span", { class: "num", text: String(i + 1) }),
        h("div", { class: "grow" }, [h("h2", { text: note.text || note.pics.length ? "Your note" : "New note" })]),
        h("button", { class: "xbtn", type: "button", "aria-label": "Close and keep this note", onclick: saveNote }, [icon("x")])
      ]),
      h("div", { class: "bd" }, [
        h("div", { class: "where" }, [h("span", { text: "About:" }), h("b", { text: note.on })]),
        h("label", { class: "q", for: note.fields ? "swn-f0" : "swn-text", text: note.ask || "What would you like changed?" }),
        note.fields ? h("div", { class: "fields" + (fieldEls.some(function (f) { return f.name.length > 11; }) ? " stack" : "") }, fieldEls.map(function (f) { return f.row; })) : null,
        text, thumbs, drop
      ]),
      h("div", { class: "ft" }, [
        h("button", { class: "b danger", type: "button", onclick: function () { removeNote(active); } }, [icon("trash"), h("span", { text: "Delete" })]),
        h("button", { class: "b main push", type: "button", onclick: saveNote }, [icon("check"), h("span", { text: "Save note" })])
      ])
    ]);
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
  function drawThumbs(note, box, editable) {
    box.textContent = "";
    box.hidden = !note.pics.length;
    note.pics.forEach(function (id, k) {
      var img = h("img", { alt: "Photo " + (k + 1) });
      picUrl(id).then(function (u) { if (u) img.src = u; });
      box.appendChild(h("span", { class: "t" }, [img, editable ? h("button", { class: "rm", type: "button", "aria-label": "Take out photo " + (k + 1), onclick: function () {
        note.pics.splice(note.pics.indexOf(id), 1); picDel(id); save(); drawThumbs(note, box, true); refreshDrop(note);
      } }, [icon("x")]) : null]));
    });
  }
  function refreshDrop(note) { if (els.note) els.note.drop.querySelector("b").textContent = note.pics.length ? "Add more photos" : "Add photos"; }
  function saveNote() {
    var note = st.notes[active];
    if (note && els.note && note.fields) {
      note.extra = els.note.text.value.trim();
      var lines = [];
      els.note.fields.forEach(function (f) { var v = f.input.value.trim(); note.vals[f.name] = v; if (v) lines.push(f.name.replace(/[?:.]+$/, "") + ": " + v); });
      note.text = lines.concat(note.extra ? [note.extra] : []).join("\n");
    } else if (note && els.note) note.text = els.note.text.value.trim();
    var kept = note && (note.text || note.pics.length);
    if (note && !kept) st.notes.splice(active, 1);                    // an empty note is dropped
    closePanels(); save(); render();
    if (kept) toast(st.notes.length === 1 ? "Note saved. Add another, or tap Send to " + TO + "." : "Note saved.");
  }
  function removeNote(i) {
    var note = st.notes[i]; if (!note) return;
    note.pics.forEach(picDel); st.notes.splice(i, 1);
    closePanels(); save(); render();
    toast("Note deleted.");
    if (panel === "review") openReview();
  }
  function closePanels() {
    if (els.note) { els.note.card.remove(); els.note = null; }
    if (els.veil) { els.veil.remove(); els.veil = null; }
    active = -1; panel = null; if (els.dock) els.dock.hidden = false;
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
    var list = Array.prototype.slice.call(files || []), bad = 0, full = false, added = 0;
    return list.reduce(function (p, f) {
      return p.then(function () {
        if (picCount() >= MAX_PICS) { full = true; return; }
        return shrink(f).then(function (rec) {
          if (!rec) { bad++; return; }
          var id = "p" + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
          return picPut(id, rec).then(function () { note.pics.push(id); added++; });
        });
      });
    }, Promise.resolve()).then(function () {
      save();
      if (els.note && st.notes[active] === note) { drawThumbs(note, els.note.thumbs, true); refreshDrop(note); placeNoteCard(); }
      if (full) toast("That's " + MAX_PICS + " photos, the most for one send. Send these first, then add more.");
      else if (bad) toast(bad === 1 ? "One file wasn't a photo, so it was left out." : bad + " files weren't photos, so they were left out.");
      else if (added) toast(added === 1 ? "Photo added." : added + " photos added.");
    });
  }

  /* ----- the review list and sending ----- */
  function veil(card) {
    closePanels();
    clearTimeout(toastTimer); var oldToast = layer.querySelector(".toast"); if (oldToast) oldToast.remove();   // a big message replaces any small one
    els.veil = h("div", { class: "veil", onclick: function (e) { if (e.target === els.veil && !busy) { closePanels(); render(); } } }, [card]);
    layer.appendChild(els.veil);
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
          h("div", { class: "w", text: (note.hub ? "Your page · " : note.title && note.title !== "Home" ? note.title + " page · " : "") + note.on }),
          h("div", { class: "s" + (note.text ? "" : " empty"), text: note.text || "(photos only)" }),
          note.pics.length ? th : null,
          h("div", { class: "acts" }, [
            here ? h("button", { class: "b quiet", type: "button", onclick: function () { openNote(i); } }, [icon("pencil"), h("span", { text: "Change" })])
                 : h("button", { class: "b quiet", type: "button", onclick: function () { if (!note.hub) lsSet("on", "1"); location.href = note.page; } }, [icon("arrow"), h("span", { text: note.hub ? "Go to your page" : "Go to that page" })]),
            h("button", { class: "b danger", type: "button", onclick: function () { removeNote(i); openReview(); } }, [icon("trash"), h("span", { text: "Delete" })])
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
        h("button", { class: "xbtn", type: "button", "aria-label": "Close", onclick: function () { if (!busy) { closePanels(); render(); } } }, [icon("x")])
      ]),
      h("div", { class: "bd" }, [list, h("div", { class: "calm" }, [icon("check"), h("span", { text: "Your website stays exactly as it is until " + TO + " makes the change." })])]),
      h("div", { class: "ft", style: "flex-direction:column;align-items:stretch" }, [progress, err,
        h("div", { style: "display:flex;gap:10px;flex-wrap:wrap" }, [
          h("button", { class: "b plain", type: "button", text: "Keep adding notes", onclick: function () { if (!busy) { closePanels(); render(); } } }),
          h("span", { class: "push" }), sendBtn])])
    ]));
    els.dock.hidden = isPhone();
  }

  function send(btn, progress, err) {
    if (busy || !st.notes.length) return;
    busy = true; btn.disabled = true; err.hidden = true;
    var token = lsGet("token"), total = picCount(), doneN = 0, label = btn.lastChild;
    var bar = progress.firstChild;
    var step = function (t, frac) { label.textContent = t; if (total) { progress.hidden = false; bar.style.width = Math.round(frac * 100) + "%"; } };
    var failWith = function (d) {
      busy = false; btn.disabled = false; label.textContent = "Try again"; progress.hidden = true;
      err.textContent = "";
      if (d.status === 401) {
        lsSet("token", null);
        err.append("Your login timed out. Your notes are safe on this device. ", h("a", { href: LOGIN_URL, text: "Log in again" }), " and then tap Send.");
      } else err.textContent = (d.status === 0 ? "Your internet seems to be off." : "That didn't go through.") + " Your notes are safe on this device. Tap Try again in a minute.";
      err.hidden = false;
    };
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
      var body = { notes: st.notes.map(function (n) { return { page: n.page, title: n.title, on: n.on, text: n.text, pics: n.pics.map(function (id) { return keys[id]; }).filter(Boolean) }; }) };
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
    veil(h("div", { class: "card", role: "dialog", "aria-label": "Sent" }, [
      h("div", { class: "bd center", style: "padding-top:26px;gap:8px" }, [
        h("div", { class: "done-ic pop" }, [icon("check")]),
        h("h2", { text: "Sent!" }),
        h("p", { text: TO + " has your " + (st.sentNotes === 1 ? "note" : plural(st.sentNotes, "note")) + (st.sentPics ? " and " + plural(st.sentPics, "photo") : "") + "." }),
        h("p", { text: "You'll hear back soon. Nothing on your website changes until " + TO + " makes the update." })
      ]),
      h("div", { class: "ft" }, [h("button", { class: "b main wide", type: "button", text: "Done", onclick: function () { closePanels(); render(); } })])
    ]));
    render();
  }
  function newList() {
    st.notes.forEach(function (n) { n.pics.forEach(picDel); });
    st.notes = []; st.sent = false; st.sentNotes = st.sentPics = 0; save(); closePanels(); render();
    toast("Ready for new notes.");
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
    var step = function (n, ic, title, text) { return h("li", {}, [h("div", { class: "circ" }, [icon(ic), h("i", { text: String(n) })]), h("div", {}, [h("b", { text: title }), h("span", { text: text })])]); };
    veil(h("div", { class: "card", role: "dialog", "aria-label": "How this works" }, [
      h("div", { class: "hd" }, [
        h("div", { class: "grow" }, [h("h2", { text: first ? (MODE === "edit" ? "You're in Edit mode. Here's how it works." : "Welcome! Here's how it works.") : "How this works" }), h("p", { text: MODE === "edit" ? "Leave notes for " + TO + " right on your own website." : "This is your own page for sending " + TO + " what you need." })]),
        first ? null : h("button", { class: "xbtn", type: "button", "aria-label": "Close", onclick: function () { closePanels(); render(); } }, [icon("x")])
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
      h("div", { class: "ft" }, [h("button", { class: "b main wide", type: "button", text: first ? "Got it. Let's start." : "Got it", onclick: function () { st[MODE === "edit" ? "intro" : "introHub"] = true; save(); closePanels(); render(); } })])
    ]));
    els.dock.hidden = isPhone();
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
    veil(h("div", { class: "card", role: "dialog", "aria-label": "Log out" }, [
      h("div", { class: "hd" }, [h("div", { class: "grow" }, [h("h2", { text: "Log out?" }),
        h("p", { text: (n ? "Your " + plural(n, "note") + " will stay saved on this device. " : "") + "To come back, tap Owner login at the bottom of your website and type your password." })])]),
      h("div", { class: "ft" }, [
        h("button", { class: "b plain", type: "button", text: "Stay logged in", onclick: function () { closePanels(); render(); } }),
        h("button", { class: "b main push", type: "button", onclick: function () { lsSet("token", null); lsSet("on", null); location.reload(); } }, [icon("power"), h("span", { text: "Log out" })])
      ])
    ]));
  }

  /* =========================================================== start */

  function start() {
    els.file = h("input", { type: "file", accept: "image/*", multiple: true, hidden: true, onchange: function () { addPictures(els.file.files); els.file.value = ""; } });
    els.pins = h("div");
    els.hl = h("div", { class: "hl", hidden: true }, [h("span", { text: "Tap here" })]);
    els.frame = h("div", { class: "frame", "aria-hidden": "true", hidden: MODE !== "edit" });
    var helpBtn = h("button", { type: "button", onclick: function () { showHelp(false); } }, [icon("help"), h("span", { text: "Help" })]);
    var strip = MODE === "edit"
      ? h("div", { class: "strip", role: "status" }, [h("div", { class: "strip-in" }, [
          h("span", { class: "lbl" }, [h("span", { class: "dot" }), h("span", { text: "Edit mode is on" })]),
          h("span", { class: "sub", text: "· Your website isn't changing" }),
          h("span", { class: "gap" }), helpBtn,
          h("button", { type: "button", onclick: exitEdit }, [icon("power"), h("span", { class: "lg", text: "Exit edit mode" }), h("span", { class: "sm", text: "Exit" })])
        ])])
      : h("div", { class: "strip hub", role: "status" }, [h("div", { class: "strip-in" }, [
          h("span", { class: "lbl" }, [icon("lock"), h("span", { class: "lg", text: "You're logged in" }), h("span", { class: "sm", text: "Logged in" })]),
          h("span", { class: "sub", text: "· Only you can see this page" }),
          h("span", { class: "gap" }), helpBtn,
          h("button", { type: "button", onclick: askLogOut }, [icon("power"), h("span", { text: "Log out" })])
        ])]);
    els.say = h("div", { class: "say", "aria-live": "polite" });
    els.btns = h("div", { class: "btns" });
    els.dock = h("div", { class: "dock " + MODE }, [strip, h("div", { class: "dock-main" }, [h("div", { class: "dock-in" }, [els.say, els.btns])])]);
    [els.pins, els.hl, els.frame, els.dock, els.file].forEach(function (e) { layer.appendChild(e); });

    // room at the bottom of the page so the dock never hides the footer, and a pointer cursor while picking
    addCss(document, "html.swn-pick,html.swn-pick *{cursor:pointer!important}");
    document.body.appendChild(h("div", { "aria-hidden": "true", "data-site-notes-spacer": "", style: "height:150px" }));
    document.body.appendChild(host);

    // While picking, a tap marks that spot instead of doing what it normally does.
    var inUs = function (e) { var p = e.composedPath ? e.composedPath() : []; return p.indexOf(host) >= 0; };
    document.addEventListener("click", function (e) {
      if (inUs(e)) return;
      var em = MODE === "hub" && !els.veil && e.target.closest && e.target.closest("[data-edit-mode]");
      if (em) { e.preventDefault(); goEdit(em.getAttribute("data-edit-mode") || em.getAttribute("href") || "/"); return; }
      // Boxes made for notes (like on the welcome page) open a note with one tap, no "Add a note" first.
      var box = !picking && !st.sent && !els.note && !els.veil && e.target.closest && e.target.closest("[data-note-box]");
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
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") { if (picking) stopPicking(); else if (panel && !busy) { if (panel === "note") saveNote(); else { closePanels(); render(); } } } });
    var tick = false, again = function () { if (tick) return; tick = true; requestAnimationFrame(function () { tick = false; placePins(); if (hlFor) showHl(hlFor); }); };
    window.addEventListener("resize", again); window.addEventListener("scroll", again, { passive: true }); window.addEventListener("load", again);
    if (window.ResizeObserver) new ResizeObserver(again).observe(document.body);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(again);
    var syncPickClass = function () { document.documentElement.classList.toggle("swn-pick", picking); };
    var oldRender = render; render = function () { oldRender(); syncPickClass(); };

    render();
    if (!st[MODE === "edit" ? "intro" : "introHub"]) showHelp(true);
    else if (st.sent) { /* the dock already says it was sent */ }
  }

  // The hidden door: press and hold the Stray Wolf badge (or data-door) for 2 seconds.
  // The wolf's eyes glow orange and a ring fills around it; then the client's page opens.
  // Let go early and nothing happens, and a normal tap still follows the badge's link.
  function door() {
    if (!DOOR || DOOR === "none" || IS_HUB) return;
    // so a long press on a phone doesn't open the link menu or select text instead
    var prep = function () { Array.prototype.forEach.call(document.querySelectorAll(DOOR), function (el) { el.style.webkitTouchCallout = "none"; el.style.webkitUserSelect = "none"; el.style.userSelect = "none"; el.style.touchAction = "none"; }); };
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", prep); else prep();
    var HOLD = 2000, timer = 0, ring = null, eyes = [], opened = false, startX = 0, startY = 0;
    var NS = "http://www.w3.org/2000/svg";
    function reset() {
      clearTimeout(timer); timer = 0;
      if (ring) { ring.remove(); ring = null; }
      eyes.forEach(function (e) { e.style.fill = ""; e.style.filter = ""; e.style.transition = ""; }); eyes = [];
    }
    function start(e, el) {
      if (e.button > 0) return;
      reset(); opened = false; startX = e.clientX; startY = e.clientY;
      el.style.webkitTouchCallout = "none"; el.style.webkitUserSelect = "none"; el.style.userSelect = "none";
      var head = el.querySelector("svg g") || el, r = head.getBoundingClientRect();
      eyes = Array.prototype.slice.call(el.querySelectorAll(".swt-e"));
      eyes.forEach(function (x) { x.style.transition = "fill 1.6s ease, filter 1.6s ease"; });
      var size = Math.max(r.width, r.height) + 22;
      ring = document.createElementNS(NS, "svg");
      ring.setAttribute("viewBox", "0 0 100 100"); ring.setAttribute("aria-hidden", "true");
      ring.style.cssText = "position:fixed;z-index:2147483646;pointer-events:none;left:" + (r.left + r.width / 2 - size / 2) + "px;top:" + (r.top + r.height / 2 - size / 2) + "px;width:" + size + "px;height:" + size + "px;transform:rotate(-90deg)";
      var track = document.createElementNS(NS, "circle"), arc = document.createElementNS(NS, "circle");
      [track, arc].forEach(function (c) { c.setAttribute("cx", "50"); c.setAttribute("cy", "50"); c.setAttribute("r", "46"); c.setAttribute("fill", "none"); c.setAttribute("stroke-width", "4"); });
      track.setAttribute("stroke", "rgba(238,106,53,.22)");
      arc.setAttribute("stroke", "#EE6A35"); arc.setAttribute("stroke-linecap", "round");
      arc.setAttribute("stroke-dasharray", "289"); arc.setAttribute("stroke-dashoffset", "289");
      ring.appendChild(track); ring.appendChild(arc); document.body.appendChild(ring);
      requestAnimationFrame(function () {
        eyes.forEach(function (x) { x.style.fill = "#EE6A35"; x.style.filter = "drop-shadow(0 0 3px #EE6A35)"; });
        if (arc.animate) arc.animate([{ strokeDashoffset: 289 }, { strokeDashoffset: 0 }], { duration: HOLD, easing: "linear", fill: "forwards" });
        else arc.setAttribute("stroke-dashoffset", "0");
      });
      timer = setTimeout(function () {
        opened = true;
        if (ring && ring.animate) ring.animate([{ opacity: 1, transform: "rotate(-90deg) scale(1)" }, { opacity: 0, transform: "rotate(-90deg) scale(1.35)" }], { duration: 260, fill: "forwards" });
        setTimeout(function () { location.href = LOGIN_URL; }, 220);
      }, HOLD);
    }
    document.addEventListener("pointerdown", function (e) { var el = e.target.closest && e.target.closest(DOOR); if (el) start(e, el); }, true);
    document.addEventListener("pointermove", function (e) { if (timer && Math.abs(e.clientX - startX) + Math.abs(e.clientY - startY) > 14) reset(); }, true);
    ["pointerup", "pointercancel"].forEach(function (n) { window.addEventListener(n, function () { if (timer && !opened) reset(); }, true); });
    // after a full hold, the badge's own link must not open as well
    document.addEventListener("click", function (e) { if (opened && e.target.closest && e.target.closest(DOOR)) { e.preventDefault(); e.stopPropagation(); } }, true);
    document.addEventListener("contextmenu", function (e) { if (e.target.closest && e.target.closest(DOOR) && (timer || opened)) e.preventDefault(); }, true);
    document.addEventListener("dragstart", function (e) { if (e.target.closest && e.target.closest(DOOR)) e.preventDefault(); }, true);
  }
  function boot() {
    door();
    var token = lsGet("token"), on = lsGet("on") === "1";
    if (IS_HUB) {
      lsSet("on", null);                       // on their page, Edit mode is off until they tap it
      if (token) { unlock(); mount(); start(); }
      else { lock(); mount(); showLogin(); }
    } else if (token && on) { mount(); start(); }
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot); else boot();
})();
