import "dotenv/config";

import app from "./app.js";
import { connectDB } from "./config/db.js";
import { startOtpCleanup } from "./utils/otpCleanup.js";
import { startFileCleanup } from "./utils/fileCleanup.js";
import { startTempCleanup } from "./utils/tempCleanup.js";
import { startRegisterOtpCleanup } from "./utils/registerotpCleanup.js";






connectDB();
startOtpCleanup();
startFileCleanup();
startTempCleanup();
startRegisterOtpCleanup();
cron.schedule("0 0 * * *", startFileCleanup);




app.listen(5000, () => {
  console.log("Server running on port 5000");
});
