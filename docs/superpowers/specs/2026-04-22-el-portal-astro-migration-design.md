# El Portal Yelm — Astro Migration Design Spec
**Date:** 2026-04-22
**Status:** Approved

## Context

El Portal Yelm is a family-owned taqueria and carniceria in Yelm, WA. A complete single-page design already exists as `index.html` with all content, CSS design tokens, and vanilla JS interactions built out. The goal is to migrate that monolithic file into a maintainable Astro project — componentizing each section, extracting menu data into a typed data file, wiring the catering form to deliver emails, and deploying to Cloudflare Pages.

No redesign. No new features beyond what exists. Pure structural migration.

---

## Tech Stack

| Concern | Choice | Reason |
|---|---|---|
| Framework | Astro 4.x (static output) | Purpose-built for content sites, zero JS by default |
| Styling | Existing custom CSS (no Tailwind) | Design system already built with CSS variables + oklch |
| Form | Formspree (free tier) | No backend needed; forwards to elportalyelm2000@gmail.com |
| Deployment | Cloudflare Pages | Free tier, connect GitHub, auto-deploys on push |

---

## Project Structure

```
el-portal-yelm/
├── public/
│   └── assets/
│       ├── svgLogo.svg
│       ├── Logo.png
│       ├── heroVideo.mp4
│       ├── carnitasTacos.png
│       ├── cilantro.png
│       ├── quesabiria.png
│       ├── soup_pic.jpg
│       ├── taco1.png
│       └── truck3.png
├── src/
│   ├── components/
│   │   ├── Nav.astro
│   │   ├── Hero.astro
│   │   ├── Marquee.astro
│   │   ├── MenuSection.astro
│   │   ├── WordsSection.astro
│   │   ├── TruckSection.astro
│   │   ├── SignatureDishes.astro
│   │   ├── PanDulceFeature.astro
│   │   ├── StorySection.astro
│   │   ├── Reviews.astro
│   │   ├── FindTruck.astro
│   │   ├── SocialSection.astro
│   │   ├── HoursLocation.astro
│   │   ├── OrderCTA.astro
│   │   └── Footer.astro
│   ├── data/
│   │   └── menu.ts
│   ├── layouts/
│   │   └── Layout.astro
│   ├── pages/
│   │   └── index.astro
│   └── styles/
│       └── global.css
├── astro.config.mjs
├── package.json
└── tsconfig.json
```

---

## Component Breakdown

Each component is a direct extraction from the existing HTML — no logic changes, just file boundaries.

| Component | Source in index.html | Notes |
|---|---|---|
| `Layout.astro` | `<head>`, font links | Wraps all pages; includes global CSS import |
| `Nav.astro` | `<nav id="main-nav">` | Logo: `<img src="/assets/svgLogo.svg">` replaces text; nav links + CTA button stay |
| `Hero.astro` | `.hero` section | Video, overlay, headline, CTA buttons |
| `Marquee.astro` | `.marquee` div | Ticker animation |
| `MenuSection.astro` | `.menu-header-block` + `.menu-tabs-section` | Renders from `menu.ts` data; tab JS moved to `<script>` block |
| `WordsSection.astro` | `.words-section` | Truck ghost parallax |
| `TruckSection.astro` | `.truck-section` | Parallax image, stats |
| `SignatureDishes.astro` | `.sig-section` | 4-up signature grid |
| `PanDulceFeature.astro` | `.pandulce-section` | Full-bleed image feature |
| `StorySection.astro` | `.story-section` | Split layout, flag stripe |
| `Reviews.astro` | `.reviews-section` | 4 review cards |
| `FindTruck.astro` | `.findtruck-section` | Social links + catering form (Formspree) |
| `SocialSection.astro` | `.social-section` | Instagram/Facebook grid |
| `HoursLocation.astro` | `.hours-section` | Hours table + location + map placeholder |
| `OrderCTA.astro` | `.order-section` | Full-bleed CTA |
| `Footer.astro` | `<footer>` | Logo, nav links, copyright |

