import { ArrowUpRight, Check } from 'lucide-react';
import { site } from '../data/site';
import { revealDelay, useReveal } from '../lib/useReveal';
import './Highlights.css';

export function Highlights() {
  const ref = useReveal<HTMLElement>();

  return (
    <section className="section highlights on-ink" id="highlights" ref={ref} aria-labelledby="highlights-title">
      <div className="container">
        <div className="section-head section-head--center">
          <h2 className="section-title reveal" id="highlights-title" style={revealDelay(0)}>
            Built for teams that want <em>clarity and momentum.</em>
          </h2>
          <p className="section-lede reveal" style={revealDelay(1)}>
            The strongest digital products are not just attractive — they are useful, usable, and designed to keep improving.
          </p>
        </div>

        <div className="highlights__stats reveal" style={revealDelay(1)}>
          <div>
            <strong>03</strong>
            <span>core disciplines</span>
          </div>
          <div>
            <strong>1:1</strong>
            <span>clarity-first process</span>
          </div>
          <div>
            <strong>Launch</strong>
            <span>ready delivery model</span>
          </div>
        </div>

        <div className="highlights__grid">
          {site.highlights.map((item, index) => (
            <article className="highlight reveal" key={item.title} style={revealDelay(index % 2, 90)}>
              <span className="highlight__badge">{item.badge}</span>
              <h3>{item.title}</h3>
              <p>{item.summary}</p>
              <ul>
                {item.details.map((detail) => (
                  <li key={detail}>
                    <Check size={14} strokeWidth={2.4} aria-hidden="true" />
                    {detail}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <div className="highlights__cta reveal" style={revealDelay(2)}>
          <p>Need a better product story, a smarter interface, or a launch plan you can trust?</p>
          <a className="btn btn--accent" href="#contact">
            Book a discovery call
            <ArrowUpRight className="btn__icon" size={17} strokeWidth={2} aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}
