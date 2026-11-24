/* =========================================================
   AI Quest — progress store
   Saves XP, levels, badges, streaks and notes in the student's own browser
   (localStorage). No accounts, no logins, no data sent anywhere.
   ========================================================= */
(function (global) {
  "use strict";
  var D = global.AIQ_DATA;
  var KEY = "aiquest.v1";
  var mem = null; // fallback when storage is blocked

  function blank() {
    return {
      v: 1, name: "", xp: 0, done: {}, badges: {},
      streak: { count: 0, best: 0, last: "" },
      daily: {}, dailyCount: 0, xpLog: {},
      games: {}, practice: {}, notes: {},
      teacher: false, stats: { answered: 0, correct: 0 },
      perfect: 0, arcade: false, time: 0
    };
  }
  function read() {
    try {
      var raw = global.localStorage.getItem(KEY);
      if (raw) { var s = Object.assign(blank(), JSON.parse(raw)); mem = s; return s; }
    } catch (e) { if (mem) return mem; }
    return mem || blank();
  }
  function write(s) {
    mem = s;
    try { global.localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) { /* storage blocked: keep in memory */ }
  }
  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function dstr(d) { return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()); }
  function today() { return dstr(new Date()); }
  function yesterday() { var d = new Date(); d.setDate(d.getDate() - 1); return dstr(d); }
  function dayNumber() { var d = new Date(); return Math.floor(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 86400000); }

  /* ---------- structure queries ---------- */
  function modUnlocked(s, n) { return s.teacher || n === 1 || !!s.done["module-" + (n - 1)]; }
  function finalUnlocked(s) { return s.teacher || !!s.done["module-4"]; }
  function modsDone(s) { var c = 0; for (var i = 1; i <= 4; i++) if (s.done["module-" + i]) c++; return c; }

  /* 'done' | 'current' | 'open' | 'locked' */
  function actStatus(s, id) {
    var a = D.ACTS[id];
    if (s.done[id]) return "done";
    if (a.type === "final") return finalUnlocked(s) ? "current" : "locked";
    if (!modUnlocked(s, a.mod)) return "locked";
    var m = D.MODULES[a.mod - 1];
    var idx = m.acts.indexOf(id);
    var prevDone = m.acts.slice(0, idx).every(function (x) { return s.done[x]; });
    if (!prevDone && !s.teacher) return "locked";
    var firstNot = null;
    for (var i = 0; i < m.acts.length; i++) { if (!s.done[m.acts[i]]) { firstNot = m.acts[i]; break; } }
    return firstNot === id ? "current" : "open";
  }
  function nextActivity(s) {
    for (var i = 0; i < D.MODULES.length; i++) {
      var m = D.MODULES[i];
      for (var j = 0; j < m.acts.length; j++) {
        var id = m.acts[j];
        if (!s.done[id]) { var st = actStatus(s, id); if (st === "current" || st === "open") return id; }
      }
    }
    if (!s.done["final"] && finalUnlocked(s)) return "final";
    return null;
  }
  function moduleXp(s, m) {
    var t = 0;
    m.acts.forEach(function (id) { if (s.done[id]) t += D.ACTS[id].xp; });
    if (s.done["module-" + m.n]) t += D.XP.module;
    return t;
  }
  /* Level = the module you are working on. The bar fills as you earn that level’s XP. */
  function levelInfo(s) {
    var c = modsDone(s);
    if (s.done["final"] && c >= 4) {
      return { n: 5, label: "AI Navigator", name: "Certified", into: 1, size: 1, pct: 100, remaining: 0, complete: true, next: "You’ve completed everything. Great work!" };
    }
    if (c >= 4) {
      return { n: 4, label: "Final Application", name: "Capstone", into: 0, size: D.XP.final, pct: 0, remaining: D.XP.final, complete: false, next: "Final Application → AI Navigator" };
    }
    var m = D.MODULES[c];
    var into = moduleXp(s, m);
    return {
      n: m.n, label: m.level + ": " + m.levelName, name: m.levelName, into: into, size: m.maxXp,
      pct: Math.round(100 * into / m.maxXp), remaining: m.maxXp - into, complete: false,
      next: (m.n < 4 ? "Level " + (m.n + 1) : "Final Application")
    };
  }
  function streakNow(s) {
    var t = today();
    return (s.streak.last === t || s.streak.last === yesterday()) ? s.streak.count : 0;
  }
  function touch(s) {
    var t = today();
    if (s.streak.last === t) return;
    s.streak.count = (s.streak.last === yesterday()) ? s.streak.count + 1 : 1;
    s.streak.last = t;
    if (s.streak.count > s.streak.best) s.streak.best = s.streak.count;
  }

  /* ---------- badges ---------- */
  function checkBadges(s, out) {
    var t = today();
    function give(id) { if (!s.badges[id]) { s.badges[id] = t; out.newBadges.push(id); } }
    var anyDone = Object.keys(s.done).some(function (k) { return D.ACTS[k]; });
    if (anyDone || s.dailyCount > 0) give("firststep");
    if (s.done["module-1"]) give("explorer");
    if (s.done["m2-quiz"]) give("detective");
    if (s.done["m3-challenge"]) give("promptpro");
    if (s.done["module-4"]) give("guardian");
    if (modsDone(s) >= 4 && s.done["final"]) give("navigator");
    if (s.streak.count >= 3) give("onfire");
    if (s.perfect >= 1) give("sharp");
    if (s.dailyCount >= 5) give("dailydoer");
    if (s.arcade) give("arcade");
  }
  function newOut(s) { return { gained: 0, items: [], newBadges: [], moduleDone: 0, levelBefore: levelInfo(s).n, levelAfter: 0, first: false }; }
  function add(s, out, xp, label) {
    s.xp += xp; var t = today(); s.xpLog[t] = (s.xpLog[t] || 0) + xp;
    out.gained += xp; out.items.push({ label: label, xp: xp });
  }

  /* ---------- recording results ---------- */
  function recordActivity(id, res) {
    var s = read(), a = D.ACTS[id], out = newOut(s);
    var mistakes = res.mistakes || 0, total = res.total || 0;
    s.stats.answered += total; s.stats.correct += Math.max(0, total - mistakes);
    s.time += res.seconds || 0;
    out.first = !s.done[id];
    if (out.first) {
      s.done[id] = { at: Date.now(), mistakes: mistakes, total: total };
      add(s, out, a.xp, a.kind + ": " + a.title);
    } else if (mistakes < (s.done[id].mistakes || 0)) {
      s.done[id].mistakes = mistakes;
    }
    if (a.type === "quiz" && mistakes === 0 && total > 0) s.perfect = (s.perfect || 0) + 1;
    if (a.mod >= 1 && a.mod <= 4) {
      var m = D.MODULES[a.mod - 1];
      if (!s.done["module-" + a.mod] && m.acts.every(function (x) { return s.done[x]; })) {
        s.done["module-" + a.mod] = { at: Date.now() };
        add(s, out, D.XP.module, "Level " + a.mod + " complete: " + m.levelName);
        out.moduleDone = a.mod;
      }
    }
    touch(s);
    checkBadges(s, out);
    out.levelAfter = levelInfo(s).n;
    write(s);
    return out;
  }
  function recordDaily(res) {
    var s = read(), out = newOut(s), t = today();
    s.stats.answered += res.total || 0; s.stats.correct += Math.max(0, (res.total || 0) - (res.mistakes || 0));
    out.first = !s.daily[t];
    if (out.first) {
      s.daily[t] = { at: Date.now(), clean: (res.mistakes || 0) === 0 };
      s.dailyCount = (s.dailyCount || 0) + 1;
      add(s, out, D.XP.daily, "Daily challenge");
    }
    touch(s); checkBadges(s, out); out.levelAfter = levelInfo(s).n;
    write(s); return out;
  }
  function recordGame(id, score, pct, total) {
    var s = read(), out = newOut(s), g = s.games[id] || { best: 0, bestPct: 0, plays: 0 };
    out.newBest = score > g.best;
    g.best = Math.max(g.best, score); g.bestPct = Math.max(g.bestPct, pct); g.plays++;
    s.games[id] = g;
    if (pct >= 80 && total >= 5) s.arcade = true;
    touch(s); checkBadges(s, out); write(s); return out;
  }
  function recordPractice(n, pct) {
    var s = read(), out = newOut(s), p = s.practice["m" + n] || { best: 0, plays: 0 };
    p.best = Math.max(p.best, pct); p.plays++; s.practice["m" + n] = p;
    touch(s); checkBadges(s, out); write(s); return out;
  }

  /* ---------- daily challenge selection ---------- */
  function dailyDoneToday(s) { return !!s.daily[today()]; }
  function dailyTopic(s) {
    var open = [];
    for (var n = 1; n <= 4; n++) if (modUnlocked(s, n)) open.push(n);
    return open[dayNumber() % open.length];
  }
  function dailyItem(topic) {
    var items = D.DAILY[topic].items;
    return items[(dayNumber() + topic) % items.length];
  }

  /* ---------- misc ---------- */
  function lastDays(s, n) {
    var out = [], d = new Date();
    for (var i = n - 1; i >= 0; i--) {
      var x = new Date(d.getFullYear(), d.getMonth(), d.getDate() - i);
      var k = dstr(x);
      out.push({ date: k, label: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"][x.getDay()], xp: s.xpLog[k] || 0, today: i === 0 });
    }
    return out;
  }
  function setName(n) { var s = read(); s.name = String(n || "").trim().slice(0, 24); write(s); }
  function setTeacher(b) { var s = read(); s.teacher = !!b; write(s); }
  function setNote(k, v) { var s = read(); s.notes[k] = v; write(s); }
  function reset() { mem = null; try { global.localStorage.removeItem(KEY); } catch (e) { } }
  function accuracy(s) { return s.stats.answered ? Math.round(100 * s.stats.correct / s.stats.answered) : 0; }

  global.AIQ = global.AIQ || {};
  global.AIQ.store = {
    get: read, today: today, dayNumber: dayNumber,
    modUnlocked: modUnlocked, finalUnlocked: finalUnlocked, modsDone: modsDone,
    actStatus: actStatus, nextActivity: nextActivity, moduleXp: moduleXp,
    levelInfo: levelInfo, streakNow: streakNow, lastDays: lastDays, accuracy: accuracy,
    recordActivity: recordActivity, recordDaily: recordDaily, recordGame: recordGame, recordPractice: recordPractice,
    dailyDoneToday: dailyDoneToday, dailyTopic: dailyTopic, dailyItem: dailyItem,
    setName: setName, setTeacher: setTeacher, setNote: setNote, reset: reset
  };
})(window);
