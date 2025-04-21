-- This script creates the property_boundaries table for storing property boundary data
-- Run this in your Supabase SQL editor or through migrations

-- Enable the necessary extensions
CREATE EXTENSION IF NOT EXISTS postgis;

-- Create the property_boundaries table
CREATE TABLE IF NOT EXISTS public.property_boundaries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  address TEXT,
  location JSONB,  -- [lat, lng] center point
  boundaries JSONB, -- Nested array of coordinates
  source TEXT DEFAULT 'manual', -- Source of the boundary data (manual, arcgis, upload)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes
CREATE INDEX IF NOT EXISTS property_boundaries_user_id_idx ON public.property_boundaries(user_id);
CREATE INDEX IF NOT EXISTS property_boundaries_name_idx ON public.property_boundaries(name);

-- Enable RLS (Row Level Security)
ALTER TABLE public.property_boundaries ENABLE ROW LEVEL SECURITY;

-- Create policies for row level security
CREATE POLICY "Users can view their own property boundaries"
  ON public.property_boundaries
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own property boundaries"
  ON public.property_boundaries
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own property boundaries"
  ON public.property_boundaries
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own property boundaries"
  ON public.property_boundaries
  FOR DELETE
  USING (auth.uid() = user_id);

-- Function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to call the function when a row is updated
CREATE TRIGGER update_property_boundaries_timestamp
BEFORE UPDATE ON public.property_boundaries
FOR EACH ROW
EXECUTE FUNCTION update_modified_column(); 