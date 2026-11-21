# Inquiry email templates

Two production-ready HTML emails for the TechX website. Both use table layout,
inline styles, a 600px container, a mobile breakpoint, and the site's blue
accent, so they render without external CSS or web fonts.

| File | Sent to | Purpose |
| --- | --- | --- |
| `inquiry-notification.html` | `nganbewuborijaamos@gmail.com` | New inquiry with the sender's details and a one-click reply button |
| `inquiry-autoreply.html` | The person who inquired | Thank-you note that confirms receipt and explains the next steps |

## Placeholders

Both files use `{{token}}` tokens. `src/lib/email.ts` fills them with
HTML-escaped values for any custom endpoint that accepts HTML. When pasting a
template into an email service, keep the token names that service expects, or
leave them as-is if it uses the same syntax.

| Token | Value |
| --- | --- |
| `{{name}}` | Full name |
| `{{firstName}}` | First name, or "there" |
| `{{company}}` | Company, or "Not provided" |
| `{{companyLine}}` | ` at Company` for the preheader, or empty |
| `{{email}}` | Reply address |
| `{{interests}}` | Comma-separated services |
| `{{stage}}` | Where the visitor is in their process |
| `{{message}}` | The message, with line breaks as `<br />` |
| `{{submittedAt}}` | Formatted date and time |
| `{{source}}` | Form source, e.g. `techx-website` |
| `{{ownerEmail}}` | Studio contact address from `site.owner.email` |

## Connecting them

1. Set the form service's recipient to `nganbewuborijaamos@gmail.com` and add
   its access key to `site.email.accessKey` in `../src/data/site.ts`.
2. The form sends clean named fields to the service. Paste
   `inquiry-notification.html` into the service's notification settings, or
   into a Brevo automation, to replace its default email with the branded one.
3. Paste `inquiry-autoreply.html` into the service's auto-responder settings
   with the subject `We received your inquiry — TechX`. Web3Forms includes
   auto-responders on Pro; Brevo's free tier has automations that send HTML.
4. Send a test inquiry and check both the inbox and spam folder.

If you use Brevo, paste the auto-reply HTML into an automation triggered by the
form submission instead.

## Editing

Keep changes email-safe: inline `style` attributes, tables for layout, no SVG,
no JavaScript, no CSS variables, and no `@import`. Test in Gmail web, Apple
Mail and at least one Outlook version before replacing the live templates.
