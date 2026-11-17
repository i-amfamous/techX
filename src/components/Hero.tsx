import {
  ArrowDown,
  ArrowUpRight,
  BatteryFull,
  Camera,
  Check,
  Globe,
  LayoutGrid,
  MapPin,
  Palette,
  Signal,
  Smartphone,
  Wifi,
  WifiOff,
} from 'lucide-react';
import { site } from '../data/site';
import { useReveal } from '../lib/useReveal';
import { XMark } from './Wordmark';
import './Hero.css';

/**
 * Hero and the capability ticker that follows it.
 *
 * The large dark panel is a concept collage, not a screenshot and not client
 * work: browser window, brand card and phone are built from DOM and inline SVG
 * so they stay sharp at any density, cost no image requests, and can be labelled
 * as concepts in the caption. The whole stage is `aria-hidden`; the real
 * message is the headline and lede above it.
 */

const capabilities = [
  { icon: Globe, label: 'Web applications' },
  { icon: Smartphone, label: 'iOS & Android' },
  { icon: Palette, label: 'Brand identity' },
];


const studioRows = [
  {
    icon: Globe,
    title: 'Web applications',
    meta: 'Portals · platforms · internal tools',
  },
  {
    icon: Smartphone,
    title: 'Mobile apps',
    meta: 'Customer apps · field tools',
  },
  {
    icon: Palette,
    title: 'Brand identity',
    meta: 'Positioning · systems · art direction',
  },
];

