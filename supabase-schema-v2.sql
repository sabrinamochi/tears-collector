-- Drop old tables and functions
DROP TABLE IF EXISTS tear_entries CASCADE;
DROP TABLE IF EXISTS journal_members CASCADE;
DROP TABLE IF EXISTS journals CASCADE;
DROP FUNCTION IF EXISTS auth_user_journal_ids;

-- Simple tear entries — no auth required
CREATE TABLE tear_entries (
  id        bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  mood      text NOT NULL CHECK (mood IN ('sad', 'happy', 'yawn')),
  note      text DEFAULT '',
  reasons   text[] DEFAULT '{}',
  date      text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Open RLS: anyone with the anon key can read and insert
ALTER TABLE tear_entries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read"   ON tear_entries FOR SELECT USING (true);
CREATE POLICY "public insert" ON tear_entries FOR INSERT WITH CHECK (true);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE tear_entries;
