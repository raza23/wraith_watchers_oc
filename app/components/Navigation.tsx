'use client';

export default function Navigation() {
  return (
    <nav className="bg-black border-b border-gray-800 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">👻</span>
          <h1 className="text-2xl font-bold text-[#F8F8F8] tracking-tight">
            WraithWatchers
          </h1>
        </div>
        <div className="flex gap-4">
          <button className="px-4 py-2 bg-[#FF9F40] text-black rounded-lg font-medium hover:bg-[#FF8F30] transition-colors">
            Sightings Map
          </button>
          <button className="px-4 py-2 bg-gray-800 text-[#F8F8F8] rounded-lg font-medium hover:bg-gray-700 transition-colors">
            Post a Sighting
          </button>
        </div>
      </div>
    </nav>
  );
}

