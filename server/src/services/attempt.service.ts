import mongoose from "mongoose";
import { Attempt } from "../models/Attempt";
import { Problem } from "../models/Problem";

export const createAttempt = async (userId: string, problemId: string) => {
  if (!mongoose.Types.ObjectId.isValid(problemId)) {
    throw new Error("INVALID_PROBLEM_ID");
  }

  const problem = await Problem.findById(problemId);

  if (!problem) {
    throw new Error("PROBLEM_NOT_FOUND");
  }

  const attempt = await Attempt.create({
    userId,
    problemId: problem._id,
    status: "DRAFT",
  });

  return Attempt.findById(attempt._id).populate(
    "problemId",
    "title slug description difficulty requirements entities evaluationCriteria",
  );
};

export const getUserAttempts = async (userId: string) => {
  return Attempt.find({
    userId,
  })
    .populate("problemId", "title slug description difficulty")
    .sort({ createdAt: -1 });
};

export const getUserAttemptById = async (userId: string, attemptId: string) => {
  if (!mongoose.Types.ObjectId.isValid(attemptId)) {
    throw new Error("INVALID_ATTEMPT_ID");
  }

  return Attempt.findOne({
    _id: attemptId,
    userId,
  }).populate(
    "problemId",
    "title slug description difficulty requirements entities evaluationCriteria",
  );
};
