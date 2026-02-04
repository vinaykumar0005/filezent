import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import fileRoutes from "./routes/file.routes.js";

const app = express();
app.set("trust proxy", ["loopback", "linklocal", "uniquelocal"]);


// Allowed Frontend URLs
const allowedOrigins = [
  "https://filezent.vercel.app",
  "http://localhost:3000",
  "http://localhost:5173"
];


// CORS Middleware (ONLY HERE)
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

    // 🔥 IMPORTANT FIX
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



// Handle Preflight
// app.options(cors());


// Body parser
app.use(express.json());


// Routes
app.use("/api/auth", authRoutes);
app.use("/api/files", fileRoutes);


// Health check
app.get("/", (req, res) => {
  res.send("Filezent API is running");
});

export default app;
