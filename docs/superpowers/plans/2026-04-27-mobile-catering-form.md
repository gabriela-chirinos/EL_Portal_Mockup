# Mobile Catering Form Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a 6-step mobile wizard catering form (≤768px) with branded intro header, phone field on both breakpoints, and email/phone validation everywhere, without touching the desktop layout.

**Architecture:** All new markup lives in `FindTruck.astro`; wizard CSS appended to `global.css`. The existing `#catering-form` is hidden at ≤768px and replaced by `#catering-wizard`. Vanilla TS in the Astro `<script>` block handles all wizard state and submission.

**Tech Stack:** Astro 6, vanilla TypeScript (inline `<script>`), CSS custom properties, Formspree (existing endpoint)

---

## File Map

| File | Change |
|------|--------|
| `src/components/FindTruck.astro` | Add phone field + error spans to desktop form; add `#catering-mobile-intro` header; add `#catering-wizard` markup; replace `<script>` block with complete new TS |
| `src/styles/global.css` | Append wizard + intro styles; add 768px breakpoint hiding desktop/showing mobile |

---

### Task 1: Add phone field to desktop form

**Files:**
- Modify: `src/components/FindTruck.astro`

- [ ] **Step 1: Read the current desktop form markup**

Open `src/components/FindTruck.astro` and locate the `<form id="catering-form">` block. Find the email field row (`.ft-field` div containing `<input type="email" name="email">`).

- [ ] **Step 2: Add phone field and error spans after the email row**

In the form, after the email `.ft-field` div, insert:

```html
<div class="ft-field">
  <input type="tel" name="phone" id="ft-phone" placeholder="(360) 555-0100" autocomplete="tel" />
  <span class="ft-err" id="ft-phone-err" aria-live="polite"></span>
</div>
```

Also add an error span beneath the existing email input (if not already present):

```html
<span class="ft-err" id="ft-email-err" aria-live="polite"></span>
```

- [ ] **Step 3: Add error span CSS to global.css**

In `src/styles/global.css`, after the existing `.ft-field` rules, add:

```css
.ft-err {
  display: block;
  font-size: 13px;
  color: var(--red, #c0392b);
  margin-top: 4px;
  min-height: 18px;
}
```

- [ ] **Step 4: Verify desktop form renders phone field**

Run `npm run dev` and open `http://localhost:4321` in a browser. Scroll to the Find the Truck / Catering section. Confirm a phone number input appears below the email field on desktop (>768px). No layout breakage.

- [ ] **Step 5: Commit**

```bash
git add src/components/FindTruck.astro src/styles/global.css
git commit -m "feat: add phone field to desktop catering form"
```

---

### Task 2: Add mobile intro header markup

**Files:**
- Modify: `src/components/FindTruck.astro`

- [ ] **Step 1: Insert intro header div above `#catering-wizard` placeholder**

Inside `FindTruck.astro`, immediately before the closing `</section>` tag (or after the desktop form), insert:

```html
<!-- Mobile intro header — visible ≤768px only -->
<div id="catering-mobile-intro" aria-hidden="false">
  <div class="cmi-inner">
    <div class="cmi-overline">Weddings · Corporate · Birthdays</div>
    <h3 class="cmi-title">BRING EL PORTAL<br>TO YOUR EVENT.</h3>
    <p class="cmi-sub">Full experience, straight from our kitchen to your celebration.</p>
    <button class="cmi-cta" id="cmi-start" type="button">GET STARTED →</button>
  </div>
</div>
```

- [ ] **Step 2: Add intro CSS to global.css**

Append to `src/styles/global.css`:

```css
/* ── Mobile catering intro header ── */
#catering-mobile-intro {
  display: none;
}
@media (max-width: 768px) {
  #catering-mobile-intro {
    display: block;
    background: radial-gradient(ellipse at 60% 40%, #2a4a2a 0%, #0d1f0f 70%);
    padding: 40px 24px 32px;
  }
  .cmi-overline {
    font-size: 10px;
    letter-spacing: 0.22em;
    color: var(--yellow);
    text-transform: uppercase;
    margin-bottom: 10px;
  }
  .cmi-title {
    font-family: var(--ff-disp);
    font-size: 36px;
    color: var(--cream);
    line-height: 0.95;
    margin: 0 0 12px;
    letter-spacing: 0.03em;
  }
  .cmi-sub {
    font-size: 14px;
    color: rgba(255,255,255,0.5);
    line-height: 1.5;
    margin-bottom: 24px;
  }
  .cmi-cta {
    width: 100%;
    background: var(--yellow);
    color: var(--dark);
    border: none;
    font-family: var(--ff-disp);
    font-size: 18px;
    letter-spacing: 0.1em;
    padding: 16px;
    cursor: pointer;
    font-weight: 700;
  }
}
```

