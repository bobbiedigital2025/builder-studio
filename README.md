# Builder Studio (GitHub-powered mini Replit)

**Panels:** Chat (stub), Monaco editor, Logs, Preview slot.  
**Backplane:** GitHub Actions `workflow_dispatch` with `exec.yml`.

## Setup
- Deploy to Vercel or run locally.
- Set env vars:
  - `GITHUB_TOKEN` (fine-grained PAT with repo + actions:read on your repo)
  - `GITHUB_OWNER`
  - `GITHUB_REPO`
  - `GITHUB_WORKFLOW` (default `exec.yml`)

## What it does
- **Scaffold React** → dispatches workflow with mode=scaffold; opens a PR.
- **Build** → runs `npm i && npm run build` in the chosen path; logs stream into the UI (polled).
- **Preview** → recommend connecting repo to Vercel for PR previews; surface links.

## Notes
- This is a minimal MVP so you can extend it with:
  - Real agent (connect OpenAI or a local LLM) to propose edits and commit via GitHub API.
  - Command palette for CI tasks, DB migrations, or env sync.
  - Databases: use Supabase; store keys as repo secrets or Vercel envs.

© 2025 Bobbie Digital
