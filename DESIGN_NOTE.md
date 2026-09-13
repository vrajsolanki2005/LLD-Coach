# Design Note — LLD Coach

## 1. MVP

LLD Coach is a practice platform for Low-Level Design interview problems.

The learner can:

1. Browse LLD problems.
2. Open a problem and review its requirements.
3. Start an attempt.
4. Define classes and responsibilities.
5. Define methods and relationships.
6. Explain design decisions and trade-offs.
7. Save a draft.
8. Submit the design.
9. Receive evaluation feedback.
10. Review previous attempts.
11. Retry a problem.

The initial problem set contains:
- Parking Lot
- Vending Machine
- Elevator System

## 2. User flow

```text
Problems
   ↓
Problem Details
   ↓
Start Practice
   ↓
Practice Workspace
   ├── Classes
   ├── Methods
   ├── Relationships
   └── Explanation
   ↓
Save Draft / Submit
   ↓
EVALUATING
   ↓
Evaluation Result
   ├── Score
   ├── Strengths
   ├── Issues
   ├── Trade-offs
   └── Suggested Improvements
   ↓
Attempt History
   ↓
Retry
```

## 3. Important domain classes

### User

Represents an authenticated learner.

### Problem

Stores the LLD prompt, requirements, expected entities, evaluation criteria, and structured evaluation configuration.

### Attempt

Represents a learner's practice session for a problem.

States:

```text
DRAFT
SUBMITTED
EVALUATING
COMPLETED
FAILED
```

### Submission

Represents a version of a learner's design containing classes, relationships, explanation, and optional code.

### Evaluation

Stores evaluation status, score, category-level feedback, strengths, issues, trade-offs, and suggested improvements.

## 4. Evaluator abstraction

The central extension point is:

```ts
interface Evaluator {
  id: string;

  evaluate(
    problem: IProblem,
    submission: ISubmission
  ): Promise<EvaluationResult>;
}
```

Current implementation:

```text
RuleBasedEvaluator
```

Future implementation:

```text
LLMEvaluator
HumanEvaluator
```

This prevents evaluation logic from being coupled to HTTP controllers or a specific AI provider.

## 5. Evaluation approach

### Deterministic layer

The rule-based evaluator checks:

- missing required entities,
- required problem behaviors,
- missing responsibilities,
- potentially overloaded/god classes,
- classes without useful methods,
- invalid relationships,
- missing collaboration,
- explanation quality,
- basic abstraction signals.

Example:

```text
Parking Lot
  ↓
Required entity check
  ↓
ParkingSpot missing
  ↓
HIGH issue
  ↓
"Add a ParkingSpot class with a focused responsibility."
```

### LLM layer

The LLM evaluator is designed to assess qualities that are difficult to reduce to simple rules:

- why responsibilities were assigned,
- coupling/cohesion,
- SOLID reasoning,
- extensibility,
- pattern selection,
- trade-offs,
- alternative designs.

The MVP does not require an LLM API key because the deterministic evaluator provides a working baseline.

## 6. Evaluation lifecycle

```text
Submission created
      ↓
Evaluation = PENDING
      ↓
Attempt = EVALUATING
      ↓
Evaluator runs
      ↓
 ┌───────────────┐
 │               │
Success         Failure
 │               │
 ↓               ↓
COMPLETED       FAILED
```

The submission is preserved when evaluation fails, allowing retry.

## 7. Important trade-offs

### Structured submission instead of only free-form text

A structured class/relationship model makes deterministic evaluation possible and provides more actionable feedback.

Trade-off: it constrains the learner compared with a completely free-form whiteboard.

### Rule-based evaluation before LLM evaluation

Deterministic checks are predictable, fast, explainable, and do not require an API key.

Trade-off: rules cannot fully judge design quality or distinguish all valid design alternatives.

### Evaluator abstraction

Evaluation is isolated behind an interface so providers can be swapped.

Trade-off: a small amount of abstraction is introduced before multiple evaluator implementations exist, but it protects the core architecture from provider-specific logic.

### Polling instead of a queue

The MVP uses a lightweight asynchronous evaluation flow with frontend polling.

Trade-off: polling is less sophisticated than a distributed queue, but it is simpler and appropriate for the expected prototype scale.

### Small problem set

Only a few representative problems are included.

Trade-off: breadth is lower, but the end-to-end learner experience is more complete and demonstrable.

## 8. Out of scope

The MVP intentionally does not include:

- real-time collaboration,
- social feeds,
- complex gamification,
- distributed job queues,
- multi-provider LLM orchestration,
- full UML canvas editing,
- production-scale analytics,
- human review workflows.
