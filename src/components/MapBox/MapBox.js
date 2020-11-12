/*
Author: chankruze (chankruze@geekofia.in)
Created: Fri Nov 13 2020 02:24:33 GMT+0530 (India Standard Time)

Copyright (c) Geekofia 2020 and beyond
*/

import { useState, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import styles from "./MapBox.module.css";
// const mapboxgl = require("mapbox-gl/dist/mapbox-gl.js");

mapboxgl.accessToken = process.env.REACT_APP_MAPBOXGL_ACCESS_TOKEN;

const defaultCoords = {
  lng: 5,
  lat: 34,
};

const geoLocationConfig = {
  enableHighAccuracy: true,
};

const setupMap = (mapContainer, updateMapData, center, zoom) => {
  const map = new mapboxgl.Map({
    container: mapContainer,
    style: "mapbox://styles/mapbox/streets-v11",
    center: center,
    zoom: zoom,
  });

  // adds navigation controls
  map.addControl(new mapboxgl.NavigationControl());
  // adds on coordinate change listener
  map.on("move", () =>
    updateMapData({
      lng: parseFloat(map.getCenter().lng.toFixed(4)),
      lat: parseFloat(map.getCenter().lat.toFixed(4)),
      zoom: parseFloat(map.getZoom().toFixed(2)),
    })
  );
};

export const MapBox = () => {
  let mapContainer;

  const [mapData, setMapData] = useState(defaultCoords);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position, map) => {
        // render new map
        setupMap(
          mapContainer,
          setMapData,
          [position.coords.longitude, position.coords.latitude],
          12
        );
      },
      () => {
        console.log("Failed to get your location");
        setupMap(mapContainer, setMapData, defaultCoords, 2);
      },
      geoLocationConfig
    );
    // eslint-disable-next-line
  }, []);

  console.log(mapData);

  return (
    <div className={styles.mapbox_root}>
      <div
        ref={(el) => (mapContainer = el)}
        className={styles.mapbox_container}
      />
    </div>
  );
};
