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
    headline: 'Turn the problem into a product',
    intro:
      'Still running key work on spreadsheets, email threads, and tools that almost fit? TechX designs and builds the web applications, mobile apps, and brand systems that remove the friction, so your team can move with clarity.',
    primaryCta: { label: 'Start a project', href: '/contact' },
    secondaryCta: { label: 'See our work', href: '/work' },
    ctaPlaceholder: 'you@company.com',
    finePrint: 'Based in Ghana · Working remotely · Reply within 1 business day',
    trust: [
      'We start with your workflow, not a feature list',
      'Design and engineering in one team, from first call to handover',
      'Live products you can visit before you decide',
    ],
  },

  highlights: [
    {
      badge: 'Discovery',
      title: 'We find the real problem before we build.',
      summary:
        'Most briefs describe a symptom. We map how the work actually happens, agree on what success looks like, and put a scope in writing before anyone writes code.',
      details: ['Workflow mapping', 'Success criteria', 'Decision-ready scope'],
    },
    {
      badge: 'Delivery',
      title: 'One team from design to launch.',
      summary:
        'Strategy, interfaces, and engineering move together. You see working software early and can steer it, instead of waiting for one big reveal at the end.',
      details: ['Prototype-driven iteration', 'Accessible interfaces', 'Launch support'],
    },
    {
      badge: 'After launch',
      title: 'You own it, and it keeps working.',
      summary:
        'We document the decisions, hand over the code and design system, and leave you with a product your team can extend without depending on us.',
      details: ['Documentation', 'Design system continuity', 'Support arrangement'],
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
      phone: 'PHONE',
      whatsapp: 'WHATSAPP',
      interests: 'INTERESTS',
      stage: 'STAGE',
      message: 'MESSAGE',
    },
  },

  /**
   * INQUIRY DELIVERY
   *
   * The form posts to the Netlify function in `netlify/functions/inquiry.mjs`,
   * which sends two branded emails through Brevo: a briefing to the studio and
   * an acknowledgement to the visitor. Both show "TechX" as the sender name.
   *
   * The function needs `BREVO_API_KEY` (and optionally `BREVO_SENDER_EMAIL`)
   * as Netlify environment variables. Without the key it returns an error, so
   * a broken deployment is visible rather than silently losing inquiries.
   * See README.md → "Inquiry emails" for the full setup.
   */
  email: {
    endpoint: '/.netlify/functions/inquiry',
    recipient: 'nganbewuborijaamos@gmail.com',
    fromName: 'TechX',
    notificationSubject: 'New project inquiry | TechX website',
    autoReplySubject: 'We received your inquiry | TechX',
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
    tagline: 'Replace the spreadsheets and near-fit tools with one system built around how your team actually works.',
    problem:
      'Routine work lives in spreadsheets and inboxes. The same data gets entered twice, nobody is sure which version is right, and the tools slow the team down instead of helping.',
    approach:
      'We map the real workflow first, then build an application that fits it: internal tools, customer portals, dashboards, booking systems, and platforms your team can depend on every day.',
    deliverables: [
      'Workflow mapping and product scoping',
      'Custom web application development',
      'Dashboards and reports people actually use',
      'APIs and third-party integrations',
      'Accessibility, performance, and launch support',
    ],
    goodFor: 'Operations platforms, client portals, SaaS products, and replacing fragile internal tools.',
  },
  {
    id: 'mobile',
    index: '02',
    title: 'iOS & Android app development',
    tagline: 'Give field teams and customers tools that work with poor signal, one hand, and real deadlines.',
    problem:
      'An app that feels slow, breaks without signal, or asks people to do too much gets abandoned. Field teams need tools that work out in the world, not just at a desk.',
    approach:
      'We design for the conditions the app will actually be used in, then build for iOS and Android with offline data, sensible touch targets, and a release process you can trust.',
    deliverables: [
      'Mobile product and interaction design',
      'iOS and Android development',
      'Offline-first data and background sync',
      'Push notifications and device features',
      'App Store and Google Play release support',
    ],
    goodFor: 'Field tools, on-the-go customer experiences, companion apps, and offline workflows.',
  },
  {
    id: 'brand',
    index: '03',
    title: 'Graphic design & brand identity',
    tagline: 'One clear identity across your site, product, and sales materials, so every touchpoint earns trust.',
    problem:
      'When the logo, website, deck, and app feel like different companies, confidence drops. A brand that is not written down is expensive to apply and easy to dilute as the team grows.',
    approach:
      'We agree the positioning first, then build a practical identity system: logotype, typography, colour, art direction, and guidelines your team can apply without starting from scratch each time.',
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
      'Core work is split across spreadsheets, inboxes, and a legacy tool nobody wants to touch. Handovers get lost, reporting takes a day of copy-paste, and decisions wait on stale numbers.',
    approach:
      'We map the workflow as it really happens, then build a focused internal application with roles, approvals, audit history, and the reports the team actually needs to act on.',
    blocks: ['Workflow mapping', 'Roles & permissions', 'Reporting', 'Data migration'],
    service: 'web',
  },
  {
    id: 'portal',
    index: '02',
    tag: 'Customer experience',
    title: 'Customers keep asking for the same things by email.',
    situation:
      'Onboarding, documents, order updates, and support all land in a shared inbox. Customers cannot find answers, and the team cannot see the whole relationship in one place.',
    approach:
      'We design a secure self-service portal that lets customers help themselves: clear onboarding steps, the documents they need, timely notifications, and links to the systems you already use.',
    blocks: ['Secure sign-in', 'Self-service flows', 'Notifications', 'System integrations'],
    service: 'web',
  },
  {
    id: 'field',
    index: '03',
    tag: 'Field operations',
    title: 'The work happens away from a desk.',
    situation:
      'Technicians, inspectors, and crews capture information on paper or in photos, then re-enter it at the end of the day. Details arrive late, incomplete, or not at all.',
    approach:
      'We build an offline-first mobile app for checklists, photos, notes, and signatures, designed for one hand, bright sun, and no signal. Data syncs as soon as the connection returns.',
    blocks: ['Offline capture', 'Guided checklists', 'Photo & signature capture', 'Background sync'],
    service: 'mobile',
  },
  {
    id: 'identity',
    index: '04',
    tag: 'Brand',
    title: 'The company has changed. The brand has not.',
    situation:
      'The business is more capable than it was, but the identity still looks like the early days. Every new deck, page, and proposal gets designed from scratch, and the message drifts.',
    approach:
      'We agree the positioning, build a distinctive visual system, and apply it where it matters first: the website, the product interface, and the sales materials your team uses every week.',
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
      'An online store for a tech retailer that needed to sell beyond walk-in traffic. Category browsing, search, product pages, cart, and checkout, built for shoppers on any device.',
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
      'A clear, credible web presence for an organic farming business that needed to explain what it does and make it easy for buyers and partners to get in touch.',
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
      'A school website that organises programmes from creche to university and turns parent interest into clear admissions enquiries on any screen.',
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
      'A multi-tenant platform that brought students, teachers, classes, scores, report cards, announcements, and analytics into one secure workspace instead of scattered files.',
    tags: ['Web application', 'Education', 'SaaS'],
    url: 'https://famoustechx.onrender.com/',
    image: '/work/famous-techx.jpg',
    imageAlt: 'Famous TechX landing page with its school management dashboard preview.',
  },
  {
    id: 'famous-techx-pos',
    index: '05',
    title: 'Famous TechX POS',
    subtitle: 'Point-of-sale platform',
    description:
      'A browser-based till that gives retail teams fast checkout, stock alerts, multiple branches, cashier shifts, and daily sales and profit reports without a fragile spreadsheet trail.',
    tags: ['Web application', 'Point of sale', 'Retail operations'],
    url: 'https://famoustechxpos.onrender.com/login',
    image: '/work/famous-techx-pos.jpg',
    imageAlt: 'Famous TechX POS sign-in screen.',
  },
];

