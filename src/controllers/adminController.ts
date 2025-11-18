import { Request, Response } from "express";
import { supabase } from "../config/supabase";
import { sendLowStockAlert, sendTestEmail } from "../services/emailService";

// Get all products with inventory status
export const getInventory = async (req: Request, res: Response) => {
  try {
    const { data: products, error } = await supabase
      .from('products')
      .select('*');
    
    if (error) throw error;

    // Calculate inventory summary
    const inventorySummary = (products || []).map((product: any) => {
      const variants = (product.variants || []).map((variant: any) => ({
        id: variant.id,
        name: variant.name,
        color: variant.color,
        storage: variant.storage,
        stock: variant.stock || 0,
        isLowStock: (variant.stock || 0) < 5,
      }));

      const totalStock = variants.reduce((sum: number, v: any) => sum + v.stock, 0);
      const lowStockCount = variants.filter((v: any) => v.isLowStock).length;

      return {
        id: product.id,
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
  } catch (error: any) {
    console.error('Error fetching inventory:', error);
    res.status(500).json({ error: "Failed to fetch inventory", details: error.message });
  }
};

// Update stock for a specific variant
export const updateStock = async (req: Request, res: Response) => {
  try {
    const { productId, variantId, newStock } = req.body;

    if (!productId || !variantId || newStock === undefined) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const { data: product, error: productError } = await supabase
      .from('products')
      .select('*')
      .eq('id', productId)
      .single();

    if (productError || !product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Find and update the variant
    const variants = product.variants || [];
    const variantIndex = variants.findIndex((v: any) => v.id === variantId);
    
    if (variantIndex === -1) {
      return res.status(404).json({ error: "Variant not found" });
    }

    const oldStock = variants[variantIndex].stock || 0;
    variants[variantIndex] = {
      ...variants[variantIndex],
      stock: newStock
    };

    // Update product
    const { error: updateError } = await supabase
      .from('products')
      .update({ variants: variants })
      .eq('id', productId);

    if (updateError) throw updateError;

    // Check if stock dropped below threshold and send alert
    const { data: admins } = await supabase
      .from('admins')
      .select('*')
      .eq('notification_enabled', true);
    
    if (admins && admins.length > 0) {
      for (const admin of admins) {
        if (oldStock >= admin.low_stock_threshold && newStock < admin.low_stock_threshold) {
          await sendLowStockAlert(
            admin.email,
            product.name,
            variants[variantIndex].name,
            newStock,
            admin.low_stock_threshold
          );
        }
      }
    }

    res.json({ 
      message: "Stock updated successfully", 
      variant: {
        id: variants[variantIndex].id,
        name: variants[variantIndex].name,
        stock: variants[variantIndex].stock,
      }
    });
  } catch (error: any) {
    console.error('Error updating stock:', error);
    res.status(500).json({ error: "Failed to update stock", details: error.message });
  }
};

// Get low stock items
export const getLowStockItems = async (req: Request, res: Response) => {
  try {
    const threshold = parseInt(req.query.threshold as string) || 5;
    const { data: products, error } = await supabase
      .from('products')
      .select('*');
    
    if (error) throw error;

    const lowStockItems: any[] = [];

    (products || []).forEach((product: any) => {
      const variants = product.variants || [];
      variants.forEach((variant: any) => {
        if ((variant.stock || 0) < threshold) {
          lowStockItems.push({
            productId: product.id,
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
  } catch (error: any) {
    console.error('Error fetching low stock items:', error);
    res.status(500).json({ error: "Failed to fetch low stock items", details: error.message });
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
    const { data: existingAdmin } = await supabase
      .from('admins')
      .select('*')
      .eq('email', email.toLowerCase())
      .single();

    if (existingAdmin) {
      return res.status(400).json({ error: "Admin with this email already exists" });
    }

    const { data: admin, error } = await supabase
      .from('admins')
      .insert([{
        email: email.toLowerCase(),
        password, // In production, hash this!
        name,
        low_stock_threshold: lowStockThreshold || 5,
        notification_enabled: true,
      }])
      .select()
      .single();

    if (error) throw error;

    res.json({ 
      message: "Admin created successfully",
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        low_stock_threshold: admin.low_stock_threshold,
      }
    });
  } catch (error: any) {
    console.error('Error creating admin:', error);
    res.status(500).json({ error: "Failed to create admin", details: error.message });
  }
};

// Update admin settings
export const updateAdminSettings = async (req: Request, res: Response) => {
  try {
    const { adminId } = req.params;
    const { notificationEnabled, lowStockThreshold } = req.body;

    const { data: admin, error: fetchError } = await supabase
      .from('admins')
      .select('*')
      .eq('id', adminId)
      .single();

    if (fetchError || !admin) {
      return res.status(404).json({ error: "Admin not found" });
    }

    const updates: any = {};
    if (notificationEnabled !== undefined) {
      updates.notification_enabled = notificationEnabled;
    }
    if (lowStockThreshold !== undefined) {
      updates.low_stock_threshold = lowStockThreshold;
    }

    const { data: updatedAdmin, error: updateError } = await supabase
      .from('admins')
      .update(updates)
      .eq('id', adminId)
      .select()
      .single();

    if (updateError) throw updateError;

    res.json({ 
      message: "Admin settings updated",
      admin: {
        id: updatedAdmin.id,
        email: updatedAdmin.email,
        name: updatedAdmin.name,
        notification_enabled: updatedAdmin.notification_enabled,
        low_stock_threshold: updatedAdmin.low_stock_threshold,
      }
    });
  } catch (error: any) {
    console.error('Error updating admin settings:', error);
    res.status(500).json({ error: "Failed to update admin settings", details: error.message });
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
  } catch (error: any) {
    console.error('Error sending test notification:', error);
    res.status(500).json({ error: "Failed to send test notification", details: error.message });
  }
};

// Get all admins
export const getAllAdmins = async (req: Request, res: Response) => {
  try {
    const { data: admins, error } = await supabase
      .from('admins')
      .select('id, email, name, notification_enabled, low_stock_threshold, created_at');
    
    if (error) throw error;
    res.json(admins || []);
  } catch (error: any) {
    console.error('Error fetching admins:', error);
    res.status(500).json({ error: "Failed to fetch admins", details: error.message });
  }
};
