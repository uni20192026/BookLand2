import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const clubId = searchParams.get("clubId");

  if (!clubId) {
    return NextResponse.json({ message: "Invalid club ID" }, { status: 400 });
  }

  try {
    const client = await clientPromise;
    const db = client.db();

    // Fetch voting results for the specified club ID
    const votingResults = await db
      .collection("voting")
      .find({ clubId })
      .toArray();
    const voteCounts = {};

    // Count votes for each coffee shop place
    votingResults.forEach((result) => {
      const placeId = result.step3;
      if (placeId) {
        if (voteCounts[placeId]) {
          voteCounts[placeId]++;
        } else {
          voteCounts[placeId] = 1;
        }
      }
    });

    // Determine the winning place ID
    let winningPlaceId = null;
    let maxVotes = 0;
    for (const placeId in voteCounts) {
      if (voteCounts[placeId] > maxVotes) {
        maxVotes = voteCounts[placeId];
        winningPlaceId = placeId;
      }
    }

    // If no winning place, return appropriate message
    if (!winningPlaceId) {
      return NextResponse.json({ message: "No voting results found" });
    }

    // Fetch place details for the winning place ID
    const winningResult = votingResults.find(
      (result) => result.step3 === winningPlaceId
    );

    return NextResponse.json({
      winner: {
        placeId: winningPlaceId,
        name: winningResult.placeName,
        link: winningResult.placeLink,
      },
    });
  } catch (error) {
    // Handle errors during the API request
    return NextResponse.json(
      { message: "Failed to fetch voting results", error: error.message },
      { status: 500 }
    );
  }
}
