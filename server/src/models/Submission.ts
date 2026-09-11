import mongoose, { Document, Schema } from "mongoose";

export interface IClassDefinition {
  name: string;
  responsibility: string;
  methods: string[];
}

export interface IRelationship {
  from: string;
  to: string;
  type: string;
  description?: string;
}

export interface ISubmission extends Document {
  attemptId: mongoose.Types.ObjectId;
  version: number;

  classes: IClassDefinition[];

  relationships: IRelationship[];

  code?: string;

  explanation?: string;

  submittedAt: Date;

  createdAt: Date;
  updatedAt: Date;
}

const classDefinitionSchema = new Schema<IClassDefinition>(
  {
    name: {
      type: String,
      required: true,
    },

    responsibility: {
      type: String,
      required: true,
    },

    methods: {
      type: [String],
      default: [],
    },
  },
  {
    _id: false,
  },
);

const relationshipSchema = new Schema<IRelationship>(
  {
    from: {
      type: String,
      required: true,
    },

    to: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      required: true,
    },

    description: {
      type: String,
    },
  },
  {
    _id: false,
  },
);

const submissionSchema = new Schema<ISubmission>(
  {
    attemptId: {
      type: Schema.Types.ObjectId,
      ref: "Attempt",
      required: true,
      index: true,
    },

    version: {
      type: Number,
      required: true,
    },

    classes: {
      type: [classDefinitionSchema],
      default: [],
    },

    relationships: {
      type: [relationshipSchema],
      default: [],
    },

    code: {
      type: String,
    },

    explanation: {
      type: String,
    },

    submittedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

submissionSchema.index(
  {
    attemptId: 1,
    version: 1,
  },
  {
    unique: true,
  },
);

export const Submission = mongoose.model<ISubmission>(
  "Submission",
  submissionSchema,
);
