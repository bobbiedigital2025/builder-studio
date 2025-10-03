import type { NextApiRequest, NextApiResponse } from 'next';

type ChatResponse = {
  text?: string;
  error?: string;
};

const OPENAI_API_URL = process.env.OPENAI_API_URL || 'https://api.openai.com/v1/chat/completions';
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const DEFAULT_MODEL = process.env.AI_MODEL || 'gpt-4o-mini';

export default async function handler(req: NextApiRequest, res: NextApiResponse<ChatResponse>) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  if (!OPENAI_API_KEY) {
    return res.status(500).json({ error: 'OPENAI_API_KEY is not configured on the server' });
  }

  try {
    const { prompt } = (req.body || {}) as { prompt?: string };
    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'Missing prompt' });
    }

    const system =
      process.env.AI_SYSTEM_PROMPT ||
      'You are the AI assistant inside Builder Studio. Be concise, actionable, and code-focused.';

    const payload = {
      model: DEFAULT_MODEL,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: prompt },
      ],
      temperature: 0.3,
    };

    const r = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify(payload),
    });

    if (!r.ok) {
      const errText = await r.text();
      return res
        .status(500)
        .json({ error: `Upstream error (${r.status}): ${errText.slice(0, 500)}` });
    }

    const data = (await r.json()) as any;
    const text = data?.choices?.[0]?.message?.content?.trim?.();
    if (!text) return res.status(500).json({ error: 'No content from model' });
    return res.status(200).json({ text });
  } catch (e: any) {
    return res.status(500).json({ error: e?.message || 'Unknown error' });
  }
}
