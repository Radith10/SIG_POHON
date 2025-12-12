export default function LayerControls({ map }) {
  const handleToggle = (layerIndex) => {
    if (!map) return;
    const layer = map.getLayers().item(layerIndex);
    layer.setVisible(!layer.getVisible());
  };

  return (
    <div
      style={{
        position: "absolute",
        top: 20,
        right: 30,
        background: "white",
        padding: "12px",
        borderRadius: "8px",
        boxShadow: "0 0 8px rgba(0,0,0,0.3)",
        zIndex: 2000,
      }}
    >
      <h5 style={{ margin: 0 }}>Layer Control</h5>
      <label>
        <input type="checkbox" defaultChecked onChange={() => handleToggle(1)} />
        &nbsp;Polygon Riau
      </label>
      <br />
      <label>
        <input type="checkbox" defaultChecked onChange={() => handleToggle(2)} />
        &nbsp;Titik Banjir
      </label>
    </div>
  );
}
