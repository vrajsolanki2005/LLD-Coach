import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth.middleware";
import {
  createSubmission,
  getSubmissionsByAttempt,
  getSubmissionById,
} from "../services/submission.service";

export const submitAttempt = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: "Authentication required" });
      return;
    }

    const submission = await createSubmission(req.user.id, req.params.attemptId as string, req.body);
    res.status(201).json({ success: true, message: "Submission created", submission });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "INVALID_ATTEMPT_ID") {
        res.status(400).json({ success: false, message: "Invalid attempt ID" });
        return;
      }
      if (error.message === "ATTEMPT_NOT_FOUND") {
        res.status(404).json({ success: false, message: "Attempt not found" });
        return;
      }
    }
    console.error("Submit attempt error:", error);
    res.status(500).json({ success: false, message: "Failed to create submission" });
  }
};

export const getAttemptSubmissions = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: "Authentication required" });
      return;
    }

    const submissions = await getSubmissionsByAttempt(req.user.id, req.params.attemptId as string);
    res.status(200).json({ success: true, count: submissions.length, submissions });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "INVALID_ATTEMPT_ID") {
        res.status(400).json({ success: false, message: "Invalid attempt ID" });
        return;
      }
      if (error.message === "ATTEMPT_NOT_FOUND") {
        res.status(404).json({ success: false, message: "Attempt not found" });
        return;
      }
    }
    console.error("Get submissions error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch submissions" });
  }
};

export const getSubmission = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: "Authentication required" });
      return;
    }

    const submission = await getSubmissionById(req.user.id, req.params.id as string);
    if (!submission) {
      res.status(404).json({ success: false, message: "Submission not found" });
      return;
    }

    res.status(200).json({ success: true, submission });
  } catch (error) {
    if (error instanceof Error && error.message === "INVALID_SUBMISSION_ID") {
      res.status(400).json({ success: false, message: "Invalid submission ID" });
      return;
    }
    console.error("Get submission error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch submission" });
  }
};