---

## Nav Logo Change

**Remove:** The `.nav-logo` div with text `EL PORTAL · Yelm, WA`

**Replace with:**
```html
<a href="/" class="nav-logo-img">
  <img src="/assets/svgLogo.svg" alt="El Portal Yelm" height="40" />
</a>
```

SVG is used (not PNG) because it scales perfectly on all screen sizes and retina displays.

---

## Data Layer

`src/data/menu.ts` exports a typed array of menu categories. `MenuSection.astro` maps over it to render tabs and item rows — no more editing HTML to update a price.

```typescript
interface MenuItem {
  name: string;
  badge?: { label: string; variant?: 'default' | 'green' | 'yellow' };
  desc: string;
  price: string;
}

interface MenuCategory {
  id: string;
  label: string;
  hasFeaturedImage?: boolean;
  featuredImage?: string;
  featuredCaption?: string;
  items: MenuItem[];
}

export const menuData: MenuCategory[] = [ /* all 6 categories */ ];
```

---

## Form Handling

The catering form in `FindTruck.astro` uses Formspree:

1. Create a free account at formspree.io
2. Create a form and copy the endpoint URL
3. Set `<form action="https://formspree.io/f/{YOUR_ID}" method="POST">`
4. Formspree forwards every submission to `elportalyelm2000@gmail.com`
5. Keep the existing JS success handler for the inline confirmation message

Fields: Name, Email, Event Date, Guest Count, Event Details.

---

## CSS Strategy

All CSS from `index.html` moves to `src/styles/global.css` unchanged. This includes:
- Design tokens (`:root` CSS variables)
- Reset
- All component styles
- Responsive breakpoints
- Animations (`@keyframes fu`, `ticker`, `panel-in`)

`Layout.astro` imports it with `import '../styles/global.css'`.

No Tailwind. No CSS modules. No scoped styles. The existing stylesheet is the source of truth.

---

## JavaScript

Three JS behaviors from the existing `<script>` block move into the relevant components:

| Behavior | Component |
|---|---|
| Menu tab switching | `MenuSection.astro` `<script>` |
| Scroll reveal (IntersectionObserver) | `Layout.astro` `<script>` |
| Parallax (scroll event) | `Layout.astro` `<script>` |
| Today's hours highlight | `HoursLocation.astro` `<script>` |
| Tweaks panel | Omitted (dev tool only, not needed in production) |

---

## Asset Migration

| Old path | New path |
|---|---|
| `uploads/heroVideo.mp4` | `/assets/heroVideo.mp4` |
| `uploads/truck3.png` | `/assets/truck3.png` |
| `uploads/soup_pic.jpg` | `/assets/soup_pic.jpg` |
| `uploads/pandulce.png` | `/assets/pandulce.png` |
| All other `uploads/` refs | `/assets/` |

---

## Deployment: Cloudflare Pages

1. Push project to a GitHub repository
2. Log into Cloudflare Pages → Create a project → Connect GitHub repo
3. Build settings: **Build command:** `npm run build` · **Output directory:** `dist`
4. Cloudflare builds and deploys automatically on every `git push`

No environment variables needed for the static build. Formspree handles form routing externally.

---

## Verification

- [ ] `npm run dev` serves the site locally with all sections visible
- [ ] All images and the hero video load from `/assets/`
- [ ] SVG logo appears in nav top-left; no text logo visible
- [ ] Menu tabs switch correctly (Birria, Tacos, Tortas, Menudo, Pan Dulce, Más)
- [ ] Scroll reveal animations fire on scroll
- [ ] Parallax effect visible on Words and Truck sections
- [ ] Today's day is highlighted in the hours table
- [ ] Catering form submits to Formspree and shows success message
- [ ] `npm run build` completes with no errors
- [ ] `dist/` output is a self-contained static site
- [ ] Cloudflare Pages deployment is live and all assets load
