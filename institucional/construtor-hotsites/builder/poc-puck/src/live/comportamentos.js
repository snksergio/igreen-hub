/*
 * Comportamentos do kit iGreen Live, em JavaScript puro.
 *
 * Um arquivo só serve aos dois mundos:
 *  - no builder, as peças importam este arquivo e chamam window.igreenLive.iniciar(elemento, nome, op)
 *    num efeito do React (o elemento pode estar dentro do iframe do editor: tudo usa a janela do elemento);
 *  - no HTML estático, o arquivo vai embutido num <script> e liga sozinho tudo o que tem data-lv="...".
 *
 * Cada comportamento devolve uma função de limpeza. op.publico = página publicada (no editor e nas
 * prévias nada se mexe sozinho: só o que ajuda a editar, como o mapa e a contagem).
 */
(function () {
  var reg = {};
  var janela = function (el) { return el.ownerDocument.defaultView; };
  var reduzido = function (win) { return !!(win.matchMedia && win.matchMedia("(prefers-reduced-motion: reduce)").matches); };
  var animacoesLigadas = function (el) { var hs = el.closest(".hs"); return !hs || hs.getAttribute("data-anim") !== "off"; };
  var aoAparecer = function (el, fn, opcoes) {
    var win = janela(el);
    if (!("IntersectionObserver" in win)) { fn(true); return function () {}; }
    var io = new win.IntersectionObserver(function (itens) { fn(itens[itens.length - 1].isIntersecting); }, opcoes || {});
    io.observe(el);
    return function () { io.disconnect(); };
  };

  // ---------- Entrada ao rolar (só na página publicada, com animações ligadas) ----------
  reg.revelar = function (raiz, op) {
    var win = janela(raiz);
    if (!op.publico || reduzido(win) || !animacoesLigadas(raiz) || !("IntersectionObserver" in win)) return;
    raiz.classList.add("lv-anim");
    var io = new win.IntersectionObserver(function (itens) {
      itens.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("visivel"); io.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    raiz.querySelectorAll(".revela").forEach(function (el) { io.observe(el); });
    return function () { io.disconnect(); raiz.classList.remove("lv-anim"); };
  };

  // ---------- Números que contam ao aparecer ([data-lv-conta] guarda o valor final) ----------
  reg.contar = function (raiz, op) {
    var win = janela(raiz);
    if (!op.publico || reduzido(win)) return;
    var fmt = new Intl.NumberFormat("pt-BR");
    var limpezas = [];
    raiz.querySelectorAll("[data-lv-conta]").forEach(function (el) {
      var alvo = Number(el.getAttribute("data-lv-conta"));
      if (!isFinite(alvo)) return;
      var final = el.textContent;
      el.textContent = "0";
      var feito = false;
      var parar = aoAparecer(el, function (visivel) {
        if (!visivel || feito) return;
        feito = true;
        var t0 = win.performance.now();
        var passo = function (t) {
          var p = Math.min(1, (t - t0) / 1700);
          el.textContent = p >= 1 ? final : fmt.format(Math.round(alvo * (1 - Math.pow(2, -10 * p))));
          if (p < 1) win.requestAnimationFrame(passo);
        };
        win.setTimeout(function () { win.requestAnimationFrame(passo); }, 180);
      }, { threshold: 0.6 });
      limpezas.push(function () { parar(); el.textContent = final; });
    });
    return function () { limpezas.forEach(function (f) { f(); }); };
  };

  // ---------- Contagem regressiva e "faltam N dias" ([data-alvo] em ISO) ----------
  reg.relogio = function (raiz) {
    var win = janela(raiz);
    var pad = function (n) { return String(n).padStart(2, "0"); };
    var tic = function () {
      raiz.querySelectorAll("[data-alvo]").forEach(function (el) {
        var alvo = new Date(el.getAttribute("data-alvo")).getTime();
        if (!isFinite(alvo)) return;
        var s = Math.max(0, Math.floor((alvo - Date.now()) / 1000));
        var d = Math.floor(s / 86400); s -= d * 86400;
        var h = Math.floor(s / 3600); s -= h * 3600;
        var m = Math.floor(s / 60); s -= m * 60;
        var v = { d: pad(d), h: pad(h), m: pad(m), s: pad(s), dias: String(d) };
        el.querySelectorAll("[data-u]").forEach(function (b) { b.textContent = v[b.getAttribute("data-u")]; });
        if (el.hasAttribute("data-u")) el.textContent = v[el.getAttribute("data-u")];
      });
    };
    tic();
    var id = win.setInterval(tic, 1000);
    return function () { win.clearInterval(id); };
  };

  // ---------- Carrossel de palestrantes: corre sozinho, para no hover, arrasta com inércia ----------
  // O trilho já vem com a lista repetida 3 vezes (o React desenha); aqui só se move o trilho.
  reg.carrossel = function (raiz, op) {
    var win = janela(raiz);
    var trilho = raiz.querySelector(".trilho");
    var n = Number(raiz.getAttribute("data-itens") || 0);
    if (!trilho || !n || trilho.children.length < n * 2) return;
    var VEL = 36;
    var larg = 0, pos = 0, vel = 0, sobre = false, arrasta = false, naTela = true, moveu = 0;
    var x0 = 0, p0 = 0, xAnt = 0, tAnt = 0, ultimo = win.performance.now(), quadro = 0, vivo = true;
    var dobra = function (x) { if (!larg) return x; while (x <= -2 * larg) x += larg; while (x > -larg) x -= larg; return x; };
    var aplica = function () { trilho.style.transform = "translate3d(" + pos.toFixed(2) + "px, 0, 0)"; };
    var mede = function () { larg = trilho.children[n].offsetLeft - trilho.children[0].offsetLeft; pos = dobra(pos || -larg); aplica(); };
    mede();
    win.addEventListener("resize", mede);
    // mesma razão das partículas: no editor o CSS chega depois; mede de novo quando o trilho muda
    var roT = win.ResizeObserver ? new win.ResizeObserver(mede) : null;
    if (roT) roT.observe(trilho);
    if (!op.publico) return function () { win.removeEventListener("resize", mede); if (roT) roT.disconnect(); trilho.style.transform = ""; };
    raiz.setAttribute("data-pronto", "");

    var paraIo = aoAparecer(raiz, function (v) { naTela = v; }, { rootMargin: "100px 0px" });
    var dentro = function () { sobre = true; }, fora = function () { sobre = false; };
    var finoHover = win.matchMedia && win.matchMedia("(hover: hover)").matches;
    if (finoHover) { raiz.addEventListener("mouseenter", dentro); raiz.addEventListener("mouseleave", fora); }
    var baixa = function (e) {
      if (e.button !== 0) return;
      arrasta = true; vel = 0; moveu = 0; x0 = xAnt = e.clientX; p0 = pos; tAnt = win.performance.now();
      raiz.setPointerCapture(e.pointerId); raiz.classList.add("arrastando");
    };
    var move = function (e) {
      if (!arrasta) return;
      var agora = win.performance.now(), dt = Math.max(8, agora - tAnt) / 1000;
      vel = 0.7 * ((e.clientX - xAnt) / dt) + 0.3 * vel; xAnt = e.clientX; tAnt = agora;
      moveu = Math.max(moveu, Math.abs(e.clientX - x0));
      pos = dobra(p0 + e.clientX - x0); aplica();
    };
    var solta = function () {
      if (!arrasta) return;
      arrasta = false; raiz.classList.remove("arrastando");
      if (win.performance.now() - tAnt > 90) vel = 0;
    };
    var clique = function (e) { if (moveu > 6) { e.preventDefault(); e.stopPropagation(); } };
    raiz.addEventListener("pointerdown", baixa);
    raiz.addEventListener("pointermove", move);
    raiz.addEventListener("pointerup", solta);
    raiz.addEventListener("pointercancel", solta);
    raiz.addEventListener("click", clique, true);
    var passo = function (t) {
      if (!vivo) return;
      var dt = Math.min(0.05, (t - ultimo) / 1000); ultimo = t;
      if (naTela && !arrasta && larg) {
        if (Math.abs(vel) > 6) { pos = dobra(pos + vel * dt); vel *= Math.pow(0.05, dt); aplica(); }
        else { vel = 0; if (!sobre && !reduzido(win)) { pos = dobra(pos - VEL * dt); aplica(); } }
      }
      quadro = win.requestAnimationFrame(passo);
    };
    quadro = win.requestAnimationFrame(passo);
    return function () {
      vivo = false; win.cancelAnimationFrame(quadro); paraIo();
      if (roT) roT.disconnect();
      win.removeEventListener("resize", mede);
      raiz.removeEventListener("mouseenter", dentro); raiz.removeEventListener("mouseleave", fora);
      raiz.removeEventListener("pointerdown", baixa); raiz.removeEventListener("pointermove", move);
      raiz.removeEventListener("pointerup", solta); raiz.removeEventListener("pointercancel", solta);
      raiz.removeEventListener("click", clique, true);
      trilho.style.transform = "";
    };
  };

  // ---------- Partículas atrás dos palestrantes (o campo do iGreen Live) ----------
  reg.particulas = function (tela, op) {
    var win = janela(tela);
    var ctx = tela.getContext("2d");
    if (!ctx) return;
    var fino = win.matchMedia && win.matchMedia("(hover: hover) and (pointer: fine)").matches;
    var TAU = Math.PI * 2, R = 190, EMPURRA = 2600, K = 38, C = 8.5;
    var sorteia = function (a, b) { return a + Math.random() * (b - a); };
    var W = 0, H = 0, tempo = 0, quadros = [], ativa = false, tQuadro = 0;
    var cursor = { x: -1e4, y: -1e4, on: false };
    var cria = function (y) {
      var grande = Math.random() < 0.3;
      var s = grande ? sorteia(16, 30) : sorteia(6, 13);
      var r = Math.random();
      var tipo = grande ? (r < 0.6 ? "linha" : "cheio") : (r < 0.4 ? "brilho" : r < 0.75 ? "linha" : "cheio");
      return {
        bx: Math.random() * W, by: y, s: s, tipo: tipo,
        a: tipo === "brilho" ? sorteia(0.5, 0.8) : grande ? sorteia(0.22, 0.36) : sorteia(0.3, 0.5),
        ax1: sorteia(10, 26), ax2: sorteia(3, 10), fx1: sorteia(0.04, 0.09), fx2: sorteia(0.11, 0.2), px1: sorteia(0, TAU), px2: sorteia(0, TAU),
        ay1: sorteia(8, 22), ay2: sorteia(3, 8), fy1: sorteia(0.03, 0.08), fy2: sorteia(0.1, 0.18), py1: sorteia(0, TAU), py2: sorteia(0, TAU),
        sobe: sorteia(2, 7), r0: Math.random() < 0.5 ? 0 : sorteia(-0.3, 0.3), ra: sorteia(0.08, 0.3), rf: sorteia(0.03, 0.08), rp: sorteia(0, TAU),
        ox: 0, oy: 0, vx: 0, vy: 0, luz: 0
      };
    };
    var monta = function () {
      var dpr = Math.min(win.devicePixelRatio || 1, 2);
      W = tela.offsetWidth; H = tela.offsetHeight;
      tela.width = W * dpr; tela.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var n = Math.max(7, Math.min(18, Math.round((W * H) / 95000)));
      quadros = []; for (var i = 0; i < n; i++) quadros.push(cria(Math.random() * H));
    };
    var canto = function (x, y, w, h, r) {
      ctx.beginPath(); ctx.moveTo(x + r, y);
      ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
      ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
    };
    var desenha = function (dt) {
      tempo += dt;
      ctx.clearRect(0, 0, W, H);
      var px = -1e4, py = -1e4;
      if (cursor.on) { var b = tela.getBoundingClientRect(); px = cursor.x - b.left; py = cursor.y - b.top; }
      for (var i = 0; i < quadros.length; i++) {
        var q = quadros[i];
        q.by -= q.sobe * dt;
        if (q.by < -60) q = quadros[i] = cria(H + 60);
        var x = q.bx + q.ax1 * Math.sin(tempo * q.fx1 * TAU + q.px1) + q.ax2 * Math.sin(tempo * q.fx2 * TAU + q.px2);
        var y = q.by + q.ay1 * Math.sin(tempo * q.fy1 * TAU + q.py1) + q.ay2 * Math.sin(tempo * q.fy2 * TAU + q.py2);
        var fx = 0, fy = 0, perto = 0;
        var dx = x + q.ox - px, dy = y + q.oy - py, d = Math.hypot(dx, dy);
        if (d < R && d > 0.01) { perto = Math.pow(1 - d / R, 2); fx = (dx / d) * perto * EMPURRA; fy = (dy / d) * perto * EMPURRA; }
        q.vx += (fx - K * q.ox - C * q.vx) * dt; q.vy += (fy - K * q.oy - C * q.vy) * dt;
        q.ox += q.vx * dt; q.oy += q.vy * dt;
        q.luz += (perto - q.luz) * Math.min(1, dt * 5);
        var ang = q.r0 + q.ra * Math.sin(tempo * q.rf * TAU + q.rp) + q.vx * 0.0016;
        var alfa = Math.min(1, q.a + q.luz * 0.5), meio = q.s / 2;
        ctx.save();
        ctx.translate(x + q.ox, y + q.oy); ctx.rotate(ang);
        canto(-meio, -meio, q.s, q.s, Math.min(4, q.s * 0.2));
        if (q.tipo === "linha") {
          ctx.lineWidth = 1.25; ctx.strokeStyle = "rgba(168,255,53," + alfa.toFixed(3) + ")"; ctx.stroke();
          if (q.luz > 0.02) { ctx.fillStyle = "rgba(168,255,53," + (q.luz * 0.12).toFixed(3) + ")"; ctx.fill(); }
        } else if (q.tipo === "cheio") {
          var g = ctx.createLinearGradient(-meio, -meio, meio, meio);
          g.addColorStop(0, "rgba(196,255,120," + (alfa * 0.75).toFixed(3) + ")");
          g.addColorStop(1, "rgba(168,255,53," + (alfa * 0.18).toFixed(3) + ")");
          ctx.fillStyle = g; ctx.fill();
          ctx.lineWidth = 1; ctx.strokeStyle = "rgba(216,255,166," + (alfa * 0.55).toFixed(3) + ")"; ctx.stroke();
        } else {
          ctx.shadowColor = "rgba(168,255,53," + alfa.toFixed(3) + ")"; ctx.shadowBlur = 10 + q.luz * 16;
          ctx.fillStyle = "rgba(206,255,140," + alfa.toFixed(3) + ")"; ctx.fill();
        }
        ctx.restore();
      }
    };
    monta(); desenha(0);
    var redimensiona = function () { monta(); desenha(0); };
    win.addEventListener("resize", redimensiona);
    // No editor, o efeito roda antes de o CSS chegar ao iframe: o canvas nasce com 300×150 e depois
    // é esticado. Medir de novo sempre que o tamanho real mudar evita os quadrados deformados.
    var ro = win.ResizeObserver
      ? new win.ResizeObserver(function () { if (tela.offsetWidth !== W || tela.offsetHeight !== H) redimensiona(); })
      : null;
    if (ro) ro.observe(tela);
    if (!op.publico || reduzido(win)) return function () { win.removeEventListener("resize", redimensiona); if (ro) ro.disconnect(); };
    var mexe = function (e) { cursor.x = e.clientX; cursor.y = e.clientY; cursor.on = true; };
    var sai = function () { cursor.on = false; };
    if (fino) { win.addEventListener("pointermove", mexe, { passive: true }); win.document.documentElement.addEventListener("pointerleave", sai); }
    var roda = function (t) { if (!ativa) return; desenha(Math.min(50, t - tQuadro) / 1000); tQuadro = t; win.requestAnimationFrame(roda); };
    var paraIo = aoAparecer(tela, function (v) {
      if (v && !ativa) { ativa = true; tQuadro = win.performance.now(); win.requestAnimationFrame(roda); }
      else if (!v) ativa = false;
    });
    return function () {
      ativa = false; paraIo();
      if (ro) ro.disconnect();
      win.removeEventListener("resize", redimensiona);
      win.removeEventListener("pointermove", mexe);
      win.document.documentElement.removeEventListener("pointerleave", sai);
    };
  };

  // ---------- Mapa do Brasil em pontos, com Minas acesa e zoom ao clicar ----------
  // Contornos simplificados (longitude, latitude). São ilustrativos: só precisam ler como Brasil e Minas.
  var BR = [[-51.6,4.4],[-50.6,2],[-50,1],[-49.3,-0.2],[-48.4,-0.6],[-47.9,-0.6],[-46.9,-0.9],[-45.4,-1.3],[-44.6,-1.9],[-44.3,-2.5],[-43.4,-2.4],[-42.3,-2.8],[-41.4,-2.9],[-40.4,-2.8],[-39,-3.3],[-38.5,-3.7],[-37.5,-4.6],[-36.5,-5.1],[-35.5,-5.15],[-35.2,-5.6],[-34.95,-6.8],[-34.8,-7.15],[-34.85,-8],[-35.1,-8.9],[-35.7,-9.7],[-36.4,-10.5],[-37.1,-11],[-37.7,-11.9],[-38.5,-13],[-38.9,-13.9],[-39,-15],[-39,-16.4],[-39.2,-17.7],[-39.7,-18.9],[-40.2,-20],[-40.9,-21.3],[-41,-22],[-42,-22.95],[-43.2,-23],[-44.6,-23.2],[-45.4,-23.8],[-46.3,-24],[-47.2,-24.6],[-48,-25.3],[-48.5,-25.9],[-48.6,-26.9],[-48.6,-28],[-48.8,-28.6],[-49.7,-29.3],[-50.3,-30.3],[-51,-31.2],[-52.1,-32.1],[-52.7,-33],[-53.4,-33.75],[-53.5,-33],[-53.4,-32.6],[-54.6,-31.9],[-55.6,-30.9],[-56.4,-30.4],[-57.6,-30.2],[-56.5,-29.1],[-55.8,-28.3],[-55,-27.6],[-54.2,-27.2],[-53.8,-27.1],[-53.7,-26.3],[-53.8,-25.6],[-54.6,-25.6],[-54.3,-24.1],[-55.4,-23.9],[-55.7,-22.5],[-56.4,-22.2],[-57.9,-22.1],[-58.1,-20.2],[-57.9,-19.9],[-58.1,-17.3],[-58.4,-16.3],[-60.2,-16.2],[-60.2,-15.1],[-60.4,-13.6],[-61.9,-13.5],[-63.2,-12.5],[-64.4,-12.4],[-65.3,-11.4],[-65.35,-10.8],[-65.4,-9.7],[-66.6,-9.9],[-67.6,-10.6],[-68.6,-11.1],[-69.6,-10.95],[-70.6,-10.9],[-70.5,-9.5],[-72.1,-10],[-72.9,-9.4],[-73.2,-9.2],[-73.9,-7.5],[-73.7,-6.9],[-73.1,-6.4],[-72.9,-5.2],[-71,-4.4],[-69.95,-4.23],[-69.4,-1.1],[-69.6,-0.6],[-70,0.6],[-69.3,1],[-69.8,1.7],[-67.3,2.1],[-66.85,1.2],[-66.2,0.8],[-65.5,0.7],[-64.2,1.5],[-64,2],[-64.6,2.7],[-64.2,3.8],[-63,3.8],[-62.7,4],[-61.3,4.5],[-60.6,4.9],[-60.2,5.27],[-59.9,4.4],[-59.6,3.5],[-59.9,2.3],[-59,1.3],[-58.1,1.5],[-56.5,1.9],[-55.9,1.9],[-55,2.5],[-54.3,2.3],[-54,2.2],[-52.9,2.2],[-52.2,3.2]];
  var MG = [[-51,-19.75],[-50.4,-19.25],[-49.5,-18.65],[-48.5,-18.4],[-47.8,-18.1],[-47.4,-17.4],[-47.3,-16.6],[-47.2,-15.9],[-46.6,-15.3],[-45.9,-15],[-45,-14.6],[-44.3,-14.25],[-43.6,-14.6],[-42.7,-15],[-41.9,-15.4],[-41.1,-15.9],[-40.4,-16.6],[-39.9,-17.4],[-40.2,-17.95],[-40.9,-18.3],[-41,-19],[-41.1,-19.6],[-41.6,-20.3],[-41.9,-20.9],[-42.1,-21.3],[-42.5,-21.7],[-43.1,-22],[-43.8,-22.1],[-44.4,-22.3],[-44.8,-22.5],[-45.5,-22.8],[-46.4,-22.9],[-46.7,-22.5],[-46.8,-21.9],[-47.1,-21.3],[-47.4,-20.6],[-47.9,-20.2],[-48.6,-20.1],[-49.4,-20],[-50.2,-20]];
  var dentro = function (x, y, pol) {
    var c = false;
    for (var i = 0, j = pol.length - 1; i < pol.length; j = i++) {
      var xi = pol[i][0], yi = pol[i][1], xj = pol[j][0], yj = pol[j][1];
      if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) c = !c;
    }
    return c;
  };
  var pontosBrasil = null;
  var desenhaBrasil = function (sigla) {
    if (pontosBrasil) return pontosBrasil.replace("__SIGLA__", sigla);
    var passo = 0.66, html = '<g class="br-mapa">';
    for (var linha = 0, lat = 5.4; lat > -34; linha++, lat -= passo) {
      for (var lon = -74 + (linha % 2) * passo / 2; lon < -34.6; lon += passo) {
        if (!dentro(lon, lat, BR)) continue;
        var emMG = dentro(lon, lat, MG);
        html += '<circle class="' + (emMG ? "br-mg" : "br-n") + '" cx="' + lon.toFixed(2) + '" cy="' + (-lat).toFixed(2) + '" r="' + (emMG ? 0.25 : 0.19) + '"/>';
      }
    }
    html += '<circle class="br-onda" cx="-43.94" cy="19.92" r="0.5"/><circle class="br-bh" cx="-43.94" cy="19.92" r="0.42"/><text class="br-rotulo" x="-39.4" y="20.6">__SIGLA__</text></g>';
    pontosBrasil = html;
    return html.replace("__SIGLA__", sigla);
  };
  reg.mapa = function (cartao) {
    var win = janela(cartao);
    var svg = cartao.querySelector(".br-svg");
    if (!svg) return;
    var sigla = (cartao.getAttribute("data-sigla") || "BH").replace(/[<>&"]/g, "");
    svg.innerHTML = desenhaBrasil(sigla);
    var grupo = svg.querySelector(".br-mapa");
    var FOCO = [-44.9, 18.5], MEIO = [-56, 10.4], ESCALA = 3.3;
    var z = 0, quadro = 0;
    var desenhaZoom = function (k) {
      var s = 1 + (ESCALA - 1) * k;
      var cx = FOCO[0] + (MEIO[0] - FOCO[0]) * k, cy = FOCO[1] + (MEIO[1] - FOCO[1]) * k;
      grupo.setAttribute("transform", "translate(" + cx.toFixed(3) + " " + cy.toFixed(3) + ") scale(" + s.toFixed(4) + ") translate(" + (-FOCO[0]) + " " + (-FOCO[1]) + ")");
    };
    var suave = function (t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };
    var zoomPara = function (alvo) {
      var de = z, t0 = win.performance.now(), dur = reduzido(win) ? 0 : 1200;
      win.cancelAnimationFrame(quadro);
      var passo = function (t) {
        var p = dur ? Math.min(1, (t - t0) / dur) : 1;
        z = de + (alvo - de) * suave(p);
        desenhaZoom(z);
        if (p < 1) quadro = win.requestAnimationFrame(passo);
      };
      quadro = win.requestAnimationFrame(passo);
    };
    var alterna = function () {
      var perto = !cartao.classList.contains("perto");
      cartao.classList.toggle("perto", perto);
      cartao.setAttribute("aria-pressed", String(perto));
      zoomPara(perto ? 1 : 0);
    };
    var tecla = function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); alterna(); } };
    cartao.addEventListener("click", alterna);
    cartao.addEventListener("keydown", tecla);
    return function () {
      win.cancelAnimationFrame(quadro);
      cartao.removeEventListener("click", alterna);
      cartao.removeEventListener("keydown", tecla);
      cartao.classList.remove("perto");
    };
  };

  // ---------- Vídeo: prévia muda em loop; clique toca o completo; brilho ambiente atrás ----------
  reg.video = function (palco, op) {
    var win = janela(palco);
    var cartao = palco.querySelector(".video");
    var v = cartao && cartao.querySelector("video");
    if (!v) return;
    var limpezas = [];
    if (op.publico && !reduzido(win)) {
      limpezas.push(aoAparecer(cartao, function (visivel) {
        if (cartao.classList.contains("tocando")) return;
        if (visivel) { var p = v.play(); if (p && p.catch) p.catch(function () {}); } else v.pause();
      }, { threshold: 0.25 }));
    }
    var toca = function () {
      var completo = cartao.getAttribute("data-video");
      if (!op.publico || !completo || cartao.classList.contains("tocando")) return;
      cartao.classList.add("tocando");
      v.src = completo; v.loop = false; v.muted = false; v.controls = true;
      var p = v.play(); if (p && p.catch) p.catch(function () {});
    };
    var tecla = function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toca(); } };
    cartao.addEventListener("click", toca);
    cartao.addEventListener("keydown", tecla);
    limpezas.push(function () { cartao.removeEventListener("click", toca); cartao.removeEventListener("keydown", tecla); });

    // brilho ambiente: copia o quadro ~15 vezes por segundo, misturando com o anterior
    var luz = palco.querySelector(".video-luz");
    if (luz) {
      var lc = luz.getContext("2d");
      var rodando = false, ultimoQuadro = 0;
      var pinta = function (alfa) {
        if (v.readyState < 2) return;
        try { lc.globalAlpha = alfa; lc.drawImage(v, 0, 0, luz.width, luz.height); palco.classList.add("aceso"); } catch (e) {}
      };
      var ciclo = function (t) {
        if (!rodando) return;
        if (t - ultimoQuadro > 66) { pinta(0.28); ultimoQuadro = t; }
        win.requestAnimationFrame(ciclo);
      };
      var comeca = function () { if (!rodando) { rodando = true; win.requestAnimationFrame(ciclo); } };
      var para = function () { rodando = false; };
      var primeiro = function () { pinta(1); };
      v.addEventListener("playing", comeca); v.addEventListener("pause", para); v.addEventListener("ended", para);
      v.addEventListener("loadeddata", primeiro); v.addEventListener("seeked", primeiro);
      if (v.readyState >= 2) pinta(1);
      limpezas.push(function () {
        rodando = false;
        v.removeEventListener("playing", comeca); v.removeEventListener("pause", para); v.removeEventListener("ended", para);
        v.removeEventListener("loadeddata", primeiro); v.removeEventListener("seeked", primeiro);
      });
    }
    return function () { limpezas.forEach(function (f) { f(); }); };
  };

  // ---------- Rodapé: a névoa só se move enquanto ele está na tela ----------
  reg.rodape = function (rodape, op) {
    if (!op.publico) return;
    return aoAparecer(rodape, function (v) { rodape.classList.toggle("vivo", v); });
  };

  var api = {
    iniciar: function (el, nome, op) {
      var f = reg[nome];
      if (!el || !f) return undefined;
      try { return f(el, op || {}); } catch (e) { return undefined; }
    },
  };
  if (typeof window !== "undefined") window.igreenLive = api;

  // HTML estático: o arquivo entra num <script> comum no fim do <body> e liga tudo sozinho.
  // Importado pelo builder (módulo), document.currentScript é nulo e quem liga são as peças.
  var script = typeof document !== "undefined" ? document.currentScript : null;
  if (script) {
    document.querySelectorAll("[data-lv]").forEach(function (el) {
      el.getAttribute("data-lv").split(/\s+/).filter(Boolean).forEach(function (nome) { api.iniciar(el, nome, { publico: true }); });
    });
  }
})();
