import {
  BatteryFull,
  Check,
  CircleAlert,
  Signal,
  TrendingUp,
  Wifi,
} from 'lucide-react';
import { concepts } from '../data/site';
import { revealDelay, useReveal } from '../lib/useReveal';
import './Work.css';

/**
 * The three concept visuals below are hand-built mockups: plain elements and
 * inline SVG, no screenshots. That keeps them sharp on retina screens, lets
 * them inherit the palette, and avoids shipping fake product photography.
 * They are decorative (`aria-hidden` where they contain fake UI copy), while
 * the surrounding card carries the real explanation.
 */
function DashboardVisual() {
  return (
    <div className="viz-dash">
      <div className="viz-dash__chrome">
        <span className="viz-dot" />
        <span className="viz-dot" />
        <span className="viz-dot" />
        <span className="viz-dash__url">meridian / overview</span>
      </div>

      <div className="viz-dash__app">
        <div className="viz-dash__rail">
          <div className="viz-dash__logo">M</div>
          <span className="viz-rail-line is-active" />
          <span className="viz-rail-line" />
          <span className="viz-rail-line viz-rail-line--short" />
          <span className="viz-rail-line" />
          <span className="viz-rail-line viz-rail-line--short" />
          <div className="viz-dash__avatar" />
        </div>

        <div className="viz-dash__main">
          <div className="viz-dash__top">
            <span className="viz-dash__h">Operations overview</span>
            <span className="viz-dash__pill">Sample data</span>
          </div>

          <div className="viz-dash__stats">
            <div>
              <span>Open</span>
              <strong>24</strong>
              <i className="viz-dash__delta">
                <TrendingUp size={8} strokeWidth={2.6} aria-hidden="true" /> 3
              </i>
            </div>
            <div>
              <span>In review</span>
              <strong>08</strong>
              <i className="is-muted">n/a</i>
            </div>
            <div>
              <span>Resolved</span>
              <strong>136</strong>
              <i className="is-muted">7d</i>
            </div>
          </div>

          <div className="viz-dash__chart">
            <div className="viz-dash__chart-head">
              <span>Throughput</span>
              <span>Last 14 days</span>
            </div>
            <svg viewBox="0 0 300 80" preserveAspectRatio="none" aria-hidden="true">
              {[20, 40, 60].map((y) => (
                <line key={y} x1="0" y1={y} x2="300" y2={y} stroke="rgba(12,15,13,0.09)" strokeWidth="1" />
              ))}
              <path
                d="M0 63 L21 55 L42 58 L63 44 L84 49 L105 36 L126 40 L147 29 L168 34 L189 23 L210 28 L231 18 L252 23 L273 12 L300 17 L300 80 L0 80 Z"
                fill="#ff4a17"
                fillOpacity="0.14"
              />
              <path
                d="M0 63 L21 55 L42 58 L63 44 L84 49 L105 36 L126 40 L147 29 L168 34 L189 23 L210 28 L231 18 L252 23 L273 12 L300 17"
                fill="none"
                stroke="#c03a0d"
                strokeWidth="1.8"
                strokeLinejoin="round"
                strokeLinecap="round"
              />
              <circle cx="273" cy="12" r="2.8" fill="#ff4a17" stroke="#f0eee4" strokeWidth="1.5" />
            </svg>
          </div>

          <div className="viz-dash__rows">
            {[
              ['Vendor onboarding', 'In review', '12'],
              ['Q3 stock reconciliation', 'Open', '04'],
              ['Site access approvals', 'Resolved', '28'],
            ].map(([label, state, count]) => (
              <div className="viz-dash__row" key={label}>
                <span className="viz-dash__row-name">{label}</span>
                <span className={`viz-dash__state${state === 'Resolved' ? ' is-done' : ''}`}>{state}</span>
                <span className="viz-dash__count">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function MobileVisual() {
  return (
    <div className="viz-mobile">
      <div className="viz-mobile__orb" />
      <div className="viz-mobile__phone viz-mobile__phone--back" aria-hidden="true">
        <div className="viz-mobile__status">9:41</div>
        <div className="viz-mobile__mini-title">This week</div>
        <div className="viz-mobile__bars">
          <span style={{ height: '34%' }} />
          <span style={{ height: '58%' }} />
          <span style={{ height: '42%' }} />
          <span style={{ height: '72%' }} />
          <span style={{ height: '50%' }} />
          <span style={{ height: '64%' }} />
        </div>
        <div className="viz-mobile__mini-rows">
          <span />
          <span />
          <span />
        </div>
      </div>

      <div className="viz-mobile__phone viz-mobile__phone--front">
        <div className="viz-mobile__notch" />
        <div className="viz-mobile__status">
          <span>9:41</span>
          <span className="viz-mobile__status-icons">
            <Signal size={5} strokeWidth={2.4} />
            <Wifi size={5} strokeWidth={2.4} />
            <BatteryFull size={7} strokeWidth={2.2} />
          </span>
        </div>
        <div className="viz-mobile__head">
          <span>Fieldnote</span>
          <span className="viz-mobile__avatar" />
        </div>
        <div className="viz-mobile__offline">
          <span className="viz-mobile__pulse" /> Offline · 12 queued
        </div>
        <div className="viz-mobile__map">
          <svg viewBox="0 0 200 100" preserveAspectRatio="none" aria-hidden="true">
            {[20, 40, 60, 80].map((y) => (
              <line key={y} x1="0" y1={y} x2="200" y2={y} stroke="rgba(12,15,13,0.1)" strokeWidth="1" />
            ))}
            {[40, 80, 120, 160].map((x) => (
              <line key={x} x1={x} y1="0" x2={x} y2="100" stroke="rgba(12,15,13,0.1)" strokeWidth="1" />
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
            <circle cx="190" cy="16" r="4" fill="#e3ead9" />
          </svg>
          <span className="viz-mobile__map-label">North site · 3 stops</span>
        </div>
        <div className="viz-mobile__tasks">
          <div className="viz-task">
            <span className="viz-task__check is-done">
              <Check size={9} strokeWidth={3} aria-hidden="true" />
            </span>
            <span className="viz-task__copy">
              <strong>Check intake valve</strong>
              <small>Completed · 09:12</small>
            </span>
          </div>
          <div className="viz-task">
            <span className="viz-task__check" />
            <span className="viz-task__copy">
              <strong>Photograph control panel</strong>
              <small>2 photos required</small>
            </span>
          </div>
          <div className="viz-task">
            <span className="viz-task__check" />
            <span className="viz-task__copy">
              <strong>Sign-off with site lead</strong>
              <small>Signature</small>
            </span>
          </div>
        </div>
        <div className="viz-mobile__cta">Capture inspection</div>
      </div>

      <span className="viz-mobile__caption">Offline-first · iOS &amp; Android</span>
    </div>
  );
}

function BrandVisual() {
  return (
    <div className="viz-brand">
      <div className="viz-brand__poster">
        <div className="viz-brand__top">
          <span>Aurelia</span>
          <span>Advisory / 26</span>
        </div>
        <div className="viz-brand__mark" aria-hidden="true">
          A<span>.</span>
        </div>
        <p className="viz-brand__line">
          Clarity for <em>complex</em> decisions.
        </p>
        <div className="viz-brand__bottom">
          <span>Identity system</span>
          <span>Concept</span>
        </div>
      </div>

      <div className="viz-brand__swatches" aria-hidden="true">
        <span style={{ background: '#0c0f0d' }} />
        <span style={{ background: '#ff4a17' }} />
        <span style={{ background: '#e3ead9' }} />
        <span style={{ background: '#f0eee4' }} />
      </div>

    </div>
  );
}

const visuals = {
  dashboard: DashboardVisual,
  mobile: MobileVisual,
  brand: BrandVisual,
};

/**
 * Concept gallery.
 *
 * `concept.visual` is a key into `visuals`, which keeps the content file free of
 * component imports. Everything here is explicitly labelled as self-initiated
 * work, and the note above the grid says so again, because a polished mockup is
 * easy to mistake for a client case study.
 */
export function Work() {
  const ref = useReveal<HTMLElement>();

  return (
    <section className="section work on-ink" id="work" ref={ref} aria-labelledby="work-title">
      <div className="container">
        <div className="section-head section-head--center">
          <h2 className="section-title reveal" id="work-title" style={revealDelay(0)}>
            Selected <em>concepts.</em>
          </h2>
          <p className="section-lede reveal" style={revealDelay(1)}>
            Self-initiated studies in product, mobile, and identity. They show how we think, not
            client engagements or measured results.
          </p>
          <p className="work__note reveal" style={revealDelay(2)}>
            <CircleAlert size={14} strokeWidth={2} aria-hidden="true" />
            Placeholder concepts. Replace with real case studies before launch.
          </p>
        </div>

        <div className="work__grid">
          {concepts.map((concept, index) => {
            const Visual = visuals[concept.visual];
            return (
              <article className="concept reveal" key={concept.id} style={revealDelay(index, 90)}>
                <div className="concept__visual">
                  <span className="concept__visual-label">{concept.index}</span>
                  <Visual />
                </div>

                <div className="concept__body">
                  <div className="concept__meta">
                    <span className="concept__type">{concept.subtitle}</span>
                    <span className="concept__chip">Placeholder</span>
                  </div>
                  <h3 className="concept__title">{concept.title}</h3>
                  <p className="concept__desc">{concept.description}</p>
                  <ul className="concept__tags" aria-label="Disciplines">
                    {concept.tags.map((tag) => (
                      <li key={tag}>{tag}</li>
                    ))}
                  </ul>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
