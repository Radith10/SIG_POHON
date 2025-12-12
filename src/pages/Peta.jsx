import MapComponent from "../components/map/Map";

export default function Peta() {
  return (
    <div 
      style={{
        width: "100vw",
        height: "calc(100vh - 60px)",
        margin: 0,
        padding: 0,
        overflow: "hidden",
      }}
    >
      <MapComponent />
    </div>
  );
}
