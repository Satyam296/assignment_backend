import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { supabase } from "../config/supabase";

// Admin login
export const adminLogin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Find admin by email
    const { data: admin, error } = await supabase
      .from('admins')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !admin) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, admin.password);
    
    if (!isValidPassword) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    res.json({
      message: "Login successful",
      admin: {
        _id: admin.id,
        email: admin.email,
        name: admin.name
      }
    });
  } catch (error: any) {
    console.error("Error during admin login:", error);
    res.status(500).json({ 
      error: "Login failed", 
      details: error.message 
    });
  }
};

// Create admin (for setup)
export const createAdmin = async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Check if admin already exists
    const { data: existing } = await supabase
      .from('admins')
      .select('id')
      .eq('email', email)
      .single();

    if (existing) {
      return res.status(400).json({ error: "Admin already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert admin
    const { data: admin, error } = await supabase
      .from('admins')
      .insert({
        email,
        password: hashedPassword,
        name: name || email.split('@')[0]
      })
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({
      message: "Admin created successfully",
      admin: {
        _id: admin.id,
        email: admin.email,
        name: admin.name
      }
    });
  } catch (error: any) {
    console.error("Error creating admin:", error);
    res.status(500).json({ 
      error: "Failed to create admin", 
      details: error.message 
    });
  }
};

// Get inventory (all products with stock info)
export const getInventory = async (req: Request, res: Response) => {
  try {
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (productsError) throw productsError;

    const inventory = await Promise.all(
      products.map(async (product) => {
        const { data: variants } = await supabase
          .from('variants')
          .select('*')
          .eq('product_id', product.id);

        const totalStock = variants?.reduce((sum, v) => sum + (v.stock || 0), 0) || 0;

        return {
          _id: product.id,
          name: product.name,
          slug: product.slug,
          category: product.category,
          variants: variants?.map(v => ({
            id: v.id,
            name: v.name,
            color: v.color,
            storage: v.storage,
            stock: v.stock,
            price: parseFloat(v.price)
          })) || [],
          totalStock
        };
      })
    );

    res.json(inventory);
  } catch (error: any) {
    console.error("Error fetching inventory:", error);
    res.status(500).json({ 
      error: "Failed to fetch inventory", 
      details: error.message 
    });
  }
};

// Get low stock items
export const getLowStock = async (req: Request, res: Response) => {
  try {
    const threshold = parseInt(req.query.threshold as string) || 5;

    const { data: variants, error } = await supabase
      .from('variants')
      .select('*, products(*)')
      .lte('stock', threshold)
      .order('stock', { ascending: true });

    if (error) throw error;

    const lowStockItems = variants?.map(v => ({
      _id: v.id,
      productName: v.products?.name || 'Unknown',
      variantName: v.name,
      color: v.color,
      storage: v.storage,
      stock: v.stock,
      price: parseFloat(v.price)
    })) || [];

    res.json(lowStockItems);
  } catch (error: any) {
    console.error("Error fetching low stock:", error);
    res.status(500).json({ 
      error: "Failed to fetch low stock items", 
      details: error.message 
    });
  }
};
