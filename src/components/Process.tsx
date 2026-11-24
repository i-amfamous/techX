import { ArrowUpRight } from 'lucide-react';
import { processSteps } from '../data/site';
import { Link } from '../lib/router';
import { revealDelay, useReveal } from '../lib/useReveal';
import { XMark } from './Wordmark';
import './Process.css';

/**
 * Process section.
 *
 * The intro column is sticky on desktop so the promise stays visible while the
 * five phases scroll past it. `processSteps` is the single source of truth; the
 * list is ordered because the content is, not because of CSS.
 */
export function Process() {
  const ref = useReveal<HTMLElement>();

  return (
    <section className="section process" id="process" ref={ref} aria-labelledby="process-title">
      <div className="container process__layout">
        <div className="process__intro">
          <h2 className="section-title reveal" id="process-title" style={revealDelay(0)}>
            Five phases, no <em>surprises.</em>
          </h2>
          <p className="section-lede reveal" style={revealDelay(1)}>
            You will always know what is happening, what you are approving, and what comes next. Each
            phase ends with something you can see and react to.
          </p>

          <div className="process__note reveal" style={revealDelay(2)}>
            <span className="process__note-mark" aria-hidden="true">
              <XMark />
            </span>
            <p>
              Every engagement is scoped after the first conversation. Timelines and fees follow the
              scope, not the other way round.
            </p>
          </div>

          <Link className="text-link process__link reveal" href="/contact" style={revealDelay(3)}>
            Talk through your project
            <ArrowUpRight size={15} strokeWidth={2} aria-hidden="true" />
          </Link>
        </div>

        <ol className="process__list">
          {processSteps.map((step, index) => (
            <li className="process-step reveal" key={step.number} style={revealDelay(index, 70)}>
              <span className="process-step__number" aria-hidden="true">
                {step.number}
              </span>
              <div className="process-step__body">
                <h3 className="process-step__title">{step.title}</h3>
                <p className="process-step__summary">{step.summary}</p>
                <ul className="process-step__activities" aria-label={`${step.title} activities`}>
                  {step.activities.map((activity) => (
                    <li key={activity}>{activity}</li>
                  ))}
                </ul>
                <p className="process-step__outcome">
                  <span className="micro">Leaves you with</span>
                  {step.outcome}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
