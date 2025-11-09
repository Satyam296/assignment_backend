import { Router } from "express";
import { 
  getInventory, 
  updateStock, 
  getLowStockItems,
  createAdmin,
  updateAdminSettings,
  sendTestNotification,
  getAllAdmins
} from "../controllers/adminController";

const router = Router();

// Inventory routes
router.get("/inventory", getInventory);
router.get("/inventory/low-stock", getLowStockItems);
router.put("/inventory/update-stock", updateStock);

// Admin management routes
router.get("/admins", getAllAdmins);
router.post("/admins", createAdmin);
router.put("/admins/:adminId/settings", updateAdminSettings);

// Notification routes
router.post("/test-email", sendTestNotification);

export default router;
