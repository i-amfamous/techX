# TechX website

The TechX studio site: a single responsive page built with React, TypeScript and
hand-written CSS. No UI kit, no utility framework, no build magic beyond Vite.
The goal was a small, readable codebase that a studio can hand to any competent
front-end developer without a tour.

## Quick start

```bash
npm install
npm run dev        # http://localhost:5173
```

Other scripts:

```bash
npm run typecheck  # tsc, no emit
npm run build      # typecheck, then production bundle in dist/
npm run preview    # serve dist/ locally
```

Node 18 or newer is assumed. Everything is client-side, so `dist/` can be
deployed to any static host (Netlify, Vercel, Cloudflare Pages, S3, nginx).

## What is on the page

Sections render in this order, all from `src/App.tsx`:

| Section | Component | Notes |
| --- | --- | --- |
| Hero | `Hero` | Statement, CTAs, and a decorative concept collage |
| Capability ticker | `Ticker` | Infinite CSS marquee, pauses on hover |
| Services | `Services` | Accordion, one panel open at a time |
| Solutions | `Solutions` | Four illustrative use cases |
| Concept work | `Work` | Dark gallery of self-initiated studies |
| Reviews | `Reviews` | Approved-quote slots, empty until real reviews exist |
| Process | `Process` | Sticky intro beside five numbered phases |
| Studio | `Studio` | Principles and a "how we work" panel |
| FAQ | `Faq` | Accordion, first answer open |
| Contact | `Contact` | Validated inquiry form, demo mode by default |
| Footer | `Footer` | Navigation, statement, back to top |

Each section has its own component, most have a matching CSS file. Shared
tokens, resets, type and button styles live in `src/styles/base.css`.

## Editing content

Almost every string lives in `src/data/site.ts`. That file is the content
boundary: a copywriter or studio owner should be able to work there without
touching JSX.

- `site` holds the hero copy, CTAs, the form endpoint, and owner contact
  details.
- `services`, `solutions`, `concepts`, `processSteps`, `principles`, `reviews`
  and `faqs` are plain arrays. Order in the array is order on the page.
- `navLinks` drives both the desktop navigation and the scroll spy. Keep `href`
  values in sync with section ids.

Component-level copy (headings, small labels, button text inside a section) sits
in that section's `.tsx` file. This was a deliberate split: structured content in
data, layout-specific wording next to the layout.

## The form, and why it does not fake success

`Contact.tsx` posts JSON to `site.formEndpoint`.

- **Empty endpoint (current state):** the form validates, then shows a preview of
  the inquiry with a copy button. It explicitly says nothing was sent. This is a
  demo, not a dead form pretending to work.
- **Configured endpoint:** the component sends `POST` with `Accept:
  application/json` and the fields `name`, `company`, `email`, `interests`,
  `stage`, `message`, `submittedAt`, `source`. Requests abort after 15 seconds.
- A hidden `website` field is a honeypot. Bots that fill it get a success screen
  and no network request.
- Errors are announced through `role="alert"` and focus moves to the first
  invalid field. On success, focus moves to the result card so keyboard and
  screen-reader users are not stranded.

To connect a form service, paste its endpoint into `formEndpoint` in
`src/data/site.ts`. Check that the provider accepts JSON, and configure spam and
consent handling on their side.

## Accessibility

The site targets WCAG 2.2 AA in the areas that matter for a marketing page:

- Skip link to `#main`, visible on focus.
- The mobile menu uses `inert` to remove the rest of the page from the tab order,
  closes on Escape and on navigation, and returns focus to the toggle.
- Accordions use real buttons with `aria-expanded` and `aria-controls`; hidden
  panels use the `hidden` attribute, so their content leaves the tab order.
- Form fields have labels, `aria-invalid`, `aria-describedby`, and visible focus
  rings. The result region is a polite live region.
- Decorative mock UI is `aria-hidden`; it is never announced as content.
- `prefers-reduced-motion` disables reveals, marquee movement and transitions.
- Colour tokens were chosen for text contrast, not just looks. If you change
  `--body`, `--muted` or `--accent-ink`, check contrast again.

## Design system

- **Type:** Inter, one family for everything, loaded in `index.html`.
  Display sizes use tight tracking; body copy stays at comfortable measure.
- **Colour:** warm off-white page, near-black ink, a single orange accent, cream
  and sage support surfaces. Solid fills only, no gradients.
- **Shape:** pill buttons, 18 to 28px card radii, 1px hairlines.
- **Motion:** a short rise and fade on reveal, small hover lifts, accordion
  fades. Motion is decoration; the content is always readable without it.
- **Icons:** `lucide-react`. The TechX X mark is inline SVG in `Wordmark.tsx` so
  it inherits `currentColor`.

### Conventions worth knowing

- Most sections have one component and one CSS file. Shared primitives
  (wordmark, buttons, placeholders) live in `base.css`. Class names are
  section-prefixed (`service__title`, `concept__body`) to avoid collisions
  without CSS modules.
- Reveal animation is CSS-first: `useReveal` adds `is-revealed` to a section and
  CSS handles the rest. `revealDelay(index, step)` produces a CSS custom
  property, not inline animation code.
- Breakpoints repeat across files because the layout genuinely differs per
  section. The one breakpoint shared between JS and CSS is 980px, where the
  desktop nav hands over to the mobile menu. If you change it, update
  `Header.css`, `Header.tsx` and the nav media queries together.
- `src/main.tsx` imports `base.css` before `App`. That order is load-bearing:
  component CSS must be able to override shared defaults.

## Placeholders and honesty

This site is intentionally not a fiction. Until the studio supplies facts:

- `site.owner.email`, `location` and `social` are `null` or empty, and the page
  shows visible bracketed placeholders.
- Concept work is labelled self-initiated, not client work.
- Reviews are empty guidance slots. Do not invent quotes, names, ratings or
  logos. Publish only with client permission.
- No metrics, awards, pricing or delivery timelines are claimed.

Grep for `Placeholder`, `placeholder` and `[` before launch. The bracketed
markers are deliberate unfinished-work signals, not styling mistakes.

## Deployment

1. `npm run build`.
2. Upload `dist/`.
3. Serve `index.html` for the root path. There are no client-side routes, so a
   fallback rewrite is optional.
4. Set the canonical URL and absolute social image URL in `index.html` if the
   site moves to a real domain.
5. Replace `public/og-image.png` (1200x630) when the studio message changes.

## Launch checklist

1. Add real contact details to `site.owner`.
2. Connect `site.formEndpoint` and send a test inquiry from a phone.
3. Replace concept studies with approved case studies, or keep the labels.
4. Add approved reviews, or remove the section and its nav link.
5. Review `index.html` metadata and the structured data block.
6. Run `npm run build`.
7. Tab through the page, open both accordions, open and close the mobile menu,
   submit the form empty, then submit it filled.
8. Check the page at 360px, 768px, 1024px and 1440px wide.
