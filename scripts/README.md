# Data Loading Scripts

This directory contains scripts for managing the Supabase database.

## Load Data to Supabase

The `loadDataToSupabase.ts` script loads ghost sighting data from the CSV file into your Supabase database.

### Prerequisites

1. Create a Supabase account and project at https://supabase.com
2. Run the SQL schema from `schema.txt` in your Supabase SQL Editor
3. Set up your `.env.local` file with Supabase credentials:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-project-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key  # Optional, for better performance
```

### Usage

Run the data loading script:

```bash
npm run load-data
```

### What it does

- Reads the `app/data/ghosts_data.csv` file
- Parses and validates the CSV data
- Transforms the data to match the database schema
- Inserts data in batches of 1000 records
- Provides progress updates and a summary report

### Output

The script will display:
- Number of records parsed from CSV
- Current database record count (before insertion)
- Progress for each batch insertion
- Final summary with success/error counts
- Final database record count (after insertion)

### Notes

- The script uses all lowercase column names (`timeofday`, `apparitiontag`, `imagelink`) to match PostgreSQL conventions
- Empty image links are stored as `null` in the database
- The script includes error handling and will continue processing even if individual batches fail
- A small delay (100ms) is added between batches to avoid rate limiting

### Troubleshooting

If you encounter errors:

1. **Column not found errors**: Make sure you ran the SQL schema from `schema.txt` in Supabase
2. **Authentication errors**: Verify your `.env.local` file has the correct Supabase credentials
3. **Rate limiting**: The script includes delays, but you can increase the delay if needed

### Database Schema

The database table structure:

```sql
CREATE TABLE sightings (
  id UUID PRIMARY KEY,
  date DATE NOT NULL,
  latitude DECIMAL(10, 6) NOT NULL,
  longitude DECIMAL(11, 6) NOT NULL,
  city VARCHAR(255) NOT NULL,
  state VARCHAR(100) NOT NULL,
  notes TEXT NOT NULL,
  timeofday VARCHAR(50) NOT NULL,
  apparitiontag VARCHAR(100) NOT NULL,
  imagelink TEXT,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
);
```

Note: PostgreSQL automatically converts camelCase column names to lowercase unless they are quoted.

