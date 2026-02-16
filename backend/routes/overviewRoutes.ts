import express from "express";
import { admin, protect } from "../middleware/authMiddleware.js";
import { getOverviewData } from "../controllers/overviewController.js";

const router = express.Router();

router.get("/", protect, admin, getOverviewData);

export default router;
