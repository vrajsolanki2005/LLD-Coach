import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import problemRoutes from "./routes/problem.routes";
import attemptRoutes from "./routes/attempt.routes";
import submissionRoutes from "./routes/submission.routes";
import submissionsRoutes from "./routes/submissions.routes";
import evaluationRoutes from "./routes/evaluation.routes";

const app = express();

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ success: true, message: "LLD Coach API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/problems", problemRoutes);
app.use("/api/attempts", attemptRoutes);
app.use("/api/attempts", submissionRoutes);       // POST/GET /api/attempts/:attemptId/submissions
app.use("/api/submissions", submissionsRoutes);   // GET /api/submissions/:id
app.use("/api/evaluations", evaluationRoutes);    // GET/POST /api/evaluations/:submissionId

export default app;
