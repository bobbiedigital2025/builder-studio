import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import 'isomorphic-fetch';
import Head from 'next/head';

const Monaco = dynamic(() => import('../lib/Monaco'), { ssr: false });

type RunResponse = { run_id?: number; url?: string; error?: string };
type LogsResponse = { logs?: string; url?: string; error?: string };

export default function Home() {
  const [chat, setChat] = useState<string[]>([
    "Welcome to Builder Studio!",
    "Type code in the editor. Click 'Scaffold React' to create a template.",
    "Click 'Build' to run the GitHub Actions workflow. Logs will appear below.",
  ]);
  const [input, setInput] = useState('');
  const [content, setContent] = useState(`// Hello, Bobbie!\n// This is your app workspace. Save to /app/src/main.tsx etc.\n`);
  const [runId, setRunId] = useState<number | null>(null);
  const [logs, setLogs] = useState<string>('(no logs yet)');
  const [previewUrl, setPreviewUrl] = useState<string>('');

  useEffect(() => {
    let t: any;
    const poll = async () => {
      try {
        const r = await fetch(`/api/logs`);
        const data: LogsResponse = await r.json();
        if (data.logs) setLogs(data.logs);
        if (data.url) setPreviewUrl(data.url);
      } catch {}
      t = setTimeout(poll, 5000);
    };
    poll();
    return () => clearTimeout(t);
  }, []);

  const pushChat = (line: string) => setChat((c) => [...c, line]);

  async function trigger(action: string, payload: any = {}) {
    pushChat(`> ${action}…`);
    const r = await fetch('/api/dispatch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, payload }),
    });
    const data: RunResponse = await r.json();
    if (data.error) {
      pushChat(`❌ ${data.error}`);
      return;
    }
    if (data.url) pushChat(`🔗 workflow: ${data.url}`);
  }

  async function scaffoldReact() {
    await trigger('scaffold', {
      name: 'bodigi-react',
      template: 'vitejs/vite/packages/create-vite/template-react-ts',
      path: 'apps/bodigi-react'
    });
  }

  async function build() {
    await trigger('build', { path: 'apps/bodigi-react' });
  }

  async function preview() {
    pushChat('If Vercel is linked, a PR will have a preview URL. Open the PR to view it.');
  }

  return (
    <>
      <Head>
        <title>Builder Studio</title>
        <link rel=\"stylesheet\" href=\"/styles.css\" />
      </Head>
      <div className=\"app\">
        <div className=\"header\">
          <div><strong>Builder Studio</strong> <span className=\"small\">— GitHub-powered dev agent</span></div>
          <div className=\"small\">Repo: <code>{process.env.NEXT_PUBLIC_OWNER}/{process.env.NEXT_PUBLIC_REPO}</code></div>
        </div>

        <aside className=\"sidebar\">
          <button onClick={scaffoldReact} className=\"primary\">Scaffold React</button>
          <button onClick={build}>Build</button>
          <button onClick={preview}>Preview</button>
          <div className=\"small\">These trigger a GitHub Actions workflow in your repo.</div>
          <hr style={{borderColor:'#1b2340'}}/>
          <div className=\"small\">Chat (stubbed):</div>
          <div style={{flex:1, overflow:'auto', border:'1px solid #1b2340', borderRadius:8, padding:8}}>
            {chat.map((line, i) => <div key={i}>{line}</div>)}
          </div>
          <div style={{display:'flex', gap:8, marginTop:8}}>
            <input value={input} onChange={e=>setInput(e.target.value)} placeholder=\"(stub) Ask agent…\" style={{flex:1}}/>
            <button onClick={()=>{ if(input) { setChat(c=>[...c, input]); setInput(''); }}}>Send</button>
          </div>
          <p className=\"small\">Hook this to your preferred LLM later.</p>
        </aside>

        <main className=\"main\">
          <div className=\"editor\">
            <Monaco value={content} onChange={setContent}/>
          </div>
          <div className=\"right\">
            <div className=\"chat\">
              <strong>Agent Feed</strong>
              <p className=\"small\">This will mirror issue/PR comments from the agent bot.</p>
              {chat.map((line, i) => <div key={i}>{line}</div>)}
            </div>
            <div className=\"logs\">
              <strong>Runner Logs</strong>
              <div className=\"small\">Polling latest workflow logs…</div>
              <pre style={{whiteSpace:'pre-wrap'}}>{logs}</pre>
            </div>
          </div>
        </main>

        <div className=\"footer\">
          <div className=\"small\">Preview URL: {previewUrl ? <a className=\"link\" href={previewUrl} target=\"_blank\" rel=\"noreferrer\">{previewUrl}</a> : '— (enable Vercel PR previews)'}</div>
        </div>
      </div>
    </>
  );
}
