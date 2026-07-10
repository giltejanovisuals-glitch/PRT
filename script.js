/* ================================
   PORTFOLIO INTERACTIONS
================================ */

document.addEventListener("DOMContentLoaded", () => {
  revealOnScroll();
  magneticProjectCards();
  cursorGlow();
  smoothAnchorScroll();
  dynamicNav();
  macDockToolkit();
  servicesCarousel();
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
   FLOATING DYNAMIC-ISLAND NAV
================================ */

function dynamicNav() {
  const nav = document.querySelector(".dynamic-nav");
  if (!nav) return;

  const navItems = Array.from(nav.querySelectorAll(".nav-item"));
  const sections = navItems
    .map((item) => document.querySelector(item.getAttribute("data-target")))
    .filter(Boolean);

  let suppressSpy = false;
  let suppressTimer = null;

  function setActive(targetId) {
    navItems.forEach((item) => {
      item.classList.toggle(
        "active",
        item.getAttribute("data-target") === targetId
      );
    });
  }

  // Clicking a nav item jumps the active pill immediately (rather than
  // waiting for the scroll-spy below) and briefly suppresses the spy so
  // sections the scroll passes through on the way don't steal it back.
  navItems.forEach((item) => {
    item.addEventListener("click", () => {
      const targetId = item.getAttribute("data-target");
      const targetSection = document.querySelector(targetId);

      setActive(targetId);

      suppressSpy = true;
      clearTimeout(suppressTimer);
      suppressTimer = setTimeout(() => {
        suppressSpy = false;
      }, 900);

      if (targetSection) {
        targetSection.classList.remove("nav-target-flash");
        void targetSection.offsetWidth;
        targetSection.classList.add("nav-target-flash");
        setTimeout(() => {
          targetSection.classList.remove("nav-target-flash");
        }, 900);
      }
    });
  });

  const spyObserver = new IntersectionObserver(
    (entries) => {
      if (suppressSpy) return;

      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActive(`#${entry.target.id}`);
        }
      });
    },
    {
      rootMargin: "-45% 0px -45% 0px",
      threshold: 0,
    }
  );

  sections.forEach((section) => spyObserver.observe(section));
}

/* ================================
   MAC-STYLE DOCK (DAILY TOOLKIT)
================================ */

function macDockToolkit() {
  const dock = document.querySelector(".toolkit-dock");
  if (!dock) return;

  const items = Array.from(dock.querySelectorAll(".dock-item"));
  const supportsHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  if (!supportsHover) return;

  const maxScale = 1.55;
  const falloff = 140;
  let ticking = false;
  let lastEvent = null;

  function applyMagnify(event) {
    items.forEach((item) => {
      const rect = item.getBoundingClientRect();
      const itemCenter = rect.left + rect.width / 2;
      const distance = Math.abs(event.clientX - itemCenter);

      const strength = Math.max(0, 1 - distance / falloff);
      const scale = 1 + strength * (maxScale - 1);
      const lift = strength * 14;

      item.style.transform = `scale(${scale}) translateY(${-lift}px)`;
    });

    ticking = false;
  }

  dock.addEventListener("mousemove", (event) => {
    lastEvent = event;

    if (!ticking) {
      ticking = true;
      requestAnimationFrame(() => applyMagnify(lastEvent));
    }
  });

  dock.addEventListener("mouseleave", () => {
    items.forEach((item) => {
      item.style.transform = "scale(1) translateY(0)";
    });
  });
}

/* ================================
   SERVICES ARROW CAROUSEL
================================ */

function servicesCarousel() {
  const scroller = document.querySelector(".services-scroll");
  const prevButton = document.querySelector(".services-arrow-prev");
  const nextButton = document.querySelector(".services-arrow-next");

  if (!scroller || !prevButton || !nextButton) return;

  const scrollByPage = (direction) => {
    scroller.scrollBy({
      left: direction * scroller.clientWidth * 0.9,
      behavior: "smooth",
    });
  };

  prevButton.addEventListener("click", () => scrollByPage(-1));
  nextButton.addEventListener("click", () => scrollByPage(1));

  const updateArrowState = () => {
    const maxScrollLeft = scroller.scrollWidth - scroller.clientWidth;

    prevButton.disabled = scroller.scrollLeft <= 0;
    nextButton.disabled = scroller.scrollLeft >= maxScrollLeft - 1;
  };

  scroller.addEventListener("scroll", updateArrowState, { passive: true });
  window.addEventListener("resize", updateArrowState);

  updateArrowState();
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