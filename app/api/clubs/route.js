import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  const client = await clientPromise;
  const db = client.db();
  const clubs = await db.collection('clubs').find().toArray();
  return NextResponse.json(clubs);
}

export async function POST(req) {
  const body = await req.json();
  const { name, creatorId } = body;

  const client = await clientPromise;
  const db = client.db();

  const newClub = {
    name,
    creatorId,
    members: [creatorId],
  };

  const result = await db.collection('clubs').insertOne(newClub);
  return NextResponse.json(result.ops[0]);
}
