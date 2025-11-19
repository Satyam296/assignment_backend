import { Request, Response } from "express";
import { supabase } from "../config/supabase";

export const getAllProducts = async (req: Request, res: Response) => {
  try {
    // Fetch all products
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (productsError) throw productsError;
    
    // Fetch variants for all products
    const { data: variants, error: variantsError } = await supabase
      .from('variants')
      .select('*')
      .order('created_at', { ascending: true });
    
    if (variantsError) throw variantsError;
    
    // Combine products with their variants
    const productsWithVariants = products?.map(product => ({
      ...product,
      variants: variants?.filter(v => v.product_id === product.id) || []
    })) || [];
    
    res.json(productsWithVariants);
  } catch (error: any) {
    res.status(500).json({ error: "Failed to fetch products", details: error.message });
  }
};

export const getProductBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    
    // Fetch product
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('*')
      .eq('slug', slug)
      .single();

    if (productError) throw productError;
    
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    
    // Fetch variants
    const { data: variants, error: variantsError } = await supabase
      .from('variants')
      .select('*')
      .eq('product_id', product.id)
      .order('created_at', { ascending: true });
    
    if (variantsError) throw variantsError;
    
    // Fetch EMI plans
    const { data: emiPlans, error: emiError } = await supabase
      .from('emi_plans')
      .select('*')
      .eq('product_id', product.id)
      .order('tenure', { ascending: true });
    
    if (emiError) throw emiError;
    
    // Fetch specifications
    const { data: specifications, error: specsError } = await supabase
      .from('specifications')
      .select('*')
      .eq('product_id', product.id);
    
    if (specsError) throw specsError;
    
    // Combine all data
    const productWithDetails = {
      ...product,
      variants: variants || [],
      emiPlans: emiPlans?.map(plan => ({
        id: plan.plan_id,
        tenure: plan.tenure,
        interestRate: plan.interest_rate,
        cashback: plan.cashback || 0,
        mutualFundName: plan.mutual_fund || ''
      })) || [],
      specifications: specifications || []
    };

    res.json(productWithDetails);
  } catch (error: any) {
    res.status(500).json({ error: "Failed to fetch product", details: error.message });
  }
};

