/* Automated retrieval test — run with:  node test.js
 * Verifies that each sample query retrieves the correct chunk, and that an
 * out-of-scope query scores low enough to trigger refusal. */
"use strict";

const KB = require("./knowledge-base.js");
const Retrieval = require("./retrieval.js");

const search = Retrieval.indexEntries(KB.entries);

const cases = [
  {
    name: "chain rule → calc-chain-rule",
    query: "How do I apply the chain rule to differentiate sin(x²)?",
    expected: "calc-chain-rule",
  },
  {
    name: "eigenvalues → la-eigen",
    query: "Find the eigenvalues and eigenvectors of the matrix [[2,1],[1,2]].",
    expected: "la-eigen",
  },
  {
    name: "Newton's law → phys-newton",
    query: "A 10 kg box is pushed so it accelerates at 2 m/s². What force is applied?",
    expected: "phys-newton",
  },
  {
    name: "integration by parts → calc-ibp",
    query: "How do I integrate x e^x dx?",
    expected: "calc-ibp",
  },
  {
    name: "linear independence → la-independence",
    query: "What does it mean for vectors to be linearly independent?",
    expected: "la-independence",
  },
  {
    name: "implicit differentiation → calc-implicit",
    query: "How do I find dy/dx for x² + y² = 25?",
    expected: "calc-implicit",
  },
  {
    name: "out of scope (restaurant) → refuse",
    query: "What is the best restaurant near campus?",
    expected: null, // no confident match
  },
  {
    name: "out of scope (weather) → refuse",
    query: "Will it rain tomorrow?",
    expected: null,
  },
];

let failures = 0;
for (const c of cases) {
  const top = search(c.query, 3);
  const best = top[0];
  const topId = best ? best.entry.id : null;
  const bestScore = best ? best.score : 0;
  const ok = c.expected === null ? bestScore < 0.08 : topId === c.expected;
  if (!ok) failures++;
  console.log(
    (ok ? "PASS" : "FAIL") +
      `  ${c.name}` +
      `  →  got=${topId}` +
      (best ? ` (score ${best.score.toFixed(3)})` : "") +
      (ok ? "" : `  expected=${c.expected}`)
  );
  // print runner-up scores for tuning / inspection
  top.forEach((r, i) =>
    console.log(`       #${i + 1} ${r.entry.id.padEnd(20)} ${r.score.toFixed(3)}`)
  );
}

console.log(`\n${cases.length - failures}/${cases.length} cases passed.`);
process.exit(failures === 0 ? 0 : 1);
