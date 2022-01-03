import express from "express";
const router = express.Router();

import {
  createNewsLetter,
  newsletterlogs,
  getNewsLetterDetails
} from "../controllers/newsletterController";
import { protect } from "../middlewares/authMiddleware";

router.post("/createNewsLetter", protect, createNewsLetter);
router.get("/newsletterlogs", protect, newsletterlogs);
router.get("/getNewsLetterDetails/:id", protect, getNewsLetterDetails);

export default router;
