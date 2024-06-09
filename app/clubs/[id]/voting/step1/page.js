'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import districts from '@/data/districts';

export default function Step1Page({ params }) {
  const { id: clubId } = params;
  const { data: session } = useSession();
  const [club, setClub] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const router = useRouter();

  useEffect(() => {
    async function fetchClub() {
      const res = await fetch(`/api/clubs/${clubId}`);
      const data = await res.json();
      setClub(data);
    }
    fetchClub();
  }, [clubId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch('/api/voting/step1', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: session.user.id,
        clubId,
        district: selectedDistrict
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

  if (!club) {
    return <div>Loading...</div>;
  }

  if (!club.votingStatus || club.votingStatus.step1 !== 'in progress') {
    return <div>Please wait, this step has not started yet.</div>;
  }

  return (
    <div>
      <h1>Select a District</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="district">Choose a district:</label>
        <select
          id="district"
          value={selectedDistrict}
          onChange={(e) => setSelectedDistrict(e.target.value)}
          required
        >
          <option value="" disabled>Select a district</option>
          {districts.map((district) => (
            <option key={district} value={district}>
              {district}
            </option>
          ))}
        </select>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
