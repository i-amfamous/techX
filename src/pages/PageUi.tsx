import type { ReactNode } from 'react';
import { ArrowUpRight, Globe, Palette, Quote, Smartphone } from 'lucide-react';
import {
  faqs,
  processSteps,
  projects,
  services,
  site,
  solutions,
  type ServiceId,
} from '../data/site';
import { Link } from '../lib/router';
import { useReveal } from '../lib/useReveal';
import { XMark } from '../components/Wordmark';
import './PageUi.css';

/**
 * Shared page furniture.
 *
 * Every inner page gets a distinct hero built from the same data as the
 * section below it. The visual is framed like a product preview so each page
 * opens with something concrete instead of another section heading.
 */

export type PageHeroVariant =
  | 'services'
  | 'solutions'
  | 'work'
  | 'process'
  | 'studio'
  | 'reviews'
  | 'faq'
  | 'contact';

const reviewsQuote =
  'Clear questions, a tidy process, and we were moving faster than expected.';

const serviceIcons: Record<ServiceId, typeof Globe> = {
  web: Globe,
  mobile: Smartphone,
  brand: Palette,
};

/** Shared window frame. The chrome is what makes each visual read as a preview. */
function HeroArtWindow({
  label,
  children,
  flush = false,
}: {
  label: string;
  children: ReactNode;
  flush?: boolean;
}) {
  return (
    <div className={`hero-art${flush ? ' hero-art--flush' : ''}`}>
      <div className="hero-art__chrome">
        <span className="hero-art__dots" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <span className="hero-art__chrome-label">{label}</span>
        <span className="hero-art__chrome-mark" aria-hidden="true">
          <XMark />
        </span>
      </div>
      <div className="hero-art__body">{children}</div>
    </div>
  );
}

function PageHeroVisual({ variant }: { variant: PageHeroVariant }) {
  switch (variant) {
    case 'services':
      return (
        <HeroArtWindow label="Three disciplines">
          <ul className="hero-art__rows">
            {services.map((service) => {
              const Icon = serviceIcons[service.id];
              return (
                <li key={service.id}>
                  <span className="hero-art__icon">
                    <Icon size={17} strokeWidth={1.8} aria-hidden="true" />
                  </span>
                  <span className="hero-art__row-copy">
                    <strong>{service.title}</strong>
                    <small>{service.tagline}</small>
                  </span>
                  <ArrowUpRight size={16} strokeWidth={1.8} aria-hidden="true" />
                </li>
              );
            })}
          </ul>
          <p className="hero-art__foot">Often combined in one engagement.</p>
        </HeroArtWindow>
      );

    case 'solutions':
      return (
        <HeroArtWindow label="Four starting points">
          <ul className="hero-art__tiles">
            {solutions.map((solution) => (
              <li key={solution.id}>
                <span className="hero-art__tile-index">{solution.index}</span>
                <strong>{solution.tag}</strong>
                <small>{solution.title}</small>
              </li>
            ))}
          </ul>
          <p className="hero-art__foot">Illustrative, not case studies.</p>
        </HeroArtWindow>
      );

    case 'work':
      return (
        <HeroArtWindow label="Live projects" flush>
          <div className="hero-art__shots">
            <img
              src={projects[3]?.image}
              alt="Famous TechX school management platform"
              width="900"
              height="604"
            />
            <img
              src={projects[0]?.image}
              alt="SwifTek Accessories online store"
              width="900"
              height="604"
            />
          </div>
          <span className="hero-art__work-badge">
            <span className="hero-art__live-dot" />
            Live and in use
          </span>
        </HeroArtWindow>
      );

    case 'process':
      return (
        <HeroArtWindow label="Five phases">
          <ol className="hero-art__steps">
            {processSteps.map((step) => (
              <li key={step.number}>
                <span>{step.number}</span>
                <strong>{step.title}</strong>
              </li>
            ))}
          </ol>
        </HeroArtWindow>
      );

    case 'studio':
      return (
        <HeroArtWindow label="One studio">
          <div className="hero-art__pair">
            <div className="hero-art__half">
              <span>01</span>
              <strong>Design</strong>
              <small>Clarity, structure, taste</small>
            </div>
            <span className="hero-art__x">
              <XMark />
            </span>
            <div className="hero-art__half">
              <span>02</span>
              <strong>Engineering</strong>
              <small>Build, test, support</small>
            </div>
          </div>
          <p className="hero-art__foot">One conversation, one team.</p>
        </HeroArtWindow>
      );

    case 'reviews':
      return (
        <HeroArtWindow label="Client feedback">
          <Quote size={26} strokeWidth={1.6} aria-hidden="true" />
          <blockquote>{reviewsQuote}</blockquote>
          <div className="hero-art__review-foot">
            <span className="hero-art__dots hero-art__dots--review" aria-hidden="true">
              <i />
              <i />
              <i />
              <i />
              <i />
            </span>
            <span>Published with permission</span>
          </div>
        </HeroArtWindow>
      );

    case 'faq':
      return (
        <HeroArtWindow label="Good questions">
          <span className="hero-art__question" aria-hidden="true">
            ?
          </span>
          <ul className="hero-art__chips">
            {faqs.slice(0, 3).map((item) => (
              <li key={item.id}>{item.question}</li>
            ))}
          </ul>
        </HeroArtWindow>
      );

    case 'contact':
      return (
        <HeroArtWindow label="Direct contact">
          <div className="hero-art__contact-card">
            <a href={`mailto:${site.owner.email}`}>{site.owner.email}</a>
            <p className="hero-art__location">{site.owner.location}</p>
            <span className="hero-art__reply">
              <span className="hero-art__reply-dot" />
              Reply within 1 business day
            </span>
          </div>
          <span className="hero-art__contact-x" aria-hidden="true">
            <XMark />
          </span>
        </HeroArtWindow>
      );
  }
}

