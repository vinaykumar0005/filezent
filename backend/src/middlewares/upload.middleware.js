import multer from "multer";
import fs from "fs";
import path from "path";

/* ============================
   SAFE STORAGE
============================ */

const storage = multer.diskStorage({

  destination: (req, file, cb) => {

    // Multer may not parse body yet → fallback to query
    const uploadId =
      req.body?.uploadId ||
      req.query?.uploadId;

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

    const chunkIndex =
      req.body?.chunkIndex ??
      req.query?.chunkIndex;

    if (chunkIndex === undefined) {
      return cb(new Error("chunkIndex missing"));
    }

    cb(null, `chunk-${chunkIndex}`);
  },
});

/* ============================
   EXPORT
============================ */

export const upload = multer({
  storage,

  limits: {
    fileSize: 20 * 1024 * 1024, // 20MB per chunk
  },
});
