import "dotenv/config";
import cron from "node-cron";

import app from "./app.js";
import { connectDB } from "./config/db.js";

import { startOtpCleanup } from "./utils/otpCleanup.js";
import { cleanup } from "./utils/fileCleanup.js";
import { startTempCleanup } from "./utils/tempCleanup.js";
import { startRegisterOtpCleanup } from "./utils/registerotpCleanup.js";

/* ======================
   INIT SERVICES
====================== */

connectDB();

startOtpCleanup();
startTempCleanup();
startRegisterOtpCleanup();

/* ======================
   CRON
====================== */

cron.schedule("0 0 * * *", async () => {
  console.log("🧹 Daily cleanup");
  await cleanup();
});

/* ======================
   SERVER
====================== */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("🚀 Server running on", PORT);
});
