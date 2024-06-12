"use client";

import classes from "./Sidebar.module.css";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import Link from "next/link";

function Sidebar() {
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
  let clubList = null;
  let nameCreated;
  if (createdClub) {
    nameCreated = createdClub.name;
  } else {
    nameCreated = null;
  }

  const handleSignOut = () => {
    signOut({
      callbackUrl: "/auth", // Redirect to the home page or any desired page after sign out
    });
  };

  const [showList, setShowList] = useState(false);

  if (joinedClubs.length > 0) {
    clubList = (
      <ul className={classes.clublist}>
        {nameCreated && (
          <li className={`${classes.clublistleader} ${classes.clublistcon}`}>
            <Link href={`/clubs/${createdClub._id}/members`}>
              {createdClub.name} (Leader)
            </Link>
          </li>
        )}
        {joinedClubs.map((club) => {
          if (nameCreated && club.name === nameCreated) {
            return;
          } else {
            return (
              <li key={club._id} className={classes.clublistcon}>
                <Link href={`/clubs/${club._id}/members`}>{club.name}</Link>
              </li>
            );
          }
        })}
      </ul>
    );
  } else {
    clubList = <p className={classes.clublistcon}>empty</p>;
  }
  function showListHandler() {
    setShowList((prev) => !prev);
  }

  return (
    <div>
      <div className={classes.sidebar}>
        <ul className={classes.nav}>
          <li>
            <button
              className={classes.logo}
              onClick={() => {
                router.push("/");
              }}
            >
              Bookland
            </button>
          </li>
          <li>
            <button className={classes.showlist} onClick={showListHandler}>
              List of my Clubs
            </button>
            {showList && clubList}
          </li>
          <li className={classes.logoutlist}>
            <button className={classes.logout} onClick={handleSignOut}>
              Log Out
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Sidebar;
