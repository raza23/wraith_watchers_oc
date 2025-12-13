import { getAllSightings, calculateStats } from './lib/sightingsService';
import HomePageClient from './components/HomePageClient';

export default async function Home() {
  try {
    // Fetch sightings from Supabase
    console.log('Fetching sightings from Supabase...');
    const sightings = await getAllSightings();
    console.log(`Fetched ${sightings.length} sightings from database`);
    const stats = calculateStats(sightings);

    return (
      <HomePageClient 
        initialSightings={sightings}
        initialStats={stats}
      />
    );
  } catch (error) {
    console.error('Error fetching sightings:', error);
    // Return empty data on error
    return (
      <HomePageClient 
        initialSightings={[]}
        initialStats={{
          total: 0,
          mostRecent: null,
          daysAgo: 0,
          mostGhostlyCity: 'N/A'
        }}
      />
    );
  }
}
