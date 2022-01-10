import express from "express";
const router = express.Router();

import {
  createregisteredCourses,
  registeredcourseslogs,
  registeredcoursesDetails,
  userRegisteredcourseslogs,
  getallResgisteredCoursesofUser
} from "../controllers/registeredCoursesController";
import { protect } from "../middlewares/authMiddleware";

router.post("/createregisteredCourses", protect, createregisteredCourses);
router.get("/registeredcourseslogs", protect, registeredcourseslogs);
router.get("/userRegisteredcourseslogs", protect, userRegisteredcourseslogs);
router.get("/registeredcoursesDetails/:id", protect, registeredcoursesDetails);
router.post("/getallResgisteredCoursesofUser", protect, getallResgisteredCoursesofUser);


export default router;
