-- Supabase PostgreSQL Schema for EMI Products Application

-- 1. Products Table
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 2. Variants Table
CREATE TABLE variants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  variant_id VARCHAR(50) NOT NULL,
  name VARCHAR(255) NOT NULL,
  color VARCHAR(100),
  storage VARCHAR(50),
  price DECIMAL(10, 2) NOT NULL,
  mrp DECIMAL(10, 2) NOT NULL,
  image TEXT NOT NULL,
  images TEXT[], -- Array of image URLs
  stock INTEGER DEFAULT 10,
  available_emi_plans TEXT[], -- Array of EMI plan IDs
  created_at TIMESTAMP DEFAULT NOW()
);

-- 3. EMI Plans Table
CREATE TABLE emi_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  plan_id VARCHAR(50) NOT NULL,
  tenure INTEGER NOT NULL,
  monthly_payment DECIMAL(10, 2),
  interest_rate DECIMAL(5, 2) NOT NULL,
  cashback DECIMAL(10, 2) DEFAULT 0,
  mutual_fund_name VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);

-- 4. Specifications Table
CREATE TABLE specifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  key VARCHAR(255) NOT NULL,
  value TEXT NOT NULL
);

-- 5. Orders Table
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id),
  product_name VARCHAR(255) NOT NULL,
  variant_id VARCHAR(50) NOT NULL,
  variant_color VARCHAR(100),
  variant_storage VARCHAR(50),
  variant_price DECIMAL(10, 2) NOT NULL,
  emi_plan_id VARCHAR(50) NOT NULL,
  emi_tenure INTEGER NOT NULL,
  monthly_payment DECIMAL(10, 2) NOT NULL,
  interest_rate DECIMAL(5, 2) NOT NULL,
  cashback DECIMAL(10, 2) DEFAULT 0,
  status VARCHAR(50) DEFAULT 'pending',
  expected_delivery_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 6. Admins Table
CREATE TABLE admins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_variants_product_id ON variants(product_id);
CREATE INDEX idx_emi_plans_product_id ON emi_plans(product_id);
CREATE INDEX idx_specifications_product_id ON specifications(product_id);
CREATE INDEX idx_orders_product_id ON orders(product_id);
CREATE INDEX idx_orders_created_at ON orders(created_at);
CREATE INDEX idx_admins_email ON admins(email);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add trigger to products table
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Add trigger to admins table
CREATE TRIGGER update_admins_updated_at BEFORE UPDATE ON admins
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
