'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ClubsPage() {
  const [clubs, setClubs] = useState([]);
  const router = useRouter();

  useEffect(() => {
    async function fetchClubs() {
      const res = await fetch('/api/clubs');
      const data = await res.json();
      setClubs(data);
    }

    fetchClubs();
  }, []);

  return (
    <div>
      <h1>Clubs</h1>
      <ul>
        {clubs.map((club) => (
          <li key={club._id}>
            <Link href={`/clubs/${club._id}`}>
              {club.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
