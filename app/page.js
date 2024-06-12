"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "../components/ProtectedRoute";
import Link from "next/link";

import classes from "./homepage.module.css";

function HomePage() {
  const { data: session, status } = useSession();
  const [createdClub, setCreatedClub] = useState(null);
  const [joinedClubs, setJoinedClubs] = useState([]);
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
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

  if (status === "loading") {
    return <div>Loading...</div>;
  }
  if (status === "unauthenticated") {
    return <div>Please log in to access this page.</div>;
  }

  return (
    <div className="container">
      <h1>{session?.user?.name}, welcome to BookLand</h1>
      <div className={classes.buttonContainer}>
        <button
          className={classes.button}
          onClick={() => router.push("/clubs")}
        >
          Browse Clubs
        </button>
        <button
          className={classes.button}
          onClick={() => router.push("/clubs/create")}
        >
          Create Club
        </button>
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
