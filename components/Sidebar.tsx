'use client';

interface SidebarProps {
  onAction: (action: 'scaffold' | 'build' | 'chat') => void;
}

export default function Sidebar({ onAction }: SidebarProps) {
  return (
    <div className="w-64 bg-gray-900 text-white p-4 flex flex-col gap-4">
      <h1 className="text-xl font-bold mb-4">Builder Studio</h1>
      <button
        onClick={() => onAction('scaffold')}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition-colors"
      >
        Scaffold React
      </button>
      <button
        onClick={() => onAction('build')}
        className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded transition-colors"
      >
        Build
      </button>
      <button
        onClick={() => onAction('chat')}
        className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded transition-colors"
      >
        Chat (stub)
      </button>
      <div className="mt-auto text-xs text-gray-400">
        <p>GitHub-powered mini Replit</p>
      </div>
    </div>
  );
}
