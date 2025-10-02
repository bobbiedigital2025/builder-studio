'use client';

import { useEffect, useState } from 'react';

interface LogsProps {
  workflowRunId?: string;
}

export default function Logs({ workflowRunId }: LogsProps) {
  const [logs, setLogs] = useState<string[]>([
    'Ready to build...',
    'Click "Build" to start a workflow',
  ]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (workflowRunId) {
      fetchLogs(workflowRunId);
    }
  }, [workflowRunId]);

  const fetchLogs = async (runId: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/logs?runId=${runId}`);
      if (response.ok) {
        const data = await response.json();
        setLogs(data.logs || ['No logs available']);
      } else {
        setLogs(['Error fetching logs']);
      }
    } catch (error) {
      setLogs([`Error: ${error}`]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-64 bg-black text-green-400 p-4 overflow-auto font-mono text-sm">
      <div className="text-white font-semibold mb-2">GitHub Actions Logs</div>
      {loading && <div className="text-yellow-400">Loading logs...</div>}
      {logs.map((log, index) => (
        <div key={index} className="whitespace-pre-wrap">
          {log}
        </div>
      ))}
    </div>
  );
}
