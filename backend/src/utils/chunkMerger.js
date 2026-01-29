import fs from "fs";
import path from "path";

/**
 * Merge file chunks into a single file
 */
export const mergeChunks = (
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
    throw new Error("Chunk directory not found");
  }

  if (!fs.existsSync(finalDir)) {
    fs.mkdirSync(finalDir, { recursive: true });
  }

  const finalPath = path.join(
    finalDir,
    `${Date.now()}-${originalFileName}`
  );

  for (let i = 0; i < totalChunks; i++) {
    const chunkPath = path.join(chunkDir, `chunk-${i}`);

    if (!fs.existsSync(chunkPath)) {
      throw new Error(`Missing chunk: ${i}`);
    }

    const chunkData = fs.readFileSync(chunkPath);
    fs.appendFileSync(finalPath, chunkData);
  }

  return finalPath;
};
