export interface Sighting {
  id: string;
  date: string;
  latitude: number;
  longitude: number;
  city: string;
  state: string;
  notes: string;
  timeOfDay: string;
  apparitionTag: string;
  imageLink?: string;
}

export interface SightingFormData {
  date: string;
  time: string;
  latitude: number;
  longitude: number;
  city: string;
  state: string;
  notes: string;
  timeOfDay: string;
  apparitionTag: string;
  imageLink: string;
}

