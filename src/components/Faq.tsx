import { ArrowUpRight, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { faqs } from '../data/site';
import { Link } from '../lib/router';
import { revealDelay, useReveal } from '../lib/useReveal';
import './Faq.css';

/**
 * FAQ accordion.
 *
 * Same accessible pattern as the services list: a real button per question,
 * `aria-expanded`, and `hidden` panels. Answers are content, so they live in
 * `data/site.ts`. A single item stays open to keep the section calm.
 */
export function Faq() {
  const ref = useReveal<HTMLElement>();
  // Open the first answer by default: it sets expectations and shows the
  // interaction model without requiring a click.
  const [openId, setOpenId] = useState<string | null>(faqs[0]?.id ?? null);

  return (
    <section className="section faq" id="faq" ref={ref} aria-labelledby="faq-title">
      <div className="container faq__layout">
        <div className="faq__intro">
          <h2 className="section-title reveal" id="faq-title" style={revealDelay(0)}>
            The answers you need before you <em>commit.</em>
          </h2>
          <p className="section-lede reveal" style={revealDelay(1)}>
            How we start, what we need from you, and what you own at the end. If your question is not
            here, ask it directly.
          </p>
          <Link className="text-link faq__link reveal" href="/contact" style={revealDelay(2)}>
            Ask a question
            <ArrowUpRight size={15} strokeWidth={2} aria-hidden="true" />
          </Link>
        </div>

        <div className="faq__list reveal" style={revealDelay(1)}>
          {faqs.map((item) => {
            const open = openId === item.id;
            const triggerId = `faq-trigger-${item.id}`;
            const panelId = `faq-panel-${item.id}`;

            return (
              <div className={`faq-item${open ? ' is-open' : ''}`} key={item.id}>
                <h3 className="faq-item__heading">
                  <button
                    type="button"
                    className="faq-item__trigger"
                    id={triggerId}
                    aria-expanded={open}
                    aria-controls={panelId}
                    onClick={() => setOpenId(open ? null : item.id)}
                  >
                    <span>{item.question}</span>
                    <span className="faq-item__icon" aria-hidden="true">
                      <ChevronDown size={16} strokeWidth={2} />
                    </span>
                  </button>
                </h3>
                <div
                  className="faq-item__answer"
                  id={panelId}
                  role="region"
                  aria-labelledby={triggerId}
                  hidden={!open}
                >
                  <p>{item.answer}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
