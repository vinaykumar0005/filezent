import express from "express";
import { upload } from "../middlewares/upload.middleware.js";
import {
  uploadChunk,
  downloadFile,
  sendEmail
} from "../controllers/file.controller.js";

const router = express.Router();

router.post("/upload", upload.single("file"), uploadChunk);
router.get("/download/:token", downloadFile);
router.post("/email", sendEmail);

export default router;
