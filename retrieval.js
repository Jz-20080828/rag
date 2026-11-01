/* =====================================================================
 * CourseMate — Retrieval layer (TF-IDF + cosine similarity).
 *
 * Pure, dependency-free, and exported as UMD so the same code runs in
 * the browser and under Node (for the automated test script test.js).
 * ===================================================================== */
(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.Retrieval = factory();
  }
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  // Common English words that carry little retrieval signal.
  var STOPWORDS = new Set([
    "a", "an", "the", "and", "or", "but", "if", "then", "of", "to", "in", "on",
    "at", "by", "for", "with", "about", "as", "is", "are", "was", "were", "be",
    "been", "being", "do", "does", "did", "have", "has", "had", "it", "its",
    "this", "that", "these", "those", "i", "you", "he", "she", "we", "they",
    "me", "my", "your", "our", "their", "what", "which", "who", "whom", "how",
    "when", "where", "why", "can", "could", "should", "would", "will", "shall",
    "may", "might", "must", "not", "no", "so", "such", "there", "here", "from",
    "into", "onto", "than", "also", "very", "just", "only", "more", "most",
    "some", "any", "all", "each", "every", "both", "between", "because",
  ]);

  // Normalise related surface forms to one canonical token so that e.g.
  // "differentiate", "derivative" and "differentiation" all match.
  var SYNONYMS = {
    derivative: "deriv", derivatives: "deriv", differentiate: "deriv",
    differentiation: "deriv", differentiating: "deriv",
    integral: "integr", integrals: "integr", integrate: "integr",
    integration: "integr", integrating: "integr",
    eigenvalue: "eigen", eigenvalues: "eigen", eigenvector: "eigen",
    eigenvectors: "eigen",
    multiply: "multipl", multiplication: "multipl", multiplying: "multipl",
    determinant: "determin", determinants: "determin",
    independent: "independ", independence: "independ",
    acceleration: "acceler", accelerates: "acceler", accelerate: "acceler",
    velocity: "veloc", velocities: "veloc",
  };

  function tokenize(text) {
    var tokens = String(text).toLowerCase().match(/[a-z0-9]+/g) || [];
    var out = [];
    for (var i = 0; i < tokens.length; i++) {
      var t = tokens[i];
      if (STOPWORDS.has(t)) continue;
      if (SYNONYMS[t]) t = SYNONYMS[t];
      else if (t.length > 3 && t.charAt(t.length - 1) === "s") t = t.slice(0, -1);
      out.push(t);
    }
    return out;
  }

  function freq(tokens) {
    var m = {};
    for (var i = 0; i < tokens.length; i++) {
      m[tokens[i]] = (m[tokens[i]] || 0) + 1;
    }
    return m;
  }

  // Builds the index from KB entries. Fields are weighted: the question /
  // topic / title / keywords identify a chunk, so they count more than the
  // body content.
  function buildIndex(entries) {
    var docs = [];
    var df = {};

    entries.forEach(function (entry) {
      var weighted = {};
      function add(text, weight) {
        var tf = freq(tokenize(text));
        for (var term in tf) {
          weighted[term] = (weighted[term] || 0) + tf[term] * weight;
        }
      }
      add(entry.question, 4);
      add(entry.topic, 3);
      add(entry.title, 3);
      add((entry.keywords || []).join(" "), 3);
      add(entry.content, 1);

      docs.push({ entry: entry, weighted: weighted });
      for (var term in weighted) {
        df[term] = (df[term] || 0) + 1;
      }
    });

    var N = docs.length;
    var idf = {};
    for (var term in df) {
      idf[term] = Math.log(N / (1 + df[term])) + 1;
    }

    // Pre-compute TF-IDF vectors and L2 norm for cosine similarity.
    docs.forEach(function (doc) {
      var vec = {};
      var normSq = 0;
      for (var term in doc.weighted) {
        var w = doc.weighted[term] * idf[term];
        vec[term] = w;
        normSq += w * w;
      }
      doc.vec = vec;
      doc.norm = Math.sqrt(normSq);
    });

    return { docs: docs, idf: idf };
  }

  function indexEntries(entries) {
    var idx = buildIndex(entries);
    return function search(query, k) {
      k = k || 3;
      var qtf = freq(tokenize(query));
      var qvec = {};
      var qnormSq = 0;
      for (var term in qtf) {
        if (!idx.idf[term]) continue; // term never seen in corpus
        var w = qtf[term] * idx.idf[term];
        qvec[term] = w;
        qnormSq += w * w;
      }
      var qnorm = Math.sqrt(qnormSq);
      if (qnorm === 0) return [];

      var scored = idx.docs.map(function (doc) {
        var dot = 0;
        for (var term in qvec) {
          if (doc.vec[term]) dot += qvec[term] * doc.vec[term];
        }
        return {
          entry: doc.entry,
          score: dot / (qnorm * doc.norm),
        };
      });

      scored.sort(function (a, b) { return b.score - a.score; });
      return scored.slice(0, k);
    };
  }

  return {
    tokenize: tokenize,
    indexEntries: indexEntries,
  };
});
