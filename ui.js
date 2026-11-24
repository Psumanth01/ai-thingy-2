/* =========================================================
   AI Quest — shared UI helpers
   Icons, the Byte mascot (original SVG), badge art, toasts, confetti, modals.
   ========================================================= */
(function (global) {
  "use strict";
  var D = global.AIQ_DATA, S = global.AIQ.store;
  var UI = {};

  UI.esc = function (t) {
    return String(t == null ? "" : t).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  };
  UI.shuffle = function (arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  };
  UI.reduced = function () { return global.matchMedia && global.matchMedia("(prefers-reduced-motion: reduce)").matches; };

  /* ---------- icons ---------- */
  var P = {
    bolt: '<path d="M13 2 4 14h7l-1 8 9-12h-7z" fill="currentColor"/>',
    flame: '<path fill="currentColor" stroke="none" d="M12 2c.5 3.5 4.5 5.5 4.5 10a4.5 4.5 0 0 1-9 0c0-1.8.8-3 1.8-4 .2 1.6 1 2.5 2 2.7C11 8.5 10.8 5 12 2z"/>',
    check: '<path d="M5 12.5l4.5 4.5L19 7"/>',
    lock: '<rect x="5" y="11" width="14" height="10" rx="2.5"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
    book: '<path d="M5 4h13a1 1 0 0 1 1 1v13H7a2 2 0 0 0-2 2z"/><path d="M5 20a2 2 0 0 1 2-2h12"/><path d="M9 8h6"/>',
    target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/>',
    quiz: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.6 2.2c-.8.4-1.1.9-1.1 1.8"/><circle cx="12" cy="17" r=".9" fill="currentColor"/>',
    star: '<path fill="currentColor" d="M12 2.5l2.9 6 6.6.8-4.9 4.5 1.3 6.5L12 17l-5.9 3.3 1.3-6.5L2.5 9.3l6.6-.8z"/>',
    trophy: '<path d="M8 4h8v5a4 4 0 0 1-8 0z"/><path d="M8 6H5a3 3 0 0 0 3 4M16 6h3a3 3 0 0 1-3 4"/><path d="M12 13v4M8 21h8M10 17h4"/>',
    x: '<path d="M6 6l12 12M18 6L6 18"/>',
    play: '<path fill="currentColor" d="M8 5v14l11-7z"/>',
    gamepad: '<rect x="2.5" y="7" width="19" height="11" rx="5"/><path d="M8 10v5M5.5 12.5h5"/><circle cx="15.5" cy="11.5" r="1" fill="currentColor"/><circle cx="18" cy="14" r="1" fill="currentColor"/>',
    search: '<circle cx="11" cy="11" r="6.5"/><path d="M16 16l5 5"/>',
    shield: '<path d="M12 3l7 3v5.5c0 4.5-3 7.8-7 9.5-4-1.7-7-5-7-9.5V6z"/><path d="M9 12l2.2 2.2L15.5 10"/>',
    bulb: '<path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z"/>',
    chart: '<path d="M4 20V10M10 20V4M16 20v-8M21 20H3"/>',
    db: '<ellipse cx="12" cy="6" rx="8" ry="3"/><path d="M4 6v6c0 1.7 3.6 3 8 3s8-1.3 8-3V6M4 12v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6"/>',
    spark: '<path fill="currentColor" stroke="none" d="M12 2l2 6.5 6.5 2-6.5 2L12 19l-2-6.5-6.5-2 6.5-2z"/><path d="M19 3v4M17 5h4" />',
    eye: '<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
    map: '<path d="M9 4L3 6v14l6-2 6 2 6-2V4l-6 2z"/><path d="M9 4v14M15 6v14"/>',
    chat: '<path d="M4 5h16v11H9l-5 4z"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/>',
    link: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
    mic: '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/>',
    pen: '<path d="M4 20l1-4L16 5l3 3L8 19z"/><path d="M14 7l3 3"/>',
    cards: '<rect x="3" y="6" width="14" height="12" rx="2"/><path d="M7 3h12a2 2 0 0 1 2 2v10"/>',
    image: '<rect x="3" y="4" width="18" height="16" rx="3"/><circle cx="9" cy="10" r="1.8"/><path d="M4 18l5-5 4 4 3-3 4 4"/>',
    code: '<path d="M8 7l-5 5 5 5M16 7l5 5-5 5M14 4l-4 16"/>',
    ear: '<path d="M7 9a5 5 0 0 1 10 0c0 3-3 3.5-3 6.5a3 3 0 0 1-6 0"/><path d="M10.5 9a1.5 1.5 0 0 1 3 0"/>',
    mask: '<path d="M3 8c3-2 15-2 18 0v4c0 4-4 8-9 8s-9-4-9-8z"/><circle cx="8.5" cy="11.5" r="1.5"/><circle cx="15.5" cy="11.5" r="1.5"/><path d="M9 16c2 1.5 4 1.5 6 0"/>',
    alert: '<path d="M12 3l10 18H2z"/><path d="M12 10v5"/><circle cx="12" cy="18" r=".9" fill="currentColor"/>',
    heart: '<path d="M12 20s-8-4.5-8-10a4.5 4.5 0 0 1 8-2.5A4.5 4.5 0 0 1 20 10c0 5.5-8 10-8 10z"/>',
    scale: '<path d="M12 3v18M6 21h12M5 7h14"/><path d="M5 7l-3 7a3 3 0 0 0 6 0zM19 7l-3 7a3 3 0 0 0 6 0z"/>',
    calendar: '<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M3 10h18M8 3v4M16 3v4"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6"/><circle cx="12" cy="7.5" r=".9" fill="currentColor"/>',
    flag: '<path d="M5 21V4M5 5h12l-2 4 2 4H5"/>',
    cert: '<rect x="3" y="4" width="18" height="13" rx="2"/><path d="M8 9h8M8 12.5h5"/><path d="M15 17l1 4 2-1.5 2 1.5 1-4"/>'
  };
  UI.icon = function (name, cls) {
    return '<svg class="' + (cls || "") + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' + (P[name] || "") + "</svg>";
  };

  /* ---------- Byte, the mascot (original artwork) ---------- */
  var HEAD = "#A9C0F4", EDGE = "#3C4F9E", VISOR = "#22336E", ANT = "#FFB13D", CHEST = "#C7EEF9", W = "#fff";
  function face(mood) {
    var st = 'stroke="' + W + '" stroke-width="4.5" fill="none" stroke-linecap="round"';
    var eyes2 = '<ellipse cx="63" cy="72" rx="6" ry="7" fill="' + W + '"/><ellipse cx="97" cy="72" rx="6" ry="7" fill="' + W + '"/>';
    switch (mood) {
      case "cheer":
        return '<path d="M56 76 Q63 64 70 76" ' + st + '/><path d="M90 76 Q97 64 104 76" ' + st + '/><path d="M66 84 Q80 103 94 84 Z" fill="' + W + '"/>';
      case "wow":
        return '<circle cx="63" cy="72" r="8" fill="' + W + '"/><circle cx="63" cy="72" r="3.5" fill="' + VISOR + '"/><circle cx="97" cy="72" r="8" fill="' + W + '"/><circle cx="97" cy="72" r="3.5" fill="' + VISOR + '"/><ellipse cx="80" cy="91" rx="6" ry="7" fill="' + W + '"/>';
      case "think":
        return '<ellipse cx="63" cy="72" rx="6" ry="7" fill="' + W + '"/><circle cx="65" cy="69" r="2.6" fill="' + VISOR + '"/><ellipse cx="97" cy="73" rx="5.5" ry="6" fill="' + W + '"/><circle cx="99" cy="70" r="2.4" fill="' + VISOR + '"/><path d="M88 59 L106 55" ' + st + '/><path d="M70 89 H88" ' + st + '/>';
      case "oops":
        return '<ellipse cx="63" cy="74" rx="6" ry="5" fill="' + W + '"/><ellipse cx="97" cy="74" rx="6" ry="5" fill="' + W + '"/><path d="M55 62 L70 67" ' + st + '/><path d="M105 62 L90 67" ' + st + '/><path d="M68 93 Q80 83 92 93" ' + st + '/>';
      default:
        return eyes2 + '<path d="M68 86 Q80 97 92 86" ' + st + '/>';
    }
  }
  function arm(d) {
    return '<path d="' + d + '" stroke="' + EDGE + '" stroke-width="17" stroke-linecap="round" fill="none"/><path d="' + d + '" stroke="' + HEAD + '" stroke-width="10" stroke-linecap="round" fill="none"/>';
  }
  UI.mascot = function (mood, cls) {
    mood = mood || "happy";
    var left = arm("M52 136 Q34 142 32 158"), right = arm("M108 136 Q126 142 128 158");
    if (mood === "cheer") { left = arm("M52 136 Q30 126 30 106"); right = arm("M108 136 Q130 126 130 106"); }
    if (mood === "wave") { right = '<g class="wave">' + arm("M108 136 Q128 130 134 110") + "</g>"; }
    var extra = "";
    if (mood === "think") extra = '<text x="122" y="42" font-size="30" fill="#FF914D" font-family="Lilita One, Arial Rounded MT Bold, sans-serif">?</text>';
    if (mood === "oops") extra = '<path d="M121 50 q-6 9 0 13 q6 -4 0 -13z" fill="#9FD8F5"/>';
    if (mood === "cheer") extra = '<g fill="#FF914D"><circle cx="20" cy="40" r="3"/><circle cx="142" cy="30" r="3.5" fill="#CB6CE6"/><circle cx="150" cy="70" r="2.5"/><circle cx="12" cy="80" r="2.5" fill="#CB6CE6"/></g>';
    return '<svg class="bot ' + (cls || "") + '" viewBox="0 0 160 195" role="img" aria-label="Byte, the AI Quest robot">' +
      '<ellipse cx="80" cy="188" rx="30" ry="5" fill="rgba(30,42,82,.16)"/>' +
      '<g class="' + (mood === "cheer" ? "hop" : "float") + '">' +
      '<line x1="80" y1="34" x2="80" y2="21" stroke="' + EDGE + '" stroke-width="4" stroke-linecap="round"/>' +
      '<circle class="ant" cx="80" cy="14" r="8" fill="' + ANT + '" stroke="' + EDGE + '" stroke-width="3"/>' +
      '<rect x="14" y="62" width="16" height="36" rx="8" fill="' + EDGE + '"/><rect x="130" y="62" width="16" height="36" rx="8" fill="' + EDGE + '"/>' +
      left + right +
      '<rect x="50" y="120" width="60" height="46" rx="22" fill="' + HEAD + '" stroke="' + EDGE + '" stroke-width="4"/>' +
      '<rect x="62" y="132" width="36" height="22" rx="11" fill="' + CHEST + '"/><circle cx="80" cy="143" r="4.5" fill="#FF914D"/>' +
      '<ellipse cx="80" cy="172" rx="20" ry="8" fill="#6C80C8" stroke="' + EDGE + '" stroke-width="3"/>' +
      '<rect x="26" y="34" width="108" height="86" rx="38" fill="' + HEAD + '" stroke="' + EDGE + '" stroke-width="4"/>' +
      '<rect x="40" y="50" width="80" height="54" rx="24" fill="' + VISOR + '"/>' +
      '<ellipse cx="52" cy="58" rx="7" ry="3" fill="#fff" opacity=".25" transform="rotate(-25 52 58)"/>' +
      face(mood) + extra + "</g></svg>";
  };
  UI.mountMascots = function (root) {
    (root || document).querySelectorAll("[data-mascot]").forEach(function (el) {
      el.innerHTML = UI.mascot(el.getAttribute("data-mascot"), el.getAttribute("data-class") || "");
    });
  };

  /* ---------- badge art ---------- */
  var GLYPH = {
    compass: '<circle cx="50" cy="50" r="19" fill="none" stroke="#fff" stroke-width="5"/><path d="M60 40 L54 55 L40 60 L46 45 Z" fill="#fff"/>',
    magnifier: '<circle cx="46" cy="46" r="15" fill="none" stroke="#fff" stroke-width="6"/><path d="M57 57 L71 71" stroke="#fff" stroke-width="7" stroke-linecap="round"/>',
    sparkle: '<path d="M50 24 L57 43 L76 50 L57 57 L50 76 L43 57 L24 50 L43 43 Z" fill="#fff"/><circle cx="73" cy="27" r="4" fill="#fff"/>',
    shield: '<path d="M50 24 L70 32 V50 C70 62 61 70 50 75 C39 70 30 62 30 50 V32 Z" fill="#fff"/>',
    star: '<path d="M50 24 L57 43 L77 44.5 L61.5 57 L66.5 76 L50 65.5 L33.5 76 L38.5 57 L23 44.5 L43 43 Z" fill="#fff"/>',
    flag: '<path d="M36 74 V27" stroke="#fff" stroke-width="6" stroke-linecap="round"/><path d="M36 30 H68 L60 42 L68 54 H36 Z" fill="#fff"/>',
    flame: '<path d="M50 24 C53 38 68 43 68 59 A18 18 0 0 1 32 59 C32 51 36 47 40 43 C41 50 44 52 47 52 C48 43 45 35 50 24 Z" fill="#fff"/>',
    bolt: '<path d="M55 24 L35 55 H48 L43 77 L66 44 H52 Z" fill="#fff"/>',
    calendar: '<rect x="29" y="32" width="42" height="38" rx="7" fill="none" stroke="#fff" stroke-width="5"/><path d="M29 44 H71 M39 26 V36 M61 26 V36" stroke="#fff" stroke-width="5" stroke-linecap="round"/><path d="M40 57 L47 63 L60 51" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>',
    gamepad: '<rect x="24" y="38" width="52" height="30" rx="15" fill="none" stroke="#fff" stroke-width="5"/><path d="M38 46 V60 M31 53 H45" stroke="#fff" stroke-width="5" stroke-linecap="round"/><circle cx="60" cy="50" r="3.5" fill="#fff"/><circle cx="68" cy="57" r="3.5" fill="#fff"/>'
  };
  UI.badgeSVG = function (id, locked) {
    var b = D.BADGES.filter(function (x) { return x.id === id; })[0];
    if (!b) return "";
    return '<svg viewBox="0 0 100 100" role="img" aria-label="' + UI.esc(b.name) + (locked ? " (locked)" : "") + '">' +
      '<polygon points="50,5 91,27.5 91,72.5 50,95 9,72.5 9,27.5" fill="' + b.color + '" stroke="rgba(0,0,0,.28)" stroke-width="5" stroke-linejoin="round"/>' +
      '<polygon points="50,13 84,32 84,68 50,87 16,68 16,32" fill="none" stroke="rgba(255,255,255,.35)" stroke-width="2.5"/>' +
      (GLYPH[b.glyph] || "") + "</svg>";
  };
  UI.badgeMeta = function (id) { return D.BADGES.filter(function (x) { return x.id === id; })[0]; };

  /* ---------- header chips ---------- */
  UI.chrome = function () {
    var s = S.get(), li = S.levelInfo(s);
    document.querySelectorAll("[data-xp]").forEach(function (e) { e.textContent = s.xp.toLocaleString(); });
    document.querySelectorAll("[data-streak]").forEach(function (e) { e.textContent = S.streakNow(s); });
    document.querySelectorAll("[data-level]").forEach(function (e) { e.textContent = li.n >= 5 ? "Navigator" : "Level " + li.n; });
  };

  /* ---------- toasts ---------- */
  function toastHost() {
    var h = document.querySelector(".toasts");
    if (!h) { h = document.createElement("div"); h.className = "toasts"; h.setAttribute("aria-live", "polite"); document.body.appendChild(h); }
    return h;
  }
  UI.toast = function (html, ms) {
    var t = document.createElement("div"); t.className = "toast"; t.innerHTML = html;
    toastHost().appendChild(t);
    setTimeout(function () { t.style.opacity = "0"; t.style.transition = "opacity .4s"; setTimeout(function () { t.remove(); }, 450); }, ms || 3800);
  };
  UI.badgeToast = function (id) {
    var b = UI.badgeMeta(id);
    if (b) UI.toast(UI.badgeSVG(id) + "<span>Badge earned!<br><small>" + UI.esc(b.name) + "</small></span>", 4500);
  };

  /* ---------- confetti ---------- */
  UI.confetti = function (power) {
    if (UI.reduced()) return;
    var cv = document.createElement("canvas"); cv.className = "confetti"; document.body.appendChild(cv);
    var ctx = cv.getContext("2d"), w = cv.width = global.innerWidth, h = cv.height = global.innerHeight;
    var cols = ["#3C75A6", "#6C80C8", "#CB6CE6", "#FF914D", "#FFB13D", "#2FB67C"], n = power === "big" ? 220 : 110, ps = [];
    for (var i = 0; i < n; i++) ps.push({ x: w / 2 + (Math.random() - .5) * 200, y: h * 0.35, vx: (Math.random() - .5) * 14, vy: -Math.random() * 14 - 4, r: Math.random() * 6 + 4, c: cols[i % cols.length], a: Math.random() * 6, va: (Math.random() - .5) * .4 });
    var t0 = Date.now();
    (function frame() {
      var t = Date.now() - t0; ctx.clearRect(0, 0, w, h);
      ps.forEach(function (p) {
        p.vy += .38; p.x += p.vx; p.y += p.vy; p.a += p.va; p.vx *= .99;
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.a); ctx.fillStyle = p.c; ctx.globalAlpha = Math.max(0, 1 - t / 3200);
        ctx.fillRect(-p.r / 2, -p.r / 3, p.r, p.r * .66); ctx.restore();
      });
      if (t < 3200) global.requestAnimationFrame(frame); else cv.remove();
    })();
  };

  /* ---------- name prompt (optional, stays on this device) ---------- */
  UI.askName = function (done) {
    var s = S.get();
    if (s.name || s.notes.askedName) { if (done) done(); return; }
    var o = document.createElement("div"); o.className = "overlay";
    o.innerHTML = '<div class="modal" role="dialog" aria-modal="true" aria-labelledby="nm-t"><div class="center">' + UI.mascot("wave") +
      '</div><h2 id="nm-t" class="center">What should Byte call you?</h2><p class="center muted">Optional. Your name is saved only on this device and never sent anywhere.</p>' +
      '<label class="sr-only" for="nm-in">Your first name or nickname</label><input type="text" id="nm-in" maxlength="24" placeholder="First name or nickname" autocomplete="off">' +
      '<div class="btn-row" style="margin-top:1rem;justify-content:center"><button class="btn orange" id="nm-go" type="button">Let’s go</button><button class="btn ghost" id="nm-skip" type="button">Skip</button></div></div>';
    document.body.appendChild(o);
    var inp = o.querySelector("#nm-in"); inp.focus();
    function close(save) {
      if (save && inp.value.trim()) S.setName(inp.value);
      S.setNote("askedName", 1); o.remove(); if (done) done();
    }
    o.querySelector("#nm-go").onclick = function () { close(true); };
    o.querySelector("#nm-skip").onclick = function () { close(false); };
    inp.addEventListener("keydown", function (e) { if (e.key === "Enter") close(true); if (e.key === "Escape") close(false); });
  };

  UI.fmtTime = function (sec) { var m = Math.floor(sec / 60), s = sec % 60; return m + ":" + (s < 10 ? "0" : "") + s; };

  global.AIQ.ui = UI;
  document.addEventListener("DOMContentLoaded", function () { UI.mountMascots(); UI.chrome(); });
})(window);
