import express from "express";
const router = express.Router();

import {
    getallNotification,getAllNotificationlogs,
    usernotifications,notificationDetails,
    enterprisenotifications
} from "../controllers/notificationController";
import { protect } from "../middlewares/authMiddleware";

router.get("/notifications",protect,getallNotification);
router.get("/usernotifications/:id",protect,usernotifications);
router.get("/enterprisenotifications/:id",protect,enterprisenotifications);

router.get("/notificationDetails/:id", protect, notificationDetails);

router.get("/notificationlogs",protect,getAllNotificationlogs);

export default router;