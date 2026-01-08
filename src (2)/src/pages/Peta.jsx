import MapComponent from "../components/map/Map";
import "../styles/peta.css";

export default function Peta() {
  return (
    <div className="page-offset">
      <div className="map-container">
        <MapComponent />
      </div>
    </div>
  );
}
