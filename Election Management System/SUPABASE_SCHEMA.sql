-- ═══════════════════════════════════════════════════════════════════════════════
-- SUPABASE DATABASE SCHEMA FOR ELECTION MANAGEMENT SYSTEM
-- ═══════════════════════════════════════════════════════════════════════════════
-- Run all SQL in Supabase SQL Editor in this exact order

-- ═══════════════════════════════════════════════════════════════════════════════
-- PHASE 2A — ENABLE EXTENSIONS
-- ═══════════════════════════════════════════════════════════════════════════════

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ═══════════════════════════════════════════════════════════════════════════════
-- PHASE 2B — PROFILES TABLE (extends Supabase auth.users)
-- ═══════════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'voter' CHECK (role IN ('super_admin', 'election_creator', 'voter')),
  avatar_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════════════════════════
-- PHASE 2C — CREATOR REQUESTS TABLE
-- ═══════════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS creator_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  organization TEXT NOT NULL,
  purpose TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  rejection_reason TEXT,
  reviewed_by UUID REFERENCES profiles(id),
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════════════════════════
-- PHASE 2D — ELECTIONS TABLE
-- ═══════════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS elections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  creator_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT DEFAULT 'general',
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'active', 'completed', 'cancelled')),
  registration_deadline TIMESTAMPTZ NOT NULL,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  max_voters INTEGER NOT NULL DEFAULT 1000,
  is_voter_list_locked BOOLEAN DEFAULT false,
  banner_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════════════════════════
-- PHASE 2E — CANDIDATES TABLE
-- ═══════════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS candidates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  election_id UUID REFERENCES elections(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  designation TEXT,
  photo_url TEXT,
  manifesto TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════════════════════════
-- PHASE 2F — VOTER REGISTRATIONS TABLE
-- ═══════════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS voter_registrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  election_id UUID REFERENCES elections(id) ON DELETE CASCADE,
  voter_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'registered' CHECK (status IN ('registered', 'waitlisted', 'finalized', 'removed')),
  secret_id TEXT,                    -- e.g. POLL-A-0001 (plain text stored)
  secret_id_hash TEXT,               -- bcrypt hash of secret_id for validation
  secret_id_sent_at TIMESTAMPTZ,
  registered_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(election_id, voter_id),
  UNIQUE(secret_id)
);

-- ═══════════════════════════════════════════════════════════════════════════════
-- PHASE 2G — VOTES TABLE (anonymous)
-- ═══════════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS votes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  election_id UUID REFERENCES elections(id) ON DELETE CASCADE,
  candidate_id UUID REFERENCES candidates(id) ON DELETE CASCADE,
  vote_token TEXT UNIQUE NOT NULL,   -- hashed token (secret_id + election_id)
  voted_at TIMESTAMPTZ DEFAULT NOW()
  -- NOTE: voter_id is intentionally NOT stored here — anonymous voting
);

-- ═══════════════════════════════════════════════════════════════════════════════
-- PHASE 2H — AUDIT LOGS TABLE
-- ═══════════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  actor_id UUID REFERENCES profiles(id),
  action TEXT NOT NULL,
  entity_type TEXT,                  -- 'election', 'vote', 'user', 'candidate'
  entity_id UUID,
  metadata JSONB,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════════════════════════
-- PHASE 2I — NOTIFICATIONS TABLE
-- ═══════════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL,                -- 'approval', 'rejection', 'secret_id', 'election_start', 'result'
  title TEXT NOT NULL,
  message TEXT,
  is_read BOOLEAN DEFAULT false,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════════════════════════
-- PHASE 2J — ROW LEVEL SECURITY (RLS) POLICIES
-- ═══════════════════════════════════════════════════════════════════════════════

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE creator_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE elections ENABLE ROW LEVEL SECURITY;
ALTER TABLE candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE voter_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- ═══════════════════════════════════════════════════════════════════════════════
-- PROFILES POLICIES
-- ═══════════════════════════════════════════════════════════════════════════════

-- Users can view their own profile
CREATE POLICY "profiles_self" ON profiles FOR SELECT 
  USING (auth.uid() = id);

-- Admin users can view all profiles
CREATE POLICY "profiles_admin_read" ON profiles FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'super_admin'
    )
  );

