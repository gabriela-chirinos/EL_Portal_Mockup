import { chromium } from 'playwright';

const BASE   = 'http://localhost:4323';
const MOBILE  = { width: 390, height: 844 };
const DESKTOP = { width: 1280, height: 800 };

const findings = [];

function log(severity, area, message, detail = '') {
  findings.push({ severity, area, message, detail });
  const icon = severity === 'ERROR' ? '🔴' : severity === 'WARN' ? '🟡' : '✅';
  console.log(`${icon} [${severity}] [${area}] ${message}${detail ? '\n     → ' + detail : ''}`);
}

async function run() {
  const browser = await chromium.launch({ headless: false, slowMo: 350 });

  // ─── 1. DESKTOP SMOKE ────────────────────────────────────────────────────
  console.log('\n══════════════════════════════════════════');
  console.log('  1 — Desktop layout');
  console.log('══════════════════════════════════════════');

  const dCtx = await browser.newContext({ viewport: DESKTOP });
  const dPage = await dCtx.newPage();
  const dErrors = [];
  dPage.on('console', m => { if (m.type() === 'error') dErrors.push(m.text()); });
  dPage.on('pageerror', e => dErrors.push(e.message));

  await dPage.goto(BASE, { waitUntil: 'networkidle' });
  await dPage.waitForTimeout(1000);

  const navVisible = await dPage.locator('#main-nav').isVisible();
  log(navVisible ? 'OK' : 'ERROR', 'Desktop Nav', 'Main nav renders');

  const hamOnDesktop = await dPage.locator('#nav-hamburger').isVisible();
  log(!hamOnDesktop ? 'OK' : 'WARN', 'Desktop Nav', 'Hamburger hidden on desktop (correct)');

  const navLinkCount = await dPage.locator('.nav-links li').count();
  log(navLinkCount >= 4 ? 'OK' : 'ERROR', 'Desktop Nav', `Desktop nav links: ${navLinkCount}`);

  for (const id of ['#menu','#story','#hours','#location','#catering','#order']) {
    const count = await dPage.locator(id).count();
    log(count > 0 ? 'OK' : 'ERROR', 'Sections', `Section ${id} in DOM: ${count > 0 ? 'yes' : 'MISSING'}`);
  }

  if (dErrors.length === 0) log('OK', 'Console', 'Zero JS errors (desktop)');
  else dErrors.forEach(e => log('ERROR', 'Console', 'JS error on desktop', e));

  await dPage.waitForTimeout(500);
  await dCtx.close();

  // ─── 2. MOBILE — HAMBURGER DIAGNOSIS ────────────────────────────────────
  console.log('\n══════════════════════════════════════════');
  console.log('  2 — Mobile hamburger deep-dive');
  console.log('══════════════════════════════════════════');

  const mCtx = await browser.newContext({
    viewport: MOBILE,
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148 Safari/604.1',
  });
  const mPage = await mCtx.newPage();
  const mErrors = [];
  mPage.on('console', m => { if (m.type() === 'error') mErrors.push(m.text()); });
  mPage.on('pageerror', e => mErrors.push(e.message));

  await mPage.goto(BASE, { waitUntil: 'networkidle' });
  await mPage.waitForTimeout(1200);

  // Is hamburger in DOM and visible?
  const hamInDom  = await mPage.locator('#nav-hamburger').count();
  const hamVisible = await mPage.locator('#nav-hamburger').isVisible();
  log(hamInDom > 0  ? 'OK' : 'ERROR', 'Hamburger', 'Button #nav-hamburger in DOM');
  log(hamVisible     ? 'OK' : 'ERROR', 'Hamburger', 'Button #nav-hamburger visible (CSS media query active)');

  // Inspect computed styles via CDP
  const hamStyles = await mPage.locator('#nav-hamburger').getAttribute('style') ?? '(no inline style)';
  console.log(`  Inline style on hamburger: ${hamStyles}`);

  // Read CSS custom property – verify via class list
  const hamClass = await mPage.locator('#nav-hamburger').getAttribute('class') ?? '';
  console.log(`  Classes on hamburger: "${hamClass}"`);

  // Check overlay before click
  const overlayBefore = await mPage.locator('#nav-mobile-menu').getAttribute('data-state');
  console.log(`  Overlay data-state before click: ${overlayBefore}`);

  // Perform the click
  if (hamVisible) {
    console.log('\n  ▶ Clicking hamburger...');
    await mPage.locator('#nav-hamburger').click();
    await mPage.waitForTimeout(700);

    const overlayAfter = await mPage.locator('#nav-mobile-menu').getAttribute('data-state');
    const menuVisible  = await mPage.locator('#nav-mobile-menu').isVisible();
    console.log(`  Overlay data-state after click: ${overlayAfter}`);
    console.log(`  Overlay isVisible after click: ${menuVisible}`);

    log(overlayAfter === 'open' ? 'OK' : 'ERROR', 'Hamburger',
        `Click toggled overlay to "${overlayAfter}" (expected "open")`);
    log(menuVisible ? 'OK' : 'ERROR', 'Hamburger',
        'Mobile menu panel visually visible after click');

    if (overlayAfter === 'open' && !menuVisible) {
      log('ERROR', 'Overlay CSS',
          'data-state=open set BUT panel not visible — CSS transition or display issue',
          'Check .nav-mobile-overlay display:none not being overridden by media query');
    }

    // Count nav links inside overlay
    const linkCount = await mPage.locator('.nmo-link').count();
    log(linkCount >= 4 ? 'OK' : 'WARN', 'Mobile Menu', `Links inside overlay: ${linkCount}`);

    // Check link labels
    const labels = await mPage.locator('.nmo-label').allInnerTexts();
    log(labels.length > 0 ? 'OK' : 'WARN', 'Mobile Menu', `Section labels: ${labels.join(', ')}`);

    await mPage.screenshot({ path: '/tmp/menu-open.png', fullPage: false });
    console.log('  📸 /tmp/menu-open.png');

    // Close via X button
    await mPage.locator('#nmo-close').click();
    await mPage.waitForTimeout(500);
    const stateAfterClose = await mPage.locator('#nav-mobile-menu').getAttribute('data-state');
    log(stateAfterClose === 'closed' ? 'OK' : 'ERROR', 'Hamburger',
        `X button closes menu — state: "${stateAfterClose}"`);

    // Escape key test
    await mPage.locator('#nav-hamburger').click();
    await mPage.waitForTimeout(500);
    await mPage.keyboard.press('Escape');
    await mPage.waitForTimeout(400);
    const stateAfterEsc = await mPage.locator('#nav-mobile-menu').getAttribute('data-state');
    log(stateAfterEsc === 'closed' ? 'OK' : 'WARN', 'Hamburger',
        `Escape key closes menu — state: "${stateAfterEsc}"`);

  } else {
    log('ERROR', 'Hamburger', 'Cannot click — hamburger not visible; checking why...');
    // Dump computed display of nav-hamburger
    const cssDisplay = await mPage.locator('#nav-hamburger').getAttribute('data-computed-display') ?? 'unknown';
    console.log(`  (display via attr): ${cssDisplay}`);
    await mPage.screenshot({ path: '/tmp/menu-hidden.png' });
    console.log('  📸 /tmp/menu-hidden.png');
  }

  // Check for inline script tag (is:inline confirmation)
  const inlineNavScript = await mPage.locator('script:not([src])').filter({ hasText: 'nav-hamburger' }).count();
  if (inlineNavScript > 0) {
    log('OK', 'Script', `Hamburger handler is inline script (is:inline) — ${inlineNavScript} found`);
  } else {
    log('WARN', 'Script', 'No inline script with "nav-hamburger" — handler may be in a bundled module',
        'Astro module scripts can miss DOMContentLoaded on some builds');
  }

  if (mErrors.length === 0) log('OK', 'Console', 'Zero JS errors (mobile)');
  else mErrors.forEach(e => log('ERROR', 'Console', 'JS error on mobile', e));

  // ─── 3. MOBILE — scroll & form ───────────────────────────────────────────
  console.log('\n══════════════════════════════════════════');
  console.log('  3 — Mobile nav links & catering form');
  console.log('══════════════════════════════════════════');

  for (const { label, href } of [
    { label: 'Menu',      href: '#menu'     },
    { label: 'Our Story', href: '#story'    },
    { label: 'Hours',     href: '#hours'    },
    { label: 'Find Us',   href: '#location' },
    { label: 'Catering',  href: '#catering' },
  ]) {
    const count = await mPage.locator(href).count();
    log(count > 0 ? 'OK' : 'ERROR', 'Scroll Targets', `${label} → ${href}: ${count > 0 ? 'found' : 'MISSING'}`);
  }

  const formCount = await mPage.locator('#catering-form input, #catering-form textarea').count();
  log(formCount > 0 ? 'OK' : 'WARN', 'Form', `Catering form fields visible: ${formCount}`);

  // Order CTA
  const orderSection = await mPage.locator('#order').isVisible().catch(() => false);
  log(orderSection ? 'OK' : 'WARN', 'CTA', 'Order section reachable');

  await mPage.waitForTimeout(600);
  await mCtx.close();

  // ─── 4. FOOTER ────────────────────────────────────────────────────────────
  console.log('\n══════════════════════════════════════════');
  console.log('  4 — Footer & CTA');
  console.log('══════════════════════════════════════════');

  const dCtx3 = await browser.newContext({ viewport: DESKTOP });
  const dPage3 = await dCtx3.newPage();
  await dPage3.goto(BASE, { waitUntil: 'networkidle' });
  await dPage3.waitForTimeout(700);

  const footerVisible = await dPage3.locator('footer').isVisible();
  log(footerVisible ? 'OK' : 'ERROR', 'Footer', 'Footer renders');

  const footerLinkCount = await dPage3.locator('.footer-links a').count();
  log(footerLinkCount >= 3 ? 'OK' : 'WARN', 'Footer', `Footer links: ${footerLinkCount}`);

  const navCta = await dPage3.locator('.nav-cta').isVisible();
  log(navCta ? 'OK' : 'WARN', 'CTA', '"Order Now" button in nav visible');

  await dPage3.waitForTimeout(400);
  await dCtx3.close();

  // ─── REPORT ───────────────────────────────────────────────────────────────
  await browser.close();

  const errors = findings.filter(f => f.severity === 'ERROR');
  const warns  = findings.filter(f => f.severity === 'WARN');
  const oks    = findings.filter(f => f.severity === 'OK');

  console.log('\n\n╔══════════════════════════════════════════╗');
  console.log('║            FULL TEST REPORT              ║');
  console.log('╚══════════════════════════════════════════╝\n');
  console.log(`  ✅ Passed:   ${oks.length}`);
  console.log(`  🟡 Warnings: ${warns.length}`);
  console.log(`  🔴 Errors:   ${errors.length}\n`);

  if (errors.length) {
    console.log('─── ERRORS ─────────────────────────────────');
    errors.forEach(e => console.log(`  🔴 [${e.area}] ${e.message}${e.detail ? '\n     ' + e.detail : ''}`));
  }
  if (warns.length) {
    console.log('\n─── WARNINGS ───────────────────────────────');
    warns.forEach(w => console.log(`  🟡 [${w.area}] ${w.message}`));
  }
  console.log('\n─── PASSED ─────────────────────────────────');
  oks.forEach(o => console.log(`  ✅ [${o.area}] ${o.message}`));
}

run().catch(err => { console.error('Test crashed:', err); process.exit(1); });
