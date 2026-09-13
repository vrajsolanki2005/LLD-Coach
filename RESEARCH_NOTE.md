# Research Note — LLD Coach

## 1. Learner problem

Low-Level Design (LLD) interview practice is different from solving a conventional programming problem. A learner must turn an ambiguous real-world prompt into classes, responsibilities, interfaces, relationships, and behavior, then explain the trade-offs behind those choices.

The current practice experience is fragmented. Learners can study LLD concepts, read solved examples, draw diagrams, or write code, but these activities do not always close the loop of **attempt → feedback → revision → retry**. The most useful feedback is also difficult to standardize because multiple designs can be valid.

LLD Coach focuses on that gap: a small practice loop where a learner chooses a problem, creates a structured design, explains the reasoning, submits it, receives explainable feedback, reviews the attempt, and retries.

## 2. Existing approaches researched

### LLDCanvas

LLDCanvas is a purpose-built LLD/system-design practice platform with a UML editor, practice problems, interview mode, design-pattern material, runnable code, and collaboration. Its editor treats classes and UML relationships as first-class concepts rather than generic drawing shapes.

**Useful insight:** an LLD practice product benefits from domain-aware design primitives instead of a generic whiteboard.

Source: https://www.lldcanvas.in/

### InterviewReady

InterviewReady provides LLD learning material, interview questions, quizzes, and an AI-powered mock/design experience as part of a broader engineering-interview preparation platform.

**Useful insight:** guided learning and interactive evaluation can complement traditional course material.

Source: https://www.interviewready.io/

### LLDcoding

LLDcoding emphasizes interview-style LLD and concurrency practice, including timed machine-coding rounds, code execution, company-oriented problems, and model solutions.

**Useful insight:** practice becomes more realistic when learners actually produce executable or structured solutions rather than only consuming explanations.

Source: https://www.lldcoding.com/

### LLD Arena

LLD Arena is an open-source Java LLD practice platform combining an in-browser editor, local compilation, hidden tests for selected problems, UML diagrams, and optional AI design grading.

**Useful insight:** deterministic checks and AI feedback can coexist; deterministic execution/checks provide a reliable base while AI can handle open-ended design quality.

Source: https://github.com/mightbeanshuu/lld-arena

### DesignDojo

DesignDojo combines LLD/system-design problems with staged practice, a whiteboard/editor, and AI feedback against a rubric.

**Useful insight:** feedback is more useful when tied to explicit rubric criteria and concrete gaps rather than a single opaque score.

Source: https://getdesigndojo.vercel.app/about

## 3. Key gaps identified

1. **Feedback ambiguity:** LLD has multiple valid solutions, so binary pass/fail grading is often inappropriate.
2. **Generic AI feedback:** a score without requirement-level reasoning does not tell the learner what to improve.
3. **Disconnected practice loop:** problem selection, design, feedback, and retry are often spread across separate tools.
4. **Over-reliance on diagrams or code:** a learner may draw a diagram without explaining responsibilities, or write code without articulating design trade-offs.
5. **Lack of explainability:** learners need to know *why* a design is considered weak and what they should change.

## 4. Product direction

LLD Coach is intentionally scoped as an MVP around one core loop:

**Choose problem → Design → Explain → Submit → Evaluate → Review → Retry**

A submission contains:
- classes and responsibilities,
- methods,
- relationships,
- optional code,
- a written design explanation.

Evaluation is split into two layers:

### Deterministic evaluation

Reliable checks cover:
- required domain entities,
- important problem behaviors,
- responsibilities,
- methods,
- relationships,
- explanation completeness,
- basic abstraction signals.

### LLM evaluation

An evaluator interface allows a future LLM evaluator to assess:
- design reasoning,
- coupling/cohesion,
- SOLID principles,
- abstraction quality,
- extensibility,
- trade-offs,
- alternative approaches.

The deterministic evaluator remains the fallback and makes the MVP usable without an API key.

## 5. Product hypothesis

If learners receive concrete, explainable feedback on *why* their LLD design is weak and can immediately retry the same or another problem, they can improve design reasoning more effectively than by only reading model solutions.

The MVP intentionally prioritizes a reliable practice loop over a large problem library, social features, complex distributed evaluation infrastructure, or an elaborate gamification system.
