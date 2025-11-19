import { Router } from "express";
import { createAdmin, getInventory, getLowStockItems, getAllOrders, updateStock } from "../controllers/adminController";

const router = Router();

// Admin management
router.post("/admins", createAdmin);

// Inventory management
router.get("/inventory", getInventory);
router.get("/inventory/low-stock", getLowStockItems);
router.put("/inventory/update-stock", updateStock);

// Orders management
router.get("/orders", getAllOrders);

export default router;
