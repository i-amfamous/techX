import { useEffect, useRef, type CSSProperties } from 'react';

/**
 * Reveals a section the first time it scrolls into view.
 *
 * The hook only flips a class (`is-revealed`). All timing and easing live in
 * `base.css`, which keeps the animation inspectable and lets
 * `prefers-reduced-motion` switch it off in one place.
 *
 * Elements inside opt in with `className="reveal"`, and can stagger themselves
 * by setting the `--reveal-delay` custom property via `revealDelay`.
 */
export function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // No observer, or the visitor asked for less motion: show content now.
    // Content must never depend on an animation running.
    if (reducedMotion || !('IntersectionObserver' in window)) {
      node.classList.add('is-revealed');
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            node.classList.add('is-revealed');
            // One reveal per section is enough. Disconnecting also stops the
            // observer firing again when the section scrolls back into view.
            observer.disconnect();
          }
        });
      },
      // Trigger a touch before the section edge arrives, so the content is
      // already settling by the time it reaches the reading position.
      { threshold: 0.12, rootMargin: '0px 0px -10% 0px' },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return ref;
}

/**
 * Inline style for staggered reveals.
 *
 * Returns a CSS custom property rather than a delay value, because the
 * transition shorthand is defined in CSS and this keeps the two in sync.
 */
export function revealDelay(index: number, step = 70) {
  return { '--reveal-delay': `${index * step}ms` } as CSSProperties;
}
