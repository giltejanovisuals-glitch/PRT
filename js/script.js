/* ================================
   PORTFOLIO INTERACTIONS
================================ */

document.addEventListener("DOMContentLoaded", () => {
  revealOnScroll();
  scrollStory();
  toolkitDockReveal();
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
  // Simple fade-up for the smaller supporting elements. The sections with
  // a bespoke scroll story (hero, project boards, timeline, toolkit,
  // contact) are handled separately below.
  const revealElements = document.querySelectorAll(
    ".service-card, .stat-card, .impact-intro, .testimonial-card, .image-card, .education-card, .trusted-strip"
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
   SCROLL STORYTELLING
   Each section below arms itself with the "story-armed" class (which is
   what actually hides it in CSS) only once JS confirms it can run the
   reveal - so without JS, nothing is ever hidden in the first place.
================================ */

function scrollStory() {
  const targets = [
    document.querySelector(".hero"),
    document.querySelector(".project-grid"),
    document.querySelector(".experience-section"),
    document.querySelector(".contact-section"),
  ].filter(Boolean);

  if (!targets.length) return;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return;
  }

  targets.forEach((target) => target.classList.add("story-armed"));

  const storyObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-revealed");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -100px 0px" }
  );

  targets.forEach((target) => storyObserver.observe(target));
}

/* ================================
   PROJECT CARD HOVER MOVEMENT
   Bound on the grid (event delegation) rather than on each card
   directly, since js/projects.js may replace the cards after
   data/projects.json loads - delegation keeps this working no matter
   when that swap happens.
================================ */

function magneticProjectCards() {
  const grid = document.querySelector(".project-grid");
  if (!grid) return;

  grid.addEventListener("mousemove", (event) => {
    const card = event.target.closest(".project-card");
    if (!card) return;

    const cardRect = card.getBoundingClientRect();

    const x = event.clientX - cardRect.left;
    const y = event.clientY - cardRect.top;

    const centerX = cardRect.width / 2;
    const centerY = cardRect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -4;
    const rotateY = ((x - centerX) / centerX) * 4;

    card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });

  grid.addEventListener("mouseout", (event) => {
    const card = event.target.closest(".project-card");
    if (!card || card.contains(event.relatedTarget)) return;

    card.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg)";
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
   TOOLKIT DOCK ENTRANCE
   Icons slide up into the dock, staggered left to right, like a real
   dock loading its icons. Once settled, the transition is swapped back
   to the fast, snappy timing the hover-magnify effect needs.
================================ */

function toolkitDockReveal() {
  const dock = document.querySelector(".toolkit-dock");
  if (!dock) return;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return;
  }

  const items = Array.from(dock.querySelectorAll(".dock-item"));
  const staggerStep = 0.04;

  items.forEach((item, index) => {
    item.style.transitionDelay = `${index * staggerStep}s`;
  });

  dock.classList.add("story-armed");

  const dockObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        dock.classList.add("is-revealed");
        observer.unobserve(entry.target);

        const settleAfter = items.length * staggerStep * 1000 + 650;
        setTimeout(() => {
          items.forEach((item) => {
            item.style.transitionDelay = "";
          });
          dock.classList.add("story-settled");
        }, settleAfter);
      });
    },
    { threshold: 0.3 }
  );

  dockObserver.observe(dock);
}

/* ================================
   MAC-STYLE DOCK (DAILY TOOLKIT)
================================ */

function macDockToolkit() {
  const dock = document.querySelector(".toolkit-dock");
  if (!dock) return;

  const items = Array.from(dock.querySelectorAll(".dock-item"));
  const supportsHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  if (supportsHover) {
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
        item.style.setProperty("--dock-glow", strength.toFixed(3));
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
        item.style.setProperty("--dock-glow", "0");
      });
    });

    return;
  }

  // Touch devices: the dock becomes a swipeable row. An above-icon
  // tooltip would get clipped by the horizontal scroll container, so
  // the nearest-to-center tool's description mirrors into a shared
  // caption below the row instead, updating as you swipe or tap.
  const caption = document.querySelector(".toolkit-active-caption");
  const captionTitle = caption ? caption.querySelector("h4") : null;
  const captionText = caption ? caption.querySelector("p") : null;

  function setActive(item) {
    items.forEach((other) => {
      const active = other === item;
      other.classList.toggle("is-active", active);
      other.style.setProperty("--dock-glow", active ? "1" : "0");
    });

    if (captionTitle && captionText) {
      captionTitle.textContent = item.querySelector(".dock-tooltip h4").textContent;
      captionText.textContent = item.querySelector(".dock-tooltip p").textContent;
    }
  }

  function nearestToCenter() {
    const dockRect = dock.getBoundingClientRect();
    const centerX = dockRect.left + dockRect.width / 2;

    let closest = items[0];
    let closestDistance = Infinity;

    items.forEach((item) => {
      const rect = item.getBoundingClientRect();
      const distance = Math.abs(rect.left + rect.width / 2 - centerX);

      if (distance < closestDistance) {
        closestDistance = distance;
        closest = item;
      }
    });

    return closest;
  }

  let scrollTicking = false;

  dock.addEventListener(
    "scroll",
    () => {
      if (!scrollTicking) {
        scrollTicking = true;
        requestAnimationFrame(() => {
          setActive(nearestToCenter());
          scrollTicking = false;
        });
      }
    },
    { passive: true }
  );

  items.forEach((item) => {
    item.addEventListener("click", () => {
      item.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
      setActive(item);
    });
  });

  setActive(items[0]);
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