import { ArrowUpRight, Check } from 'lucide-react';
import { site } from '../data/site';
import { Link } from '../lib/router';
import { revealDelay, useReveal } from '../lib/useReveal';
import './Highlights.css';

export function Highlights() {
  const ref = useReveal<HTMLElement>();

  return (
    <section className="section highlights" id="highlights" ref={ref} aria-labelledby="highlights-title">
      <div className="container">
        <div className="section-head section-head--center">
          <h2 className="section-title reveal" id="highlights-title" style={revealDelay(0)}>
            Less friction in the work. <em>More clarity</em> in the decisions.
          </h2>
          <p className="section-lede reveal" style={revealDelay(1)}>
            A new tool should remove the steps your team dreads, not add another thing to manage.
            Here is how we get there.
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
          <p>Know what is broken but not sure what to build? Start with a short conversation.</p>
          <Link className="btn btn--accent" href="/contact">
            Talk through your problem
            <ArrowUpRight className="btn__icon" size={17} strokeWidth={2} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
