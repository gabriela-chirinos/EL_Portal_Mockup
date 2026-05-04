# El Portal Yelm — Astro Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate the existing `index.html` single-page site into a maintainable Astro 4.x project with componentized sections, typed menu data, Formspree-powered catering form, and SVG logo in the nav.

**Architecture:** The monolithic `index.html` is split into one Astro component per section. All CSS moves to `src/styles/global.css` unchanged. Menu content is extracted into `src/data/menu.ts` and rendered dynamically. Global JS (scroll reveal, parallax) lives in `Layout.astro`; component-local JS (menu tabs, hours highlight) lives in each component's `<script>` block.

**Tech Stack:** Astro 4.x (static output), TypeScript, custom CSS (no Tailwind), Formspree (form email delivery), Cloudflare Pages (deployment)

---

## File Map

| File | Action | Purpose |
|---|---|---|
| `astro.config.mjs` | Create | Astro config (static output) |
| `tsconfig.json` | Create | TypeScript config |
| `public/assets/` | Create | All images + video from `Assets_ElPortal/` |
| `src/styles/global.css` | Create | All CSS from index.html (3 style blocks merged) |
| `src/data/menu.ts` | Create | Typed menu data for all 6 categories |
| `src/layouts/Layout.astro` | Create | HTML shell, fonts, global CSS, global JS |
| `src/pages/index.astro` | Create | Imports and renders all components in order |
| `src/components/Nav.astro` | Create | Fixed nav with SVG logo |
| `src/components/Hero.astro` | Create | Full-screen hero with video |
| `src/components/Marquee.astro` | Create | Scrolling ticker |
| `src/components/MenuSection.astro` | Create | Menu header + tabbed menu (renders from menu.ts) |
| `src/components/WordsSection.astro` | Create | AUTÉNTICO word stack with truck ghost |
| `src/components/TruckSection.astro` | Create | Yellow truck parallax section |
| `src/components/SignatureDishes.astro` | Create | 4-up signature dish grid |
| `src/components/PanDulceFeature.astro` | Create | Full-bleed pan dulce feature |
| `src/components/StorySection.astro` | Create | Story split layout with flag stripe |
| `src/components/Reviews.astro` | Create | 4-card review grid |
| `src/components/FindTruck.astro` | Create | Social links + Formspree catering form |
| `src/components/SocialSection.astro` | Create | Social photo grid |
| `src/components/HoursLocation.astro` | Create | Hours table + location block |
| `src/components/OrderCTA.astro` | Create | Full-bleed order CTA |
| `src/components/Footer.astro` | Create | Footer with links + copyright |

---

## Task 1: Initialize Astro Project

**Files:**
- Create: `astro.config.mjs`
- Create: `tsconfig.json`
- Create: `package.json` (auto-generated)

- [ ] **Step 1: Scaffold the Astro project inside the project folder**

Run from `/Users/helenchirinos/Desktop/EL_PORTAL_YELM`:
```bash
npm create astro@latest el-portal-site -- --template minimal --typescript strict --no-install --no-git
cd el-portal-site
npm install
```

Expected: A new `el-portal-site/` directory with `src/pages/index.astro`, `astro.config.mjs`, `tsconfig.json`, `package.json`.

- [ ] **Step 2: Verify Astro config is correct for static output**

Open `astro.config.mjs`. It should read:
```js
import { defineConfig } from 'astro/config';

export default defineConfig({});
```

If it has any adapter or output settings, remove them — static is the default.

- [ ] **Step 3: Verify dev server starts**

```bash
npm run dev
```

Expected: Terminal shows `Local: http://localhost:4321/` and the default Astro page loads in browser. Stop with Ctrl+C.

- [ ] **Step 4: Commit**

```bash
git init
git add .
git commit -m "feat: scaffold Astro project"
```

---

## Task 2: Copy Assets to Public

**Files:**
- Create: `public/assets/` (directory with all files from `Assets_ElPortal/`)

- [ ] **Step 1: Create assets directory and copy known files**

From inside `el-portal-site/`:
```bash
mkdir -p public/assets
cp ../Assets_ElPortal/svgLogo.svg public/assets/
cp ../Assets_ElPortal/Logo.png public/assets/
cp ../Assets_ElPortal/heroVideo.mp4 public/assets/
cp ../Assets_ElPortal/carnitasTacos.png public/assets/
cp ../Assets_ElPortal/cilantro.png public/assets/
cp ../Assets_ElPortal/quesabiria.png public/assets/
cp ../Assets_ElPortal/soup_pic.jpg public/assets/
cp ../Assets_ElPortal/taco1.png public/assets/
cp ../Assets_ElPortal/truck3.png public/assets/
```

- [ ] **Step 2: Note missing assets**

The existing `index.html` references several image files from a `uploads/` path (mixboard-image.png, pandulce.png, pasted-*.png, etc.) that are not yet in `Assets_ElPortal/`. Place any additional food/dish photos into `public/assets/` as they become available. The plan uses the known assets listed above; missing images will show as broken until added.

- [ ] **Step 3: Verify files are present**

```bash
ls public/assets/
```

Expected output includes: `svgLogo.svg Logo.png heroVideo.mp4 carnitasTacos.png cilantro.png quesabiria.png soup_pic.jpg taco1.png truck3.png`

- [ ] **Step 4: Commit**

```bash
git add public/assets/
git commit -m "feat: add static assets"
```

---

## Task 3: Create Global CSS

**Files:**
- Create: `src/styles/global.css`

- [ ] **Step 1: Create styles directory**

```bash
mkdir -p src/styles
```

