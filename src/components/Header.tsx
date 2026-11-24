import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import { navLinks } from '../data/site';
import { Link, useRoute } from '../lib/router';
import { Wordmark, XMark } from './Wordmark';
import './Header.css';

/**
 * Sticky site header.
 *
 * Desktop navigation is generated from `navLinks`; below 980px the same list
 * becomes a full-screen menu. The breakpoint lives in both `Header.css` and the
 * resize handler below, so change them together.
 *
 * The active item now follows the current page URL instead of a scroll spy,
 * because each section has its own route.
 */
export function Header() {
  const { path } = useRoute();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // The bar only grows a hairline and a stronger background after the page
  // starts moving. Doing this in React rather than with a scroll listener in
  // CSS keeps the state readable, and the handler is passive.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [path]);

  /**
   * Mobile menu housekeeping.
   *
   * `inert` on the page body is doing the heavy lifting: it removes everything
   * outside the menu from the tab order and the accessibility tree, so there is
   * no hand-rolled focus trap to get wrong. On close we return focus to the
   * toggle, and on resize we close at the same 980px breakpoint the CSS uses.
   */
  useEffect(() => {
    if (!open) return;

    const main = document.querySelector('main');
    const footer = document.querySelector('footer');
    main?.setAttribute('inert', '');
    footer?.setAttribute('inert', '');
    document.body.classList.add('menu-open');

    // Wait a frame so the menu is mounted and focusable.
    const focusTimer = window.setTimeout(() => {
      menuRef.current?.querySelector<HTMLElement>('a, button')?.focus();
    }, 60);

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };

    const onResize = () => {
      if (window.innerWidth > 980) setOpen(false);
    };

    document.addEventListener('keydown', onKeyDown);
    window.addEventListener('resize', onResize);

    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('resize', onResize);
      main?.removeAttribute('inert');
      footer?.removeAttribute('inert');
      document.body.classList.remove('menu-open');
      toggleRef.current?.focus();
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <header className={`site-header${scrolled ? ' is-scrolled' : ''}${open ? ' is-menu-open' : ''}`}>
      <div className="container site-header__inner">
        <Link className="site-header__brand" href="/" aria-label="TechX, home" onClick={close}>
          <Wordmark />
        </Link>

        <nav className="site-nav" aria-label="Primary">
          <ul>
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="site-nav__link"
                  aria-current={path === link.href ? 'page' : undefined}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <Link className="btn btn--ink site-header__cta" href="/contact">
          Start a project
          <ArrowUpRight className="btn__icon" size={16} strokeWidth={2} aria-hidden="true" />
        </Link>

        <button
          ref={toggleRef}
          type="button"
          className="menu-toggle"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X size={18} strokeWidth={2} aria-hidden="true" /> : <Menu size={18} strokeWidth={2} aria-hidden="true" />}
        </button>
      </div>

      {open && (
        <div id="mobile-menu" ref={menuRef} className="mobile-menu" role="dialog" aria-modal="true" aria-label="Site navigation">
          <div className="container mobile-menu__inner">
            <p className="mobile-menu__label">
              <XMark /> Menu
            </p>

            <nav aria-label="Mobile">
              <ul className="mobile-menu__list">
                {navLinks.map((link, index) => (
                  <li key={link.href}>
                    <Link href={link.href} onClick={close} aria-current={path === link.href ? 'page' : undefined}>
                      <span className="mobile-menu__index">{String(index + 1).padStart(2, '0')}</span>
                      <span>{link.label}</span>
                      <ArrowUpRight className="mobile-menu__arrow" size={18} strokeWidth={1.8} aria-hidden="true" />
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="mobile-menu__foot">
              <p className="micro">We turn business problems into working products</p>
              <Link className="btn btn--bone" href="/contact" onClick={close}>
                Start a project
                <ArrowUpRight className="btn__icon" size={16} strokeWidth={2} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
