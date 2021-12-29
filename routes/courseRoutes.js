import express from "express";
const router = express.Router();

import { createProduct } from "../controllers/courseController";
import { protect } from "../middlewares/authMiddleware";

router.post("/createProduct",protect, createProduct);


export default router;
