import { Request, Response } from "express";
import { supabase } from "../config/supabase";

// Get all products (or single product by slug)
export const getProducts = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    
    // Handle single product by slug
    if (slug) {
      const { data: product, error: productError } = await supabase
        .from('products')
        .select('*')
        .eq('slug', slug)
        .single();

      if (productError) throw productError;
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }

      // Fetch related data
      const { data: variants } = await supabase
        .from('variants')
        .select('*')
        .eq('product_id', product.id);

      const { data: emiPlans } = await supabase
        .from('emi_plans')
        .select('*')
        .eq('product_id', product.id);

      const { data: specifications } = await supabase
        .from('specifications')
        .select('*')
        .eq('product_id', product.id);

      const formattedProduct = {
        _id: product.id,
        slug: product.slug,
        name: product.name,
        category: product.category,
        description: product.description,
        variants: (variants || []).map(v => ({
          id: v.id,
          name: v.name,
          color: v.color,
          storage: v.storage,
          price: parseFloat(v.price),
          mrp: parseFloat(v.mrp),
          image: v.image,
          images: v.images || [],
          stock: v.stock,
          availableEmiPlans: v.available_emi_plans || undefined
        })),
        emiPlans: (emiPlans || []).map(ep => ({
          id: ep.plan_id,
          tenure: ep.tenure,
          interestRate: parseFloat(ep.interest_rate),
          cashback: ep.cashback ? parseFloat(ep.cashback) : 0,
          mutualFundName: ep.mutual_fund
        })),
        specifications: specifications || [],
        downpaymentOptions: [],
        createdAt: product.created_at,
        updatedAt: product.updated_at
      };

      return res.json(formattedProduct);
    }

    // Handle all products
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (productsError) throw productsError;

    // For each product, fetch related data
    const productsWithDetails = await Promise.all(
      products.map(async (product) => {
        // Fetch variants
        const { data: variants } = await supabase
          .from('variants')
          .select('*')
          .eq('product_id', product.id);

        // Fetch EMI plans
        const { data: emiPlans } = await supabase
          .from('emi_plans')
          .select('*')
          .eq('product_id', product.id);

        // Fetch specifications
        const { data: specifications } = await supabase
          .from('specifications')
          .select('*')
          .eq('product_id', product.id);

        return {
          _id: product.id,
          slug: product.slug,
          name: product.name,
          category: product.category,
          description: product.description,
          variants: (variants || []).map(v => ({
            id: v.id,
            name: v.name,
            color: v.color,
            storage: v.storage,
            price: parseFloat(v.price),
            mrp: parseFloat(v.mrp),
            image: v.image,
            images: v.images || [],
            stock: v.stock,
            availableEmiPlans: v.available_emi_plans || undefined
          })),
          emiPlans: (emiPlans || []).map(ep => ({
            id: ep.plan_id,
            tenure: ep.tenure,
            interestRate: parseFloat(ep.interest_rate),
            cashback: ep.cashback ? parseFloat(ep.cashback) : 0,
            mutualFundName: ep.mutual_fund
          })),
          specifications: specifications || [],
          downpaymentOptions: [],
          createdAt: product.created_at,
          updatedAt: product.updated_at
        };
      })
    );

    res.json(productsWithDetails);
  } catch (error: any) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Failed to fetch products", details: error.message });
  }
};

// Create product
export const createProduct = async (req: Request, res: Response) => {
  try {
    const { name, slug, category, description, variants, emiPlans, specifications } = req.body;

    // Insert product
    const { data: product, error: productError } = await supabase
      .from('products')
      .insert({
        slug,
        name,
        category,
        description
      })
      .select()
      .single();

    if (productError) throw productError;

    // Insert variants
    if (variants && variants.length > 0) {
      const variantsToInsert = variants.map((v: any) => ({
        product_id: product.id,
        name: v.name,
        color: v.color,
        storage: v.storage,
        price: v.price,
        mrp: v.mrp,
        image: v.image,
        images: v.images || [],
        stock: v.stock || 10,
        available_emi_plans: v.availableEmiPlans || null
      }));

      const { error: variantsError } = await supabase
        .from('variants')
        .insert(variantsToInsert);

      if (variantsError) throw variantsError;
    }

    // Insert EMI plans
    if (emiPlans && emiPlans.length > 0) {
      const plansToInsert = emiPlans.map((ep: any) => ({
        product_id: product.id,
        plan_id: ep.id,
        tenure: ep.tenure,
        interest_rate: ep.interestRate,
        cashback: ep.cashback || 0
      }));

      const { error: plansError } = await supabase
        .from('emi_plans')
        .insert(plansToInsert);

      if (plansError) throw plansError;
    }

    // Insert specifications
    if (specifications && specifications.length > 0) {
      const specsToInsert = specifications.map((spec: any) => ({
        product_id: product.id,
        key: spec.key,
        value: spec.value
      }));

      const { error: specsError } = await supabase
        .from('specifications')
        .insert(specsToInsert);

      if (specsError) throw specsError;
    }

    res.status(201).json({
      message: "Product created successfully",
      product: { _id: product.id, ...product }
    });
  } catch (error: any) {
    console.error("Error creating product:", error);
    res.status(500).json({ error: "Failed to create product", details: error.message });
  }
};

// Update product
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, slug, category, description, variants, emiPlans, specifications } = req.body;

    // Update product
    const { error: productError } = await supabase
      .from('products')
      .update({
        slug,
        name,
        category,
        description
      })
      .eq('id', id);

    if (productError) throw productError;

    // Delete existing related data
    await supabase.from('variants').delete().eq('product_id', id);
    await supabase.from('emi_plans').delete().eq('product_id', id);
    await supabase.from('specifications').delete().eq('product_id', id);

    // Insert new variants
    if (variants && variants.length > 0) {
      const variantsToInsert = variants.map((v: any) => ({
        product_id: id,
        name: v.name,
        color: v.color,
        storage: v.storage,
        price: v.price,
        mrp: v.mrp,
        image: v.image,
        images: v.images || [],
        stock: v.stock || 10,
        available_emi_plans: v.availableEmiPlans || null
      }));

      const { error: variantsError } = await supabase
        .from('variants')
        .insert(variantsToInsert);

      if (variantsError) throw variantsError;
    }

    // Insert new EMI plans
    if (emiPlans && emiPlans.length > 0) {
      const plansToInsert = emiPlans.map((ep: any) => ({
        product_id: id,
        plan_id: ep.id,
        tenure: ep.tenure,
        interest_rate: ep.interestRate,
        cashback: ep.cashback || 0
      }));

      const { error: plansError } = await supabase
        .from('emi_plans')
        .insert(plansToInsert);

      if (plansError) throw plansError;
    }

    // Insert new specifications
    if (specifications && specifications.length > 0) {
      const specsToInsert = specifications.map((spec: any) => ({
        product_id: id,
        key: spec.key,
        value: spec.value
      }));

      const { error: specsError } = await supabase
        .from('specifications')
        .insert(specsToInsert);

      if (specsError) throw specsError;
    }

    res.json({ message: "Product updated successfully" });
  } catch (error: any) {
    console.error("Error updating product:", error);
    res.status(500).json({ error: "Failed to update product", details: error.message });
  }
};

// Delete product
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) throw error;

    res.json({ message: "Product deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting product:", error);
    res.status(500).json({ error: "Failed to delete product", details: error.message });
  }
};
