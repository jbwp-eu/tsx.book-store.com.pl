import express from "express";
import { admin, protect } from "../middleware/authMiddleware.js";
import {
  deleteReview,
  getMyReviews,
  getReviews,
} from "../controllers/reviewController.js";

const router = express.Router();

router.get("/", protect, admin, getReviews);
router.get("/mine", protect, getMyReviews);
router.delete("/:id", protect, deleteReview);

export default router;
