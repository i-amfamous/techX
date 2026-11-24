import { useEffect, useRef, useState, type FormEvent } from 'react';
import { site, type ServiceId } from '../data/site';
import {
  buildEmailServicePayload,
  emailServiceConfigured,
  type Inquiry,
} from '../lib/email';
import { revealDelay, useReveal } from '../lib/useReveal';
import { ArrowUpRight, Check, ChevronDown, CircleAlert, Copy } from 'lucide-react';
import './Contact.css';

/**
 * Project inquiry form.
 *
 * The component is deliberately self-contained: validation, request, demo mode
 * and clipboard fallback all live here because they share one piece of state
 * (`status`) and one success screen. Extracting them would add indirection
 * without making the flow easier to follow.
 *
 * Four paths matter:
 * - Brevo action configured: native hidden form post, success on iframe load
 * - email service configured: POST named JSON fields, abort after 15s
 * - generic endpoint configured: POST plain JSON, abort after 15s
 * - nothing configured: validate, then show a copyable preview (demo)
 * A filled honeypot always pretends success and sends nothing.
 *
 * Client validation is for fast feedback only. Anything that receives this
 * form must validate again on the server.
 */

interface ContactProps {
  preselect: { service: ServiceId; nonce: number } | null;
}

interface FormValues {
  name: string;
  company: string;
  email: string;
  phone: string;
  whatsapp: string;
  services: string[];
  stage: string;
  message: string;
  website: string;
}

type Errors = Partial<
  Record<'name' | 'email' | 'contact' | 'phone' | 'whatsapp' | 'services' | 'message', string>
>;
type Status = 'idle' | 'submitting' | 'success' | 'demo' | 'error';
type CopyStatus = 'idle' | 'copied' | 'failed';

const initialValues: FormValues = {
  name: '',
  company: '',
  email: '',
  phone: '',
  whatsapp: '',
  services: [],
  stage: '',
  message: '',
  website: '',
};

const serviceOptions = [
  { value: 'web', label: 'Web application' },
  { value: 'mobile', label: 'Mobile app' },
  { value: 'brand', label: 'Brand identity' },
  { value: 'unsure', label: 'Not sure yet' },
];

const stageOptions = [
  'Exploring the idea',
  'Planning and comparing options',
  'Ready to start',
  'Improving an existing product',
];

const fieldFocusIds: Record<keyof Errors, string> = {
  name: 'contact-name',
  email: 'contact-email',
  contact: 'contact-phone',
  phone: 'contact-phone',
  whatsapp: 'contact-whatsapp',
  services: 'contact-service-web',
  message: 'contact-message',
};

/** Loose phone check: enough to catch typos without rejecting country formats. */
function validPhone(value: string): boolean {
  const trimmed = value.trim();
  if (!trimmed) return true;
  if (!/^[+()\d\s-]+$/.test(trimmed)) return false;
  return trimmed.replace(/\D/g, '').length >= 7 && trimmed.length <= 60;
}

function validate(values: FormValues): Errors {
  const errors: Errors = {};

  // Every rule produces one human sentence. Keeping messages adjacent to the
  // rule they enforce makes the copy easy to tune without hunting the JSX.
  if (values.name.trim().length < 2) {
    errors.name = 'Please add your name.';
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email.trim())) {
    errors.email = 'Enter a valid email address so the studio can reply.';
  }

  if (!validPhone(values.phone)) {
    errors.phone = 'Enter a valid phone number, or leave this blank.';
  }

  if (!validPhone(values.whatsapp)) {
    errors.whatsapp = 'Enter a valid WhatsApp number, or leave this blank.';
  }

  // A visitor can give either number, but not neither. The studio needs a
  // way to reach them when email is too slow.
  if (!values.phone.trim() && !values.whatsapp.trim()) {
    errors.contact = 'Please add a phone number or a WhatsApp number so we can reach you.';
  }

  if (values.services.length === 0) {
    errors.services = 'Choose at least one area so we can point your note to the right place.';
  }

  if (values.message.trim().length < 20) {
    errors.message = 'Tell us a little more: a sentence or two, at least 20 characters.';
  }

  return errors;
}

