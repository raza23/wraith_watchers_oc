import { Sighting } from '../types/sighting';
import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';

export function parseSightingsData(): Sighting[] {
  try {
    const filePath = path.join(process.cwd(), 'app', 'data', 'sample.csv');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    
    const results = Papa.parse<Record<string, string>>(fileContents, {
      header: true,
      skipEmptyLines: true,
    });
    
    const sightings: Sighting[] = results.data.map((row, index: number) => ({
      id: `sighting-${index}`,
      date: row['Date of Sighting'] || '',
      latitude: parseFloat(row['Latitude of Sighting']) || 0,
      longitude: parseFloat(row['Longitude of Sighting']) || 0,
      city: row['Nearest Approximate City'] || '',
      state: row['US State'] || '',
      notes: row['Notes about the sighting'] || '',
      timeOfDay: row['Time of Day'] || '',
      apparitionTag: row['Tag of Apparition'] || '',
      imageLink: row['Image Link'] || undefined,
    })).filter((s: Sighting) => s.latitude !== 0 && s.longitude !== 0);
    
    return sightings;
  } catch (error) {
    console.error('Error parsing CSV:', error);
    return [];
  }
}

export function calculateStats(sightings: Sighting[]) {
  const total = sightings.length;
  
  // Find most recent sighting
  const sortedByDate = [...sightings].sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateB.getTime() - dateA.getTime();
  });
  const mostRecent = sortedByDate[0];
  
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
