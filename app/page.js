'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '../components/ProtectedRoute';
import ImageSlideshow from '../components/ImageSlideshow';
import Link from 'next/link';

function HomePage() {
  const { data: session, status } = useSession();
  const [createdClub, setCreatedClub] = useState(null);
  const [joinedClubs, setJoinedClubs] = useState([]);
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated') {
      async function fetchUserData() {
        const userId = session.user.id;
        const res = await fetch(`/api/users/${userId}`);
        const data = await res.json();
        setCreatedClub(data.createdClub);
        setJoinedClubs(data.joinedClubs);
      }
      fetchUserData();
    }
  }, [status, session]);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      <h1 className="main-header">{session?.user?.name}, welcome to BookLand</h1>
      <div className="content">
        <div className="slideshow">
          <ImageSlideshow />
        </div>
        <div className="details">
          <div className="buttons">
            <button className="button" onClick={() => router.push('/clubs')}>View Clubs</button>
            <button className="button" onClick={() => router.push('/clubs/create')}>Create Club</button>
          </div>
          <div>
            <h2>My Created Club</h2>
            {createdClub ? (
              <div>
                <h3 className="club-name">
                  <Link href={`/clubs/${createdClub._id}/members`}>{createdClub.name}</Link>
                </h3>
              </div>
            ) : (
              <p>You have not created any club.</p>
            )}
          </div>
          <div>
            <h2>My Joined Clubs</h2>
            {joinedClubs.length > 0 ? (
              joinedClubs.map(club => (
                <div key={club._id}>
                  <h3>
                    <Link href={`/clubs/${club._id}/members`}>{club.name}</Link>
                  </h3>
                </div>
              ))
            ) : (
              <p>You have not joined any clubs.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProtectedHomePage() {
  return (
    <ProtectedRoute>
      <HomePage />
    </ProtectedRoute>
  );
}
