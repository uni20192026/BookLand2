'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

export default function ResultsPage({ params }) {
  const { id: clubId } = params;
  const { data: session } = useSession();
  const [winningLocation, setWinningLocation] = useState(null);

  useEffect(() => {
    async function fetchResults() {
      const res = await fetch(`/api/voting/results?clubId=${clubId}`);
      const data = await res.json();
      setWinningLocation(data.winningLocation);
    }

    fetchResults();
  }, [clubId]);

  if (!winningLocation) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Winning Location</h1>
      <p>The chosen location for your club meeting is:</p>
      <h2>{winningLocation}</h2>
    </div>
  );
}
