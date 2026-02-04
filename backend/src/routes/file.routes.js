import express from "express";
import rateLimit from "express-rate-limit";

import { upload } from "../middlewares/upload.middleware.js";
import {
  uploadChunk,
  downloadFile,
  sendEmail,
} from "../controllers/file.controller.js";

const router = express.Router();

/* =========================
   RATE LIMIT
========================= */

const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
});

const emailLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 50,
});

/* =========================
   ROUTES
========================= */

// Upload
router.post(
  "/upload",
  uploadLimiter,
  upload.single("file"), // FIRST
  uploadChunk             // NO PRE-VALIDATION
);

// Download
router.get("/download/:token", downloadFile);

// Email
router.post("/email", emailLimiter, sendEmail);

export default router;
