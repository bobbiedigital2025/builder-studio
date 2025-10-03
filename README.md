# Builder Studio (GitHub-powered mini Replit)

**Panels:** Chat (stub), Monaco editor, Logs, Preview slot.  
**Backplane:** GitHub Actions `workflow_dispatch` with `exec.yml`.

## Setup

- Deploy to Vercel, Cloud Run, or run locally.
- Requirements:
  - Node.js 18.17+ and npm 10+
  - GitHub personal access token
  - Optional: OpenAI-compatible API key for the built-in Chat endpoint
- Set env vars:
  - `GITHUB_TOKEN`
    - Fine-grained PAT: enable “Actions: Read and write” and “Contents: Read and write” for this repo.
    - Classic PAT: include `repo` and `workflow` scopes.
  - `GITHUB_OWNER` (your GitHub username or org)
  - `GITHUB_REPO` (this repo name, e.g. `builder-studio`)
  - `GITHUB_WORKFLOW` (default `exec.yml`)
  - AI: `OPENAI_API_KEY` (and optional `AI_MODEL`, `OPENAI_API_URL`, `AI_SYSTEM_PROMPT`)

## Quickstart (local)

1) Copy env example and edit values

```bash
cp .env.local.example .env.local
# then edit .env.local (OPENAI_API_KEY, GITHUB_*, etc.)
```

2) Install and run dev server

```bash
npm ci
npm run dev
```

3) Open http://localhost:3000

- Sidebar buttons call `/api/dispatch` to trigger your GitHub Actions workflow.
- “Chat” calls `/api/chat` which proxies to your configured OpenAI-compatible API.

### AI integration

This repo now includes a simple AI chat endpoint at `pages/api/chat.ts` that talks to OpenAI's Chat Completions API by default.

- Copy `.env.local.example` to `.env.local` and set `OPENAI_API_KEY`.
- Optional: set `AI_MODEL` (default `gpt-4o-mini`) or point `OPENAI_API_URL` to an OpenAI-compatible server.
- The sidebar Chat input will call `/api/chat` and display the model's response.

### Environment variables reference

- Server-side (required for GitHub features):
  - `GITHUB_TOKEN` – token with permissions to dispatch workflows and read logs
  - `GITHUB_OWNER` – e.g. `your-username` or `your-org`
  - `GITHUB_REPO` – e.g. `builder-studio`
  - `GITHUB_WORKFLOW` – workflow filename (default `exec.yml`)
- Server-side (AI):
  - `OPENAI_API_KEY` – used by `/api/chat`
  - `AI_MODEL` – default `gpt-4o-mini`
  - `OPENAI_API_URL` – default `https://api.openai.com/v1/chat/completions`
  - `AI_SYSTEM_PROMPT` – optional system prompt string
- Client-side (display only):
  - `NEXT_PUBLIC_OWNER` – shown in the UI header
  - `NEXT_PUBLIC_REPO` – shown in the UI header

## Deployment

### Vercel (recommended for previews)

1) Import this repo into Vercel.
2) In Project Settings → Environment Variables, add the server-side vars listed above. Do NOT add secrets as `NEXT_PUBLIC_*`.
3) Deploy. Each PR will get a preview URL; you can surface and share those in the UI.

### Cloud Run

1. Install Google Cloud CLI: [https://cloud.google.com/sdk/docs/install](https://cloud.google.com/sdk/docs/install)
2. Install Docker: [https://docs.docker.com/get-docker/](https://docs.docker.com/get-docker/)
3. Authenticate: `gcloud auth login`
4. Set project: `gcloud config set project YOUR_PROJECT_ID`
5. Update `PROJECT_ID` in `deploy.sh`
6. Run `./deploy.sh` to build, push, and deploy

Or manually:

```bash
# Build and push image
docker build -t gcr.io/YOUR_PROJECT/builder-studio .
docker push gcr.io/YOUR_PROJECT/builder-studio

# Deploy
gcloud run deploy builder-studio \
  --image gcr.io/YOUR_PROJECT/builder-studio \
  --platform managed \
  --allow-unauthenticated \
  --port 8080
```

To pass AI env vars to Cloud Run, include `--set-env-vars` on deploy:

```bash
gcloud run deploy builder-studio \
  --image gcr.io/YOUR_PROJECT/builder-studio \
  --platform managed \
  --allow-unauthenticated \
  --port 8080 \
  --set-env-vars OPENAI_API_KEY=YOUR_KEY,AI_MODEL=gpt-4o-mini
```

### Docker (run locally)

Build and run the container using the provided `Dockerfile`:

```bash
docker build -t builder-studio:local .
docker run --rm -p 3000:3000 \
  --env-file ./.env.local \
  builder-studio:local
```

- The container runs `next start -p ${PORT:-3000}`; Cloud Run will set `PORT=8080`.

## What it does

- **Scaffold React** → dispatches workflow with mode=scaffold; opens a PR.
- **Build** → runs `npm i && npm run build` in the chosen path; logs stream into the UI (polled).
- **Preview** → recommend connecting repo to Vercel for PR previews; surface links.

## Notes

- This is a minimal MVP so you can extend it with:
  - Real agent (connect OpenAI or a local LLM) to propose edits and commit via GitHub API.
  - Command palette for CI tasks, DB migrations, or env sync.
  - Databases: use Supabase; store keys as repo secrets or Vercel envs.
- Do not expose server secrets with `NEXT_PUBLIC_*`.
- Requires Node 18.17+ (Next.js 14.2.x).

© 2025 Bobbie Digital
