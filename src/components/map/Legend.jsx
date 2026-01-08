import { useParams } from "react-router-dom";
import "../../styles/peta.css";

export default function Legend({ isDarkMode = false }) {
  const { tema } = useParams();

  // Legend untuk peta tematik (heatmap)
  if (tema === "tematik") {
    return (
      <div className={`legend-container ${isDarkMode ? "legend-dark" : ""}`}>
        <div className="legend-header legend-header-tematik">
          <span className="legend-header-icon">🗺️</span>
          <span className="legend-header-text">Legenda Heat Map</span>
        </div>

        <div className="legend-content">
          <div className="legend-heatmap-section">
            <div className="legend-heatmap-item">
              <div className="heatmap-gradient heatmap-yellow"></div>
              <span>Pohon Peneduh</span>
            </div>

            <div className="legend-heatmap-item">
              <div className="heatmap-gradient heatmap-red"></div>
              <span>Pohon Bukan Peneduh</span>
            </div>
          </div>

          <div className="legend-note">
            💡 Intensitas warna menunjukkan suhu sekitar pohon
          </div>
        </div>
      </div>
    );
  }

  // Legend untuk peta lainnya (dengan icon)
  return (
    <div className={`legend-container ${isDarkMode ? "legend-dark" : ""}`}>
      <div className="legend-header legend-header-default">
        <span className="legend-header-icon">🌳</span>
        <span className="legend-header-text">Legenda Peta</span>
      </div>

      <div className="legend-content">
        <div className="legend-item">
          <img src="/icon/tree.png" alt="Peneduh" className="legend-icon" />
          <span>Pohon Peneduh</span>
        </div>

        <div className="legend-item">
          <img
            src="/icon/orange.png"
            alt="Bukan Peneduh"
            className="legend-icon"
          />
          <span>Pohon Bukan Peneduh</span>
        </div>

     
      </div>
    </div>
  );
}