- [ ] **Step 3: Verify intro renders on mobile**

In DevTools, set viewport to 375px wide. Confirm the dark branded intro header with yellow "GET STARTED →" button appears. Confirm it does not appear on desktop.

- [ ] **Step 4: Commit**

```bash
git add src/components/FindTruck.astro src/styles/global.css
git commit -m "feat: add mobile catering intro header"
```

---

### Task 3: Add wizard HTML markup

**Files:**
- Modify: `src/components/FindTruck.astro`

- [ ] **Step 1: Insert wizard container after the intro header div**

After `#catering-mobile-intro`, insert the full wizard HTML:

```html
<!-- Mobile catering wizard — visible ≤768px only -->
<div id="catering-wizard" role="form" aria-label="Catering inquiry" style="display:none">

  <!-- Progress dots -->
  <div class="cw-progress" id="cw-progress">
    <span class="cw-dot" aria-label="Step 1 of 6"></span>
    <span class="cw-dot" aria-label="Step 2 of 6"></span>
    <span class="cw-dot" aria-label="Step 3 of 6"></span>
    <span class="cw-dot" aria-label="Step 4 of 6"></span>
    <span class="cw-dot" aria-label="Step 5 of 6"></span>
    <span class="cw-dot" aria-label="Step 6 of 6"></span>
  </div>

  <!-- Step 1: Name -->
  <div class="cw-step" id="cw-step-1">
    <button class="cw-exit" id="cw-exit-1" type="button" aria-label="Exit form">×</button>
    <div class="cw-overline">Step 1 of 6</div>
    <h2 class="cw-question">What's your name?</h2>
    <input class="cw-input" type="text" id="cw-name" name="name" placeholder="Full name" autocomplete="name" />
    <span class="cw-err" id="cw-name-err" aria-live="polite" aria-describedby="cw-name"></span>
    <div class="cw-nav">
      <span></span>
      <button class="cw-continue" id="cw-next-1" type="button">Continue</button>
    </div>
  </div>

  <!-- Step 2: Email -->
  <div class="cw-step" id="cw-step-2" style="display:none">
    <button class="cw-exit" id="cw-exit-2" type="button" aria-label="Exit form">×</button>
    <div class="cw-overline">Step 2 of 6</div>
    <h2 class="cw-question">Your email address?</h2>
    <input class="cw-input" type="email" id="cw-email" name="email" placeholder="you@email.com" autocomplete="email" />
    <span class="cw-err" id="cw-email-err" aria-live="polite" aria-describedby="cw-email"></span>
    <div class="cw-nav">
      <button class="cw-back" id="cw-back-2" type="button">← Back</button>
      <button class="cw-continue" id="cw-next-2" type="button">Continue</button>
    </div>
  </div>

  <!-- Step 3: Phone -->
  <div class="cw-step" id="cw-step-3" style="display:none">
    <button class="cw-exit" id="cw-exit-3" type="button" aria-label="Exit form">×</button>
    <div class="cw-overline">Step 3 of 6</div>
    <h2 class="cw-question">Best number to reach you?</h2>
    <input class="cw-input" type="tel" id="cw-phone" name="phone" placeholder="(360) 555-0100" autocomplete="tel" />
    <span class="cw-err" id="cw-phone-err" aria-live="polite" aria-describedby="cw-phone"></span>
    <div class="cw-nav">
      <button class="cw-back" id="cw-back-3" type="button">← Back</button>
      <button class="cw-continue" id="cw-next-3" type="button">Continue</button>
    </div>
  </div>

  <!-- Step 4: Event date (optional) -->
  <div class="cw-step" id="cw-step-4" style="display:none">
    <button class="cw-exit" id="cw-exit-4" type="button" aria-label="Exit form">×</button>
    <div class="cw-overline">Step 4 of 6 · Optional</div>
    <h2 class="cw-question">When is your event?</h2>
    <input class="cw-input" type="date" id="cw-date" name="event_date" />
    <span class="cw-err" id="cw-date-err" aria-live="polite" aria-describedby="cw-date"></span>
    <div class="cw-nav">
      <button class="cw-back" id="cw-back-4" type="button">← Back</button>
      <button class="cw-continue" id="cw-next-4" type="button">Continue</button>
    </div>
    <button class="cw-skip" id="cw-skip-4" type="button">Skip this step →</button>
  </div>

  <!-- Step 5: Guest count (optional) -->
  <div class="cw-step" id="cw-step-5" style="display:none">
    <button class="cw-exit" id="cw-exit-5" type="button" aria-label="Exit form">×</button>
    <div class="cw-overline">Step 5 of 6 · Optional</div>
    <h2 class="cw-question">How many guests?</h2>
    <input class="cw-input" type="number" id="cw-guests" name="guest_count" placeholder="Est. guests" min="10" />
    <span class="cw-err" id="cw-guests-err" aria-live="polite" aria-describedby="cw-guests"></span>
    <div class="cw-nav">
      <button class="cw-back" id="cw-back-5" type="button">← Back</button>
      <button class="cw-continue" id="cw-next-5" type="button">Continue</button>
    </div>
    <button class="cw-skip" id="cw-skip-5" type="button">Skip this step →</button>
  </div>

  <!-- Step 6: Details (optional) -->
  <div class="cw-step" id="cw-step-6" style="display:none">
    <button class="cw-exit" id="cw-exit-6" type="button" aria-label="Exit form">×</button>
    <div class="cw-overline">Step 6 of 6 · Optional</div>
    <h2 class="cw-question">Tell us about your event</h2>
    <textarea class="cw-input" id="cw-details" name="details" placeholder="Location, type of event, any special requests..." rows="4"></textarea>
    <span class="cw-err" id="cw-details-err" aria-live="polite"></span>
    <div class="cw-nav">
      <button class="cw-back" id="cw-back-6" type="button">← Back</button>
      <button class="cw-continue" id="cw-next-6" type="button">Continue</button>
    </div>
    <button class="cw-skip" id="cw-skip-6" type="button">Skip this step →</button>
  </div>

  <!-- Review screen -->
  <div class="cw-step" id="cw-step-review" style="display:none">
    <button class="cw-exit" id="cw-exit-review" type="button" aria-label="Exit form">×</button>
    <div class="cw-overline">Almost there</div>
    <h2 class="cw-question">Review Your Inquiry</h2>
    <div class="cw-review-body" id="cw-review-body"></div>
    <p class="cw-review-note" id="cw-review-note"></p>
    <div class="cw-nav cw-nav--review">
      <button class="cw-back" id="cw-back-review" type="button">← Back</button>
      <button class="cw-submit" id="cw-submit" type="button">Send Inquiry</button>
    </div>
    <p class="cw-err" id="cw-submit-err" aria-live="polite"></p>
  </div>

  <!-- Success screen -->
  <div class="cw-step cw-success" id="cw-step-success" style="display:none">
    <div class="cw-success-icon">✓</div>
    <h2 class="cw-success-title">INQUIRY SENT!</h2>
    <p class="cw-success-body">We'll be in touch within 24 hours.<br>Questions? Call us at<br><strong>(360) 960-8405</strong></p>
  </div>

</div>
```

