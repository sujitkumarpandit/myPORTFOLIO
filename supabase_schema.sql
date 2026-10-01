-- ==============================================================================
-- SUPABASE POSTGRESQL SCHEMA FOR PORTFOLIO WEBSITE
-- Run this script in the Supabase SQL Editor (Dashboard -> SQL Editor -> New query)
-- ==============================================================================

-- 1. ENABLE EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. CREATE PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
    id TEXT PRIMARY KEY DEFAULT 'default',
    name TEXT,
    headline TEXT,
    summary TEXT,
    location TEXT,
    role TEXT,
    status TEXT DEFAULT 'AVAILABLE',
    email TEXT,
    phone TEXT,
    whatsapp TEXT,
    social JSONB DEFAULT '{}'::jsonb,
    skills JSONB DEFAULT '[]'::jsonb,
    qualifications JSONB DEFAULT '[]'::jsonb,
    experience JSONB DEFAULT '[]'::jsonb,
    "profileImage" TEXT,
    "bannerImage" TEXT,
    "heroImage" TEXT,
    "resumeUrl" TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. CREATE PROJECTS TABLE
CREATE TABLE IF NOT EXISTS public.projects (
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE,
    title TEXT NOT NULL,
    "shortDescription" TEXT,
    "fullDescription" TEXT,
    year TEXT,
    role TEXT,
    category TEXT,
    technologies JSONB DEFAULT '[]'::jsonb,
    "heroImage" TEXT,
    problem TEXT,
    goal TEXT,
    architecture TEXT,
    results TEXT,
    "githubUrl" TEXT,
    "liveUrl" TEXT,
    "sortOrder" INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. CREATE POSTS TABLE
CREATE TABLE IF NOT EXISTS public.posts (
    id TEXT PRIMARY KEY,
    type TEXT DEFAULT 'TEXT',
    date TIMESTAMPTZ DEFAULT NOW(),
    content TEXT NOT NULL,
    "mediaUrl" TEXT,
    "mediaType" TEXT,
    "relatedProjectId" TEXT,
    tags JSONB DEFAULT '[]'::jsonb,
    "likeCount" INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. CREATE CREDENTIALS TABLE
CREATE TABLE IF NOT EXISTS public.credentials (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    issuer TEXT NOT NULL,
    date TEXT,
    "credentialId" TEXT,
    verified BOOLEAN DEFAULT TRUE,
    type TEXT DEFAULT 'CERTIFICATE',
    image TEXT,
    "sortOrder" INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. CREATE TIMELINE TABLE
CREATE TABLE IF NOT EXISTS public.timeline (
    id TEXT PRIMARY KEY,
    year TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT DEFAULT 'FOUNDATIONS',
    "sortOrder" INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. CREATE BEYOND_CODE TABLE
CREATE TABLE IF NOT EXISTS public.beyond_code (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    subtitle TEXT,
    why TEXT,
    note TEXT,
    description TEXT,
    status TEXT,
    image TEXT,
    topic TEXT,
    "relatedProjectId" TEXT,
    "relatedMediaId" TEXT,
    "externalUrl" TEXT,
    "startedDate" TEXT,
    "finishedDate" TEXT,
    "sortOrder" INTEGER DEFAULT 1,
    published BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. CREATE COMMENTS TABLE
CREATE TABLE IF NOT EXISTS public.comments (
    id TEXT PRIMARY KEY,
    "postId" TEXT NOT NULL,
    "visitorId" TEXT NOT NULL,
    content TEXT NOT NULL,
    date TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. CREATE LIKES TABLE
CREATE TABLE IF NOT EXISTS public.likes (
    id TEXT PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. CREATE FEEDBACK TABLE
CREATE TABLE IF NOT EXISTS public.feedback (
    id TEXT PRIMARY KEY,
    category TEXT NOT NULL,
    severity TEXT NOT NULL,
    content TEXT NOT NULL,
    contact TEXT,
    "visitorId" TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. CREATE ENTITIES (SEMANTIC TERMS) TABLE
CREATE TABLE IF NOT EXISTS public.entities (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    aliases JSONB DEFAULT '[]'::jsonb,
    category TEXT DEFAULT 'technology',
    color TEXT DEFAULT '#000000',
    "darkColor" TEXT,
    "textColor" TEXT,
    background TEXT,
    border TEXT,
    icon TEXT,
    "officialUrl" TEXT,
    description TEXT,
    enabled BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credentials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.timeline ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.beyond_code ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.entities ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Admin full access to profiles" ON public.profiles FOR ALL USING (auth.role() = 'authenticated' OR auth.role() = 'anon');

-- Projects Policies
CREATE POLICY "Public projects are viewable by everyone" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Admin full access to projects" ON public.projects FOR ALL USING (auth.role() = 'authenticated' OR auth.role() = 'anon');

-- Posts Policies
CREATE POLICY "Public posts are viewable by everyone" ON public.posts FOR SELECT USING (true);
CREATE POLICY "Admin full access to posts" ON public.posts FOR ALL USING (auth.role() = 'authenticated' OR auth.role() = 'anon');

-- Credentials Policies
CREATE POLICY "Public credentials are viewable by everyone" ON public.credentials FOR SELECT USING (true);
CREATE POLICY "Admin full access to credentials" ON public.credentials FOR ALL USING (auth.role() = 'authenticated' OR auth.role() = 'anon');

-- Timeline Policies
CREATE POLICY "Public timeline is viewable by everyone" ON public.timeline FOR SELECT USING (true);
CREATE POLICY "Admin full access to timeline" ON public.timeline FOR ALL USING (auth.role() = 'authenticated' OR auth.role() = 'anon');

-- Beyond Code Policies
CREATE POLICY "Public beyond_code is viewable by everyone" ON public.beyond_code FOR SELECT USING (true);
CREATE POLICY "Admin full access to beyond_code" ON public.beyond_code FOR ALL USING (auth.role() = 'authenticated' OR auth.role() = 'anon');

-- Comments Policies
CREATE POLICY "Comments are viewable by everyone" ON public.comments FOR SELECT USING (true);
CREATE POLICY "Anyone can insert comments" ON public.comments FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin full access to comments" ON public.comments FOR ALL USING (auth.role() = 'authenticated' OR auth.role() = 'anon');

-- Likes Policies
CREATE POLICY "Likes are viewable by everyone" ON public.likes FOR SELECT USING (true);
CREATE POLICY "Anyone can insert likes" ON public.likes FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can delete own likes" ON public.likes FOR DELETE USING (true);

-- Feedback Policies
CREATE POLICY "Anyone can insert feedback" ON public.feedback FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin can view feedback" ON public.feedback FOR SELECT USING (auth.role() = 'authenticated' OR auth.role() = 'anon');

-- Entities Policies
CREATE POLICY "Public entities are viewable by everyone" ON public.entities FOR SELECT USING (true);
CREATE POLICY "Admin full access to entities" ON public.entities FOR ALL USING (auth.role() = 'authenticated' OR auth.role() = 'anon');

-- ==============================================================================
-- STORAGE BUCKETS SETUP
-- ==============================================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolio-assets', 'portfolio-assets', true)
ON CONFLICT (id) DO UPDATE SET public = true;

CREATE POLICY "Public Access to portfolio-assets"
ON storage.objects FOR SELECT
USING (bucket_id = 'portfolio-assets');

CREATE POLICY "Allow Uploads to portfolio-assets"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'portfolio-assets');

CREATE POLICY "Allow Updates to portfolio-assets"
ON storage.objects FOR UPDATE
USING (bucket_id = 'portfolio-assets');

CREATE POLICY "Allow Deletes from portfolio-assets"
ON storage.objects FOR DELETE
USING (bucket_id = 'portfolio-assets');
