import express from "express";
const router = express.Router();

import {
    getallNotification,getAllNotificationlogs
} from "../controllers/notificationController";
import { protect } from "../middlewares/authMiddleware";

router.get("/notifications",protect,getallNotification);
router.get("/notificationlogs",protect,getAllNotificationlogs);

export default router;