- [ ] **Step 2: Create `src/styles/global.css`**

This file contains all CSS from `index.html`. Copy ALL three `<style>` blocks from the original `index.html` into one file in this order:
1. The main `<style>` block from `<head>` (tokens → reset → nav → hero → marquee → ... → responsive)
2. The `.pandulce-section` style block (inline in the body, after the pan dulce section)
3. The `.reviews-section` and `.findtruck-section` style block (inline in body, after reviews section)

After pasting, make these two targeted edits:

**Replace** the `.nav-logo` rule block:
```css
/* DELETE THIS: */
.nav-logo {
  font-family: var(--ff-disp); font-size: 22px; letter-spacing: 0.08em;
  color: var(--yellow);
}
.nav-logo sup {
  font-family: var(--ff-body); font-size: 9px; font-weight: 500;
  letter-spacing: 0.18em; text-transform: uppercase;
  color: var(--cream); opacity: 0.5; margin-left: 8px; vertical-align: middle;
}
```

**Add this in its place:**
```css
.nav-logo-img { display: flex; align-items: center; }
.nav-logo-img img { height: 40px; width: auto; display: block; }
```

**Also delete** the entire `#tweaks-panel` block and all `.twk-*` rules — they were a dev-only tool and are not needed in production.

- [ ] **Step 3: Commit**

```bash
git add src/styles/global.css
git commit -m "feat: add global CSS from existing design"
```

---

## Task 4: Create Menu Data File

**Files:**
- Create: `src/data/menu.ts`

- [ ] **Step 1: Create `src/data/menu.ts`**

```typescript
export interface MenuItem {
  name: string;
  badge?: { label: string; variant?: 'default' | 'green' | 'yellow' };
  desc: string;
  price: string;
}

export interface MenuCategory {
  id: string;
  label: string;
  featuredImage?: string;
  featuredCaption?: string;
  items: MenuItem[];
}

export const menuData: MenuCategory[] = [
  {
    id: 'birria',
    label: 'BIRRIA',
    featuredImage: '/assets/quesabiria.png',
    featuredCaption: 'Slow-Cooked Pulled Tender Beef',
    items: [
      { name: 'QUESABIRRIA', badge: { label: 'Classic' }, desc: 'Large handmade tortilla, melted crispy cheese, cilantro & onion. Served with consomé.', price: '$6.99' },
      { name: 'BIRRIA PIZZA', badge: { label: 'Favorite', variant: 'green' }, desc: 'Melted cheese, double flour tortilla, cilantro, onions & side of beef broth.', price: '$26.00' },
      { name: 'BIRRIA BOWL', desc: 'Beef broth with tender birria, handmade tortillas, cilantro, onions & house salsas.', price: '$19.99' },
      { name: 'BIRRIA PLATE', badge: { label: 'Generous' }, desc: 'Dry birria, rice, beans, cilantro, onions, broth & handmade tortillas.', price: '$19.99' },
      { name: 'RAMEN BIRRIA', badge: { label: 'Trending', variant: 'yellow' }, desc: 'Tapatio ramen with birria meat, broth, cheese, cilantro & onion.', price: '$13.99' },
      { name: 'CONSOMÉ', desc: 'Signature red chili beef broth.', price: '$2.00' },
    ],
  },
  {
    id: 'tacos',
    label: 'TACOS',
    items: [
      { name: 'TACO DE BIRRIA', badge: { label: 'Signature' }, desc: 'Braised beef birria, cilantro, onion, handmade tortilla. Served with consomé.', price: '$4.50' },
      { name: 'TACO AL PASTOR', desc: 'Marinated pork, pineapple, cilantro & onion on handmade tortilla.', price: '$3.50' },
      { name: 'TACO DE CARNITAS', badge: { label: 'Michoacán', variant: 'green' }, desc: 'Slow-fried pulled pork, cilantro, onion & salsa.', price: '$3.50' },
      { name: 'TACO DE ASADA', desc: 'Grilled carne asada, fresh cilantro & onion.', price: '$4.00' },
      { name: 'TACO DE CHORIZO', desc: 'House chorizo, cilantro, onion & salsa verde.', price: '$3.50' },
      { name: 'TACO DE LENGUA', desc: 'Slow-braised beef tongue, cilantro & onion.', price: '$4.50' },
    ],
  },
  {
    id: 'tortas',
    label: 'TORTAS',
    items: [
      { name: 'TORTA DE BIRRIA', badge: { label: 'Best Seller' }, desc: 'Birria, melted cheese, cilantro, onion, avocado & consomé on toasted bolillo.', price: '$14.99' },
      { name: 'TORTA DE CARNITAS', desc: 'Crispy carnitas, refried beans, jalapeño, avocado & crema.', price: '$12.99' },
      { name: 'TORTA DE ASADA', desc: 'Carne asada, beans, avocado, tomato, jalapeño & salsa.', price: '$13.99' },
      { name: 'TORTA AHOGADA', badge: { label: 'Spicy', variant: 'yellow' }, desc: 'Pork torta drowned in red chili salsa. A Guadalajara classic.', price: '$13.99' },
    ],
  },
  {
    id: 'menudo',
    label: 'MENUDO',
    featuredImage: '/assets/soup_pic.jpg',
    featuredCaption: 'Menudo Rojo · Slow-Simmered',
    items: [
      { name: 'MENUDO ROJO', badge: { label: 'PNW Famous' }, desc: 'Traditional red menudo with hominy, cilantro, onion & handmade tortillas. Small or large.', price: '$12.99' },
      { name: 'MENUDO BLANCO', desc: 'White broth menudo, mild and clean. Served with tortillas.', price: '$12.99' },
      { name: 'POZOLE ROJO', badge: { label: 'Weekend', variant: 'green' }, desc: 'Slow-cooked pork in red chili broth with hominy, tostadas & garnishes.', price: '$13.99' },
    ],
  },
  {
    id: 'dulces',
    label: 'PAN DULCE',
    featuredImage: '/assets/pandulce.png',
    featuredCaption: 'La Panadería · Sweet Treats',
    items: [
      { name: 'LA CONCHA', badge: { label: 'Classic', variant: 'yellow' }, desc: "The iconic Mexican sweet bread — soft, fluffy, with a crisp sugar shell. Ask for today's flavors.", price: '$2.50' },
      { name: 'CUERNITO', desc: 'Buttery crescent-shaped pan dulce, lightly sweetened.', price: '$2.00' },
      { name: 'POLVORÓN', badge: { label: 'Crumbly' }, desc: 'Melt-in-your-mouth Mexican shortbread cookie dusted in sugar.', price: '$1.75' },
      { name: 'EMPANADA DE CAJETA', desc: "Flaky pastry filled with rich goat's milk caramel. A crowd pleaser.", price: '$3.00' },
      { name: 'SURTIDO DE DULCES', badge: { label: 'Ask Daily', variant: 'green' }, desc: "A rotating selection of pan dulce baked fresh. Ask inside what's available today.", price: 'Varies' },
    ],
  },
  {
    id: 'more',
    label: 'MÁS',
    items: [
      { name: 'BURRITO DE CARNITAS', badge: { label: 'Generoso' }, desc: 'Crispy carnitas, rice, beans, cheese, crema & salsa in a large flour tortilla.', price: '$13.99' },
      { name: 'BURRITO DE BIRRIA', desc: 'Birria, rice, beans, cheese & salsa. Comes with consomé.', price: '$14.99' },
      { name: 'FRESH CUT MEATS', badge: { label: 'Carniceria', variant: 'green' }, desc: "Premium cuts prepared daily. Ask inside for today's selection.", price: 'Market' },
      { name: 'ARROZ & FRIJOLES', desc: 'House rice and slow-cooked beans. Ask for sides.', price: '$3.00' },
    ],
  },
];
```

