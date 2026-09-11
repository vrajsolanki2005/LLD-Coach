import mongoose, { Document, Schema } from "mongoose";

export type Difficulty = "Easy" | "Medium" | "Hard";

//problem_schema
export interface IProblem extends Document {
  title: string;
  slug: string;
  description: string;
  difficulty: Difficulty;
  requirements: string[];
  entities: string[];
  evaluationCriteria: string[];
  createdAt: Date;
  updatedAt: Date;
}

const problemSchema = new Schema<IProblem>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      required: true,
    },

    requirements: {
      type: [String],
      required: true,
    },

    entities: {
      type: [String],
      required: true,
    },

    evaluationCriteria: {
      type: [String],
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const Problem = mongoose.model<IProblem>("Problem", problemSchema);
