/* ================================
   PORTFOLIO INTERACTIONS
================================ */

document.addEventListener("DOMContentLoaded", () => {
  revealOnScroll();
  magneticProjectCards();
  cursorGlow();
  smoothAnchorScroll();
});

/* ================================
   SCROLL REVEAL ANIMATION
================================ */

function revealOnScroll() {
  // Section-level entrance is already handled by the CSS "fadeUp" animation on load;
  // this only staggers the individual cards inside those sections as they scroll into view.
  const revealElements = document.querySelectorAll(
    ".project-card, .service-card, .stat-card"
  );

  revealElements.forEach((element) => {
    element.classList.add("reveal");
  });

  const observerOptions = {
    threshold: 0.16,
    rootMargin: "0px 0px -60px 0px",
  };

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach((element) => {
    revealObserver.observe(element);
  });
}

/* ================================
   PROJECT CARD HOVER MOVEMENT
================================ */

function magneticProjectCards() {
  const cards = document.querySelectorAll(".project-card");

  cards.forEach((card) => {
    card.addEventListener("mousemove", (event) => {
      const cardRect = card.getBoundingClientRect();

      const x = event.clientX - cardRect.left;
      const y = event.clientY - cardRect.top;

      const centerX = cardRect.width / 2;
      const centerY = cardRect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -4;
      const rotateY = ((x - centerX) / centerX) * 4;

      card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg)";
    });
  });
}

/* ================================
   CURSOR GLOW EFFECT
================================ */

function cursorGlow() {
  const glow = document.createElement("div");
  glow.className = "cursor-glow";
  document.body.appendChild(glow);

  let mouseX = 0;
  let mouseY = 0;

  let glowX = 0;
  let glowY = 0;

  window.addEventListener("mousemove", (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;
  });

  function animateGlow() {
    glowX += (mouseX - glowX) * 0.12;
    glowY += (mouseY - glowY) * 0.12;

    glow.style.transform = `translate(${glowX}px, ${glowY}px)`;

    requestAnimationFrame(animateGlow);
  }

  animateGlow();
}

/* ================================
   SMOOTH ANCHOR SCROLL
================================ */

function smoothAnchorScroll() {
  const links = document.querySelectorAll('a[href^="#"]');

  links.forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");

      if (targetId === "#") return;

      const targetSection = document.querySelector(targetId);

      if (!targetSection) return;

      event.preventDefault();

      targetSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  });
}

/* ================================
   OPTIONAL: TESTIMONIAL DOTS
================================ */

const dots = document.querySelectorAll(".slider-dots span");

dots.forEach((dot, index) => {
  dot.addEventListener("click", () => {
    dots.forEach((item) => item.classList.remove("active"));
    dot.classList.add("active");

    console.log(`Selected testimonial ${index + 1}`);
  });
});