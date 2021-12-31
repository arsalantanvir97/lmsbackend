import express from "express";
const router = express.Router();

import {
  createLecture,
  lecturelogs,
  lectureDetails,
  editLecture,
  deleteLecture,
  allLectures
} from "../controllers/lectureController";
import { protect } from "../middlewares/authMiddleware";

router.post("/createLecture", protect, createLecture);
router.get("/lecturelogs", protect, lecturelogs);
router.get("/lectureDetails/:id", protect, lectureDetails);
router.post("/editLecture", protect, editLecture);
router.get("/deleteLecture/:id", protect, deleteLecture);
router.get("/allLectures", protect, allLectures);

export default router;
