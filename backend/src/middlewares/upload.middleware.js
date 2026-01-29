import multer from "multer";
import fs from "fs";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // ✅ READ FROM HEADERS, NOT BODY
    const uploadId = req.headers.uploadid;

    if (!uploadId) {
      return cb(new Error("uploadId missing"), null);
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
    const chunkIndex = req.headers.chunkindex;

    if (chunkIndex === undefined) {
      return cb(new Error("chunkIndex missing"), null);
    }

    cb(null, `chunk-${chunkIndex}`);
  },
});

export const upload = multer({ storage });
