import { ArrowUpRight } from 'lucide-react';
import { Hero, HeroAssurance, Ticker } from '../components/Hero';
import { Highlights } from '../components/Highlights';
import { Link } from '../lib/router';
import { revealDelay, useReveal } from '../lib/useReveal';
import { PageCta } from './PageUi';
import './Home.css';

/**
 * Short landing page.
 *
 * The long single-page story now lives on separate routes. Home keeps the
 * introduction and a compact map, then lets visitors choose where to go next.
 */
const places = [
  {
    index: '01',
    title: 'Services',
    text: 'Web apps, mobile apps, and brand systems built around your workflow.',
    href: '/services',
  },
  {
    index: '02',
    title: 'Solutions',
    text: 'Recognise the problem? See the product we would build around it.',
    href: '/solutions',
  },
  {
    index: '03',
    title: 'Work',
    text: 'Live products you can open and judge for yourself.',
    href: '/work',
  },
  {
    index: '04',
    title: 'Process',
    text: 'How a messy problem becomes a launched, documented product.',
    href: '/process',
  },
  {
    index: '05',
    title: 'Studio',
    text: 'One team for design and engineering, so nothing gets lost.',
    href: '/studio',
  },
  {
    index: '06',
    title: 'Reviews',
    text: 'What clients say about working with us.',
    href: '/reviews',
  },
  {
    index: '07',
    title: 'FAQ',
    text: 'The practical answers before you commit.',
    href: '/faq',
  },
  {
    index: '08',
    title: 'Contact',
    text: 'Describe the bottleneck and get a clear first step.',
    href: '/contact',
  },
];

export function Home() {
  const ref = useReveal<HTMLElement>();

  return (
    <>
      <Hero />
      <HeroAssurance />
      <Ticker />
      <Highlights />

      <section className="section home-map" id="explore" ref={ref} aria-labelledby="explore-title">
        <div className="container">
          <div className="section-head">
            <div>
              <h2 className="section-title reveal" id="explore-title" style={revealDelay(0)}>
                See how we would solve <em>yours.</em>
              </h2>
            </div>
            <p className="section-lede reveal" style={revealDelay(1)}>
              Start with the problem you recognise, then explore the service, the process, and the
              live work behind it.
            </p>
          </div>

          <div className="home-map__grid">
            {places.map((place, index) => (
              <Link
                className="home-card reveal"
                href={place.href}
                key={place.href}
                style={revealDelay(index % 4, 70)}
              >
                <span className="home-card__top">
                  <span className="home-card__index">{place.index}</span>
                  <ArrowUpRight size={17} strokeWidth={1.9} aria-hidden="true" />
                </span>
                <span className="home-card__title">{place.title}</span>
                <span className="home-card__text">{place.text}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <PageCta
        title={
          <>
            Bring us the <em>bottleneck.</em>
          </>
        }
        text="Tell us what is getting in the way, who it affects, and what a good outcome looks like. We will come back with a practical first step, not a sales pitch."
        secondary={{ label: 'See selected work', href: '/work' }}
      />
    </>
  );
}
