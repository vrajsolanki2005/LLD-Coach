import mongoose, { Document, Schema } from "mongoose";

export type EvaluationStatus = "PENDING" | "COMPLETED" | "FAILED";

export interface IEvaluationCategory {
  name: string;
  score: number;
  feedback: string;
}

export interface IEvaluationIssue {
  severity: "low" | "medium" | "high";
  title: string;
  explanation: string;
  suggestion: string;
}

export interface IEvaluation extends Document {
  submissionId: mongoose.Types.ObjectId;
  status: EvaluationStatus;
  overallScore?: number;
  categories: IEvaluationCategory[];
  strengths: string[];
  issues: IEvaluationIssue[];
  tradeoffs: string[];
  suggestedImprovements: string[];
  alternativeApproach?: string;
  evaluatorVersion: string;
  createdAt: Date;
  updatedAt: Date;
}

const categorySchema = new Schema<IEvaluationCategory>(
  {
    name: {
      type: String,
      required: true,
    },

    score: {
      type: Number,
      required: true,
      min: 0,
      max: 10,
    },

    feedback: {
      type: String,
      required: true,
    },
  },
  {
    _id: false,
  },
);

const issueSchema = new Schema<IEvaluationIssue>(
  {
    severity: {
      type: String,
      enum: ["low", "medium", "high"],
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    explanation: {
      type: String,
      required: true,
    },

    suggestion: {
      type: String,
      required: true,
    },
  },
  {
    _id: false,
  },
);

const evaluationSchema = new Schema<IEvaluation>(
  {
    submissionId: {
      type: Schema.Types.ObjectId,
      ref: "Submission",
      required: true,
      unique: true,
      index: true,
    },
    status: {
      type: String,
      enum: ["PENDING", "COMPLETED", "FAILED"],
      default: "PENDING",
    },
    overallScore: {
      type: Number,
      min: 0,
      max: 10,
    },
    categories: {
      type: [categorySchema],
      default: [],
    },
    strengths: {
      type: [String],
      default: [],
    },
    issues: {
      type: [issueSchema],
      default: [],
    },
    tradeoffs: {
      type: [String],
      default: [],
    },
    suggestedImprovements: {
      type: [String],
      default: [],
    },
    alternativeApproach: {
      type: String,
    },
    evaluatorVersion: {
      type: String,
      required: true,
      default: "v1.1",
    },
  },
  {
    timestamps: true,
  },
);

export const Evaluation = mongoose.model<IEvaluation>(
  "Evaluation",
  evaluationSchema,
);
