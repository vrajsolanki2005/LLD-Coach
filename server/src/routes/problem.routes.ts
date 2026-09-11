import { Router } from "express";
import { getProblems, getProblemById } from "../controllers/problem.controller";
import { createAttempt } from "../controllers/attempt.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.get("/", getProblems);

router.get("/:id", getProblemById);

router.post("/:problemId/attempts", authenticate, createAttempt);

export default router;
