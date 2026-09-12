import mongoose, { Document, Schema } from "mongoose";

export type Difficulty = "Easy" | "Medium" | "Hard";

export interface IEvaluationBehavior {
  name: string;
  keywords: string[];
  description: string;
}

export interface IEvaluationConfig {
  requiredEntities: string[];
  recommendedEntities: string[];
  requiredBehaviors: IEvaluationBehavior[];
  recommendedConcepts: string[];
}

export interface IProblem extends Document {
  title: string;
  slug: string;
  description: string;
  difficulty: Difficulty;
  requirements: string[];
  entities: string[];
  evaluationCriteria: string[];
  evaluationConfig: IEvaluationConfig;
  createdAt: Date;
  updatedAt: Date;
}

const evaluationBehaviorSchema = new Schema<IEvaluationBehavior>(
  {
    name: { type: String, required: true },
    keywords: { type: [String], default: [] },
    description: { type: String, required: true },
  },
  { _id: false },
);

const evaluationConfigSchema = new Schema<IEvaluationConfig>(
  {
    requiredEntities: { type: [String], default: [] },
    recommendedEntities: { type: [String], default: [] },
    requiredBehaviors: {
      type: [evaluationBehaviorSchema],
      default: [],
    },
    recommendedConcepts: { type: [String], default: [] },
  },
  { _id: false },
);

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

    evaluationConfig: {
      type: evaluationConfigSchema,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const Problem = mongoose.model<IProblem>("Problem", problemSchema);
