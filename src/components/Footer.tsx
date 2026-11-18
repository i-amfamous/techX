import { ArrowUp, ArrowUpRight } from 'lucide-react';
import { Wordmark, XMark } from './Wordmark';
import './Footer.css';

const columns = [
  {
    title: 'Explore',
    links: [
      { href: '#services', label: 'Services' },
      { href: '#solutions', label: 'Solutions' },
      { href: '#work', label: 'Work' },
      { href: '#reviews', label: 'Reviews' },
    ],
  },
  {
    title: 'Studio',
    links: [
      { href: '#process', label: 'Process' },
      { href: '#studio', label: 'About the studio' },
      { href: '#faq', label: 'FAQ' },
    ],
  },
  {
    title: 'Start',
    links: [
      { href: '#contact', label: 'Project inquiry' },
      { href: '#top', label: 'Back to top' },
    ],
  },
];

/**
 * Site footer.
 *
 * The link columns intentionally repeat the primary navigation. On a
 * single-page site a footer is a second chance to navigate, not a sitemap; it
 * carries no invented legal pages, addresses or registration numbers.
 */
export function Footer() {
  // Computed per render so the copyright does not need an annual edit.
  const year = new Date().getFullYear();

  return (
    <footer className="footer on-ink">
      <div className="container">
        <div className="footer__top">
          <a className="footer__brand-link" href="#top" aria-label="TechX, back to top">
            <Wordmark className="footer__wordmark" />
          </a>

          <div className="footer__cta">
            <p>Have a problem worth solving?</p>
            <a className="btn btn--bone" href="#contact">
              Start a project
              <ArrowUpRight className="btn__icon" size={16} strokeWidth={2} aria-hidden="true" />
            </a>
          </div>
        </div>

        <div className="footer__main">
          <div className="footer__statement">
            <XMark />
            <p>
              Technology &amp; creative studio
              <br />
              Web · Mobile · Brand identity
            </p>
          </div>

          <nav className="footer__cols" aria-label="Footer">
            {columns.map((column) => (
              <div key={column.title}>
                <p className="micro footer__col-title">{column.title}</p>
                <ul>
                  {column.links.map((link) => (
                    <li key={link.href}>
                      <a href={link.href}>{link.label}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="footer__bottom">
          <p>© {year} TechX. All rights reserved.</p>
          <p className="footer__disclaimer">
            Selected work links to live projects. Client reviews are published only with permission.
          </p>
          <a className="footer__top-link" href="#top">
            Back to top
            <ArrowUp size={14} strokeWidth={2} aria-hidden="true" />
          </a>
        </div>
      </div>
    </footer>
  );
}
