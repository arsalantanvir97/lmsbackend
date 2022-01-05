import express from "express";
const router = express.Router();

import {
  createregisteredCourses,
  registeredcourseslogs,
  registeredcoursesDetails
} from "../controllers/registeredCoursesController";
import { protect } from "../middlewares/authMiddleware";

router.post("/createregisteredCourses", protect, createregisteredCourses);
router.get("/registeredcourseslogs", protect, registeredcourseslogs);
router.get("/registeredcoursesDetails/:id", protect, registeredcoursesDetails);

export default router;
