import express from "express";
const router = express.Router();
import {
  authAdmin,
  registerAdmin,
  recoverPassword,
  verifyRecoverCode,
  resetPassword,
  editProfile,
  verifyAndREsetPassword
} from "../controllers/adminController";
import { protect } from "../middlewares/authMiddleware";

router.post("/adminRegister", registerAdmin);
router.post("/adminAuth", authAdmin);
router.post("/adminRecoverPassword", recoverPassword);
router.post("/adminverifyRecoverCode", verifyRecoverCode);
router.post("/adminresetPassword", resetPassword);
router.post("/editProfile", protect, editProfile);
router.post("/verifyAndREsetPassword", protect, verifyAndREsetPassword);


export default router;
