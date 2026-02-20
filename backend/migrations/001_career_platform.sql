-- ============================================================
-- VidyaMithra Advanced Career Platform — ADDITIVE Schema
-- Run this in Supabase SQL Editor. It creates NEW tables only.
-- Existing tables (users, profiles) are NOT touched.
-- ============================================================

-- 1. Roadmaps
CREATE TABLE IF NOT EXISTS public.roadmaps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    target_role TEXT NOT NULL,
    current_skills JSONB DEFAULT '[]'::jsonb,
    skill_gaps JSONB DEFAULT '[]'::jsonb,
    roadmap_data JSONB NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_roadmaps_user ON public.roadmaps(user_id);

-- 2. Quiz Attempts
CREATE TABLE IF NOT EXISTS public.quiz_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    roadmap_id UUID REFERENCES public.roadmaps(id) ON DELETE CASCADE,
    skill_id TEXT NOT NULL,
    skill_name TEXT NOT NULL,
    level TEXT NOT NULL,
    score DOUBLE PRECISION NOT NULL,
    passed BOOLEAN NOT NULL,
    total_questions INTEGER NOT NULL,
    correct_answers INTEGER NOT NULL,
    questions_data JSONB DEFAULT '[]'::jsonb,
    attempted_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_user ON public.quiz_attempts(user_id);

-- 3. Interview Sessions
CREATE TABLE IF NOT EXISTS public.interview_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    roadmap_id UUID REFERENCES public.roadmaps(id) ON DELETE CASCADE,
    level TEXT,
    position TEXT NOT NULL,
    round_type TEXT NOT NULL,
    responses JSONB DEFAULT '[]'::jsonb,
    analysis JSONB DEFAULT '{}'::jsonb,
    technical_score DOUBLE PRECISION,
    communication_score DOUBLE PRECISION,
    confidence_score DOUBLE PRECISION,
    verdict TEXT,
    completed_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_interview_sessions_user ON public.interview_sessions(user_id);

-- 4. Opportunities
CREATE TABLE IF NOT EXISTS public.opportunities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    company TEXT,
    opportunity_type TEXT NOT NULL,
    description TEXT,
    url TEXT NOT NULL,
    source TEXT,
    skill_tags JSONB DEFAULT '[]'::jsonb,
    level TEXT,
    deadline TIMESTAMPTZ,
    is_expired BOOLEAN DEFAULT FALSE,
    location TEXT,
    salary_range TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Progress Snapshots
CREATE TABLE IF NOT EXISTS public.progress_snapshots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    career_readiness_score DOUBLE PRECISION DEFAULT 0.0,
    resume_ats_score DOUBLE PRECISION DEFAULT 0.0,
    skill_completion_pct DOUBLE PRECISION DEFAULT 0.0,
    quiz_avg_score DOUBLE PRECISION DEFAULT 0.0,
    interview_avg_score DOUBLE PRECISION DEFAULT 0.0,
    total_skills_completed INTEGER DEFAULT 0,
    total_quizzes_passed INTEGER DEFAULT 0,
    total_interviews_done INTEGER DEFAULT 0,
    breakdown JSONB DEFAULT '{}'::jsonb,
    snapshot_date TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_progress_user ON public.progress_snapshots(user_id);

-- 6. Learning Cache
CREATE TABLE IF NOT EXISTS public.learning_cache (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    skill_name TEXT NOT NULL,
    level TEXT,
    resources JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(skill_name, level)
);
CREATE INDEX IF NOT EXISTS idx_learning_cache_skill ON public.learning_cache(skill_name);

-- Row Level Security (respect existing patterns)
ALTER TABLE public.roadmaps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interview_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.progress_snapshots ENABLE ROW LEVEL SECURITY;

-- Users can only see their own data
CREATE POLICY IF NOT EXISTS "Users can view own roadmaps"
    ON public.roadmaps FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY IF NOT EXISTS "Users can insert own roadmaps"
    ON public.roadmaps FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY IF NOT EXISTS "Users can update own roadmaps"
    ON public.roadmaps FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can view own quiz_attempts"
    ON public.quiz_attempts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY IF NOT EXISTS "Users can insert own quiz_attempts"
    ON public.quiz_attempts FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can view own interview_sessions"
    ON public.interview_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY IF NOT EXISTS "Users can insert own interview_sessions"
    ON public.interview_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can view own progress_snapshots"
    ON public.progress_snapshots FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY IF NOT EXISTS "Users can insert own progress_snapshots"
    ON public.progress_snapshots FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Opportunities are public (read-only for all authenticated users)
ALTER TABLE public.opportunities ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "Authenticated users can view opportunities"
    ON public.opportunities FOR SELECT USING (auth.role() = 'authenticated');

-- Learning cache is public read
ALTER TABLE public.learning_cache ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "Authenticated users can view learning_cache"
    ON public.learning_cache FOR SELECT USING (auth.role() = 'authenticated');
