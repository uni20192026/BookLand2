import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const district = searchParams.get("district");
  const count = parseInt(searchParams.get("count"), 10);

  if (!district || !count) {
    return NextResponse.json(
      { error: "Missing district or count" },
      { status: 400 }
    );
  }

  console.log(`Fetching places for district: ${district}, count: ${count}`);

  const response = await fetch(
    `https://maps.googleapis.com/maps/api/place/textsearch/json?query=coffee+shops+in+${district}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
  );
  const data = await response.json();

  console.log("Google Places API response:", data);

  if (data.status === "OK") {
    const places = data.results.slice(0, count).map((place) => ({
      place_id: place.place_id,
      name: place.name,
      photo: place.photos
        ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${place.photos[0].photo_reference}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
        : null,
      link: `https://www.google.com/maps/place/?q=place_id:${place.place_id}`,
      location: place.geometry.location,
    }));
    return NextResponse.json(places);
  } else {
    return NextResponse.json({ error: data.error_message }, { status: 500 });
  }
}
