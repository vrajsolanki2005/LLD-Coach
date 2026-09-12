import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth.middleware";
import {
  getEvaluationByAttempt,
  retryEvaluation,
} from "../services/evaluation.service";

const ERROR_MAP: Record<string, [number, string]> = {
  INVALID_ATTEMPT_ID: [400, "Invalid attempt ID"],
  ATTEMPT_NOT_FOUND: [404, "Attempt not found"],
  SUBMISSION_NOT_FOUND: [404, "No submission found for this attempt"],
  EVALUATION_NOT_FOUND: [404, "Evaluation not found"],
};

const handleServiceError = (error: unknown, res: Response, fallback: string) => {
  if (error instanceof Error && ERROR_MAP[error.message]) {
    const [status, message] = ERROR_MAP[error.message];
    res.status(status).json({ success: false, message });
    return;
  }
  console.error(fallback, error);
  res.status(500).json({ success: false, message: fallback });
};

export const getAttemptEvaluation = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  try {
    const result = await getEvaluationByAttempt(req.user!.id, req.params.id as string);
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    handleServiceError(error, res, "Failed to fetch evaluation");
  }
};

export const retryAttemptEvaluation = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  try {
    const evaluation = await retryEvaluation(req.user!.id, req.params.id as string);
    res.status(200).json({ success: true, message: "Evaluation restarted", evaluation });
  } catch (error) {
    handleServiceError(error, res, "Failed to retry evaluation");
  }
};
