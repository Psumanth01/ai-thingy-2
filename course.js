/* AI Quest — course map (the four levels + final application) */
(function (global) {
  "use strict";
  var D = global.AIQ_DATA, S = global.AIQ.store, UI = global.AIQ.ui;
  var host = document.getElementById("course-root");
  if (!host) return;
  var esc = UI.esc;

  var ICON = { lesson: "book", challenge: "target", quiz: "quiz", daily: "calendar", final: "trophy", cert: "cert" };

  function stop(id, st, o) {
    var a = D.ACTS[id], icon = (st === "done") ? "check" : (st === "locked" ? "lock" : o.icon);
    var inner = '<span class="dot">' + UI.icon(icon) + '</span><span><span class="t">' + esc(o.title) + (o.xp ? '<span class="xp-tag">+' + o.xp + " XP</span>" : "") + '</span><br><span class="s">' + esc(o.sub) + (st === "done" ? " · Completed" : st === "locked" ? " · Locked" : "") + "</span></span>";
    var cls = "stop " + (st === "open" ? "" : st) + (o.bonus ? " bonus" : "");
    if (st === "locked") return '<div class="' + cls + '" aria-disabled="true">' + inner + "</div>";
    return '<a class="' + cls + '" href="' + o.href + '">' + inner + "</a>";
  }

  function render() {
    var s = S.get(), h = "";
    var teach = '<div class="teacher-bar"><label class="switch"><input type="checkbox" id="teach"' + (s.teacher ? " checked" : "") + '> Teacher preview: unlock all levels</label><span class="muted" style="font-weight:700;font-size:.92rem">Great for reviewers who want to explore everything.</span></div>';
    h += teach + '<div style="height:1.6rem"></div>';

    D.MODULES.forEach(function (m) {
      var unlocked = S.modUnlocked(s, m.n), done = !!s.done["module-" + m.n];
      h += '<section class="module m' + m.n + (unlocked ? "" : " locked") + '" id="m' + m.n + '" aria-labelledby="mh' + m.n + '">' +
        '<div class="module-head"><div class="ml"><div class="n">' + m.level + " · " + esc(m.levelName) + "</div><h2 id=\"mh" + m.n + '">' + esc(m.name) + "</h2><div>" + esc(m.sub) + " · " + m.maxXp + " XP available</div></div>" +
        '<div class="badge-mini" title="Badge: ' + esc(UI.badgeMeta(m.badge).name) + '">' + UI.badgeSVG(m.badge, !s.badges[m.badge]) + "</div></div>" +
        '<div class="module-body"><div class="concepts"><h4>Key concepts</h4><ul>' + m.concepts.map(function (c) { return "<li>" + esc(c) + "</li>"; }).join("") + "</ul>" +
        "<h4>Research alignment</h4><p style='font-size:.95rem;margin:0'><b>AI4K12 big ideas:</b> " + esc(m.big) + "<br><b>UNESCO competency:</b> " + esc(m.unesco) + "</p>" +
        (done ? '<p style="margin-top:.8rem"><span class="pill green">Level complete</span></p>' : "") + "</div>" +
        '<div class="trail">';
      m.acts.forEach(function (id) {
        var a = D.ACTS[id], st = S.actStatus(s, id);
        h += stop(id, st, { title: a.title, sub: a.kind, xp: a.xp, icon: ICON[a.type], href: "activity.html?id=" + id });
      });
      if (m.daily) {
        var dst = S.dailyDoneToday(s) && S.get().daily[S.today()] ? "done" : (unlocked ? "open" : "locked");
        h += stop("daily", dst, { title: D.DAILY[m.n].title, sub: "Daily challenge · once a day", xp: D.XP.daily, icon: "calendar", href: "activity.html?id=daily-m" + m.n, bonus: true });
      }
      h += "</div></div></section>";
    });

    /* final */
    var fu = S.finalUnlocked(s), fdone = !!s.done["final"], fst = S.actStatus(s, "final");
    h += '<section class="module mf' + (fu ? "" : " locked") + '" id="mf" aria-labelledby="mhf"><div class="module-head"><div class="ml"><div class="n">Final Application</div><h2 id="mhf">Become an AI Navigator</h2><div>Use everything you learned · ' + D.XP.final + ' XP + certification</div></div><div class="badge-mini">' + UI.badgeSVG("navigator", !s.badges.navigator) + "</div></div>" +
      '<div class="module-body"><div class="concepts"><h4>What you’ll do</h4><ul><li>Understand which tasks fit AI</li><li>Assess an AI draft for errors</li><li>Build a strong prompt</li><li>Make responsible choices</li><li>Write your own AI Use Statement</li></ul></div><div class="trail">' +
      stop("final", fst, { title: "The Research Report Challenge", sub: "Final Application", xp: D.XP.final, icon: "final", href: "activity.html?id=final" }) +
      (s.badges.navigator || s.teacher ? '<a class="stop bonus" href="certificate.html"><span class="dot">' + UI.icon("cert") + '</span><span><span class="t">AI Navigator Certificate</span><br><span class="s">' + (s.badges.navigator ? "Print or save yours" : "Preview mode") + "</span></span></a>" :
        '<div class="stop locked bonus" aria-disabled="true"><span class="dot">' + UI.icon("lock") + '</span><span><span class="t">AI Navigator Certificate</span><br><span class="s">Finish the final application · Locked</span></span></div>') +
      "</div></div></section>";

    host.innerHTML = h;
    host.querySelector("#teach").addEventListener("change", function (e) { S.setTeacher(e.target.checked); render(); });
    UI.chrome();
    if (global.location.hash && !render.once) { render.once = 1; var el = document.querySelector(global.location.hash); if (el) el.scrollIntoView(); }
  }
  render();
})(window);
