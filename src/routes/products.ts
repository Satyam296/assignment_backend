import { Router } from "express";
import { getProducts, createProduct, updateProduct, deleteProduct } from "../controllers/productControllerSupabase";

const router = Router();

// Get all products (includes slug filtering in controller)
router.get("/", getProducts);
router.get("/:slug", getProducts); // Same endpoint handles slug filtering
router.post("/", createProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

export default router;
