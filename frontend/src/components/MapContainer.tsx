import React, { ReactElement, useEffect, useState } from "react";
import { Map, GoogleApiWrapper, Marker } from "google-maps-react";

const locations: google.maps.LatLngLiteral[] = [
  { lat: 49.246213, lng: -123.1691 },
  { lat: 49.25114, lng: -123.17152 },
  { lat: 49.263234, lng: -123.1619 },
  { lat: 49.25813, lng: -123.17712 },
  { lat: 49.255212, lng: -123.18212 },
];

function mapCenter(locations: google.maps.LatLngLiteral[]) {
  const avg = (arr: number[]) => arr.reduce((acc, num) => acc + num, 0) / arr.length;
  return {
    lat: avg(locations.map(({ lat }) => lat)),
    lng: avg(locations.map(({ lng }) => lng)),
  };
}

function MapContainer({
  dimensions,
  google,
}: {
  dimensions: { width: string; height: string };
  google: typeof globalThis.google;
}): ReactElement {
  const [restaurants] = useState<google.maps.LatLngLiteral[]>(locations);

  useEffect(() => {
    // Note: the following is not considered best practice, but is a hacky way to access the DOM Element
    // within the Map component that has the width and height pre-set to 100%
    const container = document.getElementById("content-container");
    const target = container?.firstChild?.firstChild as HTMLElement;
    target.style.removeProperty("height");
    target.style.removeProperty("width");
  }, []);

  return (
    <Map google={google} zoom={15} style={dimensions} initialCenter={mapCenter(locations)}>
      {restaurants.map((coordinates: google.maps.LatLngLiteral, index: number) => (
        <Marker key={index} position={coordinates} onClick={() => alert("Click")} />
      ))}
    </Map>
  );
}

const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY as string;
export default GoogleApiWrapper({ apiKey })(MapContainer);
