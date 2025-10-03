# Builder Studio (GitHub-powered mini Replit)

**Panels:** Chat (stub), Monaco editor, Logs, Preview slot.  
**Backplane:** GitHub Actions `workflow_dispatch` with `exec.yml`.

## Setup

- Deploy to Vercel, Cloud Run, or run locally.
- Set env vars:
  - `GITHUB_TOKEN` (fine-grained PAT with repo + actions:read on your repo)
  - `GITHUB_OWNER`
  - `GITHUB_REPO`
  - `GITHUB_WORKFLOW` (default `exec.yml`)

## Deployment

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
