// app/api/voting/step1/results/route.js

import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const clubId = searchParams.get('clubId');

    if (!clubId || !ObjectId.isValid(clubId)) {
      return NextResponse.json({ message: 'Invalid club ID' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();

    // Fetch voting results for the given clubId
    const votingResults = await db.collection('voting').find({ clubId }).toArray();
    // Extract the districts from the voting results
    const proposedDistricts = votingResults.map(result => result.step1).filter(Boolean);

    return NextResponse.json([...new Set(proposedDistricts)]); // Ensure unique districts
  } catch (error) {
    return NextResponse.json({ message: 'Failed to fetch proposed districts', error: error.message }, { status: 500 });
  }
}
