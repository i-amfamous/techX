import { useEffect, useState, type CSSProperties, type FormEvent } from 'react';
import { ArrowRight, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { projects, site } from '../data/site';
import { Link, useNavigate } from '../lib/router';
import { revealDelay, useReveal } from '../lib/useReveal';
import { XMark } from './Wordmark';
import './Hero.css';

/**
 * Hero and the capability ticker that follows it.
 *
 * The hero is image led: one large live project preview with two smaller live
 * products layered around it. Real screenshots keep the opening honest and give
 * visitors something concrete to judge before they scroll.
 */

const byId = (id: string) => projects.find((project) => project.id === id);
const featuredProject = byId('famous-techx');
const supportingProjects = [byId('famous-techx-pos'), byId('premium-academy')].filter(
  (project): project is NonNullable<typeof project> => Boolean(project),
);

/**
 * Layered product showcase.
 *
 * A believable browser preview, two real supporting products, and a small
 * proof card. The patterns recur across the strongest product heroes: show the
 * work, then give the visitor a reason to trust it before scrolling.
 */
function HeroVisual() {
  return (
    <figure className="hero-visual">
      <span className="hero-visual__glow" aria-hidden="true" />

      <div className="hero-visual__stage">
        <div className="hero-visual__window">
          <div className="hero-visual__chrome">
            <span className="hero-visual__dots" aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
            <span className="hero-visual__url">famoustechx.onrender.com</span>
            <span className="hero-visual__chrome-mark" aria-hidden="true">
              <XMark />
            </span>
          </div>

          <div className="hero-visual__screen">
            <img
              className="hero-visual__image"
              src={featuredProject?.image ?? '/work/famous-techx.jpg'}
              alt={featuredProject?.imageAlt ?? 'Famous TechX school management platform'}
              width="900"
              height="604"
              decoding="async"
            />
          </div>
        </div>

        {supportingProjects.map((project, index) => (
          <div
            className={`hero-visual__mini hero-visual__mini--${index + 1}`}
            key={project.id}
          >
            <div className="hero-visual__mini-head">
              <span className="hero-visual__mini-dot" aria-hidden="true" />
              <span>{project.title}</span>
            </div>
            <img
              src={project.image}
              alt={project.imageAlt}
              width="900"
              height="604"
              loading="lazy"
              decoding="async"
            />
          </div>
        ))}

        <div className="hero-visual__proof">
          <span className="hero-visual__proof-icon">
            <CheckCircle2 size={18} strokeWidth={2.2} aria-hidden="true" />
          </span>
          <span className="hero-visual__proof-copy">
            <strong>Live and in use</strong>
            <small>{featuredProject?.subtitle ?? 'School management platform'}</small>
          </span>
        </div>
      </div>

      <figcaption className="hero-visual__caption">
        <span className="hero-visual__caption-mark">
          <XMark />
        </span>
        <span>Built by TechX</span>
        <Link className="hero-visual__caption-link" href="/work">
          See more work
          <ArrowUpRight size={14} strokeWidth={2} aria-hidden="true" />
        </Link>
      </figcaption>
    </figure>
  );
}

export function Hero() {
  const ref = useReveal<HTMLElement>();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) return;

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        setScrollY(window.scrollY || 0);
        ticking = false;
      });
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const heroProgress = Math.min(scrollY / 520, 1);
  const visualStyle = {
    '--hero-p': heroProgress,
    transform: `translate3d(0, ${heroProgress * 36}px, 0) scale(${1 - heroProgress * 0.045})`,
    opacity: 1 - heroProgress * 0.12,
  } as CSSProperties & { '--hero-p': number };

  const onCtaSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const query = email.trim() ? `?email=${encodeURIComponent(email.trim())}` : '';
    navigate(`/contact${query}`);
  };

  return (
    <section className="hero" id="top" ref={ref} aria-labelledby="hero-title">
      <div className="container hero__grid">
        <div className="hero__copy">
          <h1 className="hero__title" id="hero-title">
            {site.hero.headline}
            <span className="hero__dot">.</span>
          </h1>

          <p className="hero__lede">{site.hero.intro}</p>

          <form className="hero__cta" onSubmit={onCtaSubmit}>
            <label className="sr-only" htmlFor="hero-email">
              Work email
            </label>
            <input
              id="hero-email"
              className="hero__input"
              type="email"
              name="email"
              inputMode="email"
              autoComplete="email"
              placeholder={site.hero.ctaPlaceholder ?? 'you@company.com'}
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
            <button className="btn btn--ink hero__submit" type="submit">
              {site.hero.primaryCta.label}
              <ArrowRight className="btn__icon" size={17} strokeWidth={2} aria-hidden="true" />
            </button>
          </form>

        </div>

        <div className="hero__visual-wrap" style={visualStyle}>
          <HeroVisual />
        </div>
      </div>
    </section>
  );
}

/**
 * Quiet proof strip directly beneath the hero.
 *
 * The secondary link, availability note, and reassurance points used to sit
 * under the email field. Moving them here keeps the opening focused while the
 * details stay close enough to be useful before the visitor scrolls on.
 */
export function HeroAssurance() {
  const ref = useReveal<HTMLElement>();

  return (
    <section className="hero-assurance" ref={ref} aria-label="What to expect from TechX">
      <div className="container hero-assurance__inner">
        <div className="hero-assurance__intro reveal">
          <Link className="text-link" href={site.hero.secondaryCta.href}>
            {site.hero.secondaryCta.label}
            <ArrowUpRight size={15} strokeWidth={2} aria-hidden="true" />
          </Link>
          {site.hero.finePrint ? <p className="micro">{site.hero.finePrint}</p> : null}
        </div>

        {site.hero.trust?.length ? (
          <ul className="hero-assurance__list">
            {site.hero.trust.map((item, index) => (
              <li className="reveal" key={item} style={revealDelay(index)}>
                <CheckCircle2 size={16} strokeWidth={2} aria-hidden="true" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </section>
  );
}

const tickerItems = [
  'Web applications',
  'iOS & Android',
  'Brand identity',
  'Product design',
  'Design systems',
  'Creative direction',
];

/**
 * Capability marquee.
 *
 * The list is rendered twice and the track shifts by exactly -50%, which is
 * what makes the loop seamless. It is decorative repetition, so the whole
 * strip is hidden from assistive tech; the same capabilities are stated in the
 * hero and the services section.
 */
export function Ticker() {
  return (
    <div className="ticker" aria-hidden="true">
      <div className="ticker__track">
        {[0, 1].map((group) => (
          <ul className="ticker__group" key={group}>
            {tickerItems.map((item) => (
              <li key={`${group}-${item}`}>
                <span>{item}</span>
                <XMark className="ticker__x" />
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}
