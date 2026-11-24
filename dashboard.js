/* AI Quest — personal dashboard */
(function (global) {
  "use strict";
  var D = global.AIQ_DATA, S = global.AIQ.store, UI = global.AIQ.ui;
  var host = document.getElementById("dash-root");
  if (!host) return;

  function esc(t) { return UI.esc(t); }
  function chartSVG(days) {
    var W = 360, H = 170, padL = 10, padB = 26, top = 24, n = days.length;
    var max = Math.max.apply(null, days.map(function (d) { return d.xp; }).concat([100]));
    var bw = 34, gap = (W - padL * 2 - bw * n) / (n - 1), base = H - padB, ph = base - top;
    var out = '<svg class="chart" viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="XP earned in the last 7 days">' +
      '<line x1="0" y1="' + base + '" x2="' + W + '" y2="' + base + '" stroke="#DDE2F0" stroke-width="2"/>';
    days.forEach(function (d, i) {
      var h = d.xp ? Math.max(8, Math.round(ph * d.xp / max)) : 4, x = padL + i * (bw + gap);
      out += '<rect x="' + x + '" y="' + (base - h) + '" width="' + bw + '" height="' + h + '" rx="8" fill="' + (d.today ? "#FF914D" : (d.xp ? "#6C80C8" : "#E3E6F0")) + '"/>';
      if (d.xp) out += '<text x="' + (x + bw / 2) + '" y="' + (base - h - 6) + '" text-anchor="middle">' + d.xp + "</text>";
      out += '<text x="' + (x + bw / 2) + '" y="' + (H - 8) + '" text-anchor="middle" style="font-weight:' + (d.today ? 800 : 600) + '">' + d.label + "</text>";
    });
    return out + "</svg>";
  }

  function render() {
    var s = S.get(), li = S.levelInfo(s), streak = S.streakNow(s), next = S.nextActivity(s);
    var actIds = Object.keys(D.ACTS), doneCount = actIds.filter(function (k) { return s.done[k]; }).length;
    var hi = s.name ? "Hi, " + esc(s.name) + "!" : "Welcome back!";
    var mood = streak >= 3 ? "cheer" : "happy";
    var h = "";

    /* ---- left column ---- */
    h += '<div class="dash"><div class="grid" style="gap:1.25rem">';
    h += '<section class="card welcome" aria-label="Welcome">' + UI.mascot(mood) +
      '<div><h1>' + hi + "</h1><p class='lead' style='margin-bottom:.8rem'>" +
      (doneCount === 0 ? "Ready for your first lesson? Level 1 takes about 10 minutes." :
        next ? "Up next: <b>" + esc(D.ACTS[next].title) + "</b>." : "You’ve finished everything. Amazing work, Navigator!") + "</p>" +
      (next ? '<a class="btn orange" href="activity.html?id=' + next + '">' + (doneCount === 0 ? "Start Level 1" : "Continue") + "</a>"
        : '<a class="btn orange" href="certificate.html">View certificate</a>') + "</div></section>";

    h += '<section class="level-card" aria-label="Level progress"><div class="n" style="font-family:var(--font-head);letter-spacing:.1em;text-transform:uppercase;font-size:.9rem;opacity:.9">Your level</div>' +
      "<h2>" + esc(li.label) + "</h2>" +
      '<div class="meta"><span>' + li.into + " / " + li.size + " XP</span><span>" + (li.complete ? "Complete!" : li.remaining + " XP to " + esc(li.next)) + "</span></div>" +
      '<div class="bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + li.pct + '" aria-label="XP toward next level"><i style="width:' + li.pct + '%"></i></div></section>';

    h += '<section class="kpis" aria-label="Your stats">' +
      '<div class="kpi"><b>' + s.xp.toLocaleString() + "</b><span>Total XP</span></div>" +
      '<div class="kpi"><b>' + streak + "</b><span>Day streak</span></div>" +
      '<div class="kpi"><b>' + doneCount + "/" + actIds.length + "</b><span>Activities done</span></div>" +
      '<div class="kpi"><b>' + (s.stats.answered ? S.accuracy(s) + "%" : "–") + "</b><span>Accuracy</span></div></section>";

    /* learning path */
    h += '<section class="card" aria-label="Level path"><h2 style="font-size:1.4rem">Your path</h2><div class="path-mini">';
    D.MODULES.forEach(function (m) {
      var done = !!s.done["module-" + m.n], cur = !done && S.modUnlocked(s, m.n) && li.n === m.n;
      h += '<a class="pm-node ' + (done ? "done" : cur ? "current" : "") + '" href="course.html#m' + m.n + '" style="text-decoration:none;color:inherit"><div class="pm-dot">' + (done ? UI.icon("check") .replace("<svg", '<svg width="26" height="26"') : m.n) + "</div>L" + m.n + "<br><span class='muted' style='font-weight:700'>" + esc(m.levelName) + "</span></a>";
    });
    var fd = !!s.done["final"], fc = !fd && S.finalUnlocked(s) && li.n >= 4 && S.modsDone(s) >= 4;
    h += '<a class="pm-node ' + (fd ? "done" : fc ? "current" : "") + '" href="course.html#mf" style="text-decoration:none;color:inherit"><div class="pm-dot">' + (fd ? UI.icon("check").replace("<svg", '<svg width="26" height="26"') : "★") + "</div>Final<br><span class='muted' style='font-weight:700'>Certificate</span></a>";
    h += "</div></section>";

    h += '<section class="card" aria-label="XP this week"><h2 style="font-size:1.4rem">XP this week</h2>' + chartSVG(S.lastDays(s, 7)) + "</section>";
    h += "</div>";

    /* ---- right column ---- */
    h += '<div class="grid" style="gap:1.25rem">';
    var topic = S.dailyTopic(s), dd = S.dailyDoneToday(s);
    h += '<section class="card daily ' + (dd ? "done" : "") + '" aria-label="Daily challenge"><span class="pill ' + (dd ? "green" : "orange") + '">Daily challenge</span>' +
      "<h3 style='margin-top:.5rem'>" + esc(D.DAILY[topic].title) + "</h3>" +
      (dd ? "<p>Done for today! Come back tomorrow for a new one.</p><a class='btn ghost small' href='activity.html?id=daily'>Practice again</a>" :
        "<p>One quick question. Earn <b>+" + D.XP.daily + " XP</b> and keep your streak going.</p><a class='btn orange' href='activity.html?id=daily'>Start</a>") + "</section>";

    h += '<section class="card" aria-label="Badges"><h2 style="font-size:1.4rem">Badges <span class="muted" style="font-size:1rem;font-family:var(--font-body);font-weight:800">' + Object.keys(s.badges).length + "/" + D.BADGES.length + '</span></h2><div class="badge-grid">' +
      D.BADGES.map(function (b) {
        var got = !!s.badges[b.id];
        return '<div class="badge ' + (got ? "" : "locked") + '" title="' + esc(b.desc) + '">' + UI.badgeSVG(b.id, !got) + esc(b.name) + "<small>" + (got ? "Earned!" : esc(b.desc)) + "</small></div>";
      }).join("") + "</div></section>";

    var gl = D.GAMES.filter(function (g) { return s.games[g.id]; });
    h += '<section class="card" aria-label="High scores"><h2 style="font-size:1.4rem">High scores</h2>' +
      (gl.length ? '<ul class="list">' + gl.map(function (g) { return "<li><span>" + esc(g.title) + "</span><b>" + s.games[g.id].best + "</b></li>"; }).join("") + "</ul>"
        : '<div class="empty">Play a game on the <a href="learn.html">Learn page</a> to set your first high score!</div>') + "</section>";

    h += '<section class="card" aria-label="Settings"><h2 style="font-size:1.4rem">Settings</h2>' +
      '<label class="l" for="nm" style="margin-top:0">Your name (stays on this device)</label><input type="text" id="nm" maxlength="24" value="' + esc(s.name) + '" placeholder="First name or nickname">' +
      '<div style="margin-top:1rem"><label class="switch"><input type="checkbox" id="teach"' + (s.teacher ? " checked" : "") + '> Teacher preview: unlock everything</label>' +
      '<p class="muted" style="font-size:.9rem;margin:.3rem 0 0">Lets teachers and reviewers explore every level without earning them first.</p></div>' +
      '<div class="btn-row" style="margin-top:1rem"><button class="btn ghost small" id="reset" type="button">Reset my progress</button></div></section>';
    h += "</div></div>";

    host.innerHTML = h;

    var nm = host.querySelector("#nm");
    nm.addEventListener("change", function () { S.setName(nm.value); UI.chrome(); render(); });
    host.querySelector("#teach").addEventListener("change", function (e) { S.setTeacher(e.target.checked); render(); });
    var rs = host.querySelector("#reset"), armed = false;
    rs.addEventListener("click", function () {
      if (!armed) { armed = true; rs.textContent = "Tap again to erase everything"; rs.className = "btn small orange"; setTimeout(function () { armed = false; if (rs.isConnected) { rs.textContent = "Reset my progress"; rs.className = "btn ghost small"; } }, 4000); return; }
      S.reset(); UI.chrome(); render();
    });
    UI.chrome();
  }
  render();
  UI.askName(render);
})(window);
