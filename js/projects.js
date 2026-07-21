/* ================================
   CREATIVE BOARDS CONTROLLER
   Builds the .cb-card row and drives the .cb-preview pane from
   data/projects-data.js (window.PROJECTS_DATA), so editing that one
   file updates the whole "Creative Boards" section - no HTML editing
   required.

   Two preview states live stacked on top of each other inside
   .cb-preview and are crossfaded by toggling .is-gallery-mode on the
   pane itself:
   - Ambient crossfade (.cb-preview-shuffle): one image at a time,
     pulled at random from every project, slowly cross-fading between
     two stacked layers. No arrows, dots, scrollbars, or drag - purely
     ambient and automatic.
   - Selected-project gallery (.cb-preview-gallery): the active
     project's own images, each at full pane width and its own natural
     height (width: 100%, height: auto - never cropped), stacked
     directly on top of one another with no gap/margin/padding, in one
     continuous vertical sequence that drifts slowly top-to-bottom and
     loops seamlessly (the track's content is duplicated once, and the
     CSS animation travels exactly one original-length distance so the
     loop point is invisible). Also fully automatic - no manual scroll,
     drag, or arrows.

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
const CB_AMBIENT_INTERVAL_MS = 6000;
const CB_MARQUEE_SECONDS_PER_TILE = 9;
const CB_MARQUEE_MIN_SECONDS = 28;

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
  const { id, number, title, category, overviewUrl } = project;

  return `
    <div class="cb-card" data-project-id="${id}">
      <button type="button" class="cb-card-select" aria-pressed="false" aria-label="Preview project: ${title}">
        <span class="cb-card-active-dot" aria-hidden="true"></span>
        <span class="cb-card-number">${number}</span>
        <span class="cb-card-title">${title}</span>
        <span class="cb-card-category">${category}</span>
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
  const galleryTrack = document.getElementById("cbGalleryTrack");

  if (!list || !preview || !shuffleTrack || !galleryTrack) return;

  const projects = window.PROJECTS_DATA;
  if (!Array.isArray(projects) || projects.length === 0) return;

  list.innerHTML = projects.map(cbBuildCard).join("");

  // prefersReducedMotion is declared by js/script.js, which loads after
  // this file but before DOMContentLoaded fires, so it's already in
  // scope by the time this callback runs. Guarded defensively in case
  // load order ever changes.
  const reduceMotion = typeof prefersReducedMotion !== "undefined" && prefersReducedMotion;

  /* --- Ambient crossfade: one image at a time, random across projects --- */
  // Mixed pool: up to 3 images per project, drawn from at random (not
  // played sequentially), so the resting state reads as "all work"
  // without ever repeating a fixed order.
  const pool = [];
  projects.forEach((project) => {
    cbGetPreviewImages(project)
      .slice(0, 3)
      .forEach((entry) => pool.push({ entry, project }));
  });

  const shuffleLayers = shuffleTrack.querySelectorAll(".cb-shuffle-layer");
  let activeLayerIndex = 0;
  let lastPoolItem = null;
  let ambientTimer = null;
  let selectedId = null;

  function cbPickPoolItem() {
    if (pool.length === 0) return null;
    if (pool.length === 1) return pool[0];
    let pick;
    do {
      pick = pool[Math.floor(Math.random() * pool.length)];
    } while (pick === lastPoolItem);
    return pick;
  }

  function cbShowNextAmbient() {
    const item = cbPickPoolItem();
    if (!item) return;
    lastPoolItem = item;
    const nextLayerIndex = 1 - activeLayerIndex;
    const nextLayer = shuffleLayers[nextLayerIndex];
    const prevLayer = shuffleLayers[activeLayerIndex];
    nextLayer.innerHTML = cbBuildTile(item.entry, item.project);
    requestAnimationFrame(() => {
      nextLayer.classList.add("is-active");
      prevLayer.classList.remove("is-active");
      activeLayerIndex = nextLayerIndex;
    });
  }

  function startAmbient() {
    if (selectedId || pool.length === 0) return;
    if (!shuffleLayers[0].innerHTML && !shuffleLayers[1].innerHTML) {
      cbShowNextAmbient();
    }
    if (reduceMotion || pool.length < 2) return;
    stopAmbient();
    ambientTimer = window.setInterval(cbShowNextAmbient, CB_AMBIENT_INTERVAL_MS);
  }

  function stopAmbient() {
    if (ambientTimer) {
      window.clearInterval(ambientTimer);
      ambientTimer = null;
    }
  }

  /* --- Selected-project gallery: seamless, slow, one-direction drift --- */
  function showGallery(project) {
    const images = cbGetPreviewImages(project);
    const tilesHtml = images
      .map((entry) => {
        const modifier = entry.placeholder ? " cb-gallery-tile--placeholder" : "";
        return `<div class="cb-gallery-tile${modifier}">${cbBuildTile(entry, project)}</div>`;
      })
      .join("");
    const canLoop = images.length > 1 && !reduceMotion;

    galleryTrack.innerHTML = canLoop ? tilesHtml + tilesHtml : tilesHtml;
    galleryTrack.classList.toggle("is-looping", canLoop);
    galleryTrack.style.setProperty(
      "--cb-marquee-duration",
      `${Math.max(images.length * CB_MARQUEE_SECONDS_PER_TILE, CB_MARQUEE_MIN_SECONDS)}s`
    );

    preview.classList.add("is-gallery-mode");
  }

  function showAmbient() {
    preview.classList.remove("is-gallery-mode");
    startAmbient();
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
      showAmbient();
      return;
    }

    selectedId = project.id;
    card.classList.add("is-selected");
    const btn = card.querySelector(".cb-card-select");
    if (btn) btn.setAttribute("aria-pressed", "true");
    list.classList.add("has-selection");
    stopAmbient();
    showGallery(project);
  }

  list.querySelectorAll(".cb-card").forEach((card) => {
    const id = card.getAttribute("data-project-id");
    const project = projects.find((p) => p.id === id);
    if (!project) return;
    const button = card.querySelector(".cb-card-select");
    if (button) button.addEventListener("click", () => selectCard(card, project));
  });

  startAmbient();
}

document.addEventListener("DOMContentLoaded", initCreativeBoards);