- [ ] **Step 2: Verify HTML structure in browser**

Temporarily add `style="display:block"` to `#catering-wizard` in the HTML and view at 375px. All 8 step divs should be present (only step 1 shows if `display:none` on steps 2+). Remove the temporary inline style.

- [ ] **Step 3: Commit**

```bash
git add src/components/FindTruck.astro
git commit -m "feat: add mobile catering wizard HTML markup"
```

---

### Task 4: Add wizard CSS

**Files:**
- Modify: `src/styles/global.css`

- [ ] **Step 1: Append wizard CSS**

Append to `src/styles/global.css`:

```css
/* ── Mobile catering wizard ── */
#catering-wizard {
  display: none;
}

@media (max-width: 768px) {
  /* Hide desktop form, show mobile wizard + intro */
  #catering-form {
    display: none !important;
  }
  #catering-wizard {
    display: block;
    background: var(--cream);
    padding: 0 0 40px;
  }

  /* Progress dots */
  .cw-progress {
    display: flex;
    gap: 8px;
    justify-content: center;
    padding: 20px 24px 0;
  }
  .cw-dot {
    width: 28px;
    height: 6px;
    border-radius: 3px;
    background: #ddd;
    transition: background 0.2s;
  }
  .cw-dot.done   { background: var(--dark); }
  .cw-dot.active { background: var(--yellow); }

  /* Step card */
  .cw-step {
    position: relative;
    padding: 28px 24px 24px;
  }
  .cw-overline {
    font-size: 10px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: #999;
    margin-bottom: 8px;
  }
  .cw-question {
    font-family: var(--ff-disp);
    font-size: 26px;
    font-weight: 700;
    color: var(--dark);
    margin: 0 0 20px;
    line-height: 1.1;
  }

  /* Inputs */
  .cw-input {
    width: 100%;
    box-sizing: border-box;
    background: #fff;
    border: 2px solid var(--dark);
    border-radius: 4px;
    font-size: 17px;
    padding: 13px 14px;
    outline: none;
    min-width: 0;
    font-family: var(--ff-body);
  }
  .cw-input:focus {
    border-color: var(--yellow);
  }
  .cw-input.cw-input--error {
    border-color: var(--red, #c0392b);
  }
  textarea.cw-input {
    resize: vertical;
    min-height: 100px;
  }

  /* Error message */
  .cw-err {
    display: block;
    font-size: 13px;
    color: var(--red, #c0392b);
    margin-top: 6px;
    min-height: 18px;
  }

  /* Navigation row */
  .cw-nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 20px;
  }
  .cw-nav--review {
    flex-direction: column;
    gap: 12px;
  }
  .cw-back {
    background: none;
    border: none;
    font-size: 15px;
    color: var(--dark);
    cursor: pointer;
    padding: 0;
    text-decoration: underline;
    text-underline-offset: 2px;
  }
  .cw-continue {
    background: var(--dark);
    color: var(--cream);
    border: none;
    font-size: 15px;
    font-weight: 700;
    letter-spacing: 0.06em;
    padding: 13px 28px;
    cursor: pointer;
    border-radius: 2px;
  }
  .cw-skip {
    display: block;
    width: 100%;
    background: none;
    border: none;
    text-align: center;
    margin-top: 14px;
    font-size: 14px;
    color: #777;
    cursor: pointer;
    text-decoration: underline;
    text-underline-offset: 2px;
  }
  .cw-submit {
    width: 100%;
    background: var(--yellow);
    color: var(--dark);
    border: none;
    font-family: var(--ff-disp);
    font-size: 20px;
    letter-spacing: 0.08em;
    font-weight: 700;
    padding: 16px;
    cursor: pointer;
  }

  /* Exit button */
  .cw-exit {
    position: absolute;
    top: 14px;
    right: 16px;
    width: 28px;
    height: 28px;
    background: none;
    border: none;
    font-size: 22px;
    color: var(--mid, #666);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    line-height: 1;
  }

  /* Review screen */
  .cw-review-body {
    display: flex;
    flex-direction: column;
    gap: 2px;
    margin-bottom: 12px;
  }
  .cw-review-row {
    display: grid;
    grid-template-columns: 80px 1fr auto;
    align-items: start;
    gap: 8px;
    padding: 10px 0;
    border-bottom: 1px solid #e8e2d8;
  }
  .cw-review-field {
    font-size: 12px;
    color: #999;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    padding-top: 2px;
  }
  .cw-review-val {
    font-size: 15px;
    color: var(--dark);
    word-break: break-word;
  }
  .cw-review-edit {
    background: none;
    border: none;
    font-size: 13px;
    color: var(--dark);
    text-decoration: underline;
    text-underline-offset: 2px;
    cursor: pointer;
    padding: 0;
    white-space: nowrap;
  }
  .cw-review-note {
    font-size: 13px;
    color: #777;
    margin-bottom: 0;
  }

  /* Success screen */
  .cw-success {
    text-align: center;
    padding: 48px 24px;
    background: var(--dark);
  }
  .cw-success-icon {
    font-size: 40px;
    color: var(--yellow);
    margin-bottom: 16px;
  }
  .cw-success-title {
    font-family: var(--ff-disp);
    font-size: 32px;
    color: var(--cream);
    margin: 0 0 16px;
  }
  .cw-success-body {
    font-size: 16px;
    color: rgba(255,255,255,0.75);
    line-height: 1.6;
  }
}
```

