import { Router } from "express";
import { submitAttempt, getAttemptSubmissions, getSubmission } from "../controllers/submission.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

// mounted at /api/attempts
router.post("/:attemptId/submissions", authenticate, submitAttempt);
router.get("/:attemptId/submissions", authenticate, getAttemptSubmissions);

export default router;
