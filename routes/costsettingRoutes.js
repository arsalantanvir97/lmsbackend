import express from "express";
const router = express.Router();

import {
  createCostSetting,
  editCostSetting,
  getCostSetting
} from "../controllers/costsettingController";
import { protect } from "../middlewares/authMiddleware";

router.post("/createCostSetting", protect, createCostSetting);
router.post("/editCostSetting", protect, editCostSetting);
router.get("/getCostSetting", protect, getCostSetting);

export default router;
