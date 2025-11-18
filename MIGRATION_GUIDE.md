# Migration to Supabase - CRITICAL STEPS

## What I've Done So Far:
✅ Removed mongoose from package.json
✅ Converted Product, Order, Admin models to TypeScript interfaces
✅ Updated productController to use Supabase
✅ Updated index.ts to remove MongoDB connection

## What You MUST Do Now:

### 1. Create Supabase Database Tables

Go to your Supabase Dashboard → SQL Editor and run this:

```sql
-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  variants JSONB DEFAULT '[]'::jsonb,
  emi_plans JSONB DEFAULT '[]'::jsonb,
  specifications JSONB DEFAULT '[]'::jsonb,
  downpayment_options JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID,
  product_name TEXT NOT NULL,
  variant_id TEXT NOT NULL,
  variant_color TEXT,
  variant_storage TEXT,
  variant_price NUMERIC NOT NULL,
  emi_plan_id TEXT NOT NULL,
  emi_tenure INTEGER NOT NULL,
  monthly_payment NUMERIC NOT NULL,
  interest_rate NUMERIC NOT NULL,
  cashback NUMERIC DEFAULT 0,
  total_amount NUMERIC NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create admins table
CREATE TABLE IF NOT EXISTS admins (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT NOT NULL,
  notification_enabled BOOLEAN DEFAULT true,
  low_stock_threshold INTEGER DEFAULT 5,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- Public policies
CREATE POLICY "Public read products" ON products FOR SELECT USING (true);
CREATE POLICY "Public read orders" ON orders FOR SELECT USING (true);
CREATE POLICY "Public insert orders" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update products" ON products FOR UPDATE USING (true);
```

### 2. Update Environment Variables

Add these to your Render environment variables:
```
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. CRITICAL: Fix Remaining Controllers

The **orderController** and **adminController** still use Mongoose syntax.

I'll create the fixed versions next, but you need to replace them manually.

## Next Steps:
1. Run the SQL above in Supabase
2. Add environment variables
3. Wait for me to provide fixed controller files
4. Replace the controller files
5. Test locally
6. Deploy to Render

## Current Issues:
- orderController.ts still imports mongoose models (needs rewrite)
- adminController.ts still imports mongoose models (needs rewrite)
- No seed data in Supabase yet

Let me know once you've created the tables and I'll provide the controller fixes!
