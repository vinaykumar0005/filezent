import File from "../models/File.js";
import { mergeChunks } from "../utils/chunkMerger.js";
import { v4 as uuid } from "uuid";
import { sendMail } from "../config/mail.js";


import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { logActivity } from "../utils/activityLogger.js";


/* =========================
   PATH SETUP (IMPORTANT)
========================= */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Root folder for uploads
const UPLOAD_ROOT = path.join(__dirname, "../uploads");

const CHUNKS_DIR = path.join(UPLOAD_ROOT, "chunks");
const FILES_DIR = path.join(UPLOAD_ROOT, "files");

/* =========================
   ENSURE DIRECTORIES
========================= */

const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

ensureDir(UPLOAD_ROOT);
ensureDir(CHUNKS_DIR);
ensureDir(FILES_DIR);

/* =========================
   UPLOAD CHUNK
========================= */

export const uploadChunk = async (req, res) => {
  try {

    const {
      uploadId,
      chunkIndex,
      totalChunks,
      fileName,
    } = req.body;

    /* =========================
       VALIDATION
    ========================= */

    if (!req.file) {
      console.error("❌ Multer did not receive file");

      return res.status(400).json({
        message: "File chunk missing",
      });
    }

    if (
      !uploadId ||
      chunkIndex === undefined ||
      !totalChunks ||
      !fileName
    ) {
      return res.status(400).json({
        message: "Invalid upload data",
      });
    }

    /* =========================
       LAST CHUNK → MERGE
    ========================= */

    const isLast =
      Number(chunkIndex) + 1 === Number(totalChunks);

    if (!isLast) {
      return res.json({ chunkReceived: true });
    }

    /* =========================
       MERGE
    ========================= */

    const finalDir = path.join(
      process.cwd(),
      "src/uploads/files"
    );

    if (!fs.existsSync(finalDir)) {
      fs.mkdirSync(finalDir, { recursive: true });
    }

    const finalPath = await mergeChunks(
      uploadId,
      Number(totalChunks),
      finalDir,
      fileName
    );

    /* =========================
       CLEANUP
    ========================= */

    const chunkDir = path.join(
      process.cwd(),
      "src/uploads/chunks",
      uploadId
    );

    if (fs.existsSync(chunkDir)) {
      fs.rmSync(chunkDir, {
        recursive: true,
        force: true,
      });
    }



    /* =========================
       SAVE DB
    ========================= */

    const file = await File.create({
      originalName: fileName,
      path: finalPath,
      size: fs.statSync(finalPath).size,
      token: uuid(),
      expiresAt: new Date(
        Date.now() + 24 * 60 * 60 * 1000
      ),
    });
    await logActivity({         //change for dashboard
      userId: req.user?._id,
      type: "UPLOAD",
      fileName,
      ip: req.ip,
    });


    return res.json({
      success: true,

      downloadLink:
        `${process.env.SERVER_URL}/api/files/download/${file.token}`,
    });
    console.log("File:", req.file?.originalname);
    console.log("Body:", req.body);// add for console only

  } catch (err) {

    console.error("❌ Upload Error:", err);

    return res.status(500).json({
      message: "Upload failed",
    });
  }
};





/* =========================
   DOWNLOAD FILE
========================= */

export const downloadFile = async (req, res) => {
  try {
    const file = await File.findOne({
      token: req.params.token,
    });

    if (!file) {
      return res.status(404).send("File not found");
    }

    if (file.expiresAt < Date.now()) {
      return res.status(410).send("Link expired");
    }

    if (!fs.existsSync(file.path)) {
      return res.status(404).send("File removed");
    }
    await logActivity({           //change for dash
      userId: file.userId,
      type: "DOWNLOAD",
      fileName: file.originalName,
      ip: req.ip,
    });


    res.download(
      file.path,
      file.originalName
    );

  } catch (err) {
    console.error("Download Error:", err);

    res.status(500).send("Download failed");
  }
};



/* =========================
   SEND FILE LINK EMAIL
========================= */

export const sendEmail = async (req, res) => {
  try {
    const { email, link } = req.body;

    if (!email || !link) {
      return res.status(400).json({
        message: "Email and link required",
      });
    }

    const cleanEmail = email.trim().toLowerCase();

    await sendMail({
      to: cleanEmail,
      subject: "File Shared With You - Filezent",
      html: `
        <h2>📁 File Shared With You</h2>

        <p>You received a file via <strong>Filezent</strong>.</p>

        <p style="margin:20px 0;">
          <a
            href="${link}"
            style="
              background:#2563eb;
              color:white;
              padding:12px 20px;
              text-decoration:none;
              border-radius:6px;
              display:inline-block;
            "
          >
            Download File
          </a>
        </p>

        <p>This link will expire in 24 hours.</p>

        <p style="color:#666;font-size:12px;">
          If you didn’t request this, ignore this email.
        </p>
      `,
    });

    res.json({ success: true });

    await logActivity({         //change for dash
      userId: req.user?._id,
      type: "EMAIL",
      fileName: "Shared File",
      receiverEmail: cleanEmail,
      ip: req.ip,
    });


  } catch (err) {
    console.error("File Email Error:", err);

    res.status(500).json({
      message: "Email sending failed",
    });
  }
};