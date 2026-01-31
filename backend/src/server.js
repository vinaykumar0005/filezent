import "dotenv/config";
import cron from "node-cron";
import cors from "cors";

import app from "./app.js";
import { connectDB } from "./config/db.js";

import { startOtpCleanup } from "./utils/otpCleanup.js";
import { cleanup } from "./utils/fileCleanup.js";
import { startTempCleanup } from "./utils/tempCleanup.js";
import { startRegisterOtpCleanup } from "./utils/registerotpCleanup.js";

/* ========================
   CORS CONFIG
======================== */

const allowedOrigins = [
  "https://filezent.vercel.app",
  "https://www.filezent.vercel.app",
  "http://localhost:3000",
  "http://localhost:5173",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.log("❌ Blocked CORS:", origin);
      return callback(new Error("Not allowed by CORS"));
    },

    credentials: true,

    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],

    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Accept",
    ],

    exposedHeaders: ["Authorization"],
  })
);

/* ========================
   INIT SERVICES
======================== */

connectDB();

startOtpCleanup();
startTempCleanup();
startRegisterOtpCleanup();
cleanup();

/* ========================
   CRON JOB
======================== */

cron.schedule("0 0 * * *", async () => {
  console.log("🧹 Running daily cleanup...");
  await cleanup();
});

/* ========================
   SERVER
======================== */

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("✅ Filezent API is running");
});

app.listen(PORT, () => {
  console.log("🚀 Server running on port", PORT);
});
