import styles from './Map.module.css';
import { MapContainer, TileLayer, Circle } from "react-leaflet";

export const Map = () => {
    const position = [40.7128, -74.006]; // Example: New York City
    const radiusInMeters = 2;

    return (
        <div className={styles.map}>
            <MapContainer center={position} zoom={16} style={{ height: "100%", width: "100%" }}>
                <TileLayer
                    attribution='&copy; OpenStreetMap contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Circle center={position} radius={radiusInMeters} pathOptions={{ color: "red" }} />
            </MapContainer>
        </div>
    );
    
}