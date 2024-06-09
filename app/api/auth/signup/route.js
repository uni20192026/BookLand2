import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import clientPromise from '../../../../lib/mongodb';

export async function POST(req) {
  const body = await req.json();
  const { name, email, password } = body;

  if (!name || !email || !password) {
    return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
  }

  const client = await clientPromise;
  const db = client.db();

  const existingUser = await db.collection('users').findOne({ email });

  if (existingUser) {
    return NextResponse.json({ message: 'Email already in use' }, { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const result = await db.collection('users').insertOne({
    name,
    email,
    password: hashedPassword,
  });

  return NextResponse.json({ message: 'User created', userId: result.insertedId }, { status: 201 });
}
