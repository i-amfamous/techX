import { useEffect, useRef, useState, type FormEvent } from 'react';
import { site, type ServiceId } from '../data/site';
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
 * Three paths matter:
 * - no endpoint configured: validate, then show a copyable preview (demo)
 * - endpoint configured: POST JSON, abort after 15s, show success or a retry
 * - honeypot filled: pretend success and send nothing
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
  services: string[];
  stage: string;
  message: string;
  website: string;
}

type Errors = Partial<Record<'name' | 'email' | 'services' | 'message', string>>;
type Status = 'idle' | 'submitting' | 'success' | 'demo' | 'error';
type CopyStatus = 'idle' | 'copied' | 'failed';

const initialValues: FormValues = {
  name: '',
  company: '',
  email: '',
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
  services: 'contact-service-web',
  message: 'contact-message',
};

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

  if (values.services.length === 0) {
    errors.services = 'Choose at least one area so we can point your note to the right place.';
  }

  if (values.message.trim().length < 20) {
    errors.message = 'Tell us a little more: a sentence or two, at least 20 characters.';
  }

  return errors;
}

function buildSummary(values: FormValues): string {
  const interests = serviceOptions
    .filter((option) => values.services.includes(option.value))
    .map((option) => option.label)
    .join(', ');

  return [
    'TechX project inquiry',
    '',
    `Name: ${values.name.trim()}`,
    `Company: ${values.company.trim() || 'Not provided'}`,
    `Email: ${values.email.trim()}`,
    `Interested in: ${interests || 'Not provided'}`,
    `Stage: ${values.stage || 'Not provided'}`,
    '',
    'Project:',
    values.message.trim(),
  ].join('\n');
}

export function Contact({ preselect }: ContactProps) {
  const ref = useReveal<HTMLElement>();
  const resultRef = useRef<HTMLDivElement>(null);
  const [values, setValues] = useState<FormValues>(initialValues);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>('idle');
  const [copied, setCopied] = useState<CopyStatus>('idle');
  const [summary, setSummary] = useState('');

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

    if (!site.formEndpoint) {
      // Demo build: stop before any network call and show the inquiry instead.
      // This is the honest default, not an error state.
      setStatus('demo');
      return;
    }

    setStatus('submitting');

    // A stalled form is worse than a visible failure. Abort so the button never
    // spins forever, and let the catch block offer a retry.
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 15000);

    try {
      const response = await fetch(site.formEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          name: values.name.trim(),
          company: values.company.trim(),
          email: values.email.trim(),
          interests: values.services,
          stage: values.stage,
          message: values.message.trim(),
          submittedAt: new Date().toISOString(),
          source: 'techx-website',
        }),
        signal: controller.signal,
      });

      if (!response.ok) throw new Error('The form endpoint rejected the request.');
      setStatus('success');
    } catch {
      setStatus('error');
    } finally {
      window.clearTimeout(timeout);
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
  const endpointMissing = !site.formEndpoint;

  return (
    <section className="section contact" id="contact" ref={ref} aria-labelledby="contact-title">
      <div className="container contact__layout">
        <div className="contact__intro">
          <h2 className="section-title reveal" id="contact-title" style={revealDelay(1)}>
            Tell us what you are trying to <em>make.</em>
          </h2>
          <p className="contact__lede reveal" style={revealDelay(2)}>
            A short note is enough to begin. Share the problem, who it affects, and what a good
            outcome would look like. We will reply with next steps or a few useful questions.
          </p>

          <div className="contact__next reveal" style={revealDelay(3)}>
            <p className="micro">What happens next</p>
            <ol>
              <li>
                <span>01</span> We read your note and come back with questions.
              </li>
              <li>
                <span>02</span> A short conversation about the problem and constraints.
              </li>
              <li>
                <span>03</span> A proposed scope, approach, and next step.
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
                    <span className="placeholder">[studio email, add before launch]</span>
                  )}
                </dd>
              </div>
              <div>
                <dt>Location</dt>
                <dd>
                  {site.owner.location ? (
                    site.owner.location
                  ) : (
                    <span className="placeholder">[studio location or working model]</span>
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
                    <span className="placeholder">[social links, add before launch]</span>
                  )}
                </dd>
              </div>
            </dl>
            <p className="contact__details-note">
              These placeholders are intentionally visible until the studio supplies real contact
              details. No address or profile is invented.
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
                    This build has no form endpoint connected, so the inquiry was validated locally
                    instead of being sent. Connect one in <code>src/data/site.ts</code> before
                    launch, or copy the message below and send it through your own channel.
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
                    Demo build: the form endpoint is not connected. Submissions are validated but
                    not sent.
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
                  That did not send. Please try again, or come back once the studio has published
                  direct contact details.
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
                  Your details will only be used to respond to this inquiry. No list, no sharing.
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
