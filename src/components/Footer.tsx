import { ArrowUp } from 'lucide-react';
import { Link } from '../lib/router';
import { Wordmark, XMark } from './Wordmark';
import './Footer.css';

const columns = [
  {
    title: 'Explore',
    links: [
      { href: '/services', label: 'Services' },
      { href: '/solutions', label: 'Solutions' },
      { href: '/work', label: 'Work' },
      { href: '/reviews', label: 'Reviews' },
    ],
  },
  {
    title: 'Studio',
    links: [
      { href: '/process', label: 'Process' },
      { href: '/studio', label: 'About the studio' },
      { href: '/faq', label: 'FAQ' },
    ],
  },
  {
    title: 'Start',
    links: [
      { href: '/contact', label: 'Project inquiry' },
      { href: '/', label: 'Back to home' },
    ],
  },
];

/**
 * Site footer.
 *
 * The link columns now point to the individual pages, so the footer works as
 * a sitemap as well as a second chance to navigate. No invented legal pages,
 * addresses or registration numbers.
 */
export function Footer() {
  // Computed per render so the copyright does not need an annual edit.
  const year = new Date().getFullYear();

  return (
    <footer className="footer on-ink">
      <div className="container">
        <div className="footer__top">
          <Link className="footer__brand-link" href="/" aria-label="TechX, home">
            <Wordmark className="footer__wordmark" />
          </Link>
        </div>

        <div className="footer__main">
          <div className="footer__statement">
            <XMark />
            <p>
              Web applications, mobile apps, and brand systems
              <br />
              built around the problems you need solved.
            </p>
          </div>

          <nav className="footer__cols" aria-label="Footer">
            {columns.map((column) => (
              <div key={column.title}>
                <p className="micro footer__col-title">{column.title}</p>
                <ul>
                  {column.links.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href}>{link.label}</Link>
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
          <Link className="footer__top-link" href="/">
            Back to top
            <ArrowUp size={14} strokeWidth={2} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </footer>
  );
}