- [ ] **Step 2: Commit**

```bash
git add src/data/menu.ts
git commit -m "feat: add typed menu data"
```

---

## Task 5: Create Layout.astro

**Files:**
- Create: `src/layouts/Layout.astro`

- [ ] **Step 1: Create `src/layouts/Layout.astro`**

```astro
---
interface Props {
  title: string;
}
const { title } = Astro.props;
---
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{title}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Serif+Display:ital@0;1&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,300&display=swap" rel="stylesheet">
</head>
<body>
  <slot />
</body>
</html>

<style is:global>
  @import '../styles/global.css';
</style>

<script>
  // Scroll reveal
  const io = new IntersectionObserver(
    entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
    { threshold: 0.1 }
  );
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  // Parallax
  const ghostImg = document.getElementById('ghost-truck-img') as HTMLElement | null;
  const truckPar = document.getElementById('truck-par-img') as HTMLElement | null;

  function onScroll() {
    const sy = window.scrollY;
    if (ghostImg) ghostImg.style.transform = `translateY(${sy * 0.06}px)`;
    if (truckPar) {
      const wrap = truckPar.closest('.truck-parallax-wrap');
      if (wrap) {
        const rect = wrap.getBoundingClientRect();
        const mid = rect.top + rect.height / 2 - window.innerHeight / 2;
        truckPar.style.transform = `translateY(${mid * 0.15}px)`;
      }
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
</script>
```

- [ ] **Step 2: Commit**

```bash
git add src/layouts/Layout.astro
git commit -m "feat: add Layout with fonts, CSS, and global JS"
```

---

## Task 6: Create Nav.astro

**Files:**
- Create: `src/components/Nav.astro`

- [ ] **Step 1: Create `src/components/Nav.astro`**

```astro
---
---
<nav id="main-nav">
  <a href="/" class="nav-logo-img">
    <img src="/assets/svgLogo.svg" alt="El Portal Yelm" height="40" />
  </a>
  <ul class="nav-links">
    <li><a href="#menu">Menu</a></li>
    <li><a href="#story">Our Story</a></li>
    <li><a href="#hours">Hours</a></li>
    <li><a href="#location">Find Us</a></li>
  </ul>
  <button class="nav-cta" onclick="document.getElementById('order').scrollIntoView()">Order Now</button>
</nav>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Nav.astro
git commit -m "feat: add Nav component with SVG logo"
```

---

## Task 7: Create Hero.astro

**Files:**
- Create: `src/components/Hero.astro`

- [ ] **Step 1: Create `src/components/Hero.astro`**

```astro
---
---
<section class="hero" id="home">
  <video
    autoplay
    muted
    loop
    playsinline
    style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center;"
  >
    <source src="/assets/heroVideo.mp4" type="video/mp4">
  </video>
  <div class="hero-content">
    <div class="hero-title-block">
      <p class="hero-eyebrow">Taqueria &amp; Carniceria · Cocina Michoacana</p>
      <h1 class="hero-title">AUTHENTIC<br><span class="yellow">BOLD FLAVOR.</span></h1>
      <div class="hero-ctas">
        <button class="btn-outline" onclick="document.getElementById('order').scrollIntoView()">Order Now</button>
      </div>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Hero.astro
git commit -m "feat: add Hero component with video"
```

---

## Task 8: Create Marquee.astro

