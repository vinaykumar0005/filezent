import fs from "fs";
import path from "path";
import { pipeline } from "stream/promises";

/* =========================
   SAFE FILE NAME
========================= */

const sanitizeFileName = (name) => {
  return name
    .replace(/[^a-zA-Z0-9._-]/g, "_")
    .substring(0, 200);
};

/* =========================
   MERGE CHUNKS
========================= */

export const mergeChunks = async (
  uploadId,
  totalChunks,
  finalDir,
  originalFileName
) => {

  const chunkDir = path.join(
    process.cwd(),
    "src/uploads/chunks",
    uploadId
  );

  /* Validate chunk dir */
  if (!fs.existsSync(chunkDir)) {
    throw new Error("Chunk directory missing");
  }

  /* Create final dir */
  if (!fs.existsSync(finalDir)) {
    fs.mkdirSync(finalDir, { recursive: true });
  }

  /* Safe filename */
  const safeName = sanitizeFileName(originalFileName);

  const finalPath = path.join(
    finalDir,
    `${Date.now()}-${safeName}`
  );

  /* Create write stream */
  const writeStream = fs.createWriteStream(finalPath);

  try {

    /* Merge sequentially */
    for (let i = 0; i < totalChunks; i++) {

      const chunkPath = path.join(
        chunkDir,
        `chunk-${i}`
      );

      if (!fs.existsSync(chunkPath)) {
        throw new Error(`Missing chunk ${i}`);
      }

      const readStream = fs.createReadStream(chunkPath);

      await pipeline(
        readStream,
        writeStream,
        { end: false } // Don't close after each chunk
      );
    }

    /* Close stream */
    writeStream.end();

    return finalPath;

  } catch (err) {

    /* Cleanup broken file */
    if (fs.existsSync(finalPath)) {
      fs.unlinkSync(finalPath);
    }

    throw err;
  }
};
