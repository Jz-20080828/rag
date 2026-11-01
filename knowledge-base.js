/* =====================================================================
 * CourseMate — Undergraduate Course Q&A RAG Chatbot
 * Knowledge base (curated from course materials).
 *
 * Each entry is a grounded chunk with an explicit citation. Retrieval
 * (retrieval.js) ranks these against the user query; the top hit is
 * rendered as the answer and the rest are shown as supporting sources.
 * ===================================================================== */
(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.KB = factory();
  }
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  var entries = [
    /* ---------------------------- Calculus I ---------------------------- */
    {
      id: "calc-limit",
      course: "MATH101 · Calculus I",
      topic: "Limits",
      type: "concept",
      title: "What is a limit?",
      question: "What is a limit in calculus?",
      source: "MATH101 Lecture Notes, Week 2, slide 4",
      keywords: ["limit", "approaches", "one-sided", "continuity"],
      content:
        "The **limit** of a function f(x) as x approaches a value a, written lim(x→a) f(x), is the value that f(x) gets arbitrarily close to as x gets close to a (from either side) — even if f(x) is not defined exactly at a.\n\n**Worked intuition**\n- Consider f(x) = (x² − 4) / (x − 2). Plugging in x = 2 gives 0/0, which is undefined.\n- Factor the numerator: (x − 2)(x + 2) / (x − 2) = x + 2, for x ≠ 2.\n- As x → 2, the expression approaches 2 + 2 = 4.\n- So lim(x→2) (x² − 4) / (x − 2) = **4**.\n\n**Key points**\n- A limit describes behaviour *near* a point, not necessarily *at* the point.\n- The left-hand and right-hand limits must agree for the two-sided limit to exist.",
    },
    {
      id: "calc-derivative",
      course: "MATH101 · Calculus I",
      topic: "Definition of the derivative",
      type: "concept",
      title: "Definition of the derivative",
      question: "What is the derivative of a function?",
      source: "MATH101 Lecture Notes, Week 3, slide 6",
      keywords: ["derivative", "tangent", "rate of change", "difference quotient"],
      content:
        "The **derivative** of f at x measures the instantaneous rate of change, defined as:\n\nf′(x) = lim(h→0) [ f(x + h) − f(x) ] / h\n\nGeometrically, f′(x) is the slope of the tangent line to the curve y = f(x) at x.\n\n**Example**\n- For f(x) = x²: f′(x) = lim(h→0) [ (x + h)² − x² ] / h = lim(h→0) (2xh + h²) / h = 2x.\n- So the slope of y = x² at x = 3 is **6**.",
    },
    {
      id: "calc-chain-rule",
      course: "MATH101 · Calculus I",
      topic: "Chain rule",
      type: "worked-example",
      title: "Chain rule: differentiating sin(x²)",
      question: "How do I apply the chain rule to differentiate sin(x²)?",
      source: "MATH101 Lecture Notes, Week 5, worked example 3",
      keywords: ["chain rule", "differentiate", "composite", "outer", "inner"],
      content:
        "The **chain rule** says: if y = f(g(x)), then dy/dx = f′(g(x)) · g′(x).\n\n**Worked example — differentiate sin(x²)**\n- Outer function: f(u) = sin(u), with inner u = x².\n- f′(u) = cos(u), and g′(x) = 2x.\n- Apply the chain rule: d/dx sin(x²) = cos(x²) · 2x.\n- Final answer: **2x · cos(x²)**.\n\n**General recipe**\n1. Identify the outer function and the inner function.\n2. Differentiate the outer function, keeping the inner unchanged.\n3. Multiply by the derivative of the inner function.",
    },
    {
      id: "calc-implicit",
      course: "MATH101 · Calculus I",
      topic: "Implicit differentiation",
      type: "worked-example",
      title: "Implicit differentiation: x² + y² = 25",
      question: "How do I find dy/dx for x² + y² = 25?",
      source: "MATH101 Lecture Notes, Week 6, worked example 1",
      keywords: ["implicit", "dy/dx", "circle", "chain rule"],
      content:
        "Use **implicit differentiation** when y is not isolated on one side.\n\n**Worked example — find dy/dx for x² + y² = 25**\n- Differentiate both sides with respect to x: 2x + 2y · (dy/dx) = 0.\n- Solve for dy/dx: 2y · (dy/dx) = −2x  →  dy/dx = −x / y.\n- At the point (3, 4), the slope is dy/dx = −3/4.\n\n**Key point**\n- Every time you differentiate a term containing y, multiply by dy/dx (this is just the chain rule applied to y).",
    },
    {
      id: "calc-ibp",
      course: "MATH101 · Calculus I",
      topic: "Integration by parts",
      type: "worked-example",
      title: "Integration by parts: ∫ x·eˣ dx",
      question: "How do I integrate x·eˣ dx?",
      source: "MATH101 Tutorial, Week 8, question 2",
      keywords: ["integration by parts", "integrate", "exponential", "LIATE"],
      content:
        "**Integration by parts** follows ∫ u dv = uv − ∫ v du.\n\n**Worked example — evaluate ∫ x·eˣ dx**\n- Choose u = x (it becomes simpler when differentiated) and dv = eˣ dx.\n- Then du = dx and v = eˣ.\n- Substitute: ∫ x·eˣ dx = x·eˣ − ∫ eˣ dx.\n- = x·eˣ − eˣ + C = **(x − 1)·eˣ + C**.\n\n**Choosing u (LIATE rule of thumb)**\n- Pick u from the category that comes first: Logs, Inverse trig, Algebraic, Trig, Exponential.",
    },

    /* --------------------------- Linear Algebra -------------------------- */
    {
      id: "la-matrix-mult",
      course: "MATH102 · Linear Algebra",
      topic: "Matrix multiplication",
      type: "worked-example",
      title: "Matrix multiplication: 2×2 example",
      question: "How do I multiply two matrices?",
      source: "MATH102 Lecture Notes, Week 3, example 2",
      keywords: ["matrix", "multiply", "dot product", "rows", "columns"],
      content:
        "To multiply A (m×n) by B (n×p), the entry in row i, column j of AB is the **dot product** of row i of A with column j of B.\n\n**Worked example — A = [[1, 2], [3, 4]], B = [[5, 6], [7, 8]]**\n- Row 1 · Col 1: (1)(5) + (2)(7) = 5 + 14 = 19\n- Row 1 · Col 2: (1)(6) + (2)(8) = 6 + 16 = 22\n- Row 2 · Col 1: (3)(5) + (4)(7) = 15 + 28 = 43\n- Row 2 · Col 2: (3)(6) + (4)(8) = 18 + 32 = 50\n\nAB = [[19, 22], [43, 50]].\n\n**Requirement**\n- The number of columns of A must equal the number of rows of B; otherwise the product is undefined.",
    },
    {
      id: "la-eigen",
      course: "MATH102 · Linear Algebra",
      topic: "Eigenvalues & eigenvectors",
      type: "worked-example",
      title: "Eigenvalues & eigenvectors of [[2,1],[1,2]]",
      question: "How do I find the eigenvalues and eigenvectors of a 2×2 matrix?",
      source: "MATH102 Lecture Notes, Week 9, worked example 1",
      keywords: ["eigenvalue", "eigenvector", "characteristic", "determinant"],
      content:
        "For a matrix A, λ is an **eigenvalue** if det(A − λI) = 0.\n\n**Worked example — A = [[2, 1], [1, 2]]**\n- A − λI = [[2−λ, 1], [1, 2−λ]].\n- det(A − λI) = (2−λ)² − 1 = λ² − 4λ + 3 = 0.\n- Factor: (λ − 1)(λ − 3) = 0 → **eigenvalues λ = 3 and λ = 1**.\n\nFor each λ, solve (A − λI)v = 0:\n- λ = 3: [[−1, 1], [1, −1]] v = 0 → v = (1, 1).\n- λ = 1: [[1, 1], [1, 1]] v = 0 → v = (1, −1).\n\n**Eigenvectors: (1, 1) for λ = 3, and (1, −1) for λ = 1.**",
    },
    {
      id: "la-det",
      course: "MATH102 · Linear Algebra",
      topic: "Determinants",
      type: "worked-example",
      title: "Determinant of a 3×3 matrix",
      question: "How do I compute the determinant of a 3×3 matrix?",
      source: "MATH102 Lecture Notes, Week 5, example 3",
      keywords: ["determinant", "cofactor", "3x3", "singular", "invertible"],
      content:
        "The **determinant** of a 3×3 matrix is computed by cofactor expansion along the first row.\n\n**Worked example — A = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]**\n- det(A) = 1·det([[5,6],[8,9]]) − 2·det([[4,6],[7,9]]) + 3·det([[4,5],[7,8]])\n- = 1·(5·9 − 6·8) − 2·(4·9 − 6·7) + 3·(4·8 − 5·7)\n- = 1·(−3) − 2·(−6) + 3·(−3) = −3 + 12 − 9 = **0**.\n\n**Note**\n- A zero determinant means the matrix is singular (not invertible).",
    },
    {
      id: "la-independence",
      course: "MATH102 · Linear Algebra",
      topic: "Linear independence",
      type: "concept",
      title: "Linear independence",
      question: "What does it mean for vectors to be linearly independent?",
      source: "MATH102 Lecture Notes, Week 6, slide 8",
      keywords: ["independent", "vectors", "linear combination", "dependent"],
      content:
        "A set of vectors v₁, v₂, …, vₙ is **linearly independent** if the only solution to\n\nc₁v₁ + c₂v₂ + … + cₙvₙ = 0\n\nis c₁ = c₂ = … = cₙ = 0.\n\nIf some non-trivial combination (some cᵢ ≠ 0) gives the zero vector, the vectors are **linearly dependent**.\n\n**Example**\n- (1, 0) and (0, 1) are independent: c₁(1,0) + c₂(0,1) = (c₁, c₂) = (0,0) forces c₁ = c₂ = 0.\n- (1, 2) and (2, 4) are dependent, because (2, 4) = 2·(1, 2).",
    },

    /* --------------------------- Physics (Mechanics) ---------------------- */
    {
      id: "phys-newton",
      course: "PHYS100 · Mechanics",
      topic: "Newton's second law",
      type: "worked-example",
      title: "Newton's second law: F = ma",
      question: "What is Newton's second law and how do I use F = ma?",
      source: "PHYS100 Lecture Notes, Week 4, worked example 2",
      keywords: ["newton", "force", "mass", "acceleration", "F=ma"],
      content:
        "**Newton's second law** states that the net force on an object equals its mass times its acceleration:\n\nF = m · a\n\n**Worked example**\n- A 10 kg box accelerates at 2 m/s². What net force acts on it?\n- F = m · a = 10 kg × 2 m/s² = **20 N**.\n\n**Key points**\n- Force is a vector: direction matters, and forces add as vectors.\n- The law gives the *net* force — the vector sum of all forces acting on the object.",
    },
    {
      id: "phys-kinematics",
      course: "PHYS100 · Mechanics",
      topic: "Constant-acceleration motion",
      type: "worked-example",
      title: "Constant-acceleration motion (SUVAT)",
      question: "How do I use the constant-acceleration (SUVAT) equations?",
      source: "PHYS100 Lecture Notes, Week 2, worked example 3",
      keywords: ["kinematics", "SUVAT", "velocity", "displacement", "acceleration"],
      content:
        "For motion with constant acceleration a, the **SUVAT** equations link displacement s, initial velocity u, final velocity v and time t:\n\n- v = u + a·t\n- s = u·t + ½·a·t²\n- v² = u² + 2·a·s\n\n**Worked example**\n- A car starts from rest (u = 0) and accelerates at 2 m/s² for 5 s.\n- Final velocity: v = 0 + 2 × 5 = **10 m/s**.\n- Displacement: s = 0 + ½ × 2 × 5² = **25 m**.",
    },
    {
      id: "phys-energy",
      course: "PHYS100 · Mechanics",
      topic: "Conservation of energy",
      type: "worked-example",
      title: "Conservation of mechanical energy",
      question: "How do I use conservation of energy for a falling object?",
      source: "PHYS100 Lecture Notes, Week 8, worked example 1",
      keywords: ["energy", "conservation", "gravity", "potential", "kinetic"],
      content:
        "When only conservative forces (like gravity) act, **mechanical energy** is conserved:\n\nm·g·h + ½·m·v² = constant\n\n**Worked example**\n- A ball is dropped from rest at height h = 5 m. Find its speed just before hitting the ground.\n- At the top: potential energy m·g·h, kinetic energy 0.\n- At the ground: kinetic energy ½·m·v², potential energy 0.\n- m·g·h = ½·m·v²  →  v = √(2·g·h) = √(2 × 9.8 × 5) = √98 ≈ **9.9 m/s**.\n\n**Note**: the mass cancels, so the result is independent of mass.",
    },
  ];

  return {
    entries: entries,
    byId: function (id) {
      for (var i = 0; i < entries.length; i++) {
        if (entries[i].id === id) return entries[i];
      }
      return null;
    },
  };
});