**Files:**
- Create: `src/components/Marquee.astro`

- [ ] **Step 1: Create `src/components/Marquee.astro`**

The chili pepper SVG is reused between each word. Define it once as a variable:

```astro
---
const chili = `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style="display:inline-block;vertical-align:middle"><path d="M12 2C12 2 10 4 10 7C10 9 11 10.5 12 11.5C13 12.5 13.5 14 13 16C12.5 18 11 19.5 9 20.5C11 21 13.5 20.5 15.5 19C17.5 17.5 18.5 15 18 12.5C17.5 10 16 8.5 14.5 7.5C13.5 6.5 13 5 13 3.5L12 2Z"/><path d="M12 2C11 3 10.5 4.5 11 6C11.5 7.5 13 8.5 14 9.5" stroke="currentColor" stroke-width="0.5" fill="none"/></svg>`;

const words = [
  'TACOS', 'TIENDA MEXICANA', 'BIRRIA', 'CARNICERIA',
  'FAMILY OWNED', 'HANDMADE TORTILLAS', 'FRESH SALSA',
  'MENUDO', 'COCINA MICHOACANA', 'BURRITOS', 'TORTAS',
];
// Duplicate for seamless loop
const allWords = [...words, ...words];
---
<div class="marquee" aria-hidden="true">
  <div class="marquee-track">
    {allWords.map(word => (
      <>
        <span>{word}</span>
        <span class="dot" set:html={chili} />
      </>
    ))}
  </div>
</div>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Marquee.astro
git commit -m "feat: add Marquee component"
```

---

## Task 9: Create MenuSection.astro

**Files:**
- Create: `src/components/MenuSection.astro`

- [ ] **Step 1: Create `src/components/MenuSection.astro`**

```astro
---
import { menuData } from '../data/menu.ts';
---

<div class="menu-header-block" id="menu">
  <div class="menu-header-top">
    <div class="menu-header-left reveal">
      <p class="overline">Flavor Profiles</p>
      <h2 class="lineup-title">THE<br>LINEUP.</h2>
    </div>
  </div>
  <div class="menu-header-sub reveal">
    <div class="menu-header-right">
      <p>Our menu is a rotating curation of premium ingredients meeting traditional heritage. No fillers, just soul.</p>
    </div>
  </div>
</div>

<div class="menu-tabs-section">
  <div class="mtabs-nav">
    {menuData.map((cat, i) => (
      <button class={`mtab${i === 0 ? ' active' : ''}`} data-tab={cat.id}>
        {cat.label}
      </button>
    ))}
  </div>

  {menuData.map((cat, i) => (
    <div
      class={`mtab-panel${i === 0 ? ' active' : ''}`}
      id={`tab-${cat.id}`}
      style={i !== 0 ? 'display:none' : ''}
    >
      <div class={`mpanel-inner${!cat.featuredImage ? ' mpanel-full' : ''}`}>
        {cat.featuredImage && (
          <div class="mpanel-featured">
            <img src={cat.featuredImage} alt={cat.featuredCaption} class="mpanel-img" />
            <div class="mpanel-img-caption">
              <span class="mcat-label">{cat.featuredCaption}</span>
            </div>
          </div>
        )}
        <div class="mpanel-items">
          <p class="mcat-label">{cat.featuredCaption ?? cat.label}</p>
          {cat.items.map(item => (
            <div class="mitem">
              <div class="mitem-left">
                <div class="mitem-name">
                  {item.name}
                  {item.badge && (
                    <span class={`mbadge${item.badge.variant === 'green' ? ' mbadge-green' : item.badge.variant === 'yellow' ? ' mbadge-yellow' : ''}`}>
                      {item.badge.label}
                    </span>
                  )}
                </div>
                <div class="mitem-desc">{item.desc}</div>
              </div>
              <div class="mitem-price">{item.price}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  ))}
</div>

<script>
  document.querySelectorAll('.mtab').forEach(tab => {
    tab.addEventListener('click', () => {
      const target = (tab as HTMLElement).dataset.tab;
      document.querySelectorAll('.mtab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.mtab-panel').forEach(p => {
        p.classList.remove('active');
        (p as HTMLElement).style.display = 'none';
      });
      tab.classList.add('active');
      const panel = document.getElementById('tab-' + target);
      if (panel) {
        panel.style.display = 'block';
        panel.offsetHeight; // force reflow for animation
        panel.classList.add('active');
      }
    });
  });
</script>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/MenuSection.astro
git commit -m "feat: add MenuSection with dynamic data rendering and tab switching"
```

---

## Task 10: Create WordsSection.astro

**Files:**
- Create: `src/components/WordsSection.astro`

- [ ] **Step 1: Create `src/components/WordsSection.astro`**

```astro
---
---
<section class="words-section" id="mission">
  <div class="truck-ghost" id="words-truck-ghost">
    <img src="/assets/truck3.png" alt="" id="ghost-truck-img">
  </div>
  <div class="words-inner">
    <p class="words-overline">What we stand for</p>
    <div class="words-stack">
      <div class="word-row reveal">AUTÉNTICO <span class="wr-num">01</span></div>
      <div class="word-row yellow reveal" style="transition-delay:.08s">ARTESANAL <span class="wr-num">02</span></div>
      <div class="word-row reveal" style="transition-delay:.16s">FAMILIAR <span class="wr-num">03</span></div>
      <div class="word-row red reveal" style="transition-delay:.24s">HECHO A MANO <span class="wr-num">04</span></div>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/WordsSection.astro
git commit -m "feat: add WordsSection component"
```

---

## Task 11: Create TruckSection.astro

