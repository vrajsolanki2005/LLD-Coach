import { Router } from "express";
import {
  getMyAttempts,
  getAttemptById,
  saveDraft,
  submitAttempt,
  retryAttempt,
} from "../controllers/attempt.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.get("/", authenticate, getMyAttempts);
router.get("/:id", authenticate, getAttemptById);
router.put("/:id/draft", authenticate, saveDraft);
router.post("/:id/submit", authenticate, submitAttempt);
router.post("/:id/retry", authenticate, retryAttempt);
export default router;
