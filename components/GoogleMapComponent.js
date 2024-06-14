"use client";

import React, { useState, useEffect } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "400px",
};

const GoogleMapComponent = ({ placeId }) => {
  const [placeDetails, setPlaceDetails] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlaceDetails = async () => {
      try {
        const fields = "name,geometry";
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

  const { geometry } = placeDetails;
  const location = geometry.location;

  return (
    <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={{ lat: location.lat, lng: location.lng }}
        zoom={15}
      >
        <Marker position={{ lat: location.lat, lng: location.lng }} />
      </GoogleMap>
    </LoadScript>
  );
};

export default GoogleMapComponent;
