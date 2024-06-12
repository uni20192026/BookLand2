"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

import classes from "./auth.module.css";

export default function Auth() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const router = useRouter();

  async function handleSignUp(e) {
    e.preventDefault();
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    });
    if (res.ok) {
      alert("User created successfully");
      setIsSignUp(false);
    } else {
      const data = await res.json();
      alert(`Failed to create user: ${data.message}`);
    }
  }

  const handleSignIn = async (e) => {
    e.preventDefault();
    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
      callbackUrl: `${window.location.origin}/protected`,
    });

    if (res?.ok) {
      router.push("/"); // Ensure the redirection is to the protected page
    } else {
      alert("Failed to sign in");
    }
  };

  return (
    <div>
      <h1>{isSignUp ? "Sign Up" : "Sign In"}</h1>
      <form onSubmit={isSignUp ? handleSignUp : handleSignIn}>
        {isSignUp && (
          <div className={classes.label}>
            <label htmlFor="name">Name:</label>
            <input
              className={classes.input}
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        )}
        <div className={classes.label}>
          <label htmlFor="email">Email:</label>
          <input
            className={classes.input}
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className={classes.label}>
          <label htmlFor="password">Password:</label>
          <input
            className={classes.input}
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className={classes.btnContainer}>
          <button type="submit" className={classes.btnSubmit}>
            {isSignUp ? "Sign Up" : "Sign In"}
          </button>
          <button
            type="button"
            className={classes.btnBottum}
            onClick={() => setIsSignUp(!isSignUp)}
          >
            {isSignUp
              ? "Already have an account? Sign In"
              : "New here? Sign Up"}
          </button>
        </div>
      </form>
    </div>
  );
}
