import { Sighting } from '../types/sighting';
import { supabase } from './supabase';

// Database row interface matching the actual database schema
interface SightingRow {
  id: string;
  date: string;
  latitude: number;
  longitude: number;
  city: string;
  state: string;
  notes: string;
  timeofday: string;
  apparitiontag: string;
  imagelink: string | null;
  created_at?: string;
  updated_at?: string;
}

// Transform database row to app Sighting format
function transformSighting(row: SightingRow): Sighting {
  return {
    id: row.id,
    date: row.date,
    latitude: row.latitude,
    longitude: row.longitude,
    city: row.city,
    state: row.state,
    notes: row.notes,
    timeOfDay: row.timeofday,
    apparitionTag: row.apparitiontag,
    imageLink: row.imagelink || undefined,
  };
}

// Transform app Sighting to database row format
function transformToDbFormat(sighting: Omit<Sighting, 'id'>): Omit<SightingRow, 'id' | 'created_at' | 'updated_at'> {
  return {
    date: sighting.date,
    latitude: sighting.latitude,
    longitude: sighting.longitude,
    city: sighting.city,
    state: sighting.state,
    notes: sighting.notes,
    timeofday: sighting.timeOfDay,
    apparitiontag: sighting.apparitionTag,
    imagelink: sighting.imageLink || null,
  };
}

/**
 * Fetch all sightings from the database
 * Note: Supabase has a default row limit, so we fetch in multiple chunks if needed
 */
export async function getAllSightings(): Promise<Sighting[]> {
  const BATCH_SIZE = 1000;
  let allSightings: SightingRow[] = [];
  let start = 0;
  let hasMore = true;

  while (hasMore) {
    const { data, error } = await supabase
      .from('sightings')
      .select('*')
      .order('date', { ascending: false })
      .range(start, start + BATCH_SIZE - 1);

    if (error) {
      console.error('Error fetching sightings:', error);
      throw error;
    }

    if (data && data.length > 0) {
      allSightings = [...allSightings, ...data];
      start += BATCH_SIZE;
      hasMore = data.length === BATCH_SIZE;
    } else {
      hasMore = false;
    }
  }

  console.log(`Successfully fetched ${allSightings.length} total sightings from database`);
  return allSightings.map(transformSighting);
}

/**
 * Add a new sighting to the database
 */
export async function addSighting(sighting: Omit<Sighting, 'id'>): Promise<Sighting> {
  const dbSighting = transformToDbFormat(sighting);

  const { data, error } = await supabase
    .from('sightings')
    .insert([dbSighting])
    .select()
    .single();

  if (error) {
    console.error('Error adding sighting:', error);
    throw error;
  }

  return transformSighting(data as SightingRow);
}

/**
 * Get sightings by state
 */
export async function getSightingsByState(state: string): Promise<Sighting[]> {
  const { data, error } = await supabase
    .from('sightings')
    .select('*')
    .eq('state', state)
    .order('date', { ascending: false });

  if (error) {
    console.error('Error fetching sightings by state:', error);
    throw error;
  }

  return (data as SightingRow[]).map(transformSighting);
}

/**
 * Get sightings by city
 */
export async function getSightingsByCity(city: string, state: string): Promise<Sighting[]> {
  const { data, error } = await supabase
    .from('sightings')
    .select('*')
    .eq('city', city)
    .eq('state', state)
    .order('date', { ascending: false });

  if (error) {
    console.error('Error fetching sightings by city:', error);
    throw error;
  }

  return (data as SightingRow[]).map(transformSighting);
}

/**
 * Get total count of sightings
 */
export async function getSightingsCount(): Promise<number> {
  const { count, error } = await supabase
    .from('sightings')
    .select('*', { count: 'exact', head: true });

  if (error) {
    console.error('Error getting sightings count:', error);
    throw error;
  }

  return count || 0;
}

/**
 * Calculate statistics from sightings
 */
export function calculateStats(sightings: Sighting[]) {
  const total = sightings.length;
  
  // Find most recent sighting
  const sortedByDate = [...sightings].sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateB.getTime() - dateA.getTime();
  });
  const mostRecent = sortedByDate[0] || null;
  
  // Calculate days ago for most recent
  const daysAgo = mostRecent 
    ? Math.floor((Date.now() - new Date(mostRecent.date).getTime()) / (1000 * 60 * 60 * 24))
    : 0;
  
  // Find most ghostly city
  const cityCounts: Record<string, number> = {};
  sightings.forEach(sighting => {
    const cityKey = `${sighting.city}, ${sighting.state}`;
    cityCounts[cityKey] = (cityCounts[cityKey] || 0) + 1;
  });
  
  const mostGhostlyCity = Object.entries(cityCounts)
    .sort(([, a], [, b]) => b - a)[0]?.[0] || 'N/A';
  
  return {
    total,
    mostRecent,
    daysAgo,
    mostGhostlyCity,
  };
}

