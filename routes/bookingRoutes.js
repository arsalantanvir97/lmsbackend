import express from "express";
const router = express.Router();

import { createBooking ,getBooking,editBooking} from "../controllers/bookingController";
import { protect } from "../middlewares/authMiddleware";

router.post("/createBooking", protect, createBooking);
router.get("/getBooking", protect, getBooking);
router.post("/editBooking", protect, editBooking);



export default router;