**Files:**
- Create: `src/components/TruckSection.astro`

- [ ] **Step 1: Create `src/components/TruckSection.astro`**

```astro
---
---
<section class="truck-section" id="truck">
  <div class="truck-parallax-wrap">
    <img src="/assets/truck3.png" alt="" id="truck-par-img">
  </div>
  <div class="truck-overlay">
    <h2 class="truck-big-text reveal">THE<br><span class="acc">YELLOW</span><br>TRUCK.</h2>
    <div class="truck-right reveal" style="transition-delay:.12s">
      <p>Look for the yellow — you can't miss it. Parked in Yelm and ready to serve. Authentic Michoacán flavor, right from our window to your hands.</p>
      <div class="truck-stats">
        <div class="truck-stat"><strong>100%</strong><span>Handmade Tortillas</span></div>
        <div class="truck-stat"><strong>DAILY</strong><span>Fresh Prep</span></div>
        <div class="truck-stat"><strong>FAM</strong><span>Family Owned</span></div>
      </div>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/TruckSection.astro
git commit -m "feat: add TruckSection component"
```

---

## Task 12: Create SignatureDishes.astro

**Files:**
- Create: `src/components/SignatureDishes.astro`

- [ ] **Step 1: Create `src/components/SignatureDishes.astro`**

```astro
---
---
<section class="sig-section" id="specials">
  <div class="sig-header reveal">
    <p class="overline">Made to Remember</p>
    <h2>CAN'T MISS<br>DISHES.</h2>
  </div>
  <div class="sig-grid">
    <div class="sg">
      <div class="sg-ph">
        <img src="/assets/quesabiria.png" alt="Birria de Res" style="width:100%;height:100%;object-fit:cover;object-position:center;">
      </div>
      <div class="sg-content">
        <div class="sg-num">01</div>
        <div class="sg-name">BIRRIA<br>DE RES</div>
        <div class="sg-desc">Braised beef birria, deep red consommé. Best served messy.</div>
        <span class="sg-badge">Signature</span>
      </div>
    </div>
    <div class="sg">
      <div class="sg-ph">
        <img src="/assets/soup_pic.jpg" alt="Menudo Rojo" style="width:100%;height:100%;object-fit:cover;object-position:center 30%;">
      </div>
      <div class="sg-content">
        <div class="sg-num">02</div>
        <div class="sg-name">MENUDO<br>ROJO</div>
        <div class="sg-desc">Slow-cooked, rich and complex. The best in the Pacific Northwest.</div>
        <span class="sg-badge">PNW Famous</span>
      </div>
    </div>
    <div class="sg">
      <div class="sg-ph">
        <img src="/assets/taco1.png" alt="Handmade Tortillas" style="width:100%;height:100%;object-fit:cover;object-position:center;">
      </div>
      <div class="sg-content">
        <div class="sg-num">03</div>
        <div class="sg-name">TORTILLAS<br>A MANO</div>
        <div class="sg-desc">Pressed and cooked fresh every single day. You'll taste the difference.</div>
        <span class="sg-badge">Daily Fresh</span>
      </div>
    </div>
    <div class="sg">
      <div class="sg-ph">
        <img src="/assets/carnitasTacos.png" alt="Carnitas Torta" style="width:100%;height:100%;object-fit:cover;object-position:62% center;">
      </div>
      <div class="sg-content">
        <div class="sg-num">04</div>
        <div class="sg-name">CARNITAS<br>TORTA</div>
        <div class="sg-desc">Crispy pulled pork, layers of flavor. A Michoacán classic done right.</div>
        <span class="sg-badge">Must Try</span>
      </div>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/SignatureDishes.astro
git commit -m "feat: add SignatureDishes component"
```

---

## Task 13: Create PanDulceFeature.astro

**Files:**
- Create: `src/components/PanDulceFeature.astro`

- [ ] **Step 1: Create `src/components/PanDulceFeature.astro`**

```astro
---
---
<section class="pandulce-section">
  <div class="pd-image-wrap">
    <img src="/assets/cilantro.png" alt="Pan Dulce — La Concha" class="pd-img">
    <div class="pd-overlay"></div>
  </div>
  <div class="pd-content reveal">
    <p class="overline" style="color:var(--yellow)">La Panadería</p>
    <h2 class="pd-title">DON'T FORGET<br>THE PAN<br><span style="color:var(--yellow)">DULCE.</span></h2>
    <p class="pd-sub">La Concha and other sweet treats — baked fresh and ready to take home. Ask inside for today's selection.</p>
    <button
      class="btn-yellow"
      onclick="document.querySelector('[data-tab=dulces]').click(); document.getElementById('menu').scrollIntoView()"
    >
      See Sweet Menu
    </button>
  </div>
</section>
```

> **Note:** The `pandulce.png` image was referenced in the original HTML but is not yet in `Assets_ElPortal/`. `cilantro.png` is used as a placeholder above. Replace `cilantro.png` with `pandulce.png` once that image is available in `public/assets/`.

- [ ] **Step 2: Commit**

```bash
git add src/components/PanDulceFeature.astro
git commit -m "feat: add PanDulceFeature component"
```

---

## Task 14: Create StorySection.astro

**Files:**
- Create: `src/components/StorySection.astro`

- [ ] **Step 1: Create `src/components/StorySection.astro`**

