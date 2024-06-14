"use client";

import { useState, useEffect } from "react";
import PlaceDetails from "@/components/PlaceDetails"; // Adjust the import path as necessary
import GoogleMapComponent from "@/components/GoogleMapComponent";

export default function ResultPage({ params }) {
  const { id } = params;
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const res = await fetch(`/api/voting/step3/results?clubId=${id}`);
        if (res.ok) {
          const data = await res.json();
          if (data.winner) {
            setResult(data.winner);
          } else {
            setResult(null);
          }
        } else {
          setError(`Error: ${res.statusText}`);
        }
      } catch (error) {
        setError(`Fetch error: ${error.message}`);
      }
    };

    fetchResult(); // Fetch result immediately on component mount
  }, [id]); // Ensures it doesn't run infinitely by using id as a dependency to monitor

  return (
    <div>
      <h1>Meeting Place Result</h1>
      {error && <p className="error">{error}</p>}

      {result ? (
        <div>
          <a
            href={`https://www.google.com/maps/place/?q=place_id:${result.placeId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mapButton"
          >
            View on Google Maps
          </a>
        </div>
      ) : (
        <p>No result yet</p>
      )}
    </div>
  );
}
