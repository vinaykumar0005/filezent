import fs from "fs";
import path from "path";

/* ============================
   STREAM MERGE (SAFE)
============================ */

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

  if (!fs.existsSync(chunkDir)) {
    throw new Error("Chunk directory missing");
  }

  if (!fs.existsSync(finalDir)) {
    fs.mkdirSync(finalDir, { recursive: true });
  }

  const finalPath = path.join(
    finalDir,
    `${Date.now()}-${originalFileName}`
  );

  const writeStream = fs.createWriteStream(finalPath);

  for (let i = 0; i < totalChunks; i++) {
    const chunkPath = path.join(
      chunkDir,
      `chunk-${i}`
    );

    if (!fs.existsSync(chunkPath)) {
      throw new Error(`Missing chunk ${i}`);
    }

    await new Promise((resolve, reject) => {
      const readStream = fs.createReadStream(chunkPath);

      readStream.on("error", reject);
      readStream.on("end", resolve);

      readStream.pipe(writeStream, { end: false });
    });
  }

  writeStream.end();

  return finalPath;
};
