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
   each card's overviewUrl, so no link ever dead-ends. Array order is
   the display order (Creative Boards sequence: Hooga, Dunlopillo,
   Porta Mobili, Metal-Lite) - the number field is kept in sync with
   that order for the project overview page's number badge.

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
    logo: "assets/images/logos/hooga.svg",
    logoAlt: "Hooga logo",
    image: "assets/images/projects/project-visual-01.svg",
    alt: "Mooni brand campaign product photography and layout design",
    overviewUrl: "pages/project-mooni-campaign.html",
    year: "2026",
    client: "Mooni",
    type: "Campaign Design",
    role: "Creative Specialist / Graphic Designer",
    tools: ["Photoshop", "Illustrator", "InDesign"],
    summary: "Premium product photography and layout design for Mooni's sleep-focused product line.",
    // Short one-line teaser shown on Creative Boards hover - keep this
    // under ~90 characters so it never needs to clamp/truncate.
    cardSummary: "Calm, premium campaign visuals for a sleep-focused product launch.",
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
    id: "brand-social-assets",
    number: "02",
    title: "Brand Social Assets",
    category: "Digital Design",
    logo: "assets/images/logos/dunlopillo.svg",
    logoAlt: "Dunlopillo logo",
    image: "assets/images/projects/project-visual-04.svg",
    alt: "Brand-consistent social media graphics for a lifestyle brand",
    overviewUrl: "pages/project.html?id=brand-social-assets",
    year: "2025",
    client: "Lifestyle Brand Client",
    type: "Social & Digital Design",
    role: "Creative Specialist / Graphic Designer",
    tools: ["Photoshop", "Illustrator"],
    summary: "Brand-consistent social media graphics built for fast weekly turnaround.",
    cardSummary: "Brand-consistent social media graphics for fast weekly turnaround.",
    challenge: "The client needed a steady stream of on-brand social content without slowing down for every single post.",
    creativeDirection: "A flexible template system built around the brand's existing visual language, so new photography and copy could drop in fast without breaking consistency.",
    targetAudience: "The brand's existing social following, plus new followers discovering it through paid and organic social.",
    deliverables: ["Social Media Visuals", "Digital Advertisements", "Photo Manipulation"],
    approach: "I set up a flexible template system so new photography and copy could drop in quickly each week while every post still matched the brand's visual language.",
    heroImage: "",
    heroAlt: "",
    gallery: []
  },
  {
    id: "hooga-campaign",
    number: "03",
    title: "Porta Mobili Visual Identity & Brand Applications",
    category: "Brand Identity & Art Direction",
    logo: "assets/images/logos/porta-mobili.svg",
    logoAlt: "Porta Mobili logo",
    image: "assets/images/projects/project-visual-03.svg",
    alt: "Porta Mobili brand identity and art direction visuals",
    overviewUrl: "pages/project-hooga-catalog.html",
    year: "2025",
    client: "Porta Mobili",
    type: "Brand Identity & Art Direction",
    role: "Creative Specialist / Graphic Designer",
    tools: ["InDesign", "Photoshop"],
    summary: "A refined visual identity system created for Porta Mobili, a luxury furniture brand inspired by European design, combining elegant typography, a restrained color palette, and consistent applications across stationery, packaging, signage, vehicle graphics, retail materials, and branded merchandise.",
    cardSummary: "A refined identity system across packaging, signage, and retail materials.",
    challenge: "Porta Mobili needed its identity to hold together across a wide range of physical touchpoints - stationery, packaging, signage, vehicle graphics, retail materials, and merchandise - without any one of them feeling like an afterthought.",
    creativeDirection: "Elegant typography and a restrained color palette applied consistently across every application, so the brand reads as considered and premium wherever a customer encounters it.",
    targetAudience: "Retail partners and customers of a luxury furniture brand who expect the same level of craftsmanship in the brand experience as in the product itself.",
    deliverables: ["Stationery Design", "Packaging Design", "Signage", "Vehicle Graphics", "Retail Materials", "Branded Merchandise"],
    approach: "I applied the identity's typography and color system consistently across every touchpoint, adapting the same visual language to the constraints of each medium - from packaging and signage to vehicle graphics and retail materials - so it reads as one cohesive brand.",
    heroImage: "",
    heroAlt: "",
    // Real catalog spreads (same source as pages/project-hooga-catalog.html) -
    // the only project with real photography on disk today, so it's the one
    // Creative Boards preview that shows actual images instead of placeholders.
    gallery: [
      { image: "assets/images/hooga-catalog/01.webp", alt: "Porta Mobili brand application spread 01" },
      { image: "assets/images/hooga-catalog/02.webp", alt: "Porta Mobili brand application spread 02" },
      { image: "assets/images/hooga-catalog/03.webp", alt: "Porta Mobili brand application spread 03" },
      { image: "assets/images/hooga-catalog/04.webp", alt: "Porta Mobili brand application spread 04" },
      { image: "assets/images/hooga-catalog/05.webp", alt: "Porta Mobili brand application spread 05" },
      { image: "assets/images/hooga-catalog/06.webp", alt: "Porta Mobili brand application spread 06" },
      { image: "assets/images/hooga-catalog/07.webp", alt: "Porta Mobili brand application spread 07" },
      { image: "assets/images/hooga-catalog/08.webp", alt: "Porta Mobili brand application spread 08" },
      { image: "assets/images/hooga-catalog/09.webp", alt: "Porta Mobili brand application spread 09" },
      { image: "assets/images/hooga-catalog/10.webp", alt: "Porta Mobili brand application spread 10" },
      { image: "assets/images/hooga-catalog/11.webp", alt: "Porta Mobili brand application spread 11" },
      { image: "assets/images/hooga-catalog/12.webp", alt: "Porta Mobili brand application spread 12" },
      { image: "assets/images/hooga-catalog/13.webp", alt: "Porta Mobili brand application spread 13" }
    ]
  },
  {
    id: "metal-lite-campaign",
    number: "04",
    title: "Metal-Lite Retail Campaign",
    category: "Retail Campaign Materials",
    logo: "assets/images/logos/metal-lite.svg",
    logoAlt: "Metal-Lite logo",
    image: "assets/images/projects/project-visual-02.svg",
    alt: "Metal-Lite retail campaign marketing collateral",
    overviewUrl: "pages/project-metal-lite-campaign.html",
    year: "2026",
    client: "Metal-Lite",
    type: "Retail Campaign",
    role: "Creative Specialist / Graphic Designer",
    tools: ["Photoshop", "Illustrator", "InDesign"],
    summary: "Retail campaign materials and marketing collateral supporting Metal-Lite's product launch.",
    cardSummary: "Retail campaign materials and collateral for a product launch.",
    challenge: "The launch needed to look consistent everywhere it appeared - in-store, in print, and on social - despite each channel having very different formats.",
    creativeDirection: "One shared key visual adapted into a strict system of retail signage, print collateral, and digital ad variants, so nothing felt like an afterthought.",
    targetAudience: "Retail buyers and in-store shoppers encountering the brand for the first time at point of sale.",
    deliverables: ["Campaign Key Visual", "Retail Materials", "Digital Advertisements", "Product Layouts"],
    approach: "I built a shared visual system - key visual, in-store signage, and digital ad variants - so the same campaign held together across every retail and social touchpoint, from shop floor to feed.",
    heroImage: "",
    heroAlt: "",
    gallery: []
  }
];
