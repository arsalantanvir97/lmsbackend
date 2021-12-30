import express from "express";
const router = express.Router();

import { createLecture, lecturelogs ,lectureDetails} from "../controllers/lectureController";
import { protect } from "../middlewares/authMiddleware";

router.post("/createLecture", protect, createLecture);
router.get("/lecturelogs", protect, lecturelogs);
router.get("/lectureDetails/:id", protect, lectureDetails);

export default router;
