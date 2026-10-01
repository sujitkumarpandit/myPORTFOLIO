import { Profile, Project, ActivityPost, Credential, TimelineEvent, BeyondCodeItem } from './types';

export const siteProfile: Profile = {
  id: 'me-1',
  name: 'Sujit Kumar',
  headline: 'Software Engineer · Product Builder',
  summary: 'I build digital products, intelligent systems, and experimental technology. Over the past 5 years, I have engineered scalable web platforms and integrated AI agents into production environments.',
  location: 'San Francisco, CA',
  role: 'Lead Generalist Engineer',
  status: 'OPEN TO OPPORTUNITIES',
  email: 'sujitpandit.dev@gmail.com',
  phone: '+91 81020185775',
  whatsapp: '+91 81020185775',
  social: {
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
    twitter: 'https://twitter.com'
  },
  skills: ['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'Tailwind CSS', 'System Design'],
  qualifications: [
    {
      degree: 'B.COM (Hons)',
      institution: 'Dibrugarh University',
      year: '2025'
    }
  ],
  experience: [
    {
      role: 'Lead Generalist Engineer',
      company: 'ImaginorLabs pvt ltd',
      period: '2026 - Present',
      description: 'Led the frontend architecture for the core product. Built and scaled complex React applications serving millions of users.'
    },
    {
      role: 'Software Engineer',
      company: 'Startup Inc',
      period: '2021 - 2023',
      description: 'Developed full-stack features using Node.js and React. Implemented real-time collaboration features and optimized database queries.'
    }
  ]
};

export const projects: Project[] = [
  {
    id: 'p-1',
    slug: 'nexus-engine',
    title: 'Nexus Engine',
    shortDescription: 'A high-performance retrieval system for AI agents.',
    fullDescription: 'Nexus Engine is a custom vector retrieval layer built on top of Postgres with pgvector. It allows AI agents to rapidly fetch and inject relevant context into their prompts, drastically reducing hallucination rates.',
    year: '2026',
    role: 'Lead Architect',
    category: 'Backend / AI',
    technologies: ['TypeScript', 'PostgreSQL', 'Redis', 'OpenAI'],
    heroImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80',
    problem: 'LLM agents lacked consistent, up-to-date context when responding to user queries across a large documentation base.',
    goal: 'Build a low-latency, scalable retrieval system that seamlessly integrates with existing Node.js backends.',
    architecture: 'A microservice exposing gRPC endpoints, utilizing pgvector for similarity search, and Redis for caching frequent queries.',
    results: 'Reduced average retrieval time by 40% and improved response relevance scores from 72% to 94%.',
    githubUrl: 'https://github.com',
    liveUrl: 'https://example.com'
  },
  {
    id: 'p-2',
    slug: 'lumina-ui',
    title: 'Lumina UI Design System',
    shortDescription: 'An accessible, high-contrast component library.',
    fullDescription: 'Developed a comprehensive React component library focusing on extreme accessibility, high-contrast themes, and fluid animations for financial dashboards.',
    year: '2025',
    role: 'Frontend Engineer',
    category: 'Design Systems',
    technologies: ['React', 'Tailwind CSS', 'Framer Motion', 'Radix UI'],
    heroImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
    problem: 'Inconsistent UI patterns across three major product teams leading to accessibility violations.',
    goal: 'Unify the design language and guarantee WCAG AA compliance across all primary user flows.',
    architecture: 'Headless components composed with Tailwind utility classes, published as a private npm package.',
    results: 'Achieved 100% WCAG AA compliance and reduced new feature frontend development time by ~30%.',
    githubUrl: 'https://github.com'
  }
];

export const feed: ActivityPost[] = [
  {
    id: 'a-1',
    type: 'BUILD_UPDATE',
    date: '2026-09-01T10:00:00Z',
    content: 'Spent today redesigning the retrieval layer for my current AI project. Moved from a naive KNN approach to an HNSW index. The performance gains are significant.',
    relatedProjectId: 'p-1',
    tags: ['Architecture', 'Performance', 'Postgres']
  },
  {
    id: 'a-2',
    type: 'MILESTONE',
    date: '2026-08-28T14:30:00Z',
    content: 'Successfully deployed the new real-time collaboration canvas to production. Watching concurrent users edit the same document without conflict is extremely satisfying.',
    mediaType: 'IMAGE',
    mediaUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80',
    tags: ['Launch', 'WebSockets', 'CRDTs']
  },
  {
    id: 'a-3',
    type: 'LEARNING',
    date: '2026-08-15T09:15:00Z',
    content: 'Deep diving into advanced WebGL fragment shaders today. The math is dense, but the ability to generate procedural textures entirely on the GPU is incredible.',
    tags: ['WebGL', 'Graphics', 'Learning']
  }
];

export const credentials: Credential[] = [
  {
    id: 'c-1',
    title: 'Advanced Machine Learning Engineering',
    issuer: 'DeepLearning.AI',
    date: '2025-11-10',
    credentialId: 'DLAI-987654321',
    verified: true,
    type: 'CERTIFICATE'
  },
  {
    id: 'c-2',
    title: 'Certified Kubernetes Administrator (CKA)',
    issuer: 'Cloud Native Computing Foundation',
    date: '2024-06-22',
    credentialId: 'LF-22334455',
    verified: true,
    type: 'CERTIFICATE'
  }
];

export const journey: TimelineEvent[] = [
  {
    id: 'j-1',
    year: '2026',
    title: 'AI + Product Engineering',
    description: 'Transitioned focus strictly to building intelligent, agentic systems wrapped in exceptional product interfaces.',
    category: 'NEXT'
  },
  {
    id: 'j-2',
    year: '2025',
    title: 'Production Systems',
    description: 'Architected scalable event-driven backends and real-time frontend applications serving millions of requests.',
    category: 'PRODUCTION SYSTEMS'
  },
  {
    id: 'j-3',
    year: '2023',
    title: 'Foundations',
    description: 'Began building full-stack applications. Focused deeply on computer science fundamentals and component architecture.',
    category: 'FOUNDATIONS'
  }
];

export const defaultBeyondCode: BeyondCodeItem[] = [
  {
    id: 'bc-1',
    type: 'BOOK',
    title: 'Designing Data-Intensive Applications',
    subtitle: 'Martin Kleppmann',
    why: 'Exploring distributed systems, partition tolerance, and storage engines beyond framework-level abstractions.',
    note: 'Deep dive into replication lag, consensus algorithms (Raft/Paxos), and LSM-tree vs B-tree disk layouts.',
    status: 'READING',
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&q=80',
    topic: 'Distributed Systems',
    relatedProjectId: 'p-1',
    externalUrl: 'https://dataintensive.net',
    sortOrder: 1,
    published: true,
    startedDate: '2026-07'
  },
  {
    id: 'bc-2',
    type: 'BOOK',
    title: 'The Design of Everyday Things',
    subtitle: 'Don Norman',
    why: 'Re-grounding software affordances and conceptual models in tangible physical cognitive principles.',
    note: 'Focusing on feedback loops, signifiers, and minimizing gulfs of execution in complex digital workflows.',
    status: 'FINISHED',
    image: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=600&q=80',
    topic: 'Human-Computer Interaction',
    relatedProjectId: 'p-2',
    externalUrl: 'https://www.nngroup.com/books/design-everyday-things-revised/',
    sortOrder: 2,
    published: true,
    finishedDate: '2026-05'
  },
  {
    id: 'bc-3',
    type: 'EXPLORING',
    title: 'Direct Manipulation & Spatial UI',
    subtitle: 'Interaction Paradigms',
    note: 'Examining how zero-latency fluid gestures and direct visual manipulation alter user mental models during creative tasks.',
    why: 'Investigating next-generation canvas interfaces for developer tooling.',
    status: 'EXPLORING',
    topic: 'Human-Computer Interaction',
    relatedProjectId: 'p-2',
    sortOrder: 3,
    published: true
  },
  {
    id: 'bc-4',
    type: 'CURIOUS_ABOUT',
    title: 'Cognitive Latency in Complex Systems',
    note: 'Why certain software interfaces feel intuitive and responsive before the user consciously understands the underlying mechanics.',
    topic: 'Systems Thinking',
    sortOrder: 4,
    published: true
  },
  {
    id: 'bc-5',
    type: 'INTEREST',
    title: 'Analogue Photography & Optics',
    subtitle: 'Visual Aesthetics',
    note: 'Manual mechanical focus, film grain characteristics, and optical composition constraints.',
    sortOrder: 5,
    published: true
  }
];

