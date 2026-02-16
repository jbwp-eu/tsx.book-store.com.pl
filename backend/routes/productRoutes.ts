import { Router } from "express";
import {
  getProductById,
  getProducts,
  deleteProduct,
  createProduct,
  updateProduct,
  createProductReview,
  getFeaturedProducts,
} from "../controllers/productController";

import { admin, protect } from "../middleware/authMiddleware";
import fileUpload from "../middleware/file-upload-aws";

const router = Router();

router.get("/", getProducts);
router.get("/featured", getFeaturedProducts);
router.get("/:id", getProductById);

router.post("/", createProduct);

router.patch("/:id", protect, admin, fileUpload, updateProduct);
router.post("/:id/reviews", protect, createProductReview);

router.delete("/:id", protect, admin, deleteProduct);

export default router;
