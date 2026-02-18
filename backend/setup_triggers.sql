-- Create or Replace Trigger Function (Idempotent)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  v_login_type TEXT;
  v_full_name TEXT;
BEGIN
  -- 1. Determine Login Type from metadata
  -- Strategies:
  --   a) app_metadata -> provider (e.g. 'google', 'email')
  --   b) user_metadata -> iss (issuer)
  v_login_type := COALESCE(new.raw_app_meta_data->>'provider', 'custom');
  
  -- 2. Extract Full Name
  -- Strategies:
  --   a) user_metadata -> full_name
  --   b) user_metadata -> name
  --   c) fallback to email prefix
  v_full_name := COALESCE(
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'name',
    split_part(new.email, '@', 1)
  );

  -- 3. Insert into public.users
  -- ON CONFLICT DO NOTHING ensures idempotency if trigger fires multiple times
  INSERT INTO public.users (id, email, login_type, created_at, updated_at)
  VALUES (
    new.id,
    new.email,
    v_login_type,
    new.created_at,
    new.created_at
  )
  ON CONFLICT (id) DO NOTHING;

  -- 4. Insert into public.profiles
  -- ON CONFLICT DO NOTHING ensures idempotency
  INSERT INTO public.profiles (id, full_name, created_at, updated_at)
  VALUES (
    new.id,
    v_full_name,
    new.created_at,
    new.created_at
  )
  ON CONFLICT (id) DO UPDATE
  SET full_name = EXCLUDED.full_name
  WHERE public.profiles.full_name IS NULL OR public.profiles.full_name = split_part(public.profiles.id::text, '-', 1);

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if exists to ensure clean slate for recreation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create Trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Verification Query (Run this after signing up a user)
-- SELECT u.id, u.email, u.login_type, p.full_name 
-- FROM public.users u 
-- JOIN public.profiles p ON u.id = p.id;
