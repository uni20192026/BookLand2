import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const clubId = searchParams.get('clubId');

  if (!clubId || !ObjectId.isValid(clubId)) {
    return NextResponse.json({ message: 'Invalid club ID' }, { status: 400 });
  }

  try {
    const client = await clientPromise;
    const db = client.db();

    const votingResults = await db.collection('voting').find({ clubId }).toArray();
    const districtScores = {};

    votingResults.forEach(result => {
      const ranking = result.step2;
      if (ranking) {
        if (ranking.rank1) {
          districtScores[ranking.rank1] = (districtScores[ranking.rank1] || 0) + 2;
        }
        if (ranking.rank2) {
          districtScores[ranking.rank2] = (districtScores[ranking.rank2] || 0) + 1.5;
        }
        if (ranking.rank3) {
          districtScores[ranking.rank3] = (districtScores[ranking.rank3] || 0) + 1;
        }
      }
    });

    
    const sortedDistricts = Object.keys(districtScores).sort((a, b) => districtScores[b] - districtScores[a]);
    const topDistricts = sortedDistricts.slice(0, 3);

    return NextResponse.json(topDistricts);
  } catch (error) {
    return NextResponse.json({ message: 'Failed to fetch proposed districts', error: error.message }, { status: 500 });
  }
}
