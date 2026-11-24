import type { ServiceId } from '../data/site';
import type { Preselect } from '../lib/preselect';
import { Link } from '../lib/router';
import { Contact } from '../components/Contact';
import { Faq } from '../components/Faq';
import { Process } from '../components/Process';
import { Reviews } from '../components/Reviews';
import { Services } from '../components/Services';
import { Solutions } from '../components/Solutions';
import { Studio } from '../components/Studio';
import { Work } from '../components/Work';
import { PageCrumb, PageCta, PageHero } from './PageUi';
import './Pages.css';

interface DiscussProps {
  onDiscuss: (service: ServiceId) => void;
}

export function ServicesPage({ onDiscuss }: DiscussProps) {
  return (
    <>
      <PageCrumb label="Services" />
      <PageHero
        variant="services"
        title={
          <>
            The right fix for the <em>real</em> problem.
          </>
        }
        lede="Web applications, mobile apps, and brand identities. We start with how your business works today, then build only what moves it forward."
        actions={[
          { label: 'Start a project', href: '/contact', primary: true },
          { label: 'See common scenarios', href: '/solutions' },
        ]}
        note="Every engagement starts with discovery, not a feature list."
      />
      <div className="page-body">
        <Services onDiscuss={onDiscuss} />
      </div>
      <PageCta
        variant="accent"
        title={
          <>
            Not sure which one <em>fits?</em>
          </>
        }
        text="You do not need a spec or a solution in mind. Describe where the work breaks down and we will recommend the smallest useful starting point."
        secondary={{ label: 'See common scenarios', href: '/solutions' }}
      />
    </>
  );
}

export function SolutionsPage({ onDiscuss }: DiscussProps) {
  return (
    <>
      <PageCrumb label="Solutions" />
      <PageHero
        variant="solutions"
        title={
          <>
            Start with the <em>problem.</em>
          </>
        }
        lede="You probably already know what is broken. These are four common situations and the product we would build to remove the friction. Your business sets the real scope."
        actions={[
          { label: 'Describe your situation', href: '/contact', primary: true },
          { label: 'Browse services', href: '/services' },
        ]}
      />
      <div className="page-body">
        <Solutions onDiscuss={onDiscuss} />
      </div>
      <PageCta
        variant="sage"
        title={
          <>
            Something else in <em>mind?</em>
          </>
        }
        text="Good. Most problems do not fit a neat category. Tell us what is happening in your business and we will shape an approach around it."
        secondary={{ label: 'Browse the services', href: '/services' }}
      />
    </>
  );
}

export function WorkPage() {
  return (
    <>
      <PageCrumb label="Work" />
      <PageHero
        variant="work"
        title={
          <>
            Work you can <em>visit.</em>
          </>
        }
        lede="Do not take a portfolio at face value. Every project here is a live product you can open, click through, and judge for yourself."
        actions={[
          { label: 'Start a project', href: '/contact', primary: true },
          { label: 'See how we work', href: '/process' },
        ]}
        note="Built for real businesses, still running today."
      />
      <div className="page-body">
        <Work />
      </div>
      <PageCta
        variant="ink"
        title={
          <>
            Your problem, the next <em>project.</em>
          </>
        }
        text="Tell us what your business needs to do better. We will show you how we would approach it and what you would get at each stage."
        secondary={{ label: 'See our process', href: '/process' }}
      />
    </>
  );
}

export function ProcessPage() {
  return (
    <>
      <PageCrumb label="Process" />
      <PageHero
        variant="process"
        title={
          <>
            From the problem to a product you <em>own.</em>
          </>
        }
        lede="No black box. Each phase turns uncertainty into a decision, a visible output, and a chance for you to steer."
        actions={[
          { label: 'Talk through your project', href: '/contact', primary: true },
          { label: 'Read the FAQ', href: '/faq' },
        ]}
      />
      <div className="page-body">
        <Process />
      </div>
      <PageCta
        variant="cream"
        title={
          <>
            Start with a <em>conversation.</em>
          </>
        }
        text="Scope, timing, and fees come after we understand what is broken. A short note is enough to begin."
        secondary={{ label: 'Read the FAQ', href: '/faq' }}
      />
    </>
  );
}

export function StudioPage() {
  return (
    <>
      <PageCrumb label="Studio" />
      <PageHero
        variant="studio"
        title={
          <>
            One team for the problem <em>and</em> the build.
          </>
        }
        lede="Design and engineering sit in the same conversation. The thing you approve is the thing that ships, with no translation loss between disciplines."
        actions={[
          { label: 'Work with us', href: '/contact', primary: true },
          { label: 'See our work', href: '/work' },
        ]}
      />
      <div className="page-body">
        <Studio />
      </div>
      <PageCta
        variant="ink"
        title={
          <>
            Work with the people who <em>build it.</em>
          </>
        }
        text="Direct contact from the first call to handover. No account layers, no relay race, and nobody passing your problem along."
        secondary={{ label: 'See our process', href: '/process' }}
      />
    </>
  );
}

export function ReviewsPage() {
  return (
    <>
      <PageCrumb label="Reviews" />
      <PageHero
        variant="reviews"
        title={
          <>
            Feedback, in their <em>words.</em>
          </>
        }
        lede="Clear questions, visible progress, work that lands. Here is what clients say after working with us."
        actions={[
          { label: 'Join them', href: '/contact', primary: true },
          { label: 'See selected work', href: '/work' },
        ]}
        note="Published with permission from each client."
      />
      <div className="page-body">
        <Reviews />
      </div>
      <PageCta
        variant="accent"
        title={
          <>
            Let us make your next project <em>simple.</em>
          </>
        }
        text="Tell us what is getting in the way. We will bring the questions, the structure, and a clear next step."
        secondary={{ label: 'See selected work', href: '/work' }}
      />
    </>
  );
}

export function FaqPage() {
  return (
    <>
      <PageCrumb label="FAQ" />
      <PageHero
        variant="faq"
        title={
          <>
            Questions, answered <em>plainly.</em>
          </>
        }
        lede="The practical things companies ask before trusting a studio with a project. If yours is not here, ask it directly."
        actions={[
          { label: 'Ask a question', href: '/contact', primary: true },
          { label: 'About the studio', href: '/studio' },
        ]}
      />
      <div className="page-body">
        <Faq />
      </div>
      <PageCta
        variant="sage"
        title={
          <>
            Just <em>ask.</em>
          </>
        }
        text="If your question is not here, send it directly. A real person reads every note and answers with what you actually need to know."
        secondary={{ label: 'About the studio', href: '/studio' }}
      />
    </>
  );
}

export function ContactPage({ preselect }: { preselect: Preselect | null }) {
  return (
    <>
      <PageCrumb label="Contact" />
      <PageHero
        variant="contact"
        title={
          <>
            Tell us what is <em>not</em> working.
          </>
        }
        lede="Describe the bottleneck, who it affects, and what a good outcome looks like. We will reply with a practical next step and a few questions if we need them."
        note="No obligation, no long form, and no sales script."
      />
      <div className="page-body">
        <Contact preselect={preselect} />
      </div>
    </>
  );
}

export function NotFound() {
  return (
    <section className="section not-found">
      <div className="container not-found__inner">
        <h1 className="section-title">
          That page is not <em>here.</em>
        </h1>
        <p className="section-lede">
          The link may be old, or the address may have a typo. Head back to the home page or pick a
          section from the menu.
        </p>
        <div className="not-found__actions">
          <Link className="btn btn--ink" href="/">
            Back to home
          </Link>
          <Link className="text-link" href="/contact">
            Start a project
          </Link>
        </div>
      </div>
    </section>
  );
}
