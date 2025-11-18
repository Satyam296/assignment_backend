import { Router } from "express";
import { adminLogin, createAdmin, getInventory, getLowStock } from "../controllers/adminControllerSupabase";

const router = Router();

// Admin authentication
router.post("/login", adminLogin);
router.post("/admins", createAdmin);

// Inventory management
router.get("/inventory", getInventory);
router.get("/inventory/low-stock", getLowStock);

export default router;
