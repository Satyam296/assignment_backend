import { Router } from "express";
import { getAllProducts, getProductBySlug, createProduct, updateProduct, deleteProduct } from "../controllers/productController";

const router = Router();

// Get all products (includes slug filtering in controller)
router.get("/", getAllProducts);
router.get("/:slug", getProductBySlug); // Get product by slug
router.post("/", createProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

export default router;
