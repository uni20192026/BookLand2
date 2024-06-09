// app/api/clubs/[id]/route.js

import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(request, { params }) {
  try {
    const { id } = params;

    const client = await clientPromise;
    const db = client.db();

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ message: "Invalid club ID" }, { status: 400 });
    }

    const club = await db.collection("clubs").findOne({ _id: new ObjectId(id) });

    if (!club) {
      return NextResponse.json({ message: "Club not found" }, { status: 404 });
    }

    return NextResponse.json(club);
  } catch (error) {
    return NextResponse.json({ message: "Failed to fetch club", error: error.message }, { status: 500 });
  }
}
