import { useEffect, useState, type CSSProperties, type FormEvent } from 'react';
import { ArrowRight, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { projects, site } from '../data/site';
import { Link, useNavigate } from '../lib/router';
import { useReveal } from '../lib/useReveal';
import { XMark } from './Wordmark';
import './Hero.css';

/**
 * Hero and the capability ticker that follows it.
 *
 * The hero uses a split layout: product-style copy and CTA on the left, and a
 * single real project image on the right. Using a live project instead of a
 * drawn mockup keeps the opening honest and gives the work immediate proof.
 */

const featuredProject = projects.find((project) => project.id === 'famous-techx');

/**
 * Product preview built around one real project image.
 *
 * The browser-style window and the small proof card are the two patterns that
 * recur across the strongest product heroes: a believable preview of the work,
 * plus a reason to trust it before the visitor scrolls.
 */
function HeroVisual() {
  return (
    <figure className="hero-visual">
      <span className="hero-visual__glow" aria-hidden="true" />

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

      <div className="hero-visual__proof">
        <span className="hero-visual__proof-icon">
          <CheckCircle2 size={18} strokeWidth={2.2} aria-hidden="true" />
        </span>
        <span className="hero-visual__proof-copy">
          <strong>Live and in use</strong>
          <small>{featuredProject?.subtitle ?? 'School management platform'}</small>
        </span>
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

          <div className="hero__actions-row">
            <Link className="text-link hero__secondary" href={site.hero.secondaryCta.href}>
              {site.hero.secondaryCta.label}
              <ArrowUpRight size={15} strokeWidth={2} aria-hidden="true" />
            </Link>
            {site.hero.finePrint ? <p className="hero__fineprint">{site.hero.finePrint}</p> : null}
          </div>

          {site.hero.trust?.length ? (
            <ul className="hero__trust" aria-label="What to expect">
              {site.hero.trust.map((item) => (
                <li key={item}>
                  <CheckCircle2 size={16} strokeWidth={2} aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        <div className="hero__visual-wrap" style={visualStyle}>
          <HeroVisual />
        </div>
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
