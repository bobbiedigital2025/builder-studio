'use client';

export default function Preview() {
  return (
    <div className="h-64 bg-white border border-gray-300">
      <div className="bg-gray-200 px-4 py-2 text-gray-800 text-sm font-semibold border-b border-gray-300">
        Preview Slot
      </div>
      <div className="p-4 text-gray-600">
        <p>Preview panel ready.</p>
        <p className="text-sm mt-2">
          App previews and PR links will appear here.
        </p>
      </div>
    </div>
  );
}
