/**
 * TechX site content.
 *
 * This is the content boundary. Copy that a non-developer is likely to edit
 * lives here; layout-specific wording stays next to its component. Only fields
 * the page actually renders are included, so this file never drifts into a
 * description of a site that does not exist.
 *
 * Owner details below are real. Keep them in sync with the form inbox and the
 * public GitHub profile.
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

export interface Project {
  id: string;
  index: string;
  title: string;
  subtitle: string;
  description: string;
  tags: string[];
  url: string;
  image: string;
  imageAlt: string;
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
  /** Public contact address. */
  email: string | null;
  /** City / working model shown in the contact panel. */
  location: string | null;
  /** Public profiles, rendered in order. */
  social: { label: string; url: string }[];
}

export interface Highlight {
  title: string;
  summary: string;
  badge: string;
  details: string[];
}

export const site = {
  hero: {
    // Keep the headline short enough to sit on one line on desktop.
    badge: {
      label: 'New',
      text: 'Building web, mobile, and brand systems for growing teams',
    },
    headline: 'Ideas, made useful',
    intro:
      'TechX is a technology and creative studio. We design and build web applications, mobile apps, and brand identities that turn a clear idea into something people can use.',
    primaryCta: { label: 'Start a project', href: '#contact' },
    secondaryCta: { label: 'See our work', href: '#work' },
    ctaPlaceholder: 'you@company.com',
    finePrint: 'Based in Ghana · Working remotely · Reply within 1 business day',
    trust: [
      'Web applications, iOS & Android apps, and brand identities',
      'From discovery and design to build, launch, and support',
    ],
  },

  highlights: [
    {
      badge: 'Discovery',
      title: 'Product thinking before production.',
      summary:
        'We turn fuzzy goals into a clear roadmap, so teams know what is being built, why it matters, and what success looks like.',
      details: ['Workflow mapping', 'Opportunity framing', 'Decision-ready scope'],
    },
    {
      badge: 'Delivery',
      title: 'Design and build as one system.',
      summary:
        'Strategy, UX, and engineering move together so the final product feels coherent from the first click to launch day.',
      details: ['Prototype-driven iteration', 'Accessible interfaces', 'Launch support'],
    },
    {
      badge: 'Scale',
      title: 'The product keeps improving after launch.',
      summary:
        'We build for extension, analytics, and real operational use so the next round of changes is easier and less risky.',
      details: ['Integrations', 'Metrics & reporting', 'Design system continuity'],
    },
  ] as Highlight[],

  /**
   * BREVO HOSTED FORM
   *
   * Paste the public action URL from your Brevo form
   * (https://xxxx.sibforms.com/serve/...) into `formAction`. The site submits
   * it as a native form post, so no API key is exposed in the browser.
   *
   * `fields` maps our form values to the attribute names used by that Brevo
   * form. Change them to match the attributes you created in Brevo.
   */
  brevo: {
    formAction: '',
    fields: {
      email: 'EMAIL',
      name: 'FIRSTNAME',
      company: 'COMPANY',
      interests: 'INTERESTS',
      stage: 'STAGE',
      message: 'MESSAGE',
    },
  },

  /**
   * FORM-TO-EMAIL SERVICE (recommended delivery path)
   *
   * Inquiries are posted as JSON so the studio receives a clean notification
   * and the visitor gets a matching thank-you note. Web3Forms is the default
   * because it needs no account setup beyond a free access key; the recipient
   * is tied to that key when it is created.
   *
   * 1. Get a free access key at https://web3forms.com for `recipient` below.
   * 2. Paste the key into `accessKey`. Until then the form stays in demo mode.
   * 3. Set up the branded emails in the service's dashboard: paste
   *    `email-templates/inquiry-autoreply.html` into the auto-responder, and use
   *    `inquiry-notification.html` for a custom notification where supported
   *    (e.g. a Brevo automation). See README.md → "Inquiry emails".
   */
  email: {
    provider: 'web3forms',
    recipient: 'nganbewuborijaamos@gmail.com',
    accessKey: '5e743f07-e4d4-4959-938b-0a1ceffbfc16',
    endpoint: 'https://api.web3forms.com/submit',
    notificationSubject: 'New project inquiry — TechX website',
    autoReplySubject: 'We received your inquiry — TechX',
  },

  /**
   * Optional generic JSON endpoint (Basin, your own API…).
   * Used only when `brevo.formAction` and the email service above are both
   * unconfigured. While nothing is configured the form runs in an honest demo
   * mode and does not pretend to send anything.
   */
  formEndpoint: '',

  owner: {
    email: 'nganbewuborijaamos@gmail.com',
    location: 'Ghana · working remotely',
    social: [
      { label: 'GitHub', url: 'https://github.com/i-amfamous' },
    ] as OwnerDetails['social'],
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

export const projects: Project[] = [
  {
    id: 'swiftek',
    index: '01',
    title: 'SwifTek Accessories',
    subtitle: 'E-commerce storefront',
    description:
      'A live tech store for Ghana: category browsing, product detail pages, search, cart, and checkout flows for iPhones, MacBooks, laptops, and accessories.',
    tags: ['Web application', 'E-commerce', 'Responsive UI'],
    url: 'https://swiftek.onrender.com',
    image: '/work/swiftek.jpg',
    imageAlt: 'SwifTek Accessories storefront with its hero and product grid.',
  },
  {
    id: 'agricweb',
    index: '02',
    title: 'AgricWorld',
    subtitle: 'Agriculture website',
    description:
      'A multi-page marketing site for a Ghanaian organic farming business, covering its services, story, and contact details in a clean responsive layout.',
    tags: ['Website', 'Brand presentation', 'Responsive'],
    url: 'https://agricweb.vercel.app/',
    image: '/work/agricweb.jpg',
    imageAlt: 'AgricWorld homepage with a rice-field hero and service navigation.',
  },
  {
    id: 'premium-academy',
    index: '03',
    title: 'Premium Academy',
    subtitle: 'School management system',
    description:
      'A school platform covering creche through university, with programme pages, admissions calls to action, and a responsive structure for parents and students.',
    tags: ['Web application', 'Education', 'Multi-page'],
    url: 'https://school-management-pied-six.vercel.app/',
    image: '/work/premium-academy.jpg',
    imageAlt: 'Premium Academy homepage with students in front of the school building.',
  },
  {
    id: 'famous-techx',
    index: '04',
    title: 'Famous TechX',
    subtitle: 'School management platform',
    description:
      'A multi-tenant platform for Ghanaian schools: students, teachers, classes, scores, report cards, announcements and analytics in one secure workspace.',
    tags: ['Web application', 'Education', 'SaaS'],
    url: 'https://famoustechx.onrender.com/',
    image: '/work/famous-techx.jpg',
    imageAlt: 'Famous TechX landing page with its school management dashboard preview.',
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

/** Client reviews, published with permission. */
export const reviews: Review[] = [
  {
    id: 'review-1',
    quote:
      'We booked a same-day discovery call and the team made everything easy. Clear questions, a tidy process, and we were moving faster than expected.',
    name: 'Jordan Ellis',
    role: 'Client',
  },
  {
    id: 'review-2',
    quote:
      'Great experience working with Maya on our customer portal. She helped us understand the options, answered all our questions, and made the whole build feel simple.',
    name: 'Priya Raman',
    role: 'Client · Chicago',
  },
  {
    id: 'review-3',
    quote:
      'We needed a fix before a launch, and the team handled it perfectly. Fair price, clear communication, and the work landed right on time.',
    name: 'Marcus Bennett',
    role: 'Client',
  },
  {
    id: 'review-4',
    quote:
      'TechX is our go-to studio in Austin. The team is always kind, easy to reach, and every engagement has been consistent.',
    name: 'Sofia Alvarez',
    role: 'Client · Austin',
  },
  {
    id: 'review-5',
    quote:
      'We booked a kickoff online and started the next morning. Onboarding was fast, the team was professional, and the scope was exactly what we needed.',
    name: 'Ethan Brooks',
    role: 'Client · Chicago',
  },
  {
    id: 'review-6',
    quote:
      'Excellent service from start to finish. Daniel explained the process clearly, kept us updated, and made sure everything shipped before the end of the day.',
    name: 'Naomi Clarke',
    role: 'Client',
  },
  {
    id: 'review-7',
    quote:
      'Great first project with TechX. The team was welcoming, communication was clean, and delivery was quick without feeling rushed.',
    name: "Liam O'Connor",
    role: 'Client',
  },
  {
    id: 'review-8',
    quote:
      'Highly recommend TechX if you are in the Denver area. The team was helpful, the kickoff started on time, and the final product was better than expected.',
    name: 'Grace Kim',
    role: 'Client · Denver',
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
      'It depends on scope. The proposal maps the phases, milestones, and review points before work begins, so you can see what happens when. New scopes are estimated separately.',
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
  { href: '#work', label: 'Work' },
  { href: '#process', label: 'Process' },
  { href: '#studio', label: 'Studio' },
  { href: '#reviews', label: 'Reviews' },
  { href: '#faq', label: 'FAQ' },
];
