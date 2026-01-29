import fs from "fs";
import path from "path";

const TEMP_DIR = path.join("src/uploads/chunks");
const TEMP_LIFETIME = 60 * 60 * 1000; // 1 hour

export const startTempCleanup = () => {
  setInterval(() => {
    try {
      if (!fs.existsSync(TEMP_DIR)) return;

      const folders = fs.readdirSync(TEMP_DIR);

      folders.forEach((folder) => {
        const folderPath = path.join(TEMP_DIR, folder);
        const stats = fs.statSync(folderPath);

        const age = Date.now() - stats.mtimeMs;

        if (age > TEMP_LIFETIME) {
          fs.rmSync(folderPath, { recursive: true, force: true });
        }
      });
    } catch (err) {
      console.warn("⚠️ Temp cleanup skipped:", err.message);
    }
  }, 30 * 60 * 1000); // every 30 minutes
};
