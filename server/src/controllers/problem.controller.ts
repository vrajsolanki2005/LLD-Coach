import { Request, Response } from "express";
import mongoose from "mongoose";
import { Problem } from "../models/Problem";

export const getProblems = async (
  _req: Request,
  res: Response,
): Promise<void> => {
  try {
    const problems = await Problem.find()
      .select(
        "title slug description difficulty requirements entities evaluationCriteria",
      )
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: problems.length,
      problems,
    });
  } catch (error) {
    console.error("Get problems error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch problems",
    });
  }
};

export const getProblemById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid problem ID",
      });
      return;
    }

    const problem = await Problem.findById(id);

    if (!problem) {
      res.status(404).json({
        success: false,
        message: "Problem not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      problem,
    });
  } catch (error) {
    console.error("Get problem error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch problem",
    });
  }
};
