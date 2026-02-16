import express from "express";
import {
  addOrderItems,
  getOrderById,
  getMyOrders,
  getOrders,
  deleteOrder,
  updateOrderToDelivered,
} from "../controllers/orderController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, admin, getOrders);
router.get("/mine", protect, getMyOrders);
router.get("/:id", protect, getOrderById);

router.post("/", protect, addOrderItems);

router.put("/:id/deliver", protect, admin, updateOrderToDelivered);

router.delete("/:id", protect, admin, deleteOrder);

export default router;
