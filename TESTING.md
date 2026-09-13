# Testing — LLD Coach

## Test strategy

The MVP prioritizes tests around the evaluation engine because it is the core product behavior and contains the most important domain-specific logic.

The test suite covers both positive and negative/edge cases:

- complete designs,
- missing required entities,
- missing required behaviors,
- empty responsibilities,
- invalid relationships,
- weak explanations,
- overloaded/god classes.

For the final repository, add integration/API tests for authentication, ownership checks, invalid IDs, submission validation, and retry behavior.

## Install

From `server/`:

```bash
npm install -D vitest
```

Add this script to `server/package.json`:

```json
"test": "vitest run",
"test:watch": "vitest"
```

## Run

```bash
npm test
```

## Recommended integration tests

1. `POST /api/auth/register` rejects a duplicate email.
2. `POST /api/auth/login` rejects invalid credentials.
3. `GET /api/attempts` rejects unauthenticated requests.
4. A user cannot read another user's attempt.
5. Invalid MongoDB IDs return a 400-level response.
6. Submitting an empty design is rejected.
7. Submitting without an explanation is rejected.
8. A failed evaluation can be retried.
9. A completed attempt cannot be edited.
10. A submission remains preserved after an evaluation failure.
