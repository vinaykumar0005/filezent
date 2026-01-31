import "dotenv/config";
import cron from "node-cron"; 
import cors from "cors";

import app from "./app.js";
import { connectDB } from "./config/db.js";
import { startOtpCleanup } from "./utils/otpCleanup.js";
import { cleanup } from "./utils/fileCleanup.js";
import { startTempCleanup } from "./utils/tempCleanup.js";
import { startRegisterOtpCleanup } from "./utils/registerotpCleanup.js";




app.use(
  cors({
    origin: [
      "https://filezent.vercel.app",
      "http://localhost:5173",
      "http://localhost:3000"
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.options("*", cors());

connectDB();
startOtpCleanup();
cleanup();
startTempCleanup();
startRegisterOtpCleanup();
cron.schedule("0 0 * * *", async () => {
  console.log("Running daily cleanup...");
  await cleanup();
});




const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});

app.get("/", (req, res) => {
  res.send("Filezent API is running");
});