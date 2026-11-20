import { useEffect, useState, type CSSProperties, type FormEvent } from 'react';
import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  CircleDashed,
  LayoutGrid,
  Palette,
  Smartphone,
  Sparkles,
} from 'lucide-react';
import { site } from '../data/site';
import { useReveal } from '../lib/useReveal';
import { XMark } from './Wordmark';
import './Hero.css';

/**
 * Hero and the capability ticker that follows it.
 *
 * The hero is rebuilt around a split layout: product-style copy and CTA on the
 * left, and a concept dashboard mockup on the right. The mockup is decorative
 * UI built from markup (no screenshots) so it stays crisp, lightweight, and
 * easy to adapt as the studio's message evolves.
 */

function HeroVisual() {
  return (
    <div className="hero-visual" aria-hidden="true">
      <div className="hero-visual__glow" />
      <div className="hero-visual__card hero-visual__card--main">
        <div className="hero-visual__top">
          <div>
            <p className="hero-visual__eyebrow">Project overview</p>
            <h3 className="hero-visual__title">Northstar Portal</h3>
            <p className="hero-visual__meta">Client workspace · Sprint 06</p>
          </div>
          <span className="hero-visual__status">
            <span className="hero-visual__status-dot" />
            On track
          </span>
        </div>

        <div className="hero-visual__metric">
          <span className="hero-visual__metric-label">Launch readiness</span>
          <strong className="hero-visual__metric-value">72%</strong>
          <span className="hero-visual__metric-note">Design approved · Build in progress</span>
          <div className="hero-visual__progress" role="presentation">
            <span style={{ width: '72%' }} />
          </div>
        </div>

        <div className="hero-visual__actions" aria-hidden="true">
          <span className="is-active">Discover</span>
          <span className="is-active">Design</span>
          <span className="is-active">Build</span>
          <span>Launch</span>
        </div>

        <div className="hero-visual__feed">
          <p className="hero-visual__feed-label">Today</p>
          <ul>
            <li>
              <span className="hero-visual__feed-icon is-done">
                <CheckCircle2 size={14} strokeWidth={2.2} />
              </span>
              <span className="hero-visual__feed-copy">
                <strong>Customer portal flows approved</strong>
                <small>Web application · 09:24</small>
              </span>
              <span className="hero-visual__feed-tag">Done</span>
            </li>
            <li>
              <span className="hero-visual__feed-icon is-done">
                <CheckCircle2 size={14} strokeWidth={2.2} />
              </span>
              <span className="hero-visual__feed-copy">
                <strong>Brand system tokens handed off</strong>
                <small>Identity · 11:10</small>
              </span>
              <span className="hero-visual__feed-tag">Done</span>
            </li>
            <li>
              <span className="hero-visual__feed-icon">
                <CircleDashed size={14} strokeWidth={2.2} />
              </span>
              <span className="hero-visual__feed-copy">
                <strong>Mobile field checklist prototype</strong>
                <small>iOS & Android · In review</small>
              </span>
              <span className="hero-visual__feed-tag is-muted">Next</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="hero-visual__card hero-visual__card--float hero-visual__card--scope">
        <p className="hero-visual__mini-label">Scope snapshot</p>
        <ul className="hero-visual__scope-list">
          <li>
            <LayoutGrid size={14} strokeWidth={1.8} />
            Web platform
          </li>
          <li>
            <Smartphone size={14} strokeWidth={1.8} />
            Mobile companion
          </li>
          <li>
            <Palette size={14} strokeWidth={1.8} />
            Brand identity
          </li>
        </ul>
      </div>

      <div className="hero-visual__card hero-visual__card--float hero-visual__card--note">
        <span className="hero-visual__note-icon">
          <Sparkles size={14} strokeWidth={2} />
        </span>
        <div>
          <p className="hero-visual__mini-label">Next milestone</p>
          <strong>Usability review</strong>
          <small>Thursday · stakeholder walkthrough</small>
        </div>
      </div>

      <p className="hero-visual__caption">
        <XMark />
        Concept interface preview
      </p>
    </div>
  );
}

export function Hero() {
  const ref = useReveal<HTMLElement>();
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
    const contact = document.getElementById('contact');
    if (email.trim()) {
      const contactEmail = document.querySelector<HTMLInputElement>(
        '#contact input[type="email"], #contact input[name="email"], #contact input[name="EMAIL"]',
      );
      if (contactEmail) {
        contactEmail.value = email.trim();
        contactEmail.dispatchEvent(new Event('input', { bubbles: true }));
        contactEmail.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }
    if (contact) {
      contact.scrollIntoView({ behavior: 'smooth', block: 'start' });
      window.setTimeout(() => {
        const focusTarget = document.querySelector<HTMLElement>(
          '#contact input, #contact textarea, #contact button',
        );
        focusTarget?.focus({ preventScroll: true });
      }, 350);
    } else {
      window.location.hash = site.hero.primaryCta.href;
    }
  };

  return (
    <section className="hero" id="top" ref={ref} aria-labelledby="hero-title">
      <div className="container hero__grid">
        <div className="hero__copy">
          {site.hero.badge ? (
            <p className="hero__badge">
              <span className="hero__badge-label">{site.hero.badge.label}</span>
              <span className="hero__badge-text">{site.hero.badge.text}</span>
            </p>
          ) : null}

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
            <a className="text-link hero__secondary" href={site.hero.secondaryCta.href}>
              {site.hero.secondaryCta.label}
              <ArrowUpRight size={15} strokeWidth={2} aria-hidden="true" />
            </a>
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
