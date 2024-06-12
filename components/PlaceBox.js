// components/PlaceBox.js
'use client'
import React from 'react';
import styles from '@/styles/PlaceBox.module.css';

export default function PlaceBox({ place }) {
  return (
    <div className={styles.placeBox}>
      <h3>{place.name}</h3>
      {place.photo && (
        <img src={place.photo} alt={place.name} className={styles.placeImage} />
      )}
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
