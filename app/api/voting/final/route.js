// app/api/voting/final/route.js

import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function POST(request) {
  try {
    const { userId, clubId, location } = await request.json();

    const client = await clientPromise;
    const db = client.db();

    await db.collection('voting').updateOne(
      { clubId, userId },
      { $set: { finalVote: location } },
      { upsert: true }
    );

    return NextResponse.json({ message: 'Final vote recorded' });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to record final vote', error: error.message }, { status: 500 });
  }
}
