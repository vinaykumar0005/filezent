import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import fileRoutes from "./routes/file.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";

const app = express();
app.set("trust proxy", 1); // REQUIRED for Render/Vercel


// Allowed Frontend URLs
const allowedOrigins = [
  "https://filezent.vercel.app",
  "http://localhost:3000",
  "http://localhost:5173"
];


// CORS Middleware
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS blocked"));
      }
    },

    credentials: true,

    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],


    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "uploadid",
      "chunkindex",
      "x-requested-with",
    ],

    exposedHeaders: ["Content-Length"],
  })
);

app.use(express.json());


app.use("/api/auth", authRoutes);
app.use("/api/files", fileRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.set("trust proxy", 1);



// Health check
app.get("/", (req, res) => {
  res.send("Filezent API is running");
});

export default app;
