import express from "express";
const router = express.Router();

import {
  createCostSetting,
  editCostSetting
} from "../controllers/costsettingController";
import { protect } from "../middlewares/authMiddleware";

router.post("/createCostSetting", protect, createCostSetting);
router.post("/editCostSetting", protect, editCostSetting);

export default router;
