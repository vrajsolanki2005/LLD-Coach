import { Evaluator, EvaluationResult } from "./evaluator.interface";
import { IProblem } from "../models/Problem";
import { ISubmission } from "../models/Submission";

const normalize = (value: string): string =>
  value.toLowerCase().replace(/[\s_-]/g, "");

const tokenize = (value: string): string[] => {
  return value
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter(Boolean);
};

const containsKeyword = (text: string, keywords: string[]): boolean => {
  const tokens = new Set(tokenize(text));

  return keywords.some((keyword) => {
    const keywordTokens = tokenize(keyword);

    return keywordTokens.every((token) => tokens.has(token));
  });
};

const clamp = (value: number): number =>
  Math.max(0, Math.min(10, Math.round(value * 10) / 10));

export class RuleBasedEvaluator implements Evaluator {
  id = "rule-based-v2";

  async evaluate(
    problem: IProblem,
    submission: ISubmission,
  ): Promise<EvaluationResult> {
    const classes = submission.classes || [];
    const relationships = submission.relationships || [];

    const classNames = classes.map((item) => item.name);

    const normalizedClassNames = classNames.map(normalize);

    const allMethods = classes.flatMap((item) => item.methods || []);

    const structuralDesignText = [
      ...classNames,
      ...classes.map((item) => item.responsibility),
      ...allMethods,
      ...relationships.map((item) => `${item.from} ${item.to} ${item.type}`),
    ].join(" ");

    const reasoningText = [
      submission.explanation || "",
      submission.code || "",
    ].join(" ");

    const issues: EvaluationResult["issues"] = [];
    const strengths: string[] = [];
    const tradeoffs: string[] = [];
    const suggestedImprovements: string[] = [];

    const requiredEntities =
      problem.evaluationConfig?.requiredEntities || problem.entities || [];

    const recommendedEntities =
      problem.evaluationConfig?.recommendedEntities || [];

    const missingRequiredEntities = requiredEntities.filter(
      (entity) => !normalizedClassNames.includes(normalize(entity)),
    );

    const matchedRecommendedEntities = recommendedEntities.filter((entity) =>
      normalizedClassNames.includes(normalize(entity)),
    );

    if (missingRequiredEntities.length > 0) {
      issues.push({
        severity: "high",
        title: "Missing core design entities",
        explanation: `Your design does not explicitly represent: ${missingRequiredEntities.join(
          ", ",
        )}. These concepts are important for the stated problem.`,
        suggestion:
          "Consider introducing classes for these concepts and give each one a focused responsibility.",
      });
    } else {
      strengths.push(
        "The design represents the core entities expected for this problem.",
      );
    }

    const classesWithoutResponsibilities = classes.filter(
      (item) => !item.responsibility?.trim(),
    );

    if (classesWithoutResponsibilities.length > 0) {
      issues.push({
        severity: "high",
        title: "Classes without clear responsibilities",
        explanation: `The following classes do not clearly explain what they own or do: ${classesWithoutResponsibilities
          .map((item) => item.name)
          .join(", ")}.`,
        suggestion:
          "Give every class one clear responsibility related to the problem domain.",
      });
    }

    const godClasses = classes.filter(
      (item) =>
        (item.methods?.length || 0) > 8 || item.responsibility.length > 300,
    );

    if (godClasses.length > 0) {
      issues.push({
        severity: "medium",
        title: "Possible god class",
        explanation: `These classes appear to have too many responsibilities or operations: ${godClasses
          .map((item) => item.name)
          .join(", ")}.`,
        suggestion:
          "Consider extracting domain services or collaborating classes so responsibilities remain focused.",
      });
    } else if (classes.length > 1) {
      strengths.push(
        "Responsibilities are reasonably distributed across multiple classes.",
      );
    }

    const behaviors = problem.evaluationConfig?.requiredBehaviors || [];

    let coveredBehaviors = 0;

    for (const behavior of behaviors) {
      const covered = containsKeyword(structuralDesignText, behavior.keywords);
      if (covered) {
        coveredBehaviors++;

        strengths.push(
          `Your design addresses the "${behavior.name}" behavior.`,
        );
      } else {
        issues.push({
          severity: "high",
          title: `Missing behavior: ${behavior.name}`,
          explanation: behavior.description,
          suggestion: `Add a method, class responsibility, relationship, or explanation showing how "${behavior.name}" is handled.`,
        });
      }
    }

    const classesWithNoMethods = classes.filter(
      (item) => !item.methods || item.methods.length === 0,
    );

    if (classesWithNoMethods.length > 0) {
      issues.push({
        severity: "medium",
        title: "Some classes have no methods",
        explanation: `These classes have no operations defined: ${classesWithNoMethods
          .map((item) => item.name)
          .join(", ")}.`,
        suggestion:
          "Add the key operations owned by each class. Avoid adding methods just to increase the count.",
      });
    }

    if (allMethods.length >= classes.length * 2) {
      strengths.push(
        "The design provides meaningful operations instead of only listing data entities.",
      );
    }

    const invalidRelationships = relationships.filter(
      (relationship) =>
        !classNames.includes(relationship.from) ||
        !classNames.includes(relationship.to),
    );

    if (invalidRelationships.length > 0) {
      issues.push({
        severity: "high",
        title: "Invalid relationships",
        explanation:
          "Some relationships refer to classes that are not present in the submitted design.",
        suggestion:
          "Make sure every relationship connects two classes defined in your design.",
      });
    }

    if (relationships.length === 0 && classes.length > 1) {
      issues.push({
        severity: "medium",
        title: "No class relationships defined",
        explanation:
          "The submission contains multiple classes but does not explain how they collaborate.",
        suggestion:
          "Add associations, composition, aggregation, dependency, or inheritance relationships where appropriate.",
      });
    } else if (relationships.length > 0) {
      strengths.push(
        "The submission explicitly models collaboration between classes.",
      );
    }

    const recommendedConcepts =
      problem.evaluationConfig?.recommendedConcepts || [];

    const abstractionKeywords = [
      "interface",
      "abstract",
      "strategy",
      "factory",
      "polymorphism",
      "inheritance",
      "composition",
    ];

    const abstractionDetected = abstractionKeywords.some((keyword) =>
      structuralDesignText.toLowerCase().includes(keyword),
    );

    if (
      recommendedConcepts.some((concept) =>
        abstractionKeywords.some((keyword) =>
          concept.toLowerCase().includes(keyword),
        ),
      ) &&
      !abstractionDetected
    ) {
      issues.push({
        severity: "low",
        title: "Abstraction opportunity",
        explanation:
          "The problem has areas where abstraction can reduce coupling or make future extensions easier.",
        suggestion:
          "Consider interfaces, composition, strategy, factory, or polymorphism where they solve a real design problem. Do not add patterns unnecessarily.",
      });
    }

    const explanation = submission.explanation?.trim() || "";

    const reasoningKeywords = [
      "because",
      "tradeoff",
      "scalable",
      "extensible",
      "coupling",
      "cohesion",
      "responsibility",
      "interface",
      "future",
      "design",
    ];

    const reasoningSignals = reasoningKeywords.filter((keyword) =>
      explanation.toLowerCase().includes(keyword),
    );

    if (explanation.length < 100) {
      issues.push({
        severity: "medium",
        title: "Limited design reasoning",
        explanation:
          "The explanation is too short to understand why the design decisions were made.",
        suggestion:
          "Explain why responsibilities were assigned this way, how classes collaborate, and at least one important trade-off.",
      });
    }

    if (reasoningSignals.length >= 3) {
      strengths.push(
        "The explanation discusses design reasoning rather than only listing classes.",
      );
    }

    if (
      explanation.toLowerCase().includes("tradeoff") ||
      explanation.toLowerCase().includes("trade-off")
    ) {
      tradeoffs.push("The submission explicitly discusses a design trade-off.");
    } else {
      suggestedImprovements.push(
        "Explain at least one trade-off you considered and why you selected your final approach.",
      );
    }

    const completenessScore =
      requiredEntities.length === 0
        ? 10
        : clamp(
            ((requiredEntities.length - missingRequiredEntities.length) /
              requiredEntities.length) *
              10,
          );

    const responsibilityScore = clamp(
      10 - classesWithoutResponsibilities.length * 3 - godClasses.length * 2,
    );

    const behaviorScore =
      behaviors.length === 0
        ? 10
        : clamp((coveredBehaviors / behaviors.length) * 10);

    const relationshipScore =
      classes.length <= 1
        ? 10
        : invalidRelationships.length > 0
          ? 4
          : relationships.length === 0
            ? 5
            : 9;

    const methodsScore =
      classes.length === 0
        ? 0
        : clamp(10 - (classesWithNoMethods.length / classes.length) * 6);

    const explanationScore =
      explanation.length >= 300
        ? 10
        : explanation.length >= 200
          ? 8
          : explanation.length >= 100
            ? 6
            : 3;

    const categories = [
      {
        name: "Design Completeness",
        score: completenessScore,
        feedback:
          missingRequiredEntities.length === 0
            ? "Core domain entities are represented."
            : `Missing: ${missingRequiredEntities.join(", ")}.`,
      },
      {
        name: "Responsibilities",
        score: responsibilityScore,
        feedback:
          godClasses.length > 0
            ? "Some classes may contain too many responsibilities."
            : "Responsibilities are reasonably distributed.",
      },
      {
        name: "Requirement Coverage",
        score: behaviorScore,
        feedback: `${coveredBehaviors}/${behaviors.length} important behaviors are represented.`,
      },
      {
        name: "Relationships",
        score: relationshipScore,
        feedback:
          relationships.length > 0
            ? "The design contains explicit class collaboration."
            : "Add relationships showing how objects collaborate.",
      },
      {
        name: "Methods",
        score: methodsScore,
        feedback:
          classesWithNoMethods.length > 0
            ? "Some classes need clearer operations."
            : "Classes contain meaningful operations.",
      },
      {
        name: "Design Reasoning",
        score: explanationScore,
        feedback:
          explanation.length >= 200
            ? "The explanation provides useful reasoning."
            : "Expand the explanation with decisions and trade-offs.",
      },
    ];

    const overallScore = clamp(
      completenessScore * 0.2 +
        responsibilityScore * 0.15 +
        behaviorScore * 0.2 +
        relationshipScore * 0.15 +
        methodsScore * 0.15 +
        explanationScore * 0.15,
    );

    if (matchedRecommendedEntities.length > 0) {
      strengths.push(
        `The design also includes recommended concepts: ${matchedRecommendedEntities.join(
          ", ",
        )}.`,
      );
    }

    suggestedImprovements.push(
      "Review each requirement and map it to one or more classes or behaviors.",
    );

    suggestedImprovements.push(
      "Prefer focused responsibilities and meaningful collaboration over adding many classes.",
    );

    return {
      overallScore,
      categories,
      strengths,
      issues,
      tradeoffs,
      suggestedImprovements,
      alternativeApproach:
        "For a more extensible design, consider using interfaces and composition around areas that are likely to change, while keeping the core domain objects focused.",
      evaluatorVersion: this.id,
    };
  }
}
