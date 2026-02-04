import multer from "multer";

/* =========================
   MEMORY STORAGE (BEST)
========================= */

const storage = multer.memoryStorage();

/* =========================
   LIMITS & FILTER
========================= */

const upload = multer({
  storage,

  limits: {
    fileSize: 1024 * 1024 * 1024 * 6, // 6GB per chunk/file
  },

  fileFilter: (req, file, cb) => {

    // Optional: block empty files
    if (!file.originalname) {
      return cb(new Error("Invalid file"), false);
    }

    cb(null, true);
  },
});

/* =========================
   EXPORT
========================= */

export { upload };
