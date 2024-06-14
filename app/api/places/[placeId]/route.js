// /pages/api/places/[placeId]/route.js
import { NextResponse } from "next/server";
import { MongoObjectId, clientPromise } from "@/lib/mongoUtil";

export async function GET(request, { params }) {
  const placeId = params.placeId;

  if (!MongoObjectId.isValid(placeId)) {
    return NextResponse.json({ message: "Invalid place ID" }, { status: 400 });
  }

  try {
    const client = await clientPromise;
    const db = client.db();
    const placeDetails = await db
      .collection("places")
      .findOne({ _id: MongoObjectId(placeId) });

    if (!placeDetails) {
      return NextResponse.json({ message: "Place not found" }, { status: 404 });
    }

    return NextResponse.json(placeDetails);
  } catch (error) {
    console.error("Error fetching place details:", error.message);
    return NextResponse.json(
      { message: "Failed to fetch place details", error: error.message },
      { status: 500 }
    );
  }
}
