-- Add expected_delivery_date column to orders table
ALTER TABLE orders ADD COLUMN IF NOT EXISTS expected_delivery_date TIMESTAMP;

-- Set a default value for existing orders (7 days from created_at)
UPDATE orders 
SET expected_delivery_date = created_at + INTERVAL '7 days' 
WHERE expected_delivery_date IS NULL;
