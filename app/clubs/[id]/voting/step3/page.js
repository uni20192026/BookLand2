// pages/app/clubs/[id]/voting/step3/page.js
"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import PlaceBox from "@/components/PlaceBox";
import "@/app/globals.css";

import classes from "../votingpage.module.css";
import styles from "@/styles/PlaceBox.module.css";

export default function Step3Page({ params }) {
  const { id: clubId } = params;
  const { data: session } = useSession();
  const [club, setClub] = useState(null);
  const [places, setPlaces] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState("");
  const router = useRouter();

  useEffect(() => {
    async function fetchClubAndPlaces() {
      const res = await fetch(`/api/clubs/${clubId}`);
      const clubData = await res.json();
      setClub(clubData);

      const districtRes = await fetch(
        `/api/voting/step2/results?clubId=${clubId}`
      );
      const districts = await districtRes.json();

      if (districts.length > 0) {
        const placesPromises = districts.map((district, index) => {
          let count = 1;

          if (index === 0) count = 3;
          else if (index === 1) count = 2;
          else if (index === 2) count = 1;

          return fetch(`/api/places?district=${district}&count=${count}`);
        });

        const results = await Promise.all(placesPromises);
        const placesData = await Promise.all(results.map((res) => res.json()));
        const flattenedPlaces = placesData.flat();
        setPlaces(flattenedPlaces);
      }
    }

    fetchClubAndPlaces();
  }, [clubId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedPlace) {
      alert("Please select a place.");
      return;
    }

    const res = await fetch("/api/voting/step3", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: session.user.id,
        clubId,
        selectedPlace,
      }),
    });

    if (res.ok) {
      alert("Vote recorded successfully");
      router.push(`/clubs/${clubId}/members`);
    } else {
      const errorData = await res.json();
      alert("Failed to record vote: " + errorData.message);
    }
  };

  const handlePlaceChange = (e) => {
    setSelectedPlace(e.target.value);
  };

  if (!club) {
    return <div>Loading...</div>;
  }

  if (!club.votingStatus || club.votingStatus.step3 !== "in progress") {
    return <div>Please wait, this step has not started yet.</div>;
  }

  return (
    <div>
      <h1>Choose a Coffee Shop</h1>
      <form onSubmit={handleSubmit} className={classes.form}>
        <div className={classes.label}>
          <label htmlFor="place">Select a place: </label>
          <select
            className={classes.input}
            id="place"
            value={selectedPlace}
            onChange={handlePlaceChange}
            required
          >
            <option value="" disabled>
              Select a place
            </option>
            {places.map((place) => (
              <option key={place.place_id} value={place.place_id}>
                {place.name}
              </option>
            ))}
          </select>
        </div>
        {places.length > 0 ? (
          <div className={styles.placeList}>
            {places.map((place) => (
              <PlaceBox key={place.place_id} place={place} />
            ))}
          </div>
        ) : (
          <p>Loading coffee shops...</p>
        )}
        <button type="submit" className={classes.btnSubmit}>
          Submit
        </button>
      </form>
    </div>
  );
}
