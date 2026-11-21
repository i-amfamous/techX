# Inquiry email templates

Two production-ready HTML emails for the TechX website. Both use table layout,
inline styles, a 600px container, a mobile breakpoint and the site's blue
accent, so they render in Gmail, Outlook and Apple Mail without external CSS or
web fonts. Both are sent with **TechX** as the display name.

| File | Sent to | Purpose |
| --- | --- | --- |
| `inquiry-notification.html` | `nganbewuborijaamos@gmail.com` | Branded briefing: sender details, phone/WhatsApp links, message and one-click Reply / Call / Chat buttons |
| `inquiry-autoreply.html` | The person who inquired | Thank-you note confirming receipt and explaining what happens next |

## How they are used

The Netlify function in `../netlify/functions/inquiry.mjs` imports
`render.mjs`, which fills these templates with escaped values and sends both
emails through Brevo's transactional API. The browser never sees the templates.

`templates.generated.mjs` is a generated copy of the two HTML files as JS
strings, because Node functions cannot use Vite's `?raw` imports. After editing
an HTML file, run:

```bash
npm run email:templates
```

Then commit the HTML file and the generated file together.

## Placeholders

Tokens use `{{name}}` syntax. The last four are complete HTML snippets built by
`render.mjs`, so optional links and buttons vanish cleanly when a visitor leaves
a field blank.

| Token | Value |
| --- | --- |
| `{{name}}` | Full name |
| `{{firstName}}` | First name, or "there" |
| `{{company}}` / `{{companyLine}}` | Company text, and ` at Company` for the preheader |
| `{{email}}` | Reply address |
| `{{phone}}` / `{{whatsapp}}` | Raw numbers (plain text) |
| `{{phoneBlock}}` / `{{whatsappBlock}}` | Clickable `tel:` / `wa.me` links, or "Not provided" |
| `{{interests}}` | Comma-separated services |
| `{{stage}}` | Where the visitor is in their process |
| `{{message}}` | The message, with line breaks as `<br />` |
| `{{submittedAt}}` / `{{source}}` | Formatted timestamp and form source |
| `{{ownerEmail}}` | Studio contact address (`BREVO_SENDER_EMAIL`) |
| `{{quickActions}}` | Reply / Call / WhatsApp buttons |
| `{{channelNote}}` | Sentence explaining how the studio may use the numbers shared |

`render.mjs` also builds plain-text alternatives for email clients that strip
HTML. Phone numbers are linked with `tel:`; WhatsApp links use `https://wa.me/`
with a leading `0` converted to Ghana's `233` country code.

## Setup

See `../README.md` → "Inquiry emails". In short: create a free Brevo account,
verify `nganbewuborijaamos@gmail.com` as a sender, create an API key, and set
`BREVO_API_KEY` and `BREVO_SENDER_EMAIL` in Netlify's environment variables.

## Editing

Keep changes email-safe: inline `style` attributes, tables for layout, no SVG,
no JavaScript, no CSS variables, and no `@import`. Test in Gmail web, Apple
Mail and at least one Outlook version before replacing the live templates.