- [ ] **Step 2: Verify styles at 375px**

In DevTools at 375px: wizard card should show cream background, dark headings, white input fields with dark borders, yellow "GET STARTED →" button on the intro. Progress dots row should appear at top of wizard.

- [ ] **Step 3: Commit**

```bash
git add src/styles/global.css
git commit -m "feat: add mobile wizard CSS"
```

---

### Task 5: Replace script block with full wizard JS

**Files:**
- Modify: `src/components/FindTruck.astro`

- [ ] **Step 1: Read the current `<script>` block in FindTruck.astro**

Locate the existing `<script>` tag at the bottom of `FindTruck.astro`. It currently handles desktop form submission only.

- [ ] **Step 2: Replace the entire `<script>` block with the following**

```typescript
<script>
// ── Shared helpers ──────────────────────────────────────────────────────────
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^\(\d{3}\) \d{3}-\d{4}$/;

function formatPhone(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 10);
  if (digits.length < 4)  return digits;
  if (digits.length < 7)  return `(${digits.slice(0,3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0,3)}) ${digits.slice(3,6)}-${digits.slice(6)}`;
}

function minDate48h(): string {
  return new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString().split('T')[0];
}

// ── Desktop form ─────────────────────────────────────────────────────────────
const desktopForm = document.getElementById('catering-form') as HTMLFormElement | null;
const desktopSuccess = document.getElementById('ft-success');

// Phone auto-format on desktop
const deskPhoneInput = document.getElementById('ft-phone') as HTMLInputElement | null;
deskPhoneInput?.addEventListener('input', () => {
  const pos = deskPhoneInput.selectionStart ?? 0;
  const prev = deskPhoneInput.value;
  deskPhoneInput.value = formatPhone(prev);
  // keep caret near where user typed
  const diff = deskPhoneInput.value.length - prev.length;
  deskPhoneInput.setSelectionRange(pos + diff, pos + diff);
});

desktopForm?.addEventListener('submit', async (e) => {
  e.preventDefault();

  // Validate email
  const emailEl  = desktopForm.querySelector<HTMLInputElement>('[name="email"]');
  const emailErr = document.getElementById('ft-email-err');
  const emailVal = emailEl?.value.trim() ?? '';
  if (!EMAIL_RE.test(emailVal)) {
    if (emailErr) emailErr.textContent = 'Please enter a valid email (e.g. you@email.com)';
    emailEl?.classList.add('ft-input--error');
    emailEl?.focus();
    return;
  }
  if (emailErr) emailErr.textContent = '';
  emailEl?.classList.remove('ft-input--error');

  // Validate phone
  const phoneEl  = desktopForm.querySelector<HTMLInputElement>('[name="phone"]');
  const phoneErr = document.getElementById('ft-phone-err');
  const phoneVal = phoneEl?.value.trim() ?? '';
  if (phoneVal && !PHONE_RE.test(phoneVal)) {
    if (phoneErr) phoneErr.textContent = 'Please enter a 10-digit US phone number';
    phoneEl?.classList.add('ft-input--error');
    phoneEl?.focus();
    return;
  }
  if (phoneErr) phoneErr.textContent = '';
  phoneEl?.classList.remove('ft-input--error');

  // Guard placeholder endpoint
  if (!desktopForm.action || desktopForm.action.includes('YOUR_FORM_ID') || desktopForm.dataset.pending === 'true') {
    if (desktopSuccess) {
      desktopSuccess.textContent = 'Online inquiries coming soon! Call us at (360) 960-8405';
      desktopSuccess.style.display = 'block';
    }
    return;
  }

  const data = new FormData(desktopForm);
  const res = await fetch(desktopForm.action, { method: 'POST', body: data, headers: { Accept: 'application/json' } });
  if (res.ok) {
    if (desktopSuccess) desktopSuccess.style.display = 'block';
    desktopForm.querySelectorAll<HTMLInputElement | HTMLTextAreaElement | HTMLButtonElement>('input, textarea, button[type=submit]')
      .forEach(el => { el.disabled = true; });
  } else {
    if (desktopSuccess) {
      desktopSuccess.textContent = 'Something went wrong. Please call us at (360) 960-8405.';
      desktopSuccess.style.display = 'block';
    }
  }
});

// ── Mobile wizard ─────────────────────────────────────────────────────────────
const intro   = document.getElementById('catering-mobile-intro');
const wizard  = document.getElementById('catering-wizard');
const cmiStart = document.getElementById('cmi-start');

type WizardState = {
  name: string; email: string; phone: string;
  event_date: string; guest_count: string; details: string;
};

let state: WizardState = { name: '', email: '', phone: '', event_date: '', guest_count: '', details: '' };
let currentStep = '1';

const STEPS = ['1','2','3','4','5','6','review','success'];

// Set date min on step 4
const dateInput = document.getElementById('cw-date') as HTMLInputElement | null;
if (dateInput) dateInput.min = minDate48h();

// Phone auto-format in wizard
const wizPhoneInput = document.getElementById('cw-phone') as HTMLInputElement | null;
wizPhoneInput?.addEventListener('input', () => {
  const pos = wizPhoneInput.selectionStart ?? 0;
  const prev = wizPhoneInput.value;
  wizPhoneInput.value = formatPhone(prev);
  const diff = wizPhoneInput.value.length - prev.length;
  wizPhoneInput.setSelectionRange(pos + diff, pos + diff);
});

function showIntro(): void {
  if (intro)  { intro.style.display  = ''; }
  if (wizard) { wizard.style.display = 'none'; }
}

function showWizard(): void {
  if (intro)  { intro.style.display  = 'none'; }
  if (wizard) { wizard.style.display = 'block'; }
}

function goToStep(step: string): void {
  STEPS.forEach(s => {
    const el = document.getElementById(`cw-step-${s}`);
    if (el) el.style.display = s === step ? '' : 'none';
  });
  currentStep = step;
  updateDots(step);

  // autofocus first input
  const stepEl = document.getElementById(`cw-step-${step}`);
  const firstInput = stepEl?.querySelector<HTMLElement>('input, textarea');
  firstInput?.focus();
}

function updateDots(step: string): void {
  const dots = document.querySelectorAll<HTMLElement>('.cw-dot');
  const idx = parseInt(step, 10) - 1; // NaN for 'review'/'success' → all done
  dots.forEach((dot, i) => {
    dot.classList.remove('done', 'active');
    if (isNaN(idx) || i < idx) dot.classList.add('done');
    else if (i === idx)        dot.classList.add('active');
  });
}

function setErr(id: string, msg: string): void {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = msg;
}

function clearErr(id: string): void { setErr(id, ''); }

function setInputError(inputId: string, hasError: boolean): void {
  const el = document.getElementById(inputId);
  if (!el) return;
  if (hasError) el.classList.add('cw-input--error');
  else          el.classList.remove('cw-input--error');
}

function buildReview(): void {
  const body = document.getElementById('cw-review-body');
  if (!body) return;
  body.textContent = '';

  const dateDisplay = state.event_date
    ? new Date(state.event_date + 'T12:00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : '—';

  const rows: { label: string; value: string; step: string }[] = [
    { label: 'Name',    value: state.name        || '—', step: '1' },
    { label: 'Email',   value: state.email       || '—', step: '2' },
    { label: 'Phone',   value: state.phone       || '—', step: '3' },
    { label: 'Date',    value: dateDisplay,               step: '4' },
    { label: 'Guests',  value: state.guest_count ? `${state.guest_count} guests` : '—', step: '5' },
    { label: 'Details', value: state.details     || '—', step: '6' },
  ];

  rows.forEach(r => {
    const row   = document.createElement('div');
    row.className = 'cw-review-row';

    const field = document.createElement('span');
    field.className = 'cw-review-field';
    field.textContent = r.label;

    const val = document.createElement('span');
    val.className = 'cw-review-val';
    val.textContent = r.value;

    const btn = document.createElement('button');
    btn.className = 'cw-review-edit';
    btn.type = 'button';
    btn.textContent = 'Edit';
    const targetStep = r.step;
    btn.addEventListener('click', () => goToStep(targetStep));

    row.appendChild(field);
    row.appendChild(val);
    row.appendChild(btn);
    body.appendChild(row);
  });

  const note = document.getElementById('cw-review-note');
  if (note) note.textContent = `We'll reply within 24 hrs at ${state.email}`;
}

