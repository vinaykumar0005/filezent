import multer from "multer";
import fs from "fs";
import path from "path";

/*
  Production Multer Setup
  - Safe folders
  - Large files
  - Proper validation
*/

const CHUNK_ROOT = path.join(
  process.cwd(),
  "src/uploads/chunks"
);

// Ensure base folder exists
if (!fs.existsSync(CHUNK_ROOT)) {
  fs.mkdirSync(CHUNK_ROOT, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadId = req.headers.uploadid;

    if (!uploadId) {
      return cb(new Error("uploadId missing"));
    }

    const chunkDir = path.join(CHUNK_ROOT, uploadId);

    if (!fs.existsSync(chunkDir)) {
      fs.mkdirSync(chunkDir, { recursive: true });
    }

    cb(null, chunkDir);
  },

  filename: (req, file, cb) => {
    const chunkIndex = req.headers.chunkindex;

    if (chunkIndex === undefined) {
      return cb(new Error("chunkIndex missing"));
    }

    cb(null, `chunk-${chunkIndex}`);
  },
});

export const upload = multer({
  storage,

  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB per chunk
  },

  fileFilter: (req, file, cb) => {
    if (!file) {
      cb(new Error("No file"));
    } else {
      cb(null, true);
    }
  },
});
