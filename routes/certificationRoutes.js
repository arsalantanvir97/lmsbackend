import express from "express";
const router = express.Router();

import { createregisteredCourses ,certificationlogs} from "../controllers/certificationController";
import { protect } from "../middlewares/authMiddleware";

router.post("/createregisteredCourses", protect, createregisteredCourses);
router.get("/certificationlogs", protect, certificationlogs);

export default router;
