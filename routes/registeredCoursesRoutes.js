import express from "express";
const router = express.Router();

import {
  createregisteredCourses,
  registeredcourseslogs,
  registeredcoursesDetails,
  userRegisteredcourseslogs,
  getallResgisteredCoursesofUser,
  updateRegisteredCourse,
  // updateRegisteredCourseFail
  registeredcoursesDetailsby_id,
  enterpriseRegisteredcourseslogsofemployee,
  userRegisteredcourseslogsforcertificate,
  reregisterCourse,
  getallResgisteredCoursesofUserNotExpired
} from "../controllers/registeredCoursesController";
import { protect } from "../middlewares/authMiddleware";

router.post("/createregisteredCourses", protect, createregisteredCourses);
router.get("/registeredcourseslogs", protect, registeredcourseslogs);
router.get("/userRegisteredcourseslogs", protect, userRegisteredcourseslogs);
router.get("/userRegisteredcourseslogsforcertificate", protect, userRegisteredcourseslogsforcertificate);
router.post("/reregisterCourse", protect, reregisterCourse);

router.get("/registeredcoursesDetails/:id", protect, registeredcoursesDetails);
router.post("/getallResgisteredCoursesofUser", protect, getallResgisteredCoursesofUser);
router.post("/getallResgisteredCoursesofUserNotExpired", protect, getallResgisteredCoursesofUserNotExpired);

router.get("/updateRegisteredCourse/:id", protect, updateRegisteredCourse);
// router.get("/updateRegisteredCourseFail/:id", protect, updateRegisteredCourseFail);
router.get("/registeredcoursesDetailsby_id/:id", protect, registeredcoursesDetailsby_id);
router.get("/enterpriseRegisteredcourseslogsofemployee/:id", protect, enterpriseRegisteredcourseslogsofemployee);


export default router;