/** One place that turns selected ids into the labels shown in emails. */
function serviceLabels(values: FormValues): string {
  return serviceOptions
    .filter((option) => values.services.includes(option.value))
    .map((option) => option.label)
    .join(', ');
}

function buildSummary(values: FormValues): string {
  const interests = serviceLabels(values);

  return [
    'TechX project inquiry',
    '',
    `Name: ${values.name.trim()}`,
    `Company: ${values.company.trim() || 'Not provided'}`,
    `Email: ${values.email.trim()}`,
    `Phone: ${values.phone.trim() || 'Not provided'}`,
    `WhatsApp: ${values.whatsapp.trim() || 'Not provided'}`,
    `Interested in: ${interests || 'Not provided'}`,
    `Stage: ${values.stage || 'Not provided'}`,
    '',
    'Project:',
    values.message.trim(),
  ].join('\n');
}

/**
 * Submit to a Brevo hosted form.
 *
 * Brevo's public form action is a normal HTML form post, not a JSON API. We
 * build a hidden native form and target a hidden iframe so the visitor stays on
 * this page, and no API key has to sit in the bundle. The iframe load is the
 * only success signal a cross-origin post gives us; a timeout is surfaced as a
 * real failure instead of a fake success.
 */
function submitToBrevo(values: FormValues): Promise<void> {
  return new Promise((resolve, reject) => {
    const interests = serviceLabels(values);

    const fields: Record<string, string> = {
      [site.brevo.fields.email]: values.email.trim(),
      [site.brevo.fields.name]: values.name.trim(),
      [site.brevo.fields.company]: values.company.trim(),
      [site.brevo.fields.phone]: values.phone.trim(),
      [site.brevo.fields.whatsapp]: values.whatsapp.trim(),
      [site.brevo.fields.interests]: interests,
      [site.brevo.fields.stage]: values.stage,
      [site.brevo.fields.message]: values.message.trim(),
    };

    // Brevo includes these in a normal form; sending them keeps its filters happy.
    fields.email_address_check = '';
    fields.locale = 'en';

    const target = `brevo-target-${Date.now()}`;
    const iframe = document.createElement('iframe');
    iframe.name = target;
    iframe.title = 'Brevo form submission';
    iframe.style.display = 'none';
    document.body.appendChild(iframe);

    const form = document.createElement('form');
    form.action = site.brevo.formAction;
    form.method = 'POST';
    form.target = target;
    form.style.display = 'none';

    Object.entries(fields).forEach(([name, value]) => {
      if (!name || !value) return;
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = name;
      input.value = value;
      form.appendChild(input);
    });

    document.body.appendChild(form);

    let settled = false;
    const cleanup = () => {
      form.remove();
      iframe.remove();
    };
    const finish = (callback: () => void) => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timeout);
      cleanup();
      callback();
    };

    const timeout = window.setTimeout(
      () => finish(() => reject(new Error('Brevo did not respond in time.'))),
      15000,
    );

    // Ignore the iframe's initial about:blank load, then treat the next load as
    // the form response.
    let started = false;
    const start = () => {
      if (started) return;
      started = true;
      iframe.onload = () => finish(resolve);
      form.submit();
    };

    iframe.onload = start;
    window.setTimeout(start, 150);
  });
}

