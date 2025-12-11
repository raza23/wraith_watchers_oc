'use client';

interface StatsProps {
  total: number;
  daysAgo: number;
  mostGhostlyCity: string;
}

export default function SightingsStats({ total, daysAgo, mostGhostlyCity }: StatsProps) {
  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <h2 className="text-3xl font-bold text-[#F8F8F8] mb-6 text-center">Sightings Stats</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#F8F8F8] rounded-lg p-6 text-center shadow-lg">
          <div className="text-4xl font-bold text-black mb-2">{total.toLocaleString()}</div>
          <div className="text-gray-700 font-medium">Total Sightings</div>
        </div>
        <div className="bg-[#F8F8F8] rounded-lg p-6 text-center shadow-lg">
          <div className="text-4xl font-bold text-black mb-2">{daysAgo}</div>
          <div className="text-gray-700 font-medium">
            {daysAgo === 1 ? 'Day' : 'Days'} Ago
          </div>
          <div className="text-sm text-gray-600 mt-1">Most Recent Sighting</div>
        </div>
        <div className="bg-[#F8F8F8] rounded-lg p-6 text-center shadow-lg">
          <div className="text-2xl font-bold text-black mb-2">{mostGhostlyCity}</div>
          <div className="text-gray-700 font-medium">Most Ghostly City</div>
        </div>
      </div>
    </div>
  );
}

