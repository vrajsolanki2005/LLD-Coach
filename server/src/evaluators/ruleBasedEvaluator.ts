import type {
  EvaluationIssue,
  EvaluationResult,
  Evaluator,
} from "./evaluator.interface";
import type { IProblem } from "../models/Problem";
import type { ISubmission } from "../models/Submission";

const normalize = (value: string): string => {
  return value.toLowerCase().replace(/[\s_-]/g, "");
};

const roundScore = (score: number): number => Math.round(score * 10) / 10;

export class RuleBasedEvaluator implements Evaluator {
  id = "rule-based-v1";

  async evaluate(
    problem: IProblem,
    submission: ISubmission,
  ): Promise<EvaluationResult> {
    const issues: EvaluationIssue[] = [];
    const strengths: string[] = [];
    const suggestedImprovements: string[] = [];
    const classNames = submission.classes.map((item) => item.name);
    const normalizedClassNames = classNames.map(normalize);

    let matchedEntities = 0;
    for (const entity of problem.entities) {
      const normalizedEntity = normalize(entity);
      const matched = normalizedClassNames.some(
        (className) =>
          className === normalizedEntity ||
          className.includes(normalizedEntity) ||
          normalizedEntity.includes(className),
      );

      if (matched) {
        matchedEntities++;
      } else {
        issues.push({
          severity: "medium",
          title: `Missing class: ${entity}`,
          explanation: `The problem identifies "${entity}" as an important domain concept, but no corresponding class was found in the submission.`,
          suggestion: `Consider introducing a ${entity} class if it represents a meaningful responsibility in your design.`,
        });
      }
    }

    const completenessScore =
      problem.entities.length === 0
        ? 10
        : (matchedEntities / problem.entities.length) * 10;

    if (matchedEntities === problem.entities.length) {
      strengths.push("All major domain entities identified by the problem are represented.");
    }

    const classesWithResponsibilities = submission.classes.filter(
      (item) => item.responsibility?.trim().length > 0,
    );
    const responsibilityScore =
      submission.classes.length === 0
        ? 0
        : (classesWithResponsibilities.length / submission.classes.length) * 10;

    for (const classItem of submission.classes) {
      if (!classItem.responsibility?.trim()) {
        issues.push({
          severity: "high",
          title: `${classItem.name} has no responsibility`,
          explanation:
            "A class without a clearly defined responsibility makes the design harder to understand and can lead to poor separation of concerns.",
          suggestion:
            "Describe the primary responsibility of this class in one or two clear sentences.",
        });
      }
    }

    if (responsibilityScore >= 8) {
      strengths.push(
        "Classes have clearly defined responsibilities, which improves separation of concerns.",
      );
    } else {
      suggestedImprovements.push(
        "Clarify the responsibility of each class and avoid classes that exist without a clear purpose.",
      );
    }

    const classesWithMethods = submission.classes.filter(
      (item) => item.methods && item.methods.length > 0,
    );
    const methodsScore =
      submission.classes.length === 0
        ? 0
        : (classesWithMethods.length / submission.classes.length) * 10;

    for (const classItem of submission.classes) {
      if (!classItem.methods || classItem.methods.length === 0) {
        issues.push({
          severity: "low",
          title: `${classItem.name} has no methods`,
          explanation:
            "The class has a responsibility but no operations showing how that responsibility would be performed.",
          suggestion:
            "Add the important public methods that demonstrate how this class participates in the system.",
        });
      }
    }

    if (methodsScore >= 8) {
      strengths.push(
        "Most classes expose meaningful methods that reflect their responsibilities.",
      );
    }

    let validRelationships = 0;
    for (const relationship of submission.relationships) {
      const fromExists = normalizedClassNames.includes(normalize(relationship.from));
      const toExists = normalizedClassNames.includes(normalize(relationship.to));

      if (fromExists && toExists) {
        validRelationships++;
      } else {
        issues.push({
          severity: "high",
          title: "Invalid relationship",
          explanation: `The relationship "${relationship.from} -> ${relationship.to}" references a class that does not exist in the submission.`,
          suggestion:
            "Make sure both ends of every relationship correspond to classes defined in your design.",
        });
      }
    }

    let relationshipScore = 10;
    if (submission.classes.length > 1) {
      if (submission.relationships.length === 0) {
        relationshipScore = 2;
        issues.push({
          severity: "high",
          title: "No class relationships defined",
          explanation:
            "The submission contains multiple classes but does not describe how those classes interact.",
          suggestion:
            "Add relationships such as association, aggregation, composition, inheritance, or dependency where appropriate.",
        });
      } else {
        relationshipScore =
          (validRelationships / submission.relationships.length) * 10;
      }
    }

    if (relationshipScore >= 8) {
      strengths.push(
        "Class relationships are explicitly represented and reference valid classes.",
      );
    }

    const explanationLength = submission.explanation?.trim().length || 0;
    let explanationScore = 0;
    if (explanationLength >= 500) explanationScore = 10;
    else if (explanationLength >= 300) explanationScore = 8;
    else if (explanationLength >= 150) explanationScore = 6;
    else if (explanationLength >= 75) explanationScore = 4;
    else if (explanationLength > 0) explanationScore = 2;

    if (explanationScore >= 8) {
      strengths.push(
        "The explanation provides enough detail to understand the reasoning behind the design.",
      );
    } else {
      issues.push({
        severity: "medium",
        title: "Design explanation is too brief",
        explanation:
          "The class structure alone does not fully explain why responsibilities and relationships were chosen.",
        suggestion:
          "Explain your major design decisions, responsibilities, relationships, and important trade-offs.",
      });
      suggestedImprovements.push(
        "Expand the design explanation and justify the most important architectural decisions.",
      );
    }

    if (submission.classes.length >= 3) {
      strengths.push(
        "The design contains multiple collaborating classes rather than putting most behavior into a single class.",
      );
    }

    if (submission.classes.length === 1) {
      issues.push({
        severity: "medium",
        title: "Very small class structure",
        explanation:
          "The entire design is represented by a single class, which may indicate that several responsibilities are combined.",
        suggestion:
          "Review the requirements and identify whether additional domain classes or services should be introduced.",
      });
    }

    const categories = [
      {
        name: "Completeness",
        score: roundScore(completenessScore),
        feedback:
          completenessScore >= 8
            ? "Most or all important domain entities are represented."
            : "Several important domain entities are missing from the design.",
      },
      {
        name: "Responsibilities",
        score: roundScore(responsibilityScore),
        feedback:
          responsibilityScore >= 8
            ? "Responsibilities are clearly assigned to classes."
            : "Some classes need clearer or more focused responsibilities.",
      },
      {
        name: "Methods",
        score: roundScore(methodsScore),
        feedback:
          methodsScore >= 8
            ? "Classes contain methods that represent their behavior."
            : "Several classes do not yet describe their important behavior.",
      },
      {
        name: "Relationships",
        score: roundScore(relationshipScore),
        feedback:
          relationshipScore >= 8
            ? "Class interactions are represented clearly."
            : "The design needs stronger or more accurate class relationships.",
      },
      {
        name: "Explanation",
        score: roundScore(explanationScore),
        feedback:
          explanationScore >= 8
            ? "The explanation demonstrates the reasoning behind the design."
            : "The explanation should provide more reasoning and design trade-offs.",
      },
    ];

    const overallScore = roundScore(
      categories.reduce((sum, category) => sum + category.score, 0) /
        categories.length,
    );

    if (completenessScore < 8) {
      suggestedImprovements.push(
        "Review the problem requirements and ensure the important domain concepts are represented.",
      );
    }
    if (relationshipScore < 8) {
      suggestedImprovements.push(
        "Review the relationships between classes and explicitly model important interactions.",
      );
    }
    if (methodsScore < 8) {
      suggestedImprovements.push(
        "Add meaningful methods that demonstrate the behavior owned by each class.",
      );
    }

    const tradeoffs: string[] = [];
    if (submission.classes.length <= 3) {
      tradeoffs.push(
        "A smaller class structure can be easier to understand, but may combine responsibilities as the system grows.",
      );
    }
    if (submission.classes.length >= 8) {
      tradeoffs.push(
        "A highly decomposed design can improve separation of concerns, but excessive classes may increase complexity.",
      );
    }
    if (submission.relationships.length === 0) {
      tradeoffs.push(
        "Keeping relationships implicit is simple initially, but makes collaboration between components harder to reason about.",
      );
    }

    return {
      overallScore,
      categories,
      strengths,
      issues,
      tradeoffs,
      suggestedImprovements: [...new Set(suggestedImprovements)],
      alternativeApproach:
        "Consider separating core domain entities from orchestration/services so that each class has one primary responsibility.",
      evaluatorVersion: this.id,
    };
  }
}
