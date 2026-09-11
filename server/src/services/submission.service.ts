import mongoose from "mongoose";
import { Submission } from "../models/Submission";
import { Attempt } from "../models/Attempt";

export const createSubmission = async (
  userId: string,
  attemptId: string,
  body: { classes: any[]; relationships: any[]; code?: string; explanation?: string },
) => {
  if (!mongoose.Types.ObjectId.isValid(attemptId)) throw new Error("INVALID_ATTEMPT_ID");

  const attempt = await Attempt.findOne({ _id: attemptId, userId });
  if (!attempt) throw new Error("ATTEMPT_NOT_FOUND");

  const count = await Submission.countDocuments({ attemptId });

  const submission = await Submission.create({
    attemptId,
    version: count + 1,
    classes: body.classes ?? [],
    relationships: body.relationships ?? [],
    code: body.code,
    explanation: body.explanation,
    submittedAt: new Date(),
  });

  await Attempt.findByIdAndUpdate(attemptId, { status: "SUBMITTED", submittedAt: new Date() });

  return submission;
};

export const getSubmissionsByAttempt = async (userId: string, attemptId: string) => {
  if (!mongoose.Types.ObjectId.isValid(attemptId)) throw new Error("INVALID_ATTEMPT_ID");

  const attempt = await Attempt.findOne({ _id: attemptId, userId });
  if (!attempt) throw new Error("ATTEMPT_NOT_FOUND");

  return Submission.find({ attemptId }).sort({ version: -1 });
};

export const getSubmissionById = async (userId: string, submissionId: string) => {
  if (!mongoose.Types.ObjectId.isValid(submissionId)) throw new Error("INVALID_SUBMISSION_ID");

  const submission = await Submission.findById(submissionId).populate("attemptId");
  if (!submission) return null;

  const attempt = await Attempt.findOne({ _id: submission.attemptId, userId });
  if (!attempt) return null;

  return submission;
};
