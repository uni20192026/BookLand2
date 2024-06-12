// app/api/voting/step3/route.js
import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function POST(request) {
  try {
    const { userId, clubId, selectedPlace } = await request.json();
    
    const client = await clientPromise;
    const db = client.db();

    // Update or insert voting data for step3
    const result = await db.collection('voting').updateOne(
      { clubId, userId },
      { $set: { step3: selectedPlace } },
      { upsert: true }
    );

    if (result.modifiedCount > 0 || result.upsertedCount > 0) {
      return NextResponse.json({ message: 'Vote recorded successfully' });
    } else {
      return NextResponse.json({ message: 'Failed to record vote' }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to record vote', error: error.message },
      { status: 500 }
    );
  }
}
