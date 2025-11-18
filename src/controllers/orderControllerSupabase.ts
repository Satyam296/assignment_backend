import { Request, Response } from "express";
import { supabase } from "../config/supabase";

// Create order
export const createOrder = async (req: Request, res: Response) => {
  try {
    const {
      productId,
      productName,
      variantId,
      variantColor,
      variantStorage,
      variantPrice,
      emiPlanId,
      emiTenure,
      monthlyPayment,
      interestRate,
      cashback,
    } = req.body;

    console.log("Creating order with data:", req.body);

    // Validate required fields
    if (!productId || !variantId || !emiPlanId) {
      return res.status(400).json({ 
        error: "Missing required fields: productId, variantId, emiPlanId" 
      });
    }

    // Get product UUID from MongoDB-style ID (if needed)
    // If your frontend sends UUID already, skip this
    
    // Fetch the variant to check stock
    const { data: variants, error: variantError } = await supabase
      .from('variants')
      .select('*')
      .eq('variant_id', variantId)
      .single();

    if (variantError || !variants) {
      return res.status(404).json({ error: "Variant not found" });
    }

    // Check stock
    if (variants.stock <= 0) {
      return res.status(400).json({ error: "Product is out of stock" });
    }

    // Create order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        product_id: productId,
        product_name: productName,
        variant_id: variantId,
        variant_color: variantColor,
        variant_storage: variantStorage,
        variant_price: variantPrice,
        emi_plan_id: emiPlanId,
        emi_tenure: emiTenure,
        monthly_payment: monthlyPayment,
        interest_rate: interestRate,
        cashback: cashback || 0,
        status: 'pending'
      })
      .select()
      .single();

    if (orderError) throw orderError;

    // Decrease stock
    const { error: stockError } = await supabase
      .from('variants')
      .update({ stock: variants.stock - 1 })
      .eq('id', variants.id);

    if (stockError) throw stockError;

    // Check if stock is low (≤ 5) and send email notification
    if (variants.stock - 1 <= 5) {
      console.log(`⚠️ Low stock alert: ${productName} - ${variantColor} ${variantStorage} (${variants.stock - 1} left)`);
      // TODO: Implement email notification here
    }

    res.status(201).json({
      message: "Order created successfully",
      order: {
        _id: order.id,
        ...order
      },
    });
  } catch (error: any) {
    console.error("Error creating order:", error);
    res.status(500).json({ 
      error: "Failed to create order", 
      details: error.message 
    });
  }
};

// Get all orders
export const getOrders = async (req: Request, res: Response) => {
  try {
    const { data: orders, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json(orders || []);
  } catch (error: any) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ 
      error: "Failed to fetch orders", 
      details: error.message 
    });
  }
};