interface PageHeroProps {
  variant: PageHeroVariant;
  title: ReactNode;
  lede: string;
  actions?: { label: string; href: string; primary?: boolean }[];
  note?: string;
}

export function PageHero({ variant, title, lede, actions, note }: PageHeroProps) {
  return (
    <section className={`page-hero page-hero--${variant}`} aria-labelledby="page-hero-title">
      <div className="container page-hero__inner">
        <div className="page-hero__copy">
          <h1 className="page-hero__title" id="page-hero-title">
            {title}
          </h1>
          <p className="page-hero__lede">{lede}</p>

          {actions?.length ? (
            <div className="page-hero__actions">
              {actions.map((action) =>
                action.primary ? (
                  <Link key={action.href} className="btn btn--ink" href={action.href}>
                    {action.label}
                    <ArrowUpRight className="btn__icon" size={16} strokeWidth={2} aria-hidden="true" />
                  </Link>
                ) : (
                  <Link key={action.href} className="text-link" href={action.href}>
                    {action.label}
                    <ArrowUpRight size={15} strokeWidth={2} aria-hidden="true" />
                  </Link>
                ),
              )}
            </div>
          ) : null}

          {note ? <p className="page-hero__note">{note}</p> : null}
        </div>

        <div className="page-hero__visual">
          <PageHeroVisual variant={variant} />
        </div>
      </div>
    </section>
  );
}

/** Breadcrumb shown above every secondary page. */
export function PageCrumb({ label }: { label: string }) {
  return (
    <div className="page-crumb">
      <div className="container page-crumb__inner">
        <Link href="/">Home</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">{label}</span>
      </div>
    </div>
  );
}

interface PageCtaProps {
  title: ReactNode;
  text: string;
  primaryLabel?: string;
  primaryHref?: string;
  secondary?: { label: string; href: string };
  /** Colour treatment. Each page picks one so the close feels tailored. */
  variant?: 'ink' | 'accent' | 'cream' | 'sage';
  note?: string;
}

/** Closing invitation, kept visually distinct from the footer below it. */
export function PageCta({
  title,
  text,
  primaryLabel = 'Start a project',
  primaryHref = '/contact',
  secondary,
  variant = 'ink',
  note = 'Reply within 1 business day',
}: PageCtaProps) {
  const ref = useReveal<HTMLElement>();

  return (
    <section className={`cta-band cta-band--${variant}`} ref={ref} aria-labelledby="page-cta-title">
      <div className="container">
        <div className="cta-band__panel">
          <XMark className="cta-band__mark" aria-hidden="true" />

          <div className="cta-band__copy">
            <h2 className="cta-band__title reveal" id="page-cta-title">
              {title}
            </h2>
            <p className="cta-band__text reveal">{text}</p>
          </div>

          <div className="cta-band__actions reveal">
            <Link
              className={`btn ${variant === 'ink' ? 'btn--bone' : 'btn--ink'}`}
              href={primaryHref}
            >
              {primaryLabel}
              <ArrowUpRight className="btn__icon" size={16} strokeWidth={2} aria-hidden="true" />
            </Link>
            {secondary ? (
              <Link className="cta-band__secondary" href={secondary.href}>
                {secondary.label}
                <ArrowUpRight size={15} strokeWidth={2} aria-hidden="true" />
              </Link>
            ) : null}
            {note ? <p className="cta-band__note">{note}</p> : null}
          </div>
        </div>
      </div>
    </section>
  );
}
