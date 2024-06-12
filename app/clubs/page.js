// app/clubs/[id]/page.js
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image"; // Import Next.js Image component
import classes from "./clubs.module.css";

export default function ClubsPage() {
  const [clubs, setClubs] = useState([]);
  const router = useRouter();

  useEffect(() => {
    async function fetchClubs() {
      const res = await fetch("/api/clubs");
      const data = await res.json();
      setClubs(data);
      console.log(data);
    }

    fetchClubs();
  }, []);

  return (
    <div>
      <h1>Clubs</h1>
      <div className={classes.clubList}>
        {clubs.map((club) => (
          <div key={club._id} className={classes.clubItem}>
            <Image
              src="/images/book-icon.png"
              alt="Book Icon"
              width={24}
              height={24}
              className={classes.icon}
            />
            <Link href={`/clubs/${club._id}`} className={classes.clubName}>
              <span>{club.name}</span>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
