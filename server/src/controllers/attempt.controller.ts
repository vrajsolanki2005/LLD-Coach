import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth.middleware";
import {createAttempt as createAttemptService,getUserAttempts,getUserAttemptById,} from "../services/attempt.service";
import {saveDraftSubmission,submitSubmission,} from "../services/submission.service";
import {createRetryAttempt} from "../services/attempt.service";
export const createAttempt = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  try {
    if (!req.user) {
      res
        .status(401)
        .json({ success: false, message: "Authentication required" });
      return;
    }

    const attempt = await createAttemptService(
      req.user.id,
      req.params.problemId as string,
    );

    res
      .status(201)
      .json({
        success: true,
        message: "Attempt created successfully",
        attempt,
      });
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
    res
      .status(500)
      .json({ success: false, message: "Failed to create attempt" });
  }
};

export const getMyAttempts = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  try {
    if (!req.user) {
      res
        .status(401)
        .json({ success: false, message: "Authentication required" });
      return;
    }

    const attempts = await getUserAttempts(req.user.id);

    res.status(200).json({ success: true, count: attempts.length, attempts });
  } catch (error) {
    console.error("Get attempts error:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch attempts" });
  }
};

export const getAttemptById = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  try {
    if (!req.user) {
      res
        .status(401)
        .json({ success: false, message: "Authentication required" });
      return;
    }

    const attempt = await getUserAttemptById(
      req.user.id,
      req.params.id as string,
    );

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
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch attempt" });
  }
};

export const saveDraft = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  try {
    if (!req.user) {
      res
        .status(401)
        .json({ success: false, message: "Authentication required" });
      return;
    }

    const submission = await saveDraftSubmission(
      req.user.id,
      req.params.id as string,
      req.body,
    );

    res.status(200).json({
      success: true,
      message: "Draft saved successfully",
      submission,
    });
  } catch (error) {
    console.error("Save draft error:", error);

    if (error instanceof Error) {
      const errorMap: Record<string, [number, string]> = {
        INVALID_ATTEMPT_ID: [400, "Invalid attempt ID"],
        ATTEMPT_NOT_FOUND: [404, "Attempt not found"],
        ATTEMPT_NOT_EDITABLE: [400, "This attempt can no longer be edited"],
      };
      const mappedError = errorMap[error.message];

      if (mappedError) {
        res
          .status(mappedError[0])
          .json({ success: false, message: mappedError[1] });
        return;
      }
    }

    res.status(500).json({ success: false, message: "Failed to save draft" });
  }
};

export const submitAttempt = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  try {
    if (!req.user) {
      res
        .status(401)
        .json({ success: false, message: "Authentication required" });
      return;
    }

    const result = await submitSubmission(
      req.user.id,
      req.params.id as string,
      req.body,
    );

    res.status(201).json({
      success: true,
      message: "Solution submitted successfully",
      submission: result.submission,
      attempt: result.attempt,
    });
  } catch (error) {
    console.error("Submit attempt error:", error);

    if (error instanceof Error) {
      const errorMap: Record<string, [number, string]> = {
        INVALID_ATTEMPT_ID: [400, "Invalid attempt ID"],
        ATTEMPT_NOT_FOUND: [404, "Attempt not found"],
        ATTEMPT_ALREADY_SUBMITTED: [
          400,
          "This attempt has already been submitted",
        ],
        CLASSES_REQUIRED: [400, "Classes are required"],
        AT_LEAST_ONE_CLASS_REQUIRED: [400, "At least one class is required"],
        CLASS_NAME_REQUIRED: [400, "Every class must have a name"],
        CLASS_RESPONSIBILITY_REQUIRED: [
          400,
          "Every class must have a responsibility",
        ],
        EXPLANATION_REQUIRED: [400, "Design explanation is required"],
      };
      const mappedError = errorMap[error.message];

      if (mappedError) {
        res
          .status(mappedError[0])
          .json({ success: false, message: mappedError[1] });
        return;
      }
    }

    res
      .status(500)
      .json({ success: false, message: "Failed to submit attempt" });
  }
};

export const retryAttempt = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });
      return;
    }

    const attempt = await createRetryAttempt(
      req.user.id,
      req.params.id
    );

    res.status(201).json({
      success: true,
      message: "New attempt created",
      attempt,
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "INVALID_ATTEMPT_ID"
    ) {
      res.status(400).json({
        success: false,
        message: "Invalid attempt ID",
      });
      return;
    }

    if (
      error instanceof Error &&
      error.message === "ATTEMPT_NOT_FOUND"
    ) {
      res.status(404).json({
        success: false,
        message: "Attempt not found",
      });
      return;
    }

    if (
      error instanceof Error &&
      error.message === "PROBLEM_NOT_FOUND"
    ) {
      res.status(404).json({
        success: false,
        message: "Problem not found",
      });
      return;
    }

    console.error("Retry attempt error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create retry attempt",
    });
  }
};