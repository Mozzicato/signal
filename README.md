# Signal

Signal is an evidence ledger for uncertain situations. It separates direct observations from hearsay, groups related claims, surfaces contradictions, and shows what evidence would change an assessment.

## Run locally

Requirements: Node.js 18+.

```powershell
npm start
```

Open `http://localhost:3000`.

Load the Oke Road scenario, add reports, then run analysis. The analysis route uses Groq when `GROQ_API_KEY` is configured and falls back to a local evidence heuristic when it is not.

Create `.env` from `.env.example`:

```env
GROQ_API_KEY=your-groq-api-key
GROQ_MODEL=llama-3.3-70b-versatile
```

The key is used only server-side by `/api/analyze` and is never sent to the browser.

## Vercel deployment

1. Import this repository into [Vercel](https://vercel.com/new).
2. Add `GROQ_API_KEY` in the project Environment Variables.
3. Optionally add `GROQ_MODEL`.
4. Deploy with the default settings.

Routes:

- `/` serves the situation room.
- `POST /api/analyze` performs structured analysis.
- `GET /api/reports` returns report data.

The serverless store is intentionally lightweight for this prototype. Add persistent storage before using Signal with real incident data.

## Product principles

- Evidence is not certainty.
- Message volume is not source independence.
- Contradictions are shown, not hidden.
- Every assessment should trace back to reports.
- Signal should explain what evidence would change its current view.
