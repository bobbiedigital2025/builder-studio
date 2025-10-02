import { useEffect, useRef } from 'react';
import * as monaco from 'monaco-editor';

export default function Monaco({ value, onChange }: { value: string; onChange: (v: string)=>void }) {
  const ref = useRef<HTMLDivElement>(null);
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    editorRef.current = monaco.editor.create(ref.current, {
      value,
      language: 'typescript',
      theme: 'vs-dark',
      automaticLayout: true,
      minimap: { enabled: false }
    });
    const sub = editorRef.current.onDidChangeModelContent(() => {
      onChange(editorRef.current!.getValue());
    });
    return () => { sub.dispose(); editorRef.current?.dispose(); };
  }, []);

  return <div style={{height:'100%', width:'100%'}} ref={ref} />;
}
