export type BrandEntityCategory = 'platform' | 'technology' | 'language' | 'framework' | 'database' | 'cloud' | 'tool' | 'company' | 'social';

export interface BrandEntity {
  id: string;
  name: string; // The canonical name
  aliases: string[];
  category: BrandEntityCategory;
  color: string;
  darkColor?: string; // Optional dark mode color
  textColor?: string;
  background?: string;
  border?: string;
  icon?: string; // Identifier for the icon
  officialUrl?: string;
  description?: string;
  enabled: boolean;
}

export type ContentType = 'PROJECT' | 'ACTIVITY' | 'CREDENTIAL' | 'EXPERIMENT' | 'MEDIA' | 'MILESTONE' | 'LEARNING';
export interface Profile {
  id: string;
  name: string;
  headline: string;
  summary: string;
  location: string;
  role: string;
  status: 'AVAILABLE' | 'OPEN TO OPPORTUNITIES' | 'BUILDING' | 'NOT LOOKING';
  email: string;
  phone: string;
  whatsapp: string;
  social: {
    github: string;
    linkedin: string;
    twitter?: string;
  };
  heroImage?: string;
  profileImage?: string;
  bannerImage?: string;
  resumeUrl?: string;
  skills?: string[];
  qualifications?: {
    degree: string;
    institution: string;
    year: string;
    logo?: string;
  }[];
  experience?: {
    role: string;
    company: string;
    period: string;
    description: string;
    logo?: string;
  }[];
}
export interface ActivityPost {
  id: string;
  type: 'TEXT' | 'IMAGE' | 'VIDEO' | 'PROJECT_UPDATE' | 'MILESTONE' | 'LEARNING' | 'BUILD_UPDATE' | 'ACHIEVEMENT';
  date: string;
  content: string;
  mediaUrl?: string;
  mediaType?: 'IMAGE' | 'VIDEO';
  relatedProjectId?: string;
  tags: string[];
  likeCount?: number;
}
export interface Project {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  year: string;
  role: string;
  category: string;
  technologies: string[];
  heroImage: string;
  problem: string;
  goal: string;
  architecture: string;
  results: string;
  githubUrl?: string;
  liveUrl?: string;
}
export interface Credential {
  id: string;
  title: string;
  issuer: string;
  date: string;
  credentialId: string;
  verified: boolean;
  type: 'CERTIFICATE' | 'DEGREE' | 'AWARD';
  image?: string;
}
export interface TimelineEvent {
  id: string;
  year: string;
  title: string;
  description: string;
  category: 'FOUNDATIONS' | 'FIRST PRODUCTS' | 'PRODUCTION SYSTEMS' | 'NEXT';
}

export type BeyondCodeType = 'BOOK' | 'EXPLORING' | 'CURIOUS_ABOUT' | 'INTEREST';
export type BookStatus = 'STARTING' | 'READING' | 'PAUSED' | 'FINISHED';
export type ItemPublishState = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

export interface BeyondCodeItem {
  id: string;
  type: BeyondCodeType;
  title: string;
  subtitle?: string; // Author for books, category for interests
  description?: string;
  note?: string;
  why?: string; // "Why I'm reading this"
  status?: BookStatus | string;
  image?: string;
  externalUrl?: string;
  topic?: string;
  relatedProjectId?: string;
  relatedMediaId?: string;
  startedDate?: string;
  finishedDate?: string;
  sortOrder: number;
  published: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Comment {
  id: string;
  postId: string;
  visitorId: string;
  content: string;
  date: string;
}
