/* ================================
   PROJECT CARDS LOADER
   Replaces the static project-grid markup in index.html with cards
   built from data/projects.json, so updating that one file updates
   the whole "Creative Boards" section - no HTML editing required.

   If the fetch fails (most commonly because the site was opened
   directly from disk, where browsers block fetch() on the file://
   protocol) the static cards already in index.html are left exactly
   as they are, so the section never breaks or goes blank.
================================ */

async function loadProjects() {
  const grid = document.querySelector(".project-grid");
  if (!grid) return;

  let projects;

  try {
    const response = await fetch("data/projects.json");
    if (!response.ok) throw new Error(`Request failed: ${response.status}`);
    projects = await response.json();
  } catch (error) {
    console.warn(
      "projects.js: could not load data/projects.json, keeping the static project cards. " +
        "(This is expected if you opened index.html directly - run a local server instead. See README.md.)",
      error
    );
    return;
  }

  if (!Array.isArray(projects) || projects.length === 0) return;

  grid.innerHTML = projects.map(buildProjectCard).join("");
}

function buildProjectCard(project) {
  const { number, title, category, image, alt } = project;

  return `
    <article class="project-card">
      <div class="artboard">
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
      </div>
    </article>
  `;
}

document.addEventListener("DOMContentLoaded", loadProjects);
