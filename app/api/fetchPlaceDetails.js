import axios from "axios";

export default async function handler(req, res) {
  const { placeId } = req.query;
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${apiKey}`
    );
    const data = response.data;

    if (data.status === "OK") {
      const { name, url, geometry, photos } = data.result;
      const photoUrl =
        photos && photos.length > 0
          ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photos[0].photo_reference}&key=${apiKey}`
          : null;
      res.status(200).json({
        name,
        link: url,
        location: geometry.location,
        photo: photoUrl,
      });
    } else {
      res
        .status(400)
        .json({ error: data.error_message || "Failed to fetch place details" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