export const processSteps: ProcessStep[] = [
  {
    number: '01',
    title: 'Listen & define',
    summary:
      'We start with where the work breaks, not with a feature list. We talk to the people doing the work and the people accountable for it.',
    activities: ['Stakeholder conversations', 'Constraints and context', 'Success criteria', 'Scope and priorities'],
    outcome: 'A written brief, a recommended approach, and a scope you can approve or question.',
  },
  {
    number: '02',
    title: 'Shape the experience',
    summary:
      'We make the messy parts visible before building anything: the structure, the flows, and the screens people will actually use.',
    activities: ['Information architecture', 'User flows and wireframes', 'Visual direction', 'Design system foundations'],
    outcome: 'Flows and designs you can review and change before development starts.',
  },
  {
    number: '03',
    title: 'Design & build',
    summary:
      'Design and engineering move in short, visible cycles. You see working software early and react to it, instead of waiting for a final reveal.',
    activities: ['Interface design', 'Front-end and back-end build', 'Design system in code', 'Regular check-ins'],
    outcome: 'Working software in staging, reviewed with you at each milestone.',
  },
  {
    number: '04',
    title: 'Test & launch',
    summary:
      'We test on the devices your people use, tighten the details, and prepare the release so launch day is a checklist rather than a surprise.',
    activities: ['Cross-device QA', 'Accessibility and performance checks', 'Deployment', 'Store submission where relevant'],
    outcome: 'A live release, a launch record, and a clear rollback path.',
  },
  {
    number: '05',
    title: 'Support & handover',
    summary:
      'The product should keep working after we step back. We document the decisions and help your team take ownership with confidence.',
    activities: ['Documentation', 'Walkthroughs and training', 'Support arrangement', 'Next-phase roadmap'],
    outcome: 'Code, design files, and documentation your team can own and extend.',
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
    text: 'We work out what your product needs to do before how it should look. That keeps the build focused on the work, not on the visuals.',
  },
  {
    number: '02',
    title: 'Design and engineering together',
    text: 'The people shaping the experience and the people writing the code work as one team, so what you approve is what gets built.',
  },
  {
    number: '03',
    title: 'Built for the day after launch',
    text: 'Clean code, documented decisions, and a design system your team can extend. The launch is the start of the product’s working life.',
  },
  {
    number: '04',
    title: 'Plain communication',
    text: 'Clear scope, visible progress, honest trade-offs. You should always know where the project stands and what it needs from you.',
  },
];

export const faqs: FaqItem[] = [
  {
    id: 'faq-start',
    question: 'How do we start a project?',
    answer:
      'Send a short note with what is broken, who it affects, and what a good result would look like. We will arrange a short call, then send a written scope and a recommended way forward so you can decide with the full picture.',
  },
  {
    id: 'faq-types',
    question: 'What kinds of projects do you take on?',
    answer:
      'Web applications, iOS and Android apps, brand identities, and combinations of them. That includes new products, customer portals, internal tools, rebrands, and fixing something that already exists but no longer works.',
  },
  {
    id: 'faq-existing',
    question: 'Can you work with our existing team or codebase?',
    answer:
      'Yes. We start by reviewing what exists and where the friction is. From there we can work alongside your team, take a defined slice of the product, or lead the whole build, whichever solves the problem best.',
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
  { href: '/services', label: 'Services' },
  { href: '/solutions', label: 'Solutions' },
  { href: '/work', label: 'Work' },
  { href: '/process', label: 'Process' },
  { href: '/studio', label: 'Studio' },
  { href: '/reviews', label: 'Reviews' },
  { href: '/faq', label: 'FAQ' },
];
