# Sample queries for reviewers

These are the questions the system was actually built to handle. Start here rather than
guessing — each one demonstrates a specific behaviour.

## 1. Chain rule (worked example)
> How do I apply the chain rule to differentiate sin(x²)?

Demonstrates a step-by-step computational answer grounded in lecture notes, with the source cited.

## 2. Eigenvalues & eigenvectors (worked example)
> Find the eigenvalues and eigenvectors of the matrix [[2,1],[1,2]].

Demonstrates retrieval of a math-heavy answer (characteristic polynomial → eigenvalues → eigenvectors).

## 3. Newton's second law (word problem)
> A 10 kg box accelerates at 2 m/s². What force acts on it?

Demonstrates matching a natural-language word problem to the correct physics concept.

## 4. Integration by parts (worked example)
> How do I integrate x·eˣ dx?

Demonstrates a multi-step solution with the LIATE rule for choosing u.

## 5. Out-of-scope refusal (behaviour check)
> What is the best restaurant near campus?

The assistant should **refuse** and suggest in-scope topics instead of guessing — this is our
third success criterion.
