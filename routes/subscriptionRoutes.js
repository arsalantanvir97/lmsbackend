import express from "express";
const router = express.Router();

import {  subscriptionlogs} from "../controllers/subscriptionController";
import { protect } from "../middlewares/authMiddleware";

router.get("/subscriptionlogs", protect, subscriptionlogs);

export default router;
