import express from "express";
import { createMessage } from "../controllers/contactController";

const router = express.Router();

router.post("/", createMessage);

export default router;
