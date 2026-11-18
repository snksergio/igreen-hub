/* Script do HTML estático (sem React, ~3 KB). Só melhora a página: sem ele, tudo continua legível. */
(function () {
  var doc = document;
  var reduzido = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var hs = doc.querySelector(".hs");
  var animar = hs && hs.getAttribute("data-anim") !== "off" && !reduzido && "IntersectionObserver" in window;

  function numero(s) {
    var m = String(s).match(/^(\D*?)(\d{1,3}(?:\.\d{3})+|\d+)(?:,(\d+))?([\s\S]*)$/);
    if (!m) return null;
    var dec = m[3] || "";
    return { pre: m[1], v: Number(m[2].replace(/\./g, "") + (dec ? "." + dec : "")), suf: m[4], dec: dec.length };
  }
  function contar(el) {
    var p = numero(el.getAttribute("data-conta"));
    if (!p) return;
    var t0 = performance.now();
    (function passo(t) {
      var k = Math.min(1, (t - t0) / 1200);
      var v = p.v * (1 - Math.pow(1 - k, 3));
      el.textContent = p.pre + v.toLocaleString("pt-BR", { minimumFractionDigits: p.dec, maximumFractionDigits: p.dec }) + p.suf;
      if (k < 1) requestAnimationFrame(passo);
    })(t0);
  }

  // Entrada ao rolar: só no que ainda está fora da tela (o que já aparece fica parado, sem "pulo").
  if (animar) {
    var io = new IntersectionObserver(
      function (entradas) {
        entradas.forEach(function (e) {
          if (!e.isIntersecting) return;
          e.target.setAttribute("data-estado", "in");
          e.target.querySelectorAll("[data-conta]").forEach(contar);
          io.unobserve(e.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    doc.querySelectorAll(".hs-sec").forEach(function (s) {
      if (s.getBoundingClientRect().top < innerHeight) return;
      s.setAttribute("data-estado", "out");
      io.observe(s);
    });
  }

  // Contagem regressiva.
  doc.querySelectorAll("[data-alvo]").forEach(function (c) {
    var alvo = new Date(c.getAttribute("data-alvo")).getTime();
    function pad(n) { return String(n).padStart(2, "0"); }
    function tique() {
      var s = Math.floor((alvo - Date.now()) / 1000);
      if (!(s > 0)) {
        var p = doc.createElement("p");
        p.className = "hs-lead";
        p.textContent = c.getAttribute("data-acabou") || "";
        c.replaceWith(p);
        return;
      }
      var v = { d: Math.floor(s / 86400), h: Math.floor((s % 86400) / 3600), m: Math.floor((s % 3600) / 60), s: s % 60 };
      c.querySelectorAll("[data-u]").forEach(function (el) { el.textContent = pad(v[el.getAttribute("data-u")]); });
      setTimeout(tique, 1000);
    }
    tique();
  });

  // Simulador.
  var brl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
  doc.querySelectorAll("[data-sim-valor]").forEach(function (sim) {
    var valor = Number(sim.getAttribute("data-sim-valor")) || 0;
    var range = sim.querySelector('[data-sim="range"]');
    function atualiza() {
      var q = Number(range.value);
      sim.querySelector('[data-sim="qtd"]').textContent = q;
      sim.querySelector('[data-sim="mes"]').textContent = brl.format(q * valor);
      sim.querySelector('[data-sim="ano"]').textContent = brl.format(q * valor * 12);
    }
    range.addEventListener("input", atualiza);
  });

  // Vídeo do YouTube: troca a capa pelo player no clique.
  doc.querySelectorAll("[data-yt] .hs-video__capa").forEach(function (b) {
    b.addEventListener("click", function () {
      var f = doc.createElement("iframe");
      f.src = "https://www.youtube-nocookie.com/embed/" + b.parentElement.getAttribute("data-yt") + "?autoplay=1";
      f.title = b.getAttribute("aria-label") || "Vídeo";
      f.allow = "autoplay; encrypted-media; picture-in-picture";
      f.allowFullscreen = true;
      b.replaceWith(f);
    });
  });

  // Formulário: no MVP vai para a base de inscrições. Aqui só confirma, sem mandar dado a lugar nenhum.
  doc.querySelectorAll("[data-form-inscricao]").forEach(function (f) {
    f.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!f.reportValidity()) return;
      var aviso = doc.createElement("p");
      aviso.className = "hs-note";
      aviso.setAttribute("role", "status");
      aviso.textContent = "Prévia estática: no MVP esta inscrição vai para a base de inscritos.";
      f.appendChild(aviso);
    });
  });
})();
