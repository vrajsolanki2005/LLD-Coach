import api from "./api";
import type { Evaluation } from "../types/index";

export interface EvaluationResponse {
  success: boolean;
  attemptStatus: "DRAFT" | "SUBMITTED" | "EVALUATING" | "COMPLETED" | "FAILED";
  submission: {
    _id: string;
    version: number;
    classes: { name: string; responsibility: string; methods: string[] }[];
    relationships: { from: string; to: string; type: string; description?: string }[];
    explanation: string;
    code?: string;
  };
  evaluation: Evaluation;
}

export const getAttemptEvaluation = async (attemptId: string): Promise<EvaluationResponse> => {
  const response = await api.get(`/evaluations/${attemptId}`);
  return response.data;
};
