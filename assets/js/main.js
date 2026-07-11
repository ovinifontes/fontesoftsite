/* FONTESOFT — interações do site (sem dependências) */
(function () {
  "use strict";

  var header = document.querySelector(".site-header");
  var nav = document.getElementById("nav");
  var navToggle = document.getElementById("navToggle");

  /* Sombra/borda do cabeçalho ao rolar */
  function onScroll() {
    header.classList.toggle("scrolled", window.scrollY > 8);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

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
    if (event.target.tagName === "A") closeNav();
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

  /* Formulário de contato: abre o cliente de e-mail com a mensagem pronta.
     Site 100% estático — sem backend. Se no futuro houver um serviço de
     formulários (Formspree, FormSubmit etc.), basta trocar este handler. */
  var form = document.getElementById("contactForm");
  var feedback = document.getElementById("formFeedback");
  var CONTACT_EMAIL = "contato@fontesoft.com.br";

  // Com JS ativo, a validação é feita pelo handler abaixo (mensagens em pt-BR);
  // sem JS, vale a validação nativa + o action="mailto:" do HTML.
  form.noValidate = true;

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    var nome = form.nome.value.trim();
    var email = form.email.value.trim();
    var mensagem = form.mensagem.value.trim();

    feedback.classList.remove("error");

    if (!nome || !email || !mensagem) {
      feedback.textContent = "Por favor, preencha todos os campos.";
      feedback.classList.add("error");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      feedback.textContent = "Por favor, informe um e-mail válido.";
      feedback.classList.add("error");
      return;
    }

    var assunto = "Contato pelo site — " + nome;
    var corpo =
      "Nome: " + nome + "\n" +
      "E-mail: " + email + "\n\n" +
      mensagem;

    window.location.href =
      "mailto:" + CONTACT_EMAIL +
      "?subject=" + encodeURIComponent(assunto) +
      "&body=" + encodeURIComponent(corpo);

    feedback.textContent =
      "Seu aplicativo de e-mail foi aberto. Se preferir, escreva direto para " + CONTACT_EMAIL + ".";
  });

  /* Ano atual no rodapé */
  var anoEl = document.getElementById("anoAtual");
  if (anoEl) anoEl.textContent = String(new Date().getFullYear());

  /* Links das lojas (placeholders até os apps terem URL definitiva) */
  document.querySelectorAll(".store-badge[href='#']").forEach(function (badge) {
    badge.addEventListener("click", function (event) {
      event.preventDefault();
    });
  });
})();
