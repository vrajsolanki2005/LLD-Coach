import { Response } from "express";
import mongoose from "mongoose";
import { Attempt } from "../models/Attempt";
import { Problem } from "../models/Problem";
import { AuthenticatedRequest } from "../middleware/auth.middleware";

export const createAttempt = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  try {
    const { problemId } = req.params;

    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });
      return;
    }

    if (!mongoose.Types.ObjectId.isValid(problemId)) {
      res.status(400).json({
        success: false,
        message: "Invalid problem ID",
      });
      return;
    }

    const problem = await Problem.findById(problemId);

    if (!problem) {
      res.status(404).json({
        success: false,
        message: "Problem not found",
      });
      return;
    }

    const attempt = await Attempt.create({
      userId: req.user.id,
      problemId: problem._id,
      status: "DRAFT",
    });

    const populatedAttempt = await Attempt.findById(attempt._id).populate(
      "problemId",
      "title slug description difficulty requirements entities evaluationCriteria",
    );

    res.status(201).json({
      success: true,
      message: "Attempt created successfully",
      attempt: populatedAttempt,
    });
  } catch (error) {
    console.error("Create attempt error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create attempt",
    });
  }
};

export const getMyAttempts = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });
      return;
    }

    const attempts = await Attempt.find({
      userId: req.user.id,
    })
      .populate("problemId", "title slug difficulty description")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: attempts.length,
      attempts,
    });
  } catch (error) {
    console.error("Get attempts error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch attempts",
    });
  }
};

export const getAttemptById = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });
      return;
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid attempt ID",
      });
      return;
    }

    const attempt = await Attempt.findOne({
      _id: id,
      userId: req.user.id,
    }).populate(
      "problemId",
      "title slug description difficulty requirements entities evaluationCriteria",
    );

    if (!attempt) {
      res.status(404).json({
        success: false,
        message: "Attempt not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      attempt,
    });
  } catch (error) {
    console.error("Get attempt error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch attempt",
    });
  }
};
