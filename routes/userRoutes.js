import express from "express";
const router = express.Router();

import {
  registerUser,
  userlogs,
  authUser,
  getProfile,
  toggleActiveStatus,
  newsletterSubscription,
  getSubscribedUsers,
  getLatestUsers,
  verifyRecoverCode,
  recoverPassword,
  resetPassword,
  editProfile,
  verifyAndREsetPassword,
  registerEnterprise,
  enterpriseSubscription,addingEmployee
} from "../controllers/userController.js";
import { protect } from "../middlewares/authMiddleware";

router.post("/register", registerUser);
router.post("/registerEnterprise", registerEnterprise);

router.post("/authUser", authUser);
router.post("/userverifyRecoverCode", verifyRecoverCode);
router.post("/userRecoverPassword", recoverPassword);
router.post("/userresetPassword", resetPassword);
router.post("/editProfile", protect, editProfile);

router.get("/userlogs", protect, userlogs);
router.get("/getProfile/:id", protect, getProfile);
router.get("/toggle-active/:id", protect, toggleActiveStatus);
router.get("/newsletterSubscription/:id", protect, newsletterSubscription);
router.get("/getSubscribedUsers", protect, getSubscribedUsers);
router.get("/getlatestusers", protect, getLatestUsers);
router.post("/verifyAndREsetPassword", protect, verifyAndREsetPassword);
router.post("/enterpriseSubscription", enterpriseSubscription);
router.post("/addingEmployee", addingEmployee);


export default router;
