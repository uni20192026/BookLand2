'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function MemberPage({ params }) {
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

  const handleStatusChange = async (step, action) => {
    const res = await fetch('/api/voting/status', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ clubId: id, step, action }),
    });

    if (res.ok) {
      const updatedClub = { ...club };
      if (action === 'start') updatedClub.votingStatus[step] = 'in progress';
      else if (action === 'finish') {
        updatedClub.votingStatus[step] = 'finished';
        if (step === 'step1') updatedClub.votingStatus['step2'] = 'in progress';
        if (step === 'step2') updatedClub.votingStatus['step3'] = 'in progress';
      }
      setClub(updatedClub);
    } else {
      const errorData = await res.json();
      alert('Failed to update status: ' + errorData.message);
    }
  };

  if (!club) {
    return <div>Loading...</div>;
  }

  const isCreator = session?.user?.id === club.creatorId;

  const votingStatus = club.votingStatus || {};
  const step1Status = votingStatus.step1 || 'not started';
  const step2Status = votingStatus.step2 || 'not started';
  const step3Status = votingStatus.step3 || 'not started';

  return (
    <div>
      <h1>Dear member of {club.name}, lets choose a meeting location</h1>
      <p>Members: {club.members.length}</p>
      <ul>
        {club.members.map(member => (
          <li key={member}>{member}</li>
        ))}
      </ul>
      <p>Status: {step3Status === 'finished' ? 'Voting has finished' : `Current step: ${step1Status === 'in progress' ? 'District choosing is in progress' : step1Status === 'finished' && step2Status === 'in progress' ? 'Voting for district is in progress' : step2Status === 'finished' && step3Status === 'in progress' ? 'Restaurant choosing is in progress' : 'Voting has not started'}`}</p>
      <ul>
        <li>
          <Link href={`/clubs/${id}/voting/step1`}>Step 1: District Choosing</Link> - {step1Status}
          {isCreator && step1Status === 'not started' && <button onClick={() => handleStatusChange('step1', 'start')}>Start</button>}
          {isCreator && step1Status === 'in progress' && <button onClick={() => handleStatusChange('step1', 'finish')}>Finish</button>}
        </li>
        <li>
          <Link href={`/clubs/${id}/voting/step2`}>Step 2: Voting for District</Link> - {step2Status}
          {isCreator && step2Status === 'in progress' && <button onClick={() => handleStatusChange('step2', 'finish')}>Finish</button>}
        </li>
        <li>
          <Link href={`/clubs/${id}/voting/step3`}>Step 3: Restaurant Choosing</Link> - {step3Status}
          {isCreator && step3Status === 'in progress' && <button onClick={() => handleStatusChange('step3', 'finish')}>Finish</button>}
        </li>
      </ul>
    </div>
  );
}
