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
