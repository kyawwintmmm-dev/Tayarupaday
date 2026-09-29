-- ====================================================================
-- SUPABASE POSTGRESQL SCHEMA & ROW LEVEL SECURITY (RLS) POLICIES
-- FOR MYANMAR LAW HUB PRO (မြန်မာဥပဒေရေးရာ လက်စွဲ)
-- ====================================================================

-- 1. LAWS TABLE (PUBLIC READ-ONLY, ADMIN EDIT)
CREATE TABLE IF NOT EXISTS public.laws (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    title_mm TEXT NOT NULL,
    category_id TEXT NOT NULL,
    year TEXT NOT NULL,
    description TEXT,
    source TEXT DEFAULT 'မြန်မာနိုင်ငံ ဥပဒေစာအုပ် (ပြည်ထောင်စု ရှေ့နေချုပ်ရုံး)',
    version TEXT DEFAULT 'Current',
    effective_date TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. LAW SECTIONS TABLE (PUBLIC READ-ONLY, ADMIN EDIT)
CREATE TABLE IF NOT EXISTS public.law_sections (
    id TEXT PRIMARY KEY,
    law_id TEXT REFERENCES public.laws(id) ON DELETE CASCADE,
    section_number TEXT NOT NULL,
    section_title TEXT NOT NULL,
    content_mm TEXT NOT NULL,
    content_en TEXT,
    chapter TEXT,
    source TEXT DEFAULT 'ပြည်ထောင်စု ရှေ့နေချုပ်ရုံး',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. BOOKMARKS TABLE (USER SPECIFIC)
CREATE TABLE IF NOT EXISTS public.bookmarks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    law_id TEXT,
    section_id TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, section_id)
);

-- 4. HIGHLIGHTS TABLE (USER SPECIFIC)
CREATE TABLE IF NOT EXISTS public.highlights (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    section_id TEXT NOT NULL,
    selected_text TEXT NOT NULL,
    note TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. USER NOTES TABLE (USER SPECIFIC)
CREATE TABLE IF NOT EXISTS public.user_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    section_id TEXT NOT NULL,
    note TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, section_id)
);

-- 6. READING HISTORY TABLE (USER SPECIFIC)
CREATE TABLE IF NOT EXISTS public.reading_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    law_id TEXT,
    section_id TEXT NOT NULL,
    last_read_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. SEARCH HISTORY TABLE (USER SPECIFIC)
CREATE TABLE IF NOT EXISTS public.search_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    query TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================================================
-- ENABLE ROW LEVEL SECURITY (RLS) ON ALL TABLES
-- ====================================================================

ALTER TABLE public.laws ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.law_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.highlights ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reading_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.search_history ENABLE ROW LEVEL SECURITY;

-- ====================================================================
-- RLS POLICIES FOR PUBLIC CONTENT (LAWS & LAW_SECTIONS)
-- Allow READ for all users (anon & authenticated).
-- Restrict WRITE (INSERT/UPDATE/DELETE) to admin service role.
-- ====================================================================

CREATE POLICY "Public laws read access" ON public.laws
    FOR SELECT USING (true);

CREATE POLICY "Public law_sections read access" ON public.law_sections
    FOR SELECT USING (true);

-- ====================================================================
-- RLS POLICIES FOR USER PRIVATE DATA
-- Each user can SELECT, INSERT, UPDATE, DELETE only their own records.
-- ====================================================================

-- Bookmarks
CREATE POLICY "Users can manage own bookmarks" ON public.bookmarks
    FOR ALL USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Highlights
CREATE POLICY "Users can manage own highlights" ON public.highlights
    FOR ALL USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- User Notes
CREATE POLICY "Users can manage own notes" ON public.user_notes
    FOR ALL USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Reading History
CREATE POLICY "Users can manage own reading history" ON public.reading_history
    FOR ALL USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Search History
CREATE POLICY "Users can manage own search history" ON public.search_history
    FOR ALL USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);
