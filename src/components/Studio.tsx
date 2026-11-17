import { principles } from '../data/site';
import { revealDelay, useReveal } from '../lib/useReveal';
import { XMark } from './Wordmark';
import './Studio.css';

// Working expectations are local to this section rather than in `site.ts`
// because they only make sense next to the principles panel.
const workingTogether = [
  'Direct contact with the people shaping and building the work',
  'A written scope and visible decisions before work starts',
  'Regular progress you can see and react to',
  'Documentation and handover as part of delivery',
];

/**
 * Studio section: positioning copy plus four principles and a working panel.
 * The dark band separates "who we are" from the concept gallery above and the
 * FAQ below without adding another card style.
 */
export function Studio() {
  const ref = useReveal<HTMLElement>();

  return (
    <section className="section studio on-ink" id="studio" ref={ref} aria-labelledby="studio-title">
      <div className="container">
        <div className="studio__top">
          <h2 className="section-title reveal" id="studio-title" style={revealDelay(0)}>
            Design and engineering, in the <em>same room.</em>
          </h2>

          <div className="studio__lead reveal" style={revealDelay(1)}>
            <p className="studio__statement">
              TechX is a technology and creative studio. We bring design and engineering into one
              conversation, so what you launch is what you set out to build.
            </p>
            <p>
              Every engagement starts with the same question: what is the real problem? From there
              we make the complicated parts clear, agree on the work, and build something your team
              can own and extend.
            </p>
          </div>
        </div>

        <div className="studio__body">
          <div className="studio__principles">
            {principles.map((principle, index) => (
              <article className="principle reveal" key={principle.number} style={revealDelay(index, 80)}>
                <span className="principle__number">{principle.number}</span>
                <h3 className="principle__title">{principle.title}</h3>
                <p className="principle__text">{principle.text}</p>
              </article>
            ))}
          </div>

          <aside className="studio__panel reveal" style={revealDelay(2)} aria-label="How we work together">
            <div className="studio__panel-head">
              <span className="micro">Working together</span>
              <XMark />
            </div>
            <ul className="studio__panel-list">
              {workingTogether.map((item, index) => (
                <li key={item}>
                  <span className="studio__panel-number">{String(index + 1).padStart(2, '0')}</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="studio__panel-foot">
              The aim is simple: work you can understand, maintain, and build on.
            </p>
          </aside>
        </div>
      </div>
    </section>
  );
}
