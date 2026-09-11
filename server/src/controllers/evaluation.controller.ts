import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth.middleware";
import { getEvaluationBySubmission, createEvaluation } from "../services/evaluation.service";

export const getEvaluation = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: "Authentication required" });
      return;
    }

    const evaluation = await getEvaluationBySubmission(req.user.id, req.params.submissionId as string);
    if (!evaluation) {
      res.status(404).json({ success: false, message: "Evaluation not found" });
      return;
    }

    res.status(200).json({ success: true, evaluation });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "INVALID_SUBMISSION_ID") {
        res.status(400).json({ success: false, message: "Invalid submission ID" });
        return;
      }
      if (error.message === "SUBMISSION_NOT_FOUND") {
        res.status(404).json({ success: false, message: "Submission not found" });
        return;
      }
    }
    console.error("Get evaluation error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch evaluation" });
  }
};

export const submitEvaluation = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: "Authentication required" });
      return;
    }

    const evaluation = await createEvaluation(req.params.submissionId as string, req.body);
    res.status(201).json({ success: true, message: "Evaluation saved", evaluation });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "INVALID_SUBMISSION_ID") {
        res.status(400).json({ success: false, message: "Invalid submission ID" });
        return;
      }
      if (error.message === "EVALUATION_EXISTS") {
        res.status(409).json({ success: false, message: "Evaluation already exists for this submission" });
        return;
      }
    }
    console.error("Submit evaluation error:", error);
    res.status(500).json({ success: false, message: "Failed to save evaluation" });
  }
};
