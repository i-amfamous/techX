/**
 * Inquiry payload for the Netlify function.
 *
 * All rendering and sending happens server-side in `netlify/functions/inquiry.mjs`
 * using the templates in `email-templates/`. The browser only builds a plain
 * JSON body, so no email markup or credentials ship with the site.
 */

import { site } from '../data/site';

export interface Inquiry {
  name: string;
  company: string;
  email: string;
  /** Direct phone number, so the studio can call. */
  phone: string;
  /** WhatsApp number, kept separate because people often use a different one. */
  whatsapp: string;
  /** Comma-separated service labels, e.g. "Web application, Mobile app". */
  interests: string;
  stage: string;
  message: string;
  submittedAt: string;
  source: string;
}

/** Relative function URL is always available once deployed on Netlify. */
export const emailServiceConfigured = Boolean(site.email.endpoint);

/** Payload accepted by `netlify/functions/inquiry.mjs`. */
export function buildEmailServicePayload(inquiry: Inquiry): Record<string, string> {
  return {
    name: inquiry.name,
    company: inquiry.company,
    email: inquiry.email,
    phone: inquiry.phone,
    whatsapp: inquiry.whatsapp,
    interests: inquiry.interests,
    stage: inquiry.stage,
    message: inquiry.message,
    submittedAt: inquiry.submittedAt,
    source: inquiry.source,
  };
}
