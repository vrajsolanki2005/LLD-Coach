import mongoose from "mongoose";
import { Evaluation } from "../models/Evaluation";
import { Submission } from "../models/Submission";
import { Attempt } from "../models/Attempt";
import { Problem } from "../models/Problem";
import { RuleBasedEvaluator } from "../evaluators/ruleBasedEvaluator";

const evaluator = new RuleBasedEvaluator();

export const runSubmissionEvaluation = async (
  submissionId: string,
): Promise<void> => {
  if (!mongoose.Types.ObjectId.isValid(submissionId)) {
    throw new Error("INVALID_SUBMISSION_ID");
  }

  const submission = await Submission.findById(submissionId);
  if (!submission) {
    throw new Error("SUBMISSION_NOT_FOUND");
  }

  const attempt = await Attempt.findById(submission.attemptId);
  if (!attempt) {
    throw new Error("ATTEMPT_NOT_FOUND");
  }

  const problem = await Problem.findById(attempt.problemId);
  if (!problem) {
    throw new Error("PROBLEM_NOT_FOUND");
  }

  let evaluation = await Evaluation.findOne({ submissionId: submission._id });
  if (!evaluation) {
    evaluation = await Evaluation.create({
      submissionId: submission._id,
      status: "PENDING",
      evaluatorVersion: evaluator.id,
    });
  }

  try {
    const result = await evaluator.evaluate(problem, submission);

    evaluation.status = "COMPLETED";
    evaluation.overallScore = result.overallScore;
    evaluation.categories = result.categories;
    evaluation.strengths = result.strengths;
    evaluation.issues = result.issues;
    evaluation.tradeoffs = result.tradeoffs;
    evaluation.suggestedImprovements = result.suggestedImprovements;
    evaluation.alternativeApproach = result.alternativeApproach;
    evaluation.evaluatorVersion = result.evaluatorVersion;

    await evaluation.save();

    attempt.status = "COMPLETED";
    await attempt.save();
  } catch (error) {
    console.error(`Evaluation failed for submission ${submissionId}:`, error);

    evaluation.status = "FAILED";
    await evaluation.save();

    attempt.status = "FAILED";
    await attempt.save();
  }
};

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
