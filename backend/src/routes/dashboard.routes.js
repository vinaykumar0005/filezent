import express from "express";
import { auth } from "../middlewares/auth.js";
import Activity from "../models/Activity.js";
import { getDashboard } from "../controllers/dashboard.controller.js";

const router = express.Router();


router.get("/", auth, getDashboard);
router.get("/", async (req, res) => {
  try {
    const activities = await Activity.find({
      userId: req.user._id,
    }).sort({ createdAt: -1 });

    res.json({
      user: req.user,
      activities,
    });
  } catch (err) {
    console.error("Activity Log Error:", err);
    res.status(500).json({
      message: "Failed to load dashboard",
    });
  }
});


export default router;
