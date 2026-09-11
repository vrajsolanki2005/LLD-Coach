import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth.middleware";
import {
  createAttempt as createAttemptService,
  getUserAttempts,
  getUserAttemptById,
} from "../services/attempt.service";

export const createAttempt = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: "Authentication required" });
      return;
    }

    const attempt = await createAttemptService(req.user.id, req.params.problemId as string);

    res.status(201).json({ success: true, message: "Attempt created successfully", attempt });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "INVALID_PROBLEM_ID") {
        res.status(400).json({ success: false, message: "Invalid problem ID" });
        return;
      }
      if (error.message === "PROBLEM_NOT_FOUND") {
        res.status(404).json({ success: false, message: "Problem not found" });
        return;
      }
    }
    console.error("Create attempt error:", error);
    res.status(500).json({ success: false, message: "Failed to create attempt" });
  }
};

export const getMyAttempts = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: "Authentication required" });
      return;
    }

    const attempts = await getUserAttempts(req.user.id);

    res.status(200).json({ success: true, count: attempts.length, attempts });
  } catch (error) {
    console.error("Get attempts error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch attempts" });
  }
};

export const getAttemptById = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: "Authentication required" });
      return;
    }

    const attempt = await getUserAttemptById(req.user.id, req.params.id as string);

    if (!attempt) {
      res.status(404).json({ success: false, message: "Attempt not found" });
      return;
    }

    res.status(200).json({ success: true, attempt });
  } catch (error) {
    if (error instanceof Error && error.message === "INVALID_ATTEMPT_ID") {
      res.status(400).json({ success: false, message: "Invalid attempt ID" });
      return;
    }
    console.error("Get attempt error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch attempt" });
  }
};