-- Users can update their own profile
CREATE POLICY "profiles_self_update" ON profiles FOR UPDATE 
  USING (auth.uid() = id);

-- Admin can update any profile
CREATE POLICY "profiles_admin_update" ON profiles FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'super_admin'
    )
  );

-- ═══════════════════════════════════════════════════════════════════════════════
-- ELECTIONS POLICIES
-- ═══════════════════════════════════════════════════════════════════════════════

-- Public can read published/active/completed elections
CREATE POLICY "elections_public_read" ON elections FOR SELECT 
  USING (status IN ('published', 'active', 'completed'));

-- Creator can manage their own elections
CREATE POLICY "elections_creator_manage" ON elections FOR ALL 
  USING (creator_id = auth.uid());

-- Admin can manage all elections
CREATE POLICY "elections_admin" ON elections FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'super_admin'
    )
  );

-- ═══════════════════════════════════════════════════════════════════════════════
-- CANDIDATES POLICIES
-- ═══════════════════════════════════════════════════════════════════════════════

-- Public can read candidates from published/active/completed elections
CREATE POLICY "candidates_public_read" ON candidates FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM elections 
      WHERE id = election_id AND status IN ('published', 'active', 'completed')
    )
  );

-- Creator can manage candidates for their elections
CREATE POLICY "candidates_creator" ON candidates FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM elections 
      WHERE id = election_id AND creator_id = auth.uid()
    )
  );

-- Admin can manage all candidates
CREATE POLICY "candidates_admin" ON candidates FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'super_admin'
    )
  );

-- ═══════════════════════════════════════════════════════════════════════════════
-- VOTER REGISTRATIONS POLICIES
-- ═══════════════════════════════════════════════════════════════════════════════

-- Voter can view their own registrations
CREATE POLICY "vr_own" ON voter_registrations FOR SELECT 
  USING (voter_id = auth.uid());

-- Voter can insert their own registrations
CREATE POLICY "vr_own_insert" ON voter_registrations FOR INSERT 
  WITH CHECK (voter_id = auth.uid());

-- Voter can delete their own registrations
CREATE POLICY "vr_own_delete" ON voter_registrations FOR DELETE 
  USING (voter_id = auth.uid());

-- Creator can view voter registrations for their elections
CREATE POLICY "vr_creator_read" ON voter_registrations FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM elections 
      WHERE id = election_id AND creator_id = auth.uid()
    )
  );

-- Creator can manage voter registrations for their elections
CREATE POLICY "vr_creator_manage" ON voter_registrations FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM elections 
      WHERE id = election_id AND creator_id = auth.uid()
    )
  );

-- Admin can view all voter registrations
CREATE POLICY "vr_admin_read" ON voter_registrations FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'super_admin'
    )
  );

-- Admin can manage all voter registrations
CREATE POLICY "vr_admin_manage" ON voter_registrations FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'super_admin'
    )
  );

-- ═══════════════════════════════════════════════════════════════════════════════
-- VOTES POLICIES
-- ═══════════════════════════════════════════════════════════════════════════════

-- NO user can read individual votes (anonymous). Only count aggregates via RPC
CREATE POLICY "votes_no_read" ON votes FOR SELECT 
  USING (false);

-- Only finalized voters can insert votes
CREATE POLICY "votes_insert_only" ON votes FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM voter_registrations 
      WHERE election_id = votes.election_id 
      AND voter_id = auth.uid() 
      AND status = 'finalized'
    )
  );

-- Admin can view votes
CREATE POLICY "votes_admin_read" ON votes FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'super_admin'
    )
  );

-- ═══════════════════════════════════════════════════════════════════════════════
-- NOTIFICATIONS POLICIES
-- ═══════════════════════════════════════════════════════════════════════════════

-- Users can only see their own notifications
CREATE POLICY "notifications_own" ON notifications FOR ALL 
  USING (user_id = auth.uid());

-- ═══════════════════════════════════════════════════════════════════════════════
-- AUDIT LOGS POLICIES
-- ═══════════════════════════════════════════════════════════════════════════════

-- Only admin can read audit logs
CREATE POLICY "audit_admin_read" ON audit_logs FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'super_admin'
    )
  );

-- System can insert audit logs (via backend with service role)
-- This policy allows backend to insert via service role key
CREATE POLICY "audit_insert" ON audit_logs FOR INSERT 
  WITH CHECK (true);

