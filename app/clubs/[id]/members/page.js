"use client";

// pages/app/clubs/[id]/members/page.js

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import StepBox from "@/components/StepBox"; // Import the StepBox component
import WinnerDisplay from "@/components/WinnerDisplay"; // New component for winner display
import styles from "@/styles/MemberPage.module.css";

export default function MemberPage({ params }) {
  const { id } = params;
  const { data: session } = useSession();
  const [club, setClub] = useState(null);
  const [votingFinished, setVotingFinished] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function fetchClub() {
      const res = await fetch(`/api/clubs/${id}`);
      if (!res.ok) {
        console.error("Failed to fetch club data:", await res.json());
        return;
      }
      const data = await res.json();
      setClub(data);

      // Check the status of voting step 3
      if (data.votingStatus?.step3 === "finished") {
        // Fetch the winner for step 3 voting results
        const resResults = await fetch(
          `/api/voting/step3/results?clubId=${id}`
        );
        if (resResults.ok) {
          const winnerData = await resResults.json();
          if (winnerData && winnerData.winner) {
            setVotingFinished(true);
          }
        }
      }
    }

    fetchClub();
  }, [id]);

  const handleStatusChange = async (step, action) => {
    const res = await fetch("/api/voting/status", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ clubId: id, step, action }),
    });

    if (res.ok) {
      const updatedClub = { ...club };
      if (action === "start") updatedClub.votingStatus[step] = "in progress";
      else if (action === "finish") {
        updatedClub.votingStatus[step] = "finished";
        if (step === "step1") updatedClub.votingStatus["step2"] = "in progress";
        if (step === "step2") updatedClub.votingStatus["step3"] = "in progress";
      }
      setClub(updatedClub);
    } else {
      const errorData = await res.json();
      alert("Failed to update status: " + errorData.message);
    }
  };

  if (!club) {
    return <div>Loading...</div>;
  }

  const isCreator = session?.user?.id === club.creatorId;
  const votingStatus = club.votingStatus || {};
  const step1Status = votingStatus.step1 || "not started";
  const step2Status = votingStatus.step2 || "not started";
  const step3Status = votingStatus.step3 || "not started";

  let curstatus;
  if (step1Status === "in progress") {
    curstatus = <h3>District choosing is in progress.</h3>;
  } else if (step1Status === "finished" && step2Status === "in progress") {
    curstatus = <h3>Voting for district is in progress.</h3>;
  } else if (step2Status === "finished" && step3Status === "in progress") {
    curstatus = <h3>Restaurant choosing is in progress.</h3>;
  } else if (step3Status === "finished") {
    curstatus = (
      <Link href={`/clubs/${id}/results`} className={styles.resultLink}>
        <h3>Vote is ended. Go to Result Page</h3>
      </Link>
    );
  } else {
    curstatus = (
      <h3>
        Voting has not yet started. Please wait for leader to open the vote.
      </h3>
    );
  }
  return (
    <div className={styles.container}>
      <h1>Club {club.name}</h1>
      <p>Members: {club.members.length}</p>

      <h2>Please choose your location for meeting.</h2>
      {curstatus}

      <div className={styles.gridContainer}>
        <StepBox
          step="Step 1>> District Choosing"
          status={step1Status}
          isCreator={isCreator}
          clubId={id}
          stepName="step1"
          onStatusChange={handleStatusChange}
        />
        <StepBox
          step="Step 2>> Voting for District"
          status={step2Status}
          isCreator={isCreator}
          clubId={id}
          stepName="step2"
          onStatusChange={handleStatusChange}
        />
        <StepBox
          step="Step 3>> Restaurant Choosing"
          status={step3Status}
          isCreator={isCreator}
          clubId={id}
          stepName="step3"
          onStatusChange={handleStatusChange}
        />
      </div>
    </div>
  );
}
