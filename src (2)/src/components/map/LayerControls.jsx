export default function LayerControls({ map }) {
  const handleToggle = (layerIndex) => {
    if (!map) return;
    const layer = map.getLayers().item(layerIndex);
    layer.setVisible(!layer.getVisible());
  };

  return (
    <div className="layer-control">
      <h4>Layer Control</h4>

      <label className="layer-item">
        <input
          type="checkbox"
          defaultChecked
          onChange={() => handleToggle(1)}
        />
        <span>Polygon Riau</span>
      </label>

      <label className="layer-item">
        <input
          type="checkbox"
          defaultChecked
          onChange={() => handleToggle(2)}
        />
        <span>Titik Banjir</span>
      </label>
    </div>
  );
}
