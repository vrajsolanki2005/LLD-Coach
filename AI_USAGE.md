# AI_USAGE.md — LLD Coach

## AI tools used

AI assistance was used during development for:

- brainstorming the MVP product direction,
- refining the learner journey,
- discussing evaluation architecture,
- generating and reviewing implementation scaffolding,
- identifying edge cases,
- improving error/loading states,
- drafting documentation,
- researching comparable LLD practice products.

## Meaningful AI usage in the product

AI is deliberately separated from the core evaluation architecture.

The product defines:

```ts
interface Evaluator {
  evaluate(
    problem: IProblem,
    submission: ISubmission
  ): Promise<EvaluationResult>;
}
```

The current MVP uses a deterministic `RuleBasedEvaluator`.

An `LLMEvaluator` implementation is isolated behind the same interface so an LLM provider can later evaluate open-ended qualities such as:

- design reasoning,
- SOLID principles,
- coupling and cohesion,
- abstraction,
- extensibility,
- design patterns,
- trade-offs,
- alternative approaches.

This separation was intentional: the prototype should remain functional and explainable even when no LLM API is configured.

## AI-generated code policy

AI-generated code was treated as implementation assistance rather than as an unquestioned source of truth.

Important generated code was reviewed against:

- the challenge requirements,
- existing project structure,
- TypeScript types,
- MongoDB schemas,
- authentication/authorization behavior,
- evaluation lifecycle,
- expected failure states.

## What was not delegated to AI

The following product decisions were intentionally made at the application/architecture level:

- the core learner journey,
- the structured submission format,
- the evaluator abstraction,
- deterministic-vs-LLM evaluation split,
- attempt lifecycle,
- failure/retry behavior,
- MVP scope and trade-offs.

## Limitations

The current rule-based evaluator is heuristic. It cannot determine that one valid LLD solution is universally better than another.

The future LLM evaluator must also be treated as advisory rather than as an absolute judge because LLD is open-ended and model output can be inconsistent.

## Transparency

AI assistance was used throughout development, but the final architecture, product scope, evaluation model, limitations, and trade-offs were reviewed and intentionally selected for this prototype.
