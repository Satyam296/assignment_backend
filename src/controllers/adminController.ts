import { Request, Response } from "express";
import Product from "../models/Product";
import Admin from "../models/Admin";
import { sendLowStockAlert, sendTestEmail } from "../services/emailService";

// Get all products with inventory status
export const getInventory = async (req: Request, res: Response) => {
  try {
    const products = await Product.find();
    
    // Calculate inventory summary
    const inventorySummary = products.map(product => {
      const variants = product.variants.map(variant => ({
        id: variant.id,
        name: variant.name,
        color: variant.color,
        storage: variant.storage,
        stock: variant.stock || 0,
        isLowStock: (variant.stock || 0) < 5,
      }));

      const totalStock = variants.reduce((sum, v) => sum + v.stock, 0);
      const lowStockCount = variants.filter(v => v.isLowStock).length;

      return {
        _id: product._id,
        slug: product.slug,
        name: product.name,
        category: product.category,
        variants,
        totalStock,
        lowStockCount,
        variantCount: variants.length,
      };
    });

    res.json(inventorySummary);
  } catch (error) {
    console.error('Error fetching inventory:', error);
    res.status(500).json({ error: "Failed to fetch inventory" });
  }
};

// Update stock for a specific variant
export const updateStock = async (req: Request, res: Response) => {
  try {
    const { productId, variantId, newStock } = req.body;

    if (!productId || !variantId || newStock === undefined) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Find and update the variant
    const variant = product.variants.find(v => v.id === variantId);
    if (!variant) {
      return res.status(404).json({ error: "Variant not found" });
    }

    const oldStock = variant.stock || 0;
    variant.stock = newStock;
    await product.save();

    // Check if stock dropped below threshold and send alert
    const admins = await Admin.find({ notificationEnabled: true });
    
    for (const admin of admins) {
      if (oldStock >= admin.lowStockThreshold && newStock < admin.lowStockThreshold) {
        await sendLowStockAlert(
          admin.email,
          product.name,
          variant.name,
          newStock,
          admin.lowStockThreshold
        );
      }
    }

    res.json({ 
      message: "Stock updated successfully", 
      variant: {
        id: variant.id,
        name: variant.name,
        stock: variant.stock,
      }
    });
  } catch (error) {
    console.error('Error updating stock:', error);
    res.status(500).json({ error: "Failed to update stock" });
  }
};

// Get low stock items
export const getLowStockItems = async (req: Request, res: Response) => {
  try {
    const threshold = parseInt(req.query.threshold as string) || 5;
    const products = await Product.find();
    
    const lowStockItems: any[] = [];

    products.forEach(product => {
      product.variants.forEach(variant => {
        if ((variant.stock || 0) < threshold) {
          lowStockItems.push({
            productId: product._id,
            productName: product.name,
            productSlug: product.slug,
            variantId: variant.id,
            variantName: variant.name,
            color: variant.color,
            storage: variant.storage,
            currentStock: variant.stock || 0,
            price: variant.price,
          });
        }
      });
    });

    res.json({ 
      threshold,
      count: lowStockItems.length,
      items: lowStockItems 
    });
  } catch (error) {
    console.error('Error fetching low stock items:', error);
    res.status(500).json({ error: "Failed to fetch low stock items" });
  }
};

// Create or update admin
export const createAdmin = async (req: Request, res: Response) => {
  try {
    const { email, password, name, lowStockThreshold } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ error: "Admin with this email already exists" });
    }

    const admin = new Admin({
      email,
      password, // In production, hash this!
      name,
      lowStockThreshold: lowStockThreshold || 5,
      notificationEnabled: true,
    });

    await admin.save();

    res.json({ 
      message: "Admin created successfully",
      admin: {
        id: admin._id,
        email: admin.email,
        name: admin.name,
        lowStockThreshold: admin.lowStockThreshold,
      }
    });
  } catch (error) {
    console.error('Error creating admin:', error);
    res.status(500).json({ error: "Failed to create admin" });
  }
};

// Update admin settings
export const updateAdminSettings = async (req: Request, res: Response) => {
  try {
    const { adminId } = req.params;
    const { notificationEnabled, lowStockThreshold } = req.body;

    const admin = await Admin.findById(adminId);
    if (!admin) {
      return res.status(404).json({ error: "Admin not found" });
    }

    if (notificationEnabled !== undefined) {
      admin.notificationEnabled = notificationEnabled;
    }
    if (lowStockThreshold !== undefined) {
      admin.lowStockThreshold = lowStockThreshold;
    }

    await admin.save();

    res.json({ 
      message: "Admin settings updated",
      admin: {
        id: admin._id,
        email: admin.email,
        name: admin.name,
        notificationEnabled: admin.notificationEnabled,
        lowStockThreshold: admin.lowStockThreshold,
      }
    });
  } catch (error) {
    console.error('Error updating admin settings:', error);
    res.status(500).json({ error: "Failed to update admin settings" });
  }
};

// Send test email
export const sendTestNotification = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const result = await sendTestEmail(email);

    if (result.success) {
      res.json({ message: "Test email sent successfully" });
    } else {
      res.status(500).json({ error: "Failed to send test email", details: result.error });
    }
  } catch (error) {
    console.error('Error sending test notification:', error);
    res.status(500).json({ error: "Failed to send test notification" });
  }
};

// Get all admins
export const getAllAdmins = async (req: Request, res: Response) => {
  try {
    const admins = await Admin.find().select('-password'); // Exclude password
    res.json(admins);
  } catch (error) {
    console.error('Error fetching admins:', error);
    res.status(500).json({ error: "Failed to fetch admins" });
  }
};
