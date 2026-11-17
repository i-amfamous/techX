/**
 * TechX site content.
 *
 * This is the content boundary. Copy that a non-developer is likely to edit
 * lives here; layout-specific wording stays next to its component. Only fields
 * the page actually renders are included, so this file never drifts into a
 * description of a site that does not exist.
 *
 * Honesty rule: owner details stay `null` or empty until the studio supplies
 * them. The UI shows visible placeholders instead of invented facts.
 */

export type ServiceId = 'web' | 'mobile' | 'brand';

export interface Service {
  id: ServiceId;
  index: string;
  title: string;
  tagline: string;
  problem: string;
  approach: string;
  deliverables: string[];
  goodFor: string;
}

export interface Solution {
  id: string;
  index: string;
  tag: string;
  title: string;
  situation: string;
  approach: string;
  blocks: string[];
  service: ServiceId;
}

export interface Concept {
  id: string;
  index: string;
  title: string;
  subtitle: string;
  description: string;
  tags: string[];
  visual: 'dashboard' | 'mobile' | 'brand';
}

export interface ProcessStep {
  number: string;
  title: string;
  summary: string;
  activities: string[];
  outcome: string;
}

export interface Principle {
  number: string;
  title: string;
  text: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface OwnerDetails {
  /** Add a real address to show a contact link instead of the placeholder. */
  email: string | null;
  /** Add a city / working model to replace the placeholder. */
  location: string | null;
  /** Add { label, url } entries to show real social links. */
  social: { label: string; url: string }[];
}

export const site = {
  hero: {
    // Keep the headline short enough to sit on one line on desktop.
    headline: 'Ideas, made useful',
    intro:
      'TechX is a technology and creative studio. We design and build web applications, mobile apps, and brand identities that turn a clear idea into something people can use.',
    primaryCta: { label: 'Start a project', href: '#contact' },
    secondaryCta: { label: 'Explore services', href: '#services' },
  },

  /**
   * FORM INTEGRATION
   * Paste a form endpoint (Formspree, Basin, Netlify Forms proxy, your own API…)
   * into `formEndpoint`. The form POSTs JSON with an `Accept: application/json`
   * header. While it is empty, the form runs in an honest demo mode and does
   * not pretend to send anything. See README.md for details.
   */
  formEndpoint: '',

  owner: {
    email: null,
    location: null,
    social: [] as OwnerDetails['social'],
  } satisfies OwnerDetails,
};

export const services: Service[] = [
  {
    id: 'web',
    index: '01',
    title: 'Web application development',
    tagline: 'Internal tools, customer portals, and platforms built around how your business actually works.',
    problem:
      'The work runs on spreadsheets, email threads, and software that almost fits. Data is entered twice, nobody is sure which version is current, and the tools slow the team down instead of helping.',
    approach:
      'We design and build web applications around the real workflow: internal tools, customer portals, dashboards, booking systems, and platforms that need to be dependable every day. Clear interfaces, sensible data models, and room to grow.',
    deliverables: [
      'Product scoping and user flows',
      'Custom web application development',
      'Dashboards and data views',
      'APIs and third-party integrations',
      'Accessibility, performance, and launch support',
    ],
    goodFor: 'Operations platforms, client portals, SaaS products, and replacing fragile internal tools.',
  },
  {
    id: 'mobile',
    index: '02',
    title: 'iOS & Android app development',
    tagline: 'Mobile products with a native feel, including the unglamorous parts like offline behaviour and release support.',
    problem:
      'A mobile experience that feels slow, breaks without signal, or asks customers to do too much gets deleted. Field teams need tools that work in bad conditions, not just at a desk.',
    approach:
      'We build mobile products for iOS and Android, from customer-facing apps to tools for people working away from a desk. Considered touch ergonomics, reliable offline behaviour, and a release process you can trust.',
    deliverables: [
      'Mobile product and interaction design',
      'iOS and Android development',
      'Offline-first data and sync',
      'Push notifications and device features',
      'App Store and Google Play release support',
    ],
    goodFor: 'Field tools, on-the-go customer experiences, companion apps, and offline workflows.',
  },
  {
    id: 'brand',
    index: '03',
    title: 'Graphic design & brand identity',
    tagline: 'A visual system that says one clear thing across your site, your product, and your pitch deck.',
    problem:
      'When the logo, website, deck, and app all feel like different companies, trust drops. A brand that is not written down is expensive to apply and easy to dilute as the team grows.',
    approach:
      'We create clear, practical identities: positioning, logotype and marks, typography, colour, art direction, and the design system that keeps it coherent across print and screen.',
    deliverables: [
      'Brand strategy and positioning',
      'Logotype, marks, and visual identity',
      'Typography, colour, and art direction',
      'Brand guidelines',
      'Digital design systems and templates',
    ],
    goodFor: 'New companies, repositioning, product launches, and teams that need one shared visual language.',
  },
];

export const solutions: Solution[] = [
  {
    id: 'operations',
    index: '01',
    tag: 'Operations',
    title: 'The business has outgrown the spreadsheet.',
    situation:
      'Core work is spread across spreadsheets, inboxes, and a legacy tool nobody wants to touch. Handovers get lost and reporting takes a day of copy-paste.',
    approach:
      'We map the real workflow, then build a focused internal web application with roles, approvals, audit history, and the reports the team actually needs.',
    blocks: ['Workflow mapping', 'Roles & permissions', 'Reporting', 'Data migration'],
    service: 'web',
  },
  {
    id: 'portal',
    index: '02',
    tag: 'Customer experience',
    title: 'Customers keep asking for the same things by email.',
    situation:
      'Onboarding, documents, order updates, and support all happen through a shared inbox. Customers cannot find answers and the team cannot see the whole relationship.',
    approach:
      'We design a secure self-service portal: clear onboarding steps, the documents people need, notifications, and integrations with the systems already in use.',
    blocks: ['Secure sign-in', 'Self-service flows', 'Notifications', 'System integrations'],
    service: 'web',
  },
  {
    id: 'field',
    index: '03',
    tag: 'Field operations',
    title: 'The work happens away from a desk.',
    situation:
      'Technicians, inspectors, or crews capture information on paper or in photos, then re-enter it at the end of the day. Details arrive late, incomplete, or not at all.',
    approach:
      'We build an offline-first mobile app for checklists, photos, notes, and signatures, designed for one hand, bright sun, and no signal. Data syncs when the connection returns.',
    blocks: ['Offline capture', 'Guided checklists', 'Photo & signature capture', 'Background sync'],
    service: 'mobile',
  },
  {
    id: 'identity',
    index: '04',
    tag: 'Brand',
    title: 'The company has changed. The brand has not.',
    situation:
      'The business has grown into a more capable, more premium company, but the visual identity still looks like the early days. Every new deck and page is designed from scratch.',
    approach:
      'We reposition the identity, create a distinctive visual system, and apply it to the places that matter first: the website, product UI, and sales materials.',
    blocks: ['Positioning', 'Identity system', 'Design tokens', 'Brand guidelines'],
    service: 'brand',
  },
];

export const concepts: Concept[] = [
  {
    id: 'meridian',
    index: '01',
    title: 'Meridian',
    subtitle: 'Operations workspace',
    description:
      'A dense but calm web application concept: live status, exceptions, and reporting in one place. An exploration of information hierarchy, data density, and keyboard-friendly workflows.',
    tags: ['Web application', 'Data views', 'Design system'],
    visual: 'dashboard',
  },
  {
    id: 'fieldnote',
    index: '02',
    title: 'Fieldnote',
    subtitle: 'Mobile inspection app',
    description:
      'An offline-first companion for people working on site. Large targets, obvious states, and a capture flow designed for one hand and no signal.',
    tags: ['iOS & Android', 'Offline-first', 'Mobile UX'],
    visual: 'mobile',
  },
  {
    id: 'aurelia',
    index: '03',
    title: 'Aurelia',
    subtitle: 'Identity system',
    description:
      'A warm, editorial identity for a fictional advisory firm. One type system and a simple mark carried across a website, a pitch deck, and a product interface.',
    tags: ['Brand identity', 'Art direction', 'Design system'],
    visual: 'brand',
  },
];

export const processSteps: ProcessStep[] = [
  {
    number: '01',
    title: 'Listen & define',
    summary:
      'We start with the problem, not the feature list. Conversations with the people who use the product and the people who run the business.',
    activities: ['Stakeholder conversations', 'Constraints and context', 'Success criteria', 'Scope and priorities'],
    outcome: 'A clear brief, a recommended approach, and a scope you can react to.',
  },
  {
    number: '02',
    title: 'Shape the experience',
    summary:
      'We make the complicated parts visible before anything is built: the structure, the flows, and the visual direction.',
    activities: ['Information architecture', 'User flows and wireframes', 'Visual direction', 'Design system foundations'],
    outcome: 'Flows and designs you can review, question, and improve.',
  },
  {
    number: '03',
    title: 'Design & build',
    summary:
      'Design and engineering work together in short, visible cycles. You see working software, not just status updates.',
    activities: ['Interface design', 'Front-end and back-end build', 'Design system in code', 'Regular check-ins'],
    outcome: 'Working software in a staging environment, reviewed together.',
  },
  {
    number: '04',
    title: 'Test & launch',
    summary:
      'We test on real devices, tighten the details, and prepare the release. Launch day should be a checklist, not a surprise.',
    activities: ['Cross-device QA', 'Accessibility and performance checks', 'Deployment', 'Store submission where relevant'],
    outcome: 'A production release, a launch record, and a clear rollback path.',
  },
  {
    number: '05',
    title: 'Support & handover',
    summary:
      'The work should outlive the engagement. We document what was built and help your team take it forward.',
    activities: ['Documentation', 'Walkthroughs and training', 'Support arrangement', 'Next-phase roadmap'],
    outcome: 'A codebase and design system your team can own and extend.',
  },
];

export interface Review {
  id: string;
  quote: string;
  name: string;
  role: string;
}

/**
 * Client reviews.
 *
 * These are intentionally empty placeholder slots. Replace `quote`, `name` and
 * `role` only with a quote the client has approved for publication.
 */
export const reviews: Review[] = [
  {
    id: 'review-1',
    quote:
      'A specific, approved quote from the client will sit here: the problem they brought, what working together was like, and what changed.',
    name: 'Client name',
    role: 'Role, company',
  },
  {
    id: 'review-2',
    quote:
      'Replace this with a short review in the client\u2019s own words. Keep it concrete and avoid invented results or ratings.',
    name: 'Client name',
    role: 'Role, company',
  },
  {
    id: 'review-3',
    quote:
      'Reviews are published only with permission. Add the client, their role, and a link to the project when the first engagement is complete.',
    name: 'Client name',
    role: 'Role, company',
  },
];

export const principles: Principle[] = [
  {
    number: '01',
    title: 'Clarity before decoration',
    text: 'The interface should explain the business, not show off. We spend time on structure, language, and hierarchy before surface styling.',
  },
  {
    number: '02',
    title: 'Design and engineering together',
    text: 'The people shaping the experience and the people building it work as one team, so decisions survive the handover.',
  },
  {
    number: '03',
    title: 'Build for the day after launch',
    text: 'Maintainable code, documented decisions, and a design system that can grow. The launch is the beginning of the product’s life.',
  },
  {
    number: '04',
    title: 'Plain communication',
    text: 'Clear scope, visible progress, and honest trade-offs. You should never need a translator to understand where a project stands.',
  },
];

export const faqs: FaqItem[] = [
  {
    id: 'faq-start',
    question: 'How do we start a project?',
    answer:
      'Send a short note through the inquiry form with the problem, who it affects, and what a good outcome would look like. We will follow up to arrange a short introductory call, then propose a scope and a way forward.',
  },
  {
    id: 'faq-types',
    question: 'What kinds of projects do you take on?',
    answer:
      'Web applications, iOS and Android apps, brand identities, and combinations of the three. That includes new products, customer portals, internal tools, rebrands, and improving something that already exists.',
  },
  {
    id: 'faq-existing',
    question: 'Can you work with our existing team or codebase?',
    answer:
      'Yes. We start by reviewing what exists and where the friction is. From there we can work alongside an in-house team, take a defined slice of the product, or lead the whole build, whichever makes sense.',
  },
  {
    id: 'faq-platforms',
    question: 'Do you build for both iOS and Android?',
    answer:
      'Yes. We recommend a cross-platform or platform-specific approach after understanding the product, the device features involved, and your constraints. The recommendation and its trade-offs are part of the proposal.',
  },
  {
    id: 'faq-pricing',
    question: 'How do you price work?',
    answer:
      'After discovery, we scope the work and propose either a fixed-scope project fee or an ongoing support arrangement. Good estimates need real context, so we do not quote a number before understanding the problem.',
  },
  {
    id: 'faq-timeline',
    question: 'How long does a project take?',
    answer:
      'It depends on scope. The proposal maps the phases, milestones, and review points before work begins, so you can see what happens when. Concept work and new scopes are estimated separately.',
  },
  {
    id: 'faq-ownership',
    question: 'Who owns the work?',
    answer:
      'Ownership, licensing, and handover are agreed in writing in the project agreement. Final design files, source code, and documentation are transferred according to those terms.',
  },
  {
    id: 'faq-input',
    question: 'What do you need from us?',
    answer:
      'A decision-maker who can give feedback, access to the people closest to the problem, and timely answers at the review points. We keep the rest lightweight.',
  },
];

export const navLinks = [
  { href: '#services', label: 'Services' },
  { href: '#solutions', label: 'Solutions' },
  { href: '#work', label: 'Concept work' },
  { href: '#process', label: 'Process' },
  { href: '#studio', label: 'Studio' },
  { href: '#reviews', label: 'Reviews' },
  { href: '#faq', label: 'FAQ' },
];
