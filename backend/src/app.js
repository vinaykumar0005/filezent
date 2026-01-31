import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import fileRoutes from "./routes/file.routes.js";

const app = express();

/* ======================
   CORS CONFIG (MAIN)
====================== */

const allowedOrigins = [
  "https://filezent.vercel.app",
  "https://www.filezent.onrender.com",
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

      console.log("❌ CORS Blocked:", origin);
      callback(new Error("Not allowed by CORS"));
    },

    credentials: true,

    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],

    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Accept",
    ],
  })
);

/* ======================
   BODY PARSER
====================== */

app.use(express.json());

/* ======================
   ROUTES
====================== */

app.use("/api/auth", authRoutes);
app.use("/api/files", fileRoutes);

/* ======================
   HEALTH CHECK
====================== */

app.get("/", (req, res) => {
  res.send("✅ Filezent API Running");
});

export default app;
