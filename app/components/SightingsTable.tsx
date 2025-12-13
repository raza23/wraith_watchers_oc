'use client';

import { useState, useMemo } from 'react';
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
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;

  const filteredSightings = useMemo(() => {
    return sightings.filter((sighting) => {
      return (
        (!filter.city || sighting.city.toLowerCase().includes(filter.city.toLowerCase())) &&
        (!filter.state || sighting.state.toLowerCase().includes(filter.state.toLowerCase())) &&
        (!filter.apparitionTag || sighting.apparitionTag.toLowerCase().includes(filter.apparitionTag.toLowerCase())) &&
        (!filter.timeOfDay || sighting.timeOfDay.toLowerCase().includes(filter.timeOfDay.toLowerCase()))
      );
    });
  }, [sightings, filter]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredSightings.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentSightings = filteredSightings.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  const handleFilterChange = (newFilter: typeof filter) => {
    setFilter(newFilter);
    setCurrentPage(1);
  };

  const uniqueTags = useMemo(() => 
    Array.from(new Set(sightings.map(s => s.apparitionTag))).filter(Boolean),
    [sightings]
  );
  const uniqueTimeOfDay = useMemo(() =>
    Array.from(new Set(sightings.map(s => s.timeOfDay))).filter(Boolean),
    [sightings]
  );

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

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
              onChange={(e) => handleFilterChange({ ...filter, city: e.target.value })}
              placeholder="Filter by city"
              className="w-full px-3 py-2 bg-gray-700 text-[#F8F8F8] rounded border border-gray-600 focus:border-[#FF9F40] focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm text-[#F8F8F8] mb-1">State</label>
            <input
              type="text"
              value={filter.state}
              onChange={(e) => handleFilterChange({ ...filter, state: e.target.value })}
              placeholder="Filter by state"
              className="w-full px-3 py-2 bg-gray-700 text-[#F8F8F8] rounded border border-gray-600 focus:border-[#FF9F40] focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm text-[#F8F8F8] mb-1">Apparition Type</label>
            <select
              value={filter.apparitionTag}
              onChange={(e) => handleFilterChange({ ...filter, apparitionTag: e.target.value })}
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
              onChange={(e) => handleFilterChange({ ...filter, timeOfDay: e.target.value })}
              className="w-full px-3 py-2 bg-gray-700 text-[#F8F8F8] rounded border border-gray-600 focus:border-[#FF9F40] focus:outline-none"
            >
              <option value="">All Times</option>
              {uniqueTimeOfDay.map(time => (
                <option key={time} value={time}>{time}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="mt-3 text-sm text-gray-400">
          Showing {startIndex + 1}-{Math.min(endIndex, filteredSightings.length)} of {filteredSightings.length} sightings
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
              {currentSightings.map((sighting) => (
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

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-2">
          <button
            onClick={() => goToPage(1)}
            disabled={currentPage === 1}
            className="px-3 py-2 bg-gray-800 text-[#F8F8F8] rounded hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            First
          </button>
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-2 bg-gray-800 text-[#F8F8F8] rounded hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          
          <div className="flex gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              
              return (
                <button
                  key={pageNum}
                  onClick={() => goToPage(pageNum)}
                  className={`px-3 py-2 rounded ${
                    currentPage === pageNum
                      ? 'bg-[#FF9F40] text-black font-semibold'
                      : 'bg-gray-800 text-[#F8F8F8] hover:bg-gray-700'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-2 bg-gray-800 text-[#F8F8F8] rounded hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
          <button
            onClick={() => goToPage(totalPages)}
            disabled={currentPage === totalPages}
            className="px-3 py-2 bg-gray-800 text-[#F8F8F8] rounded hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Last
          </button>
          
          <span className="ml-4 text-[#F8F8F8]">
            Page {currentPage} of {totalPages}
          </span>
        </div>
      )}
    </div>
  );
}

