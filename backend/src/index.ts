import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth";
import questionRoutes from "./routes/questions";
import practiceRoutes from "./routes/practice";
import flashcardRoutes from "./routes/flashcard";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ CORS config (FIXED)
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow server-to-server / Postman
      if (!origin) return callback(null, true);

      // Allow local dev
      if (origin === "http://localhost:5173") {
        return callback(null, true);
      }

      // Allow production frontend
      if (origin === process.env.FRONTEND_URL) {
        return callback(null, true);
      }

      // ✅ Allow all Vercel preview deployments
      if (origin.endsWith(".vercel.app")) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

// ⚠️ Handle preflight requests
app.options("*", cors());
app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.json({ message: "Quiz App API is running!" });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/practice", practiceRoutes);
app.use("/api/flashcard", flashcardRoutes);

// Error handling middleware
app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error(err.stack);
    res.status(500).json({ error: "Something went wrong!" });
  }
);

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
