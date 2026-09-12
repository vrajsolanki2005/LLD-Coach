import mongoose from "mongoose";
import { Attempt } from "../models/Attempt";
import { Evaluation } from "../models/Evaluation";
import { Submission } from "../models/Submission";
import { Problem } from "../models/Problem";
import { RuleBasedEvaluator } from "../evaluators/ruleBasedEvaluator";
import { Evaluator } from "../evaluators/evaluator.interface";

const ruleBasedEvaluator = new RuleBasedEvaluator();

const getEvaluator = (): Evaluator => ruleBasedEvaluator;

export const runSubmissionEvaluation = async (submissionId: string): Promise<void> => {
  if (!mongoose.Types.ObjectId.isValid(submissionId)) throw new Error("INVALID_SUBMISSION_ID");

  const submission = await Submission.findById(submissionId);
  if (!submission) throw new Error("SUBMISSION_NOT_FOUND");

  const attempt = await Attempt.findById(submission.attemptId);
  if (!attempt) throw new Error("ATTEMPT_NOT_FOUND");

  const problem = await Problem.findById(attempt.problemId);
  if (!problem) throw new Error("PROBLEM_NOT_FOUND");

  let evaluation = await Evaluation.findOne({ submissionId: submission._id });
  if (!evaluation) {
    evaluation = await Evaluation.create({
      submissionId: submission._id,
      status: "PENDING",
      evaluatorVersion: "pending",
    });
  }

  const evaluator = getEvaluator();

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
    evaluation.status = "FAILED";
    evaluation.evaluatorVersion = evaluator.id;
    await evaluation.save();

    attempt.status = "FAILED";
    await attempt.save();
  }
};

export const getEvaluationByAttempt = async (userId: string, attemptId: string) => {
  if (!mongoose.Types.ObjectId.isValid(attemptId)) throw new Error("INVALID_ATTEMPT_ID");

  const attempt = await Attempt.findOne({ _id: attemptId, userId });
  if (!attempt) throw new Error("ATTEMPT_NOT_FOUND");

  const submission = await Submission.findOne({ attemptId: attempt._id }).sort({ version: -1 });
  if (!submission) throw new Error("SUBMISSION_NOT_FOUND");

  const evaluation = await Evaluation.findOne({ submissionId: submission._id });
  if (!evaluation) throw new Error("EVALUATION_NOT_FOUND");

  return { attempt, submission, evaluation };
};

export const retryEvaluation = async (userId: string, attemptId: string) => {
  if (!mongoose.Types.ObjectId.isValid(attemptId)) throw new Error("INVALID_ATTEMPT_ID");

  const attempt = await Attempt.findOne({ _id: attemptId, userId });
  if (!attempt) throw new Error("ATTEMPT_NOT_FOUND");

  const submission = await Submission.findOne({ attemptId: attempt._id }).sort({ version: -1 });
  if (!submission) throw new Error("SUBMISSION_NOT_FOUND");

  let evaluation = await Evaluation.findOne({ submissionId: submission._id });
  if (!evaluation) {
    evaluation = await Evaluation.create({
      submissionId: submission._id,
      status: "PENDING",
      evaluatorVersion: ruleBasedEvaluator.id,
    });
  }

  evaluation.status = "PENDING";
  await evaluation.save();

  attempt.status = "EVALUATING";
  await attempt.save();

  setImmediate(() => {
    runSubmissionEvaluation(submission._id.toString()).catch((err) => {
      console.error("Retry evaluation failed:", err);
    });
  });

  return evaluation;
};
