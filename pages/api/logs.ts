import type { NextApiRequest, NextApiResponse } from 'next';

const token = process.env.GITHUB_TOKEN!;
const owner = process.env.GITHUB_OWNER!;
const repo  = process.env.GITHUB_REPO!;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const runs = await fetch(`https://api.github.com/repos/${owner}/${repo}/actions/runs?per_page=1`, {
      headers: { 'Authorization': `Bearer ${token}`, 'Accept':'application/vnd.github+json' }
    }).then(r => r.json());

    const run = runs?.workflow_runs?.[0];
    if (!run) return res.status(200).json({ logs: '(no runs yet)' });

    const jobs = await fetch(`https://api.github.com/repos/${owner}/${repo}/actions/runs/${run.id}/jobs`, {
      headers: { 'Authorization': `Bearer ${token}`, 'Accept':'application/vnd.github+json' }
    }).then(r => r.json());

    const job = jobs?.jobs?.[0];
    if (!job) return res.status(200).json({ logs: '(no jobs yet)' });

    const logResp = await fetch(`https://api.github.com/repos/${owner}/${repo}/actions/jobs/${job.id}/logs`, {
      headers: { 'Authorization': `Bearer ${token}`, 'Accept':'application/vnd.github+json' }
    });
    const text = await logResp.text();
    return res.status(200).json({ logs: text, url: run.html_url });
  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }
}
