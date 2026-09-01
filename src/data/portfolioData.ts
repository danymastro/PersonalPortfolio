/**
 * Structural data only: ids, colours, icons, images, links, tech names.
 * Every user-facing string lives in src/i18n/translations.ts, keyed by these ids,
 * so the whole site is fully bilingual (IT / EN).
 */

export interface Project {
  id: string;
  slug: string;
  year: string;
  accentColor: string;
  rotation: string;
  hoverRotation: string;
  image: string;
  stack: string[];
  liveUrl: string;
  githubUrl?: string;
  /** Real, shipped product vs. a repeatable solution blueprint */
  kind: 'product' | 'blueprint';
}

export interface SolutionMeta {
  id: string;
  icon: string;
  accent: string;
}

export interface StackGroupMeta {
  id: string;
  icon: string;
  accent: string;
}

export const PORTFOLIO_DATA = {
  personal: {
    name: 'Danilo Mastropaolo',
    initials: 'D/M.',
    email: 'danilo.mastropaolo05@gmail.com',
    avatar: '/danilo-avatar.png',
    socials: [
      { name: 'GitHub', url: 'https://github.com/danymastro' },
      { name: 'LinkedIn', url: 'https://www.linkedin.com/in/danilo-mastropaolo-3a4498355' },
      { name: 'Instagram', url: 'https://www.instagram.com/danilo.mastropaolo' },
      { name: 'VibesOut', url: 'https://vibesout.com' },
    ],
  },

  /** The venture I founded — embedded live further down the page */
  venture: {
    name: 'VibesOut',
    url: 'https://vibesout.com',
    domain: 'vibesout.com',
    image: 'https://assets.vibesout.com/og-image.png',
    accent: '#D0FF71',
    stack: ['Next.js', 'React Native', 'Node.js', 'PostgreSQL', 'Cloudflare', 'Expo'],
  },

  /** Scrolling ribbon — colours only, words come from i18n */
  marqueeColors: [
    '#FDE047',
    '#F9A8D4',
    '#2563EB',
    '#4ADE80',
    '#C084FC',
    '#FB923C',
  ],

  /** "Da problema a soluzione" — the core narrative of the site */
  problemIds: [
    'phone',
    'spreadsheets',
    'idea',
    'repetitive',
    'legacy',
    'infra',
  ] as const,

  /** What I actually build, as services */
  solutions: [
    { id: 'platforms', icon: 'LayoutDashboard', accent: '#FDE047' },
    { id: 'products', icon: 'Rocket', accent: '#F9A8D4' },
    { id: 'ai-automation', icon: 'Bot', accent: '#C084FC' },
    { id: 'call-center', icon: 'Headphones', accent: '#2563EB' },
    { id: 'infra', icon: 'Cloud', accent: '#4ADE80' },
    { id: 'motion', icon: 'Sparkles', accent: '#FB923C' },
  ] as SolutionMeta[],

  projects: [
    {
      id: 'vibesout',
      slug: 'vibesout',
      year: '2025',
      accentColor: '#D0FF71',
      rotation: 'rotate-2',
      hoverRotation: 'group-hover:rotate-6',
      image: 'https://assets.vibesout.com/og-image.png',
      stack: ['Next.js', 'React Native', 'Node.js', 'PostgreSQL', 'Cloudflare'],
      liveUrl: 'https://vibesout.com',
      kind: 'product',
    },
    {
      id: 'budokan',
      slug: 'budokan-karate',
      year: '2026',
      accentColor: '#F97316',
      rotation: '-rotate-1',
      hoverRotation: 'group-hover:-rotate-3',
      image: '/budokan-hero.jpg',
      stack: ['Next.js', 'Gestionale Societario', 'CMS Nativo', 'Cloudflare'],
      liveUrl: 'https://budokan-karate-campobasso.budokan-cb.workers.dev/',
      kind: 'product',
    },
    {
      id: 'spotdiary',
      slug: 'spotdiary',
      year: '2026',
      accentColor: '#008A7C',
      rotation: 'rotate-2',
      hoverRotation: 'group-hover:rotate-4',
      image: '/spotdiary-preview.png',
      stack: ['Swift', 'SwiftUI', 'Mapbox', 'Natural Language AI', 'PostgreSQL'],
      liveUrl: 'https://github.com/danymastro',
      kind: 'product',
    },
  ] as Project[],

  /** Grouped capabilities — replaces the old flat "playground" grid */
  stackGroups: [
    { id: 'frontend', icon: 'Code2', accent: '#FDE047' },
    { id: 'backend', icon: 'Server', accent: '#F9A8D4' },
    { id: 'database', icon: 'Database', accent: '#2563EB' },
    { id: 'infra', icon: 'Cloud', accent: '#4ADE80' },
    { id: 'ai', icon: 'Bot', accent: '#C084FC' },
    { id: 'motion', icon: 'Wand2', accent: '#FB923C' },
  ] as StackGroupMeta[],

  /** Hard tech names rendered inside each stack group (not translated) */
  stackItems: {
    frontend: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Motion', 'Vite'],
    backend: ['Node.js', 'REST & GraphQL', 'tRPC', 'Auth / JWT', 'Stripe', 'Webhooks'],
    database: ['PostgreSQL', 'MongoDB', 'MySQL', 'Prisma / Drizzle', 'Redis', 'Cloudflare D1'],
    infra: ['Cloudflare Pages', 'Workers & R2', 'DNS & CDN', 'VPS / Nginx', 'Docker', 'CI/CD'],
    ai: ['Claude / Claude Code', 'AI Agents', 'RAG', 'Voice Agents', 'OpenAI API', 'Automations'],
    motion: ['Motion', 'GSAP', 'SVG / Lottie', 'Canvas & WebGL', 'Figma', 'Brand Assets'],
  } as Record<string, string[]>,

  /** How I work — 4 step delivery loop */
  processSteps: ['discovery', 'blueprint', 'build', 'ship'],

  aboutStats: [
    { id: 'years', value: '4+', accent: '#FDE047' },
    { id: 'projects', value: '40+', accent: '#F9A8D4' },
    { id: 'endToEnd', value: '100%', accent: '#2563EB' },
    { id: 'founded', value: '1', accent: '#C084FC' },
  ],
};
