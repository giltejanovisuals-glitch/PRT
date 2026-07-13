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
│   └── projects.js           Loads project cards from data/projects.json
│
├── data/
│   └── projects.json         Project card content (title, category, image, alt text)
│
├── pages/
│   └── case-study.html       Template for an individual project case-study page
│
└── assets/
    ├── images/
    │   ├── profile/           Your headshot / profile photo
    │   ├── projects/          Project card & case-study images
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

**Quick look:** double-click `index.html` to open it directly in a browser. Almost everything works this way.

**Full functionality (recommended):** the dynamic project loader (`js/projects.js`) uses `fetch()` to read `data/projects.json`, and browsers block `fetch()` from the `file://` protocol for security reasons. If you open `index.html` directly, the project section falls back to the 4 static cards already written into `index.html` — nothing breaks, but editing `projects.json` won't do anything.

To see the JSON-driven cards update live, serve the folder over local HTTP instead:

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

Every `<img>` tag in `index.html` has a `<!-- Replace with ... -->` comment directly above it pointing at the exact file path expected. Look for `assets/images/projects/project-visual-0X.svg` (the current placeholder graphics) — once you drop a matching `.webp` into `assets/images/projects/`, update the `src` and the matching entry in `data/projects.json` to point at it.

**Images:** put them in the matching `assets/images/` subfolder (`profile/`, `projects/`, `thumbnails/`, `backgrounds/`, or `logos/`). Prefer `.webp` for photos — smaller file size, same quality.

**Videos:** put them in `assets/videos/`. Keep the hero video under a few seconds of loop and compress it (H.264 MP4, ~1080p) so it doesn't slow down the homepage.

**CV:** replace `assets/documents/gil-tejano-cv.pdf` with your latest PDF, keeping the same filename — the "Download CV" button in the contact section already points at this exact path.

## How to update portfolio projects

Edit `data/projects.json`. Each entry becomes one project card:

```json
{
  "id": "mooni-campaign",
  "number": "01",
  "title": "Mooni Campaign Visuals",
  "category": "Premium Product Visuals",
  "image": "assets/images/projects/mooni-campaign.webp",
  "alt": "Mooni brand campaign product photography and layout design"
}
```

- `number` — the index shown on the card (`01`, `02`, ...)
- `title` / `category` — the two lines of text on the card
- `image` — path to the project image (relative to `index.html`, so no leading `/`)
- `alt` — descriptive alt text for accessibility and SEO (don't leave this blank)

Add, remove, or reorder entries freely. The layout is tuned for **4 cards** (the bento-style grid in `css/style.css` uses `:nth-child` positioning); other counts still work but will fall back to a simpler stacked layout.

When you add or change a project here, also update the matching static `<article class="project-card">` block in `index.html` so visitors who open the site via `file://` (see above) see the same content.

To write a full write-up for a project, duplicate `pages/case-study.html`, rename it (e.g. `pages/mooni-campaign.html`), and fill in the placeholders marked with HTML comments.

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
5. Once live, replace every placeholder domain (`https://giltejano.netlify.app/`) in `index.html`, `pages/case-study.html`, `robots.txt`, and `sitemap.xml` with your real Netlify (or custom) domain, then redeploy.

Netlify auto-detects `404.html` and `robots.txt`/`sitemap.xml` at the repo root, so no extra configuration is needed for those.
