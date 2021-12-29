import express from "express";
const router = express.Router();

import { registerUser, userlogs,getProfile,toggleActiveStatus } from "../controllers/userController.js";
import { protect } from "../middlewares/authMiddleware";

router.post("/register", registerUser);
router.get("/userlogs", protect, userlogs);
router.get("/getProfile/:id", protect, getProfile);
router.get("/toggle-active/:id",protect,toggleActiveStatus);


export default router;
