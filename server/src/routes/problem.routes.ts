import { Router } from "express";
import { getProblems, getProblemByIdController } from "../controllers/problem.controller";
import { createAttempt } from "../controllers/attempt.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.get("/", getProblems);

router.get("/:id", getProblemByIdController);

router.post("/:problemId/attempts", authenticate, createAttempt);

export default router;
