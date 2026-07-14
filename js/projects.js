/* ================================
   PROJECT CARDS LOADER
   Replaces the static project-grid markup in index.html with cards
   built from data/projects-data.js (window.PROJECTS_DATA), so editing
   that one file updates the whole "Creative Boards" section - no HTML
   editing required.

   If that data isn't available for any reason, the static cards
   already written into index.html are left exactly as they are, so
   the section never breaks or goes blank.
================================ */

function loadProjects() {
  const grid = document.querySelector(".project-grid");
  if (!grid) return;

  const projects = window.PROJECTS_DATA;
  if (!Array.isArray(projects) || projects.length === 0) return;

  grid.innerHTML = projects.map(buildProjectCard).join("");
}

function buildProjectCard(project) {
  const { number, title, category, image, alt, overviewUrl } = project;

  return `
    <article class="project-card">
      <a class="folder" href="${overviewUrl}" aria-label="View project: ${title}">
        <span class="folder-glow" aria-hidden="true"></span>
        <span class="folder-back" aria-hidden="true"></span>
        <span class="folder-tab" aria-hidden="true"></span>

        <div class="folder-front" aria-hidden="true">
          <span class="folder-sheen"></span>
          <div class="folder-preview">
            <img src="${image}" alt="${alt}" width="400" height="310" loading="lazy" />
          </div>
        </div>

        <span class="folder-arrow" aria-hidden="true">
          <i class="fa-solid fa-arrow-right"></i>
        </span>

        <div class="folder-label">
          <span class="folder-number">${number}</span>
          <div class="folder-text">
            <h3>${title}</h3>
            <p>${category}</p>
          </div>
        </div>
      </a>
    </article>
  `;
}

document.addEventListener("DOMContentLoaded", loadProjects);
