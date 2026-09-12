import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth.middleware";
import { getSubmissionById } from "../services/submission.service";

export const getSubmission = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const submission = await getSubmissionById(req.user!.id, req.params.id as string);
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
