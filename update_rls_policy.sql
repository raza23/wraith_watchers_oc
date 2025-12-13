-- Update RLS policy to allow public inserts
-- Run this in your Supabase SQL Editor

-- Drop the existing authenticated-only insert policy
DROP POLICY IF EXISTS "Allow authenticated insert" ON sightings;

-- Create new policy to allow public inserts
CREATE POLICY "Allow public insert" ON sightings
  FOR INSERT
  WITH CHECK (true);

-- This allows anyone to add sightings through the app
-- For production, you may want to add rate limiting or authentication

