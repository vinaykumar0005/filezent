import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

import authRoutes from "./routes/auth.routes.js";
import fileRoutes from  "./routes/file.routes.js";

app.use("/api/auth",authRoutes);
app.use("/api/files",fileRoutes);

export default app;