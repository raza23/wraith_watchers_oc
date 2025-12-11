'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Navigation from './Navigation';
import SightingsStats from './SightingsStats';
import SightingsTable from './SightingsTable';
import AddSightingForm from './AddSightingForm';
import { Sighting, SightingFormData } from '../types/sighting';

// Dynamically import the map component with SSR disabled
const SightingsMap = dynamic(() => import('./SightingsMap'), {
  ssr: false,
  loading: () => (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="relative">
        <h2 className="text-3xl font-bold text-[#F8F8F8] mb-6 text-center">Sightings Map</h2>
        <div className="bg-gray-900 rounded-lg overflow-hidden shadow-lg h-[600px] flex items-center justify-center">
          <div className="text-[#F8F8F8]">Loading map...</div>
        </div>
      </div>
    </div>
  ),
});

interface HomePageClientProps {
  initialSightings: Sighting[];
  initialStats: {
    total: number;
    mostRecent: Sighting | null;
    daysAgo: number;
    mostGhostlyCity: string;
  };
}

export default function HomePageClient({ initialSightings }: HomePageClientProps) {
  const [sightings, setSightings] = useState<Sighting[]>(initialSightings);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(() => Date.now());
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null);

  // Update current time periodically for accurate days ago calculation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000 * 60 * 60); // Update every hour
    return () => clearInterval(interval);
  }, []);

  const handleAddSightingClick = () => {
    setIsFormOpen(true);
  };

  const handleMapClick = (lat: number, lng: number) => {
    setSelectedLocation({ lat, lng });
    setIsFormOpen(true);
  };

  const handleFormSubmit = (formData: SightingFormData) => {
    // Create new sighting from form data
    const newSighting: Sighting = {
      id: `sighting-${currentTime}`,
      date: formData.date,
      latitude: formData.latitude,
      longitude: formData.longitude,
      city: formData.city,
      state: formData.state,
      notes: formData.notes,
      timeOfDay: formData.timeOfDay,
      apparitionTag: formData.apparitionTag,
      imageLink: formData.imageLink || undefined,
    };

    // Add to sightings list
    setSightings([...sightings, newSighting]);
  };

  // Recalculate stats when sightings change
  const total = sightings.length;
  const sortedByDate = [...sightings].sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateB.getTime() - dateA.getTime();
  });
  const mostRecent = sortedByDate[0] || null;
  const daysAgo = mostRecent 
    ? Math.floor((currentTime - new Date(mostRecent.date).getTime()) / (1000 * 60 * 60 * 24))
    : 0;
  
  const cityCounts: Record<string, number> = {};
  sightings.forEach(sighting => {
    const cityKey = `${sighting.city}, ${sighting.state}`;
    cityCounts[cityKey] = (cityCounts[cityKey] || 0) + 1;
  });
  
  const mostGhostlyCity = Object.entries(cityCounts)
    .sort(([, a], [, b]) => b - a)[0]?.[0] || 'N/A';

  const stats = {
    total,
    daysAgo,
    mostGhostlyCity,
  };

  return (
    <div className="min-h-screen bg-black">
      <Navigation />
      <main className="pb-12">
        <SightingsStats {...stats} />
        <SightingsMap 
          sightings={sightings} 
          onAddSightingClick={handleAddSightingClick}
          onMapClick={handleMapClick}
        />
        <SightingsTable sightings={sightings} />
      </main>
      <footer className="bg-gray-900 text-[#F8F8F8] text-center py-4">
        <p>Footer</p>
      </footer>
      <AddSightingForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedLocation(null);
        }}
        onSubmit={handleFormSubmit}
        initialLat={selectedLocation?.lat}
        initialLng={selectedLocation?.lng}
      />
    </div>
  );
}

