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

const __dirname = path.resolve();
app.use("/uploads", express.static(__dirname + "/uploads"));

app.get("/", (req, res) => {
  res.send("API is running....");
});

app.listen(5095, console.log("Server running on port 5095"));
