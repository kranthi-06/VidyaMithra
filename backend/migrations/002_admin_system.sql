-- Migration: Admin System
-- Add role, is_blacklisted, last_active_at to users table
-- Add role, is_blacklisted, last_active_at to profiles table
-- Create blacklist table

-- ═══════════════════════════════════════════════════════════
-- 1. Extend users table
-- ═══════════════════════════════════════════════════════════
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user' NOT NULL;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS is_blacklisted BOOLEAN DEFAULT FALSE NOT NULL;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS last_active_at TIMESTAMP WITH TIME ZONE;

-- ═══════════════════════════════════════════════════════════
-- 2. Extend profiles table
-- ═══════════════════════════════════════════════════════════
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_blacklisted BOOLEAN DEFAULT FALSE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS last_active_at TIMESTAMP WITH TIME ZONE;

-- ═══════════════════════════════════════════════════════════
-- 3. Create blacklist table (audit-safe)
-- ═══════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.blacklist (
    user_id UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    reason TEXT,
    blacklisted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    blacklisted_by UUID
);

-- ═══════════════════════════════════════════════════════════
-- 4. Create indexes for admin queries
-- ═══════════════════════════════════════════════════════════
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);
CREATE INDEX IF NOT EXISTS idx_users_is_blacklisted ON public.users(is_blacklisted);
CREATE INDEX IF NOT EXISTS idx_users_last_active_at ON public.users(last_active_at);
CREATE INDEX IF NOT EXISTS idx_blacklist_email ON public.blacklist(email);
