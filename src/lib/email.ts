/**
 * Inquiry email rendering and delivery payloads.
 *
 * The two HTML files in `email-templates/` are the single source of truth for
 * the notification the studio receives and the auto-reply the visitor gets.
 * Vite imports them as raw strings with `?raw`; `fill()` swaps the `{{tokens}}`
 * for escaped, user-supplied values. Nothing in here talks to the network —
 * `Contact.tsx` owns the request, just as it owns the Brevo and JSON paths.
 */

import notificationTemplate from '../../email-templates/inquiry-notification.html?raw';
import autoReplyTemplate from '../../email-templates/inquiry-autoreply.html?raw';
import { site } from '../data/site';

export interface Inquiry {
  name: string;
  company: string;
  email: string;
  /** Comma-separated service labels, e.g. "Web application, Mobile app". */
  interests: string;
  stage: string;
  message: string;
  submittedAt: string;
  source: string;
}

/** A placeholder access key means the owner has not connected the service yet. */
export const emailServiceConfigured = Boolean(
  site.email.endpoint &&
    site.email.accessKey &&
    !/^YOUR_|^PASTE_/i.test(site.email.accessKey.trim()),
);

const escapeHtml = (value: string): string =>
  value.replace(
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

function fill(template: string, values: Record<string, string>): string {
  return template.replace(/\{\{(\w+)\}\}/g, (match, key: string) => values[key] ?? match);
}

function formatDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat('en-GB', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

/** Values shared by both templates and the plain-text fallback. */
function commonValues(inquiry: Inquiry): Record<string, string> {
  const trimmedName = inquiry.name.trim();
  const firstName = trimmedName.split(/\s+/)[0] || 'there';

  return {
    name: escapeHtml(trimmedName) || 'Not provided',
    firstName: escapeHtml(firstName),
    company: escapeHtml(inquiry.company.trim()) || 'Not provided',
    companyLine: inquiry.company.trim() ? ` at ${escapeHtml(inquiry.company.trim())}` : '',
    email: escapeHtml(inquiry.email.trim()),
    interests: escapeHtml(inquiry.interests) || 'Not provided',
    stage: escapeHtml(inquiry.stage) || 'Not provided',
    message: escapeHtml(inquiry.message.trim()).replace(/\r?\n/g, '<br />'),
    submittedAt: escapeHtml(formatDate(inquiry.submittedAt)),
    source: escapeHtml(inquiry.source),
    ownerEmail: escapeHtml(site.owner.email ?? ''),
  };
}

/** The email that lands in the studio inbox. */
export function renderNotificationHtml(inquiry: Inquiry): string {
  return fill(notificationTemplate, commonValues(inquiry));
}

/**
 * The thank-you email sent to the visitor.
 *
 * Most form-to-email services send auto-responses from their own settings,
 * where this HTML is pasted once. It is rendered here as well so the exact same
 * template can be used by a custom endpoint or a local preview without drift.
 */
export function renderAutoReplyHtml(inquiry: Inquiry): string {
  return fill(autoReplyTemplate, commonValues(inquiry));
}

/** Plain-text fallback for services that ignore the `html` field. */
export function renderNotificationText(inquiry: Inquiry): string {
  return [
    'TechX — new project inquiry',
    '',
    `Name: ${inquiry.name.trim() || 'Not provided'}`,
    `Company: ${inquiry.company.trim() || 'Not provided'}`,
    `Email: ${inquiry.email.trim()}`,
    `Interested in: ${inquiry.interests || 'Not provided'}`,
    `Stage: ${inquiry.stage || 'Not provided'}`,
    '',
    'Message:',
    inquiry.message.trim(),
    '',
    `Received: ${formatDate(inquiry.submittedAt)} · Source: ${inquiry.source}`,
  ].join('\n');
}

/**
 * Web3Forms-compatible JSON payload.
 *
 * Web3Forms forwards unknown fields as plain text, so we deliberately do not
 * send `html` or `to` here: doing so would paste raw markup into the inbox and
 * it cannot change the recipient. The recipient is set on the access key in
 * the Web3Forms dashboard; `email` and `replyto` set the reply address. The
 * branded templates are used by the service's notification / auto-responder
 * settings, which is where custom HTML belongs on a no-backend site.
 */
export function buildEmailServicePayload(inquiry: Inquiry): Record<string, string> {
  return {
    access_key: site.email.accessKey.trim(),
    email: inquiry.email.trim(),
    replyto: inquiry.email.trim(),
    subject: site.email.notificationSubject,
    name: inquiry.name.trim(),
    company: inquiry.company.trim(),
    interests: inquiry.interests,
    stage: inquiry.stage,
    message: inquiry.message.trim(),
    submitted_at: inquiry.submittedAt,
    source: inquiry.source,
  };
}
