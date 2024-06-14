// components/PlaceBox.js
"use client";
import React from "react";
import styles from "@/styles/PlaceBox.module.css";
import Image from "next/image";

export default function PlaceBox({ place }) {
  return (
    <div className={styles.placeBox}>
      {place.photo && (
        <img
          src={place.photo}
          alt={place.name}
          className={styles.placeImage}
          layout="fill"
        />
      )}
      <h3>{place.name}</h3>
      <a
        href={`https://www.google.com/maps/place/?q=place_id:${place.place_id}`}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.mapLink}
      >
        View on Google Maps
      </a>
    </div>
  );
}
