import { parseSightingsData, calculateStats } from './lib/dataParser';
import HomePageClient from './components/HomePageClient';

export default function Home() {
  const sightings = parseSightingsData();
  const stats = calculateStats(sightings);

  return (
    <HomePageClient 
      initialSightings={sightings}
      initialStats={stats}
    />
  );
}
