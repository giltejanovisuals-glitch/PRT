# Gil Tejano — Portfolio

Personal portfolio site for Gil Tejano, Creative Specialist / Graphic Designer. Plain HTML, CSS, and JavaScript — no build step, no frameworks, no package manager required.

## Project structure

```text
portfolio/
│
├── index.html              Homepage
├── 404.html                Custom "not found" page
├── favicon.ico              Browser tab icon
├── site.webmanifest         PWA / "add to home screen" metadata
├── robots.txt                Search engine crawl rules
├── sitemap.xml                Search engine page list
├── README.md
├── .gitignore
│
├── css/
│   ├── style.css             Base styles: layout, color, typography, components
│   ├── animations.css        Scroll-reveal entrances, keyframes, reduced-motion overrides
│   └── responsive.css        Breakpoints (@media max-width / hover / pointer)
│
├── js/
│   ├── script.js             Site interactions: nav, reveals, dock, carousel, cursor glow
│   ├── projects.js           Loads project cards from data/projects-data.js
│   └── project-detail.js     Loads one project's overview page from data/projects-data.js
│
├── data/
│   └── projects-data.js      All project content: cards + overview page details
│
├── pages/
│   ├── project.html                 Reusable project overview page (pages/project.html?id=slug)
│   └── project-mooni-campaign.html  One-off hand-built case study page, just for Mooni
│
└── assets/
    ├── images/
    │   ├── profile/           Your headshot / profile photo
    │   ├── projects/          Project card, overview page, and gallery images
    │   ├── thumbnails/        Small images (e.g. testimonial portraits)
    │   ├── backgrounds/       Hero background / poster images
    │   └── logos/             Client / brand logos ("Trusted By" strip)
    │
    ├── videos/                Hero background video
    ├── icons/                 Toolkit icons, cursor, small UI icons
    ├── fonts/                 Local font files, if you stop using Google Fonts
    └── documents/              CV and other downloadable files
```

## How to open the website

**Double-click `index.html` to open it directly in a browser** — everything works this way, including the Creative Boards cards and every project overview page. Project data lives in `data/projects-data.js`, a plain script (not JSON + `fetch()`), so there's no `file://` restriction to work around.

Serving the folder over local HTTP works identically and is only needed for things unrelated to project data (e.g. testing `robots.txt`/`sitemap.xml` behavior):

```bash
# Python (already on most systems)
python -m http.server 8000
# then open http://localhost:8000

# Or, in VS Code
# install the "Live Server" extension, then right-click index.html → "Open with Live Server"
```

## Where to add your real assets

The site currently ships with placeholder graphics (the dashed-outline "REPLACE WITH..." SVGs and the toolkit/brand icons) so every section renders correctly out of the box. Swap them out at these exact paths and the site will pick them up automatically — no code changes needed:

| Replace this placeholder | With your real file at |
|---|---|
| Profile / headshot | `assets/images/profile/gil-tejano.webp` |
| Hero background poster | `assets/images/backgrounds/hero-background.webp` |
| Hero background video | `assets/videos/hero-showreel.mp4` (already your real video, just renamed) |
| Project images | `assets/images/projects/mooni-campaign.webp`, `metal-lite-campaign.webp`, `hooga-campaign.webp`, `brand-social-assets.webp` |
| CV | `assets/documents/gil-tejano-cv.pdf` (already your real CV, just relocated) |

Every `<img>` tag in `index.html` has a `<!-- Replace with ... -->` comment directly above it pointing at the exact file path expected. Look for `assets/images/projects/project-visual-0X.svg` (the current placeholder graphics) — once you drop a matching `.webp` into `assets/images/projects/`, update the `src` and the matching entry in `data/projects-data.js` to point at it.

The project overview page (`pages/project.html`) has its own placeholders - a designed hero + gallery tile (dark panel, teal glow, grid pattern, label, and dimensions) that renders automatically for any project without real photography yet. To replace one, add `heroImage`/`heroAlt` or a `gallery` entry for that project in `data/projects-data.js` - see the next section.

**Images:** put them in the matching `assets/images/` subfolder (`profile/`, `projects/`, `thumbnails/`, `backgrounds/`, or `logos/`). Prefer `.webp` for photos — smaller file size, same quality.

**Videos:** put them in `assets/videos/`. Keep the hero video under a few seconds of loop and compress it (H.264 MP4, ~1080p) so it doesn't slow down the homepage.

**CV:** replace `assets/documents/gil-tejano-cv.pdf` with your latest PDF, keeping the same filename — the "Download CV" button in the contact section already points at this exact path.

## How to update portfolio projects

Edit `data/projects-data.js`. It's a plain JavaScript file that assigns one array to `window.PROJECTS_DATA` - each entry drives both its Creative Boards card **and** its project overview page:

