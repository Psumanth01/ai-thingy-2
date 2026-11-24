/* AI Quest — AI Navigator certificate */
(function (global) {
  "use strict";
  var D = global.AIQ_DATA, S = global.AIQ.store, UI = global.AIQ.ui;
  var host = document.getElementById("cert-root");
  if (!host) return;
  var esc = UI.esc;

  function render() {
    var s = S.get(), earned = !!s.badges.navigator, preview = !earned && s.teacher;
    var name = s.name || (preview ? "Your Name Here" : "");
    var date = earned && s.done["final"] ? new Date(s.done["final"].at) : new Date();
    var dt = date.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
    var h = "";
    if (!earned && !preview) {
      h += '<div class="card tint center" style="max-width:640px;margin:1rem auto"><h2>Not unlocked yet</h2><p>Finish all four levels and the Final Application to earn your AI Navigator certificate.</p>' +
        '<div class="btn-row" style="justify-content:center"><a class="btn orange" href="course.html">Go to the course</a></div></div>';
    } else {
      h += '<div class="no-print card tint" style="max-width:900px;margin:0 auto 1rem"><label class="l" for="cn" style="margin-top:0">Name on certificate</label><input type="text" id="cn" maxlength="40" value="' + esc(s.name) + '" placeholder="Type your name"><div class="btn-row" style="margin-top:.8rem"><button class="btn orange" id="print" type="button">Print or save as PDF</button></div>' +
        (preview ? '<p class="muted" style="margin:.6rem 0 0">Preview mode: this certificate is a sample until you complete the Final Application.</p>' : "") + "</div>";
      h += '<div class="cert" aria-label="Certificate of completion"><div data-mascot="cheer"></div>' +
        '<div class="eyebrow">AI Quest · Learn. Explore. Level Up.</div><h1>AI Navigator Certification' + (preview ? " (Preview)" : "") + '</h1><p class="lead">This certifies that</p><div class="who" id="who">' + esc(name || "Your name") + "</div>" +
        "<p style='max-width:600px;margin:.8rem auto'>completed all four levels of the AI Quest learning portal (<b>Introduction to AI, Assessing AI, Applying AI, and Responsible AI</b>) and the Final Application, showing they can understand AI, check it, use it well, and use it responsibly.</p>" +
        '<div class="seals">' + ["explorer", "detective", "promptpro", "guardian", "navigator"].map(function (b) { return UI.badgeSVG(b, !s.badges[b] && !preview); }).join("") + "</div>" +
        '<div class="sig"><div>' + dt + "<br><span class='muted'>Date</span></div><div>AI Quest<br><span class='muted'>Learning portal</span></div></div></div>";
      var st = s.notes.finalStatement;
      if (st) h += '<div class="card" style="max-width:900px;margin:1rem auto"><h3>Your AI Use Statement</h3><p style="margin:0">' + esc(st) + "</p></div>";
    }
    host.innerHTML = h; UI.mountMascots(host);
    var cn = host.querySelector("#cn");
    if (cn) {
      cn.addEventListener("input", function () { var w = host.querySelector("#who"); w.textContent = cn.value.trim() || "Your name"; });
      cn.addEventListener("change", function () { S.setName(cn.value); UI.chrome(); });
      host.querySelector("#print").addEventListener("click", function () { S.setName(cn.value); global.print(); });
    }
  }
  render(); UI.chrome();
})(window);
