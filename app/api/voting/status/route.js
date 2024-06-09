import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(request) {
  try {
    const { clubId, step, action } = await request.json();

    if (!ObjectId.isValid(clubId)) {
      return NextResponse.json({ message: 'Invalid club ID' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();

    const update = {
      $set: {
        [`votingStatus.${step}`]: action === 'start' ? 'in progress' : 'finished',
      },
    };

    if (action === 'finish' && step === 'step1') {
      update.$set['votingStatus.step2'] = 'in progress';
    }

    if (action === 'finish' && step === 'step2') {
      update.$set['votingStatus.step3'] = 'in progress';
    }

    await db.collection('clubs').updateOne({ _id: new ObjectId(clubId) }, update);

    return NextResponse.json({ message: 'Voting status updated' });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to update voting status', error: error.message }, { status: 500 });
  }
}