function resetWizard(): void {
  state = { name: '', email: '', phone: '', event_date: '', guest_count: '', details: '' };
  const inputs: { id: string; errId: string }[] = [
    { id: 'cw-name',    errId: 'cw-name-err'    },
    { id: 'cw-email',   errId: 'cw-email-err'   },
    { id: 'cw-phone',   errId: 'cw-phone-err'   },
    { id: 'cw-date',    errId: 'cw-date-err'    },
    { id: 'cw-guests',  errId: 'cw-guests-err'  },
    { id: 'cw-details', errId: 'cw-details-err' },
  ];
  inputs.forEach(({ id, errId }) => {
    const el = document.getElementById(id) as HTMLInputElement | null;
    if (el) el.value = '';
    clearErr(errId);
    setInputError(id, false);
  });
  clearErr('cw-submit-err');
  // Reset date min
  if (dateInput) dateInput.min = minDate48h();
}

// ── Exit buttons ──────────────────────────────────────────────────────────────
['1','2','3','4','5','6','review'].forEach(step => {
  const btn = document.getElementById(`cw-exit-${step}`);
  btn?.addEventListener('click', () => {
    resetWizard();
    goToStep('1');
    showIntro();
  });
});

// ── Start button ──────────────────────────────────────────────────────────────
cmiStart?.addEventListener('click', () => {
  showWizard();
  goToStep('1');
});

