import { Request, Response } from "express";
import Order from "../models/Order";
import Product from "../models/Product";
import Admin from "../models/Admin";
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

    // Find the product and decrement stock
    const product = await Product.findById(orderData.productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Find the variant - check both id and _id fields
    const variant = product.variants.find(v => 
      v.id === orderData.variantId || 
      (v as any)._id?.toString() === orderData.variantId
    );
    if (!variant) {
      return res.status(404).json({ error: "Variant not found" });
    }

    // Check if variant has stock
    if ((variant.stock || 0) === 0) {
      return res.status(400).json({ error: "Product is out of stock" });
    }

    // Store old stock for notification check
    const oldStock = variant.stock || 0;

    // Decrement stock
    variant.stock = (variant.stock || 0) - 1;
    await product.save();

    // Check if stock dropped below threshold and send alert
    const admins = await Admin.find({ notificationEnabled: true });
    const newStock = variant.stock;
    
    for (const admin of admins) {
      if (newStock < admin.lowStockThreshold && newStock >= 0) {
        await sendLowStockAlert(
          admin.email,
          product.name,
          variant.name,
          newStock,
          admin.lowStockThreshold
        );
      }
    }

    // Create new order
    const order = new Order({
      productId: orderData.productId,
      productName: orderData.productName,
      variantId: orderData.variantId,
      variantColor: orderData.variantColor,
      variantStorage: orderData.variantStorage,
      variantPrice: orderData.variantPrice,
      emiPlanId: orderData.emiPlanId,
      emiTenure: orderData.emiTenure,
      monthlyPayment: orderData.monthlyPayment,
      interestRate: orderData.interestRate,
      cashback: orderData.cashback || 0,
      totalAmount: orderData.emiTenure * orderData.monthlyPayment,
    });

    const savedOrder = await order.save();
    res.status(201).json({
      message: "Order created successfully",
      order: savedOrder,
      stockRemaining: variant.stock,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ error: "Failed to create order" });
  }
};

export const getAllOrders = async (req: Request, res: Response) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
};

export const getOrderById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);
    
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    
    res.json(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({ error: "Failed to fetch order" });
  }
};
