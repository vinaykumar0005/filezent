import fs from "fs";
import path from "path";

export const mergeChunks = (
  uploadId,
  totalChunks,
  finalDir,
  fileName
) => {
  const chunkDir = path.join(
    process.cwd(),
    "src/uploads/chunks",
    uploadId
  );

  if (!fs.existsSync(chunkDir)) {
    throw new Error("Chunk folder missing");
  }

  if (!fs.existsSync(finalDir)) {
    fs.mkdirSync(finalDir, { recursive: true });
  }

  const finalPath = path.join(
    finalDir,
    `${Date.now()}-${fileName}`
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

    const data = fs.readFileSync(chunkPath);
    writeStream.write(data);
  }

  writeStream.end();

  return finalPath;
};