// ── Step 1: Name ──────────────────────────────────────────────────────────────
document.getElementById('cw-next-1')?.addEventListener('click', () => {
  const el = document.getElementById('cw-name') as HTMLInputElement | null;
  const val = el?.value.trim() ?? '';
  if (!val) {
    setErr('cw-name-err', 'Please enter your name');
    setInputError('cw-name', true);
    el?.focus();
    return;
  }
  clearErr('cw-name-err');
  setInputError('cw-name', false);
  state.name = val;
  goToStep('2');
});

// ── Step 2: Email ─────────────────────────────────────────────────────────────
document.getElementById('cw-next-2')?.addEventListener('click', () => {
  const el = document.getElementById('cw-email') as HTMLInputElement | null;
  const val = el?.value.trim() ?? '';
  if (!EMAIL_RE.test(val)) {
    setErr('cw-email-err', 'Please enter a valid email (e.g. you@email.com)');
    setInputError('cw-email', true);
    el?.focus();
    return;
  }
  clearErr('cw-email-err');
  setInputError('cw-email', false);
  state.email = val;
  goToStep('3');
});

document.getElementById('cw-back-2')?.addEventListener('click', () => goToStep('1'));

// ── Step 3: Phone ─────────────────────────────────────────────────────────────
document.getElementById('cw-next-3')?.addEventListener('click', () => {
  const el = document.getElementById('cw-phone') as HTMLInputElement | null;
  const val = el?.value.trim() ?? '';
  if (!PHONE_RE.test(val)) {
    setErr('cw-phone-err', 'Please enter a 10-digit US phone number');
    setInputError('cw-phone', true);
    el?.focus();
    return;
  }
  clearErr('cw-phone-err');
  setInputError('cw-phone', false);
  state.phone = val;
  goToStep('4');
});

