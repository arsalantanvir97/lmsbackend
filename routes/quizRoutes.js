import express from "express";
const router = express.Router();

import { createQuiz } from "../controllers/quizController";
import { protect } from "../middlewares/authMiddleware";

router.post("/createQuiz", protect, createQuiz);

export default router;
