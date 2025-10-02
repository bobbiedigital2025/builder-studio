'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Editor from '@/components/Editor';
import Logs from '@/components/Logs';
import Preview from '@/components/Preview';

export default function Home() {
  const [workflowRunId, setWorkflowRunId] = useState<string>();

  const handleAction = async (action: 'scaffold' | 'build' | 'chat') => {
    if (action === 'chat') {
      alert('Chat feature is a stub - wire it to your LLM later!');
      return;
    }

    try {
      const response = await fetch('/api/dispatch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });

      if (response.ok) {
        const data = await response.json();
        setWorkflowRunId(data.runId);
      } else {
        alert(`Failed to trigger ${action}`);
      }
    } catch (error) {
      alert(`Error: ${error}`);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar onAction={handleAction} />
      
      {/* Main content area */}
      <div className="flex-1 flex flex-col">
        {/* Editor */}
        <div className="flex-1">
          <Editor />
        </div>
        
        {/* Bottom panels */}
        <div className="grid grid-cols-2 gap-0 border-t border-gray-300">
          <Logs workflowRunId={workflowRunId} />
          <Preview />
        </div>
      </div>
    </div>
  );
}