// Create new product
export const createProduct = async (req: Request, res: Response) => {
  try {
    const { name, slug, category, description, variants, emiPlans, specifications } = req.body;
    
    // Validate required fields
    if (!name || !slug || !category) {
      return res.status(400).json({ error: "Missing required fields: name, slug, category" });
    }
    
    // Check if slug already exists
    const { data: existingProduct } = await supabase
      .from('products')
      .select('id')
      .eq('slug', slug)
      .single();
      
    if (existingProduct) {
      return res.status(400).json({ error: "Product with this slug already exists" });
    }
    
    // Create product
    const { data: product, error: productError } = await supabase
      .from('products')
      .insert([{ name, slug, category, description }])
      .select()
      .single();
      
    if (productError) throw productError;
    
    // Create variants if provided
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
        stock: v.stock || 0,
        available_emi_plans: v.availableEmiPlans || []
      }));
      
      const { error: variantsError } = await supabase
        .from('variants')
        .insert(variantsToInsert);
      
      if (variantsError) {
        console.error('Error inserting variants:', variantsError);
        throw variantsError;
      }
    }
    
    // Create EMI plans if provided
    if (emiPlans && emiPlans.length > 0) {
      const emiPlansToInsert = emiPlans.map((plan: any) => ({
        product_id: product.id,
        plan_id: plan.id,
        tenure: plan.tenure,
        interest_rate: plan.interestRate || 0,
        cashback: plan.cashback || 0,
        mutual_fund: plan.mutualFundName || ''
      }));
      
      const { error: emiError } = await supabase
        .from('emi_plans')
        .insert(emiPlansToInsert);
      
      if (emiError) {
        console.error('Error inserting EMI plans:', emiError);
        throw emiError;
      }
    }
    
    // Create specifications if provided
    if (specifications && specifications.length > 0) {
      const specsToInsert = specifications.map((spec: any) => ({
        product_id: product.id,
        key: spec.key,
        value: spec.value
      }));
      
      const { error: specsError } = await supabase
        .from('specifications')
        .insert(specsToInsert);
      
      if (specsError) {
        console.error('Error inserting specifications:', specsError);
        throw specsError;
      }
    }
    
    res.status(201).json({
      message: "Product created successfully",
      product,
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
    
    console.log('Updating product:', id);
    console.log('Variants to update:', variants?.length || 0);
    console.log('EMI plans to update:', emiPlans?.length || 0);
    
    // Update product basic info
    const { data: product, error: productError } = await supabase
      .from('products')
      .update({ name, slug, category, description })
      .eq('id', id)
      .select()
      .single();
      
    if (productError) {
      console.error('Product update error:', productError);
      throw productError;
    }
    
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    
    console.log('Deleting existing related data for product:', id);
    
    // Delete existing variants, EMI plans, and specifications - MUST complete before inserting new ones
    const { error: deleteVariantsError, count: deletedVariants } = await supabase
      .from('variants')
      .delete()
      .eq('product_id', id);
    
    if (deleteVariantsError) {
      console.error('Delete variants error:', deleteVariantsError);
      throw new Error(`Failed to delete variants: ${deleteVariantsError.message}`);
    }
    console.log(`Deleted ${deletedVariants || 0} existing variants`);
    
    const { error: deleteEmiError } = await supabase
      .from('emi_plans')
      .delete()
      .eq('product_id', id);
    
    if (deleteEmiError) {
      console.error('Delete EMI plans error:', deleteEmiError);
      throw new Error(`Failed to delete EMI plans: ${deleteEmiError.message}`);
    }
    
    const { error: deleteSpecsError } = await supabase
      .from('specifications')
      .delete()
      .eq('product_id', id);
    
    if (deleteSpecsError) {
      console.error('Delete specifications error:', deleteSpecsError);
      throw new Error(`Failed to delete specifications: ${deleteSpecsError.message}`);
    }
    
    console.log('All existing data deleted successfully');
    
    // Insert updated variants
    if (variants && variants.length > 0) {
      const variantsToInsert = variants.map((v: any) => ({
        product_id: id,
        name: v.name || `${v.color} ${v.storage}`,
        color: v.color || '',
        storage: v.storage || '',
        price: parseFloat(v.price) || 0,
        mrp: parseFloat(v.mrp) || 0,
        image: v.image || '',
        images: Array.isArray(v.images) ? v.images : [],
        stock: parseInt(v.stock) || 0,
        available_emi_plans: Array.isArray(v.availableEmiPlans) ? v.availableEmiPlans : []
      }));
      
      console.log('Inserting variants:', variantsToInsert);
      
      const { error: variantsError } = await supabase
        .from('variants')
        .insert(variantsToInsert);
      
      if (variantsError) {
        console.error('Variants insert error:', variantsError);
        throw variantsError;
      }
    }
    
    // Insert updated EMI plans
    if (emiPlans && emiPlans.length > 0) {
      const emiPlansToInsert = emiPlans.map((plan: any) => {
        const planData = {
          product_id: id,
          plan_id: String(plan.id || plan.plan_id || `plan_${Date.now()}`),
          tenure: parseInt(plan.tenure) || 0,
          interest_rate: parseFloat(plan.interestRate || plan.interest_rate) || 0,
          cashback: parseFloat(plan.cashback) || 0,
          mutual_fund: String(plan.mutualFundName || plan.mutual_fund || '')
        };
        console.log('EMI plan to insert:', planData);
        return planData;
      });
      
      console.log('Inserting EMI plans:', emiPlansToInsert);
      
      const { error: emiError } = await supabase
        .from('emi_plans')
        .insert(emiPlansToInsert);
      
      if (emiError) {
        console.error('EMI plans insert error:', emiError);
        console.error('EMI plans that failed:', JSON.stringify(emiPlansToInsert, null, 2));
        throw new Error(`Failed to insert EMI plans: ${emiError.message}`);
      }
    }
    
    // Insert updated specifications
    if (specifications && specifications.length > 0) {
      const validSpecs = specifications.filter((spec: any) => spec.key && spec.value);
      if (validSpecs.length > 0) {
        const specsToInsert = validSpecs.map((spec: any) => ({
          product_id: id,
          key: spec.key,
          value: spec.value
        }));
        
        console.log('Inserting specifications:', specsToInsert);
        
        const { error: specsError } = await supabase
          .from('specifications')
          .insert(specsToInsert);
        
        if (specsError) {
          console.error('Specifications insert error:', specsError);
          throw specsError;
        }
      }
    }
    
    console.log('Product updated successfully');
    
    res.json({
      message: "Product updated successfully",
      product,
    });
  } catch (error: any) {
    console.error("Error updating product:", error);
    res.status(500).json({ error: "Failed to update product", details: error.message });
  }
};

// Delete product
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // First check if product exists
    const { data: existingProduct, error: checkError } = await supabase
      .from('products')
      .select('id')
      .eq('id', id)
      .single();
    
    if (checkError || !existingProduct) {
      return res.status(404).json({ error: "Product not found" });
    }
    
    // Delete related records first (cascading delete)
    await supabase.from('variants').delete().eq('product_id', id);
    await supabase.from('emi_plans').delete().eq('product_id', id);
    await supabase.from('specifications').delete().eq('product_id', id);
    
    // Now delete the product
    const { data: product, error } = await supabase
      .from('products')
      .delete()
      .eq('id', id)
      .select()
      .single();
      
    if (error) throw error;
    
    res.json({
      message: "Product deleted successfully",
      product,
    });
  } catch (error: any) {
    console.error("Error deleting product:", error);
    res.status(500).json({ error: "Failed to delete product", details: error.message });
  }
};
