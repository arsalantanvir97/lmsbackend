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
  categoryfiltergroupedCourses,
  courseByCategory,
  filterCoursebyText,
  allCoursesandCategories
} from "../controllers/courseController";
import { protect } from "../middlewares/authMiddleware";

router.post("/createCourse", protect, createCourse);
router.get("/courselogs", protect, courselogs);
router.get("/toggle-active/:id", protect, toggleActiveStatus);
router.get("/courseDetails/:id",  courseDetails);
router.post("/editCourse", protect, editCourse);
router.get("/allCourses", protect, allCourses);
router.get("/groupedCourses",  groupedCourses);
router.get("/categoryfiltergroupedCourses/:id", categoryfiltergroupedCourses);
router.get("/courseByCategory/:id",  courseByCategory);
router.post("/filterCoursebyText",  filterCoursebyText);
router.get("/allCoursesandCategories", protect, allCoursesandCategories);



export default router;