```astro
---
---
<section class="story-section" id="story">
  <div class="story-left reveal">
    <div>
      <p class="overline">Family Owned &amp; Operated</p>
      <h2>MADE WITH<br>HEART.<em>Rooted in tradition.</em></h2>
    </div>
    <div class="flag-stripe">
      <span class="g"></span><span class="w"></span><span class="r"></span>
    </div>
  </div>
  <div class="story-right reveal" style="transition-delay:.12s">
    <p>El Portal Yelm was born from a passion for real, handcrafted food — the kind that takes time, patience, and love to get right. As a family-owned and operated business, we bring the flavors of Cocina Michoacana to the Pacific Northwest, one handmade tortilla at a time.</p>
    <div class="story-pullquote">"Best Menudo and Birria in the PNW."</div>
    <p>Every morning we press tortillas by hand. Every afternoon we slow-cook our meats with care. We're not a chain, not a franchise. We're family — and when you step through our portal, you become part of it.</p>
  </div>
</section>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/StorySection.astro
git commit -m "feat: add StorySection component"
```

---

## Task 15: Create Reviews.astro

**Files:**
- Create: `src/components/Reviews.astro`

- [ ] **Step 1: Create `src/components/Reviews.astro`**

```astro
---
---
<section class="reviews-section">
  <div class="reviews-header reveal">
    <p class="overline">Real People · Real Flavor</p>
    <h2 class="reviews-title">THE WORD<br>ON THE STREET.</h2>
  </div>
  <div class="reviews-grid">
    <div class="rcard reveal">
      <blockquote class="rcard-quote">"Best birria I've ever had — and I've had birria all over. The consomé alone is worth the trip."</blockquote>
      <div class="rcard-author">— Maria G. <span>· Yelm, WA</span></div>
    </div>
    <div class="rcard rcard-accent reveal" style="transition-delay:.1s">
      <blockquote class="rcard-quote">"Handmade tortillas every single day. You can taste the difference. This place is the real deal."</blockquote>
      <div class="rcard-author">— James T. <span>· Olympia, WA</span></div>
    </div>
    <div class="rcard reveal" style="transition-delay:.2s">
      <blockquote class="rcard-quote">"The menudo is unreal. My whole family drives from Tacoma just for this. Family-owned and it shows."</blockquote>
      <div class="rcard-author">— Rosa M. <span>· Tacoma, WA</span></div>
    </div>
    <div class="rcard rcard-dark reveal" style="transition-delay:.3s">
      <blockquote class="rcard-quote">"Quesabirria is addictive. The yellow truck is iconic. El Portal is Yelm's best-kept secret — not anymore."</blockquote>
      <div class="rcard-author">— Kevin L. <span>· Yelm, WA</span></div>
    </div>
  </div>
  <div class="reviews-cta reveal">
    <a href="https://www.yelp.com/biz/el-portal-yelm" target="_blank" rel="noopener" class="btn-review-link">Read More Reviews</a>
  </div>
</section>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Reviews.astro
git commit -m "feat: add Reviews component"
```

---

## Task 16: Create FindTruck.astro (with Formspree)

**Files:**
- Create: `src/components/FindTruck.astro`

- [ ] **Step 1: Set up Formspree**

