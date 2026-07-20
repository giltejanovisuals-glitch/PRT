/* ================================
   CREATIVE BOARDS CONTROLLER
   Builds the .cb-card list and drives the .cb-preview pane from
   data/projects-data.js (window.PROJECTS_DATA), so editing that one
   file updates the whole "Creative Boards" section - no HTML editing
   required.

   Two preview states share one .cb-preview pane:
   - Ambient shuffle (.cb-preview-shuffle): a mixed pool of images from
     every project, auto-advancing slowly, pausable by hover/focus/drag.
   - Selected-project gallery (.cb-preview-gallery): the active
     project's own images, stacked vertically and scrollable.
   A project's gallery[] (data/projects-data.js) supplies real images;
   any project without one (gallery: []) falls back to generated
   .pd-placeholder tiles - the same placeholder pattern already used by
   js/project-detail.js - so this degrades gracefully today and upgrades
   automatically once more photography is added.

   If PROJECTS_DATA isn't available for any reason, the static cards
   already written into index.html are left exactly as they are, so
   the section never breaks or goes blank.
================================ */

const CB_PLACEHOLDER_COUNT = 4;
const CB_SHUFFLE_INTERVAL_MS = 4500;
const CB_SHUFFLE_RESUME_MS = 3000;

function cbGetPreviewImages(project) {
  if (Array.isArray(project.gallery) && project.gallery.length) {
    return project.gallery;
  }
  return Array.from({ length: CB_PLACEHOLDER_COUNT }, (_, i) => ({
    placeholder: true,
    index: i + 1,
  }));
}

function cbBuildTile(entry, project) {
  if (entry.placeholder) {
    return `
      <div class="pd-placeholder" aria-hidden="true">
        <div class="pd-placeholder-grid"></div>
        <div class="pd-placeholder-glow"></div>
        <i class="fa-regular fa-image"></i>
        <span class="pd-placeholder-label">${project.title}</span>
        <span class="pd-placeholder-dim">Preview ${entry.index} &middot; Placeholder</span>
      </div>
    `;
  }
  return `<img src="${entry.image}" alt="${entry.alt || project.title}" loading="lazy" />`;
}

function cbBuildCard(project) {
  const { id, number, title, category, image, overviewUrl } = project;

  return `
    <div class="cb-card" data-project-id="${id}">
      <button type="button" class="cb-card-select" aria-pressed="false" aria-label="Preview project: ${title}">
        <span class="cb-card-thumb">
          <img src="${image}" alt="" width="120" height="120" loading="lazy" />
        </span>
        <span class="cb-card-body">
          <span class="cb-card-number">${number}</span>
          <span class="cb-card-text">
            <span class="cb-card-title">${title}</span>
            <span class="cb-card-category">${category}</span>
          </span>
        </span>
      </button>
      <a class="cb-card-open" href="${overviewUrl}" aria-label="Open project: ${title}">
        Open <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
      </a>
    </div>
  `;
}

