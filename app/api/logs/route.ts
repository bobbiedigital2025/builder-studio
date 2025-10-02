import { NextRequest, NextResponse } from 'next/server';
import { Octokit } from 'octokit';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const runId = searchParams.get('runId');

    if (!runId) {
      return NextResponse.json(
        { error: 'Missing runId parameter' },
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

    // Get workflow run details
    const run = await octokit.rest.actions.getWorkflowRun({
      owner,
      repo,
      run_id: parseInt(runId),
    });

    // Get jobs for the workflow run
    const jobs = await octokit.rest.actions.listJobsForWorkflowRun({
      owner,
      repo,
      run_id: parseInt(runId),
    });

    // Format logs from job steps
    const logs: string[] = [
      `Workflow: ${run.data.name}`,
      `Status: ${run.data.status}`,
      `Conclusion: ${run.data.conclusion || 'N/A'}`,
      `Started: ${run.data.created_at}`,
      '',
      'Jobs:',
    ];

    jobs.data.jobs.forEach((job) => {
      logs.push(`  - ${job.name} (${job.status})`);
      if (job.steps) {
        job.steps.forEach((step) => {
          logs.push(`    → ${step.name}: ${step.status} ${step.conclusion ? `(${step.conclusion})` : ''}`);
        });
      }
    });

    return NextResponse.json({
      logs,
      status: run.data.status,
      conclusion: run.data.conclusion,
    });
  } catch (error) {
    console.error('Error fetching logs:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch logs';
    return NextResponse.json(
      { error: errorMessage, logs: [`Error: ${errorMessage}`] },
      { status: 500 }
    );
  }
}