1. Go to [formspree.io](https://formspree.io) and create a free account
2. Click "New Form" → name it "El Portal Catering Inquiry"
3. Set the email to `elportalyelm2000@gmail.com`
4. Copy your form endpoint — it looks like: `https://formspree.io/f/xabc1234`

- [ ] **Step 2: Create `src/components/FindTruck.astro`**

Replace `https://formspree.io/f/YOUR_FORM_ID` with your actual Formspree endpoint from Step 1.

```astro
---
---
<section class="findtruck-section">
  <div class="ft-left reveal">
    <p class="overline">We're Out There</p>
    <h2 class="ft-title">FIND<br>THE<br><span class="ft-yellow">TRUCK.</span></h2>
    <p class="ft-sub">Follow us on social for daily location updates, specials, and behind-the-scenes from the kitchen.</p>
    <div class="ft-socials">
      <a href="https://www.facebook.com/ElPortalYelm" target="_blank" rel="noopener" class="ft-social-btn">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
        Facebook
      </a>
      <a href="https://www.instagram.com/elportalyelm" target="_blank" rel="noopener" class="ft-social-btn">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="5"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>
        Instagram
      </a>
    </div>
    <div class="ft-address">
      <span class="overline" style="margin-bottom:8px;display:block">Home Base</span>
      <div class="ft-addr-text">Yelm, Washington<br><small>(360) 960-8405</small></div>
    </div>
  </div>

  <div class="ft-right reveal" style="transition-delay:.12s">
    <div class="ft-form-wrap">
      <p class="overline">Catering & Events</p>
      <h3 class="ft-form-title">BRING EL PORTAL<br>TO YOUR EVENT.</h3>
      <p class="ft-form-sub">Weddings, corporate events, birthdays, block parties — we bring the full experience to you.</p>
      <form
        class="ft-form"
        action="https://formspree.io/f/YOUR_FORM_ID"
        method="POST"
        id="catering-form"
      >
        <div class="ft-field">
          <label for="name">Your Name</label>
          <input type="text" id="name" name="name" placeholder="Full name" required>
        </div>
        <div class="ft-field">
          <label for="email">Email</label>
          <input type="email" id="email" name="email" placeholder="you@email.com" required>
        </div>
        <div class="ft-field-row">
          <div class="ft-field">
            <label for="date">Event Date</label>
            <input type="date" id="date" name="event_date">
          </div>
          <div class="ft-field">
            <label for="guests">Guest Count</label>
            <input type="number" id="guests" name="guest_count" placeholder="Est. guests" min="10">
          </div>
        </div>
        <div class="ft-field">
          <label for="details">Tell Us About Your Event</label>
          <textarea id="details" name="details" placeholder="Location, type of event, any special requests..." rows="3"></textarea>
        </div>
        <button type="submit" class="ft-submit">Send Inquiry</button>
        <p class="ft-form-note" id="ft-success" style="display:none;">
          ✓ Message sent! We'll be in touch soon.
        </p>
      </form>
    </div>
  </div>
</section>

<script>
  const form = document.getElementById('catering-form') as HTMLFormElement | null;
  const success = document.getElementById('ft-success');

  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const res = await fetch(form.action, {
      method: 'POST',
      body: data,
      headers: { Accept: 'application/json' },
    });
    if (res.ok) {
      if (success) success.style.display = 'block';
      form.querySelectorAll('input, textarea, button[type=submit]').forEach(
        el => ((el as HTMLInputElement).disabled = true)
      );
    }
  });
</script>
```

- [ ] **Step 3: Commit**

```bash
git add src/components/FindTruck.astro
git commit -m "feat: add FindTruck component with Formspree catering form"
```

---

## Task 17: Create SocialSection.astro

**Files:**
- Create: `src/components/SocialSection.astro`

- [ ] **Step 1: Create `src/components/SocialSection.astro`**

```astro
---
---
<section class="social-section">
  <div class="social-hd reveal">
    <h2>TAG US OR IT<br>DIDN'T HAPPEN.</h2>
    <a class="social-handle" href="https://www.facebook.com/ElPortalYelm" target="_blank" rel="noopener">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
      El Portal Yelm
    </a>
  </div>
  <div class="social-grid">
    <div class="st">
      <img src="/assets/carnitasTacos.png" alt="Tacos" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;">
    </div>
    <div class="st">
      <img src="/assets/quesabiria.png" alt="Birria" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;">
    </div>
    <div class="st">
      <img src="/assets/taco1.png" alt="Tortillas" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;">
    </div>
    <div class="st">
      <img src="/assets/soup_pic.jpg" alt="Menudo" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center top;">
    </div>
    <div class="st">
      <img src="/assets/truck3.png" alt="The Truck" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;">
    </div>
  </div>
</section>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/SocialSection.astro
git commit -m "feat: add SocialSection component"
```

---

## Task 18: Create HoursLocation.astro

**Files:**
- Create: `src/components/HoursLocation.astro`

- [ ] **Step 1: Create `src/components/HoursLocation.astro`**

```astro
---
const hours = [
  { day: 'Monday',    time: '10:00 AM – 8:00 PM' },
  { day: 'Tuesday',   time: '10:00 AM – 8:00 PM' },
  { day: 'Wednesday', time: '10:00 AM – 8:00 PM' },
  { day: 'Thursday',  time: '10:00 AM – 8:00 PM' },
  { day: 'Friday',    time: '10:00 AM – 9:00 PM' },
  { day: 'Saturday',  time: '9:00 AM – 9:00 PM'  },
  { day: 'Sunday',    time: '9:00 AM – 7:00 PM'  },
];
---
<section class="hours-section" id="hours">
  <div class="hours-left reveal">
    <p class="overline">Hours</p>
    <h2>WHEN<br>TO FIND<br>US.</h2>
    <div class="hours-rows">
      {hours.map(row => (
        <div class="hr-row" data-day={row.day}>
          <span class="day">{row.day}</span>
          <span class="time">{row.time}</span>
        </div>
      ))}
    </div>
  </div>
  <div class="hours-right reveal" style="transition-delay:.12s" id="location">
    <p class="overline">Location</p>
    <div class="location-name">YELM,<br>WASHINGTON</div>
    <div class="location-detail">Order inside the store · Ordene dentro de la tienda</div>
    <div class="location-phone">(360) 960-8405</div>
    <div class="loc-btns">
      <a
        href="https://maps.google.com/?q=Yelm,+Washington"
        target="_blank"
        rel="noopener"
        class="btn-yel-solid"
      >Get Directions</a>
      <a href="tel:+13609608405" class="btn-ghost-light">Call Us</a>
    </div>
    <div class="map-ph">[ Google Maps embed ]</div>
  </div>
</section>

<script>
  const DAYS = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const today = DAYS[new Date().getDay()];
  document.querySelectorAll('.hr-row').forEach(row => {
    if ((row as HTMLElement).dataset.day === today) {
      row.classList.add('today');
      const d = row.querySelector('.day');
      if (d) d.textContent = today + ' →';
    }
  });
</script>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/HoursLocation.astro
git commit -m "feat: add HoursLocation component with today highlight"
```

---

## Task 19: Create OrderCTA.astro

**Files:**
- Create: `src/components/OrderCTA.astro`

- [ ] **Step 1: Create `src/components/OrderCTA.astro`**

```astro
---
---
<section class="order-section" id="order">
  <p class="order-overline reveal">Ready?</p>
  <h2 class="order-title reveal">
    STEP<br>THROUGH<br><span class="acc">EL PORTAL.</span>
  </h2>
  <p class="order-sub reveal">Your next favorite meal is one order away.</p>
  <div class="order-btns reveal">
    <button class="btn-big-yellow">Order Online</button>
    <button class="btn-big-outline" onclick="document.getElementById('hours').scrollIntoView()">Visit Us</button>
  </div>
</section>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/OrderCTA.astro
git commit -m "feat: add OrderCTA component"
```

---

## Task 20: Create Footer.astro

**Files:**
- Create: `src/components/Footer.astro`

- [ ] **Step 1: Create `src/components/Footer.astro`**

```astro
---
const year = new Date().getFullYear();
---
<footer>
  <div class="footer-logo">
    EL PORTAL
    <small>Yelm, WA · Taqueria &amp; Carniceria</small>
  </div>
  <ul class="footer-links">
    <li><a href="#menu">Menu</a></li>
    <li><a href="#story">Story</a></li>
    <li><a href="#hours">Hours</a></li>
    <li><a href="#location">Find Us</a></li>
  </ul>
  <p class="footer-copy">© {year} El Portal Yelm. All rights reserved.</p>
</footer>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Footer.astro
git commit -m "feat: add Footer component"
```

---

## Task 21: Wire index.astro

**Files:**
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Replace the contents of `src/pages/index.astro`**

```astro
---
import Layout from '../layouts/Layout.astro';
import Nav from '../components/Nav.astro';
import Hero from '../components/Hero.astro';
import Marquee from '../components/Marquee.astro';
import MenuSection from '../components/MenuSection.astro';
import WordsSection from '../components/WordsSection.astro';
import TruckSection from '../components/TruckSection.astro';
import SignatureDishes from '../components/SignatureDishes.astro';
import PanDulceFeature from '../components/PanDulceFeature.astro';
import StorySection from '../components/StorySection.astro';
import Reviews from '../components/Reviews.astro';
import FindTruck from '../components/FindTruck.astro';
import SocialSection from '../components/SocialSection.astro';
import HoursLocation from '../components/HoursLocation.astro';
import OrderCTA from '../components/OrderCTA.astro';
import Footer from '../components/Footer.astro';
---

<Layout title="El Portal Yelm — Taqueria & Carniceria">
  <Nav />
  <Hero />
  <Marquee />
  <MenuSection />
  <WordsSection />
  <TruckSection />
  <SignatureDishes />
  <PanDulceFeature />
  <StorySection />
  <Reviews />
  <FindTruck />
  <SocialSection />
  <HoursLocation />
  <OrderCTA />
  <Footer />
</Layout>
```

- [ ] **Step 2: Start dev server and do a full visual check**

```bash
npm run dev
```

Open `http://localhost:4321` and scroll through the entire page. Verify:
- SVG logo appears in the nav top-left (no text)
- Hero video plays
- Marquee scrolls
- Menu tabs switch between categories
- Scroll reveal animations fire
- Parallax visible on Words and Truck sections
- Today's day is highlighted in hours
- All sections visible and styled correctly

- [ ] **Step 3: Commit**

```bash
git add src/pages/index.astro
git commit -m "feat: wire all components in index.astro"
```

---

## Task 22: Production Build + Cloudflare Pages Deploy

**Files:** No code changes — verification only.

- [ ] **Step 1: Run production build**

```bash
npm run build
```

Expected: Build completes with no errors. A `dist/` directory is created containing `index.html` and all static assets.

- [ ] **Step 2: Preview the production build locally**

```bash
npm run preview
```

Open `http://localhost:4321` and repeat the visual check from Task 21 — production output can differ from dev in edge cases.

- [ ] **Step 3: Push to GitHub**

```bash
git remote add origin https://github.com/YOUR_USERNAME/el-portal-yelm.git
git push -u origin main
```

- [ ] **Step 4: Connect to Cloudflare Pages**

1. Log into [Cloudflare Dashboard](https://dash.cloudflare.com) → Pages → Create a project
2. Connect your GitHub account and select the `el-portal-yelm` repository
3. Set build settings:
   - **Framework preset:** Astro
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
4. Click "Save and Deploy"
5. Wait for the build to complete — Cloudflare provides a `*.pages.dev` URL

- [ ] **Step 5: Verify live deployment**

Open the Cloudflare Pages URL and verify:
- All images load (check browser devtools Network tab for 404s)
- Hero video plays
- Menu tabs work
- Catering form submits and shows success message
- No console errors

- [ ] **Step 6: Final commit if any fixes were needed**

```bash
git add -p
git commit -m "fix: resolve any production build issues"
git push
```

---

## Self-Review Notes

**Spec coverage check:**
- ✅ Astro 4.x static site — Task 1
- ✅ Assets copied from Assets_ElPortal/ — Task 2
- ✅ CSS from all 3 style blocks merged into global.css — Task 3
- ✅ Menu data in TypeScript — Task 4
- ✅ Layout with fonts + global JS — Task 5
- ✅ Nav with SVG logo, text removed — Task 6
- ✅ Hero with video at /assets/heroVideo.mp4 — Task 7
- ✅ Marquee — Task 8
- ✅ Menu tabs rendering from data — Task 9
- ✅ WordsSection with parallax ghost — Task 10
- ✅ TruckSection with parallax — Task 11
- ✅ Signature dishes with available images — Task 12
- ✅ Pan dulce feature — Task 13
- ✅ Story section — Task 14
- ✅ Reviews — Task 15
- ✅ Formspree catering form → elportalyelm2000@gmail.com — Task 16
- ✅ Social grid — Task 17
- ✅ Hours with today highlight — Task 18
- ✅ Order CTA — Task 19
- ✅ Footer — Task 20
- ✅ Full index.astro wiring — Task 21
- ✅ Cloudflare Pages deploy — Task 22
- ✅ Tweaks panel omitted (dev tool) — not in any task

**Type consistency:** `MenuCategory.featuredCaption` and `MenuItem.badge.variant` are used consistently across `menu.ts` and `MenuSection.astro`.

**Missing assets note:** `pandulce.png` and several `mixboard-image*.png` files from the original `uploads/` directory are not in `Assets_ElPortal/`. Task 13 flags this and uses `cilantro.png` as a placeholder. Task 2 instructs adding them when available.
