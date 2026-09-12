import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import problemRoutes from "./routes/problem.routes";
import attemptRoutes from "./routes/attempt.routes";
import submissionRoutes from "./routes/submission.routes";
import evaluationRoutes from "./routes/evaluation.routes";
import { errorHandler } from "./middleware/error.middleware";

const app = express();

app.use(helmet());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173", credentials: true }));
app.use(express.json());

app.use("/api/auth", rateLimit({ windowMs: 15 * 60 * 1000, max: 20 }), authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/problems", problemRoutes);
app.use("/api/attempts", attemptRoutes);
app.use("/api/submissions", submissionRoutes);
app.use("/api/evaluations", evaluationRoutes);

app.get("/health", (_req, res) => {
  res.json({ success: true, service: "lld-coach-api", status: "healthy", timestamp: new Date().toISOString() });
});

app.use(errorHandler);

export default app;
