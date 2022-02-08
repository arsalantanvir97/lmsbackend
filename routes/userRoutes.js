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
  enterpriseSubscription,
  addingEmployee,
  registerEmployee,
  enterpriseemployeelogs,
  getEmployeeProfile,
  getEditEmployeeProfile,
  editEmployee,
  getcount
} from "../controllers/userController.js";
import { protect } from "../middlewares/authMiddleware";

router.post("/register", registerUser);
router.post("/registerEnterprise", registerEnterprise);
router.post("/registerEmployee", registerEmployee);

router.post("/authUser", authUser);
router.post("/userverifyRecoverCode", verifyRecoverCode);
router.post("/userRecoverPassword", recoverPassword);
router.post("/userresetPassword", resetPassword);
router.post("/editProfile", protect, editProfile);
router.post("/editEmployee", protect, editEmployee);

router.get("/userlogs", protect, userlogs);
router.get("/enterpriseemployeelogs/:id", protect, enterpriseemployeelogs);
router.get("/getEmployeeProfile/:id", protect, getEmployeeProfile);
router.get("/getEditEmployeeProfile/:id", protect, getEditEmployeeProfile);



router.get("/getProfile/:id", protect, getProfile);
router.get("/toggle-active/:id", protect, toggleActiveStatus);
router.get("/newsletterSubscription/:id", protect, newsletterSubscription);
router.get("/getSubscribedUsers", protect, getSubscribedUsers);
router.get("/getlatestusers", protect, getLatestUsers);
router.post("/verifyAndREsetPassword", protect, verifyAndREsetPassword);
router.post("/enterpriseSubscription", enterpriseSubscription);
router.post("/addingEmployee", addingEmployee);
router.get("/getcount", getcount);


export default router;
