export type Difficulty = "Easy" | "Medium" | "Hard";

export interface Problem {
  _id: string;
  title: string;
  slug: string;
  description: string;
  difficulty: Difficulty;
  requirements: string[];
  entities: string[];
  evaluationCriteria: string[];
}

export interface Attempt {
  _id: string;
  userId: string;
  problemId: Problem;
  status: "DRAFT" | "SUBMITTED" | "EVALUATING" | "COMPLETED" | "FAILED";
  startedAt: string;
  submittedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface ClassDefinition {
  name: string;
  responsibility: string;
  methods: string[];
}

export interface Relationship {
  from: string;
  to: string;
  type: string;
  description?: string;
}

export interface SubmissionData {
  classes: ClassDefinition[];
  relationships: Relationship[];
  explanation: string;
  code?: string;
}

export type EvaluationStatus = "PENDING" | "COMPLETED" | "FAILED";

export interface EvaluationCategory {
  name: string;
  score: number;
  feedback: string;
}

export interface EvaluationIssue {
  severity: "low" | "medium" | "high";
  title: string;
  explanation: string;
  suggestion: string;
}

export interface Evaluation {
  _id: string;
  submissionId: string;
  status: EvaluationStatus;
  overallScore?: number;
  categories: EvaluationCategory[];
  strengths: string[];
  issues: EvaluationIssue[];
  tradeoffs: string[];
  suggestedImprovements: string[];
  alternativeApproach?: string;
  evaluatorVersion: string;
  createdAt: string;
  updatedAt: string;
}
