'use client';

import { useState } from 'react';
import { Sighting } from '../types/sighting';

interface SightingsTableProps {
  sightings: Sighting[];
}

export default function SightingsTable({ sightings }: SightingsTableProps) {
  const [filter, setFilter] = useState({
    city: '',
    state: '',
    apparitionTag: '',
    timeOfDay: '',
  });

  const filteredSightings = sightings.filter((sighting) => {
    return (
      (!filter.city || sighting.city.toLowerCase().includes(filter.city.toLowerCase())) &&
      (!filter.state || sighting.state.toLowerCase().includes(filter.state.toLowerCase())) &&
      (!filter.apparitionTag || sighting.apparitionTag.toLowerCase().includes(filter.apparitionTag.toLowerCase())) &&
      (!filter.timeOfDay || sighting.timeOfDay.toLowerCase().includes(filter.timeOfDay.toLowerCase()))
    );
  });

  const uniqueTags = Array.from(new Set(sightings.map(s => s.apparitionTag))).filter(Boolean);
  const uniqueTimeOfDay = Array.from(new Set(sightings.map(s => s.timeOfDay))).filter(Boolean);

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <h2 className="text-3xl font-bold text-[#F8F8F8] mb-6 text-center">Sightings Table</h2>
      
      {/* Filter Control Panel */}
      <div className="bg-gray-800 rounded-lg p-4 mb-6">
        <h3 className="text-xl font-semibold text-[#F8F8F8] mb-4">Filter Control Panel</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm text-[#F8F8F8] mb-1">City</label>
            <input
              type="text"
              value={filter.city}
              onChange={(e) => setFilter({ ...filter, city: e.target.value })}
              placeholder="Filter by city"
              className="w-full px-3 py-2 bg-gray-700 text-[#F8F8F8] rounded border border-gray-600 focus:border-[#FF9F40] focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm text-[#F8F8F8] mb-1">State</label>
            <input
              type="text"
              value={filter.state}
              onChange={(e) => setFilter({ ...filter, state: e.target.value })}
              placeholder="Filter by state"
              className="w-full px-3 py-2 bg-gray-700 text-[#F8F8F8] rounded border border-gray-600 focus:border-[#FF9F40] focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm text-[#F8F8F8] mb-1">Apparition Type</label>
            <select
              value={filter.apparitionTag}
              onChange={(e) => setFilter({ ...filter, apparitionTag: e.target.value })}
              className="w-full px-3 py-2 bg-gray-700 text-[#F8F8F8] rounded border border-gray-600 focus:border-[#FF9F40] focus:outline-none"
            >
              <option value="">All Types</option>
              {uniqueTags.map(tag => (
                <option key={tag} value={tag}>{tag}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-[#F8F8F8] mb-1">Time of Day</label>
            <select
              value={filter.timeOfDay}
              onChange={(e) => setFilter({ ...filter, timeOfDay: e.target.value })}
              className="w-full px-3 py-2 bg-gray-700 text-[#F8F8F8] rounded border border-gray-600 focus:border-[#FF9F40] focus:outline-none"
            >
              <option value="">All Times</option>
              {uniqueTimeOfDay.map(time => (
                <option key={time} value={time}>{time}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Table Display */}
      <div className="bg-[#F8F8F8] rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-800 text-[#F8F8F8]">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold">Date</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Time</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Type</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">City</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">State</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredSightings.map((sighting) => (
                <tr key={sighting.id} className="hover:bg-gray-100">
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {new Date(sighting.date).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">{sighting.timeOfDay}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{sighting.apparitionTag}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{sighting.city}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{sighting.state}</td>
                  <td className="px-4 py-3 text-sm text-gray-700 max-w-xs truncate">
                    {sighting.notes}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredSightings.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            No sightings match the current filters.
          </div>
        )}
      </div>
    </div>
  );
}

