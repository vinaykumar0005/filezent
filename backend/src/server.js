import "dotenv/config";

import app from "./app.js";
import { connectDB } from "./config/db.js";
import { startOtpCleanup } from "./utils/otpCleanup.js";
import { cleanup } from "./utils/fileCleanup.js";
import { startTempCleanup } from "./utils/tempCleanup.js";
import { startRegisterOtpCleanup } from "./utils/registerotpCleanup.js";






connectDB();
startOtpCleanup();
cleanup();
startTempCleanup();
startRegisterOtpCleanup();
cron.schedule("0 0 * * *", cleanup);




app.listen(5000, () => {
  console.log("Server running on port 5000");
});
