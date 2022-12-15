import express from "express";
const router = express.Router();

import {
    createFeedback,Feedbacklogs,getFeedbackDetails,
    unregisteredcreateFeedback
} from "../controllers/feedbackController";
import { protect } from "../middlewares/authMiddleware";

router.post("/create-feedback",protect,createFeedback);
router.post("/unregisteredcreateFeedback",unregisteredcreateFeedback);


router.get("/Feedbacklogs",protect,Feedbacklogs);
router.get("/feedback-details/:id",protect,getFeedbackDetails);


export default router;