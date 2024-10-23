import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Custom icon for the marker
const customIcon = L.icon({
  iconUrl: "https://airline-datacenter.s3.ap-south-1.amazonaws.com/9b4fa661-ee97-4f62-b3ac-c605eec1d678.png",
  iconSize: [38, 38],
  iconAnchor: [19, 38],
  popupAnchor: [0, -30],
});

interface MapModalProps {
  open: boolean;
  onClose: () => void;
  latitude: number;
  longitude: number;
}

const MapModal: React.FC<MapModalProps> = ({ open, onClose, latitude, longitude }) => {
  const [viewMode, setViewMode] = useState<"satellite" | "map">("map");

  const handleToggleView = () => {
    setViewMode((prevMode) => (prevMode === "map" ? "satellite" : "map"));
  };

  return (
    <Dialog  open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>Map View</DialogTitle>
      <DialogContent >
        <MapContainer center={[latitude, longitude]} zoom={13} style={{ height: "400px", width: "100%" }}>
          {viewMode === "satellite" ? (
            <TileLayer
              url="https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
              attribution="&copy; <a href='https://www.google.com/maps'>Google Maps</a>"
            />
          ) : (
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
          )}

          <Marker position={[latitude, longitude]} icon={customIcon} />
        </MapContainer>
      </DialogContent>
      <DialogActions>
        {/* Button to toggle between map and satellite views */}
        <Button onClick={handleToggleView} color="primary">
          Switch to {viewMode === "map" ? "Satellite" : "Map"} View
        </Button>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MapModal;
