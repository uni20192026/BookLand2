'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function Step3Page({ params }) {
  const { id: clubId } = params;
  const { data: session } = useSession();
  const [club, setClub] = useState(null);
  const [places, setPlaces] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState('');
  const [selectedPlaceDetails, setSelectedPlaceDetails] = useState(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchClubAndPlaces() {
      const res = await fetch(`/api/clubs/${clubId}`);
      const clubData = await res.json();
      setClub(clubData);

      const districtRes = await fetch(`/api/voting/step2/results?clubId=${clubId}`);
      const districts = await districtRes.json();

      console.log('Fetched top districts:', districts);

      const placesPromises = districts.map((district, index) => 
        fetch(`/api/places?district=${district}&count=${Math.min(3 - index, 1)}`)
      );

      const results = await Promise.all(placesPromises);
      const placesData = await Promise.all(results.map(res => res.json()));
      const flattenedPlaces = placesData.flat();

      console.log('Fetched places:', flattenedPlaces);
      setPlaces(flattenedPlaces);
    }
    fetchClubAndPlaces();
  }, [clubId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch('/api/voting/step3', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: session.user.id,
        clubId,
        selectedPlace,
      }),
    });

    if (res.ok) {
      alert('Vote recorded successfully');
      router.push(`/clubs/${clubId}/members`);
    } else {
      const errorData = await res.json();
      alert('Failed to record vote: ' + errorData.message);
    }
  };

  const handlePlaceChange = (e) => {
    const placeId = e.target.value;
    setSelectedPlace(placeId);
    const placeDetails = places.find(place => place.place_id === placeId);
    setSelectedPlaceDetails(placeDetails);
  };

  if (!club) {
    return <div>Loading...</div>;
  }

  if (!club.votingStatus || club.votingStatus.step3 !== 'in progress') {
    return <div>Please wait, this step has not started yet.</div>;
  }

  return (
    <div>
      <h1>Choose a Coffee Shop</h1>
      {places.length > 0 ? (
        <>
          {selectedPlaceDetails && (
            <div className="selected-place-details">
              <h3>{selectedPlaceDetails.name}</h3>
              {selectedPlaceDetails.photo && <img src={selectedPlaceDetails.photo} alt={selectedPlaceDetails.name} style={{ width: '100px', height: '100px' }} />}
              <a href={selectedPlaceDetails.link} target="_blank" rel="noopener noreferrer">View on Google Maps</a>
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <label htmlFor="place">Select a place:</label>
            <select
              id="place"
              value={selectedPlace}
              onChange={handlePlaceChange}
              required
            >
              <option value="" disabled>Select a place</option>
              {places.map((place) => (
                <option key={place.place_id} value={place.place_id}>
                  {place.name}
                </option>
              ))}
            </select>
            <button type="submit">Submit</button>
          </form>
          <div className="place-list">
            {places.map(place => (
              <div key={place.place_id} className="place-item">
                <h3>{place.name}</h3>
                {place.photo && <img src={place.photo} alt={place.name} style={{ width: '100px', height: '100px' }} />}
                <a href={`https://www.google.com/maps/place/?q=place_id:${place.place_id}`} target="_blank" rel="noopener noreferrer">View on Google Maps</a>
              </div>
            ))}
          </div>
        </>
      ) : (
        <p>Loading coffee shops...</p>
      )}
    </div>
  );
}
