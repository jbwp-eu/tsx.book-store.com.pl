import { Router } from "express";
import {
  getProductById,
  getProducts,
  deleteProduct,
  createProduct,
  updateProduct,
  createProductReview,
  getFeaturedProducts,
} from "../controllers/productController.js";

import { admin, protect } from "../middleware/authMiddleware.js";
import fileUpload from "../middleware/file-upload-aws.js";

const router = Router();

router.get("/", getProducts);
router.get("/featured", getFeaturedProducts);
router.get("/:id", getProductById);

router.post("/", createProduct);

router.patch("/:id", protect, admin, fileUpload, updateProduct);
router.post("/:id/reviews", protect, createProductReview);

router.delete("/:id", protect, admin, deleteProduct);

export default router;
