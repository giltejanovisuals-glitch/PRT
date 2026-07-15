/* ================================
   PROJECT DATA
   Single source of truth for the Creative Boards cards (js/projects.js)
   and the project overview page (js/project-detail.js).

   Loaded as a plain script (not fetch()), so it works identically
   whether the site is served over http(s) or opened directly from
   disk (file://) - browsers block fetch() against local JSON files,
   which previously made every project page show "Project Not Found."
   A normal <script src="..."> has no such restriction.

   Add, remove, or reorder projects freely - both consumers read this
   same array, and every id below already matches the ?id= used in
   each card's overviewUrl, so no link ever dead-ends.

   Optional per-project image fields (image, heroImage, gallery[].image)
   can be left unset - js/projects.js and js/project-detail.js both fall
   back to a designed placeholder wherever a real image isn't ready yet.
================================ */

window.PROJECTS_DATA = [
  {
    id: "mooni-campaign",
    number: "01",
    title: "Mooni Campaign Visuals",
    category: "Premium Product Visuals",
    image: "assets/images/projects/project-visual-01.svg",
    alt: "Mooni brand campaign product photography and layout design",
    overviewUrl: "pages/project-mooni-campaign.html",
    year: "2026",
    client: "Mooni",
    type: "Campaign Design",
    role: "Creative Specialist / Graphic Designer",
    tools: ["Photoshop", "Illustrator", "InDesign"],
    summary: "Premium product photography and layout design for Mooni's sleep-focused product line.",
    challenge: "Mooni needed launch visuals that felt as calm and premium as the product itself, without the campaign reading as flat or generic.",
    creativeDirection: "Soft, low-contrast studio photography and quiet, breathing layouts, so the product always stayed the focal point.",
    targetAudience: "Design-conscious shoppers weighing premium sleep and wellness brands against each other.",
    deliverables: ["Campaign Key Visual", "Product Layouts", "Social Media Visuals", "Retail Materials"],
    approach: "I started from the product's own materials and colour palette, then built a shared visual grammar - one key visual, then a system of crops and layouts - so every touchpoint from shelf to feed read as the same campaign.",
    // PLACEHOLDER IMAGES: add heroImage/heroAlt and gallery entries here
    // once real photography is ready - until then, the overview page
    // renders designed placeholder tiles automatically.
    heroImage: "",
    heroAlt: "",
    gallery: []
  },
  {
    id: "metal-lite-campaign",
    number: "02",
    title: "Metal-Lite Retail Campaign",
    category: "Retail Campaign Materials",
    image: "assets/images/projects/project-visual-02.svg",
    alt: "Metal-Lite retail campaign marketing collateral",
    overviewUrl: "pages/project-metal-lite-campaign.html",
    year: "2026",
    client: "Metal-Lite",
    type: "Retail Campaign",
    role: "Creative Specialist / Graphic Designer",
    tools: ["Photoshop", "Illustrator", "InDesign"],
    summary: "Retail campaign materials and marketing collateral supporting Metal-Lite's product launch.",
    challenge: "The launch needed to look consistent everywhere it appeared - in-store, in print, and on social - despite each channel having very different formats.",
    creativeDirection: "One shared key visual adapted into a strict system of retail signage, print collateral, and digital ad variants, so nothing felt like an afterthought.",
    targetAudience: "Retail buyers and in-store shoppers encountering the brand for the first time at point of sale.",
    deliverables: ["Campaign Key Visual", "Retail Materials", "Digital Advertisements", "Product Layouts"],
    approach: "I built a shared visual system - key visual, in-store signage, and digital ad variants - so the same campaign held together across every retail and social touchpoint, from shop floor to feed.",
    heroImage: "",
    heroAlt: "",
    gallery: []
  },
  {
    id: "hooga-campaign",
    number: "03",
    title: "Hooga Catalog System",
    category: "Print & Editorial Design",
    image: "assets/images/projects/project-visual-03.svg",
    alt: "Hooga catalog layout and print editorial design",
    overviewUrl: "pages/project-hooga-catalog.html",
    year: "2025",
    client: "Hooga",
    type: "Print & Editorial",
    role: "Creative Specialist / Graphic Designer",
    tools: ["InDesign", "Photoshop"],
    summary: "A structured catalog system that balances product detail with editorial pacing.",
    challenge: "Hooga's catalog had grown page by page with no shared structure, so product detail and editorial spreads never felt like one document.",
    creativeDirection: "A consistent grid and typographic system that gives product pages and editorial spreads their own rhythm while still reading as a single catalog.",
    targetAudience: "Retail partners and end customers browsing the full seasonal product range.",
    deliverables: ["Product Layouts", "Retail Materials", "Photo Manipulation"],
    approach: "I rebuilt the catalog around a consistent grid and typographic system, giving product detail pages and editorial spreads their own rhythm while keeping the whole document feeling unified.",
    heroImage: "",
    heroAlt: "",
    gallery: []
  },
  {
    id: "brand-social-assets",
    number: "04",
    title: "Brand Social Assets",
    category: "Digital Design",
    image: "assets/images/projects/project-visual-04.svg",
    alt: "Brand-consistent social media graphics for a lifestyle brand",
    overviewUrl: "pages/project.html?id=brand-social-assets",
    year: "2025",
    client: "Lifestyle Brand Client",
    type: "Social & Digital Design",
    role: "Creative Specialist / Graphic Designer",
    tools: ["Photoshop", "Illustrator"],
    summary: "Brand-consistent social media graphics built for fast weekly turnaround.",
    challenge: "The client needed a steady stream of on-brand social content without slowing down for every single post.",
    creativeDirection: "A flexible template system built around the brand's existing visual language, so new photography and copy could drop in fast without breaking consistency.",
    targetAudience: "The brand's existing social following, plus new followers discovering it through paid and organic social.",
    deliverables: ["Social Media Visuals", "Digital Advertisements", "Photo Manipulation"],
    approach: "I set up a flexible template system so new photography and copy could drop in quickly each week while every post still matched the brand's visual language.",
    heroImage: "",
    heroAlt: "",
    gallery: []
  }
];
