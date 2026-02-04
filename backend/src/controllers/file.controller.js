import File from "../models/File.js";
import { mergeChunks } from "../utils/chunkMerger.js";
import { v4 as uuid } from "uuid";
import { sendMail } from "../config/mail.js";

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

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

    if (!req.file) {
      return res.status(400).json({
        message: "No chunk received",
      });
    }

    if (!uploadId || !fileName) {
      return res.status(400).json({
        message: "Invalid upload data",
      });
    }

    const isLast =
      Number(chunkIndex) + 1 === Number(totalChunks);

    if (isLast) {
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

      // Cleanup
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

      const file = await File.create({
        originalName: fileName,
        path: finalPath,
        size: fs.statSync(finalPath).size,
        token: uuid(),
        expiresAt: new Date(
          Date.now() + 24 * 60 * 60 * 1000
        ),
      });

      return res.json({
        success: true,
        downloadLink: `${process.env.SERVER_URL}/api/files/download/${file.token}`,
      });
    }

    res.json({ chunkReceived: true });

  } catch (err) {
    console.error("Upload Error:", err);

    res.status(500).json({
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

  } catch (err) {
    console.error("File Email Error:", err);

    res.status(500).json({
      message: "Email sending failed",
    });
  }
};

//old code using node mailer
// import File from "../models/File.js";
// import { mergeChunks } from "../utils/chunkMerger.js";
// import { v4 as uuid } from "uuid";
// import { createTransporter } from "../config/mail.js";
// import fs from "fs";
// import path from "path";

// /**
//  * Upload chunk controller
//  */
// export const uploadChunk = async (req, res) => {
//   const { uploadId, chunkIndex, totalChunks, fileName } = req.body;

//   if (Number(chunkIndex) + 1 === Number(totalChunks)) {
//     const finalDir = path.join(process.cwd(), "src/uploads/files");

//     const finalPath = mergeChunks(
//       uploadId,
//       Number(totalChunks),
//       finalDir,
//       fileName
//     );

//     // 🧹 CLEAN TEMP CHUNK FOLDER AFTER MERGE
//     const chunkDir = path.join(
//       process.cwd(),
//       "src/uploads/chunks",
//       uploadId
//     );

//     if (fs.existsSync(chunkDir)) {
//       fs.rmSync(chunkDir, { recursive: true, force: true });
//     }

//     const file = await File.create({
//       originalName: fileName,
//       path: finalPath,
//       size: req.file.size,
//       token: uuid(),
//       expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
//     });

//     return res.json({
//       success: true,
//       downloadLink: `${process.env.SERVER_URL}/api/files/download/${file.token}`,
//     });
//   }

//   res.json({ chunkReceived: true });
// };


// /**
//  * Download file controller
//  */
// export const downloadFile = async (req, res) => {
//   const file = await File.findOne({ token: req.params.token });
//   if (!file) return res.status(404).send("File not found");

//   if (file.expiresAt < Date.now()) {
//     return res.status(410).send("Link expired");
//   }

//   res.download(file.path, file.originalName);
// };

// /**
//  * EMAIL SENDING CONTROLLER  (B3)
//  */
// export const sendEmail = async (req, res) => {
//   try {
//     const { email, link } = req.body;

//     if (!email || !link) {
//       return res.status(400).json({ message: "Email and link required" });
//     }

//     const transporter = await createTransporter();

//     await transporter.sendMail({
//       from: '"Filezent" <no-reply@filezent.com>',
//       to: email,
//       subject: "File shared with you via Filezent",
//       html: `
//         <h2>File Shared With You</h2>
//         <p>You received a file via <strong>Filezent</strong>.</p>
//         <p>
//           <a href="${link}" target="_blank">Download File</a>
//         </p>
//         <p>This link will expire in 24 hours.</p>
//       `,
//     });

//     res.json({ success: true });
//   } catch (err) {
//     console.error("EMAIL SEND ERROR:", err.message);
//     res.status(500).json({ message: "Email sending failed" });
//   }
// };
/**
 * old EMAIL SENDING CONTROLLER  (B3)
 */
// export const sendEmail = async (req, res) => {
//   const { email, link } = req.body;

//   if (!email || !link) {
//     return res.status(400).json({ message: "Email and link required" });
//   }

//   const transporter = await createTransporter();
//   if (!transporter) {
//     return res.status(500).json({
//       message:
//         "Email service is not configured. Set EMAIL and EMAIL_APP_PASSWORD (and optionally SMTP_HOST/SMTP_PORT/SMTP_SECURE) in backend/.env.",
//     });
//   }

//   try {
//     await transporter.sendMail({
//       from: `"Filezent" <${process.env.EMAIL}>`,
//       to: email,
//       subject: "A file has been shared with you",
//       html: `
//         <h3>File Shared</h3>
//         <p>Click below to download the file:</p>
//         <a href="${link}">${link}</a>
//         <p>This link will expire in 24 hours.</p>
//       `,
//     });

//     return res.json({ success: true });
//   } catch (err) {
//     return res.status(502).json({
//       message: "Failed to send email via SMTP",
//       error: err?.message || String(err),
//     });
//   }
// };
