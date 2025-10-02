'use client';

import { Editor as MonacoEditor } from '@monaco-editor/react';
import { useState } from 'react';

export default function Editor() {
  const [code, setCode] = useState<string>(`// Welcome to Builder Studio
// Start editing your code here

function hello() {
  console.log("Hello, Builder Studio!");
}

hello();
`);

  return (
    <div className="flex-1 bg-gray-800">
      <div className="bg-gray-700 px-4 py-2 text-white text-sm font-semibold">
        Monaco Editor
      </div>
      <MonacoEditor
        height="calc(100vh - 40px)"
        defaultLanguage="javascript"
        theme="vs-dark"
        value={code}
        onChange={(value) => setCode(value || '')}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: 'on',
          scrollBeyondLastLine: false,
          automaticLayout: true,
        }}
      />
    </div>
  );
}
