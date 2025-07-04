-- Migration: Add address, city, state, zipCode, and location columns to jobs table
ALTER TABLE jobs ADD COLUMN address TEXT;
ALTER TABLE jobs ADD COLUMN city TEXT;
ALTER TABLE jobs ADD COLUMN state TEXT;
ALTER TABLE jobs ADD COLUMN zipCode TEXT;
ALTER TABLE jobs ADD COLUMN location DOUBLE PRECISION[]; 