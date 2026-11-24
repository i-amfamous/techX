import { useEffect, useState, type ReactNode } from 'react';
import {
  ArrowUpRight,
  Code2,
  Compass,
  GraduationCap,
  Globe,
  Layers3,
  Palette,
  Quote,
  Rocket,
  ShoppingBag,
  Smartphone,
  Sprout,
  Store,
  type LucideIcon,
} from 'lucide-react';
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

/**
 * Work hero: the projects become the backdrop and the story.
 *
 * The live screenshot fills the hero, a strong gradient keeps the copy readable,
 * and the panel below the headline explains the project currently on screen.
 * The filmstrip at the bottom both previews every project and controls the loop.
 */
const SLIDE_MS = 4200;

const projectIcons: Record<string, LucideIcon> = {
  swiftek: ShoppingBag,
  agricweb: Sprout,
  'premium-academy': GraduationCap,
  'famous-techx': Layers3,
  'famous-techx-pos': Store,
};

function WorkHero({ title, lede, actions, note }: Omit<PageHeroProps, 'variant'>) {
  const [active, setActive] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const paused = hovered || focused;
  const current = projects[active] ?? projects[0];
  const ActiveIcon = current ? projectIcons[current.id] ?? Layers3 : Layers3;

  useEffect(() => {
    if (paused || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const timer = window.setInterval(
      () => setActive((index) => (index + 1) % projects.length),
      SLIDE_MS,
    );
    return () => window.clearInterval(timer);
  }, [paused]);

  return (
    <section
      className={`page-hero page-hero--work work-hero${paused ? ' is-paused' : ''}`}
      aria-labelledby="page-hero-title"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setFocused(false);
      }}
    >
      <div className="work-hero__media" aria-hidden="true">
        {projects.map((project, index) => (
          <img
            key={project.id}
            className={`work-hero__image${index === active ? ' is-active' : ''}`}
            src={project.image}
            alt=""
            width="900"
            height="604"
            decoding="async"
          />
        ))}
        <span className="work-hero__tint" />
        <span className="work-hero__shade" />
      </div>

      <div className="container work-hero__inner">
        <div className="work-hero__copy">
          <h1 className="page-hero__title" id="page-hero-title">
            {title}
          </h1>
          <p className="page-hero__lede work-hero__lede">{lede}</p>

          {current ? (
            <div className="work-hero__project">
              <div className="work-hero__project-head">
                <span className="work-hero__project-icon" aria-hidden="true">
                  <ActiveIcon size={18} strokeWidth={1.9} />
                </span>
                <div>
                  <h2 className="work-hero__project-title">{current.title}</h2>
                  <p className="work-hero__project-type">{current.subtitle}</p>
                </div>
              </div>

              <p className="work-hero__project-text">{current.description}</p>

              <div className="work-hero__tags">
                {current.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>

              <a className="work-hero__visit" href={current.url} target="_blank" rel="noreferrer">
                Open live project
                <ArrowUpRight size={15} strokeWidth={2} aria-hidden="true" />
              </a>
            </div>
          ) : null}

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
      </div>

      <div className="work-hero__rail">
        <div className="container work-hero__rail-inner">
          <div className="work-hero__thumbs" role="group" aria-label="Choose a project">
            {projects.map((project, index) => {
              const Icon = projectIcons[project.id] ?? Layers3;
              return (
                <button
                  type="button"
                  className={`work-hero__thumb${index === active ? ' is-active' : ''}`}
                  key={project.id}
                  onClick={() => setActive(index)}
                  aria-label={`Show ${project.title}`}
                  aria-pressed={index === active}
                >
                  <img src={project.image} alt="" width="900" height="604" decoding="async" />
                  <span className="work-hero__thumb-icon" aria-hidden="true">
                    <Icon size={12} strokeWidth={2} />
                  </span>
                </button>
              );
            })}
          </div>

          <span className="work-hero__rail-note">
            <span className="hero-art__live-dot" aria-hidden="true" />
            Live and in use
          </span>

          <span
            className="work-hero__progress"
            key={`progress-${active}-${paused}`}
            aria-hidden="true"
          />
        </div>
      </div>
    </section>
  );
}

const studioOrbit = [
  { Icon: Compass, title: 'Discovery', detail: 'Find the real problem' },
  { Icon: Palette, title: 'Design', detail: 'Make it clear and usable' },
  { Icon: Code2, title: 'Engineering', detail: 'Build it to last' },
  { Icon: Rocket, title: 'Launch', detail: 'Ship, support, hand over' },
];

/**
 * Studio hero: one centre, four orbiting disciplines.
 *
 * Inspired by creative studio heroes that surround a central wordmark with
 * illustrated characters, this uses the TechX mark and four small discipline
 * cards. It says the same thing with the studio's own visual language.
 */
function StudioHeroArt() {
  return (
    <div className="studio-art">
      <span className="studio-art__ring" aria-hidden="true" />

      <div className="studio-art__center">
        <span className="studio-art__mark" aria-hidden="true">
          <XMark />
        </span>
        <strong>TechX</strong>
        <small>One studio, one team</small>
      </div>

      {studioOrbit.map(({ Icon, title, detail }, index) => (
        <div className={`studio-art__chip studio-art__chip--${index + 1}`} key={title}>
          <span className="studio-art__chip-icon" aria-hidden="true">
            <Icon size={17} strokeWidth={1.8} />
          </span>
          <span className="studio-art__chip-copy">
            <strong>{title}</strong>
            <small>{detail}</small>
          </span>
        </div>
      ))}

      <div className="studio-art__foot">
        <Layers3 size={15} strokeWidth={1.8} aria-hidden="true" />
        <span>The people you talk to build the work.</span>
      </div>
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
      return null;

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
      return <StudioHeroArt />;

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
  if (variant === 'work') {
    return <WorkHero title={title} lede={lede} actions={actions} note={note} />;
  }

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