document.getElementById('cw-back-3')?.addEventListener('click', () => goToStep('2'));

// ── Step 4: Event date (optional) ─────────────────────────────────────────────
document.getElementById('cw-next-4')?.addEventListener('click', () => {
  const el = document.getElementById('cw-date') as HTMLInputElement | null;
  const val = el?.value ?? '';
  if (val) {
    const min = minDate48h();
    if (val < min) {
      setErr('cw-date-err', 'Please choose a date at least 48 hours from now');
      setInputError('cw-date', true);
      el?.focus();
      return;
    }
  }
  clearErr('cw-date-err');
  setInputError('cw-date', false);
  state.event_date = val;
  goToStep('5');
});

document.getElementById('cw-skip-4')?.addEventListener('click', () => {
  state.event_date = '';
  goToStep('5');
});

document.getElementById('cw-back-4')?.addEventListener('click', () => goToStep('3'));

// ── Step 5: Guest count (optional) ────────────────────────────────────────────
document.getElementById('cw-next-5')?.addEventListener('click', () => {
  const el = document.getElementById('cw-guests') as HTMLInputElement | null;
  const val = el?.value.trim() ?? '';
  if (val && parseInt(val, 10) < 10) {
    setErr('cw-guests-err', 'Minimum guest count is 10');
    setInputError('cw-guests', true);
    el?.focus();
    return;
  }
  clearErr('cw-guests-err');
  setInputError('cw-guests', false);
  state.guest_count = val;
  goToStep('6');
});

document.getElementById('cw-skip-5')?.addEventListener('click', () => {
  state.guest_count = '';
  goToStep('6');
});

document.getElementById('cw-back-5')?.addEventListener('click', () => goToStep('4'));

// ── Step 6: Details (optional) ────────────────────────────────────────────────
document.getElementById('cw-next-6')?.addEventListener('click', () => {
  const el = document.getElementById('cw-details') as HTMLTextAreaElement | null;
  state.details = el?.value.trim() ?? '';
  buildReview();
  goToStep('review');
});

document.getElementById('cw-skip-6')?.addEventListener('click', () => {
  state.details = '';
  buildReview();
  goToStep('review');
});

