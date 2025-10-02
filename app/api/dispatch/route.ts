import { NextRequest, NextResponse } from 'next/server';
import { Octokit } from 'octokit';

export async function POST(request: NextRequest) {
  try {
    const { action } = await request.json();

    if (!action || !['scaffold', 'build'].includes(action)) {
      return NextResponse.json(
        { error: 'Invalid action. Must be "scaffold" or "build"' },
        { status: 400 }
      );
    }

    const token = process.env.GITHUB_TOKEN;
    const owner = process.env.GITHUB_OWNER;
    const repo = process.env.GITHUB_REPO;

    if (!token || !owner || !repo) {
      return NextResponse.json(
        { error: 'Missing GitHub configuration. Check environment variables.' },
        { status: 500 }
      );
    }

    const octokit = new Octokit({ auth: token });

    // Dispatch workflow_dispatch event
    await octokit.rest.actions.createWorkflowDispatch({
      owner,
      repo,
      workflow_id: 'exec.yml',
      ref: 'main',
      inputs: {
        action,
      },
    });

    // Get the most recent workflow run (this is a simplified approach)
    // In production, you'd want to poll for the specific run ID
    const runs = await octokit.rest.actions.listWorkflowRuns({
      owner,
      repo,
      workflow_id: 'exec.yml',
      per_page: 1,
    });

    const runId = runs.data.workflow_runs[0]?.id?.toString();

    return NextResponse.json({
      success: true,
      action,
      runId,
      message: `Workflow dispatched for action: ${action}`,
    });
  } catch (error) {
    console.error('Error dispatching workflow:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to dispatch workflow';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
