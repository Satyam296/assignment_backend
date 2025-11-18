-- Supabase Seed Data for EMI Products
-- Run this in your Supabase SQL Editor AFTER creating the tables

-- First, let's insert some sample products with variants and EMI plans
INSERT INTO products (slug, name, category, description, variants, emi_plans, specifications, downpayment_options)
VALUES 
(
  'iphone-17-pro',
  'Apple iPhone 17 Pro',
  'Smartphones',
  'Latest Apple flagship smartphone with advanced features',
  '[
    {
      "id": "v1",
      "name": "Silver 256GB",
      "color": "Silver",
      "storage": "256GB",
      "price": 134900,
      "mrp": 149900,
      "stock": 8,
      "image": "https://images.snapmint.com/product_assets/images/001/154/806/large/open-uri20251021-2855301-v0364x?1761017558",
      "images": [
        "https://images.snapmint.com/product_assets/images/001/154/806/large/open-uri20251021-2855301-v0364x?1761017558",
        "https://images.snapmint.com/product_assets/images/001/154/807/large/open-uri20251021-2855301-1w6zv?1761017558"
      ]
    },
    {
      "id": "v2",
      "name": "Cosmic Orange 256GB",
      "color": "Cosmic Orange",
      "storage": "256GB",
      "price": 139900,
      "mrp": 149900,
      "stock": 12,
      "image": "https://images.snapmint.com/product_assets/images/001/154/792/large/open-uri20251021-2855301-1lwknri?1761017541",
      "images": [
        "https://images.snapmint.com/product_assets/images/001/154/792/large/open-uri20251021-2855301-1lwknri?1761017541"
      ]
    },
    {
      "id": "v3",
      "name": "Deep Blue 256GB",
      "color": "Deep Blue",
      "storage": "256GB",
      "price": 136900,
      "mrp": 149900,
      "stock": 10,
      "image": "https://images.snapmint.com/product_assets/images/001/154/799/large/open-uri20251021-2855301-1u2r5zo?1761017549",
      "images": [
        "https://images.snapmint.com/product_assets/images/001/154/799/large/open-uri20251021-2855301-1u2r5zo?1761017549"
      ]
    }
  ]'::jsonb,
  '[
    {
      "id": "p1",
      "tenure": 3,
      "interestRate": 0,
      "monthlyPayment": 44967,
      "cashback": 0,
      "mutualFundName": "ICICI Bank"
    },
    {
      "id": "p2",
      "tenure": 6,
      "interestRate": 1.73,
      "monthlyPayment": 23142,
      "cashback": 500,
      "mutualFundName": "HDFC Bank"
    },
    {
      "id": "p3",
      "tenure": 9,
      "interestRate": 1.88,
      "monthlyPayment": 15772,
      "cashback": 1000,
      "mutualFundName": "Axis Bank"
    },
    {
      "id": "p4",
      "tenure": 12,
      "interestRate": 1.89,
      "monthlyPayment": 12075,
      "cashback": 1500,
      "mutualFundName": "Kotak Mahindra"
    }
  ]'::jsonb,
  '[
    {"key": "Storage", "value": "256 GB"},
    {"key": "Color", "value": "Multiple"},
    {"key": "Screen Size", "value": "6.3 inch"},
    {"key": "Processor", "value": "A19 Chip"}
  ]'::jsonb,
  '[
    {"id": "dp1", "amount": 20235, "label": "₹20235"},
    {"id": "dp2", "amount": 40470, "label": "₹40470"}
  ]'::jsonb
),
(
  'samsung-s24-ultra',
  'Samsung Galaxy S24 Ultra',
  'Smartphones',
  'Premium Samsung smartphone with exceptional display',
  '[
    {
      "id": "v1",
      "name": "Titanium Gray 256GB",
      "color": "Titanium Gray",
      "storage": "256GB",
      "price": 129900,
      "mrp": 144900,
      "stock": 10,
      "image": "https://images.snapmint.com/product_assets/images/000/939/165/large/open-uri20240226-25016-16vtfke?1708944894",
      "images": [
        "https://images.snapmint.com/product_assets/images/000/939/165/large/open-uri20240226-25016-16vtfke?1708944894"
      ]
    },
    {
      "id": "v2",
      "name": "Titanium Violet 512GB",
      "color": "Titanium Violet",
      "storage": "512GB",
      "price": 149900,
      "mrp": 164900,
      "stock": 10,
      "image": "https://images.snapmint.com/product_assets/images/000/939/174/large/open-uri20240226-25016-disn3u?1708944904",
      "images": [
        "https://images.snapmint.com/product_assets/images/000/939/174/large/open-uri20240226-25016-disn3u?1708944904"
      ]
    }
  ]'::jsonb,
  '[
    {
      "id": "p1",
      "tenure": 3,
      "interestRate": 0,
      "monthlyPayment": 43300,
      "cashback": 0,
      "mutualFundName": "ICICI Bank"
    },
    {
      "id": "p2",
      "tenure": 6,
      "interestRate": 1.73,
      "monthlyPayment": 22283,
      "cashback": 500,
      "mutualFundName": "HDFC Bank"
    }
  ]'::jsonb,
  '[
    {"key": "Storage", "value": "256 GB / 512 GB"},
    {"key": "Screen Size", "value": "6.8 inch"},
    {"key": "Processor", "value": "Snapdragon 8 Gen 3"}
  ]'::jsonb,
  '[
    {"id": "dp1", "amount": 18000, "label": "₹18000"},
    {"id": "dp2", "amount": 36000, "label": "₹36000"}
  ]'::jsonb
),
(
  'google-pixel-9-pro',
  'Google Pixel 9 Pro',
  'Smartphones',
  'Google flagship smartphone with advanced AI features',
  '[
    {
      "id": "v1",
      "name": "Obsidian 256GB",
      "color": "Obsidian",
      "storage": "256GB",
      "price": 109999,
      "mrp": 124999,
      "stock": 10,
      "image": "https://images.snapmint.com/product_assets/images/001/069/754/large/open-uri20250319-28213-e8k1n1?1742389860",
      "images": [
        "https://images.snapmint.com/product_assets/images/001/069/754/large/open-uri20250319-28213-e8k1n1?1742389860"
      ]
    },
    {
      "id": "v2",
      "name": "Hazel 256GB",
      "color": "Hazel",
      "storage": "256GB",
      "price": 112999,
      "mrp": 124999,
      "stock": 10,
      "image": "https://images.snapmint.com/product_assets/images/001/069/745/large/open-uri20250319-28213-1s0x4bg?1742389842",
      "images": [
        "https://images.snapmint.com/product_assets/images/001/069/745/large/open-uri20250319-28213-1s0x4bg?1742389842"
      ]
    }
  ]'::jsonb,
  '[
    {
      "id": "p1",
      "tenure": 3,
      "interestRate": 0,
      "monthlyPayment": 36666,
      "cashback": 0,
      "mutualFundName": "ICICI Bank"
    },
    {
      "id": "p2",
      "tenure": 6,
      "interestRate": 1.73,
      "monthlyPayment": 18850,
      "cashback": 500,
      "mutualFundName": "HDFC Bank"
    }
  ]'::jsonb,
  '[
    {"key": "Storage", "value": "256 GB"},
    {"key": "Screen Size", "value": "6.7 inch"},
    {"key": "Processor", "value": "Google Tensor G4"}
  ]'::jsonb,
  '[
    {"id": "dp1", "amount": 15000, "label": "₹15000"},
    {"id": "dp2", "amount": 30000, "label": "₹30000"}
  ]'::jsonb
);

-- Insert a sample admin
INSERT INTO admins (email, password, name, notification_enabled, low_stock_threshold)
VALUES 
('admin@example.com', 'admin123', 'Admin User', true, 5);

-- Verify data
SELECT COUNT(*) as product_count FROM products;
SELECT COUNT(*) as admin_count FROM admins;
