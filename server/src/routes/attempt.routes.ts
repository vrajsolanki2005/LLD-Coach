import { Router } from "express";
import {
  createAttempt,
  getMyAttempts,
  getAttemptById,
} from "../controllers/attempt.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.get("/", authenticate, getMyAttempts);
router.get("/:id", authenticate, getAttemptById);

export default router;
