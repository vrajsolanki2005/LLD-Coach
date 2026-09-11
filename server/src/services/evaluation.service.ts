import mongoose from "mongoose";
import { Evaluation } from "../models/Evaluation";
import { Submission } from "../models/Submission";
import { Attempt } from "../models/Attempt";

export const getEvaluationBySubmission = async (userId: string, submissionId: string) => {
  if (!mongoose.Types.ObjectId.isValid(submissionId)) throw new Error("INVALID_SUBMISSION_ID");

  const submission = await Submission.findById(submissionId);
  if (!submission) throw new Error("SUBMISSION_NOT_FOUND");

  const attempt = await Attempt.findOne({ _id: submission.attemptId, userId });
  if (!attempt) throw new Error("SUBMISSION_NOT_FOUND");

  return Evaluation.findOne({ submissionId });
};

export const createEvaluation = async (submissionId: string, payload: {
  overallScore?: number;
  categories: any[];
  strengths: string[];
  issues: any[];
  tradeoffs: string[];
  suggestedImprovements: string[];
  alternativeApproach?: string;
}) => {
  if (!mongoose.Types.ObjectId.isValid(submissionId)) throw new Error("INVALID_SUBMISSION_ID");

  const existing = await Evaluation.findOne({ submissionId });
  if (existing) throw new Error("EVALUATION_EXISTS");

  const evaluation = await Evaluation.create({
    submissionId,
    status: "COMPLETED",
    evaluatorVersion: "v1.1",
    ...payload,
  });

  await Submission.findByIdAndUpdate(submissionId, {});

  const submission = await Submission.findById(submissionId);
  if (submission) {
    await Attempt.findByIdAndUpdate(submission.attemptId, { status: "COMPLETED" });
  }

  return evaluation;
};
