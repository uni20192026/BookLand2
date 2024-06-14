"use client";

import React, { useState, useEffect } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "400px",
};

const PlaceDetails = ({ placeId }) => {
  const [placeDetails, setPlaceDetails] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlaceDetails = async () => {
      try {
        const fields = "name,photos,rating";
        const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
        const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=${fields}&key=${apiKey}`;

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.result) {
          setPlaceDetails(data.result);
        } else {
          setError("No details found for this place.");
        }
      } catch (error) {
        setError(`Error fetching place details: ${error.message}`);
        console.error("Fetch error:", error.message);
      }
    };

    fetchPlaceDetails();
  }, [placeId]);

  if (error) {
    return <div>{error}</div>;
  }

  if (!placeDetails) {
    return <div>Loading...</div>;
  }

  const { name, photos, rating } = placeDetails;
  const photoUrl =
    photos && photos.length > 0 ? photos[0].photo_reference : null;
  const googleMapsLink = `https://www.google.com/maps/place/?q=place_id:${placeId}`;

  return (
    <div>
      <h1>{name}</h1>
      {photoUrl && (
        <img
          src={`https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${photoUrl}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`}
          alt={name}
        />
      )}
      <p>Rating: {rating}</p>
      <a href={googleMapsLink} target="_blank" rel="noopener noreferrer">
        View on Google Maps
      </a>
      <LoadScript
        googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
      >
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={{
            lat: placeDetails.geometry.location.lat,
            lng: placeDetails.geometry.location.lng,
          }}
          zoom={15}
        >
          <Marker
            position={{
              lat: placeDetails.geometry.location.lat,
              lng: placeDetails.geometry.location.lng,
            }}
          />
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default PlaceDetails;
