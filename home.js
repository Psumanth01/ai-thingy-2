/* AI Quest — home page: personalised start button + try-it teaser */
(function (global) {
  "use strict";
  var D = global.AIQ_DATA, S = global.AIQ.store, UI = global.AIQ.ui;

  var s = S.get(), next = S.nextActivity(s), started = Object.keys(s.done).length > 0;
  var cta = document.getElementById("cta-main");
  if (cta) {
    if (started && next) { cta.textContent = "Continue learning"; cta.href = "activity.html?id=" + next; }
    else if (started) { cta.textContent = "View my dashboard"; cta.href = "dashboard.html"; }
  }

  var t = document.getElementById("teaser");
  if (!t) return;
  var q = { q: "Which of these is <u>most likely</u> using AI?", opts: ["A paper map", "A phone that unlocks when it recognizes your face", "A desk lamp", "A ruler"], a: 1,
    why: "Face unlock uses machine learning to recognize patterns in images of your face." };
  t.innerHTML = '<p class="q">' + q.q + '</p><div class="opts">' + q.opts.map(function (o, i) {
    return '<button type="button" class="opt" data-i="' + i + '"><span class="key">' + (i + 1) + "</span><span>" + o + "</span></button>";
  }).join("") + '</div><div id="tz-fb" role="status" aria-live="polite"></div>';
  var done = false;
  t.querySelectorAll(".opt").forEach(function (b) {
    b.addEventListener("click", function () {
      if (done) return; done = true;
      var i = +b.getAttribute("data-i"), ok = i === q.a;
      t.querySelectorAll(".opt").forEach(function (x, k) { x.disabled = true; if (k === q.a) x.classList.add("right"); else if (k === i) x.classList.add("wrong"); });
      t.querySelector("#tz-fb").innerHTML = '<div class="fb ' + (ok ? "good" : "bad") + '">' + (ok ? "<b>Nice!</b> " : "<b>Not quite.</b> ") + q.why +
        '</div><p class="center" style="margin-top:1rem"><a class="btn orange" href="activity.html?id=m1-lesson">Start Level 1</a></p>';
      if (ok) UI.confetti("small");
    });
  });
})(window);
