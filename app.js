/* =====================================================================
 * CourseMate — UI wiring. Loads after knowledge-base.js and retrieval.js.
 * ===================================================================== */
(function () {
  "use strict";

  // Below this cosine-similarity score the query is treated as out of
  // scope and the assistant refuses instead of guessing.
  var REFUSAL_THRESHOLD = 0.08;

  var search = null;

  var SAMPLE_QUERIES = [
    "How do I apply the chain rule to differentiate sin(x²)?",
    "Find the eigenvalues and eigenvectors of the matrix [[2,1],[1,2]].",
    "A 10 kg box accelerates at 2 m/s². What force acts on it?",
    "How do I integrate x·eˣ dx?",
  ];

  /* ----------------------------- tiny markdown ---------------------------- */
  function esc(s) {
    return s
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function inline(text) {
    return esc(text)
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.+?)\*/g, "<em>$1</em>")
      .replace(/`(.+?)`/g, "<code>$1</code>");
  }

  function renderMarkdown(md) {
    var lines = md.split("\n");
    var html = "";
    var listType = null; // "ul" | "ol"

    function closeList() {
      if (listType) {
        html += "</" + listType + ">";
        listType = null;
      }
    }

    for (var i = 0; i < lines.length; i++) {
      var line = lines[i];

      if (/^\s*$/.test(line)) {
        closeList();
        continue;
      }
      var h = line.match(/^##\s+(.*)/);
      if (h) {
        closeList();
        html += "<h4>" + inline(h[1]) + "</h4>";
        continue;
      }
      var ul = line.match(/^-\s+(.*)/);
      if (ul) {
        if (listType !== "ul") {
          closeList();
          html += "<ul>";
          listType = "ul";
        }
        html += "<li>" + inline(ul[1]) + "</li>";
        continue;
      }
      var ol = line.match(/^\d+\.\s+(.*)/);
      if (ol) {
        if (listType !== "ol") {
          closeList();
          html += "<ol>";
          listType = "ol";
        }
        html += "<li>" + inline(ol[1]) + "</li>";
        continue;
      }
      closeList();
      html += "<p>" + inline(line) + "</p>";
    }
    closeList();
    return html;
  }

  /* ------------------------------- rendering ------------------------------ */
  function el(id) {
    return document.getElementById(id);
  }

  function addBubble(role, html) {
    var wrap = document.createElement("div");
    wrap.className = "msg " + role;
    var body = document.createElement("div");
    body.className = "bubble";
    body.innerHTML = html;
    wrap.appendChild(body);
    el("chat").appendChild(wrap);
    el("chat").scrollTop = el("chat").scrollHeight;
    return body;
  }

  function renderSources(results) {
    var box = el("sources");
    box.innerHTML = "";
    results.forEach(function (r, i) {
      var item = document.createElement("div");
      item.className = "source-item";
      var pct = Math.round(r.score * 100);
      item.innerHTML =
        '<span class="src-rank">' + (i + 1) + "</span>" +
        '<span class="src-body"><strong>' + esc(r.entry.topic) + "</strong>" +
        '<span class="src-course">' + esc(r.entry.course) + "</span></span>" +
        '<span class="src-score">' + pct + "%</span>";
      box.appendChild(item);
    });
  }

  function refuseAnswer() {
    addBubble(
      "assistant",
      '<div class="refusal"><strong>I can’t answer that from my course materials.</strong>' +
        "<p>This question appears to be outside the knowledge base, so I won’t guess. " +
        "Try asking about a course topic, for example:</p>" +
        "<ul>" +
        SAMPLE_QUERIES.map(function (q) { return "<li>" + esc(q) + "</li>"; }).join("") +
        "</ul></div>"
    );
    el("sources").innerHTML =
      '<p class="src-empty">No source matched with enough confidence.</p>';
  }

  function answer(query) {
    var results = search(query, 3);
    var best = results[0];

    addBubble("user", "<p>" + esc(query) + "</p>");

    if (!best || best.score < REFUSAL_THRESHOLD) {
      refuseAnswer();
      return;
    }

    var entry = best.entry;
    var body =
      '<div class="answer">' +
      '<div class="answer-title">' + esc(entry.title) + "</div>" +
      renderMarkdown(entry.content) +
      '<div class="cite">📚 Source: ' + esc(entry.source) + "</div>" +
      "</div>";
    addBubble("assistant", body);
    renderSources(results);
  }

  /* --------------------------------- init -------------------------------- */
  function init() {
    search = Retrieval.indexEntries(KB.entries);

    var chips = el("chips");
    SAMPLE_QUERIES.forEach(function (q) {
      var b = document.createElement("button");
      b.className = "chip";
      b.textContent = q;
      b.addEventListener("click", function () {
        el("input").value = q;
        answer(q);
      });
      chips.appendChild(b);
    });

    el("form").addEventListener("submit", function (e) {
      e.preventDefault();
      var q = el("input").value.trim();
      if (!q) return;
      el("input").value = "";
      answer(q);
    });

    // Welcome message so reviewers immediately see what the system does.
    addBubble(
      "assistant",
      "<p>Hi! I’m <strong>CourseMate</strong>, a retrieval-augmented assistant grounded in " +
        "undergraduate course materials (Calculus, Linear Algebra, Mechanics). Ask me a course " +
        "question and I’ll answer only from those sources — with a citation — or tell you if I can’t.</p>"
    );
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
