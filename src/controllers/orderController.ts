import { Request, Response } from "express";
import { supabase } from "../config/supabase";
import { sendLowStockAlert } from "../services/emailService";

export const createOrder = async (req: Request, res: Response) => {
  try {
    const orderData = req.body;
    
    console.log('Received order data:', orderData);
    
    // Validate required fields
    const missingFields = [];
    if (!orderData.productId) missingFields.push('productId');
    if (!orderData.productName) missingFields.push('productName');
    if (!orderData.variantId) missingFields.push('variantId');
    if (orderData.variantPrice === undefined || orderData.variantPrice === null) missingFields.push('variantPrice');
    if (!orderData.emiPlanId) missingFields.push('emiPlanId');
    if (!orderData.emiTenure) missingFields.push('emiTenure');
    if (orderData.monthlyPayment === undefined || orderData.monthlyPayment === null) missingFields.push('monthlyPayment');
    
    if (missingFields.length > 0) {
      console.error('Missing fields:', missingFields);
      return res.status(400).json({ 
        error: `Missing required fields: ${missingFields.join(', ')}`,
        receivedData: orderData 
      });
    }

    // Find the product
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('*')
      .eq('id', orderData.productId)
      .single();

    if (productError || !product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Find the variant in the variants table
    const { data: variant, error: variantError } = await supabase
      .from('variants')
      .select('*')
      .eq('id', orderData.variantId)
      .eq('product_id', orderData.productId)
      .single();
    
    if (variantError || !variant) {
      return res.status(404).json({ error: "Variant not found" });
    }

    // Check if variant has stock
    if ((variant.stock || 0) === 0) {
      return res.status(400).json({ error: "Product is out of stock" });
    }

    const oldStock = variant.stock || 0;

    // Decrement stock in the variants table
    const { error: updateError } = await supabase
      .from('variants')
      .update({ stock: (variant.stock || 0) - 1 })
      .eq('id', orderData.variantId);

    if (updateError) {
      console.error('Error updating stock:', updateError);
      throw updateError;
    }

    // Calculate expected delivery date (7 days from now)
    const expectedDeliveryDate = new Date();
    expectedDeliveryDate.setDate(expectedDeliveryDate.getDate() + 7);

    // Create order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert([{
        product_id: orderData.productId,
        product_name: orderData.productName,
        variant_id: orderData.variantId,
        variant_color: orderData.variantColor,
        variant_storage: orderData.variantStorage,
        variant_price: orderData.variantPrice,
        emi_plan_id: orderData.emiPlanId,
        emi_tenure: orderData.emiTenure,
        monthly_payment: orderData.monthlyPayment,
        interest_rate: orderData.interestRate || 0,
        cashback: orderData.cashback || 0,
        expected_delivery_date: expectedDeliveryDate.toISOString(),
      }])
      .select()
      .single();

    if (orderError) {
      console.error('Error creating order:', orderError);
      throw orderError;
    }

    // Check for low stock alerts (simplified - just check if stock is low)
    const newStock = (variant.stock || 0) - 1;
    const LOW_STOCK_THRESHOLD = 5;
    
    if (newStock <= LOW_STOCK_THRESHOLD && newStock >= 0) {
      // Get all admins
      const { data: admins } = await supabase
        .from('admins')
        .select('email');
      
      if (admins && admins.length > 0) {
        for (const admin of admins) {
          try {
            await sendLowStockAlert(
              admin.email,
              product.name,
              variant.name || `${variant.color} ${variant.storage}GB`,
              newStock,
              LOW_STOCK_THRESHOLD
            );
          } catch (emailError) {
            console.error('Error sending low stock alert:', emailError);
            // Don't fail the order if email fails
          }
        }
      }
    }

    res.status(201).json({
      message: "Order created successfully",
      order,
      stockRemaining: newStock,
    });
  } catch (error: any) {
    console.error("Error creating order:", error);
    res.status(500).json({ error: "Failed to create order", details: error.message });
  }
};

export const getAllOrders = async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    res.json(data || []);
  } catch (error: any) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Failed to fetch orders", details: error.message });
  }
};

export const getOrderById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    if (!data) {
      return res.status(404).json({ error: "Order not found" });
    }
    
    res.json(data);
  } catch (error: any) {
    console.error("Error fetching order:", error);
    res.status(500).json({ error: "Failed to fetch order", details: error.message });
  }
};
