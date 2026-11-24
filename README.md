# TechX website

The TechX studio site: a responsive multi-page website built with React,
TypeScript and hand-written CSS. No UI kit, no utility framework, no routing
dependency, and no build magic beyond Vite. The goal was a small, readable
codebase that a studio can hand to any competent front-end developer without a
tour.

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

Node 18 or newer is assumed. The pages themselves are static, but inquiry
delivery uses a Netlify Function, so deploy to Netlify (see `netlify.toml`) to
get the contact form working. Other static hosts will serve the site without
email.

## Pages

`src/App.tsx` maps URLs to pages. `src/lib/router.tsx` is a small history router:
internal links use `Link`, the active nav item follows the current URL, and
`netlify.toml` serves the built app for direct visits to any page.

| URL | Page | Main component |
| --- | --- | --- |
| `/` | Home | `Hero` with a real project image, `Ticker`, `Highlights`, page map |
| `/services` | Services | Unique hero, then the `Services` accordion |
| `/solutions` | Solutions | Unique hero, then `Solutions` scenarios |
| `/work` | Work | Unique hero, then the `Work` project gallery |
| `/process` | Process | Unique hero, then `Process` phases |
| `/studio` | Studio | Unique hero, then `Studio` principles |
| `/reviews` | Reviews | Unique hero, then `Reviews` cards |
| `/faq` | FAQ | Unique hero, then the `Faq` accordion |
| `/contact` | Contact | Unique hero, then the `Contact` inquiry form |
| anything else | 404 | `NotFound` |

Each section has its own component, most have a matching CSS file. Shared
tokens, resets, type and button styles live in `src/styles/base.css`. Page
chrome (breadcrumb, tailored hero, and redesigned closing CTA) lives in
`src/pages/PageUi.tsx`. The homepage hero image is `/work/famous-techx.jpg`;
swap it in `src/components/Hero.tsx` when a better project shot is available.

## Editing content

Almost every string lives in `src/data/site.ts`. That file is the content
boundary: a copywriter or studio owner should be able to work there without
touching JSX.

The copy follows a problem first pattern: name the friction the client feels,
show what TechX builds to remove it, then state what the client can do
afterwards. Keep that order when editing headlines, service copy and CTAs.
Page specific headlines and closing invitations live in `src/pages/Pages.tsx`
and `src/pages/Home.tsx`.

- `site` holds the hero copy, CTAs, the form endpoint, and owner contact
  details.
- `services`, `solutions`, `projects`, `processSteps`, `principles`, `reviews`
  and `faqs` are plain arrays. Order in the array is order on the page.
- Project screenshots live in `public/work/`. Retake one when the live site
  changes, using the same 900px-wide crop so the cards stay aligned.
- `navLinks` drives both the desktop and mobile navigation. Keep `href` values
  in sync with the URLs in `src/App.tsx`.

Component-level copy (headings, small labels, button text inside a section) sits
in that section's `.tsx` file. This was a deliberate split: structured content in
data, layout-specific wording next to the layout.

## The form, and why it does not fake success

`Contact.tsx` validates the inquiry in the browser and POSTs it to the Netlify
function at `/.netlify/functions/inquiry`. The function validates again, then
sends two emails through Brevo's transactional API: a briefing to the studio
inbox and a branded acknowledgement to the visitor. Both show **TechX** as the
sender name.

Alongside the email address, the form requires **at least one** of a phone
number or a WhatsApp number, so the studio can call or message when that is
quicker than email. Visitors choose which one to share; both are validated
client- and server-side.

- **Primary path:** function + Brevo. The URL lives in `site.email.endpoint`.
  The function needs `BREVO_API_KEY` as a Netlify environment variable; without
  it the request fails visibly instead of silently dropping an inquiry.
- **Brevo hosted form:** the older path still works when `site.brevo.formAction`
  is filled, using the attribute names in `site.brevo.fields` (which now include
  `phone` and `whatsapp`). It does not send an acknowledgement by itself.
- **JSON endpoint:** `site.formEndpoint` is used only when neither of the above
  is configured. Requests abort after 15 seconds.
- **Nothing configured:** honest demo mode with a copyable preview.
- A hidden `website` field is a honeypot. Both client and server quietly accept
  it without sending any email.
- Errors are announced through `role="alert"` and focus moves to the first
  invalid field. On success, focus moves to the result card so keyboard and
  screen-reader users are not stranded.

