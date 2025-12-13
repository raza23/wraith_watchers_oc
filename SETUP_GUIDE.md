# Quick Start Guide - Supabase Integration

This guide will help you set up the application with Supabase database.

## Prerequisites

- Node.js and npm installed
- A Supabase account (free tier works fine)

## Step-by-Step Setup

### 1. Create Supabase Project

1. Go to https://supabase.com
2. Sign up or log in
3. Click "New Project"
4. Fill in project details:
   - Project name: `wraitherwaters` (or your choice)
   - Database password: (choose a strong password)
   - Region: Choose closest to you
5. Wait for project to be created (~2 minutes)

### 2. Create Database Table

1. In your Supabase project dashboard, click on "SQL Editor" in the left sidebar
2. Click "New Query"
3. Copy and paste the contents of `schema.txt` into the editor
4. Click "Run" to create the table, indexes, and policies
5. Verify by checking the "Table Editor" - you should see a `sightings` table

### 3. Get Your API Credentials

1. In Supabase dashboard, go to "Settings" → "API"
2. You'll need two values:
   - **Project URL**: Found under "Project URL"
   - **Anon/Public Key**: Found under "Project API keys" → "anon public"

### 4. Configure Environment Variables

1. In the project root, create a file named `.env.local`
2. Add the following (replace with your actual values):

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

3. Save the file

### 5. Install Dependencies

```bash
npm install
```

This installs all required packages including `@supabase/supabase-js`.

### 6. Load Sample Data

Load the 12,000 ghost sightings from the CSV file:

```bash
npm run load-data
```

You should see output like:
```
✓ Successfully inserted 1000 records
✓ Successfully inserted 1000 records
...
Final database record count: 12000
✅ Data load completed successfully!
```

### 7. Update RLS Policy (Important!)

By default, the database requires authentication to add sightings. For the public app to work:

1. Go to Supabase SQL Editor
2. Run the SQL from `update_rls_policy.sql`:

```sql
DROP POLICY IF EXISTS "Allow authenticated insert" ON sightings;
CREATE POLICY "Allow public insert" ON sightings
  FOR INSERT
  WITH CHECK (true);
```

### 8. Start the Development Server

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

## Verify Everything Works

### Test 1: View Sightings
- You should see the map with 12,000+ sighting markers
- The stats should show "12000+ Total Sightings"
- The table should display sighting records

### Test 2: Add a Sighting
1. Click "Add Sighting" button
2. Fill out the form:
   - Date: Today's date
   - Click on the map to set location
   - Fill in city, state, notes, time of day, apparition type
3. Click "Submit"
4. The new sighting should appear at the top of the table
5. Refresh the page - the sighting should still be there (persisted in database)

### Test 3: API Endpoint
Test the API directly with curl:

```bash
curl -X POST http://localhost:3000/api/sightings \
  -H "Content-Type: application/json" \
  -d '{
    "date": "2024-12-13",
    "latitude": 40.7128,
    "longitude": -74.0060,
    "city": "New York",
    "state": "New York",
    "notes": "Test sighting",
    "timeOfDay": "Night",
    "apparitionTag": "Shadow Figure"
  }'
```

You should get back a JSON response with the created sighting including an `id`.

## Troubleshooting

### Issue: "Missing Supabase environment variables"
**Solution**: Make sure `.env.local` exists and has both variables. Restart the dev server.

### Issue: "new row violates row-level security policy"
**Solution**: Run the SQL from `update_rls_policy.sql` to allow public inserts.

### Issue: "Could not find the 'apparitiontag' column"
**Solution**: Make sure you ran the full SQL schema from `schema.txt`.

### Issue: No data showing in the app
**Solution**: 
1. Run `npm run load-data` to load the CSV data
2. Check Supabase Table Editor to verify data is there
3. Check browser console for errors

### Issue: Data loading fails with permission errors
**Solution**: Use the SUPABASE_SERVICE_ROLE_KEY instead of anon key for loading data (optional).

## Next Steps

Once everything is working:

1. ✅ **Deploy to Production**: Deploy to Vercel, add production environment variables
2. ✅ **Add Authentication**: Implement user authentication for adding sightings
3. ✅ **Add Rate Limiting**: Prevent abuse of the API
4. ✅ **Enable Real-time**: Use Supabase subscriptions for live updates
5. ✅ **Add Image Upload**: Use Supabase Storage for sighting images

## Architecture

```
┌─────────────────┐
│   Next.js App   │
│   (Frontend)    │
└────────┬────────┘
         │
         ├──── API Routes (/api/sightings)
         │      └── POST: Add new sighting
         │
         ├──── Server Components (page.tsx)
         │      └── Fetch data on server
         │
         └──── Client Components
                └── Display data, handle user interaction

                ↓
        
┌────────────────────────┐
│  Supabase Client Lib   │
│  (app/lib/supabase.ts) │
└───────────┬────────────┘
            │
            ↓
┌────────────────────────┐
│  Sightings Service     │
│  (sightingsService.ts) │
│  - getAllSightings()   │
│  - addSighting()       │
│  - transformers        │
└───────────┬────────────┘
            │
            ↓
┌────────────────────────┐
│   Supabase Database    │
│   - sightings table    │
│   - RLS policies       │
│   - Indexes            │
└────────────────────────┘
```

## File Structure

```
wraitherwaters_oc/
├── app/
│   ├── api/
│   │   └── sightings/
│   │       └── route.ts          # API endpoint for adding sightings
│   ├── components/
│   │   ├── HomePageClient.tsx    # Main client component (updated)
│   │   └── ...
│   ├── lib/
│   │   ├── supabase.ts           # Supabase client setup
│   │   ├── sightingsService.ts   # Database service layer
│   │   └── dataParser.ts         # Old CSV parser (not used)
│   ├── types/
│   │   └── sighting.ts           # TypeScript interfaces
│   └── page.tsx                  # Home page (updated to use DB)
├── scripts/
│   ├── loadDataToSupabase.ts     # Data loading script
│   └── README.md                 # Script documentation
├── .env.local                    # Environment variables (create this)
├── schema.txt                    # Database schema SQL
├── update_rls_policy.sql         # RLS policy update
├── DATABASE_INTEGRATION.md       # Detailed integration docs
└── SETUP_GUIDE.md                # This file
```

## Support

If you encounter any issues:

1. Check the troubleshooting section above
2. Review `DATABASE_INTEGRATION.md` for detailed architecture info
3. Check Supabase logs in the dashboard
4. Check browser console and terminal for error messages

Enjoy your ghost sighting tracker! 👻

