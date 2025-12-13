import { NextRequest, NextResponse } from 'next/server';
import { addSighting } from '@/app/lib/sightingsService';
import { Sighting } from '@/app/types/sighting';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['date', 'latitude', 'longitude', 'city', 'state', 'notes', 'timeOfDay', 'apparitionTag'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Create sighting object (without id)
    const sightingData: Omit<Sighting, 'id'> = {
      date: body.date,
      latitude: parseFloat(body.latitude),
      longitude: parseFloat(body.longitude),
      city: body.city,
      state: body.state,
      notes: body.notes,
      timeOfDay: body.timeOfDay,
      apparitionTag: body.apparitionTag,
      imageLink: body.imageLink || undefined,
    };

    // Add to database
    const newSighting = await addSighting(sightingData);

    return NextResponse.json(newSighting, { status: 201 });
  } catch (error) {
    console.error('Error adding sighting:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to add sighting';
    return NextResponse.json(
      { error: errorMessage, details: error },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { message: 'Use POST to add a new sighting' },
    { status: 405 }
  );
}

