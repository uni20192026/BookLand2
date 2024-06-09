import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(request, { params }) {
  try {
    const { id } = params;

    const client = await clientPromise;
    const db = client.db();

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ message: "Invalid user ID" }, { status: 400 });
    }

    const user = await db.collection("users").findOne({ _id: new ObjectId(id) });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const createdClub = await db.collection("clubs").findOne({ creatorId: id });
    const joinedClubs = await db.collection("clubs").find({ members: id }).toArray();

    return NextResponse.json({ user, createdClub, joinedClubs });
  } catch (error) {
    return NextResponse.json({ message: "Failed to fetch user", error: error.message }, { status: 500 });
  }
}
