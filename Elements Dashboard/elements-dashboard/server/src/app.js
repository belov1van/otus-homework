import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./db.js";
import elementsRouter from "./routes/elements.js";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


connectDB();


app.use(cors());
app.use(express.json());


app.use(express.static(path.join(__dirname, "../public")));


app.use("/api/elements", elementsRouter);


app.use((err, req, res, next) => {
  console.error("Server error:", err);
  res.status(500).json({ error: err.message });
});

export default app;
