import express from "express";
const router = express.Router();

import {
  userPaymentlogs,
  paymentDetails,
  Paymentlogs
} from "../controllers/paymentController";
import { protect } from "../middlewares/authMiddleware";

router.get("/Paymentlogs", protect, Paymentlogs);
router.get("/userPaymentlogs", protect, userPaymentlogs);
router.get("/paymentDetails/:id", protect, paymentDetails);

export default router;
