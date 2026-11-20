import { useCallback, useRef, useState } from 'react';
import type { ServiceId } from './data/site';
import { Header } from './components/Header';
import { Hero, Ticker } from './components/Hero';
import { Services } from './components/Services';
import { Highlights } from './components/Highlights';
import { Solutions } from './components/Solutions';
import { Work } from './components/Work';
import { Reviews } from './components/Reviews';
import { Process } from './components/Process';
import { Studio } from './components/Studio';
import { Faq } from './components/Faq';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';

/**
 * A service chosen from a card elsewhere on the page.
 *
 * `nonce` exists because the same service can be requested twice in a row
 * (open a card, click "discuss", close, click the same card again). The
 * changing number gives `Contact` a fresh effect dependency each time, so the
 * form re-applies the choice instead of ignoring an identical object.
 */
export interface Preselect {
  service: ServiceId;
  nonce: number;
}

export default function App() {
  const [preselect, setPreselect] = useState<Preselect | null>(null);
  const nonce = useRef(0);

  const handleDiscuss = useCallback((service: ServiceId) => {
    nonce.current += 1;
    setPreselect({ service, nonce: nonce.current });
  }, []);

  return (
    <>
      {/* First tab stop on purpose: keyboard users can jump the nav. */}
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <Header />

      {/*
        Section order is the story: what we do, what that looks like, proof,
        how we work, then the ask.
        Dark bands at Work, Studio and the footer break up the light page.
      */}
      <main id="main">
        <Hero />
        <Ticker />
        <Highlights />
        <Services onDiscuss={handleDiscuss} />
        <Solutions onDiscuss={handleDiscuss} />
        <Work />
        <Process />
        <Reviews />
        <Studio />
        <Faq />
        <Contact preselect={preselect} />
      </main>

      <Footer />
    </>
  );
}
