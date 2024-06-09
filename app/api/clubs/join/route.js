// app/api/clubs/join/route.js

import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(req) {
  try {
    const { clubId, userId } = await req.json();

    const client = await clientPromise;
    const db = client.db();

    const club = await db.collection('clubs').findOne({ _id: new ObjectId(clubId) });

    if (!club) {
      return NextResponse.json({ message: 'Club not found' }, { status: 404 });
    }

    if (club.members.includes(userId)) {
      return NextResponse.json({ message: 'User already a member of the club' }, { status: 400 });
    }

    await db.collection('clubs').updateOne(
      { _id: new ObjectId(clubId) },
      { $push: { members: userId } }
    );

    // Return the updated club information
    const updatedClub = await db.collection('clubs').findOne({ _id: new ObjectId(clubId) });

    return NextResponse.json(updatedClub, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to join club', error: error.message }, { status: 500 });
  }
}
