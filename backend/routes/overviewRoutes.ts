import express from "express";
import { admin, protect } from "../middleware/authMiddleware";
import { getOverviewData } from "../controllers/overviewController";

const router = express.Router();

router.get("/", protect, admin, getOverviewData);

export default router;
