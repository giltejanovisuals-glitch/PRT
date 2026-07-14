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
      <a class="artboard" href="${overviewUrl}" aria-label="View project: ${title}">
        <img src="${image}" alt="${alt}" width="400" height="310" loading="lazy" />
        <span class="artboard-shade" aria-hidden="true"></span>
        <span class="artboard-pin" aria-hidden="true"></span>
        <span class="artboard-expand" aria-hidden="true">
          <i class="fa-solid fa-up-right-and-down-left-from-center"></i>
        </span>

        <div class="project-info">
          <span>${number}</span>
          <div>
            <h3>${title}</h3>
            <p>${category}</p>
          </div>
        </div>
      </a>
    </article>
  `;
}

document.addEventListener("DOMContentLoaded", loadProjects);