-- ═══════════════════════════════════════════════════════════════════════════════
-- PHASE 2K — DATABASE FUNCTIONS (RPCs)
-- ═══════════════════════════════════════════════════════════════════════════════

-- Get vote counts per candidate for an election (safe aggregate, no voter exposure)
CREATE OR REPLACE FUNCTION get_vote_counts(p_election_id UUID)
RETURNS TABLE(candidate_id UUID, candidate_name TEXT, vote_count BIGINT) AS $$
BEGIN
  RETURN QUERY
  SELECT c.id, c.name, COUNT(v.id)::BIGINT
  FROM candidates c
  LEFT JOIN votes v ON v.candidate_id = c.id AND v.election_id = p_election_id
  WHERE c.election_id = p_election_id
  GROUP BY c.id, c.name
  ORDER BY vote_count DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get voter count for an election
CREATE OR REPLACE FUNCTION get_voter_count(p_election_id UUID)
RETURNS INTEGER AS $$
BEGIN
  RETURN (
    SELECT COUNT(*) FROM voter_registrations 
    WHERE election_id = p_election_id AND status IN ('registered', 'finalized')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get total votes cast for an election
CREATE OR REPLACE FUNCTION get_total_votes(p_election_id UUID)
RETURNS BIGINT AS $$
BEGIN
  RETURN (
    SELECT COUNT(*) FROM votes 
    WHERE election_id = p_election_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ═══════════════════════════════════════════════════════════════════════════════
-- PHASE 2L — TRIGGERS
-- ═══════════════════════════════════════════════════════════════════════════════

-- Auto-lock election when max voters reached
CREATE OR REPLACE FUNCTION check_voter_limit()
RETURNS TRIGGER AS $$
DECLARE
  current_count INTEGER;
  max_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO current_count 
  FROM voter_registrations 
  WHERE election_id = NEW.election_id AND status IN ('registered', 'finalized');
  
  SELECT max_voters INTO max_count 
  FROM elections WHERE id = NEW.election_id;
  
  IF current_count >= max_count THEN
    UPDATE elections SET is_voter_list_locked = true WHERE id = NEW.election_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_check_voter_limit
AFTER INSERT ON voter_registrations
FOR EACH ROW EXECUTE FUNCTION check_voter_limit();

-- Auto-create profile for new auth users
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, full_name, phone, role)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'phone',
    'voter'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Update timestamps
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_profiles_updated_at
BEFORE UPDATE ON profiles
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_update_elections_updated_at
BEFORE UPDATE ON elections
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ═══════════════════════════════════════════════════════════════════════════════
-- INDEXES (for performance)
-- ═══════════════════════════════════════════════════════════════════════════════

CREATE INDEX idx_elections_creator_id ON elections(creator_id);
CREATE INDEX idx_elections_status ON elections(status);
CREATE INDEX idx_candidates_election_id ON candidates(election_id);
CREATE INDEX idx_voter_registrations_election_id ON voter_registrations(election_id);
CREATE INDEX idx_voter_registrations_voter_id ON voter_registrations(voter_id);
CREATE INDEX idx_voter_registrations_status ON voter_registrations(status);
CREATE INDEX idx_votes_election_id ON votes(election_id);
CREATE INDEX idx_votes_candidate_id ON votes(candidate_id);
CREATE INDEX idx_votes_vote_token ON votes(vote_token);
CREATE INDEX idx_audit_logs_actor_id ON audit_logs(actor_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_created_at ON notifications(created_at);
CREATE INDEX idx_creator_requests_user_id ON creator_requests(user_id);
CREATE INDEX idx_creator_requests_status ON creator_requests(status);

-- ═══════════════════════════════════════════════════════════════════════════════
-- SAMPLE DATA (Optional - for testing)
-- ═══════════════════════════════════════════════════════════════════════════════

-- NOTE: Uncomment these to insert test data
-- INSERT INTO profiles (id, full_name, role) 
-- VALUES (
--   '00000000-0000-0000-0000-000000000001',
--   'Super Admin',
--   'super_admin'
-- );

-- ═══════════════════════════════════════════════════════════════════════════════
-- DONE! Database schema is ready
-- ═══════════════════════════════════════════════════════════════════════════════
