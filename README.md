# Application Review Agent

A small AI agent that reviews job applications for a Customer Support Specialist role.
Built with TypeScript, Node.js and the Gemini API (function calling, model `gemini-3.5-flash`).
I used Gemini because it has a free API tier. The model is only used in `src/agent.ts`, so switching to Claude or another LLM only changes that file.

## How to run

You need Node.js 20+ and a free Gemini API key from https://aistudio.google.com/apikey

```bash
npm install
```

Set the API key:

```bash
# Windows PowerShell
$env:GEMINI_API_KEY="your-key"
# macOS / Linux
export GEMINI_API_KEY=your-key
```

Run the agent on the 3 sample applications:

```bash
npm start
```

Then check what is waiting for a human and approve or deny it:

```bash
npm run review
npm run review -- B approve "No support experience"
```

The results of my run are in the `sample-output` folder.

## How it works

1. The applications are read from `data/applications.json`.
2. Before calling the model, a simple regex check looks for text like "ignore your rubric" or "system note".
3. The application is sent to Gemini inside `<application>` tags, together with the rubric and three tools: `advance_to_interview`, `request_more_info` and `reject`.
4. The model has to call one tool with a score, a score breakdown per criterion, a one-line reason and any red flags.
5. My code validates the tool call before saving anything. If it's invalid, the error goes back to the model to fix it (max 4 tries).
6. Every step is written to `logs/audit-log.jsonl`, and the decisions are saved in `data/decisions.json`.

## Scoring

| Criterion | Max |
|---|---|
| Customer support experience | 35 |
| Numbers (tickets/day, CSAT...) | 15 |
| Helpdesk tools (Zendesk...) | 15 |
| Languages / communication | 15 |
| Availability | 10 |
| Motivation | 10 |

- **70 or more:** advance to interview
- **Below 70 with missing information:** request more info
- **Below 40 and not a fit:** reject (needs human approval)

## How I stop it from doing something wrong

- **Rejections wait for a human.** The `reject` tool only saves the status `pending_human_approval`. Only `npm run review` can change it to `rejected`.
- **Application text is data, not instructions.** It's escaped and put inside tags, and the prompt says anything inside is just candidate information.
- **The score has to add up.** The model must give points for each criterion, and my code checks every value is within its limit and the total matches. It can't just say "100".
- **The action must match the score.** Advancing needs 70+ and rejecting needs below 40. Anything else is sent back as an error.
- **Suspicious applications are never advanced automatically.** If the regex check or the model finds manipulation, an advance goes to human review instead.
- **If the API is busy** (common on the free tier), it waits and retries up to 6 times.
- **If something fails,** the application goes to human review, never to an automatic decision.

## What I would add next

- A small web page for approvals instead of the CLI
- A database instead of JSON files, and real emails for "request more info"
- More test applications, especially other injection tricks, run on every change
- Remove names and personal details before scoring to reduce bias
- Read real CVs (PDF)
