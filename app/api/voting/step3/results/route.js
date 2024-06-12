// pages/api/voting/step3/results/route.js
import { NextResponse } from 'next/server';
import { MongoObjectId, clientPromise } from '@/lib/mongoUtil';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const clubId = searchParams.get('clubId');

  if (!clubId || !MongoObjectId.isValid(clubId)) {
    return NextResponse.json({ message: 'Invalid club ID' }, { status: 400 });
  }

  try {
    const client = await clientPromise;
    const db = client.db();

    const votingResults = await db.collection('voting').find({ clubId }).toArray();
    const voteCounts = {};

    votingResults.forEach((result) => {
      const placeId = result.step3;
      if (placeId) {
        if (voteCounts[placeId]) {
          voteCounts[placeId]++;
        } else {
          voteCounts[placeId] = 1;
        }
      }
    });

    let winningPlace = null;
    let maxVotes = 0;

    for (const placeId in voteCounts) {
      if (voteCounts[placeId] > maxVotes) {
        maxVotes = voteCounts[placeId];
        winningPlace = placeId;
      }
    }

    if (!winningPlace) {
      return NextResponse.json({ message: 'No voting results found' });
    }

    return NextResponse.json({ winner: winningPlace });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to fetch voting results', error: error.message }, { status: 500 });
  }
}