export function Contact({ preselect }: ContactProps) {
  const ref = useReveal<HTMLElement>();
  const resultRef = useRef<HTMLDivElement>(null);
  const [values, setValues] = useState<FormValues>(initialValues);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>('idle');
  const [copied, setCopied] = useState<CopyStatus>('idle');
  const [summary, setSummary] = useState('');

  // The hero email field hands its value over through the URL, so the visitor
  // does not have to type it twice on the contact page.
  useEffect(() => {
    const email = new URLSearchParams(window.location.search).get('email');
    if (email) setValues((current) => ({ ...current, email }));
  }, []);

  // Merge a service choice made elsewhere on the page into the inquiry.
  useEffect(() => {
    if (!preselect) return;
    setValues((current) =>
      current.services.includes(preselect.service)
        ? current
        : { ...current, services: [...current.services, preselect.service] },
    );
    setErrors((current) => {
      if (!current.services) return current;
      const next = { ...current };
      delete next.services;
      return next;
    });
    setStatus((current) => (current === 'idle' || current === 'submitting' ? current : 'idle'));
    setCopied('idle');
  }, [preselect]);

  // The form is replaced by the result, so focus would otherwise fall back to
  // the top of the document. Move it to the result and let the live region do
  // the announcing.
  useEffect(() => {
    if (status === 'success' || status === 'demo') {
      resultRef.current?.focus();
    }
  }, [status]);

  const update = (field: keyof FormValues, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => {
      if (!current[field as keyof Errors]) return current;
      const next = { ...current };
      delete next[field as keyof Errors];
      return next;
    });
  };

  const toggleService = (value: string) => {
    setValues((current) => ({
      ...current,
      services: current.services.includes(value)
        ? current.services.filter((item) => item !== value)
        : [...current.services, value],
    }));
    setErrors((current) => {
      if (!current.services) return current;
      const next = { ...current };
      delete next.services;
      return next;
    });
  };

  const reset = () => {
    setValues(initialValues);
    setErrors({});
    setStatus('idle');
    setCopied('idle');
    setSummary('');
    window.setTimeout(() => document.getElementById('contact-name')?.focus(), 50);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === 'submitting') return;

    const nextErrors = validate(values);
    setErrors(nextErrors);

    const firstError = (Object.keys(nextErrors) as (keyof Errors)[])[0];
    if (firstError) {
      document.getElementById(fieldFocusIds[firstError])?.focus();
      return;
    }

    if (values.website) {
      // Honeypot. Real visitors never see this field. Bots that autofill it get
      // the success screen, but nothing leaves the browser.
      setStatus('success');
      return;
    }

    const composed = buildSummary(values);
    setSummary(composed);

    const endpointMissing =
      !site.brevo.formAction && !emailServiceConfigured && !site.formEndpoint;

    if (endpointMissing) {
      // Demo build: stop before any network call and show the inquiry instead.
      // This is the honest default, not an error state.
      setStatus('demo');
      return;
    }

    setStatus('submitting');

    try {
      if (site.brevo.formAction) {
        await submitToBrevo(values);
      } else {
        // A stalled form is worse than a visible failure. Abort so the button
        // never spins forever, and let the catch block offer a retry.
        const controller = new AbortController();
        const timeout = window.setTimeout(() => controller.abort(), 15000);

        const inquiry: Inquiry = {
          name: values.name.trim(),
          company: values.company.trim(),
          email: values.email.trim(),
          phone: values.phone.trim(),
          whatsapp: values.whatsapp.trim(),
          interests: serviceLabels(values),
          stage: values.stage,
          message: values.message.trim(),
          submittedAt: new Date().toISOString(),
          source: 'techx-website',
        };

        // The configured email service takes priority over a generic endpoint.
        const endpoint = emailServiceConfigured ? site.email.endpoint : site.formEndpoint;
        const payload = emailServiceConfigured
          ? buildEmailServicePayload(inquiry)
          : {
              name: inquiry.name,
              company: inquiry.company,
              email: inquiry.email,
              interests: values.services,
              stage: inquiry.stage,
              message: inquiry.message,
              submittedAt: inquiry.submittedAt,
              source: inquiry.source,
            };

        try {
          const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
            },
            body: JSON.stringify(payload),
            signal: controller.signal,
          });

          if (emailServiceConfigured) {
            // Some services answer 200 with `{ success: false }` on a rejected
            // submission, so check both signals before claiming success.
            const result = await response.json().catch(() => null);
            if (!response.ok || result?.success === false) {
              throw new Error('The email service rejected the request.');
            }
          } else if (!response.ok) {
            throw new Error('The form endpoint rejected the request.');
          }
        } finally {
          window.clearTimeout(timeout);
        }
      }

      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  /**
   * Clipboard access can fail on insecure origins, in older browsers, or when
   * the visitor denies permission. The demo screen tells them to select the
   * preview manually instead of failing silently.
   */
  const copySummary = async () => {
    try {
      await navigator.clipboard.writeText(summary);
      setCopied('copied');
    } catch {
      setCopied('failed');
    }
  };

  const resultVisible = status === 'success' || status === 'demo';
  const endpointMissing =
    !site.brevo.formAction && !emailServiceConfigured && !site.formEndpoint;

  return (
    <section className="section contact" id="contact" ref={ref} aria-labelledby="contact-title">
      <div className="container contact__layout">
        <div className="contact__intro">
          <h2 className="section-title reveal" id="contact-title" style={revealDelay(1)}>
            Describe the <em>problem.</em>
          </h2>
          <p className="contact__lede reveal" style={revealDelay(2)}>
            A short note is enough. Tell us what is getting in the way, who it affects, and what a
            good outcome looks like. We will reply with a practical next step.
          </p>

          <div className="contact__next reveal" style={revealDelay(3)}>
            <p className="micro">What happens next</p>
            <ol>
              <li>
                <span>01</span> We read your note and come back with questions.
              </li>
              <li>
                <span>02</span> A short call to understand the problem and the constraints.
              </li>
              <li>
                <span>03</span> A written scope, approach, and a clear next step.
              </li>
            </ol>
          </div>

          <div className="contact__details reveal" style={revealDelay(4)}>
            <div className="contact__details-head">
              <span className="micro">Direct contact</span>
              <span className="micro contact__details-tag">Owner details</span>
            </div>
            <dl>
              <div>
                <dt>Email</dt>
                <dd>
                  {site.owner.email ? (
                    <a className="contact__detail-link" href={`mailto:${site.owner.email}`}>
                      {site.owner.email}
                    </a>
                  ) : (
                    <span>Use the inquiry form and we will reply by email.</span>
                  )}
                </dd>
              </div>
              <div>
                <dt>Location</dt>
                <dd>
                  {site.owner.location ? (
                    site.owner.location
                  ) : (
                    <span>Working remotely</span>
                  )}
                </dd>
              </div>
              <div>
                <dt>Elsewhere</dt>
                <dd>
                  {site.owner.social.length > 0 ? (
                    <span className="contact__social">
                      {site.owner.social.map((item, index) => (
                        <span key={item.url}>
                          {index > 0 && <span aria-hidden="true"> · </span>}
                          <a className="contact__detail-link" href={item.url}>
                            {item.label}
                          </a>
                        </span>
                      ))}
                    </span>
                  ) : (
                    <span>No social profiles listed.</span>
                  )}
                </dd>
              </div>
            </dl>
            <p className="contact__details-note">
              Prefer email? Write directly to Amos and you will get a reply from the person doing
              the work.
            </p>
          </div>
        </div>

        <div className="contact__form-col reveal" style={revealDelay(2)}>
          {resultVisible ? (
            <div
              className="contact-result"
              ref={resultRef}
              tabIndex={-1}
              role="status"
              aria-live="polite"
            >
              <span className="micro contact-result__label">
                {status === 'success' ? 'Inquiry sent' : 'Demo mode: not sent'}
              </span>
              <h3 className="contact-result__title">
                {status === 'success' ? (
                  <>Thank you, {values.name.split(' ')[0] || 'there'}.</>
                ) : (
                  <>Your note is ready, but nothing was sent.</>
                )}
              </h3>

              {status === 'success' ? (
                <p className="contact-result__copy">
                  Your inquiry has reached the studio. We will follow up using the email address you
                  provided.
                </p>
              ) : (
                <>
                  <p className="contact-result__copy">
                    This build has no email service connected, so the inquiry was validated locally
                    instead of being sent. Follow the setup in <code>README.md</code> before launch,
                    or copy the message below and send it through your own channel.
                  </p>
                  <pre className="contact-result__preview" aria-label="Inquiry preview">
                    {summary}
                  </pre>
                  {copied !== 'idle' && (
                    <p className="contact-result__feedback" role="status">
                      {copied === 'copied'
                        ? 'Copied to the clipboard.'
                        : 'Copying was blocked by the browser. Select the preview text and copy it manually.'}
                    </p>
                  )}
                </>
              )}

              <div className="contact-result__actions">
                {status === 'demo' && (
                  <button type="button" className="btn btn--ink" onClick={copySummary}>
                    {copied === 'copied' ? 'Copied' : 'Copy inquiry'}
                    {copied === 'copied' ? (
                      <Check className="btn__icon" size={16} strokeWidth={2.2} aria-hidden="true" />
                    ) : (
                      <Copy className="btn__icon" size={16} strokeWidth={2} aria-hidden="true" />
                    )}
                  </button>
                )}
                <button
                  type="button"
                  className={status === 'demo' ? 'btn btn--outline' : 'btn btn--ink'}
                  onClick={reset}
                >
                  {status === 'demo' ? 'Back to the form' : 'Send another inquiry'}
                </button>
              </div>
            </div>
          ) : (
            <form className="contact-form" onSubmit={handleSubmit} noValidate aria-busy={status === 'submitting'}>
              <div className="contact-form__head">
                <h3 className="contact-form__title">Project inquiry</h3>
                <span className="micro">No obligation</span>
              </div>

              {endpointMissing && (
                <p className="contact-form__demo-note">
                  <CircleAlert size={16} strokeWidth={2} aria-hidden="true" />
                  <span>
                    Demo build: no email service is connected. Submissions are validated but not
                    sent.
                  </span>
                </p>
              )}

              <div className="contact-form__grid">
                <div className="field">
                  <label htmlFor="contact-name">
                    Your name <span className="field__req" aria-hidden="true">*</span>
                  </label>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    value={values.name}
                    onChange={(event) => update('name', event.target.value)}
                    required
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby={errors.name ? 'contact-name-error' : undefined}
                  />
                  {errors.name && (
                    <p className="field__error" id="contact-name-error" role="alert">
                      {errors.name}
                    </p>
                  )}
                </div>

                <div className="field">
                  <label htmlFor="contact-company">
                    Company <span className="field__optional">Optional</span>
                  </label>
                  <input
                    id="contact-company"
                    name="company"
                    type="text"
                    autoComplete="organization"
                    value={values.company}
                    onChange={(event) => update('company', event.target.value)}
                  />
                </div>

                <div className="field field--full">
                  <label htmlFor="contact-email">
                    Email <span className="field__req" aria-hidden="true">*</span>
                  </label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    value={values.email}
                    onChange={(event) => update('email', event.target.value)}
                    required
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={errors.email ? 'contact-email-error' : undefined}
                  />
                  {errors.email && (
                    <p className="field__error" id="contact-email-error" role="alert">
                      {errors.email}
                    </p>
                  )}
                </div>

                <div className="field field--full">
                  <p className="field__hint" id="contact-contact-hint">
                    Phone or WhatsApp: please give at least one so we can reach you quickly.
                  </p>
                  {errors.contact && (
                    <p className="field__error" id="contact-contact-error" role="alert">
                      {errors.contact}
                    </p>
                  )}
                </div>

                <div className="field">
                  <label htmlFor="contact-phone">Phone number</label>
                  <input
                    id="contact-phone"
                    name="phone"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    placeholder="+233 24 000 0000"
                    value={values.phone}
                    onChange={(event) => update('phone', event.target.value)}
                    aria-invalid={Boolean(errors.contact || errors.phone)}
                    aria-describedby={`contact-contact-hint${
                      errors.contact ? ' contact-contact-error' : ''
                    }${errors.phone ? ' contact-phone-error' : ''}`}
                  />
                  {errors.phone && (
                    <p className="field__error" id="contact-phone-error" role="alert">
                      {errors.phone}
                    </p>
                  )}
                </div>

                <div className="field">
                  <label htmlFor="contact-whatsapp">WhatsApp number</label>
                  <input
                    id="contact-whatsapp"
                    name="whatsapp"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    placeholder="Same as phone, or a different number"
                    value={values.whatsapp}
                    onChange={(event) => update('whatsapp', event.target.value)}
                    aria-invalid={Boolean(errors.contact || errors.whatsapp)}
                    aria-describedby={`contact-contact-hint${
                      errors.contact ? ' contact-contact-error' : ''
                    }${errors.whatsapp ? ' contact-whatsapp-error' : ''}`}
                  />
                  {errors.whatsapp && (
                    <p className="field__error" id="contact-whatsapp-error" role="alert">
                      {errors.whatsapp}
                    </p>
                  )}
                </div>

                <fieldset
                  className="field field--choices field--full"
                  aria-describedby={errors.services ? 'contact-services-error' : undefined}
                >
                  <legend>
                    What can we help with? <span className="field__req" aria-hidden="true">*</span>
                  </legend>
                  <div className="choice-grid">
                    {serviceOptions.map((option) => (
                      <label className="choice" key={option.value}>
                        <input
                          id={`contact-service-${option.value}`}
                          type="checkbox"
                          name="services"
                          value={option.value}
                          checked={values.services.includes(option.value)}
                          onChange={() => toggleService(option.value)}
                        />
                        <span className="choice__box" aria-hidden="true">
                          <Check size={12} strokeWidth={3} />
                        </span>
                        <span>{option.label}</span>
                      </label>
                    ))}
                  </div>
                  {errors.services && (
                    <p className="field__error" id="contact-services-error" role="alert">
                      {errors.services}
                    </p>
                  )}
                </fieldset>

                <div className="field field--full">
                  <label htmlFor="contact-stage">
                    Where are you in the process? <span className="field__optional">Optional</span>
                  </label>
                  <div className="select-wrap">
                    <select
                      id="contact-stage"
                      name="stage"
                      value={values.stage}
                      onChange={(event) => update('stage', event.target.value)}
                    >
                      <option value="">Select one</option>
                      {stageOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="select-wrap__icon" size={16} strokeWidth={2} aria-hidden="true" />
                  </div>
                </div>

                <div className="field field--full">
                  <label htmlFor="contact-message">
                    Tell us about the project <span className="field__req" aria-hidden="true">*</span>
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    rows={5}
                    value={values.message}
                    onChange={(event) => update('message', event.target.value)}
                    placeholder="What are you trying to build, who is it for, and what would a good outcome look like?"
                    required
                    aria-invalid={Boolean(errors.message)}
                    aria-describedby={
                      errors.message ? 'contact-message-error contact-message-hint' : 'contact-message-hint'
                    }
                  />
                  <p className="field__hint" id="contact-message-hint">
                    A few sentences is plenty. No confidential details needed yet.
                  </p>
                  {errors.message && (
                    <p className="field__error" id="contact-message-error" role="alert">
                      {errors.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Honeypot field for simple spam filtering. Hidden from people and assistive tech. */}
              <div className="contact-form__trap" aria-hidden="true">
                <label htmlFor="contact-website">Website</label>
                <input
                  id="contact-website"
                  name="website"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={values.website}
                  onChange={(event) => update('website', event.target.value)}
                />
              </div>

              {status === 'error' && (
                <p className="contact-form__error" role="alert">
                  That did not send. Please try again, or email{' '}
                  <a className="contact__detail-link" href={`mailto:${site.owner.email}`}>
                    {site.owner.email}
                  </a>{' '}
                  directly.
                </p>
              )}

              <div className="contact-form__foot">
                <button
                  type="submit"
                  className="btn btn--accent contact-form__submit"
                  disabled={status === 'submitting'}
                >
                  {status === 'submitting' ? 'Sending…' : 'Send inquiry'}
                  <ArrowUpRight className="btn__icon" size={16} strokeWidth={2} aria-hidden="true" />
                </button>
                <p className="contact-form__privacy">
                  Your email, phone and WhatsApp are used only to respond to this inquiry. No list,
                  no sharing.
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
