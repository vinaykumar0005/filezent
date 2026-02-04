import multer from "multer";
import fs from "fs";
import path from "path";

/* ============================
   MULTER STORAGE (SAFE)
============================ */

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const { uploadId } = req.body;

    if (!uploadId) {
      return cb(new Error("uploadId missing"));
    }

    const chunkDir = path.join(
      process.cwd(),
      "src/uploads/chunks",
      uploadId
    );

    if (!fs.existsSync(chunkDir)) {
      fs.mkdirSync(chunkDir, { recursive: true });
    }

    cb(null, chunkDir);
  },

  filename: (req, file, cb) => {
    const { chunkIndex } = req.body;

    if (chunkIndex === undefined) {
      return cb(new Error("chunkIndex missing"));
    }

    cb(null, `chunk-${chunkIndex}`);
  },
});

/* ============================
   LIMITS + FILTER
============================ */

export const upload = multer({
  storage,
  limits: {
    fileSize: 20 * 1024 * 1024, // 20MB per chunk
  },
});
