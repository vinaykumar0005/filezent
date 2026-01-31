import express from "express";
import authRoutes from "./routes/auth.routes.js";
import fileRoutes from "./routes/file.routes.js";

const app = express();

// Body parser
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/files", fileRoutes);

export default app;
