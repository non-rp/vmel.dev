type CasePresentation = {
  role: string;
  result: { label: string; value: string; detail: string };
  system: { title: string; steps: string[] };
  gallery: { src: string; alt: string; caption: string }[];
};

export const casePresentation: Record<string, CasePresentation> = {
  'cogniagent-gutenberg-redesign': {
    role: 'Full-stack implementation',
    result: { label: 'WHAT CHANGED', value: 'A reusable block system', detail: 'The redesign became an editable system for future pages, with performance, QA and SEO included in delivery.' },
    system: { title: 'From legacy pages to an editor-owned system', steps: ['Legacy page structures', 'Reusable Gutenberg blocks', 'Consistent page assembly', 'Performance, QA & SEO'] },
    gallery: [{ src: '/projects/cogniagent-detail.jpg', alt: 'Current CogniAgent site showing a content section and visual system', caption: 'CURRENT PUBLIC SITE / The earlier Gutenberg version is not shown in this image.' }],
  },
  'cogniagent-platform-migration': {
    role: 'Technical and delivery lead',
    result: { label: 'LANDING PAGE WORKFLOW', value: '12h → 2–4h', detail: 'The reported time to produce and publish one landing page using the local AI agent workflow.' },
    system: { title: 'The publishing platform I led', steps: ['Payload content & data model', 'React application delivery', 'Local AI / MCP workflows', 'Review, QA & deployment'] },
    gallery: [{ src: '/projects/cogniagent-detail.jpg', alt: 'Current CogniAgent site with visual explanation of its agent platform', caption: 'CURRENT PUBLIC SITE / Product content; not an archival image of the migration.' }],
  },
  'gloriumtech-legacy-modernization': {
    role: 'Architecture and delivery lead',
    result: { label: 'MIGRATION STRATEGY', value: 'No content freeze planned', detail: 'New work is designed to move alongside the live legacy site, preserving content operations during migration.' },
    system: { title: 'A live path through legacy', steps: ['Keep existing pages live', 'Introduce new architecture', 'Migrate incrementally', 'Release with quality gates'] },
    gallery: [{ src: '/projects/gloriumtech-detail.jpg', alt: 'Current Glorium Technologies service content section', caption: 'CURRENT PUBLIC SITE / A live section of the marketing site.' }],
  },
  'min-commerce-multisite': {
    role: 'Primary developer and project lead',
    result: { label: 'PRODUCT SCOPE', value: 'Commerce across markets', detail: 'Checkout, payments, B2B and region routing evolved together across the international multisite.' },
    system: { title: 'The commerce system I evolved', steps: ['Market and geo routing', 'Multisite storefronts', 'Cart and checkout', 'Payments and B2B'] },
    gallery: [],
  },
  'myco-meditations-redesign': {
    role: 'Developer and project manager',
    result: { label: 'DELIVERY APPROACH', value: 'Two live redesigns', detail: 'A block-based rebuild followed by a second redesign delivered while the existing site remained available.' },
    system: { title: 'A safer redesign path', steps: ['Maintain the live site', 'Replace fragile page structures', 'Build reusable content blocks', 'Roll out the new experience'] },
    gallery: [{ src: '/projects/myco-detail.jpg', alt: 'Current MycoMeditations editorial section', caption: 'CURRENT PUBLIC SITE / A live content section, not a historical design record.' }],
  },
  'centrum-forme-editorial-platform': {
    role: 'Frontend and content architecture',
    result: { label: 'EDITORIAL SYSTEM', value: 'Built for the team to edit', detail: 'Therapist profiles, training content and shared settings were structured for ongoing updates.' },
    system: { title: 'A connected content journey', steps: ['Structured therapist profiles', 'Audience-based training', 'Reusable frontend sections', 'Discovery and contact paths'] },
    gallery: [{ src: '/projects/centrumforme-detail.jpg', alt: 'Current Centrum ForMe website showing therapy options', caption: 'CURRENT PUBLIC SITE / Therapy options on the live site.' }],
  },
  'sumy-pizza-storefront': {
    role: 'Early e-commerce development',
    result: { label: 'PROJECT TYPE', value: 'Local food delivery', detail: 'An archived example of an ordering-focused storefront from my early commerce work.' },
    system: { title: 'A clear route to an order', steps: ['Food categories', 'Product listings', 'Product selection', 'Cart and ordering entry'] },
    gallery: [{ src: '/projects/sumy-pizza-detail.png', alt: 'Archived pizza product listing with prices and order buttons', caption: 'ARCHIVAL SCREENSHOT / Product catalogue from an earlier version.' }],
  },
  'lilistudio-storefront': {
    role: 'Early e-commerce development',
    result: { label: 'PROJECT TYPE', value: 'Craft supplies catalogue', detail: 'A category-heavy storefront for handmade and decoration materials.' },
    system: { title: 'Catalogue-led discovery', steps: ['Category navigation', 'Search and browse', 'Product listings', 'Basket entry'] },
    gallery: [],
  },
};
