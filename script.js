// Le clip senza audio partono solo quando sono visibili e si fermano quando escono dallo schermo.
// Con "riduci animazioni" attivo nel sistema non partono da sole: si avviano con i controlli.
(function () {
  var clips = Array.prototype.slice.call(document.querySelectorAll("video.loop"));
  if (!clips.length) return;
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function play(v) {
    if (v.preload === "none") v.preload = "auto";
    var p = v.play();
    if (p && p.catch) p.catch(function () { v.controls = true; });
  }

  clips.forEach(function (v) {
    v.addEventListener("click", function () {
      if (v.paused) { v.dataset.stopped = ""; play(v); }
      else { v.dataset.stopped = "1"; v.pause(); }
    });
  });

  if (reduce || !("IntersectionObserver" in window)) {
    clips.forEach(function (v) { v.controls = true; });
    return;
  }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      var v = e.target;
      if (e.isIntersecting) { if (!v.dataset.stopped) play(v); }
      else v.pause();
    });
  }, { threshold: 0.4 });
  clips.forEach(function (v) { io.observe(v); });
})();
