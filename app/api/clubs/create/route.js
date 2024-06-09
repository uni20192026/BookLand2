// app/api/clubs/create/route.js

import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function POST(req) {
  try {
    const { name, creatorId } = await req.json();

    if (!name || !creatorId) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();

    const existingClub = await db.collection("clubs").findOne({ creatorId });

    if (existingClub) {
      return NextResponse.json({ message: "User has already created a club" }, { status: 400 });
    }

    const result = await db.collection("clubs").insertOne({
      name,
      creatorId,
      members: [creatorId],
      votingStatus: {
        step1: 'not started',
        step2: 'not started',
        step3: 'not started',
      }
    });

    return NextResponse.json({ message: "Club created", clubId: result.insertedId }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Failed to create club", error: error.message }, { status: 500 });
  }
}
