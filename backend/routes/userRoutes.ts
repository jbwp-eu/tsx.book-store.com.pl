import express from "express";
import {
  registerUser,
  authUser,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
  updateUserProfile,
} from "../controllers/userController";
import { admin, protect } from "../middleware/authMiddleware";

const router = express.Router();

router.get("/", protect, admin, getUsers);

router.get("/:id", protect, admin, getUserById);

router.post("/register", registerUser);
router.post("/login", authUser);

router.put("/profile", protect, updateUserProfile);
router.put("/:id", protect, admin, updateUser);

router.delete("/:id", protect, admin, deleteUser);

export default router;
