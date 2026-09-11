import { Router } from "express";
import { getEvaluation, submitEvaluation } from "../controllers/evaluation.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.get("/:submissionId", authenticate, getEvaluation);
router.post("/:submissionId", authenticate, submitEvaluation);

export default router;
