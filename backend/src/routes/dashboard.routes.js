import express from "express";
import { auth } from "../middlewares/auth.js";
import { getDashboard } from "../controllers/dashboard.controller.js";

const router = express.Router();


router.get("/", auth, getDashboard);


export default router;
