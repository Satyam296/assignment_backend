import { Request, Response } from "express";
import { supabase } from "../config/supabase";

export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*');
    
    if (error) throw error;
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: "Failed to fetch products", details: error.message });
  }
};

export const getProductBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) throw error;
    
    if (!data) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: "Failed to fetch product", details: error.message });
  }
};

// Create new product
export const createProduct = async (req: Request, res: Response) => {
  try {
    const productData = req.body;
    
    // Validate required fields
    if (!productData.name || !productData.slug || !productData.category) {
      return res.status(400).json({ error: "Missing required fields: name, slug, category" });
    }
    
    // Check if slug already exists
    const existingProduct = await Product.findOne({ slug: productData.slug });
    if (existingProduct) {
      return res.status(400).json({ error: "Product with this slug already exists" });
    }
    
    const product = new Product(productData);
    await product.save();
    
    res.status(201).json({
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ error: "Failed to create product" });
  }
};

// Update product
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const productData = req.body;
    
    const product = await Product.findByIdAndUpdate(
      id,
      productData,
      { new: true, runValidators: true }
    );
    
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    
    res.json({
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ error: "Failed to update product" });
  }
};

// Delete product
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const product = await Product.findByIdAndDelete(id);
    
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    
    res.json({
      message: "Product deleted successfully",
      product,
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ error: "Failed to delete product" });
  }
};
