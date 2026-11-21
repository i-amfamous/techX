/**
 * Netlify function: deliver a project inquiry and its acknowledgement.
 *
 * The browser posts the form fields here. We validate again on the server,
 * then send two transactional emails through Brevo's API: a briefing to the
 * studio and a thank-you note to the visitor. Both use the HTML templates in
 * `email-templates/`, and both are sent with "TechX" as the display name.
 *
 * Required Netlify environment variables:
 *   BREVO_API_KEY        Brevo API key (keep secret, never in the client)
 *   BREVO_SENDER_EMAIL   Verified Brevo sender address (defaults to the inbox)
 * Optional:
 *   INQUIRY_TO_EMAIL     Override the studio inbox
 */

import {
  renderNotificationHtml,
  renderAutoReplyHtml,
  renderNotificationText,
  renderAutoReplyText,
  validateInquiry,
} from '../../email-templates/render.mjs';

const BREVO_ENDPOINT = 'https://api.brevo.com/v3/smtp/email';
const OWNER_EMAIL = process.env.INQUIRY_TO_EMAIL || 'nganbewuborijaamos@gmail.com';
const SENDER_EMAIL = process.env.BREVO_SENDER_EMAIL || OWNER_EMAIL;
const FROM_NAME = 'TechX';
const NOTIFICATION_SUBJECT = 'New project inquiry — TechX website';
const ACK_SUBJECT = 'We received your inquiry — TechX';

const json = (status, body) => ({
  statusCode: status,
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
  },
  body: JSON.stringify(body),
});

async function sendEmail({ to, replyTo, subject, html, text }) {
  const response = await fetch(BREVO_ENDPOINT, {
    method: 'POST',
    headers: {
      'api-key': process.env.BREVO_API_KEY,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      sender: { name: FROM_NAME, email: SENDER_EMAIL },
      to: [{ email: to.email, name: to.name }],
      replyTo: { email: replyTo.email, name: replyTo.name },
      subject,
      htmlContent: html,
      textContent: text,
      tags: ['techx-inquiry'],
    }),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => '');
    throw new Error(`Brevo responded ${response.status}: ${detail.slice(0, 200)}`);
  }

  return response.json();
}

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return json(405, { success: false, message: 'Method not allowed.' });
  }

  if (!process.env.BREVO_API_KEY) {
    console.error('BREVO_API_KEY is not configured.');
    return json(500, {
      success: false,
      message: 'The inquiry service is not configured yet.',
    });
  }

  let inquiry;
  try {
    inquiry = JSON.parse(event.body || '{}');
  } catch {
    return json(400, { success: false, message: 'Invalid submission.' });
  }

  const check = validateInquiry(inquiry);
  if (check.bot) {
    // Bots get a quiet success and no email, matching the client honeypot.
    return json(200, { success: true, acknowledged: false });
  }
  if (check.error) {
    return json(400, { success: false, message: check.error });
  }

  const submittedAt = inquiry.submittedAt || new Date().toISOString();
  const payload = {
    ...inquiry,
    submittedAt,
    source: inquiry.source || 'techx-website',
  };

  // Two independent sends: a problem with the acknowledgement must not hide
  // the fact that the studio briefing was delivered, and vice versa is logged.
  const [notification, acknowledgement] = await Promise.allSettled([
    sendEmail({
      to: { email: OWNER_EMAIL, name: FROM_NAME },
      replyTo: { email: payload.email, name: payload.name },
      subject: NOTIFICATION_SUBJECT,
      html: renderNotificationHtml(payload),
      text: renderNotificationText(payload),
    }),
    sendEmail({
      to: { email: payload.email, name: payload.name },
      replyTo: { email: OWNER_EMAIL, name: FROM_NAME },
      subject: ACK_SUBJECT,
      html: renderAutoReplyHtml(payload),
      text: renderAutoReplyText(payload),
    }),
  ]);

  if (notification.status === 'rejected') {
    console.error('Inquiry notification failed:', notification.reason?.message);
  }
  if (acknowledgement.status === 'rejected') {
    console.error('Inquiry acknowledgement failed:', acknowledgement.reason?.message);
  }

  if (notification.status === 'rejected') {
    return json(502, {
      success: false,
      message: `We could not deliver your inquiry. Please email ${OWNER_EMAIL} directly.`,
    });
  }

  return json(200, {
    success: true,
    acknowledged: acknowledgement.status === 'fulfilled',
  });
};
