import express from "express";
const router = express.Router();

import {
  createSubscriptionSetting,
  editSubscriptionSetting,
  allSubscriptionSetting
} from "../controllers/subscriptionSettingController";
import { protect } from "../middlewares/authMiddleware";

router.post("/createSubscriptionSetting", protect, createSubscriptionSetting);
router.post("/editSubscriptionSetting", protect, editSubscriptionSetting);
router.get("/allSubscriptionSetting", protect, allSubscriptionSetting);

export default router;
