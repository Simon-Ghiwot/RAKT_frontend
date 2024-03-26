import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import { Icon } from "leaflet";
import axios from "axios";
import "leaflet/dist/leaflet.css";
import centerIconUrl from "./assets/download.png";

// Custom icon for the center marker (red pin)
const centerIcon = new Icon({
  iconUrl: centerIconUrl,
  iconSize: [22, 22],
});

const MapComponent = (props) => {
  const [latitude, setLatitude] = useState(37.76008693198698);
  const [longitude, setLongitude] = useState(-122.41880648110114);
  const [nearestLocations, setNearestLocations] = useState([]);

  useEffect(() => {
    fetchNearestLocations("37.76008693198698", "-122.41880648110114");
  }, []);

  const fetchNearestLocations = async (lat, lng) => {
    try {
      const response = await axios.post("http://127.0.0.1:8000/foodtrucks/", {
        origin_latitude: lat,
        origin_longtiude: lng,
      });
      const data = response.data.data;
      // Update the nearest locations state
      console.log(data);
      const trucks = [];
      for (let i = 0; i < data.length; i++) {
        trucks.push(data[i]["food_truck"]);
      }
      setNearestLocations(trucks);
    } catch (error) {
      console.error("Error fetching nearest locations:", error);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    console.log(longitude, latitude);
    try {
      await fetchNearestLocations(Number(latitude), Number(longitude));
    } catch (error) {
      console.error("Error fetching nearest locations:", error);
    }
  };

  return (
    <div className="map-area" style={{ height: "100vh", width: "75vw" }}>
      <form onSubmit={handleFormSubmit}>
        <label>
          Latitude:
          <input
            type="text"
            value={latitude}
            onChange={(e) => setLatitude(e.target.value)}
          />
        </label>
        <br />
        <label>
          Longitude:
          <input
            type="text"
            value={longitude}
            onChange={(e) => setLongitude(e.target.value)}
          />
        </label>
        <br />
        <button type="submit">Submit</button>
      </form>

      <MapContainer
        center={[latitude, longitude]}
        zoom={14}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="Map data &copy; OpenStreetMap contributors"
        />
        {nearestLocations.map((location) => (
          <Marker
            key={location.id}
            position={[location.latitude, location.longitude]}
          />
        ))}
        <Marker position={[latitude, longitude]} icon={centerIcon} />
      </MapContainer>
    </div>
  );
};

export default MapComponent;
