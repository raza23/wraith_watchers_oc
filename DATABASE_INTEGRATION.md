# Supabase Database Integration

This document explains how the application has been migrated from CSV-based data storage to Supabase database.

## Architecture Overview

The application now uses Supabase as its primary data source instead of reading from CSV files. This provides:

- **Real-time data**: All users see the same data
- **Persistent storage**: New sightings are saved permanently
- **Scalability**: Can handle thousands of concurrent users
- **Better performance**: Indexed queries for fast data retrieval

## Files Created/Modified

### New Files

1. **`app/lib/supabase.ts`**
   - Supabase client initialization
   - Exports configured client for use across the app

2. **`app/lib/sightingsService.ts`**
   - Database service layer for all sighting operations
   - Handles data transformation between database format (lowercase) and app format (camelCase)
   - Functions:
     - `getAllSightings()` - Fetch all sightings
     - `addSighting()` - Add a new sighting
     - `getSightingsByState()` - Filter by state
     - `getSightingsByCity()` - Filter by city and state
     - `getSightingsCount()` - Get total count
     - `calculateStats()` - Calculate statistics

3. **`app/api/sightings/route.ts`**
   - API endpoint for adding new sightings
   - POST `/api/sightings` - Add a new sighting
   - Validates required fields
   - Returns created sighting with database-generated ID

### Modified Files

1. **`app/page.tsx`**
   - Changed from synchronous CSV parsing to async database fetch
   - Now uses `getAllSightings()` from sightingsService
   - Server component that fetches data on each page load

2. **`app/components/HomePageClient.tsx`**
   - Updated `handleFormSubmit` to use API endpoint
   - Now makes POST request to `/api/sightings`
   - Adds new sighting to top of list (most recent first)
   - Includes error handling with user feedback

3. **`package.json`**
   - Added `@supabase/supabase-js` dependency
   - Added `dotenv` for environment variable support
   - Added `tsx` for running TypeScript scripts

## Database Schema

The database uses lowercase column names (PostgreSQL convention):

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

## Data Transformation

The application uses camelCase for consistency in the frontend:

**Database → App:**
- `timeofday` → `timeOfDay`
- `apparitiontag` → `apparitionTag`
- `imagelink` → `imageLink`

**App → Database:**
- `timeOfDay` → `timeofday`
- `apparitionTag` → `apparitiontag`
- `imageLink` → `imagelink`

This transformation is handled automatically by the `sightingsService.ts` layer.

## Environment Variables

Required in `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-project-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key  # Optional
```

## Row Level Security (RLS)

The database has RLS enabled with the following policies:

1. **Public Read Access**: Anyone can view sightings
2. **Authenticated Insert**: Only authenticated users can add sightings (currently open via API)

## API Endpoints

### POST /api/sightings

Add a new ghost sighting.

**Request Body:**
```json
{
  "date": "2024-12-13",
  "latitude": 40.7128,
  "longitude": -74.0060,
  "city": "New York",
  "state": "New York",
  "notes": "Ghostly apparition seen in the park",
  "timeOfDay": "Night",
  "apparitionTag": "Shadow Figure",
  "imageLink": "https://example.com/image.jpg"  // Optional
}
```

**Response:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "date": "2024-12-13",
  "latitude": 40.7128,
  "longitude": -74.0060,
  "city": "New York",
  "state": "New York",
  "notes": "Ghostly apparition seen in the park",
  "timeOfDay": "Night",
  "apparitionTag": "Shadow Figure",
  "imageLink": "https://example.com/image.jpg"
}
```

## Development

### Running the Application

```bash
npm run dev
```

The application will:
1. Connect to Supabase on startup
2. Fetch all sightings from the database
3. Display them on the homepage
4. Allow users to add new sightings via the form

### Loading Data

To load the CSV data into the database:

```bash
npm run load-data
```

This script is located in `scripts/loadDataToSupabase.ts`.

## Performance Considerations

1. **Server-Side Rendering**: Initial data is fetched on the server for fast first paint
2. **Indexed Queries**: Database has indexes on frequently queried columns
3. **Batch Operations**: Data loading script uses batches of 1000 records
4. **Optimistic Updates**: UI updates immediately, then syncs with database
5. **Paginated Fetching**: The `getAllSightings()` function uses pagination to overcome Supabase's 1000-row default limit, fetching all records in 1000-row chunks

## Future Enhancements

Potential improvements:

1. **Caching**: Implement Next.js caching for sightings data
2. **Pagination**: Load sightings in pages for better performance
3. **Real-time Updates**: Use Supabase subscriptions for live updates
4. **Authentication**: Add user authentication for adding sightings
5. **Image Upload**: Use Supabase Storage for image hosting
6. **Search**: Implement full-text search on sightings
7. **Filtering**: Add UI filters for state, city, time of day, etc.

## Troubleshooting

### "Missing Supabase environment variables" error
- Ensure `.env.local` file exists with correct credentials
- Restart the dev server after adding environment variables

### "Could not find column" error
- Database column names must be lowercase
- Check that the schema was created correctly

### Data not appearing
- Verify data was loaded: Run verification in Supabase SQL editor
- Check browser console for errors
- Ensure RLS policies allow public read access

### Adding sighting fails
- Check browser network tab for API errors
- Verify all required fields are provided
- Check Supabase logs for detailed error messages

## Migration Notes

The old CSV-based system (`app/lib/dataParser.ts`) is still in the codebase but is no longer used. It can be removed if needed, but keeping it provides a fallback option.

**Original file**: `app/data/ghosts_data.csv` (12,000 records)
**Current database**: All records loaded to Supabase

The application now benefits from:
- Persistent storage across sessions
- Multi-user support
- Real-time data consistency
- Professional database features (transactions, constraints, indexes)

