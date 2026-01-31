import "dotenv/config";
import cron from "node-cron";
import cors from "cors";

import app from "./app.js";
import { connectDB } from "./config/db.js";

import { startOtpCleanup } from "./utils/otpCleanup.js";
import { cleanup } from "./utils/fileCleanup.js";
import { startTempCleanup } from "./utils/tempCleanup.js";
import { startRegisterOtpCleanup } from "./utils/registerotpCleanup.js";

/* ============================
   CORS CONFIG
============================ */

const allowedOrigins = [
  "https://filezent.vercel.app",
  "http://localhost:3000",
  "http://localhost:5173",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow Postman / Server requests
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Preflight
// app.options("/*", cors());


/* ============================
   DATABASE
============================ */

connectDB();

/* ============================
   CLEANUPS
============================ */

startOtpCleanup();
startTempCleanup();
startRegisterOtpCleanup();
cleanup();

// Daily cleanup
cron.schedule("0 0 * * *", async () => {
  console.log("Running daily cleanup...");
  await cleanup();
});

/* ============================
   ROUTES
============================ */

app.get("/", (req, res) => {
  res.send("Filezent API is running");
});

/* ============================
   SERVER
============================ */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
