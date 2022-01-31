import express from "express";
const router = express.Router();

import {
  userPaymentlogs,
  paymentDetails
} from "../controllers/paymentController";
import { protect } from "../middlewares/authMiddleware";

router.get("/userPaymentlogs", protect, userPaymentlogs);
router.get("/paymentDetails/:id", protect, paymentDetails);

export default router;