document.getElementById('cw-back-6')?.addEventListener('click', () => goToStep('5'));

// ── Review / back ─────────────────────────────────────────────────────────────
document.getElementById('cw-back-review')?.addEventListener('click', () => goToStep('6'));

// ── Submit ────────────────────────────────────────────────────────────────────
document.getElementById('cw-submit')?.addEventListener('click', async () => {
  clearErr('cw-submit-err');
  const submitBtn = document.getElementById('cw-submit') as HTMLButtonElement | null;

  // Derive endpoint from desktop form (same Formspree action)
  const action = (document.getElementById('catering-form') as HTMLFormElement | null)?.action ?? '';
  if (!action || action.includes('YOUR_FORM_ID') || (document.getElementById('catering-form') as HTMLFormElement | null)?.dataset.pending === 'true') {
    goToStep('success');
    return;
  }

  if (submitBtn) submitBtn.disabled = true;

  const data = new FormData();
  data.append('name',        state.name);
  data.append('email',       state.email);
  data.append('phone',       state.phone);
  if (state.event_date)  data.append('event_date',  state.event_date);
  if (state.guest_count) data.append('guest_count', state.guest_count);
  if (state.details)     data.append('details',     state.details);

  try {
    const res = await fetch(action, { method: 'POST', body: data, headers: { Accept: 'application/json' } });
    if (res.ok) {
      goToStep('success');
    } else {
      setErr('cw-submit-err', 'Something went wrong. Please call us at (360) 960-8405.');
      if (submitBtn) submitBtn.disabled = false;
    }
  } catch {
    setErr('cw-submit-err', 'Something went wrong. Please call us at (360) 960-8405.');
    if (submitBtn) submitBtn.disabled = false;
  }
});
</script>
```

- [ ] **Step 3: Verify TS compiles with no errors**

Run:
```bash
npx astro check
```
Expected: 0 errors, 0 warnings related to FindTruck.astro.

- [ ] **Step 4: Commit**

```bash
git add src/components/FindTruck.astro
git commit -m "feat: add mobile wizard JS — validation, state, submit"
```

---

### Task 6: End-to-end verification

**Files:** None modified — this is a verification-only task.

- [ ] **Step 1: Verify mobile wizard happy path**

Open `http://localhost:4321` at 375px. Steps to verify:
1. Intro header shows "BRING EL PORTAL TO YOUR EVENT." with "GET STARTED →" button.
2. Tap "GET STARTED →" — intro disappears, wizard step 1 appears.
3. Step 1: leave name blank, tap Continue → error "Please enter your name" appears.
4. Enter "Jane Smith", tap Continue → step 2 appears, progress dot 1 goes dark.
5. Step 2: enter "notanemail", tap Continue → error shown. Enter "jane@example.com", Continue.
6. Step 3: enter "1234567", Continue → error. Slowly type "3605550100" → auto-formats to "(360) 555-0100", Continue.
7. Step 4: tap Continue without a date (optional) — proceeds to step 5.
8. Step 5: enter "5" → error "Minimum guest count is 10". Enter "50", Continue.
9. Step 6: tap "Skip this step →" → Review screen shows all values with Edit links.
10. Review: tap Edit on "Email" → jumps to step 2, change email, Continue back through to Review.
11. Tap "Send Inquiry" → success screen shows "INQUIRY SENT!" (endpoint is placeholder, success shown immediately).

- [ ] **Step 2: Verify × exit button**

1. Start the wizard, fill in name, reach step 2.
2. Tap × in top-right corner.
3. Wizard disappears, intro header reappears.
4. Tap "GET STARTED →" again — step 1 is blank (state was reset).

- [ ] **Step 3: Verify desktop form (>768px)**

1. Switch DevTools to 1200px.
2. Desktop form should be visible; wizard + intro hidden.
3. Submit without email → "Please enter a valid email" error appears inline.
4. Submit with bad phone format → "Please enter a 10-digit US phone number" error appears.
5. Valid submission shows phone fallback message (Formspree placeholder still in place).

- [ ] **Step 4: Verify no horizontal scroll at 375px**

Open DevTools Console and run:
```javascript
console.log('scroll:', document.body.scrollWidth, 'viewport:', window.innerWidth);
```
Expected: `scroll: 375 viewport: 375` (or equal values).

- [ ] **Step 5: Final commit**

```bash
git add -A
git commit -m "feat: mobile catering wizard — complete implementation"
```
