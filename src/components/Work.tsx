import { ArrowUpRight } from 'lucide-react';
import { projects } from '../data/site';
import { revealDelay, useReveal } from '../lib/useReveal';
import './Work.css';

/**
 * Selected work.
 *
 * Every card links to a live site and uses a screenshot captured from that
 * site. The screenshots live in `public/work/`; replace them when a project's
 * home page changes so the gallery does not drift from what visitors will see.
 */
export function Work() {
  const ref = useReveal<HTMLElement>();

  return (
    <section className="section work" id="work" ref={ref} aria-labelledby="work-title">
      <div className="container">
        <div className="section-head section-head--center">
          <h2 className="section-title reveal" id="work-title" style={revealDelay(0)}>
            Selected <em>work.</em>
          </h2>
          <p className="section-lede reveal" style={revealDelay(1)}>
            Live products and websites built for real businesses. Every card links to the running
            site, so you can use it rather than take our word for it.
          </p>
        </div>

        <div className="work__grid">
          {projects.map((project, index) => (
            <article className="project reveal" key={project.id} style={revealDelay(index, 90)}>
              <a
                className="project__visual"
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${project.title}: visit live site (opens in a new tab)`}
              >
                <img
                  className="project__shot"
                  src={project.image}
                  alt={project.imageAlt}
                  loading="lazy"
                  decoding="async"
                />
                <span className="project__index" aria-hidden="true">
                  {project.index}
                </span>
                <span className="project__visit">
                  Visit site
                  <ArrowUpRight size={14} strokeWidth={2} aria-hidden="true" />
                </span>
              </a>

              <div className="project__body">
                <div className="project__meta">
                  <span className="project__type">{project.subtitle}</span>
                  <span className="project__chip">Live</span>
                </div>
                <h3 className="project__title">
                  <a href={project.url} target="_blank" rel="noopener noreferrer">
                    {project.title}
                  </a>
                </h3>
                <p className="project__desc">{project.description}</p>
                <ul className="project__tags" aria-label="Disciplines">
                  {project.tags.map((tag) => (
                    <li key={tag}>{tag}</li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
