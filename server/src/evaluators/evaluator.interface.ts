import type { IProblem } from "../models/Problem";
import type { ISubmission } from "../models/Submission";

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

export interface EvaluationResult {
  overallScore: number;
  categories: EvaluationCategory[];
  strengths: string[];
  issues: EvaluationIssue[];
  tradeoffs: string[];
  suggestedImprovements: string[];
  alternativeApproach?: string;
  evaluatorVersion: string;
}

export interface Evaluator {
  id: string;

  evaluate(
    problem: IProblem,
    submission: ISubmission,
  ): Promise<EvaluationResult>;
}
