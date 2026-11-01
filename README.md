# CourseMate — Undergraduate Course Q&A RAG Chatbot

A retrieval-augmented generation (RAG) prototype for freshmen course questions. It answers
**only** from a curated knowledge base of course materials, cites its source on every answer,
and explicitly refuses out-of-scope questions instead of guessing.

- **No API key required** — retrieval and answer composition run entirely in the browser.
- **Self-contained static site** — no server, no database, nothing to install.

## Files

| File | Purpose |
|------|---------|
| `index.html` | UI |
| `styles.css` | Styling |
| `knowledge-base.js` | The grounded knowledge base (12 chunks across Calculus, Linear Algebra, Mechanics) |
| `retrieval.js` | TF-IDF + cosine-similarity retrieval layer |
| `app.js` | Chat UI, answer rendering, refusal logic |
| `test.js` | Automated retrieval test — `node test.js` |
| `TEST_LOG.md` | Release test log |
| `SAMPLE_QUERIES.md` | Questions reviewers should try first |

## Run locally

Just open `index.html` in a browser (double-click it), or:

```bash
python -m http.server 8000
# then open http://localhost:8000
```

Run the automated test:

```bash
node test.js
```

## Get a public demo link (for reviewers)

The site is static, so any static host works. Two quick options:

**Option A — GitHub Pages (free, permanent):**
1. Create a new public repository on github.com (e.g. `course-rag-chatbot`).
2. Push this folder to it:
   ```bash
   git init
   git add .
   git commit -m "CourseMate RAG prototype"
   git branch -M main
   git remote add origin https://github.com/<you>/course-rag-chatbot.git
   git push -u origin main
   ```
3. In the repo: **Settings → Pages → Source: Deploy from a branch → main → / (root) → Save**.
4. Your link is `https://<you>.github.io/course-rag-chatbot/` (live in ~1 minute).

**Option B — Vercel / Netlify (free, drag-and-drop):**
1. Go to vercel.com or netlify.com and sign in with GitHub.
2. Drag this folder onto the "New project" drop zone, or import the repo.
3. You get a `https://….vercel.app` link immediately.

## How it works

1. **Retrieve** — the query is tokenised (with stop-word removal and synonym normalisation)
   and scored against every knowledge-base chunk using TF-IDF + cosine similarity.
2. **Ground** — the top chunk is rendered as the answer with its citation; the top three are
   shown in the "Retrieved sources" panel.
3. **Refuse** — if the best score is below a confidence threshold, the assistant declines and
   suggests in-scope topics.

## Extending the knowledge base

Add an entry to the `entries` array in `knowledge-base.js`:

```js
{
  id: "my-topic",
  course: "MATH101 · Calculus I",
  topic: "Topic name",
  type: "concept",            // or "worked-example"
  title: "Question title",
  question: "How do I …?",    // used to help retrieval rank this chunk
  source: "Lecture Notes, Week N, slide M",
  keywords: ["term", "term2"],
  content: "The answer, written as markdown (**bold**, - lists, 1. steps).",
}
```
