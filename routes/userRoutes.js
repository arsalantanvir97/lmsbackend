import express from "express";
const router = express.Router();

import {
  registerUser,
  userlogs,
  getProfile,
  toggleActiveStatus,
  newsletterSubscription,
  getSubscribedUsers,
  getLatestUsers
} from "../controllers/userController.js";
import { protect } from "../middlewares/authMiddleware";

router.post("/register", registerUser);
router.get("/userlogs", protect, userlogs);
router.get("/getProfile/:id", protect, getProfile);
router.get("/toggle-active/:id", protect, toggleActiveStatus);
router.get("/newsletterSubscription/:id", protect, newsletterSubscription);
router.get("/getSubscribedUsers", protect, getSubscribedUsers);
router.get("/getlatestusers", protect,getLatestUsers);

export default router;
