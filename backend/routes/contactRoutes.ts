import express from "express";
import { createMessage } from "../controllers/contactController.js";
import { contactLimiter } from "../middleware/rateLimiters.js";

const router = express.Router();

router.post("/", contactLimiter, createMessage);

export default router;
