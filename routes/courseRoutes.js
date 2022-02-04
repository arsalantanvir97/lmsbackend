import express from "express";
const router = express.Router();

import {
  createCourse,
  courselogs,
  toggleActiveStatus,
  courseDetails,
  editCourse,
  allCourses,
  groupedCourses,
  categoryfiltergroupedCourses
} from "../controllers/courseController";
import { protect } from "../middlewares/authMiddleware";

router.post("/createCourse", protect, createCourse);
router.get("/courselogs", protect, courselogs);
router.get("/toggle-active/:id", protect, toggleActiveStatus);
router.get("/courseDetails/:id", protect, courseDetails);
router.post("/editCourse", protect, editCourse);
router.get("/allCourses", protect, allCourses);
router.get("/groupedCourses", protect, groupedCourses);
router.get("/categoryfiltergroupedCourses/:id", protect, categoryfiltergroupedCourses);


export default router;
