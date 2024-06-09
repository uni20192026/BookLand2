// app/api/voting/step1/route.js

import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function POST(request) {
  try {
    const { userId, clubId, district } = await request.json();

    const client = await clientPromise;
    const db = client.db();

    await db.collection('voting').updateOne(
      { clubId, userId },
      { $set: { step1: district } },
      { upsert: true }
    );

    return NextResponse.json({ message: 'Vote recorded' });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to record vote', error: error.message }, { status: 500 });
  }
}
