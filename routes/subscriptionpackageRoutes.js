import express from "express";
const router = express.Router();

import { createSubscriptionPackage,subscriptionpackageDetails,subscriptionpackagelogs } from "../controllers/subscriptionpackageController";
import { protect } from "../middlewares/authMiddleware";

router.post("/createSubscriptionPackage", protect, createSubscriptionPackage);
router.get("/subscriptionpackagelogs", protect, subscriptionpackagelogs);
router.get("/subscriptionpackageDetails/:id", protect, subscriptionpackageDetails);

export default router;
