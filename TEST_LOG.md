# Test Log — CourseMate prototype

Before releasing the demo I ran an automated retrieval test (`node test.js`) over the
prototype's full query path, plus manual spot-checks in the browser.

## Cases run

| # | Query | Expected result | Observed |
|---|-------|-----------------|----------|
| 1 | "How do I apply the chain rule to differentiate sin(x²)?" | chain-rule chunk | ✅ top hit, 0.83 |
| 2 | "Find the eigenvalues/eigenvectors of [[2,1],[1,2]]" | eigen chunk | ✅ top hit, 0.94 |
| 3 | "A 10 kg box accelerates at 2 m/s². What force acts?" | Newton's-law chunk | ✅ top hit, 0.31 |
| 4 | "How do I integrate x·eˣ dx?" | integration-by-parts chunk | ✅ top hit, 0.84 |
| 5 | "What does linearly independent mean?" | independence chunk | ✅ top hit, 0.63 |
| 6 | "Find dy/dx for x² + y² = 25" | implicit-diff chunk | ✅ top hit, 0.79 |
| 7 | "What is the best restaurant near campus?" | refuse (out of scope) | ✅ refused, 0.04 |
| 8 | "Will it rain tomorrow?" | refuse (no match) | ✅ refused |

## What broke and what I fixed

1. **Out-of-scope questions returned low-confidence guesses.** Query 7 initially matched a
   random calculus chunk at a 0.04 relevance score and displayed it as an answer. Fix: I added
   a confidence threshold (0.08). Anything below it now triggers the refusal message instead of
   a fabricated-looking answer, matching our success criterion of refusing out-of-scope input.

2. **Retrieval fragmented across word forms.** "Differentiate", "derivative", "integrate" and
   "eigenvalue" surface as many variants, so related chunks scored inconsistently. Fix: I added
   a synonym/stem normalisation step so these map to one canonical token before scoring.

## What I chose not to fix

- **Physics overlap.** Query 3's runner-up was the kinematics chunk (0.29 vs 0.31) because both
  involve acceleration. The correct chunk still ranked first, so I left this alone — adding
  heavier domain keywords would risk over-fitting to these exact test queries.

The full suite passes 8/8.
