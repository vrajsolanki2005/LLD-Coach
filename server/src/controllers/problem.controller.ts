import { Request, Response } from "express";
import { getAllProblems, getProblemById } from "../services/problem.service";

export const getProblems = async (
  _req: Request,
  res: Response,
): Promise<void> => {
  try {
    const problems = await getAllProblems();

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

export const getProblemByIdController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const problem = await getProblemById(req.params.id as string);

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
    if (error instanceof Error && error.message === "INVALID_PROBLEM_ID") {
      res.status(400).json({
        success: false,
        message: "Invalid problem ID",
      });
      return;
    }

    console.error("Get problem error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch problem",
    });
  }
};
