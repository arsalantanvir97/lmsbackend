import express from "express";
const router = express.Router();

import {
  createCategory,
  categorylogs,
  updateCategory,
  toggleActiveStatus
} from "../controllers/categoryController";
import { protect } from "../middlewares/authMiddleware";

router.post("/createCategory", protect, createCategory);
router.get("/categorylogs", protect, categorylogs);
router.post("/updateCategory", protect, updateCategory);
router.get("/toggle-active/:id", protect, toggleActiveStatus);

export default router;
