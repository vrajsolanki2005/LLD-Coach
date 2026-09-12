import { Router } from "express";
import { getSubmission } from "../controllers/submission.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.get("/:id", authenticate, getSubmission);

export default router;
