import { Info, Quote, UserRound } from 'lucide-react';
import { reviews } from '../data/site';
import { revealDelay, useReveal } from '../lib/useReveal';
import './Reviews.css';

/**
 * Client reviews.
 *
 * The cards are placeholder slots until real, approved quotes exist. This is a
 * deliberate product decision: an empty but honest section is better than
 * invented praise, and it keeps the layout ready for the first engagement.
 * See `reviews` in `src/data/site.ts` for the fields to replace.
 */
export function Reviews() {
  const ref = useReveal<HTMLElement>();

  return (
    <section className="section reviews" id="reviews" ref={ref} aria-labelledby="reviews-title">
      <div className="container">
        <div className="section-head section-head--center">
          <h2 className="section-title reveal" id="reviews-title" style={revealDelay(0)}>
            Client <em>reviews.</em>
          </h2>
          <p className="section-lede reveal" style={revealDelay(1)}>
            We publish reviews only with permission. Until the first engagements are complete, these
            cards stay as clearly marked placeholders.
          </p>
          <p className="reviews__note reveal" style={revealDelay(2)}>
            <Info size={14} strokeWidth={2} aria-hidden="true" />
            No invented quotes, names, or ratings. Add approved reviews before launch.
          </p>
        </div>

        <div className="reviews__grid">
          {reviews.map((review, index) => (
            <article className="review reveal" key={review.id} style={revealDelay(index, 90)}>
              <div className="review__top">
                <Quote size={22} strokeWidth={1.8} aria-hidden="true" />
                <span className="review__chip">Placeholder {String(index + 1).padStart(2, '0')}</span>
              </div>

              <p className="review__quote">{review.quote}</p>

              <div className="review__foot">
                <span className="review__avatar" aria-hidden="true">
                  <UserRound size={17} strokeWidth={1.8} />
                </span>
                <span className="review__person">
                  <span className="review__name">{review.name}</span>
                  <span className="review__role">{review.role}</span>
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
