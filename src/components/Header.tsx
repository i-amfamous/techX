import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  ArrowUpRight,
  Briefcase,
  HelpCircle,
  Lightbulb,
  Star,
  Users,
  Workflow,
  Wrench,
  type LucideIcon,
} from 'lucide-react';
import { navLinks } from '../data/site';
import { Link, useRoute } from '../lib/router';
import { Wordmark, XMark } from './Wordmark';
import './Header.css';

const MOBILE_BREAKPOINT = 980;

const navIcons: Record<string, LucideIcon> = {
  '/services': Wrench,
  '/solutions': Lightbulb,
  '/work': Briefcase,
  '/process': Workflow,
  '/studio': Users,
  '/reviews': Star,
  '/faq': HelpCircle,
};

/**
 * Sticky site header.
 *
 * Desktop navigation is generated from `navLinks`; below 980px the same list
 * becomes a full-screen menu. The breakpoint lives in both `Header.css` and the
 * resize handler below, so change them together.
 *
 * The menu is portalled to `document.body`. The header uses `backdrop-filter`,
 * which makes it the containing block for fixed-position children, so a menu
 * rendered inside it would be measured against the short header bar instead of
 * the viewport. The portal keeps the overlay full height on every browser.
 */
export function Header() {
  const { path } = useRoute();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close the menu whenever the route changes, including back and forward.
  useEffect(() => {
    setOpen(false);
  }, [path]);

  // The bar only grows a hairline and a stronger background after the page
  // starts moving. Doing this in React rather than with a scroll listener in
  // CSS keeps the state readable, and the handler is passive.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /**
   * Mobile menu housekeeping.
   *
   * `inert` removes everything outside the menu from the tab order and the
   * accessibility tree, so there is no hand-rolled focus trap to get wrong.
   * The header stays interactive so the toggle can always close the menu.
   */
  useEffect(() => {
    if (!open) return;

    const outside = [
      document.querySelector('.skip-link'),
      document.querySelector('main'),
      document.querySelector('footer'),
    ].filter((element): element is Element => element !== null);

    outside.forEach((element) => element.setAttribute('inert', ''));
    document.body.classList.add('menu-open');

    // Wait a frame so the portal is mounted and its first link is focusable.
    const focusTimer = window.setTimeout(() => {
      menuRef.current?.querySelector<HTMLElement>('a, button')?.focus();
    }, 60);

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setOpen(false);
      toggleRef.current?.focus();
    };

    const onResize = () => {
      if (window.innerWidth > MOBILE_BREAKPOINT) setOpen(false);
    };

    document.addEventListener('keydown', onKeyDown);
    window.addEventListener('resize', onResize);

    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('resize', onResize);
      outside.forEach((element) => element.removeAttribute('inert'));
      document.body.classList.remove('menu-open');
    };
  }, [open]);

  const close = () => setOpen(false);

  const menu = open
    ? createPortal(
        <div
          id="mobile-menu"
          ref={menuRef}
          className="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Site navigation"
        >
          <div className="container mobile-menu__inner">
            <p className="mobile-menu__label">
              <XMark /> Menu
            </p>

            <nav aria-label="Mobile">
              <ul className="mobile-menu__list">
                {navLinks.map((link) => {
                  const Icon = navIcons[link.href] ?? ArrowUpRight;
                  return (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        onClick={close}
                        aria-current={path === link.href ? 'page' : undefined}
                      >
                        <span className="mobile-menu__icon" aria-hidden="true">
                          <Icon size={18} strokeWidth={1.8} />
                        </span>
                        <span>{link.label}</span>
                        <ArrowUpRight className="mobile-menu__arrow" size={18} strokeWidth={1.8} aria-hidden="true" />
                      </Link>
                    </li>
                  );
                })}
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
        </div>,
        document.body,
      )
    : null;

  return (
    <>
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
            <span className="menu-toggle__bars" aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
          </button>
        </div>
      </header>

      {menu}
    </>
  );
}
