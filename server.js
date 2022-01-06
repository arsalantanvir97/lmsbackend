import path from "path";
import cors from "cors";
import express from "express";
import dotenv from "dotenv";
import multer from "multer";
import logger from "morgan";

import connectDB from "./config/db.js";
import { fileFilter, fileStorage } from "./multer";
import adminRoutes from "./routes/adminRoutes";
import userRoutes from "./routes/userRoutes";
import categoryRoutes from "./routes/categoryRoutes";
import courseRoutes from "./routes/courseRoutes";
import lectureRoutes from "./routes/lectureRoutes";
import quizRoutes from "./routes/quizRoutes";
import feedbackRoutes from "./routes/feedbackRoutes";
import newsletterRoutes from "./routes/newsletterRoutes";
import costsettingRoutes from "./routes/costsettingRoutes";
import subscriptionSettingRoutes from "./routes/subscriptionSettingRoutes";
import registeredCoursesRoutes from "./routes/registeredCoursesRoutes";
import subscriptionpackageRoutes from "./routes/subscriptionpackageRoutes";
import certificationRoutes from "./routes/certificationRoutes";
import bookingRoutes from "./routes/bookingRoutes";
import appointmentRoutes from "./routes/appointmentRoutes";
import notificationRoutes from "./routes/notificationRoutes";

dotenv.config();

connectDB();
const app = express();
app.use(cors());
app.options("*", cors());
app.use(express.json());
app.use(logger("dev"));

app.use(
  multer({
    storage: fileStorage,
    fileFilter: fileFilter
  }).fields([
    {
      name: "user_image",
      maxCount: 1
    },
    {
      name: "ad_video",
      maxCount: 1
    },
    {
      name: "doc_schedule",
      maxCount: 1
    },
    {
      name: "reciepts",
      maxCount: 12
    }
  ])
);
app.use("/api/admin", adminRoutes);
app.use("/api/user", userRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/course", courseRoutes);
app.use("/api/lecture", lectureRoutes);
app.use("/api/quiz", quizRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/newsletter", newsletterRoutes);
app.use("/api/costsetting", costsettingRoutes);
app.use("/api/subscriptionsetting", subscriptionSettingRoutes);
app.use("/api/registeredCourses", registeredCoursesRoutes);
app.use("/api/subscriptionpackageRoutes", subscriptionpackageRoutes);
app.use("/api/certification", certificationRoutes);
app.use("/api/booking", bookingRoutes);
app.use("/api/appointment", appointmentRoutes);
app.use("/api/notification", notificationRoutes);

const __dirname = path.resolve();
app.use("/uploads", express.static(__dirname + "/uploads"));

app.get("/", (req, res) => {
  res.send("API is running....");
});

app.listen(5095, console.log("Server running on port 5095"));
