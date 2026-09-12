import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth.middleware";
import {
  createAttempt as createAttemptService,
  getUserAttempts,
  getUserAttemptById,
  createRetryAttempt,
} from "../services/attempt.service";
import { saveDraftSubmission, submitSubmission } from "../services/submission.service";

const ATTEMPT_ERROR_MAP: Record<string, [number, string]> = {
  INVALID_ATTEMPT_ID: [400, "Invalid attempt ID"],
  INVALID_PROBLEM_ID: [400, "Invalid problem ID"],
  ATTEMPT_NOT_FOUND: [404, "Attempt not found"],
  PROBLEM_NOT_FOUND: [404, "Problem not found"],
  ATTEMPT_NOT_EDITABLE: [400, "This attempt can no longer be edited"],
  ATTEMPT_ALREADY_SUBMITTED: [400, "This attempt has already been submitted"],
  CLASSES_REQUIRED: [400, "Classes are required"],
  AT_LEAST_ONE_CLASS_REQUIRED: [400, "At least one class is required"],
  CLASS_NAME_REQUIRED: [400, "Every class must have a name"],
  CLASS_RESPONSIBILITY_REQUIRED: [400, "Every class must have a responsibility"],
  EXPLANATION_REQUIRED: [400, "Design explanation is required"],
};

const handleError = (error: unknown, res: Response, fallback: string) => {
  if (error instanceof Error && ATTEMPT_ERROR_MAP[error.message]) {
    const [status, message] = ATTEMPT_ERROR_MAP[error.message];
    res.status(status).json({ success: false, message });
    return;
  }
  console.error(fallback, error);
  res.status(500).json({ success: false, message: fallback });
};

export const createAttempt = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const attempt = await createAttemptService(req.user!.id, req.params.problemId as string);
    res.status(201).json({ success: true, message: "Attempt created successfully", attempt });
  } catch (error) {
    handleError(error, res, "Failed to create attempt");
  }
};

export const getMyAttempts = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const attempts = await getUserAttempts(req.user!.id);
    res.status(200).json({ success: true, count: attempts.length, attempts });
  } catch (error) {
    handleError(error, res, "Failed to fetch attempts");
  }
};

export const getAttemptById = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const attempt = await getUserAttemptById(req.user!.id, req.params.id as string);
    if (!attempt) {
      res.status(404).json({ success: false, message: "Attempt not found" });
      return;
    }
    res.status(200).json({ success: true, attempt });
  } catch (error) {
    handleError(error, res, "Failed to fetch attempt");
  }
};

export const saveDraft = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const submission = await saveDraftSubmission(req.user!.id, req.params.id as string, req.body);
    res.status(200).json({ success: true, message: "Draft saved successfully", submission });
  } catch (error) {
    handleError(error, res, "Failed to save draft");
  }
};

export const submitAttempt = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const result = await submitSubmission(req.user!.id, req.params.id as string, req.body);
    res.status(201).json({ success: true, message: "Solution submitted successfully", submission: result.submission, attempt: result.attempt });
  } catch (error) {
    handleError(error, res, "Failed to submit attempt");
  }
};

export const retryAttempt = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const attempt = await createRetryAttempt(req.user!.id, req.params.id as string);
    res.status(201).json({ success: true, message: "New attempt created", attempt });
  } catch (error) {
    handleError(error, res, "Failed to create retry attempt");
  }
};
