'use client';

import { useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Sighting } from '../types/sighting';

interface SightingsMapProps {
  sightings: Sighting[];
  onAddSightingClick: () => void;
  onMapClick?: (lat: number, lng: number) => void;
}

// Component to handle map clicks
function MapClickHandler({ onMapClick }: { onMapClick?: (lat: number, lng: number) => void }) {
  useMapEvents({
    click: (e) => {
      if (onMapClick) {
        onMapClick(e.latlng.lat, e.latlng.lng);
      }
    },
  });
  return null;
}

export default function SightingsMap({ sightings, onAddSightingClick, onMapClick }: SightingsMapProps) {
  // Fix for default marker icons in React-Leaflet (only on client side)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
      });
    }
  }, []);

  // Optimize: Only show sampled markers to improve performance
  // Show max 500 markers by sampling the data
  const displaySightings = useMemo(() => {
    if (sightings.length <= 500) return sightings;
    
    // Sample every Nth sighting to get approximately 500 markers
    const step = Math.ceil(sightings.length / 500);
    return sightings.filter((_, index) => index % step === 0);
  }, [sightings]);

  // Calculate center of all sightings (or default to US center)
  const centerLat = sightings.length > 0
    ? sightings.reduce((sum, s) => sum + s.latitude, 0) / sightings.length
    : 39.8283;
  const centerLng = sightings.length > 0
    ? sightings.reduce((sum, s) => sum + s.longitude, 0) / sightings.length
    : -98.5795;

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="relative">
        <h2 className="text-3xl font-bold text-[#F8F8F8] mb-6 text-center">Sightings Map</h2>
        <div className="absolute top-0 right-0 z-[1000] flex gap-2">
          <button
            onClick={onAddSightingClick}
            className="px-4 py-2 bg-[#FF9F40] text-black rounded-lg font-medium hover:bg-[#FF8F30] transition-colors shadow-lg"
          >
            Add Sighting
          </button>
        </div>
        <p className="text-center text-[#F8F8F8] text-sm mb-4">
          Click anywhere on the map to set the location for a new sighting
          {displaySightings.length < sightings.length && (
            <span className="block text-xs text-gray-400 mt-1">
              Showing {displaySightings.length} of {sightings.length} sightings for better performance
            </span>
          )}
        </p>
        <div className="bg-gray-900 rounded-lg overflow-hidden shadow-lg">
          <MapContainer
            center={[centerLat, centerLng]}
            zoom={4}
            style={{ height: '600px', width: '100%' }}
            className="z-0"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapClickHandler onMapClick={onMapClick} />
            {displaySightings.map((sighting) => (
              <Marker
                key={sighting.id}
                position={[sighting.latitude, sighting.longitude]}
              >
                <Popup>
                  <div className="p-2 min-w-[200px]">
                    {sighting.imageLink && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={sighting.imageLink}
                        alt="Sighting"
                        className="w-full h-32 object-cover rounded mb-2"
                      />
                    )}
                    <div className="space-y-1">
                      <p className="font-semibold text-sm">
                        <strong>Date:</strong> {new Date(sighting.date).toLocaleDateString()}
                      </p>
                      <p className="text-xs">
                        <strong>Time:</strong> {sighting.timeOfDay}
                      </p>
                      <p className="text-xs">
                        <strong>Type:</strong> {sighting.apparitionTag}
                      </p>
                      <p className="text-xs">
                        <strong>Location:</strong> {sighting.city}, {sighting.state}
                      </p>
                      {sighting.notes && (
                        <p className="text-xs mt-2 text-gray-700">{sighting.notes}</p>
                      )}
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>
    </div>
  );
}

