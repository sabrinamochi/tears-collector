-- Add nickname column to tear_entries
ALTER TABLE tear_entries
  ADD COLUMN IF NOT EXISTS nickname text;

-- Backfill all existing rows
UPDATE tear_entries SET nickname = 'syc' WHERE nickname IS NULL;
