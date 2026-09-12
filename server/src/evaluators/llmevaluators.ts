import {
  Evaluator,
  EvaluationResult,
} from "./evaluator.interface";

import { IProblem } from "../models/Problem";
import { ISubmission } from "../models/Submission";

export class LLMEvaluator implements Evaluator {
  id = "llm-v1";

  async evaluate(
    problem: IProblem,
    submission: ISubmission
  ): Promise<EvaluationResult> {
    throw new Error(
      "LLM evaluator is not configured. Use the rule-based evaluator."
    );
  }
}