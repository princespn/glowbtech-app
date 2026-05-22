import express from "express";
import { 
  getAllProducts, 
  createProduct, 
  getAllCategories, 
  getProductsByCategory 
} from "../controllers/ProductController.js";

const router = express.Router();

router.get("/", getAllProducts);
router.post("/add", createProduct);

router.get("/categories", getAllCategories);            
router.get("/category/:cat_name", getProductsByCategory);   

export default router;