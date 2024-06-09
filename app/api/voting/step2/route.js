// app/api/voting/step2/route.js

import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function POST(request) {
  try {
    const { userId, clubId, ranking } = await request.json();

    const client = await clientPromise;
    const db = client.db();

    await db.collection('voting').updateOne(
      { clubId, userId },
      { $set: { step2: ranking } },
      { upsert: true }
    );

    return NextResponse.json({ message: 'Rankings recorded' });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to record rankings', error: error.message }, { status: 500 });
  }
}
