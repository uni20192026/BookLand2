'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function ClubInfoPage({ params }) {
  const { id } = params;
  const { data: session } = useSession();
  const [club, setClub] = useState(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchClub() {
      const res = await fetch(`/api/clubs/${id}`);
      if (!res.ok) {
        console.error('Failed to fetch club data:', await res.json());
        return;
      }
      const data = await res.json();
      setClub(data);
    }
    fetchClub();
  }, [id]);

  const handleJoin = async () => {
    if (!session) {
      alert('You must be logged in to join the club.');
      router.push('/auth');
      return;
    }

    const res = await fetch('/api/clubs/join', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        clubId: id,
        userId: session.user.id,
      }),
    });

    if (res.ok) {
      alert('Successfully joined the club!');
      const updatedClub = await res.json();
      setClub(updatedClub);
    } else {
      const errorData = await res.json();
      alert('Failed to join the club: ' + errorData.message);
    }
  };

  if (!club) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{club.name}</h1>
      <p>Members: {club.members.length}</p>
      <button onClick={handleJoin}>Join Club</button>
    </div>
  );
}
