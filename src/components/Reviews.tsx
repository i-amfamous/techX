import { Quote, UserRound } from 'lucide-react';
import { reviews } from '../data/site';
import { revealDelay, useReveal } from '../lib/useReveal';
import './Reviews.css';

/** Client reviews, published with permission. */
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
            Real feedback from people we have worked with, published with their permission.
          </p>
        </div>

        <div className="reviews__grid">
          {reviews.map((review, index) => (
            <article className="review reveal" key={review.id} style={revealDelay(index, 90)}>
              <div className="review__top">
                <Quote size={22} strokeWidth={1.8} aria-hidden="true" />
                <span className="review__chip">Review {String(index + 1).padStart(2, '0')}</span>
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
