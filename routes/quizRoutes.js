import express from "express";
const router = express.Router();

import {
  createQuiz,
  deleteQuiz,
  quizlogs,
  editQuiz,
  quizDetails,
  quizzCourseid
} from "../controllers/quizController";
import { protect } from "../middlewares/authMiddleware";

router.post("/createQuiz", protect, createQuiz);
router.get("/deleteQuiz/:id", protect, deleteQuiz);
router.get("/quizlogs", protect, quizlogs);
router.post("/editQuiz", protect, editQuiz);
router.get("/quizDetails/:id", protect, quizDetails);
router.get("/quizzCourseid/:id", protect, quizzCourseid);

export default router;
