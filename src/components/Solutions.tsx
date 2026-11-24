import { ArrowUpRight, Globe, Info, LayoutGrid, Palette, Smartphone } from 'lucide-react';
import { solutions, type ServiceId } from '../data/site';
import { Link } from '../lib/router';
import { revealDelay, useReveal } from '../lib/useReveal';
import './Solutions.css';

interface SolutionsProps {
  onDiscuss: (service: ServiceId) => void;
}

const solutionIcons = {
  operations: LayoutGrid,
  portal: Globe,
  field: Smartphone,
  identity: Palette,
};

/**
 * Illustrative scenarios, not case studies.
 *
 * The icons are mapped by solution id with a layout-grid fallback, so adding a
 * new scenario to the data file cannot break rendering. The disclaimer above
 * the grid is part of the content contract, not decoration: it tells visitors
 * these are examples of how TechX might help.
 */
export function Solutions({ onDiscuss }: SolutionsProps) {
  const ref = useReveal<HTMLElement>();

  return (
    <section className="section solutions" id="solutions" ref={ref} aria-labelledby="solutions-title">
      <div className="container">
        <div className="section-head section-head--center">
          <h2 className="section-title reveal" id="solutions-title" style={revealDelay(0)}>
            Recognise one of <em>these?</em>
          </h2>
          <p className="section-lede reveal" style={revealDelay(1)}>
            Common problems and the products we would build to solve them. These are examples, not a
            menu. Discovery is where your actual scope gets set.
          </p>
          <p className="solutions__disclaimer reveal" style={revealDelay(2)}>
            <Info size={14} strokeWidth={2} aria-hidden="true" />
            Illustrative scenarios, not past client work.
          </p>
        </div>

        <div className="solutions__grid">
          {solutions.map((solution, index) => {
            const Icon = solutionIcons[solution.id as keyof typeof solutionIcons] ?? LayoutGrid;
            return (
              <article className="solution reveal" key={solution.id} style={revealDelay(index % 2, 90)}>
                <div className="solution__head">
                  <span className="solution__icon" aria-hidden="true">
                    <Icon size={19} strokeWidth={1.8} />
                  </span>
                  <span className="solution__tag">{solution.tag}</span>
                  <span className="solution__index" aria-hidden="true">
                    {solution.index}
                  </span>
                </div>

                <h3 className="solution__title">{solution.title}</h3>
                <p className="solution__situation">{solution.situation}</p>

                <div className="solution__approach">
                  <p className="solution__label">How we could help</p>
                  <p>{solution.approach}</p>
                </div>

                <ul className="solution__blocks" aria-label="Potential building blocks">
                  {solution.blocks.map((block) => (
                    <li key={block}>{block}</li>
                  ))}
                </ul>

                <Link
                  className="text-link solution__link"
                  href="/contact"
                  onClick={() => onDiscuss(solution.service)}
                >
                  Discuss a project like this
                  <ArrowUpRight size={15} strokeWidth={2} aria-hidden="true" />
                </Link>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
