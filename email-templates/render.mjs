/**
 * Shared rendering for both inquiry emails.
 *
 * The HTML files in this folder are the source of truth. `generate.mjs` turns
 * them into `templates.generated.mjs`, and this module fills the tokens with
 * escaped values. The Netlify function imports this file; the browser bundle
 * never sees it, so the templates cost nothing on the front end.
 */

import { notificationTemplate, autoReplyTemplate } from './templates.generated.mjs';

const escapeHtml = (value) =>
  String(value ?? '').replace(
    /[&<>"']/g,
    (character) =>
      ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
      })[character] ?? character,
  );

function fill(template, values) {
  return template.replace(/\{\{(\w+)\}\}/g, (match, key) => values[key] ?? match);
}

function formatDate(iso) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return String(iso ?? '');
  return new Intl.DateTimeFormat('en-GB', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

/** Tel links keep the caller's formatting readable but drop stray spaces. */
function telHref(value) {
  return `tel:${String(value).replace(/\s+/g, '')}`;
}

/** WhatsApp expects digits only; a leading 0 is treated as a Ghana local number. */
function whatsappDigits(value) {
  let digits = String(value).replace(/\D/g, '');
  if (digits.startsWith('0')) digits = `233${digits.slice(1)}`;
  return digits;
}

const muted = '<span style="color: #94a3b8;">Not provided</span>';

function link(style, href, label) {
  return `<a href="${escapeHtml(href)}" style="${style}">${escapeHtml(label)}</a>`;
}

const inlineLink =
  'color: #2563eb; font-weight: 600; border-bottom: 1px solid #bfdbfe;';

/** The small "at a glance" values, rendered as links only when provided. */
function contactValue(value, kind) {
  if (!value) return muted;
  if (kind === 'phone') return link(inlineLink, telHref(value), value);
  if (kind === 'whatsapp') {
    const digits = whatsappDigits(value);
    if (!digits) return escapeHtml(value);
    return link(inlineLink, `https://wa.me/${digits}`, value);
  }
  return escapeHtml(value);
}

function button(href, label, variant) {
  const styles = {
    primary: 'background-color: #2563eb; color: #ffffff; border: 1px solid #2563eb;',
    outline: 'background-color: #ffffff; color: #1d4ed8; border: 1px solid #bfdbfe;',
    dark: 'background-color: #0f172a; color: #ffffff; border: 1px solid #0f172a;',
  }[variant];

  return `<td class="button" style="padding-right: 10px; padding-bottom: 10px;">
    <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr><td class="btn" style="border-radius: 999px; ${styles}">
      <a href="${escapeHtml(href)}" style="display: inline-block; padding: 12px 20px; border-radius: 999px; font-family: Inter, 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 13px; font-weight: 600; ${styles}">${escapeHtml(label)}</a>
    </td></tr></table>
  </td>`;
}

function quickActions(inquiry) {
  const subject = encodeURIComponent(`Re: your TechX inquiry`);
  const buttons = [
    button(`mailto:${inquiry.email}?subject=${subject}`, 'Reply by email', 'primary'),
  ];

  if (inquiry.phone) buttons.push(button(telHref(inquiry.phone), 'Call now', 'outline'));

  if (inquiry.whatsapp) {
    const digits = whatsappDigits(inquiry.whatsapp);
    if (digits) buttons.push(button(`https://wa.me/${digits}`, 'Chat on WhatsApp', 'dark'));
  }

  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>${buttons.join('')}</tr></table>`;
}

function channelNote(inquiry) {
  const hasPhone = Boolean(inquiry.phone?.trim());
  const hasWhatsapp = Boolean(inquiry.whatsapp?.trim());

  if (hasWhatsapp && hasPhone) {
    return '<strong style="color: #0f172a;">We have your phone and WhatsApp.</strong> If it helps move things faster, we may call or message you there. Otherwise, we will reply by email.';
  }
  if (hasWhatsapp) {
    return '<strong style="color: #0f172a;">We have your WhatsApp.</strong> If it helps, we may send a short message there. Otherwise, we will reply by email.';
  }
  if (hasPhone) {
    return '<strong style="color: #0f172a;">We have your number.</strong> If it helps, we may give you a quick call. Otherwise, we will reply by email.';
  }
  return '<strong style="color: #0f172a;">Nothing else needed right now.</strong> If you think of something later, just reply to this message and it will reach us.';
}

function values(inquiry) {
  const name = String(inquiry.name ?? '').trim();
  const firstName = name.split(/\s+/)[0] || 'there';
  const company = String(inquiry.company ?? '').trim();
  const message = String(inquiry.message ?? '').trim();

  return {
    name: escapeHtml(name) || 'Not provided',
    firstName: escapeHtml(firstName),
    company: escapeHtml(company) || 'Not provided',
    companyLine: company ? ` at ${escapeHtml(company)}` : '',
    email: escapeHtml(inquiry.email ?? ''),
    phone: escapeHtml(inquiry.phone ?? ''),
    whatsapp: escapeHtml(inquiry.whatsapp ?? ''),
    phoneBlock: contactValue(inquiry.phone, 'phone'),
    whatsappBlock: contactValue(inquiry.whatsapp, 'whatsapp'),
    interests: escapeHtml(inquiry.interests) || 'Not provided',
    stage: escapeHtml(inquiry.stage) || 'Not provided',
    message: escapeHtml(message).replace(/\r?\n/g, '<br />'),
    submittedAt: escapeHtml(inquiry.submittedAt ?? formatDate(new Date().toISOString())),
    source: escapeHtml(inquiry.source ?? 'techx-website'),
    ownerEmail: escapeHtml(process.env.BREVO_SENDER_EMAIL || 'nganbewuborijaamos@gmail.com'),
    quickActions: quickActions(inquiry),
    channelNote: channelNote(inquiry),
  };
}

export function renderNotificationHtml(inquiry) {
  return fill(notificationTemplate, values(inquiry));
}

export function renderAutoReplyHtml(inquiry) {
  return fill(autoReplyTemplate, values(inquiry));
}

export function renderNotificationText(inquiry) {
  return [
    'TechX: new project inquiry',
    '',
    `Name: ${inquiry.name || 'Not provided'}`,
    `Company: ${inquiry.company || 'Not provided'}`,
    `Email: ${inquiry.email}`,
    `Phone: ${inquiry.phone || 'Not provided'}`,
    `WhatsApp: ${inquiry.whatsapp || 'Not provided'}`,
    `Interested in: ${inquiry.interests || 'Not provided'}`,
    `Stage: ${inquiry.stage || 'Not provided'}`,
    '',
    'Message:',
    inquiry.message,
    '',
    `Received: ${inquiry.submittedAt} · Source: ${inquiry.source}`,
  ].join('\n');
}

export function renderAutoReplyText(inquiry) {
  return [
    `Thank you, ${inquiry.name?.trim().split(/\s+/)[0] || 'there'}.`,
    '',
    'Your inquiry has reached TechX. A real person reads every note, and we will reply within one business day.',
    '',
    'What happens next:',
    '1. We read your note and come back with a few useful questions.',
    '2. A short conversation about the problem and the constraints.',
    '3. A proposed scope, approach and clear next step. No obligation.',
    '',
    channelNote(inquiry).replace(/<[^>]+>/g, ''),
    '',
    `Need to add something? Reply to this email or write to ${process.env.BREVO_SENDER_EMAIL || 'nganbewuborijaamos@gmail.com'}.`,
    '',
    'Warm regards,\nAmos · TechX',
  ].join('\n');
}

/** Server-side validation. The browser validates too; never trust either alone. */
export function validateInquiry(inquiry) {
  const text = (key, max) => String(inquiry[key] ?? '').trim().slice(0, max + 1);

  if (inquiry.website) return { bot: true };

  const name = text('name', 120);
  const email = text('email', 254);
  const message = text('message', 10000);

  if (name.length < 2 || name.length > 120) return { error: 'Please provide your name.' };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return { error: 'Please provide a valid email address.' };
  if (message.length < 20 || message.length > 10000) return { error: 'Please tell us a little more about the project.' };
  const phone = text('phone', 60);
  const whatsapp = text('whatsapp', 60);
  if (phone.length > 60) return { error: 'The phone number is too long.' };
  if (whatsapp.length > 60) return { error: 'The WhatsApp number is too long.' };
  if (!phone && !whatsapp) return { error: 'Please provide a phone number or a WhatsApp number.' };

  return { ok: true };
}