```js
{
  id: "metal-lite-campaign",
  number: "02",
  title: "Metal-Lite Retail Campaign",
  category: "Retail Campaign Materials",
  image: "assets/images/projects/metal-lite-campaign.webp",
  alt: "Metal-Lite retail campaign marketing collateral",
  overviewUrl: "pages/project.html?id=metal-lite-campaign",
  year: "2026",
  client: "Metal-Lite",
  type: "Retail Campaign",
  role: "Creative Specialist / Graphic Designer",
  tools: ["Photoshop", "Illustrator", "InDesign"],
  summary: "One-sentence summary shown under the project title.",
  challenge: "One sentence: the brief or problem you were solving.",
  creativeDirection: "One sentence: the visual approach you took.",
  targetAudience: "One sentence: who the work was for.",
  deliverables: ["Campaign Key Visual", "Product Layouts", "Social Media Visuals"],
  approach: "A short paragraph for \"The Approach\" section - your process, tools, or reasoning.",
  heroImage: "assets/images/projects/metal-lite-hero.webp",   // optional - see below
  heroAlt: "Metal-Lite campaign hero shot",                    // optional
  heroRatio: "16:9",                                           // optional, "16:9" or "3:2" (default "16:9")
  gallery: [
    { image: "assets/images/projects/metal-lite-gallery-01.webp", alt: "Full layout" }
    // add up to 6, in order - any left out render as designed placeholders
  ]
}
```

- `id` — URL slug; must be unique and match the `?id=` in `overviewUrl`
- `number` / `title` / `category` / `image` / `alt` — used on the Creative Boards card (see above)
- `overviewUrl` — the card's link target. Usually `pages/project.html?id=<id>` (the shared template); a project can instead point at its own one-off page (see "Mooni" below) if it needs bespoke design beyond what the shared template offers
- `year`, `client`, `type`, `role`, `tools` — shown in the "Project Details" panel and the page header
- `summary` — short one-liner under the title
- `challenge` / `creativeDirection` / `targetAudience` — the three short "Project Overview" blocks
- `deliverables` — a short list of relevant tags (pick from your own list per project; don't list ones that don't apply)
- `approach` — the paragraph for "The Approach" section
- `heroImage` / `heroAlt` / `heroRatio` — optional; leave `heroImage` unset and the hero renders a designed placeholder (grid pattern, teal glow, label, dimensions) in the right ratio instead of a broken image
- `gallery` — an ordered list of `{ image, alt }`. The overview page always shows the same 6-tile editorial layout (full-width → two squares → portrait + landscape → full-width, defined in `GALLERY_SLOTS` in `js/project-detail.js`); any slot without a matching entry renders its own designed placeholder in the correct ratio, so the layout always looks intentional

Add, remove, or reorder entries freely. The Creative Boards grid is tuned for **4 cards** (the bento-style layout in `css/style.css` uses `:nth-child` positioning); other counts still work but fall back to a simpler stacked layout. The overview page (`pages/project.html`) works with any number of projects and handles Previous/Next automatically based on array order.

When you add or change a project here, also update the matching static `<article class="project-card">` block in `index.html` so its no-JS fallback markup (see above) shows the same content and the same overview link.

The project overview page itself never needs duplicating - `pages/project.html` is one shared template for every project, populated at runtime by `js/project-detail.js`. If a project ID in the URL doesn't match anything in `PROJECTS_DATA` (or is missing entirely), the page shows a "Project not found" message with a link back to Creative Boards instead of a blank page.

### The Mooni exception: a one-off case study page

Mooni's card links to `pages/project-mooni-campaign.html` instead of the shared template - a hand-built page with its own split-hero layout, copy, and section flow (Project Overview, Challenge, Creative Direction, Campaign System, Selected Outputs, Project Value), since it needed more editorial control than the shared template's fixed structure. It's plain static HTML/CSS (no `js/project-detail.js`, no dependency on `data/projects-data.js` for its content), reusing the site's shared `css/style.css`/`css/responsive.css`/`css/animations.css`.

Mooni's entry still exists in `data/projects-data.js` (its `overviewUrl` just points at this page instead) so its Creative Boards card and its place in the other projects' Previous/Next cycle keep working. If you want another project to get this same one-off treatment later, duplicate `project-mooni-campaign.html`, and point that project's `overviewUrl` at the new file.

## Updating other placeholders

Search `index.html` for `<!-- Replace` to find every spot that still needs your real information:

- Email address (`hello@giltejano.com` appears in a few places)
- LinkedIn and Behance profile URLs (currently `href="#"`)
- The canonical URL and Open Graph URLs/domain (currently `https://giltejano.netlify.app/`) — update once your real domain is live, and update it in `robots.txt` and `sitemap.xml` too
- The Open Graph / Twitter preview image (currently points at the not-yet-created `assets/images/profile/gil-tejano.webp`)

## Deploying

### GitHub

```bash
git add .
git commit -m "Update portfolio"
git push
```

If this is a brand-new repo:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo>.git
git push -u origin main
```

### Netlify

1. Log in to [netlify.com](https://netlify.com) and choose **Add new site → Import an existing project**.
2. Connect your GitHub account and pick this repository.
3. Build settings: leave **Build command** empty and set **Publish directory** to `.` (the repo root) — this is a static site with no build step.
4. Deploy. Netlify will give you a URL like `your-site-name.netlify.app`.
5. Once live, replace every placeholder domain (`https://giltejano.netlify.app/`) in `index.html`, `robots.txt`, and `sitemap.xml` with your real Netlify (or custom) domain, then redeploy.

Netlify auto-detects `404.html` and `robots.txt`/`sitemap.xml` at the repo root, so no extra configuration is needed for those.
