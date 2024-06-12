"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import classes from "../votingpage.module.css";

export default function Step2Page({ params }) {
  const { id: clubId } = params;
  const { data: session } = useSession();
  const [club, setClub] = useState(null);
  const [proposedDistricts, setProposedDistricts] = useState([]);
  const [ranking, setRanking] = useState({ rank1: "", rank2: "", rank3: "" });
  const router = useRouter();

  useEffect(() => {
    async function fetchClubAndProposedDistricts() {
      try {
        const clubRes = await fetch(`/api/clubs/${clubId}`);
        if (!clubRes.ok) throw new Error("Failed to fetch club");
        const clubData = await clubRes.json();
        setClub(clubData);

        const districtsRes = await fetch(
          `/api/voting/step1/results?clubId=${clubId}`
        );
        if (!districtsRes.ok)
          throw new Error("Failed to fetch proposed districts");
        const districtsData = await districtsRes.json();
        console.log("Fetched proposed districts:", districtsData);
        setProposedDistricts(districtsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchClubAndProposedDistricts();
  }, [clubId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRanking((prevRanking) => ({ ...prevRanking, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("/api/voting/step2", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: session.user.id,
        clubId,
        ranking,
      }),
    });

    if (res.ok) {
      alert("Rankings recorded successfully");
      router.push(`/clubs/${clubId}/members`);
    } else {
      const errorData = await res.json();
      alert("Failed to record rankings: " + errorData.message);
    }
  };

  if (!club) {
    return <div>Loading...</div>;
  }

  if (!club.votingStatus || club.votingStatus.step2 !== "in progress") {
    return <div>Please wait, this step has not started yet.</div>;
  }

  return (
    <div>
      <h1>Rank the Proposed Districts</h1>
      <form onSubmit={handleSubmit} className={classes.form}>
        <div className={`form-group ${classes.label}`}>
          <label htmlFor="rank1">First Choice: </label>
          <select
            className={classes.input}
            id="rank1"
            name="rank1"
            value={ranking.rank1}
            onChange={handleChange}
            required
          >
            <option value="" disabled>
              Select a district
            </option>
            {proposedDistricts.map((district) => (
              <option key={district} value={district}>
                {district}
              </option>
            ))}
          </select>
        </div>
        <div className={`form-group ${classes.label}`}>
          <label htmlFor="rank2">Second Choice: </label>
          <select
            className={classes.input}
            id="rank2"
            name="rank2"
            value={ranking.rank2}
            onChange={handleChange}
            required
          >
            <option value="" disabled>
              Select a district
            </option>
            {proposedDistricts.map((district) => (
              <option key={district} value={district}>
                {district}
              </option>
            ))}
          </select>
        </div>
        <div className={`form-group ${classes.label}`}>
          <label htmlFor="rank3">Third Choice: </label>
          <select
            className={classes.input}
            id="rank3"
            name="rank3"
            value={ranking.rank3}
            onChange={handleChange}
            required
          >
            <option value="" disabled>
              Select a district
            </option>
            {proposedDistricts.map((district) => (
              <option key={district} value={district}>
                {district}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className={classes.btnSubmit}>
          Submit
        </button>
      </form>
    </div>
  );
}
