// pages/api/voting/step3/finish.js

import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(request) {
  try {
    const { clubId } = await request.json(); // Fetch the clubId from the request body

    if (!clubId || !ObjectId.isValid(clubId)) {
      return NextResponse.json({ message: 'Invalid club ID' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();

    // Update voting status to finished
    await db.collection('clubs').updateOne(
      { _id: new ObjectId(clubId) },
      {
        $set: {
          'votingStatus.step3': 'finished', // Update voting status to finished
        },
      }
    );

    // Call the results API to determine the winning place
    const winnerResponse = await fetch(`/api/voting/step3/results?clubId=${clubId}`);
    const winnerData = await winnerResponse.json();

    if (winnerResponse.ok && winnerData.winner) {
      // Send a successful response with the winner
      return NextResponse.json({ winner: winnerData.winner });
    } else {
      // Send a failed response in case of an error
      return NextResponse.json({ message: 'Failed to determine winner' }, { status: 500 });
    }
  } catch (error) {
    // Catch and return server-side error
    return NextResponse.json(
      { message: 'Failed to finish voting and determine winner', error: error.message },
      { status: 500 }
    );
  }
}
