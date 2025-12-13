import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import Papa from 'papaparse';

interface CSVRow {
  'Date of Sighting': string;
  'Latitude of Sighting': string;
  'Longitude of Sighting': string;
  'Nearest Approximate City': string;
  'US State': string;
  'Notes about the sighting': string;
  'Time of Day': string;
  'Tag of Apparition': string;
  'Image Link': string;
}

interface SightingRecord {
  date: string;
  latitude: number;
  longitude: number;
  city: string;
  state: string;
  notes: string;
  timeofday: string;
  apparitiontag: string;
  imagelink: string | null;
}

// Load environment variables
require('dotenv').config({ path: '.env.local' });

// Supabase configuration
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('Missing Supabase environment variables');
  console.error('NEXT_PUBLIC_SUPABASE_URL:', SUPABASE_URL ? 'Set' : 'Missing');
  console.error('SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY:', SUPABASE_SERVICE_KEY ? 'Set' : 'Missing');
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function loadDataToSupabase() {
  console.log('Starting data load to Supabase...');
  console.log('Supabase URL:', SUPABASE_URL);

  // Read the CSV file
  const csvFilePath = path.join(__dirname, '../app/data/ghosts_data.csv');
  console.log('Reading CSV from:', csvFilePath);
  
  const csvContent = fs.readFileSync(csvFilePath, 'utf-8');

  // Parse CSV
  const parseResult = Papa.parse<CSVRow>(csvContent, {
    header: true,
    skipEmptyLines: true,
  });

  if (parseResult.errors.length > 0) {
    console.error('CSV parsing errors:', parseResult.errors);
    throw new Error('Failed to parse CSV');
  }

  console.log(`Parsed ${parseResult.data.length} records from CSV`);

  // Transform data to match database schema
  const sightings: SightingRecord[] = parseResult.data.map((row) => {
    const imageLink = row['Image Link']?.trim();
    return {
      date: row['Date of Sighting'],
      latitude: parseFloat(row['Latitude of Sighting']),
      longitude: parseFloat(row['Longitude of Sighting']),
      city: row['Nearest Approximate City'],
      state: row['US State'],
      notes: row['Notes about the sighting'],
      timeofday: row['Time of Day'],
      apparitiontag: row['Tag of Apparition'],
      imagelink: imageLink && imageLink.length > 0 ? imageLink : null,
    };
  });

  // First, check if table exists and has data
  const { count, error: countError } = await supabase
    .from('sightings')
    .select('*', { count: 'exact', head: true });

  if (countError) {
    console.error('Error checking table:', countError);
    throw new Error('Failed to access sightings table. Make sure the table is created.');
  }

  console.log(`Current records in database: ${count || 0}`);

  // Insert data in batches (Supabase has a limit on batch size)
  const BATCH_SIZE = 1000;
  let successCount = 0;
  let errorCount = 0;
  const errors: any[] = [];

  for (let i = 0; i < sightings.length; i += BATCH_SIZE) {
    const batch = sightings.slice(i, i + BATCH_SIZE);
    const batchNumber = Math.floor(i / BATCH_SIZE) + 1;
    const totalBatches = Math.ceil(sightings.length / BATCH_SIZE);
    
    console.log(`\nInserting batch ${batchNumber}/${totalBatches} (${batch.length} records)...`);

    const { data, error } = await supabase
      .from('sightings')
      .insert(batch)
      .select();

    if (error) {
      console.error(`Error inserting batch ${batchNumber}:`, error);
      errors.push({ batch: batchNumber, error });
      errorCount += batch.length;
    } else {
      const insertedCount = data?.length || batch.length;
      console.log(`✓ Successfully inserted ${insertedCount} records`);
      successCount += insertedCount;
    }

    // Add a small delay between batches to avoid rate limiting
    if (i + BATCH_SIZE < sightings.length) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  console.log('\n╔════════════════════════════════╗');
  console.log('║   Data Load Summary            ║');
  console.log('╚════════════════════════════════╝');
  console.log(`Total records processed: ${sightings.length}`);
  console.log(`Successfully inserted:   ${successCount}`);
  console.log(`Errors:                  ${errorCount}`);
  
  if (errors.length > 0) {
    console.log('\n⚠️  Errors occurred:');
    errors.forEach(({ batch, error }) => {
      console.log(`  Batch ${batch}: ${error.message}`);
    });
  }

  // Verify final count
  const { count: finalCount } = await supabase
    .from('sightings')
    .select('*', { count: 'exact', head: true });

  console.log(`\nFinal database record count: ${finalCount || 0}`);
  console.log('════════════════════════════════\n');
}

// Run the script
loadDataToSupabase()
  .then(() => {
    console.log('✅ Data load completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Data load failed:', error);
    process.exit(1);
  });

