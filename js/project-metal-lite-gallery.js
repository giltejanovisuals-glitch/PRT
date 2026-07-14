/* ================================
   METAL-LITE CAMPAIGN GALLERY
   Apple-product-gallery-style image browser for
   pages/project-metal-lite-campaign.html: a large selected-image
   preview, a horizontally scrollable thumbnail strip, and a dynamic
   detail panel that all stay in sync with a single activeIndex.

   Wrapped in an IIFE on purpose - this page also loads ../js/script.js,
   which declares its own top-level consts (prefersReducedMotion,
   supportsFinePointer). Classic <script> tags share one global lexical
   scope, so unwrapped top-level consts here would collide with those
   and throw a SyntaxError that breaks both files.

   PLACEHOLDER ARTWORK: each gallery entry renders as a styled gradient
   panel (see the .mlc-tone-* classes in css/style.css) standing in for
   real campaign photography. Once real photography exists, add an
   "image"/"alt" field per item below and swap buildVisual() for an
   <img src="..." alt="..."> - the surrounding gallery mechanics
   (selection, transitions, nav, swipe, keyboard) don't need to change.
================================ */
(function () {
  const GALLERY_ITEMS = [
    {
      ratio: "16:9",
      tone: "mlc-tone-a",
      icon: "fa-solid fa-bolt",
      title: "Launch Key Visual",
      purpose: "Primary hero image anchoring the entire campaign system across every channel.",
      format: "Key Visual · Digital & Print",
      focus: "Bold, high-contrast composition built to scale from a phone screen to a shopfront window."
    },
    {
      ratio: "1:1",
      tone: "mlc-tone-b",
      icon: "fa-regular fa-square",
      title: "Social Key Visual",
      purpose: "Adapting the primary hero for square social placements without losing its impact.",
      format: "Social Key Visual · 1:1 Crop",
      focus: "Recomposing the same visual grammar around a centered focal point for feed placements."
    },
    {
      ratio: "4:5",
      tone: "mlc-tone-c",
      icon: "fa-solid fa-tag",
      title: "In-Store Shelf Talker",
      purpose: "Point-of-sale signage guiding shoppers to Metal-Lite at the shelf.",
      format: "Retail Signage · Print",
      focus: "High-contrast, shelf-level legibility designed to be scanned in seconds."
    },
    {
      ratio: "3:2",
      tone: "mlc-tone-d",
      icon: "fa-solid fa-store",
      title: "Window Display Signage",
      purpose: "Large-format storefront signage announcing the launch.",
      format: "Retail Signage · Large-Format Print",
      focus: "Oversized typographic hierarchy readable from across the street."
    },
    {
      ratio: "1:1",
      tone: "mlc-tone-a",
      icon: "fa-solid fa-images",
      title: "Paid Social Ad Carousel",
      purpose: "A swipeable ad set built for Instagram and Facebook placements.",
      format: "Digital Advertisement · Carousel",
      focus: "A consistent crop and color system so every card reads as one campaign."
    },
    {
      ratio: "16:9",
      tone: "mlc-tone-b",
      icon: "fa-solid fa-display",
      title: "Display Banner Set",
      purpose: "A modular banner system for programmatic and direct web placements.",
      format: "Digital Advertisement · Multi-Size Banner",
      focus: "One layout logic that rescales cleanly from leaderboard to skyscraper."
    },
    {
      ratio: "3:2",
      tone: "mlc-tone-c",
      icon: "fa-solid fa-ruler-combined",
      title: "Product Spec Layout",
      purpose: "A clean technical breakdown of materials and dimensions for retail partners.",
      format: "Product Layout · Print Catalog",
      focus: "Balancing dense spec information with generous product photography."
    },
    {
      ratio: "4:5",
      tone: "mlc-tone-d",
      icon: "fa-solid fa-couch",
      title: "Lifestyle Product Spread",
      purpose: "Positioning the product in a considered, everyday setting.",
      format: "Product Layout · Editorial Spread",
      focus: "Softer lighting and styling that frames the product as aspirational, not clinical."
    }
  ];

  const stage = document.getElementById("mlc-stage");
  const thumbs = document.getElementById("mlc-thumbs");
  const detail = document.getElementById("mlc-detail");
  const counterCurrent = document.getElementById("mlc-counter-current");
  const counterTotal = document.getElementById("mlc-counter-total");
  const previewEl = document.getElementById("mlc-preview");
  const prevBtn = document.querySelector(".mlc-nav-prev");
  const nextBtn = document.querySelector(".mlc-nav-next");
  const swipeHintEl = document.getElementById("mlc-swipe-hint");

  if (!stage || !thumbs || !detail || !GALLERY_ITEMS.length) return;

  const mlcPrefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  // Matches the site's own mobile tier (see css/responsive.css) - the
  // premium drag-follow carousel and the arrow-free layout only ever
  // apply below this width; desktop/tablet keep the original
  // click/keyboard crossfade and visible arrows untouched.
  function isMobile() {
    return window.matchMedia("(max-width: 767px)").matches;
  }

  let activeIndex = 0;

  function toCssRatio(ratio) {
    return ratio.replace(":", " / ");
  }

  function buildVisual(item) {
    return (
      '<div class="mlc-preview-visual ' + item.tone + '" aria-hidden="true">' +
      '<i class="' + item.icon + ' mlc-visual-icon"></i>' +
      '<span class="mlc-visual-label">' + item.format + "</span>" +
      "</div>"
    );
  }

  // skipEnter: renders the frame already fully settled (opacity 1,
  // scale 1) with no fade-in - used right after the mobile drag-follow
  // carousel finishes its own slide animation, so the DOM reset back to
  // a single plain frame never produces a second, redundant crossfade.
  function renderStage(skipEnter) {
    const item = GALLERY_ITEMS[activeIndex];
    stage.innerHTML =
      '<div class="mlc-preview-frame" style="aspect-ratio: ' +
      toCssRatio(item.ratio) +
      '">' +
      buildVisual(item) +
      "</div>";

    const frame = stage.querySelector(".mlc-preview-frame");
    if (!frame) return;

    if (mlcPrefersReducedMotion || skipEnter) {
      frame.classList.add("is-active");
      return;
    }

    requestAnimationFrame(() => {
      requestAnimationFrame(() => frame.classList.add("is-active"));
    });
  }

  function renderThumbs() {
    thumbs.innerHTML = GALLERY_ITEMS.map(
      (item, i) =>
        '<button type="button" class="mlc-thumb" data-index="' +
        i +
        '" role="option" aria-selected="' +
        (i === activeIndex) +
        '" aria-label="' +
        item.title +
        '">' +
        '<span class="mlc-thumb-visual ' +
        item.tone +
        '" aria-hidden="true"><i class="' +
        item.icon +
        '"></i></span>' +
        "</button>"
    ).join("");

    thumbs.querySelectorAll(".mlc-thumb").forEach((btn) => {
      btn.addEventListener("click", () => goTo(Number(btn.dataset.index)));
    });
  }

  function renderDetail() {
    const item = GALLERY_ITEMS[activeIndex];
    detail.innerHTML =
      '<h3 class="mlc-detail-title">' +
      item.title +
      "</h3>" +
      '<p class="mlc-detail-purpose">' +
      item.purpose +
      "</p>" +
      '<div class="mlc-detail-block"><dt>Format</dt><dd>' +
      item.format +
      "</dd></div>" +
      '<div class="mlc-detail-block"><dt>Design Focus</dt><dd>' +
      item.focus +
      "</dd></div>";
  }

  function updateCounter() {
    if (counterCurrent) {
      counterCurrent.textContent = String(activeIndex + 1).padStart(2, "0");
    }
    if (counterTotal) {
      counterTotal.textContent = String(GALLERY_ITEMS.length).padStart(2, "0");
    }
  }

  function updateActiveThumb() {
    thumbs.querySelectorAll(".mlc-thumb").forEach((btn, i) => {
      const active = i === activeIndex;
      btn.classList.toggle("is-active", active);
      btn.setAttribute("aria-selected", String(active));

      if (active) {
        btn.scrollIntoView({
          behavior: mlcPrefersReducedMotion ? "auto" : "smooth",
          inline: "center",
          block: "nearest"
        });
      }
    });
  }

  function goTo(index, opts) {
    const total = GALLERY_ITEMS.length;
    activeIndex = ((index % total) + total) % total;
    renderStage(opts && opts.skipEnter);
    renderDetail();
    updateCounter();
    updateActiveThumb();
    dismissSwipeHint();
  }

  // --- Init ---
  renderThumbs();
  renderStage();
  renderDetail();
  updateCounter();
  updateActiveThumb();

  // --- Prev / Next controls (desktop only - hidden on mobile via CSS,
  // see the 767px tier in css/responsive.css) ---
  if (prevBtn) prevBtn.addEventListener("click", () => goTo(activeIndex - 1));
  if (nextBtn) nextBtn.addEventListener("click", () => goTo(activeIndex + 1));

  // --- Keyboard arrow support (desktop) ---
  document.addEventListener("keydown", (event) => {
    if (event.metaKey || event.ctrlKey || event.altKey) return;

    const active = document.activeElement;
    const tag = active ? active.tagName : "";
    if (tag === "INPUT" || tag === "TEXTAREA" || (active && active.isContentEditable)) {
      return;
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      goTo(activeIndex - 1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      goTo(activeIndex + 1);
    }
  });

  // --- Mobile-only first-visit swipe hint. Shown once ever (tracked in
  // localStorage), dismissed by any navigation or the first touch on
  // the preview/thumbnail strip. ---
  let swipeHintTimer = null;

  function dismissSwipeHint() {
    if (!swipeHintEl) return;
    if (swipeHintEl.classList.contains("is-visible")) {
      swipeHintEl.classList.remove("is-visible");
    }
    if (swipeHintTimer) {
      clearTimeout(swipeHintTimer);
      swipeHintTimer = null;
    }
    try {
      window.localStorage.setItem("mlcSwipeHintSeen", "1");
    } catch (e) {
      /* Storage unavailable (private browsing, disabled) - hint just
         won't persist as "seen" across visits, which is harmless. */
    }
  }

  function maybeShowSwipeHint() {
    if (!swipeHintEl || mlcPrefersReducedMotion || !isMobile()) return;

    let alreadySeen = false;
    try {
      alreadySeen = window.localStorage.getItem("mlcSwipeHintSeen") === "1";
    } catch (e) {
      alreadySeen = false;
    }
    if (alreadySeen) return;

    swipeHintEl.classList.add("is-visible");
    swipeHintTimer = setTimeout(dismissSwipeHint, 3600);
  }

  maybeShowSwipeHint();

  // --- Large preview: mobile drag-follow carousel + desktop/tablet
  // basic swipe. Below the site's 767px mobile breakpoint, a horizontal
  // drag builds a three-slide track (prev/current/next) that follows
  // the finger 1:1, with the current slide easing down in scale/opacity
  // as it moves away and the incoming slide easing up to full size -
  // then snaps to the nearest slide with soft easing on release. At
  // 768px and up (including touch tablets), it falls back to the
  // original threshold-swipe-then-crossfade so desktop's click/keyboard
  // experience (and its visible arrows) stay exactly as they were. ---
  (function enablePreviewSwipe() {
    const target = previewEl || stage;
    const SWIPE_COMMIT_RATIO = 0.22;
    const SETTLE_MS = 480;
    const EASING = "cubic-bezier(0.22, 1, 0.36, 1)";

    let dragging = false;
    let axisLocked = null; // null | "x" | "y"
    let startX = 0;
    let startY = 0;
    let lastDx = 0;
    let stageWidth = 0;
    let track = null;
    let currentFrame = null;

    function buildSlideMarkup(item) {
      // transition: none inline - overrides the base .mlc-preview-frame
      // crossfade transition (used for the desktop click/keyboard path)
      // so these frames track the finger 1:1 with zero lag during drag.
      // settle() re-enables a transition on them for the commit/snap-back.
      return (
        '<div class="mlc-preview-frame is-active" style="aspect-ratio: ' +
        toCssRatio(item.ratio) +
        '; transition: none;">' +
        buildVisual(item) +
        "</div>"
      );
    }

    function buildScene() {
      const total = GALLERY_ITEMS.length;
      const prevItem = GALLERY_ITEMS[(activeIndex - 1 + total) % total];
      const currentItem = GALLERY_ITEMS[activeIndex];
      const nextItem = GALLERY_ITEMS[(activeIndex + 1) % total];

      stageWidth = stage.clientWidth;

      stage.innerHTML =
        '<div class="mlc-swipe-track" id="mlc-swipe-track">' +
        '<div class="mlc-swipe-slot" data-role="prev">' + buildSlideMarkup(prevItem) + "</div>" +
        '<div class="mlc-swipe-slot" data-role="current">' + buildSlideMarkup(currentItem) + "</div>" +
        '<div class="mlc-swipe-slot" data-role="next">' + buildSlideMarkup(nextItem) + "</div>" +
        "</div>";

      track = stage.querySelector("#mlc-swipe-track");
      track.style.transition = "none";
      track.style.width = stageWidth * 3 + "px";
      track.style.transform = "translateX(" + -stageWidth + "px)";

      currentFrame = stage.querySelector('.mlc-swipe-slot[data-role="current"] .mlc-preview-frame');
    }

    function updateDrag(dx) {
      lastDx = dx;
      if (!track) return;
      track.style.transform = "translateX(" + (-stageWidth + dx) + "px)";

      const progress = Math.min(Math.abs(dx) / stageWidth, 1);
      const role = dx < 0 ? "next" : "prev";
      const targetSlot = stage.querySelector('.mlc-swipe-slot[data-role="' + role + '"]');
      const targetFrame = targetSlot ? targetSlot.querySelector(".mlc-preview-frame") : null;

      if (currentFrame) {
        currentFrame.style.transform = "scale(" + (1 - progress * 0.06) + ")";
        currentFrame.style.opacity = String(1 - progress * 0.15);

        // Subtle parallax: the image content drifts slightly less than
        // the frame itself, so the frame reads as a layer above it.
        const visual = currentFrame.querySelector(".mlc-preview-visual");
        if (visual) visual.style.transform = "translateX(" + dx * 0.08 + "px)";
      }

      if (targetFrame) {
        targetFrame.style.transform = "scale(" + (0.92 + progress * 0.08) + ")";
        targetFrame.style.opacity = String(0.85 + progress * 0.15);
      }
    }

    function settle(commitDirection) {
      if (!track) return;

      track.style.transition = "transform " + SETTLE_MS + "ms " + EASING;

      const frames = Array.from(stage.querySelectorAll(".mlc-preview-frame"));
      frames.forEach((frame) => {
        frame.style.transition =
          "transform " + SETTLE_MS + "ms " + EASING + ", opacity " + SETTLE_MS + "ms " + EASING;
      });

      let nextIndex = activeIndex;

      if (commitDirection === "next") {
        track.style.transform = "translateX(" + -stageWidth * 2 + "px)";
        nextIndex = activeIndex + 1;
      } else if (commitDirection === "prev") {
        track.style.transform = "translateX(0px)";
        nextIndex = activeIndex - 1;
      } else {
        track.style.transform = "translateX(" + -stageWidth + "px)";
      }

      const total = GALLERY_ITEMS.length;
      const targetRole = commitDirection === "next" ? "next" : commitDirection === "prev" ? "prev" : null;
      const targetFrame = targetRole
        ? stage.querySelector('.mlc-swipe-slot[data-role="' + targetRole + '"] .mlc-preview-frame')
        : null;

      if (currentFrame) {
        currentFrame.style.transform = commitDirection ? "scale(0.92)" : "scale(1)";
        currentFrame.style.opacity = commitDirection ? "0.85" : "1";
        const visual = currentFrame.querySelector(".mlc-preview-visual");
        if (visual) {
          visual.style.transition = "transform " + SETTLE_MS + "ms " + EASING;
          visual.style.transform = "translateX(0px)";
        }
      }

      if (targetFrame) {
        targetFrame.style.transform = "scale(1)";
        targetFrame.style.opacity = "1";
      }

      let settled = false;
      const finish = () => {
        if (settled) return;
        settled = true;
        goTo(((nextIndex % total) + total) % total, { skipEnter: true });
      };

      track.addEventListener("transitionend", finish, { once: true });
      setTimeout(finish, SETTLE_MS + 80);
    }

    target.addEventListener(
      "touchstart",
      (event) => {
        if (event.touches.length > 1) return;
        const touch = event.touches[0];
        startX = touch.clientX;
        startY = touch.clientY;
        lastDx = 0;
        dragging = true;
        axisLocked = null;
        dismissSwipeHint();
      },
      { passive: true }
    );

    target.addEventListener(
      "touchmove",
      (event) => {
        if (!dragging || !isMobile()) return;

        const touch = event.touches[0];
        const dx = touch.clientX - startX;
        const dy = touch.clientY - startY;

        if (axisLocked === null) {
          if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return;
          axisLocked = Math.abs(dx) > Math.abs(dy) ? "x" : "y";
          if (axisLocked === "x") buildScene();
        }

        if (axisLocked !== "x") return;

        // Only ever swallow the gesture once it's unambiguously
        // horizontal, so normal vertical page scrolling is never
        // hijacked by a swipe that turns out to be a scroll.
        event.preventDefault();
        updateDrag(dx);
      },
      { passive: false }
    );

    target.addEventListener("touchend", (event) => {
      if (!dragging) return;
      dragging = false;

      if (isMobile()) {
        if (axisLocked === "x" && track) {
          const ratio = lastDx / stageWidth;
          let direction = null;
          if (ratio <= -SWIPE_COMMIT_RATIO) direction = "next";
          else if (ratio >= SWIPE_COMMIT_RATIO) direction = "prev";
          settle(direction);
        }
      } else {
        // Desktop/tablet fallback: simple threshold swipe into the
        // existing crossfade, unchanged from before.
        const touch = event.changedTouches[0];
        const deltaX = touch.clientX - startX;
        const deltaY = touch.clientY - startY;

        if (Math.abs(deltaX) > 40 && Math.abs(deltaX) > Math.abs(deltaY)) {
          goTo(activeIndex + (deltaX < 0 ? 1 : -1));
        }
      }

      axisLocked = null;
    });

    target.addEventListener("touchcancel", () => {
      if (!dragging) return;
      dragging = false;
      if (isMobile() && axisLocked === "x" && track) settle(null);
      axisLocked = null;
    });
  })();

  // --- Thumbnail strip: drag-to-scroll (mouse) + wheel navigation +
  // a quick-flick-to-navigate gesture on mobile. Native touch swipe and
  // trackpad scrolling already work for free via the strip's own
  // overflow-x: auto. ---
  (function enableThumbInteractions() {
    let isDown = false;
    let moved = false;
    let startX = 0;
    let startScroll = 0;

    thumbs.addEventListener("mousedown", (event) => {
      isDown = true;
      moved = false;
      thumbs.classList.add("is-dragging");
      startX = event.pageX;
      startScroll = thumbs.scrollLeft;
    });

    window.addEventListener("mousemove", (event) => {
      if (!isDown) return;
      const delta = event.pageX - startX;
      if (Math.abs(delta) > 4) moved = true;
      thumbs.scrollLeft = startScroll - delta;
    });

    window.addEventListener("mouseup", () => {
      isDown = false;
      thumbs.classList.remove("is-dragging");
    });

    // A drag that moved past the click threshold shouldn't also select
    // the thumbnail the cursor happens to release over.
    thumbs.addEventListener(
      "click",
      (event) => {
        if (moved) {
          event.stopPropagation();
          event.preventDefault();
          moved = false;
        }
      },
      true
    );

    thumbs.addEventListener(
      "wheel",
      (event) => {
        if (Math.abs(event.deltaY) > Math.abs(event.deltaX)) {
          thumbs.scrollLeft += event.deltaY;
          event.preventDefault();
        }
      },
      { passive: false }
    );

    // Mobile: a fast, short horizontal flick over the thumbnail strip
    // also advances the main slide (in addition to tapping a thumbnail
    // directly) - gated on speed/distance so it never fires during a
    // normal slower drag-to-browse-the-strip gesture.
    let touchStartX = 0;
    let touchStartY = 0;
    let touchStartTime = 0;

    thumbs.addEventListener(
      "touchstart",
      (event) => {
        const touch = event.touches[0];
        touchStartX = touch.clientX;
        touchStartY = touch.clientY;
        touchStartTime = Date.now();
        dismissSwipeHint();
      },
      { passive: true }
    );

    thumbs.addEventListener(
      "touchend",
      (event) => {
        if (!isMobile()) return;

        const touch = event.changedTouches[0];
        const dx = touch.clientX - touchStartX;
        const dy = touch.clientY - touchStartY;
        const elapsed = Date.now() - touchStartTime;

        if (elapsed < 350 && Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) {
          goTo(activeIndex + (dx < 0 ? 1 : -1));
        }
      },
      { passive: true }
    );
  })();

  // --- Scroll-reveal entrance for the gallery and case study sections,
  // reusing the site's generic .reveal/.is-visible fade-up pattern from
  // css/animations.css. ---
  (function revealSections() {
    if (mlcPrefersReducedMotion) return;

    const targets = [
      document.querySelector(".mlc-gallery"),
      document.querySelector(".mlc-case")
    ].filter(Boolean);

    if (!targets.length) return;

    targets.forEach((target) => target.classList.add("reveal"));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
    );

    targets.forEach((target) => observer.observe(target));
  })();
})();
