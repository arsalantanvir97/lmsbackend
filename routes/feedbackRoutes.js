import express from "express";
const router = express.Router();

import {
    createFeedback,Feedbacklogs,getFeedbackDetails
} from "../controllers/feedbackController";
import { protect } from "../middlewares/authMiddleware";

router.post("/create-feedback",protect,createFeedback);
router.get("/Feedbacklogs",protect,Feedbacklogs);
router.get("/feedback-details/:id",protect,getFeedbackDetails);


export default router;