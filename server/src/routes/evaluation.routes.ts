import { Router } from "express";
import { getAttemptEvaluation, retryAttemptEvaluation } from "../controllers/evaluation.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.get("/:id", authenticate, getAttemptEvaluation);
router.post("/:id/retry", authenticate, retryAttemptEvaluation);

export default router;
