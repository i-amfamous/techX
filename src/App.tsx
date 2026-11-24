import { useCallback, useEffect, useRef, useState } from 'react';
import type { ServiceId } from './data/site';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { RouterProvider, useRoute } from './lib/router';
import type { Preselect } from './lib/preselect';
import { Home } from './pages/Home';
import {
  ContactPage,
  FaqPage,
  NotFound,
  ProcessPage,
  ReviewsPage,
  ServicesPage,
  SolutionsPage,
  StudioPage,
  WorkPage,
} from './pages/Pages';

const pageMeta: Record<string, { title: string; description: string }> = {
  '/': {
    title: 'Technology and creative studio',
    description:
      'TechX turns business bottlenecks into web applications, mobile apps, and brand systems your team can own.',
  },
  '/services': {
    title: 'Services',
    description:
      'Web applications, mobile apps, and brand identities built around the way your business actually works.',
  },
  '/solutions': {
    title: 'Solutions',
    description:
      'Common business problems and the products TechX would build to remove the friction.',
  },
  '/work': {
    title: 'Selected work',
    description: 'Live websites and products built by TechX for real businesses. Open the work for yourself.',
  },
  '/process': {
    title: 'Process',
    description: 'A clear five phase path from first conversation to a launched product your team can own.',
  },
  '/studio': {
    title: 'Studio',
    description: 'Design and engineering in one team, so what you approve is what gets built.',
  },
  '/reviews': {
    title: 'Client reviews',
    description: 'Feedback from clients who have worked with TechX, published with their permission.',
  },
  '/faq': {
    title: 'FAQ',
    description: 'Answers about how TechX starts projects, works with your team, and hands over the work.',
  },
  '/contact': {
    title: 'Start a project',
    description: 'Describe the bottleneck and get a clear next step from a real person at TechX.',
  },
};

const fallbackDescription =
  'TechX builds web applications, mobile apps, and brand systems that remove the friction in your business.';

function Site() {
  const { path } = useRoute();
  const [preselect, setPreselect] = useState<Preselect | null>(null);
  const nonce = useRef(0);

  const handleDiscuss = useCallback((service: ServiceId) => {
    nonce.current += 1;
    setPreselect({ service, nonce: nonce.current });
  }, []);

  // Keep the browser and sharing cards in step with the visible page.
  useEffect(() => {
    const meta = pageMeta[path];
    const title = `${meta?.title ?? 'Page not found'} | TechX`;
    document.title = title;

    document
      .querySelector('meta[name="description"]')
      ?.setAttribute('content', meta?.description ?? fallbackDescription);
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', title);
    document.querySelector('meta[name="twitter:title"]')?.setAttribute('content', title);
  }, [path]);

  // A service choice belongs to the inquiry that follows it. Once the visitor
  // leaves the contact page, drop it so a later visit starts clean.
  useEffect(() => {
    if (path !== '/contact') setPreselect(null);
  }, [path]);

  const page = () => {
    switch (path) {
      case '/':
        return <Home />;
      case '/services':
        return <ServicesPage onDiscuss={handleDiscuss} />;
      case '/solutions':
        return <SolutionsPage onDiscuss={handleDiscuss} />;
      case '/work':
        return <WorkPage />;
      case '/process':
        return <ProcessPage />;
      case '/studio':
        return <StudioPage />;
      case '/reviews':
        return <ReviewsPage />;
      case '/faq':
        return <FaqPage />;
      case '/contact':
        return <ContactPage preselect={preselect} />;
      default:
        return <NotFound />;
    }
  };

  return (
    <>
      {/* First tab stop on purpose: keyboard users can jump the nav. */}
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <Header />

      <main id="main">{page()}</main>

      <Footer />
    </>
  );
}

export default function App() {
  return (
    <RouterProvider>
      <Site />
    </RouterProvider>
  );
}
