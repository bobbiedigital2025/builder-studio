import type { NextApiRequest, NextApiResponse } from 'next';

const token = process.env.GITHUB_TOKEN!;
const owner = process.env.GITHUB_OWNER!;
const repo  = process.env.GITHUB_REPO!;
const workflow = process.env.GITHUB_WORKFLOW || 'exec.yml';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { action, payload } = req.body || {};
    const inputs: Record<string,string> = {};
    if (action === 'scaffold') {
      inputs.mode = 'scaffold';
      inputs.name = payload?.name || 'my-app';
      inputs.template = payload?.template || 'withastro/astro/examples/blog';
      inputs.path = payload?.path || `apps/${inputs.name}`;
    } else if (action === 'build') {
      inputs.mode = 'build';
      inputs.path = payload?.path || 'apps/my-app';
    } else {
      return res.status(400).json({ error: 'Unknown action' });
    }

    const r = await fetch(`https://api.github.com/repos/${owner}/${repo}/actions/workflows/${workflow}/dispatches`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/vnd.github+json' },
      body: JSON.stringify({ ref: 'main', inputs })
    });

    if (!r.ok) {
      const text = await r.text();
      return res.status(500).json({ error: `dispatch failed: ${r.status} ${text}` });
    }
    return res.status(200).json({ url: `https://github.com/${owner}/${repo}/actions` });
  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }
}
