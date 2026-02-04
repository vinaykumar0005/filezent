import express from "express";

import { upload } from "../middlewares/upload.middleware.js";

import {
  uploadChunk,
  downloadFile,
  sendEmail,
} from "../controllers/file.controller.js";

import rateLimit from "express-rate-limit";

const router = express.Router();

/* =========================
   RATE LIMITERS
========================= */

// Upload: heavy → strict
const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 200,               // 200 chunks per IP
  message: "Too many uploads. Try later.",
});

// Email: spam protection
const emailLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 50,
  message: "Too many emails sent. Try later.",
});

/* =========================
   VALIDATION
========================= */

const validateUpload = (req, res, next) => {

  const {
    uploadId,
    chunkIndex,
    totalChunks,
    fileName,
  } = req.body;

  if (
    !uploadId ||
    chunkIndex === undefined ||
    !totalChunks ||
    !fileName
  ) {
    return res.status(400).json({
      message: "Invalid upload parameters",
    });
  }

  if (!req.file) {
    return res.status(400).json({
      message: "File chunk missing",
    });
  }

  next();
};

/* =========================
   ROUTES
========================= */

// Upload chunk
router.post(
  "/upload",
  uploadLimiter,
  upload.single("file"),
  validateUpload,
  uploadChunk
);

// Download file
router.get(
  "/download/:token",
  downloadFile
);

// Send file via email
router.post(
  "/email",
  emailLimiter,
  sendEmail
);

export default router;
