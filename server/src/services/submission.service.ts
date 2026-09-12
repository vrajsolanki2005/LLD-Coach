import mongoose from "mongoose";
import { Attempt } from "../models/Attempt";
import { Submission } from "../models/Submission";
import { Evaluation } from "../models/Evaluation";
import { runSubmissionEvaluation } from "./evaluation.service";

interface SubmissionInput {
  classes?: {
    name: string;
    responsibility: string;
    methods?: string[];
  }[];

  relationships?: {
    from: string;
    to: string;
    type: string;
    description?: string;
  }[];

  explanation?: string;

  code?: string;
}

const validateSubmission = (data: SubmissionInput) => {
  if (!data.classes || !Array.isArray(data.classes)) {
    throw new Error("CLASSES_REQUIRED");
  }

  if (data.classes.length === 0) {
    throw new Error("AT_LEAST_ONE_CLASS_REQUIRED");
  }

  for (const classItem of data.classes) {
    if (!classItem.name?.trim()) {
      throw new Error("CLASS_NAME_REQUIRED");
    }

    if (!classItem.responsibility?.trim()) {
      throw new Error("CLASS_RESPONSIBILITY_REQUIRED");
    }
  }

  if (!data.explanation?.trim()) {
    throw new Error("EXPLANATION_REQUIRED");
  }
};

const getNextVersion = async (
  attemptId: mongoose.Types.ObjectId,
): Promise<number> => {
  const latestSubmission = await Submission.findOne({ attemptId }).sort({ version: -1 });

  return latestSubmission ? latestSubmission.version + 1 : 1;
};

export const saveDraftSubmission = async (
  userId: string,
  attemptId: string,
  data: SubmissionInput,
) => {
  if (!mongoose.Types.ObjectId.isValid(attemptId)) {
    throw new Error("INVALID_ATTEMPT_ID");
  }

  const attempt = await Attempt.findOne({ _id: attemptId, userId });

  if (!attempt) {
    throw new Error("ATTEMPT_NOT_FOUND");
  }

  if (["SUBMITTED", "EVALUATING", "COMPLETED"].includes(attempt.status)) {
    throw new Error("ATTEMPT_NOT_EDITABLE");
  }

  const existingDraft = await Submission.findOne({ attemptId: attempt._id }).sort({
    version: -1,
  });

  if (existingDraft) {
    existingDraft.classes = (data.classes || []).map((classItem) => ({
      ...classItem,
      methods: classItem.methods || [],
    }));
    existingDraft.relationships = data.relationships || [];
    existingDraft.explanation = data.explanation || "";
    existingDraft.code = data.code;

    await existingDraft.save();

    return existingDraft;
  }

  const version = await getNextVersion(attempt._id);

  return Submission.create({
    attemptId: attempt._id,
    version,
    classes: data.classes || [],
    relationships: data.relationships || [],
    explanation: data.explanation || "",
    code: data.code,
  });
};

export const submitSubmission = async (
  userId: string,
  attemptId: string,
  data: SubmissionInput,
) => {
  validateSubmission(data);

  if (!mongoose.Types.ObjectId.isValid(attemptId)) {
    throw new Error("INVALID_ATTEMPT_ID");
  }

  const attempt = await Attempt.findOne({ _id: attemptId, userId });

  if (!attempt) {
    throw new Error("ATTEMPT_NOT_FOUND");
  }

  if (["EVALUATING", "COMPLETED"].includes(attempt.status)) {
    throw new Error("ATTEMPT_ALREADY_SUBMITTED");
  }

  const version = await getNextVersion(attempt._id);
  const submittedAt = new Date();

  const submission = await Submission.create({
    attemptId: attempt._id,
    version,
    classes: data.classes || [],
    relationships: data.relationships || [],
    explanation: data.explanation || "",
    code: data.code,
    submittedAt,
  });

  attempt.status = "EVALUATING";
  attempt.submittedAt = submittedAt;

  await attempt.save();

  await Evaluation.create({
    submissionId: submission._id,
    status: "PENDING",
    evaluatorVersion: "rule-based-v1",
  });

  setImmediate(() => {
    runSubmissionEvaluation(submission._id.toString()).catch((error) => {
      console.error("Background evaluation error:", error);
    });
  });

  return { submission, attempt };
};

export const createSubmission = async (
  userId: string,
  attemptId: string,
  body: { classes: any[]; relationships: any[]; code?: string; explanation?: string },
) => {
  const result = await submitSubmission(userId, attemptId, body);
  return result.submission;
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
