"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import classes from "./create.module.css";

export default function CreateClubPage() {
  const { data: session } = useSession();
  const [clubName, setClubName] = useState("");
  const router = useRouter();

  const handleCreateClub = async (e) => {
    e.preventDefault();

    console.log(
      "Creating club with name:",
      clubName,
      "and creator ID:",
      session.user.id
    );

    const res = await fetch("/api/clubs/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: clubName, creatorId: session.user.id }),
    });

    if (res.ok) {
      console.log("Club created successfully");
      router.push("/clubs");
    } else {
      const errorData = await res.json();
      console.error("Failed to create club:", errorData.message);
      alert("Failed to create club: " + errorData.message);
    }
  };

  return (
    <div>
      <h1>Create a New Club</h1>
      <form onSubmit={handleCreateClub} className={classes.container}>
        <div className={classes.label}>
          <label>Club Name: </label>
          <input
            className={classes.input}
            type="text"
            value={clubName}
            onChange={(e) => setClubName(e.target.value)}
          />
        </div>
        <button type="submit" className={classes.btn}>
          Create Club
        </button>
      </form>
    </div>
  );
}
