import express from "express";
const router = express.Router();

import {
  createregisteredCourses,
  registeredcourseslogs,
  registeredcoursesDetails,
  userRegisteredcourseslogs,
  getallResgisteredCoursesofUser,
  updateRegisteredCourse
} from "../controllers/registeredCoursesController";
import { protect } from "../middlewares/authMiddleware";

router.post("/createregisteredCourses", protect, createregisteredCourses);
router.get("/registeredcourseslogs", protect, registeredcourseslogs);
router.get("/userRegisteredcourseslogs", protect, userRegisteredcourseslogs);
router.get("/registeredcoursesDetails/:id", protect, registeredcoursesDetails);
router.post("/getallResgisteredCoursesofUser", protect, getallResgisteredCoursesofUser);
router.get("/updateRegisteredCourse/:id", protect, updateRegisteredCourse);


export default router;
