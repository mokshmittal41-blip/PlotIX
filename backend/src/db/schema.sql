-- ==============================================================================
-- 🏢 PropWise Real Estate Intelligence Platform — Database Schema
-- 📦 Database: Supabase PostgreSQL
-- ==============================================================================
-- HOW TO RUN:
-- 1. Open your Supabase Dashboard: https://supabase.com/dashboard
-- 2. Select your project -> Go to the "SQL Editor" (in the left sidebar)
-- 3. Click "New query", paste this entire script, and click "Run"
-- ==============================================================================

-- 1. CREATE PROFILES TABLE (Linked to auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  phone TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'Property Pro',
  preferences JSONB DEFAULT '{"language": "en", "preferredUnit": "sqyd"}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 2. UNIQUE INDEX ON PHONE NUMBER (Prevents duplicate accounts with the same phone)
CREATE UNIQUE INDEX IF NOT EXISTS profiles_phone_unique_idx 
ON public.profiles(phone) 
WHERE phone IS NOT NULL AND phone != '';

-- 3. ENABLE ROW LEVEL SECURITY ON PROFILES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 4. PROFILES RLS POLICIES
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- 5. AUTOMATED TRIGGER FUNCTION (Auto-creates profile upon Supabase auth signup)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  v_phone TEXT;
  v_full_name TEXT;
  v_email TEXT;
BEGIN
  -- Extract raw phone from user metadata if provided
  v_phone := NEW.raw_user_meta_data->>'phone';
  
  -- Extract full name from metadata or split from email
  v_full_name := COALESCE(
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'name',
    split_part(NEW.email, '@', 1)
  );

  -- Sanitize internal email for phone-based logins
  IF NEW.email LIKE '%@phone.propwise.internal' THEN
    v_email := NULL;
    IF v_phone IS NULL OR v_phone = '' THEN
      v_phone := split_part(NEW.email, '@', 1);
    END IF;
  ELSE
    v_email := NEW.email;
  END IF;

  INSERT INTO public.profiles (id, full_name, email, phone, avatar_url)
  VALUES (
    NEW.id,
    v_full_name,
    v_email,
    v_phone,
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO UPDATE
  SET 
    full_name = EXCLUDED.full_name,
    email = COALESCE(EXCLUDED.email, profiles.email),
    phone = COALESCE(EXCLUDED.phone, profiles.phone),
    updated_at = NOW();

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. ATTACH TRIGGER TO auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==============================================================================
-- 7. REAL ESTATE PROPERTIES TABLE (Direct User / Owner / Broker Listings)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.properties (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  property_type TEXT NOT NULL, -- 'Residential Plot', 'Commercial Plot', 'Agricultural Land', 'Villa / House', 'Apartment', 'Builder Floor', 'Commercial SCO', 'Industrial Land'
  listing_type TEXT NOT NULL DEFAULT 'sale', -- 'sale', 'rent', 'lease'
  price NUMERIC NOT NULL,
  price_unit TEXT DEFAULT 'total', -- 'total', 'per_sqyd', 'per_acre', 'per_month'
  price_per_unit NUMERIC,
  area NUMERIC NOT NULL,
  area_unit TEXT NOT NULL DEFAULT 'sq.yd.', -- 'sq.yd.', 'sq.ft.', 'acres', 'marla', 'kanal', 'bigha'
  address TEXT,
  locality TEXT,
  sector TEXT,
  tehsil TEXT,
  city TEXT NOT NULL,
  district TEXT NOT NULL,
  state TEXT NOT NULL DEFAULT 'Haryana',
  pincode TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  facing TEXT, -- 'East', 'West', 'North', 'South', 'North-East', 'North-West'
  road_width_ft NUMERIC,
  khasra_no TEXT,
  registry_status TEXT, -- 'Clear Registry Verified', 'Jamabandi 2024-25 Available', 'CLU / GMADA Approved', 'Lal Dora / Abadi Deh'
  is_verified BOOLEAN DEFAULT true,
  status TEXT NOT NULL DEFAULT 'active', -- 'active', 'sold', 'rented', 'expired', 'deleted'
  images TEXT[] DEFAULT '{}',
  amenities TEXT[] DEFAULT '{}',
  approvals TEXT[] DEFAULT '{}',
  nearby_landmarks JSONB DEFAULT '[]'::jsonb,
  contact_name TEXT NOT NULL,
  contact_phone TEXT NOT NULL,
  contact_email TEXT,
  agency_name TEXT,
  source TEXT DEFAULT 'direct_listing', -- 'direct_listing', 'external_api', 'owner', 'broker', 'builder'
  external_id TEXT, -- ID from MagicBricks, OLX India, etc.
  source_name TEXT DEFAULT 'PropWise Direct', -- 'PropWise Direct', 'MagicBricks', 'OLX India'
  source_url TEXT,
  original_listing_url TEXT,
  last_seen_at TIMESTAMPTZ,
  last_synced_at TIMESTAMPTZ,
  views_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 8. BUYER REQUIREMENTS TABLE (Demands & Broker Inquiries)
CREATE TABLE IF NOT EXISTS public.buyer_requirements (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  property_type TEXT NOT NULL,
  district TEXT NOT NULL,
  preferred_area TEXT,
  budget_min NUMERIC,
  budget_max NUMERIC NOT NULL,
  required_size TEXT,
  purpose TEXT,
  buyer_name TEXT NOT NULL,
  buyer_phone TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active', -- 'active', 'fulfilled', 'cancelled'
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 9. PERFORMANCE INDEXES FOR SEARCHING AND FILTERING
CREATE INDEX IF NOT EXISTS idx_properties_city ON public.properties(LOWER(city));
CREATE INDEX IF NOT EXISTS idx_properties_district ON public.properties(LOWER(district));
CREATE INDEX IF NOT EXISTS idx_properties_state ON public.properties(LOWER(state));
CREATE INDEX IF NOT EXISTS idx_properties_status ON public.properties(status);
CREATE INDEX IF NOT EXISTS idx_properties_price ON public.properties(price);
CREATE INDEX IF NOT EXISTS idx_properties_property_type ON public.properties(property_type);
CREATE INDEX IF NOT EXISTS idx_properties_user_id ON public.properties(user_id);
CREATE INDEX IF NOT EXISTS idx_properties_created_at ON public.properties(created_at DESC);
CREATE UNIQUE INDEX IF NOT EXISTS idx_properties_source_ext ON public.properties(source_name, external_id) WHERE external_id IS NOT NULL;


CREATE INDEX IF NOT EXISTS idx_buyer_req_district ON public.buyer_requirements(LOWER(district));
CREATE INDEX IF NOT EXISTS idx_buyer_req_status ON public.buyer_requirements(status);
CREATE INDEX IF NOT EXISTS idx_buyer_req_user_id ON public.buyer_requirements(user_id);

-- 10. ENABLE ROW LEVEL SECURITY
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.buyer_requirements ENABLE ROW LEVEL SECURITY;

-- 11. PROPERTIES RLS POLICIES
DROP POLICY IF EXISTS "Anyone can view active properties" ON public.properties;
CREATE POLICY "Anyone can view active properties"
  ON public.properties FOR SELECT
  USING (status = 'active' OR auth.uid() = user_id);

DROP POLICY IF EXISTS "Authenticated users can insert properties" ON public.properties;
CREATE POLICY "Authenticated users can insert properties"
  ON public.properties FOR INSERT
  WITH CHECK (auth.uid() = user_id OR auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Users can update own properties" ON public.properties;
CREATE POLICY "Users can update own properties"
  ON public.properties FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own properties" ON public.properties;
CREATE POLICY "Users can delete own properties"
  ON public.properties FOR DELETE
  USING (auth.uid() = user_id);

-- 12. BUYER REQUIREMENTS RLS POLICIES
DROP POLICY IF EXISTS "Anyone can view active requirements" ON public.buyer_requirements;
CREATE POLICY "Anyone can view active requirements"
  ON public.buyer_requirements FOR SELECT
  USING (status = 'active' OR auth.uid() = user_id);

DROP POLICY IF EXISTS "Authenticated users can insert requirements" ON public.buyer_requirements;
CREATE POLICY "Authenticated users can insert requirements"
  ON public.buyer_requirements FOR INSERT
  WITH CHECK (auth.uid() = user_id OR auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Users can update own requirements" ON public.buyer_requirements;
CREATE POLICY "Users can update own requirements"
  ON public.buyer_requirements FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own requirements" ON public.buyer_requirements;
CREATE POLICY "Users can delete own requirements"
  ON public.buyer_requirements FOR DELETE
  USING (auth.uid() = user_id);

-- ==============================================================================
-- ✅ Schema created successfully!
-- ==============================================================================