function initCreativeBoards() {
  const list = document.querySelector(".cb-list");
  const preview = document.getElementById("cbPreview");
  const shuffleTrack = document.getElementById("cbShuffle");
  const galleryTrack = document.getElementById("cbGallery");

  if (!list || !preview || !shuffleTrack || !galleryTrack) return;

  const projects = window.PROJECTS_DATA;
  if (!Array.isArray(projects) || projects.length === 0) return;

  list.innerHTML = projects.map(cbBuildCard).join("");

  // Ambient shuffle pool: up to 2 images per project, mixed together
  // and shuffled once so the resting state already reads as "all work".
  const pool = [];
  projects.forEach((project) => {
    cbGetPreviewImages(project)
      .slice(0, 2)
      .forEach((entry) => pool.push({ entry, project }));
  });
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  shuffleTrack.innerHTML = pool
    .map(({ entry, project }) => `<div class="cb-shuffle-slide">${cbBuildTile(entry, project)}</div>`)
    .join("");

  // prefersReducedMotion is declared by js/script.js, which loads after
  // this file but before DOMContentLoaded fires, so it's already in
  // scope by the time this callback runs. Guarded defensively in case
  // load order ever changes.
  const reduceMotion = typeof prefersReducedMotion !== "undefined" && prefersReducedMotion;

  let shuffleTimer = null;
  let resumeTimer = null;
  let selectedId = null;

  function stopShuffle() {
    if (shuffleTimer) {
      window.clearInterval(shuffleTimer);
      shuffleTimer = null;
    }
  }

  function startShuffle() {
    if (reduceMotion || pool.length < 2 || selectedId) return;
    stopShuffle();
    shuffleTimer = window.setInterval(() => {
      const slideWidth = shuffleTrack.clientWidth;
      const atEnd = shuffleTrack.scrollLeft + slideWidth >= shuffleTrack.scrollWidth - 4;
      shuffleTrack.scrollTo({
        left: atEnd ? 0 : shuffleTrack.scrollLeft + slideWidth,
        behavior: "smooth",
      });
    }, CB_SHUFFLE_INTERVAL_MS);
  }

  function pauseShuffleTemporarily() {
    if (selectedId) return;
    stopShuffle();
    if (resumeTimer) window.clearTimeout(resumeTimer);
    resumeTimer = window.setTimeout(startShuffle, CB_SHUFFLE_RESUME_MS);
  }

  // Manual browse: hover/focus pauses auto-advance; a mouse can also
  // grab and drag the track directly (touch/trackpad already scroll it
  // natively, so drag-follow is skipped for touch pointers).
  shuffleTrack.addEventListener("pointerenter", stopShuffle);
  shuffleTrack.addEventListener("pointerleave", () => { if (!selectedId) startShuffle(); });
  shuffleTrack.addEventListener("focusin", stopShuffle);
  shuffleTrack.addEventListener("focusout", () => { if (!selectedId) startShuffle(); });

  let dragState = null;
  shuffleTrack.addEventListener("pointerdown", (event) => {
    stopShuffle();
    if (event.pointerType === "touch") return;
    dragState = { startX: event.clientX, scrollLeft: shuffleTrack.scrollLeft };
    shuffleTrack.classList.add("is-dragging");
    shuffleTrack.setPointerCapture(event.pointerId);
  });
  shuffleTrack.addEventListener("pointermove", (event) => {
    if (!dragState) return;
    shuffleTrack.scrollLeft = dragState.scrollLeft - (event.clientX - dragState.startX);
  });
  function endDrag() {
    if (dragState) {
      dragState = null;
      shuffleTrack.classList.remove("is-dragging");
    }
    pauseShuffleTemporarily();
  }
  shuffleTrack.addEventListener("pointerup", endDrag);
  shuffleTrack.addEventListener("pointercancel", endDrag);

  function showGallery(project) {
    galleryTrack.innerHTML = cbGetPreviewImages(project)
      .map((entry) => `<div class="cb-gallery-tile">${cbBuildTile(entry, project)}</div>`)
      .join("");
    galleryTrack.scrollTop = 0;
    preview.classList.add("is-gallery-mode");
  }

  function showShuffle() {
    preview.classList.remove("is-gallery-mode");
    startShuffle();
  }

  function selectCard(card, project) {
    const alreadySelected = card.classList.contains("is-selected");

    list.querySelectorAll(".cb-card.is-selected").forEach((el) => {
      el.classList.remove("is-selected");
      const btn = el.querySelector(".cb-card-select");
      if (btn) btn.setAttribute("aria-pressed", "false");
    });

    if (alreadySelected) {
      selectedId = null;
      list.classList.remove("has-selection");
      showShuffle();
      return;
    }

    selectedId = project.id;
    card.classList.add("is-selected");
    const btn = card.querySelector(".cb-card-select");
    if (btn) btn.setAttribute("aria-pressed", "true");
    list.classList.add("has-selection");
    stopShuffle();
    showGallery(project);
  }

  list.querySelectorAll(".cb-card").forEach((card) => {
    const id = card.getAttribute("data-project-id");
    const project = projects.find((p) => p.id === id);
    if (!project) return;
    const button = card.querySelector(".cb-card-select");
    if (button) button.addEventListener("click", () => selectCard(card, project));
  });

  startShuffle();
}

document.addEventListener("DOMContentLoaded", initCreativeBoards);
