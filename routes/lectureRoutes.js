import express from "express";
const router = express.Router();

import {
  createLecture,
  lecturelogs,
  lectureDetails,
  editLecture,
  deleteLecture,
  allLectures,
  lectureDetailsbyCourseid
} from "../controllers/lectureController";
import { protect } from "../middlewares/authMiddleware";

router.post("/createLecture", protect, createLecture);
router.get("/lecturelogs", protect, lecturelogs);
router.get("/lectureDetails/:id", protect, lectureDetails);
router.post("/editLecture", protect, editLecture);
router.get("/deleteLecture/:id", protect, deleteLecture);
router.get("/allLectures", protect, allLectures);
router.get("/lectureDetailsbyCourseid/:id", protect, lectureDetailsbyCourseid);


export default router;