Brevo forms with reCAPTCHA need that widget on the page; a plain form post will
be rejected. Prefer a Brevo form without reCAPTCHA, or add the widget before
connecting the action URL.

## Inquiry emails

Two branded HTML templates live in `email-templates/`. Both are table-based
with inline styles, a 600px container, a mobile breakpoint and the same blue
accent as the site, so they render consistently in Gmail, Outlook and Apple
Mail without external CSS or web fonts.

- `inquiry-notification.html`: the briefing for
  `nganbewuborijaamos@gmail.com`. It shows the sender's name, company, email,
  **phone and WhatsApp**, interests, stage and message, with one-click **Reply**,
  **Call** and **WhatsApp** buttons when those details were provided.
- `inquiry-autoreply.html`: the thank-you note for the visitor. It confirms
  receipt, promises a reply within one business day, sets out the three next
  steps and says how the studio may use the contact numbers they shared.

`email-templates/render.mjs` fills and escapes every value before sending. After
editing an HTML file, run `npm run email:templates` to regenerate
`templates.generated.mjs` and commit both files together.

Tokens: `name`, `firstName`, `company`, `companyLine`, `email`, `phone`,
`whatsapp`, `phoneBlock`, `whatsappBlock`, `interests`, `stage`, `message`
(line breaks become `<br />`), `submittedAt`, `source`, `ownerEmail`,
`quickActions` and `channelNote`. The last four are pre-rendered HTML snippets
so links and buttons disappear cleanly when a number is not provided.

To connect delivery:

1. Create a free Brevo account at <https://www.brevo.com>. Verify the sender
   address (`nganbewuborijaamos@gmail.com`) under **Senders &amp; domains**, then
   create an API key with transactional email sending rights.
2. In Netlify, go to **Site configuration → Environment variables** and add
   **only** `BREVO_API_KEY`, marked as a secret. The other two variables are
   optional: `BREVO_SENDER_EMAIL` and `INQUIRY_TO_EMAIL` already default to the
   studio inbox in the function. Do not flag them as secrets. That address is
   printed publicly on the site, so Netlify's secret scanner will find its
   value in the build output and fail the deploy. If you do set them, create
   them as ordinary variables without the "Contains secret values" flag.
3. Deploy with `netlify.toml`: build command `npm run build`, publish `dist`,
   functions directory `netlify/functions`. Redeploy after changing variables.
4. Submit a test inquiry from a phone. The studio inbox should receive the
   briefing and the sender should receive the acknowledgement; check spam too.

Netlify Functions are required. A static-only host (Netlify Drop, S3, nginx)
will serve the page but cannot send the emails, and the form will show an error
rather than pretend to succeed.

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
- **Favicon:** the orange X on the ink tile, in `public/` as an SVG, a 32px PNG,
  a 180px Apple touch icon, and a multi-size `.ico` for clients that still ask
  for `/favicon.ico`.

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

## Content and honesty

Content is real and attributable:

- `site.owner` holds the studio's public email, working location and GitHub
  profile. Update it in `src/data/site.ts` if those details change.
- Work cards link to live projects and use screenshots captured from those
  sites. The homepage hero uses the Famous TechX screenshot inside a browser
  style preview, labelled as a live project rather than a concept.
- Reviews are published with client permission. Do not add quotes, names or
  ratings without approval.
- No metrics, awards, pricing or delivery timelines are claimed.

If a fact is not available, leave the field empty or remove the block rather
than inventing it. The UI falls back to a visible marker only as a safety net.

## Deployment

1. Import the GitHub repo into Netlify. `netlify.toml` sets the build command
   (`npm run build`), publish directory (`dist`) and functions directory
   (`netlify/functions`).
2. Add the Brevo environment variables in Netlify before the first live test.
3. Deploy. There are no client-side routes, so a fallback rewrite is optional.
4. Set the canonical URL and absolute social image URL in `index.html` if the
   site moves to a real domain.
5. Replace `public/og-image.png` (1200x630) when the studio message changes.

## Launch checklist

1. Confirm the contact details in `site.owner` are current.
2. Set the Brevo environment variables, deploy, then send a test inquiry from a
   phone. Confirm both the briefing and the acknowledgement arrive.
3. Confirm each live project link still works, and refresh its screenshot.
4. Confirm every review has client permission; remove any that do not.
5. Review `index.html` metadata and the structured data block.
6. Run `npm run build`.
7. Tab through the page, open both accordions, open and close the mobile menu,
   submit the form empty, then submit it filled.
8. Check the page at 360px, 768px, 1024px and 1440px wide.
