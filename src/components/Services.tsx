import { ArrowUpRight, Check, Globe, Minus, Palette, Plus, Smartphone } from 'lucide-react';
import { useState } from 'react';
import { services, type ServiceId } from '../data/site';
import { revealDelay, useReveal } from '../lib/useReveal';
import './Services.css';

interface ServicesProps {
  onDiscuss: (service: ServiceId) => void;
}

const serviceIcons = {
  web: Globe,
  mobile: Smartphone,
  brand: Palette,
};

/**
 * Services accordion.
 *
 * One panel is open at a time, which keeps the page compact and avoids a wall
 * of text. Each trigger is a real button; the panel is labelled by its trigger
 * and hidden with the `hidden` attribute so collapsed copy leaves the tab order.
 * `onDiscuss` hands the chosen service to the contact form instead of trying to
 * encode it in the hash.
 */
export function Services({ onDiscuss }: ServicesProps) {
  const ref = useReveal<HTMLElement>();
  const [openId, setOpenId] = useState<ServiceId | null>('web');

  return (
    <section className="section services" id="services" ref={ref} aria-labelledby="services-title">
      <div className="container">
        <div className="section-head section-head--center">
          <h2 className="section-title reveal" id="services-title" style={revealDelay(0)}>
            Three ways to move from <em>idea</em> to impact.
          </h2>
          <p className="section-lede reveal" style={revealDelay(1)}>
            Most projects need more than one discipline. We can shape the product, build it, and make
            sure it looks and sounds like the business behind it.
          </p>
        </div>

        <div className="services__list reveal" style={revealDelay(1)}>
          {services.map((service) => {
            const open = openId === service.id;
            const triggerId = `service-trigger-${service.id}`;
            const panelId = `service-panel-${service.id}`;
            const Icon = serviceIcons[service.id];

            return (
              <article className={`service${open ? ' is-open' : ''}`} key={service.id}>
                <h3 className="service__heading">
                  <button
                    type="button"
                    className="service__trigger"
                    id={triggerId}
                    aria-expanded={open}
                    aria-controls={panelId}
                    onClick={() => setOpenId(open ? null : service.id)}
                  >
                    <span className="service__icon" aria-hidden="true">
                      <Icon size={20} strokeWidth={1.7} />
                    </span>
                    <span className="service__index">{service.index}</span>
                    <span className="service__title-group">
                      <span className="service__title">{service.title}</span>
                      <span className="service__tagline">{service.tagline}</span>
                    </span>
                    <span className="service__toggle" aria-hidden="true">
                      {open ? <Minus size={18} strokeWidth={2} /> : <Plus size={18} strokeWidth={2} />}
                    </span>
                  </button>
                </h3>

                <div
                  className="service__panel"
                  id={panelId}
                  role="region"
                  aria-labelledby={triggerId}
                  hidden={!open}
                >
                  <div className="service__panel-inner">
                    <div className="service__cols">
                      <div>
                        <p className="service__label">The problem</p>
                        <p className="service__copy">{service.problem}</p>
                      </div>
                      <div>
                        <p className="service__label">Our approach</p>
                        <p className="service__copy">{service.approach}</p>
                      </div>
                    </div>

                    <div className="service__detail">
                      <div>
                        <p className="service__label">What is included</p>
                        <ul className="service__deliverables">
                          {service.deliverables.map((item) => (
                            <li key={item}>
                              <Check className="service__check" size={15} strokeWidth={2.4} aria-hidden="true" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="service__aside">
                        <p className="service__label">Good for</p>
                        <p className="service__good">{service.goodFor}</p>
                        <a
                          className="text-link"
                          href="#contact"
                          onClick={() => onDiscuss(service.id)}
                        >
                          Discuss a project
                          <ArrowUpRight size={15} strokeWidth={2} aria-hidden="true" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <p className="services__note reveal" style={revealDelay(2)}>
          Not sure which one fits? Describe the problem and we will suggest a starting point.
        </p>
      </div>
    </section>
  );
}
