import express from "express";
const router = express.Router();

import {
  createAppointment,
  appointmentlogs,
  appointmentDetails,
  deleteAppointment,
  updatestatus,
  userAppointmentlogs,
  updatetime
} from "../controllers/appointmentController";
import { protect } from "../middlewares/authMiddleware";

router.post("/createAppointment", protect, createAppointment);
router.get("/appointmentlogs", protect, appointmentlogs);
router.get("/appointmentDetails/:id", protect, appointmentDetails);
router.get("/deleteAppointment/:id", protect, deleteAppointment);
router.post("/updatestatus", protect, updatestatus);
router.post("/updatetime", protect, updatetime);

router.get("/userAppointmentlogs", protect, userAppointmentlogs);


export default router;
