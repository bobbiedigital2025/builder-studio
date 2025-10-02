# Builder Studio

Builder Studio is a GitHub-powered mini Replit — a lightweight, web-based dev cockpit for shipping apps via GitHub Actions.

## Features

- **Chat Panel (Agent Slot)** — Stub ready to wire to your LLM later
- **Monaco Editor** — Quick edits in-browser with full TypeScript support
- **Runner Logs** — Watch GitHub Actions output like a console in real-time
- **Preview Slot** — Surface PR previews and deployment links

## Tech Stack

- **Next.js 14** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Monaco Editor** for code editing
- **GitHub Actions** for build execution
- **Octokit** for GitHub API integration

## Getting Started

### Prerequisites

- Node.js 20 or higher
- GitHub account with a personal access token
- GitHub repository with Actions enabled

### Setup with GitHub Codespaces

1. Click the "Code" button on this repository
2. Select "Codespaces" tab
3. Click "Create codespace on main"
4. Wait for the container to build (Node 20 environment)
5. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
6. Update `.env` with your GitHub credentials:
   - `GITHUB_TOKEN`: Create at https://github.com/settings/tokens/new with `repo` and `workflow` scopes
   - `GITHUB_OWNER`: Your GitHub username or organization
   - `GITHUB_REPO`: Repository name (e.g., `builder-studio`)

7. Start the development server:
   ```bash
   npm run dev
   ```
8. Open http://localhost:3000 in your browser

### Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/builder-studio.git
   cd builder-studio
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy `.env.example` to `.env` and configure:
   ```bash
   cp .env.example .env
   ```

4. Edit `.env` with your GitHub credentials (see Setup with GitHub Codespaces step 6)

5. Run the development server:
   ```bash
   npm run dev
   ```

6. Open http://localhost:3000

## Deployment to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/bobbiedigital2025/builder-studio)

1. Click the "Deploy" button above or go to [Vercel](https://vercel.com)
2. Import your GitHub repository
3. Add environment variables:
   - `GITHUB_TOKEN`
   - `GITHUB_OWNER`
   - `GITHUB_REPO`
4. Deploy!

### Environment Variables in Vercel

Go to your project settings → Environment Variables and add:

- `GITHUB_TOKEN`: Your GitHub Personal Access Token
- `GITHUB_OWNER`: Your GitHub username/org
- `GITHUB_REPO`: Repository name

## Usage

### Scaffold React

Click the "Scaffold React" button in the sidebar to trigger a GitHub Actions workflow that scaffolds a new React application using degit.

### Build

Click the "Build" button to trigger a build workflow that installs dependencies and builds your Next.js application.

### Chat (Stub)

This is a placeholder for future LLM integration. Wire it to your preferred AI service.

### Viewing Logs

After triggering a workflow, logs will appear in the bottom-left panel showing real-time GitHub Actions output.

## GitHub Actions Workflow

The `.github/workflows/exec.yml` file defines two actions:

- **scaffold**: Uses degit to scaffold a React template
- **build**: Runs `npm ci` and `npm run build`

Workflows are triggered via the GitHub API using workflow_dispatch events.

## Project Structure

```
builder-studio/
├── app/
│   ├── api/
│   │   ├── dispatch/route.ts    # Trigger GitHub workflows
│   │   └── logs/route.ts        # Fetch workflow logs
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Main application page
├── components/
│   ├── Sidebar.tsx              # Action buttons panel
│   ├── Editor.tsx               # Monaco code editor
│   ├── Logs.tsx                 # GitHub Actions logs viewer
│   └── Preview.tsx              # Preview panel
├── .devcontainer/
│   └── devcontainer.json        # Codespaces configuration
├── .github/
│   └── workflows/
│       └── exec.yml             # Build/scaffold workflow
├── .env.example                 # Environment variables template
└── README.md                    # This file
```

## API Routes

### POST /api/dispatch

Triggers a GitHub Actions workflow.

**Request Body:**
```json
{
  "action": "scaffold" | "build"
}
```

**Response:**
```json
{
  "success": true,
  "action": "build",
  "runId": "123456789",
  "message": "Workflow dispatched for action: build"
}
```

### GET /api/logs?runId={runId}

Fetches logs for a specific workflow run.

**Response:**
```json
{
  "logs": ["Line 1", "Line 2", ...],
  "status": "completed",
  "conclusion": "success"
}
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Editor powered by [Monaco Editor](https://microsoft.github.io/monaco-editor/)
- GitHub integration via [Octokit](https://github.com/octokit/octokit.js)
