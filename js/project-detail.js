/* ================================
   PROJECT OVERVIEW PAGE LOADER
   Fills pages/project.html from data/projects-data.js
   (window.PROJECTS_DATA), keyed by the ?id= in the URL. One template
   serves every project - add or edit a project by editing that one
   data file only.

   Default markup state: the "not found" panel is visible and the
   project article is hidden, so a bad id or a missing id both land on
   the same friendly message instead of a blank page.
================================ */

/* The editorial gallery layout is a property of the template, not of
   any one project: a full-width shot, a pair of squares, a portrait +
   landscape pairing, then a closing full-width shot. Each project's
   own "gallery" array only needs to supply { image, alt } for the
   slots it has real photography for - anything missing renders as a
   designed placeholder in the correct ratio, so the pattern always
   looks intentional. */
const GALLERY_SLOTS = [
  { ratio: "16:9", full: true, label: "Campaign Key Visual" },
  { ratio: "1:1", full: false, label: "Detail Shot" },
  { ratio: "1:1", full: false, label: "Detail Shot" },
  { ratio: "4:5", full: false, label: "Portrait Crop" },
  { ratio: "3:2", full: false, label: "Layout Spread" },
  { ratio: "3:2", full: true, label: "Full Campaign Spread" },
];

const RATIO_DIMENSIONS = {
  "16:9": "1600 × 900",
  "3:2": "1500 × 1000",
  "1:1": "1200 × 1200",
  "4:5": "960 × 1200",
};

function loadProjectDetail() {
  const notFound = document.querySelector(".pd-not-found");
  const article = document.getElementById("project-overview");
  if (!article) return;

  const projects = window.PROJECTS_DATA;
  if (!Array.isArray(projects)) return;

  const id = new URLSearchParams(window.location.search).get("id");
  const index = projects.findIndex((item) => item.id === id);
  const project = projects[index];
  if (!project) return;

  const total = projects.length;
  const prev = total > 1 ? projects[(index - 1 + total) % total] : null;
  const next = total > 1 ? projects[(index + 1) % total] : null;

  renderProject(article, project, prev, next);

  if (notFound) notFound.hidden = true;
  article.hidden = false;
}

function renderProject(article, project, prev, next) {
  document.title = `${project.title} | Gil Tejano Portfolio`;

  const descriptionTag = document.querySelector('meta[name="description"]');
  if (descriptionTag) {
    descriptionTag.setAttribute("content", project.summary || project.category);
  }

  setText(article, ".pd-number", project.number);
  setText(article, ".pd-category", project.category);
  setText(article, ".pd-title", project.title);
  setText(article, ".pd-summary", project.summary);
  setText(article, ".pd-header-year", project.year);
  setText(article, ".pd-header-role", project.role);

  renderHero(article, project);

  setText(article, ".pd-client", project.client);
  setText(article, ".pd-type", project.type);
  setText(article, ".pd-role", project.role);
  setText(
    article,
    ".pd-tools",
    Array.isArray(project.tools) ? project.tools.join(", ") : project.tools
  );
  setText(article, ".pd-year", project.year);

  setText(article, ".pd-challenge", project.challenge);
  setText(article, ".pd-creative-direction", project.creativeDirection);
  setText(article, ".pd-target-audience", project.targetAudience);
  setText(article, ".pd-approach-text", project.approach);

  const deliverablesList = article.querySelector(".pd-deliverables");
  if (deliverablesList) {
    deliverablesList.innerHTML = (project.deliverables || [])
      .map((item) => `<li>${item}</li>`)
      .join("");
  }

  renderGallery(article, project);
  setupProjectNav(prev, next);
}

function setText(scope, selector, value) {
  const el = scope.querySelector(selector);
  if (el && value) el.textContent = value;
}

/* Image paths in data/projects-data.js are relative to the site root
   (e.g. "assets/images/projects/x.svg") since index.html also uses
   them directly; this page lives one folder down, in pages/. */
function toSiteRoot(path) {
  return `../${path}`;
}

function toCssRatio(ratio) {
  return ratio.replace(":", " / ");
}

function renderHero(article, project) {
  const hero = article.querySelector(".pd-hero");
  if (!hero) return;

  const ratio = project.heroRatio || "16:9";
  hero.style.aspectRatio = toCssRatio(ratio);

  if (project.heroImage) {
    hero.innerHTML = `<img class="pd-hero-img" src="${toSiteRoot(project.heroImage)}" alt="${project.heroAlt || project.title}" />`;
    return;
  }

  hero.innerHTML = buildPlaceholder(ratio, "Project Hero Visual");
}

function buildPlaceholder(ratio, label) {
  const dimensions = RATIO_DIMENSIONS[ratio] || "";
  return `
    <div class="pd-placeholder" aria-hidden="true">
      <div class="pd-placeholder-grid"></div>
      <div class="pd-placeholder-glow"></div>
      <i class="fa-regular fa-image"></i>
      <span class="pd-placeholder-label">${label}</span>
      <span class="pd-placeholder-dim">${dimensions} &middot; ${ratio} &middot; Placeholder</span>
    </div>
  `;
}

function renderGallery(article, project) {
  const gallery = article.querySelector(".pd-gallery");
  if (!gallery) return;

  const supplied = project.gallery || [];

  gallery.innerHTML = GALLERY_SLOTS.map((slot, i) => {
    const entry = supplied[i];
    const tileClass = slot.full ? "pd-gallery-tile pd-gallery-tile--full" : "pd-gallery-tile";
    const style = `aspect-ratio: ${toCssRatio(slot.ratio)}`;

    const inner = entry && entry.image
      ? `<img src="${toSiteRoot(entry.image)}" alt="${entry.alt || project.title}" loading="lazy" />`
      : buildPlaceholder(slot.ratio, slot.label);

    return `<div class="${tileClass}" style="${style}">${inner}</div>`;
  }).join("");
}

function setupProjectNav(prev, next) {
  const prevLink = document.querySelector(".pd-float-prev");
  const nextLink = document.querySelector(".pd-float-next");

  // Uses each project's own overviewUrl (root-relative, so "../" makes
  // it correct from inside pages/) rather than assuming every project
  // lives on this shared template - some, like Mooni, have their own
  // one-off page instead.
  if (prevLink) {
    if (prev) {
      prevLink.href = toSiteRoot(prev.overviewUrl);
      prevLink.setAttribute("aria-label", `Previous project: ${prev.title}`);
      setText(prevLink, ".pd-float-tooltip", prev.title);
    } else {
      prevLink.remove();
    }
  }

  if (nextLink) {
    if (next) {
      nextLink.href = toSiteRoot(next.overviewUrl);
      nextLink.setAttribute("aria-label", `Next project: ${next.title}`);
      setText(nextLink, ".pd-float-tooltip", next.title);
    } else {
      nextLink.remove();
    }
  }
}

document.addEventListener("DOMContentLoaded", loadProjectDetail);
