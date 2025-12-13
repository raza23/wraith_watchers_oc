# Wraither Waters - Ghost Sighting Tracker 👻

A Next.js application for tracking and visualizing ghost sightings across the United States, powered by Supabase database.

## Features

- 🗺️ **Interactive Map**: View 12,000+ ghost sightings on an interactive map
- 📊 **Statistics Dashboard**: Real-time statistics about sightings
- 📝 **Add Sightings**: Submit new ghost sighting reports
- 🔍 **Data Table**: Browse and filter sighting records
- 💾 **Persistent Storage**: All data stored in Supabase database
- 🌐 **Multi-user Support**: Real-time data synchronization

## Quick Start

### Prerequisites

- Node.js 18+ and npm
- A Supabase account (free tier works)

### Setup

1. **Clone and install dependencies**
   ```bash
   npm install
   ```

2. **Set up Supabase database**
   
   Follow the complete guide in **[SETUP_GUIDE.md](./SETUP_GUIDE.md)**
   
   Quick steps:
   - Create Supabase project
   - Run SQL from `schema.txt` in Supabase SQL Editor
   - Copy your project URL and anon key
   - Create `.env.local` with your credentials
   - Run `npm run load-data` to load sample data

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open [http://localhost:3000](http://localhost:3000)**

## Documentation

- 📖 **[SETUP_GUIDE.md](./SETUP_GUIDE.md)** - Complete setup instructions
- 🏗️ **[DATABASE_INTEGRATION.md](./DATABASE_INTEGRATION.md)** - Technical architecture details
- 📋 **[MIGRATION_SUMMARY.md](./MIGRATION_SUMMARY.md)** - Migration from CSV to database

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Database**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS
- **Maps**: Leaflet + React Leaflet
- **Data Parsing**: PapaParse

## Project Structure

```
app/
├── api/sightings/         # API routes for sightings
├── components/            # React components
├── lib/                   # Utilities and services
│   ├── supabase.ts       # Supabase client
│   └── sightingsService.ts # Database service layer
├── types/                 # TypeScript interfaces
└── page.tsx              # Home page

scripts/
└── loadDataToSupabase.ts  # Data import script
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run load-data` - Load CSV data into database
- `npm run lint` - Run ESLint

## Environment Variables

Create a `.env.local` file:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-project-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## Database Schema

The app uses a single `sightings` table with:
- Geographic data (latitude, longitude, city, state)
- Temporal data (date, time of day)
- Sighting details (notes, apparition type, image link)
- Metadata (id, created_at, updated_at)

See `schema.txt` for complete SQL schema.

## Contributing

This is a demonstration project. Feel free to fork and modify for your needs!

## Learn More

To learn more about the technologies used:

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [React Leaflet](https://react-leaflet.js.org/)
- [Tailwind CSS](https://tailwindcss.com/docs)

## Deploy on Vercel

The easiest way to deploy is using the [Vercel Platform](https://vercel.com/new).

1. Push your code to GitHub
2. Import the repository in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## License

MIT

---

Built with 👻 for tracking supernatural encounters
