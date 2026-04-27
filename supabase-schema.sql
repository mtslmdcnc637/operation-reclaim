-- =============================================
-- OPERATION RECLAIM — Supabase Schema
-- =============================================
-- Run this in your Supabase SQL Editor
-- =============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- PROFILES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  code_name TEXT NOT NULL,
  plan TEXT NOT NULL DEFAULT 'recruta' CHECK (plan IN ('recruta', 'agente', 'diretor')),
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- GAME STATE TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS game_states (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  level INT NOT NULL DEFAULT 1,
  xp INT NOT NULL DEFAULT 0,
  total_xp INT NOT NULL DEFAULT 0,
  streak INT NOT NULL DEFAULT 0,
  last_checkin TIMESTAMPTZ,
  total_days INT NOT NULL DEFAULT 0,
  total_missions INT NOT NULL DEFAULT 0,
  primary_addiction TEXT NOT NULL DEFAULT 'socialMedia' CHECK (primary_addiction IN ('socialMedia', 'pornography', 'games')),
  achievements TEXT[] NOT NULL DEFAULT '{}',
  completed_mission_ids TEXT[] NOT NULL DEFAULT '{}',
  daily_mission_ids TEXT[] NOT NULL DEFAULT '{}',
  last_mission_date DATE,
  attack_cooldowns JSONB NOT NULL DEFAULT '{}',
  emergency_used_today BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id)
);

-- =============================================
-- ADDICTIONS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS addictions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  addiction_type TEXT NOT NULL CHECK (addiction_type IN ('socialMedia', 'pornography', 'games')),
  power INT NOT NULL DEFAULT 100 CHECK (power >= 0 AND power <= 100),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, addiction_type)
);

-- =============================================
-- MISSION HISTORY TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS mission_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  mission_id TEXT NOT NULL,
  completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  xp_earned INT NOT NULL,
  damage_dealt INT NOT NULL
);

-- =============================================
-- CHECK-IN HISTORY TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS checkin_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  checked_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  streak_at_time INT NOT NULL,
  xp_earned INT NOT NULL
);

-- =============================================
-- INDEXES
-- =============================================
CREATE INDEX IF NOT EXISTS idx_game_states_user ON game_states(user_id);
CREATE INDEX IF NOT EXISTS idx_addictions_user ON addictions(user_id);
CREATE INDEX IF NOT EXISTS idx_mission_history_user ON mission_history(user_id);
CREATE INDEX IF NOT EXISTS idx_checkin_history_user ON checkin_history(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_states ENABLE ROW LEVEL SECURITY;
ALTER TABLE addictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE mission_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE checkin_history ENABLE ROW LEVEL SECURITY;

-- Profiles: users can only read/update their own
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Game States: users can only access their own
CREATE POLICY "Users can view own game state" ON game_states
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own game state" ON game_states
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own game state" ON game_states
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Addictions: users can only access their own
CREATE POLICY "Users can view own addictions" ON addictions
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own addictions" ON addictions
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own addictions" ON addictions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Mission History: users can only view/insert their own
CREATE POLICY "Users can view own mission history" ON mission_history
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own mission history" ON mission_history
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Check-in History: users can only view/insert their own
CREATE POLICY "Users can view own checkin history" ON checkin_history
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own checkin history" ON checkin_history
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- =============================================
-- FUNCTIONS
-- =============================================

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, code_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'code_name', split_part(NEW.email, '@', 1)));

  INSERT INTO game_states (user_id)
  VALUES (NEW.id);

  INSERT INTO addictions (user_id, addiction_type, power)
  VALUES
    (NEW.id, 'socialMedia', 100),
    (NEW.id, 'pornography', 100),
    (NEW.id, 'games', 100);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Damage all addictions for a user
CREATE OR REPLACE FUNCTION damage_all_addictions(p_user_id UUID, p_damage INT)
RETURNS VOID AS $$
BEGIN
  UPDATE addictions
  SET power = GREATEST(0, power - p_damage),
      updated_at = NOW()
  WHERE user_id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE OR REPLACE TRIGGER update_game_states_updated_at
  BEFORE UPDATE ON game_states
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE OR REPLACE TRIGGER update_addictions_updated_at
  BEFORE UPDATE ON addictions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
