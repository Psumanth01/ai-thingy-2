/* =========================================================
   AI Quest — activity player
   Runs lessons, challenges, quizzes, daily challenges, practice quizzes and games.
   Flow: Learn → Challenge → Quiz → Earn XP.  Misses are re-queued once (like Duolingo).
   ========================================================= */
(function (global) {
  "use strict";
  var D = global.AIQ_DATA, S = global.AIQ.store, UI = global.AIQ.ui;
  var params = new URLSearchParams(global.location.search);
  var id = params.get("id") || "";
  var root = document.getElementById("player");
  if (!root) return;

  /* ---------- resolve what we are playing ---------- */
  function clone(o) { return JSON.parse(JSON.stringify(o)); }
  function resolve() {
    var s = S.get(), m;
    if (D.ACTS[id]) {
      var a = D.ACTS[id];
      var locked = S.actStatus(s, id) === "locked";
      var mod = a.mod <= 4 ? D.MODULES[a.mod - 1] : null;
      return { kind: "act", id: id, a: a, locked: locked, title: a.title, tag: (mod ? mod.level + " · " : "") + a.kind, steps: clone(a.steps),
        graded: a.type !== "lesson", exit: "course.html", exitLabel: "Back to course", mod: a.mod };
    }
    if (id === "daily" || (m = /^daily-m([1-4])$/.exec(id))) {
      var topic = m ? +m[1] : S.dailyTopic(s);
      var locked2 = !S.modUnlocked(s, topic);
      var item = clone(S.dailyItem(topic));
      return { kind: "daily", id: id, topic: topic, locked: locked2, title: D.DAILY[topic].title, tag: "Daily challenge", steps: [item], graded: true,
        exit: "dashboard.html", exitLabel: "Back to dashboard" };
    }
    if ((m = /^practice-m([1-4])$/.exec(id))) {
      var n = +m[1], mm = D.MODULES[n - 1];
      var pool = clone(D.ACTS[mm.acts[2]].steps).concat(clone(D.PRACTICE_EXTRA[n] || []));
      if (D.DAILY[n]) pool = pool.concat(clone(D.DAILY[n].items));
      pool = pool.filter(function (x) { return x.t === "mcq" || x.t === "spot" || x.t === "match" || x.t === "sort"; });
      var steps = UI.shuffle(pool).slice(0, 6);
      return { kind: "practice", id: id, n: n, locked: !S.modUnlocked(s, n), title: "Practice quiz: " + mm.levelName, tag: mm.level + " · Practice", steps: steps, graded: true,
        exit: "learn.html", exitLabel: "Back to Learn" };
    }
    for (var i = 0; i < D.GAMES.length; i++) {
      var g = D.GAMES[i];
      if (g.id === id) {
        var gsteps = g.prompts ? UI.shuffle(clone(D.PROMPT_GAME)) : [{ t: "rapid", game: clone(g) }];
        return { kind: "game", id: id, g: g, locked: false, title: g.title, tag: "Game", steps: gsteps, graded: !!g.prompts, exit: "learn.html", exitLabel: "Back to Learn" };
      }
    }
    return null;
  }

  var A = resolve();
  var GRADED = { mcq: 1, spot: 1, builder: 1, sort: 1, match: 1 };
  var REQUEUE = { mcq: 1, spot: 1, builder: 1 };
  var queue = [], idx = 0, missed = {}, total = 0, startedAt = Date.now();
  var ctrl = null, state = "idle", stepEl = null, foot, fbtext, fbtn, barFill, rapidActive = false;

  var X_ICON = UI.icon("x");

  function shell(inner, tagText) {
    root.innerHTML =
      '<header class="p-top"><a class="p-x" href="' + (A ? A.exit : "course.html") + '" aria-label="Exit and go back">' + X_ICON + "</a>" +
      '<div class="p-bar"><div class="bar slim" role="progressbar" aria-label="Progress" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><i id="pfill"></i></div></div>' +
      '<div class="p-title">' + (tagText || "") + "</div></header>" +
      '<main class="p-main" id="main"><div id="step" class="p-step"></div></main>' +
      '<div class="p-foot" id="foot"><div class="in"><div class="fbtext" id="fbtext" role="status" aria-live="polite"></div>' +
      '<button class="btn" id="fbtn" type="button" disabled>Continue</button></div></div>';
    foot = root.querySelector("#foot"); fbtext = root.querySelector("#fbtext"); fbtn = root.querySelector("#fbtn");
    barFill = root.querySelector("#pfill"); stepEl = root.querySelector("#step");
    fbtn.addEventListener("click", onFoot);
  }

  /* ---------- error / lock screens ---------- */
  function simpleScreen(mood, title, text, btns) {
    root.innerHTML = '<main class="p-main" style="padding-bottom:3rem"><div class="results">' + UI.mascot(mood) + "<h1>" + title + "</h1><p class='lead'>" + text + "</p>" +
      '<div class="btn-row" style="justify-content:center">' + btns + "</div></div></main>";
  }
  if (!A) { simpleScreen("oops", "Hmm, we couldn’t find that activity", "The link may be out of date.", '<a class="btn" href="course.html">Go to the course</a>'); return; }
  document.title = A.title + " · AI Quest";
  if (A.locked) {
    simpleScreen("oops", "This one is still locked", "Finish the activities before it to unlock this one. Each step builds on the last!",
      '<a class="btn" href="course.html">Back to course</a>');
    return;
  }

  /* ---------- queue ---------- */
  A.steps.forEach(function (st, i) { queue.push({ s: st, i: i, retry: false }); if (A.graded && GRADED[st.t]) total++; });

  /* ---------- helpers ---------- */
  function botRow(mood, say) {
    return '<div class="bot-row">' + UI.mascot(mood || "happy") + '<div class="bubble">' + say + "</div></div>";
  }
  function setBar() {
    var pct = Math.round(100 * idx / queue.length);
    barFill.style.width = pct + "%";
    barFill.parentNode.setAttribute("aria-valuenow", pct);
  }
  var PRAISE = ["Nice work!", "Exactly!", "You got it!", "Great thinking!", "Sharp!", "Correct!"];
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }

  var ctx = {
    setReady: function (b) { if (state === "idle") fbtn.disabled = !b; },
    label: function (t) { fbtn.textContent = t; },
    hideFoot: function (b) { foot.style.display = b ? "none" : ""; },
    finishGame: function (data) { finishGame(data); }
  };

  function show() {
    if (idx >= queue.length) { finish(); return; }
    var item = queue[idx];
    state = "idle"; foot.className = "p-foot"; fbtext.innerHTML = "";
    fbtn.disabled = true; fbtn.textContent = (item.s.t === "info" || item.s.t === "reveal" || item.s.t === "explore" || item.s.t === "reflect") ? "Continue" : "Check";
    ctx.hideFoot(false);
    stepEl.className = "p-step"; void stepEl.offsetWidth; stepEl.className = "p-step";
    stepEl.innerHTML = "";
    var r = Steps[item.s.t];
    ctrl = r(item.s, stepEl, ctx, item.retry);
    setBar();
    global.scrollTo(0, 0);
  }

  function onFoot() {
    if (fbtn.disabled) return;
    if (state === "feedback") { idx++; show(); return; }
    var r = ctrl.check();
    if (r) handleResult(r);
  }

  function handleResult(r) {
    var item = queue[idx];
    if (r.advance) { idx++; show(); return; }
    var good = r.tone ? r.tone === "good" : r.correct;
    if (A.graded && GRADED[item.s.t]) {
      if (r.correct === false || r.missed) missed[item.i] = 1;
      if (r.correct === false && REQUEUE[item.s.t] && !item.retry) {
        queue.push({ s: item.s, i: item.i, retry: true });
        r.text = (r.text || "") + " <i>You’ll see this one again at the end.</i>";
      }
    }
    state = "feedback";
    foot.className = "p-foot " + (good ? "good" : "bad");
    fbtext.innerHTML = "<b>" + (r.title || (good ? pick(PRAISE) : "Not quite")) + "</b>" + (r.text || "");
    fbtn.disabled = false; fbtn.textContent = "Continue"; fbtn.focus();
    setBar();
  }

  document.addEventListener("keydown", function (e) {
    var tag = (e.target && e.target.tagName) || "";
    if (e.key === "Enter" && tag !== "TEXTAREA" && tag !== "INPUT" && tag !== "BUTTON" && !fbtn.disabled && foot.style.display !== "none") { e.preventDefault(); onFoot(); }
    if (state === "idle" && ctrl && ctrl.key && /^[1-9]$/.test(e.key) && tag !== "TEXTAREA" && tag !== "INPUT") ctrl.key(+e.key);
  });

  /* =========================================================
     STEP RENDERERS
     ========================================================= */
  var Steps = {};

  Steps.info = function (s, el, c) {
    el.innerHTML = (s.say ? botRow(s.mood, s.say) : "") + "<h1>" + s.title + '</h1><div class="info-body">' + s.body + "</div>";
    c.setReady(true);
    return { check: function () { return { advance: true }; } };
  };

  Steps.reveal = function (s, el, c) {
    var open = 0, n = s.cards.length;
    el.innerHTML = "<h1>" + s.title + "</h1>" + (s.intro ? '<p class="lead">' + s.intro + "</p>" : "") +
      '<div class="rgrid">' + s.cards.map(function (cd, i) {
        return '<button type="button" class="rcard" data-i="' + i + '" aria-expanded="false"><div class="front">' + UI.icon(cd.icon || "bulb") + "<span>" + cd.front + '</span></div><div class="tap">Tap to flip</div><div class="back">' + cd.back + "</div></button>";
      }).join("") + '</div><p class="muted center" id="rc" style="margin-top:1rem;font-weight:800"></p>';
    var rc = el.querySelector("#rc");
    function upd() { rc.textContent = open + " of " + n + " flipped"; c.setReady(open === n); }
    upd();
    el.querySelectorAll(".rcard").forEach(function (b) {
      b.addEventListener("click", function () {
        if (!b.classList.contains("open")) { b.classList.add("open"); b.setAttribute("aria-expanded", "true"); open++; upd(); }
      });
    });
    return { check: function () { return { advance: true }; } };
  };

  Steps.mcq = function (s, el, c) {
    var order = s.opts.map(function (_, i) { return i; });
    if (s.shuffle && s.style !== "tf") order = UI.shuffle(order);
    var sel = -1, locked = false;
    function txt(o) { return typeof o === "string" ? o : o.x; }
    var tf = s.style === "tf";
    var head = "";
    if (s.situation) head += '<div class="situation"><span class="tag">' + (s.tag || "Situation") + "</span><br>" + s.situation + "</div>";
    if (s.style === "prompt" && s.say) head += '<div class="chat"><div class="msg user"><small>Your first try</small>' + s.say + "</div></div>";
    el.innerHTML = head + '<p class="qtext">' + s.q + '</p><div class="opts' + (tf ? " row2" : "") + '" role="group">' +
      order.map(function (oi, n) {
        return '<button type="button" class="opt' + (s.style === "prompt" ? " prompt" : "") + '" data-oi="' + oi + '" aria-pressed="false">' + (tf ? "" : '<span class="key">' + (n + 1) + "</span>") + "<span>" + txt(s.opts[oi]) + "</span></button>";
      }).join("") + "</div>";
    var btns = el.querySelectorAll(".opt");
    function choose(b) {
      if (locked) return;
      btns.forEach(function (x) { x.setAttribute("aria-pressed", "false"); });
      b.setAttribute("aria-pressed", "true"); sel = +b.getAttribute("data-oi"); c.setReady(true);
    }
    btns.forEach(function (b) { b.addEventListener("click", function () { choose(b); }); });
    return {
      key: function (n) { if (btns[n - 1]) choose(btns[n - 1]); },
      check: function () {
        if (sel < 0) return null;
        locked = true;
        var ok = sel === s.a, chosen = s.opts[sel], best = s.opts[s.a];
        btns.forEach(function (b) {
          var oi = +b.getAttribute("data-oi"); b.disabled = true;
          if (oi === s.a) b.classList.add("right"); else if (oi === sel) b.classList.add("wrong");
        });
        var text;
        if (ok) text = (typeof best === "object" && best.fb) ? best.fb : (s.why || "");
        else if (typeof chosen === "object" && chosen.fb) text = chosen.fb + " <br><small>Best choice: " + txt(best) + "</small>";
        else text = "Best answer: <b>" + txt(best) + "</b>. " + (s.why || "");
        return { correct: ok, text: text };
      }
    };
  };

  Steps.sort = function (s, el, c) {
    var items = UI.shuffle(s.items), i = 0, right = 0, answered = false, n = items.length;
    var cls = ["", "orange", "magenta"];
    function draw() {
      var it = items[i];
      el.innerHTML = '<div class="sort-wrap"><p class="qtext">' + s.q + '</p><div class="sort-count">Card ' + (i + 1) + " of " + n + '</div><div class="sort-card" id="sc">' + it.x + '</div><div class="sort-why" id="sw" aria-live="polite"></div><div class="sort-btns">' +
        s.buckets.map(function (b, k) { return '<button type="button" class="btn ' + cls[k] + '" data-k="' + k + '">' + b + "</button>"; }).join("") + "</div></div>";
      el.querySelectorAll(".sort-btns .btn").forEach(function (b) {
        b.addEventListener("click", function () {
          if (answered) return; answered = true;
          var k = +b.getAttribute("data-k"), ok = k === it.b, card = el.querySelector("#sc");
          if (ok) right++;
          card.classList.add(ok ? "right" : "wrong");
          el.querySelector("#sw").innerHTML = (ok ? "<b>✓ Correct.</b> " : "<b>✗ Not quite. This is “" + s.buckets[it.b] + ".”</b> ") + it.why;
          el.querySelectorAll(".sort-btns .btn").forEach(function (x) { x.disabled = true; });
          c.label(i === n - 1 ? "Finish" : "Next card"); c.setReady(true);
        });
      });
    }
    draw();
    return {
      key: function (k) { var b = el.querySelector('.sort-btns .btn[data-k="' + (k - 1) + '"]'); if (b) b.click(); },
      check: function () {
        if (!answered) return null;
        if (i < n - 1) { i++; answered = false; draw(); c.setReady(false); c.label("Next card"); return null; }
        var perfect = right === n;
        return { correct: perfect, missed: !perfect, tone: right >= Math.ceil(n * 0.6) ? "good" : "bad",
          title: perfect ? "Perfect sort!" : "You got " + right + " of " + n, text: s.after || "" };
      }
    };
  };

  Steps.match = function (s, el, c) {
    var n = s.pairs.length, done = 0, miss = 0, selL = null, selR = null;
    var L = UI.shuffle(s.pairs.map(function (p, i) { return { t: p[0], i: i }; }));
    var R = UI.shuffle(s.pairs.map(function (p, i) { return { t: p[1], i: i }; }));
    el.innerHTML = '<p class="qtext">' + s.q + '</p><p class="muted" style="font-weight:700">Tap one on the left, then its match on the right.</p><div class="match"><div class="col" id="ml">' +
      L.map(function (x) { return '<button type="button" class="mbtn" data-i="' + x.i + '">' + x.t + "</button>"; }).join("") +
      '</div><div class="col" id="mr">' + R.map(function (x) { return '<button type="button" class="mbtn" data-i="' + x.i + '">' + x.t + "</button>"; }).join("") + "</div></div>";
    function tryPair() {
      if (!selL || !selR) return;
      if (selL.getAttribute("data-i") === selR.getAttribute("data-i")) {
        [selL, selR].forEach(function (b) { b.classList.remove("sel"); b.classList.add("ok"); b.disabled = true; });
        done++; if (done === n) { c.label("Continue"); c.setReady(true); }
      } else {
        miss++; var a = selL, b = selR;
        a.classList.remove("sel"); b.classList.remove("sel"); a.classList.add("no"); b.classList.add("no");
        setTimeout(function () { a.classList.remove("no"); b.classList.remove("no"); }, 450);
      }
      selL = selR = null;
    }
    el.querySelectorAll("#ml .mbtn").forEach(function (b) {
      b.addEventListener("click", function () { if (b.disabled) return; if (selL) selL.classList.remove("sel"); selL = b; b.classList.add("sel"); tryPair(); });
    });
    el.querySelectorAll("#mr .mbtn").forEach(function (b) {
      b.addEventListener("click", function () { if (b.disabled) return; if (selR) selR.classList.remove("sel"); selR = b; b.classList.add("sel"); tryPair(); });
    });
    return {
      check: function () {
        return { correct: true, missed: miss > 0, tone: "good", title: miss === 0 ? "Perfect matching!" : "All matched!",
          text: miss ? "You needed " + miss + " extra " + (miss === 1 ? "try" : "tries") + ". Keep those pairs in mind." : "" };
      }
    };
  };

  Steps.spot = function (s, el, c) {
    var picked = {}, locked = false;
    el.innerHTML = '<p class="qtext">' + s.q + "</p>" + (s.intro ? '<p class="muted" style="font-weight:800;margin-bottom:.4rem">' + s.intro + "</p>" : "") +
      '<div class="doc"><div class="spot">' + s.sentences.map(function (x, i) {
        return '<button type="button" class="sline" data-i="' + i + '" aria-pressed="false"><span class="no">' + (i + 1) + "</span><span>" + x.x + "</span></button>";
      }).join("") + "</div></div>";
    var rows = el.querySelectorAll(".sline");
    rows.forEach(function (b) {
      b.addEventListener("click", function () {
        if (locked) return; var i = b.getAttribute("data-i");
        if (picked[i]) { delete picked[i]; b.setAttribute("aria-pressed", "false"); } else { picked[i] = 1; b.setAttribute("aria-pressed", "true"); }
        c.setReady(Object.keys(picked).length > 0);
      });
    });
    return {
      check: function () {
        locked = true; var all = true, hit = 0, wrongTotal = 0;
        rows.forEach(function (b) {
          var i = +b.getAttribute("data-i"), sn = s.sentences[i], p = !!picked[i];
          b.disabled = true; b.setAttribute("aria-pressed", "false");
          if (sn.wrong) wrongTotal++;
          if (sn.wrong && p) { b.classList.add("right"); hit++; b.querySelector("span:last-child").insertAdjacentHTML("beforeend", '<span class="fix">✓ Error: ' + sn.fix + "</span>"); }
          else if (sn.wrong && !p) { all = false; b.classList.add("miss"); b.querySelector("span:last-child").insertAdjacentHTML("beforeend", '<span class="fix">✗ You missed this error: ' + sn.fix + "</span>"); }
          else if (!sn.wrong && p) { all = false; b.classList.add("miss"); b.querySelector("span:last-child").insertAdjacentHTML("beforeend", '<span class="fix">✗ This one is actually correct.</span>'); }
          else b.classList.add("fine");
        });
        return { correct: all, title: all ? "You caught every error!" : "Not quite", text: all ? "Sharp eyes, detective." : "You found " + hit + " of " + wrongTotal + " errors. Check the highlighted lines." };
      }
    };
  };

  Steps.builder = function (s, el, c) {
    var choice = [], locked = false;
    var opts = s.slots.map(function (sl) { return UI.shuffle(sl.options.map(function (o, i) { return { o: o, i: i }; })); });
    el.innerHTML = '<p class="qtext">' + s.q + '</p><div class="situation"><span class="tag">Your goal</span><br>' + s.scenario + "</div>" +
      s.slots.map(function (sl, si) {
        return '<div class="slot"><h4>' + sl.label + '</h4><div class="opts">' + opts[si].map(function (x) {
          return '<button type="button" class="opt" data-s="' + si + '" data-o="' + x.i + '" aria-pressed="false"><span>' + x.o.x + "</span></button>";
        }).join("") + "</div></div>";
      }).join("") + '<h4 class="eyebrow" style="margin-top:1.2rem">Your prompt so far</h4><div class="preview" id="pv"></div>';
    var pv = el.querySelector("#pv");
    function preview() {
      pv.innerHTML = s.slots.map(function (sl, si) {
        return choice[si] == null ? '<span class="ph">[' + sl.label + "…]</span>" : sl.options[choice[si]].x;
      }).join(" ");
    }
    preview();
    el.querySelectorAll(".opt").forEach(function (b) {
      b.addEventListener("click", function () {
        if (locked) return; var si = +b.getAttribute("data-s");
        el.querySelectorAll('.opt[data-s="' + si + '"]').forEach(function (x) { x.setAttribute("aria-pressed", "false"); });
        b.setAttribute("aria-pressed", "true"); choice[si] = +b.getAttribute("data-o"); preview();
        c.setReady(s.slots.every(function (_, k) { return choice[k] != null; }));
      });
    });
    return {
      check: function () {
        locked = true; var bad = [];
        s.slots.forEach(function (sl, si) {
          var ch = sl.options[choice[si]];
          el.querySelectorAll('.opt[data-s="' + si + '"]').forEach(function (b) {
            var oi = +b.getAttribute("data-o"); b.disabled = true;
            if (sl.options[oi].good) b.classList.add("right"); else if (oi === choice[si]) b.classList.add("wrong");
          });
          if (!ch.good) bad.push("<b>" + sl.label + ":</b> " + ch.why);
        });
        var ok = bad.length === 0;
        return { correct: ok, title: ok ? "Your prompt has everything it needs!" : "Almost. " + bad.length + " part" + (bad.length > 1 ? "s" : "") + " could be stronger", text: ok ? "" : '<ul class="builder-why">' + bad.map(function (b) { return "<li>" + b + "</li>"; }).join("") + "</ul>" };
      }
    };
  };

  Steps.explore = function (s, el, c) {
    var saved = (S.get().notes[s.key]) || { checks: [], text: "" };
    el.innerHTML = "<h1>" + s.title + '</h1><p class="lead">' + s.intro + '</p><div class="checks">' +
      s.checks.map(function (t, i) { return '<label class="check"><input type="checkbox" data-i="' + i + '"><span>' + t + "</span></label>"; }).join("") +
      '</div><label class="l" for="ex-t">' + s.prompt + '</label><textarea id="ex-t" rows="3" maxlength="400" placeholder="Type your answer here…"></textarea><div class="counter" id="ex-c"></div>';
    var boxes = el.querySelectorAll("input[type=checkbox]"), ta = el.querySelector("#ex-t"), cn = el.querySelector("#ex-c");
    boxes.forEach(function (b) { if (saved.checks.indexOf(+b.getAttribute("data-i")) > -1) { b.checked = true; b.parentNode.classList.add("on"); } });
    ta.value = saved.text || "";
    function upd() {
      var n = 0; boxes.forEach(function (b) { b.parentNode.classList.toggle("on", b.checked); if (b.checked) n++; });
      var len = ta.value.trim().length;
      cn.textContent = n + " of " + s.minChecks + " checked · " + len + " / " + s.minChars + " characters";
      c.setReady(n >= s.minChecks && len >= s.minChars);
    }
    boxes.forEach(function (b) { b.addEventListener("change", upd); });
    ta.addEventListener("input", upd); upd();
    return {
      check: function () {
        var chk = []; boxes.forEach(function (b) { if (b.checked) chk.push(+b.getAttribute("data-i")); });
        S.setNote(s.key, { checks: chk, text: ta.value.trim() });
        return { correct: true, title: "Great spotting!", text: "AI is everywhere. Noticing it is the first step to using it wisely." };
      }
    };
  };

  Steps.reflect = function (s, el, c) {
    var saved = S.get().notes[s.key] || "";
    el.innerHTML = "<h1>" + s.title + '</h1><p class="lead">' + s.intro + '</p><label class="sr-only" for="rf-t">Your statement</label><textarea id="rf-t" rows="6" maxlength="900" placeholder="' + UI.esc(s.placeholder || "") + '"></textarea><div class="counter" id="rf-c"></div>';
    var ta = el.querySelector("#rf-t"), cn = el.querySelector("#rf-c"); ta.value = saved;
    function upd() { var len = ta.value.trim().length; cn.textContent = len + " / " + s.minChars + " characters minimum"; c.setReady(len >= s.minChars); }
    ta.addEventListener("input", upd); upd();
    return { check: function () { S.setNote(s.key, ta.value.trim()); return { correct: true, title: "Well said!", text: "Your statement is saved on this device. You can review it on your certificate page." }; } };
  };

  /* ---------- rapid-fire games ---------- */
  Steps.rapid = function (s, el, c) {
    var g = s.game; c.hideFoot(true); rapidActive = false;
    var cls = ["", "orange"];
    el.innerHTML = '<div class="results" style="padding-top:.5rem">' + UI.mascot("wave") + "<h1>" + g.title + "</h1><p class='lead'>" + g.desc + "</p>" +
      '<div class="card tint" style="text-align:left;max-width:520px;margin:1rem auto"><b>How it works</b><ul style="margin:.4rem 0 0;padding-left:1.2rem"><li>You have <b>' + g.seconds + " seconds</b>.</li><li>Tap the right category for each card.</li><li>Streaks of 3+ earn bonus points.</li></ul></div>" +
      '<button class="btn orange" id="go" type="button">Start!</button></div>';
    el.querySelector("#go").addEventListener("click", start);
    function start() {
      rapidActive = true;
      var pool = UI.shuffle(g.items), k = 0, score = 0, correct = 0, answered = 0, combo = 0, t = g.seconds * 10, locked = false;
      el.innerHTML = '<div class="sort-wrap"><div class="rapid-stats"><span>Score <b id="sc2">0</b></span><span class="combo" id="cb2"></span><span class="timer" id="tm">' + g.seconds + '</span></div>' +
        '<div class="bar slim" style="max-width:520px;margin:0 auto 1rem"><i id="tbar" style="width:100%"></i></div>' +
        '<div class="sort-card" id="sc"></div><div class="sort-why" id="sw" aria-live="polite"></div><div class="sort-btns">' +
        g.buckets.map(function (b, i) { return '<button type="button" class="btn ' + cls[i] + '" data-k="' + i + '">' + b + "</button>"; }).join("") + "</div></div>";
      var card = el.querySelector("#sc"), why = el.querySelector("#sw");
      function next() { if (k >= pool.length) { pool = UI.shuffle(g.items); k = 0; } card.className = "sort-card"; card.textContent = pool[k].x; locked = false; }
      next();
      var timer = global.setInterval(function () {
        t--; el.querySelector("#tm").textContent = Math.ceil(t / 10);
        el.querySelector("#tbar").style.width = (100 * t / (g.seconds * 10)) + "%";
        if (t <= 0) { global.clearInterval(timer); rapidActive = false; finishGame({ score: score, correct: correct, answered: answered }); }
      }, 100);
      el.querySelectorAll(".sort-btns .btn").forEach(function (b) {
        b.addEventListener("click", function () {
          if (locked || t <= 0) return; locked = true;
          var it = pool[k], ok = +b.getAttribute("data-k") === it.b; answered++;
          if (ok) { correct++; combo++; score += 10 + (combo >= 3 ? 5 : 0); } else combo = 0;
          el.querySelector("#sc2").textContent = score;
          el.querySelector("#cb2").textContent = combo >= 3 ? "Streak ×" + combo + "!" : "";
          card.classList.add(ok ? "right" : "wrong");
          why.innerHTML = ok ? "<b>✓</b> " + it.why : "<b>✗ " + g.buckets[it.b] + ".</b> " + it.why;
          k++; setTimeout(function () { if (t > 0) next(); }, ok ? 350 : 900);
        });
      });
      el.addEventListener("keydown", function () { });
    }
    return { check: function () { return null; }, key: function (n) { var b = el.querySelector('.sort-btns .btn[data-k="' + (n - 1) + '"]'); if (b) b.click(); } };
  };

  /* =========================================================
     RESULTS
     ========================================================= */
  function stat(cls, big, label) { return '<div class="res-stat ' + cls + '"><b>' + big + "</b>" + label + "</div>"; }
  function badgesHTML(list) {
    if (!list.length) return "";
    return '<h2 style="margin-top:1.2rem">New badge' + (list.length > 1 ? "s" : "") + "!</h2><div class='newbadges'>" + list.map(function (b) {
      var m = UI.badgeMeta(b); return '<div class="badge new">' + UI.badgeSVG(b) + UI.esc(m.name) + "<small>" + UI.esc(m.desc) + "</small></div>";
    }).join("") + "</div>";
  }
  function afterEffects(out, big) {
    UI.confetti(big ? "big" : "small");
    out.newBadges.forEach(function (b, i) { setTimeout(function () { UI.badgeToast(b); }, 600 + i * 900); });
  }
  function secs() { return Math.round((Date.now() - startedAt) / 1000); }
  function missCount() { return Object.keys(missed).length; }

  function finish() {
    barFill.style.width = "100%"; ctx.hideFoot(true);
    var seconds = secs(), mistakes = missCount(), out, html = "", accTxt = "—";
    var acc = total ? Math.round(100 * (total - mistakes) / total) : null;
    if (acc !== null) accTxt = acc + "%";
    var titleTxt = "Great job!", sub = "";
    if (A.kind === "act") {
      out = S.recordActivity(A.id, { mistakes: mistakes, total: total, seconds: seconds });
      var map = { lesson: "Lesson complete!", challenge: "Challenge complete!", quiz: "Knowledge check complete!", final: "Final Application complete!" };
      titleTxt = map[A.a.type] || "Complete!";
      if (!out.first) sub = "<p class='muted'>Practice run: you already earned the XP for this one. Great review!</p>";
    } else if (A.kind === "daily") {
      out = S.recordDaily({ mistakes: mistakes, total: total });
      titleTxt = "Daily challenge done!";
      sub = out.first ? "<p class='muted'>Come back tomorrow for a new one and keep your streak alive.</p>" : "<p class='muted'>You already earned today’s daily XP. Nice extra practice!</p>";
    } else if (A.kind === "practice") {
      out = S.recordPractice(A.n, acc);
      titleTxt = "Practice complete!"; sub = "<p class='muted'>Practice quizzes don’t earn XP, but they lock in your learning.</p>";
    } else {
      /* prompt game */
      out = S.recordGame(A.id, (total - mistakes) * 20, acc, total);
      titleTxt = "Round complete!"; sub = "<p class='muted'>Games don’t earn XP, but they sharpen your skills.</p>";
    }
    var mood = (acc !== null && acc < 60) ? "oops" : "cheer";
    var li = S.levelInfo(S.get());
    html += '<div class="results">' + UI.mascot(mood) + "<h1>" + titleTxt + "</h1>" + sub + '<div class="res-stats">';
    if (out.gained > 0 || A.kind === "act" || A.kind === "daily") html += stat("xp", "+" + out.gained, "XP earned");
    if (acc !== null) html += stat("acc", accTxt, "Accuracy");
    html += stat("time", UI.fmtTime(seconds), "Time") + "</div>";
    if (out.items.length > 1) html += '<ul class="list res-list">' + out.items.map(function (i) { return "<li><span>" + UI.esc(i.label) + "</span><b>+" + i.xp + " XP</b></li>"; }).join("") + "</ul>";
    if (out.moduleDone) {
      var m = D.MODULES[out.moduleDone - 1];
      html += '<div class="banner lvl">Level ' + out.moduleDone + " complete: " + UI.esc(m.levelName) + "! " + (out.moduleDone < 4 ? "Level " + (out.moduleDone + 1) + " is unlocked." : "The Final Application is unlocked.") + "</div>";
    }
    if (A.id === "final" && out.first) html += '<div class="banner lvl">You are now an AI Navigator!</div>';
    html += badgesHTML(out.newBadges);
    var nextId = S.nextActivity(S.get());
    html += '<div class="btn-row" style="justify-content:center;margin-top:1rem">';
    if (A.kind === "act" || A.kind === "daily") {
      if (A.id === "final") html += '<a class="btn orange" href="certificate.html">Get my certificate</a>';
      else if (nextId && A.kind === "act") html += '<a class="btn orange" href="activity.html?id=' + nextId + '">Next: ' + UI.esc(D.ACTS[nextId].title) + "</a>";
      else html += '<a class="btn orange" href="dashboard.html">Go to dashboard</a>';
      html += '<a class="btn ghost" href="' + A.exit + '">' + A.exitLabel + "</a>";
    } else {
      html += '<a class="btn orange" href="activity.html?id=' + A.id + '">Play again</a><a class="btn ghost" href="' + A.exit + '">' + A.exitLabel + "</a>";
    }
    html += "</div></div>";
    stepEl.innerHTML = html; stepEl.className = "p-step"; global.scrollTo(0, 0);
    var big = !!out.moduleDone || A.id === "final";
    if (out.first || out.newBadges.length) afterEffects(out, big);
    root.querySelector(".p-title").textContent = "Complete";
  }

  function finishGame(data) {
    var seconds = secs(), pct = data.answered ? Math.round(100 * data.correct / data.answered) : 0;
    var out = S.recordGame(A.id, data.score, pct, data.answered);
    var g = S.get().games[A.id];
    ctx.hideFoot(true); barFill.style.width = "100%";
    var html = '<div class="results">' + UI.mascot(pct >= 80 ? "cheer" : "happy") + "<h1>Time’s up!</h1>";
    if (out.newBest) html += "<p class='lead'><b>New high score!</b></p>";
    html += '<div class="res-stats">' + stat("xp", data.score, "Points") + stat("acc", pct + "%", data.correct + " of " + data.answered + " right") + stat("time", g.best, "Best score") + "</div>";
    if (pct >= 80 && data.answered >= 5) html += "<p class='muted'>80%+ accuracy: that’s Arcade Ace territory!</p>";
    else html += "<p class='muted'>Aim for 80% accuracy to earn the Arcade Ace badge.</p>";
    html += badgesHTML(out.newBadges);
    html += '<div class="btn-row" style="justify-content:center;margin-top:1rem"><a class="btn orange" href="activity.html?id=' + A.id + '">Play again</a><a class="btn ghost" href="learn.html">Back to Learn</a></div></div>';
    stepEl.innerHTML = html; global.scrollTo(0, 0);
    afterEffects(out, false); root.querySelector(".p-title").textContent = "Complete";
  }

  /* ---------- go! ---------- */
  shell("", A.tag + " · " + UI.esc(A.title));
  show();
})(window);
