'use client';

import { useState, useEffect } from 'react';
import { SightingFormData } from '../types/sighting';

interface AddSightingFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: SightingFormData) => void;
  initialLat?: number;
  initialLng?: number;
}

export default function AddSightingForm({ 
  isOpen, 
  onClose, 
  onSubmit,
  initialLat,
  initialLng 
}: AddSightingFormProps) {
  const [formData, setFormData] = useState<SightingFormData>({
    date: new Date().toISOString().split('T')[0],
    time: '',
    latitude: initialLat || 0,
    longitude: initialLng || 0,
    city: '',
    state: '',
    notes: '',
    timeOfDay: '',
    apparitionTag: '',
    imageLink: '',
  });
  const [showSuccess, setShowSuccess] = useState(false);

  // Update coordinates when initialLat/initialLng change (from map click)
  // This is necessary to update form when user clicks on map
  useEffect(() => {
    if (initialLat && initialLng && isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData(prev => ({
        ...prev,
        latitude: initialLat,
        longitude: initialLng,
      }));
    }
  }, [initialLat, initialLng, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      onClose();
      // Reset form
      setFormData({
        date: new Date().toISOString().split('T')[0],
        time: '',
        latitude: initialLat || 0,
        longitude: initialLng || 0,
        city: '',
        state: '',
        notes: '',
        timeOfDay: '',
        apparitionTag: '',
        imageLink: '',
      });
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[9999] p-4">
      <div className="bg-[#F8F8F8] rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-black">Post a Sighting</h2>
            <button
              onClick={onClose}
              className="text-gray-600 hover:text-black text-2xl"
            >
              ×
            </button>
          </div>
          
          <p className="text-gray-700 mb-6">
            Did you spot a spirit? Post information below so that our community can stand vigilant!
          </p>

          {showSuccess && (
            <div className="mb-6 p-4 bg-green-500 text-white rounded-lg text-center font-semibold">
              Successfully Submitted
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  Date of Sighting
                </label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#FF9F40] focus:outline-none text-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  Time of Sighting
                </label>
                <input
                  type="time"
                  required
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#FF9F40] focus:outline-none text-black"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">
                Type of Sighting
              </label>
              <input
                type="text"
                required
                value={formData.apparitionTag}
                onChange={(e) => setFormData({ ...formData, apparitionTag: e.target.value })}
                placeholder="e.g., Headless Spirit, Poltergeist, Shadow Figure"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#FF9F40] focus:outline-none text-black"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">
                Time of Day
              </label>
              <select
                required
                value={formData.timeOfDay}
                onChange={(e) => setFormData({ ...formData, timeOfDay: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#FF9F40] focus:outline-none text-black"
              >
                <option value="">Select time of day</option>
                <option value="Dawn">Dawn</option>
                <option value="Morning">Morning</option>
                <option value="Afternoon">Afternoon</option>
                <option value="Evening">Evening</option>
                <option value="Night">Night</option>
                <option value="Midnight">Midnight</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  City
                </label>
                <input
                  type="text"
                  required
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#FF9F40] focus:outline-none text-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  State
                </label>
                <input
                  type="text"
                  required
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#FF9F40] focus:outline-none text-black"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  Latitude
                </label>
                <input
                  type="number"
                  step="any"
                  required
                  value={formData.latitude}
                  onChange={(e) => setFormData({ ...formData, latitude: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#FF9F40] focus:outline-none text-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  Longitude
                </label>
                <input
                  type="number"
                  step="any"
                  required
                  value={formData.longitude}
                  onChange={(e) => setFormData({ ...formData, longitude: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#FF9F40] focus:outline-none text-black"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">
                Sighting Notes
              </label>
              <textarea
                required
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={4}
                placeholder="Describe what you saw..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#FF9F40] focus:outline-none text-black"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">
                Image Link (optional)
              </label>
              <input
                type="url"
                value={formData.imageLink}
                onChange={(e) => setFormData({ ...formData, imageLink: e.target.value })}
                placeholder="https://..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#FF9F40] focus:outline-none text-black"
              />
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                className="flex-1 bg-gray-800 text-[#F8F8F8] px-6 py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors"
              >
                Post Your Sighting
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

