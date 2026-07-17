/* ================================
   HOOGA CATALOG STACK
   Full-bleed vertical catalog for pages/project-hooga-catalog.html:
   one landscape (16:9, standing in for 1920x1080) spread after another
   with no gaps, lazy-loaded and gently faded in as each one scrolls
   into view, with a subtle position counter tracking progress.

   Wrapped in an IIFE on purpose - this page also loads ../js/script.js,
   which declares its own top-level consts (prefersReducedMotion,
   supportsFinePointer). Classic <script> tags share one global lexical
   scope, so unwrapped top-level consts here would collide with those
   and throw a SyntaxError that breaks both files.

   Real catalog photography lives in assets/images/hooga-catalog/,
   named 01.webp - 13.webp for stack order. buildPanel() renders a
   lazy-loaded <img> for every entry below.
================================ */
(function () {
  const CATALOG_ITEMS = [
    { image: "../assets/images/hooga-catalog/01.webp", alt: "Hooga catalog spread 1" },
    { image: "../assets/images/hooga-catalog/02.webp", alt: "Hooga catalog spread 2" },
    { image: "../assets/images/hooga-catalog/03.webp", alt: "Hooga catalog spread 3" },
    { image: "../assets/images/hooga-catalog/04.webp", alt: "Hooga catalog spread 4" },
    { image: "../assets/images/hooga-catalog/05.webp", alt: "Hooga catalog spread 5" },
    { image: "../assets/images/hooga-catalog/06.webp", alt: "Hooga catalog spread 6" },
    { image: "../assets/images/hooga-catalog/07.webp", alt: "Hooga catalog spread 7" },
    { image: "../assets/images/hooga-catalog/08.webp", alt: "Hooga catalog spread 8" },
    { image: "../assets/images/hooga-catalog/09.webp", alt: "Hooga catalog spread 9" },
    { image: "../assets/images/hooga-catalog/10.webp", alt: "Hooga catalog spread 10" },
    { image: "../assets/images/hooga-catalog/11.webp", alt: "Hooga catalog spread 11" },
    { image: "../assets/images/hooga-catalog/12.webp", alt: "Hooga catalog spread 12" },
    { image: "../assets/images/hooga-catalog/13.webp", alt: "Hooga catalog spread 13" }
  ];

  const catalog = document.getElementById("hgc-catalog");
  const counterCurrent = document.getElementById("hgc-counter-current");
  const counterTotal = document.getElementById("hgc-counter-total");

  if (!catalog || !CATALOG_ITEMS.length) return;

  const hgcPrefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  function buildVisual(item) {
    if (item.image) {
      return (
        '<img class="hgc-frame-img" src="' + item.image + '" alt="' +
        (item.alt || item.title) + '" loading="lazy" decoding="async" />'
      );
    }
    return (
      '<div class="hgc-visual ' + item.tone + '" aria-hidden="true">' +
      '<i class="' + item.icon + ' hgc-visual-icon"></i>' +
      '<span class="hgc-visual-label">' + item.title + "</span>" +
      "</div>"
    );
  }

  function buildPanel(item, index) {
    return (
      '<figure class="hgc-frame" data-index="' + index +
      '" aria-label="' + (item.alt || item.title) + '">' +
      buildVisual(item) +
      "</figure>"
    );
  }

  catalog.innerHTML = CATALOG_ITEMS.map(buildPanel).join("");

  if (counterTotal) {
    counterTotal.textContent = String(CATALOG_ITEMS.length).padStart(2, "0");
  }

  const frames = Array.from(catalog.querySelectorAll(".hgc-frame"));

  // --- Gentle fade-in as each spread enters the viewport ---
  if (hgcPrefersReducedMotion) {
    frames.forEach((frame) => frame.classList.add("is-visible"));
  } else {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
    );
    frames.forEach((frame) => revealObserver.observe(frame));
  }

  // --- Position counter: tracks whichever spread currently covers the
  // most viewport area. A single 0.5 threshold picks whichever frame's
  // observer callback last happens to fire, which is wrong on short
  // viewports where several 16:9 frames are >=50% visible at once (e.g.
  // mobile) - so instead every frame's live intersection ratio is kept
  // and the counter always reflects the single largest one. -->
  function updateCounter(index) {
    if (counterCurrent) {
      counterCurrent.textContent = String(index + 1).padStart(2, "0");
    }
  }

  const visibleRatios = new Array(frames.length).fill(0);

  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        visibleRatios[Number(entry.target.dataset.index)] = entry.intersectionRatio;
      });

      let bestIndex = 0;
      let bestRatio = -1;
      visibleRatios.forEach((ratio, i) => {
        if (ratio > bestRatio) {
          bestRatio = ratio;
          bestIndex = i;
        }
      });
      updateCounter(bestIndex);
    },
    { threshold: [0, 0.25, 0.5, 0.75, 1] }
  );
  frames.forEach((frame) => counterObserver.observe(frame));
})();
