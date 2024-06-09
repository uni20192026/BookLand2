import React from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '400px'
};

const center = {
  lat: 37.5665, // Center of Seoul
  lng: 126.9780
};

const GoogleMapComponent = ({ places }) => {
  return (
    <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
      <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={12}>
        {places.map((place, index) => (
          place.location && (
            <Marker
              key={index}
              position={{
                lat: place.location.lat,
                lng: place.location.lng
              }}
            />
          )
        ))}
      </GoogleMap>
    </LoadScript>
  );
}

export default GoogleMapComponent;