function HeroStage() {
  return (
    <div className="hero-stage" aria-hidden="true">
      <span className="hero-stage__watermark">
        <XMark />
      </span>
      <span className="hero-stage__orb" />

      <div className="hero-brand-card">
        <div className="hero-brand-card__top">
          <span>Aurelia</span>
          <span>Identity / concept</span>
        </div>
        <div className="hero-brand-card__mark">
          A<span>.</span>
        </div>
        <p className="hero-brand-card__line">Clarity, by design.</p>
        <div className="hero-brand-card__swatches">
          <i />
          <i />
          <i />
          <i />
        </div>
      </div>

      <div className="hero-window">
        <div className="hero-window__bar">
          <span className="hero-window__dots">
            <i />
            <i />
            <i />
          </span>
          <span className="hero-window__url">techx.studio / studio-index</span>
          <span className="hero-window__tag">Concept preview</span>
        </div>

        <div className="hero-window__body">
          <div className="hero-window__rail">
            <span className="hero-window__logo">TX</span>
            <LayoutGrid size={14} className="is-active" />
            <Smartphone size={14} />
            <Palette size={14} />
            <span className="hero-window__rail-spacer" />
            <span className="hero-window__avatar" />
          </div>

          <div className="hero-window__main">
            <div className="hero-window__head">
              <div>
                <p className="hero-window__label">Studio index</p>
                <p className="hero-window__title">Three disciplines. One team.</p>
              </div>
              <span className="hero-window__chip">TX / 01</span>
            </div>

            <div className="hero-window__list">
              {studioRows.map((row) => {
                const Icon = row.icon;
                return (
                  <div className="hero-window__row" key={row.title}>
                    <span className="hero-window__row-icon">
                      <Icon size={15} strokeWidth={1.8} />
                    </span>
                    <span className="hero-window__row-copy">
                      <strong>{row.title}</strong>
                      <small>{row.meta}</small>
                    </span>
                    <ArrowUpRight size={13} strokeWidth={1.8} />
                  </div>
                );
              })}
            </div>

            <div className="hero-window__foot">
              <div className="hero-window__phases">
                {['Discover', 'Design', 'Build', 'Launch'].map((phase, index) => (
                  <span key={phase} className={index === 2 ? 'is-current' : undefined}>
                    {phase}
                  </span>
                ))}
              </div>
              <span className="hero-window__sample">Concept UI</span>
            </div>
          </div>
        </div>
      </div>

      <div className="hero-phone">
        <span className="hero-phone__notch" />
        <div className="hero-phone__status">
          <span>9:41</span>
          <span className="hero-phone__status-icons">
            <Signal size={6} strokeWidth={2.4} />
            <Wifi size={6} strokeWidth={2.4} />
            <BatteryFull size={8} strokeWidth={2.2} />
          </span>
        </div>

        <div className="hero-phone__head">
          <span>Fieldnote</span>
          <span className="hero-phone__avatar" />
        </div>

        <div className="hero-phone__offline">
          <WifiOff size={8} strokeWidth={2.4} /> Offline · sync ready
        </div>

        <div className="hero-phone__map">
          <svg viewBox="0 0 200 100" preserveAspectRatio="none" focusable="false">
            {[20, 40, 60, 80].map((y) => (
              <line key={y} x1="0" y1={y} x2="200" y2={y} stroke="rgba(12,15,13,0.09)" strokeWidth="1" />
            ))}
            {[40, 80, 120, 160].map((x) => (
              <line key={x} x1={x} y1="0" x2={x} y2="100" stroke="rgba(12,15,13,0.09)" strokeWidth="1" />
            ))}
            <path
              d="M18 82 C48 72 44 52 78 56 S118 72 142 40 S172 30 190 16"
              fill="none"
              stroke="#c03a0d"
              strokeWidth="1.6"
              strokeDasharray="4 3"
            />
            <circle cx="18" cy="82" r="3.5" fill="#ff4a17" />
            <circle cx="142" cy="40" r="3" fill="#0c0f0d" />
          </svg>
          <span className="hero-phone__pin">
            <MapPin size={10} strokeWidth={2.2} />
          </span>
          <span className="hero-phone__map-label">North site · 3 stops</span>
        </div>

        <div className="hero-phone__tasks">
          <div className="hero-phone__task">
            <span className="hero-phone__check">
              <Check size={8} strokeWidth={3} />
            </span>
            <span>
              <strong>Check intake valve</strong>
              <small>Completed · 09:12</small>
            </span>
          </div>
          <div className="hero-phone__task">
            <span className="hero-phone__check is-open">
              <Camera size={8} strokeWidth={2.4} />
            </span>
            <span>
              <strong>Photograph control panel</strong>
              <small>2 photos required</small>
            </span>
          </div>
        </div>

        <div className="hero-phone__cta">Capture inspection</div>
      </div>

      <p className="hero-stage__caption">
        <XMark />
        Self-initiated concept studies, not client work.
      </p>
    </div>
  );
}

export function Hero() {
  // Reveal is applied to the section, so the headline, CTAs and panel enter
  // together. Individual pieces have their own CSS animation delays.
  const ref = useReveal<HTMLElement>();

  return (
    <section className="hero" id="top" ref={ref} aria-labelledby="hero-title">
      <div className="container">
        <div className="hero__copy">
          <h1 className="hero__title" id="hero-title">
            {site.hero.headline}
            <span className="hero__dot">.</span>
          </h1>

          <p className="hero__lede">{site.hero.intro}</p>

          <div className="hero__actions">
            <a className="btn btn--accent" href={site.hero.primaryCta.href}>
              {site.hero.primaryCta.label}
              <ArrowUpRight className="btn__icon" size={17} strokeWidth={2} aria-hidden="true" />
            </a>
            <a className="btn btn--outline" href={site.hero.secondaryCta.href}>
              {site.hero.secondaryCta.label}
              <ArrowDown className="btn__icon" size={16} strokeWidth={2} aria-hidden="true" />
            </a>
          </div>

          <ul className="hero__capabilities" aria-label="What TechX does">
            {capabilities.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.label}>
                  <Icon size={16} strokeWidth={1.8} aria-hidden="true" />
                  {item.label}
                </li>
              );
            })}
          </ul>
        </div>

        <div className="hero__panel">
          <HeroStage />
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
