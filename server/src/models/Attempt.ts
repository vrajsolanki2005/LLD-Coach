import mongoose, { Document, Schema } from "mongoose";

export type AttemptStatus =
  | "DRAFT"
  | "SUBMITTED"
  | "EVALUATING"
  | "COMPLETED"
  | "FAILED";

export interface IAttempt extends Document {
  userId: mongoose.Types.ObjectId;
  problemId: mongoose.Types.ObjectId;
  status: AttemptStatus;
  startedAt: Date;
  submittedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const attemptSchema = new Schema<IAttempt>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    problemId: {
      type: Schema.Types.ObjectId,
      ref: "Problem",
      required: true,
      index: true,
    },

    status: {
      type: String,
      enum: ["DRAFT", "SUBMITTED", "EVALUATING", "COMPLETED", "FAILED"],
      default: "DRAFT",
    },

    startedAt: {
      type: Date,
      default: Date.now,
    },

    submittedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

export const Attempt = mongoose.model<IAttempt>("Attempt", attemptSchema);
