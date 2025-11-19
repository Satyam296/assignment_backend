-- SQL to clean up duplicate variants
-- Run this in Supabase SQL Editor

-- First, let's see what duplicates exist
WITH variant_groups AS (
  SELECT 
    product_id,
    color,
    storage,
    COUNT(*) as count,
    MIN(created_at) as first_created,
    ARRAY_AGG(id ORDER BY created_at) as all_ids
  FROM variants
  GROUP BY product_id, color, storage
  HAVING COUNT(*) > 1
)
SELECT 
  p.name as product_name,
  vg.color,
  vg.storage,
  vg.count as duplicate_count,
  vg.all_ids
FROM variant_groups vg
JOIN products p ON p.id = vg.product_id;

-- To delete duplicates (keeping only the oldest one for each color+storage combo):
-- Uncomment and run this after reviewing the above query

/*
DELETE FROM variants
WHERE id IN (
  SELECT unnest(all_ids[2:]) as id_to_delete
  FROM (
    SELECT 
      ARRAY_AGG(id ORDER BY created_at) as all_ids
    FROM variants
    GROUP BY product_id, color, storage
    HAVING COUNT(*) > 1
  ) subquery
);
*/
