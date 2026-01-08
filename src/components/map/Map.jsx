import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/peta.css";
const DATA_URL = "/data/pohon_peneduh.json";

const TEMA_CONFIG = {
  tematik: {
    title: "Peta HeatMap Suhu",
    description: "Visualisasi data pohon peneduh peta tematik",
    icon: "🌲",
    color: "#0B6623",
    dataUrl: DATA_URL,
  },
  Humanitarian: {
    title: "Peta Humanitarian",
    description: "Visualisasi data pohon peneduh peta Humanitarian",
    icon: "🌲",
    color: "#0B6623",
    dataUrl: DATA_URL,
  },
  basemap: {
    title: "Peta Umum",
    description: "Visualisasi data pohon peneduh peta Umum",
    icon: "🌴",
    color: "#0B6623",
    dataUrl: DATA_URL,
  },
  petaSatelit: {
    title: "Peta Satelit",
    description: "Visualisasi data pohon peneduh peta Satelit",
    icon: "🌴",
    color: "#1976D2",
    dataUrl: DATA_URL,
  },
  CyclOSM: {
    title: "Peta CyclOSM",
    description: "Visualisasi data pohon peneduh peta CyclOSM",
    icon: "🌴",
    color: "#1976D2",
    dataUrl: DATA_URL,
  },

  terrain: {
    title: "Peta Terrain",
    description: "Visualisasi data pohon peneduh peta Terrain",
    icon: "🌴",
    color: "#1976D2",
    dataUrl: DATA_URL,
  },
  hybrid: {
    title: "Peta Hybrid",
    description: "Visualisasi data pohon peneduh peta Hybrid",
    icon: "🌴",
    color: "#1976D2",
    dataUrl: DATA_URL,
  },
};

// Card Tema (lebih interaktif)
function ThemeCard({ config, index, onClick }) {
  const [pressed, setPressed] = useState(false);

  return (
    <button
      type="button"
      className="theme-card"
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
      onClick={onClick}
      style={{
        "--card-color": config.color,
        "--card-gradient": config.gradient,
        "--card-delay": `${index * 70}ms`,
        transform: pressed ? "translateY(-2px) scale(0.99)" : undefined,
      }}
      aria-label={`Buka ${config.title}`}
    >
      <span className="theme-card-gradient" aria-hidden="true" />
      <span className="theme-card-shine" aria-hidden="true" />

      <div className="theme-card-top">
        <div className="theme-card-icon" aria-hidden="true">
          {config.icon}
        </div>
        <div className="theme-card-badge">Interaktif</div>
      </div>

      <h3 className="theme-card-title">{config.title}</h3>
      <p className="theme-card-description">{config.description}</p>

      <div className="theme-card-actions">
        <span className="theme-card-pill">Legend</span>
        <span className="theme-card-pill">Popup</span>
        <span className="theme-card-pill">Mode</span>
      </div>

      <div className="theme-card-button-container">
        <span className="theme-card-button">Lihat Peta →</span>
      </div>
    </button>
  );
}

// Halaman utama
export default function PetaPage() {
  const navigate = useNavigate();

  const items = useMemo(() => Object.entries(TEMA_CONFIG), []);

  const handleCardClick = (tema) => {
    navigate(`/peta/${tema}`); // penting: ini yang memastikan tema benar
  };

  return (
    <div className="peta-page">
      <div className="peta-bg" aria-hidden="true" />

      <header className="peta-header">
        <h1>Pilih Peta </h1>
        <p>
          Jelajahi berbagai visualisasi data geografis untuk mendapatkan wawasan
          mendalam. Klik kartu untuk membuka peta, lalu pilih mode sesuai
          kebutuhan.
        </p>
      </header>

      <section className="peta-cards-grid">
        {items.map(([key, config], idx) => (
          <ThemeCard
            key={key}
            config={config}
            index={idx}
            onClick={() => handleCardClick(key)}
          />
        ))}
      </section>

      <section className="peta-info-section">
        <h3>✨ Tentang Peta Interaktif</h3>
        <p>
          Setiap peta punya legend, hover highlight, popup detail saat klik,
          serta pilihan mode basemap (OSM / Dark / Light / Terrain / Satellite)
          + Dark Mode UI.
        </p>
      </section>
    </div>
  );
}
