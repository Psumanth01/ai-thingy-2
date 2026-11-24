/* AI Quest — Learn page: games + practice quizzes */
(function (global) {
  "use strict";
  var D = global.AIQ_DATA, S = global.AIQ.store, UI = global.AIQ.ui;
  var gh = document.getElementById("games-root"), ph = document.getElementById("practice-root");
  if (!gh || !ph) return;
  var esc = UI.esc;
  var s = S.get();

  gh.innerHTML = D.GAMES.map(function (g) {
    var rec = s.games[g.id], mod = D.MODULES[g.mod - 1];
    return '<article class="card game-card"><div class="ico ' + g.color + '">' + UI.icon(g.icon) + "</div><span class='pill'>" + mod.level + " skills</span><h3>" + esc(g.title) + "</h3><p class='muted' style='margin:0'>" + esc(g.desc) + "</p>" +
      '<div class="best">' + (rec ? "Best: " + rec.best + " · Played " + rec.plays + "×" : "Not played yet") + "</div>" +
      '<a class="btn orange" href="activity.html?id=' + g.id + '">Play</a></article>';
  }).join("");

  ph.innerHTML = D.MODULES.map(function (m) {
    var open = S.modUnlocked(s, m.n), rec = s.practice["m" + m.n];
    return '<div class="card"><div class="quiz-row"><div class="info"><span class="pill ' + (open ? "" : "orange") + '">' + m.level + "</span><h3 style='margin:.3rem 0 .1rem'>" + esc(m.levelName) + " practice quiz</h3><p class='muted' style='margin:0'>6 random questions from this level. No XP, no pressure.</p></div>" +
      '<div class="best muted" style="font-weight:800">' + (rec ? "Best: " + rec.best + "%" : (open ? "Not tried yet" : "Unlocks with Level " + m.n)) + "</div>" +
      (open ? '<a class="btn" href="activity.html?id=practice-m' + m.n + '">Practice</a>' : '<span class="btn disabled" aria-disabled="true">Locked</span>') + "</div></div>";
  }).join("");
  UI.chrome();
})(window);
