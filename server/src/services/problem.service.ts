import mongoose from "mongoose";
import { Problem } from "../models/Problem";

export const getAllProblems = async () => {
  return Problem.find()
    .select(
      "title slug description difficulty requirements entities evaluationCriteria",
    )
    .sort({ createdAt: -1 });
};

export const getProblemById = async (id: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("INVALID_PROBLEM_ID");
  }

  return Problem.findById(id);
};
