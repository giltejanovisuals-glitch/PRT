/* ================================
   PORTFOLIO INTERACTIONS
================================ */

/* Shared input-capability check: desktop-only effects (custom cursor
   glow, magnetic cards, dock magnification) only make sense with a
   real mouse. Touch devices - including touch laptops - skip them
   entirely rather than just hiding their output with CSS. */
const supportsFinePointer = window.matchMedia(
  "(hover: hover) and (pointer: fine)"
).matches;

const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

document.addEventListener("DOMContentLoaded", () => {
  revealOnScroll();
  scrollStory();
  toolkitDockReveal();
  heroMediaBehavior();
  dynamicNav();
  macDockToolkit();
  servicesCarousel();
  smoothAnchorScroll();

  if (supportsFinePointer) {
    magneticProjectCards();
    cursorGlow();
  }
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

  if (prefersReducedMotion) {
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
   PROJECT CARD HOVER MOVEMENT (desktop / fine pointer only)
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
   CURSOR GLOW EFFECT (desktop / fine pointer only)
================================ */

function cursorGlow() {
  const glow = document.createElement("div");
  glow.className = "cursor-glow";
  document.body.appendChild(glow);

  let mouseX = 0;
  let mouseY = 0;

  let glowX = 0;
  let glowY = 0;

  let rafId = null;

  window.addEventListener(
    "mousemove",
    (event) => {
      mouseX = event.clientX;
      mouseY = event.clientY;
    },
    { passive: true }
  );

  function animateGlow() {
    glowX += (mouseX - glowX) * 0.12;
    glowY += (mouseY - glowY) * 0.12;

    glow.style.transform = `translate(${glowX}px, ${glowY}px)`;

    rafId = requestAnimationFrame(animateGlow);
  }

  // Don't spend a rAF loop animating a glow nobody can see.
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = null;
    } else if (!rafId) {
      animateGlow();
    }
  });

  animateGlow();
}

/* ================================
   HERO VIDEO / MEDIA BEHAVIOR
   Respects reduced-motion, avoids autoplay on save-data connections,
   and pauses decorative playback while the tab is hidden.
================================ */

function heroMediaBehavior() {
  const video = document.querySelector(".hero-bg-video");
  if (!video) return;

  const connection =
    navigator.connection || navigator.webkitConnection || navigator.mozConnection;
  const isDataSaver = Boolean(connection && connection.saveData);

  if (prefersReducedMotion || isDataSaver) {
    video.pause();
    video.removeAttribute("autoplay");
    video.loop = false;
    return;
  }

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      video.pause();
    } else {
      video.play().catch(() => {
        /* Autoplay can be blocked after backgrounding - the poster
           image still covers this case, so there's nothing to fix. */
      });
    }
  });
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
        behavior: prefersReducedMotion ? "auto" : "smooth",
        block: "start",
      });
    });
  });
}

/* ================================
   FLOATING DYNAMIC-ISLAND NAV
   On mobile the pill only shows 4 stops (Home, Work, About, Contact -
   see css/responsive.css), but every section still needs to light up
   the nearest visible pill as it scrolls past, so the map below
   collapses the hidden sections onto their closest kept destination.
================================ */

const MOBILE_NAV_QUERY = "(max-width: 767px)";
const MOBILE_SECTION_FALLBACK = {
  "#services": "#experience",
  "#toolkit": "#experience",
  "#education": "#experience",
};

function dynamicNav() {
  const nav = document.querySelector(".dynamic-nav");
  if (!nav) return;

  const navItems = Array.from(nav.querySelectorAll(".nav-item"));
  const sections = navItems
    .map((item) => document.querySelector(item.getAttribute("data-target")))
    .filter(Boolean);

  const isMobileNav = () => window.matchMedia(MOBILE_NAV_QUERY).matches;

  let suppressSpy = false;
  let suppressTimer = null;

  function setActive(targetId) {
    const resolvedId =
      isMobileNav() && MOBILE_SECTION_FALLBACK[targetId]
        ? MOBILE_SECTION_FALLBACK[targetId]
        : targetId;

    navItems.forEach((item) => {
      item.classList.toggle(
        "active",
        item.getAttribute("data-target") === resolvedId
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

  if (prefersReducedMotion) {
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

  if (supportsFinePointer) {
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

    dock.addEventListener(
      "mousemove",
      (event) => {
        lastEvent = event;

        if (!ticking) {
          ticking = true;
          requestAnimationFrame(() => applyMagnify(lastEvent));
        }
      },
      { passive: true }
    );

    dock.addEventListener("mouseleave", () => {
      items.forEach((item) => {
        item.style.transform = "scale(1) translateY(0)";
        item.style.setProperty("--dock-glow", "0");
      });
    });

    return;
  }

  // Touch (and keyboard) devices: the dock is a swipeable/focusable row.
  // An above-icon tooltip would get clipped by the horizontal scroll
  // container, so the nearest-to-center (or focused) tool's description
  // mirrors into a shared caption below the row instead.
  const caption = document.querySelector(".toolkit-active-caption");
  const captionTitle = caption ? caption.querySelector("h4") : null;
  const captionText = caption ? caption.querySelector("p") : null;

  function setActive(item) {
    items.forEach((other) => {
      const active = other === item;
      other.classList.toggle("is-active", active);
      other.style.setProperty("--dock-glow", active ? "1" : "0");
    });

    const tooltipTitle = item.querySelector(".dock-tooltip h4");
    const tooltipText = item.querySelector(".dock-tooltip p");

    if (captionTitle && captionText && tooltipTitle && tooltipText) {
      captionTitle.textContent = tooltipTitle.textContent;
      captionText.textContent = tooltipText.textContent;
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

    // Keyboard focus (Tab) gets the same active/caption treatment as a
    // tap, so the tooltip content is reachable without a mouse.
    item.addEventListener("focus", () => setActive(item));
  });

  if (items.length) {
    setActive(items[0]);
  }
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
      behavior: prefersReducedMotion ? "auto" : "smooth",
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
  window.addEventListener("resize", debounce(updateArrowState, 150));
  window.addEventListener("orientationchange", () =>
    setTimeout(updateArrowState, 200)
  );

  updateArrowState();
}

/* ================================
   UTILS
================================ */

function debounce(fn, wait) {
  let timer = null;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), wait);
  };
}

/* ================================
   OPTIONAL: TESTIMONIAL DOTS
================================ */

const dots = document.querySelectorAll(".slider-dots span");

dots.forEach((dot) => {
  dot.addEventListener("click", () => {
    dots.forEach((item) => item.classList.remove("active"));
    dot.classList.add("active");
  });
});
