/* FonteSoft — interações do site (sem dependências) */
(function () {
  "use strict";

  var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)");

  var header = document.querySelector(".site-header");
  var nav = document.getElementById("nav");
  var navToggle = document.getElementById("navToggle");

  /* Fundo/borda do cabeçalho ao rolar */
  function onHeaderScroll() {
    header.classList.toggle("scrolled", window.scrollY > 8);
  }
  window.addEventListener("scroll", onHeaderScroll, { passive: true });
  onHeaderScroll();

  /* Menu mobile */
  function closeNav() {
    // Se o foco está dentro do menu, devolve ao botão antes de escondê-lo
    if (nav.contains(document.activeElement)) navToggle.focus();
    nav.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Abrir menu de navegação");
  }

  navToggle.addEventListener("click", function () {
    var isOpen = nav.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
    navToggle.setAttribute(
      "aria-label",
      isOpen ? "Fechar menu de navegação" : "Abrir menu de navegação"
    );
  });

  nav.addEventListener("click", function (event) {
    if (event.target.closest("a")) closeNav();
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && nav.classList.contains("open")) closeNav();
  });

  /* Animações de entrada (respeita prefers-reduced-motion via CSS).
     A classe .js habilita o estado inicial oculto no CSS — adicionada aqui,
     e não em script inline no <head>, para que o conteúdo permaneça visível
     se este arquivo não carregar ou falhar antes deste ponto. */
  document.documentElement.classList.add("js");

  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add("visible");
    });
  }

  /* Brilho que segue o cursor nos cards de serviço */
  document.querySelectorAll(".glow-card").forEach(function (card) {
    card.addEventListener("pointermove", function (event) {
      var rect = card.getBoundingClientRect();
      card.style.setProperty("--mx", event.clientX - rect.left + "px");
      card.style.setProperty("--my", event.clientY - rect.top + "px");
    });
  });

  /* A preferência por movimento reduzido pode mudar com a página aberta */
  function onMotionPrefChange(handler) {
    if (typeof prefersReduced.addEventListener === "function") {
      prefersReduced.addEventListener("change", handler);
    } else if (typeof prefersReduced.addListener === "function") {
      prefersReduced.addListener(handler); // Safari antigo
    }
  }

  /* Botão de pausar/retomar as animações decorativas do hero (WCAG 2.2.2).
     O estado vive na classe .anim-paused do <html> (consumida pelo CSS e
     pelo canvas) e é persistido entre visitas. */
  var animToggle = document.getElementById("animToggle");
  var ANIM_KEY = "fontesoft-anim-paused";
  function setAnimPaused(paused) {
    document.documentElement.classList.toggle("anim-paused", paused);
    if (animToggle) {
      animToggle.setAttribute("aria-pressed", String(paused));
      animToggle.setAttribute(
        "aria-label",
        paused ? "Retomar animações de movimento" : "Pausar animações de movimento"
      );
    }
    try { localStorage.setItem(ANIM_KEY, paused ? "1" : "0"); } catch (e) { /* modo privado */ }
    document.dispatchEvent(new CustomEvent("fs-anim-change"));
  }
  if (animToggle) {
    var savedAnim = null;
    try { savedAnim = localStorage.getItem(ANIM_KEY); } catch (e) { /* modo privado */ }
    if (savedAnim === "1") setAnimPaused(true);
    animToggle.addEventListener("click", function () {
      setAnimPaused(!document.documentElement.classList.contains("anim-paused"));
    });
  }

  /* Parallax sutil nos elementos do hero ([data-parallax="fator"]) */
  var parallaxEls = Array.prototype.slice.call(
    document.querySelectorAll("[data-parallax]")
  );
  if (parallaxEls.length) {
    var parallaxTicking = false;
    var onParallax = function () {
      if (prefersReduced.matches || parallaxTicking) return;
      parallaxTicking = true;
      requestAnimationFrame(function () {
        var y = window.scrollY;
        parallaxEls.forEach(function (el) {
          var factor = parseFloat(el.getAttribute("data-parallax")) || 0;
          el.style.transform = "translate3d(0," + (y * factor).toFixed(1) + "px,0)";
        });
        parallaxTicking = false;
      });
    };
    window.addEventListener("scroll", onParallax, { passive: true });
    onMotionPrefChange(function () {
      if (prefersReduced.matches) {
        parallaxEls.forEach(function (el) {
          el.style.transform = "";
        });
      }
    });
  }

  /* Campo de fluxo no hero: partículas ciano/azul/roxo escorrendo por
     curvas suaves — a "ideia ganhando forma" da identidade da marca. */
  (function initFlowField() {
    var canvas = document.getElementById("flowCanvas");
    if (!canvas) return;

    var ctx = canvas.getContext("2d");
    if (!ctx) return;

    var COLORS = [
      "rgba(0,229,255,",   // ciano
      "rgba(37,99,255,",   // azul elétrico
      "rgba(124,58,237,"   // roxo
    ];
    var width = 0;
    var height = 0;
    var particles = [];
    var rafId = null;
    var inView = true;
    var time = 0;

    function newParticle(anywhere) {
      return {
        x: Math.random() * width,
        y: anywhere ? Math.random() * height : height + 8,
        speed: 0.35 + Math.random() * 0.75,
        radius: 0.7 + Math.random() * 1.1,
        life: 240 + Math.random() * 320,
        color: COLORS[(Math.random() * COLORS.length) | 0],
        alpha: 0.14 + Math.random() * 0.3
      };
    }

    function resize() {
      var rect = canvas.parentElement.getBoundingClientRect();
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      // dpr lido a cada resize: zoom e troca de monitor mudam o valor
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var count = Math.round(Math.min(96, Math.max(34, width / 15)));
      particles = [];
      for (var i = 0; i < count; i++) particles.push(newParticle(true));
    }

    /* Pseudo-ruído barato: campo de ângulos contínuo a partir de senos */
    function angleAt(x, y) {
      return (
        Math.sin(x * 0.0015 + time * 0.00042) +
        Math.cos(y * 0.0019 - time * 0.00031) +
        Math.sin((x + y) * 0.0008)
      ) * 1.9;
    }

    function tick(now) {
      time = now;

      // Apaga o quadro anterior aos poucos — vira o rastro das partículas
      ctx.globalCompositeOperation = "destination-out";
      ctx.fillStyle = "rgba(0,0,0,0.07)";
      ctx.fillRect(0, 0, width, height);

      ctx.globalCompositeOperation = "lighter";
      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];
        var a = angleAt(p.x, p.y);
        p.x += Math.cos(a) * p.speed;
        p.y += Math.sin(a) * p.speed * 0.72 - 0.12; // leve deriva ascendente
        p.life -= 1;

        if (p.life <= 0 || p.x < -12 || p.x > width + 12 || p.y < -12 || p.y > height + 12) {
          particles[i] = newParticle(false);
          continue;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, 6.2832);
        ctx.fillStyle = p.color + p.alpha + ")";
        ctx.fill();
      }

      rafId = requestAnimationFrame(tick);
    }

    function allowedToRun() {
      return (
        inView &&
        !document.hidden &&
        !prefersReduced.matches &&
        !document.documentElement.classList.contains("anim-paused")
      );
    }

    function setRunning(shouldRun) {
      if (shouldRun && rafId === null) {
        rafId = requestAnimationFrame(tick);
      } else if (!shouldRun && rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    }

    function update() {
      setRunning(allowedToRun());
    }

    var resizeTimer = null;
    window.addEventListener("resize", function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        // Mostrar/esconder a barra de URL no mobile dispara resize sem mudar
        // a largura; recriar as partículas nesse caso faria o campo "piscar".
        var rect = canvas.parentElement.getBoundingClientRect();
        if (Math.round(rect.width) === Math.round(width) && Math.abs(rect.height - height) < 120) return;
        resize();
      }, 150);
    });

    // Pausa quando o hero sai da tela, a aba fica oculta, o usuário pausa
    // pelo botão ou ativa "reduzir movimento" no sistema
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        inView = entries[0].isIntersecting;
        update();
      }).observe(canvas);
    }
    document.addEventListener("visibilitychange", update);
    document.addEventListener("fs-anim-change", update);
    onMotionPrefChange(function () {
      if (prefersReduced.matches) ctx.clearRect(0, 0, width, height);
      update();
    });

    resize();
    update();
  })();

  /* Ano atual no rodapé */
  var anoEl = document.getElementById("anoAtual");
  if (anoEl) anoEl.textContent = String(new Date().getFullYear());
})();
