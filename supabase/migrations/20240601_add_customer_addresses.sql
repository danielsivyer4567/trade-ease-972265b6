-- Migration: Add customer_addresses table for multiple job site addresses per customer
CREATE TABLE IF NOT EXISTS customer_addresses (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id uuid REFERENCES customers(id) ON DELETE CASCADE,
    label text,
    address text NOT NULL,
    city text NOT NULL,
    state text NOT NULL,
    zipcode text NOT NULL,
    created_at timestamptz DEFAULT now()
);

-- Index for faster lookup
CREATE INDEX IF NOT EXISTS idx_customer_addresses_customer_id ON customer_addresses(customer_id);

ALTER TABLE customer_addresses ADD COLUMN IF NOT EXISTS is_default boolean DEFAULT false; 