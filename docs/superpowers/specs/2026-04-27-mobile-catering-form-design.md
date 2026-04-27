# Mobile Catering Form — Design Spec
**Date:** 2026-04-27
**Status:** Approved

---

## Overview

Add a multi-step wizard form for catering inquiries on mobile and tablet (≤ 768 px). The existing desktop form in `FindTruck.astro` is **not changed**. Both forms submit to the same Formspree endpoint. Email and phone validation applies on both breakpoints.

---

## Scope

| In scope | Out of scope |
|----------|--------------|
| Multi-step wizard on ≤ 768 px | Desktop form layout changes |
| Section intro header on mobile | Formspree account setup |
| Phone field (new, both breakpoints) | Online ordering system |
| Email + phone validation on both breakpoints | Admin dashboard |
| 48-hour minimum on event date | |

---

## Visual Style

**Wizard style:** Option B — clean light card.
- Background: `var(--cream)` (`#f5f0e8`)
- Progress: row of 6 segmented dots at the top (done = `var(--dark)`, active = `var(--yellow)`, pending = `#ddd`)
- Step overline: 10px uppercase, `color: #999`
- Question heading: 26 px bold, `color: var(--dark)`
- Input: white background, 2 px `var(--dark)` border, 17 px font, 4 px border-radius
- Error state: red border + inline message below input
- Back: ghost text link (← Back)
- Continue: dark filled button, right-aligned
- Final Submit: full-width yellow button

**Section intro header:** Option A — full-bleed dark branded header.
- Background: dark green radial gradient matching El Portal palette
- Overline: "Weddings · Corporate · Birthdays" in yellow
- Title: "BRING EL PORTAL TO YOUR EVENT." in Bebas Neue
- Subtitle: short line in `rgba(255,255,255,0.5)`
- CTA button: full-width yellow, text **"GET STARTED →"** — tapping scrolls/reveals the wizard step 1

---

## Steps

| Step | Label | Field | Type | Required | Validation |
|------|-------|-------|------|----------|------------|
| 1 | "What's your name?" | `name` | text | Yes | Non-empty |
| 2 | "Your email address?" | `email` | email | Yes | RFC email regex — must contain `@` and valid domain |
| 3 | "Best number to reach you?" | `phone` | tel | Yes | US format `(XXX) XXX-XXXX` — 10 digits, auto-formats as user types |
| 4 | "When is your event?" | `event_date` | date | No | Min = today + 48 hours; future date only |
| 5 | "How many guests?" | `guest_count` | number | No | Min 10 if provided |
| 6 | "Tell us about your event" | `details` | textarea | No | None |
| Review | "Review Your Inquiry" | — | — | — | Shows all entered values with Edit links per row |

Optional steps (4, 5, 6) show "· Optional" appended to the overline. Navigation: "← Back" on the left as usual; a "Skip this step →" text link appears below the input as a secondary action. "Continue" remains the primary right-hand button.

---

## Validation Rules

### Email (step 2, also applied on desktop form)
- Pattern: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
- Error message: "Please enter a valid email (e.g. you@email.com)"
- Validated on Continue press, not on blur

### Phone (step 3, new field on desktop form too)
- Auto-formats as user types: strips non-digits, applies `(XXX) XXX-XXXX` mask
- Accepts exactly 10 digits
- Pattern validation: `/^\(\d{3}\) \d{3}-\d{4}$/`
- Error message: "Please enter a 10-digit US phone number"
- Validated on Continue press

### Event Date (step 4)
- `min` attribute set dynamically: `new Date(Date.now() + 48*60*60*1000).toISOString().split('T')[0]` — produces a `YYYY-MM-DD` string
- If user enters a date before the min: "Please choose a date at least 48 hours from now"

---

## Component Architecture

All new markup lives inside `FindTruck.astro`. No new files.

### Desktop (> 768 px)
- Existing `#catering-form` with all fields shown simultaneously
- Add phone `<input type="tel">` field between email and event date rows
- Add email + phone validation to the existing submit handler

### Mobile (≤ 768 px)
- The existing `#catering-form` is **hidden** via CSS (`display: none`)
- A new `<div id="catering-wizard">` is shown instead
- The wizard is pure HTML/CSS/vanilla JS — no framework, no dependencies
- State is held in a plain JS object `wizardState = { name, email, phone, event_date, guest_count, details }`
- On the Review screen, "Edit" links jump back to the relevant step
- On Submit, the wizard assembles a `FormData` object and `fetch`-POSTs to the same Formspree endpoint as the desktop form

### Section intro header
- A new `<div id="catering-mobile-intro">` renders above `#catering-wizard`, visible only on ≤ 768 px
- "GET STARTED →" button sets `intro.style.display = 'none'` and scrolls to / reveals the wizard

### Exit button
- Every wizard step (steps 1–6 and the Review screen) shows an **× close button** in the top-right corner of the step card
- Tapping × resets `wizardState` to empty, hides the wizard, and shows the intro header again — returning the user to the "GET STARTED →" state with no data loss warning needed (the form has not been submitted)
- The × is not shown on the success screen (nothing to exit at that point)
- Styled: 28 × 28 px tap target, `×` character, `color: var(--mid)`, positioned `absolute top: 14px right: 16px` within the step card

---

## CSS Breakpoints

```
> 768 px  →  desktop form visible, wizard + intro hidden
≤ 768 px  →  wizard + intro visible, desktop form hidden
```

Breakpoint chosen at 768 px (covers all phones and most tablets in portrait).

---

## Success & Error States

**Success (both breakpoints):**
- Wizard: replace wizard container with dark green confirmation card showing "INQUIRY SENT!", 24 hr reply note, and phone number `(360) 960-8405`
- Desktop: existing inline success message (already coded)

**Network error:**
- Show inline message below Submit: "Something went wrong. Please call us at (360) 960-8405."

---

## Accessibility

- Each step's `<input>` receives `autofocus` when the step becomes visible
- Progress dots have `aria-label="Step X of 6"`
- Wizard container has `role="form"` and `aria-label="Catering inquiry"`
- Error messages are linked via `aria-describedby`

---

## Files Changed

| File | Change |
|------|--------|
| `src/components/FindTruck.astro` | Add phone field to desktop form; add mobile intro header + wizard markup + JS |
| `src/styles/global.css` | Add wizard styles + breakpoint rules hiding desktop/mobile forms at 768 px |
