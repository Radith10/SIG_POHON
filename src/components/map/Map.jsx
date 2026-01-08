// Map.jsx
import React, { useEffect, useRef, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "ol/ol.css";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import GeoJSON from "ol/format/GeoJSON";
import Overlay from "ol/Overlay";
import { fromLonLat } from "ol/proj";
import { Style, Icon, Stroke, Fill } from "ol/style";

import Popup from "./Popup";
import LayerControls from "./LayerControls";
import InfoPanel from "./InfoPanel";
import FilterPopup from "./FilterPopup";
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

// Function helper di luar component
const featurePassesFilter = (feature, filters) => {
  const jenis = feature.get("JENIS");
  const kondisi = feature.get("KONDISI");
  const suhu = feature.get("SUHU SEKITAR \nPOHON");

  // Cek jenis pohon - tampilkan HANYA jika checkbox-nya TRUE
  if (jenis === "P" && !filters.jenis.P) return false;
  if (jenis === "BP" && !filters.jenis.BP) return false;

  // Cek kondisi - tampilkan HANYA jika checkbox-nya TRUE
  if (!filters.kondisi[kondisi]) return false;

  // Cek suhu - tampilkan HANYA jika checkbox-nya TRUE
  const isPanas = suhu > 35;
  if (isPanas && !filters.suhu.panas) return false;
  if (!isPanas && !filters.suhu.normal) return false;

  return true;
};

// Component MapView (komponen peta)
function MapView() {
  const mapRef = useRef(null);
  const popupRef = useRef(null);
  const popupContentRef = useRef(null);

  const [map, setMap] = useState(null);
  const [infoText, setInfoText] = useState("");
  const [pohonLayer, setPohonLayer] = useState(null);
  const [allFeatures, setAllFeatures] = useState([]);

  const handleFilterChange = (filters) => {
    if (!pohonLayer || !allFeatures.length) return;

    const source = pohonLayer.getSource();
    source.clear();

    const filteredFeatures = allFeatures.filter((feature) =>
      featurePassesFilter(feature, filters)
    );

    source.addFeatures(filteredFeatures);

    console.log('Filter applied:', filters);
    console.log('Filtered features:', filteredFeatures.length, '/', allFeatures.length);
  };

  useEffect(() => {
    if (map) return;

    const riauLayer = new VectorLayer({
      source: new VectorSource({
        url: "/data/polygon_riau.json",
        format: new GeoJSON(),
      }),
      style: new Style({
        stroke: new Stroke({ color: "#0078ff", width: 2 }),
        fill: new Fill({ color: "rgba(0,120,255,0.15)" }),
      }),
    });

    const banjirLayer = new VectorLayer({
      source: new VectorSource({
        url: "/data/banjir.json",
        format: new GeoJSON(),
      }),
      style: new Style({
        image: new Icon({
          src: "/icon/flood.png",
          scale: 0.08,
          anchor: [0.5, 1],
        }),
      }),
    });

    const pohonVectorLayer = new VectorLayer({
      source: new VectorSource({
        url: "/data/pohon_peneduh.json",
        format: new GeoJSON(),
      }),
      style: (feature) => {
        const jenis = feature.get("JENIS");
        const kondisi = feature.get("KONDISI");

        // Tentukan icon berdasarkan JENIS pohon
        let iconSrc = "/icon/tree.png"; // Default untuk Peneduh

        if (jenis === "BP") {
          // Bukan Peneduh
          iconSrc = "/icon/orange.png";
        }

        let iconScale = 0.08;

        return new Style({
          image: new Icon({
            src: iconSrc,
            scale: iconScale,
            anchor: [0.5, 1],
          }),
        });
      },
    });

    pohonVectorLayer.getSource().on("featuresloadend", (event) => {
      const features = pohonVectorLayer.getSource().getFeatures();
      console.log("Pohon features loaded:", features.length);
      setAllFeatures(features);
    });

    pohonVectorLayer.getSource().on("featuresloaderror", (event) => {
      console.error("Error loading pohon features:", event);
    });

    setPohonLayer(pohonVectorLayer);

    const highlightLayer = new VectorLayer({
      source: new VectorSource(),
      style: new Style({
        stroke: new Stroke({ color: "yellow", width: 3 }),
      }),
    });

    const overlay = new Overlay({
      element: popupRef.current,
      positioning: "top-center",
      offset: [0, -12],
    });

    const createdMap = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({ source: new OSM() }),
        riauLayer,
        banjirLayer,
        pohonVectorLayer,
        highlightLayer,
      ],
      overlays: [overlay],
      view: new View({
        center: fromLonLat([101.438309, 0.51044]),
        zoom: 10,
      }),
    });

    createdMap.on("singleclick", (evt) => {
      const feature = createdMap.forEachFeatureAtPixel(evt.pixel, (f) => f);
      if (feature) {
        if (feature.get("LOKASI")) {
          const lokasi = feature.get("LOKASI") || "-";
          const jenis = feature.get("JENIS") || "-";
          const kondisi = feature.get("KONDISI") || "-";
          const suhu = feature.get("SUHU SEKITAR \nPOHON") || "-";
          const suhuLuar = feature.get("SUHU DILUAR \nPOHON") || "-";
          const diameter = feature.get("DIAMETER") || "-";
          const jarak = feature.get("JARAK DARI \nJALAN (m)") || "-";

          popupContentRef.current.innerHTML = `
            <h3>🌳 Info Pohon</h3>
            <p><strong>Lokasi:</strong> ${lokasi}</p>
            <p><strong>Jenis:</strong> ${jenis === "P" ? "Peneduh" : jenis === "BP" ? "Bukan Peneduh" : jenis}</p>
            <p><strong>Kondisi:</strong> <span style="color: ${kondisi === "Sehat" ? "#22c55e" : kondisi === "Tidak Sehat" ? "#f59e0b" : "#ef4444"}">●</span> ${kondisi}</p>
            <p><strong>Suhu Sekitar:</strong> ${suhu}°C</p>
            <p><strong>Suhu Diluar:</strong> ${suhuLuar}°C</p>
            <p><strong>Diameter:</strong> ${diameter} cm</p>
            <p><strong>Jarak dari Jalan:</strong> ${jarak} m</p>`;
        } else {
          const nama = feature.get("DESA") || feature.get("Nama_Pemetaan") || "-";
          const korban = feature.get("Jumlah_Korban") || "-";

          popupContentRef.current.innerHTML = `
            <h3>💧 Informasi Banjir</h3>
            <p><strong>${nama}</strong></p>
            <p>Korban: ${korban}</p>`;
        }
        overlay.setPosition(evt.coordinate);
      } else {
        overlay.setPosition(undefined);
      }
    });

    let highlighted = null;
    createdMap.on("pointermove", (evt) => {
      if (evt.dragging) return;

      const feature = createdMap.forEachFeatureAtPixel(evt.pixel, (f) => f);

      if (highlighted !== feature) {
        if (highlighted) highlightLayer.getSource().removeFeature(highlighted);
        if (feature) highlightLayer.getSource().addFeature(feature);
        highlighted = feature;
      }

      setInfoText(feature ? feature.get("DESA") || feature.get("LOKASI") || "" : "");
    });

    setMap(createdMap);
  }, [map]);

  return (
    <div className="map-wrapper">
      <div ref={mapRef} className="map-canvas" />
      <Popup popupRef={popupRef} popupContentRef={popupContentRef} />
      <div className="map-ui">
        <LayerControls map={map} />
        <div style={{ marginTop: "10px" }}>
          <FilterPopup onFilterChange={handleFilterChange} />
        </div>
      </div>
      <div className="map-info">
        <InfoPanel text={infoText} />
      </div>
    </div>
  );
}

// Component ThemeCard
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

// Component utama PetaPage
export default function PetaPage() {
  const navigate = useNavigate();
  const items = useMemo(() => Object.entries(TEMA_CONFIG), []);

  const handleCardClick = (tema) => {
    navigate(`/peta/${tema}`);
  };

  return (
    <div className="peta-page">
      <div className="peta-bg" aria-hidden="true" />

      <header className="peta-header">
        <h1>Pilih Peta</h1>
        <p>
          Jelajahi berbagai visualisasi data geografis untuk mendapatkan wawasan
          mendalam. Klik kartu untuk membuka peta, lalu pilih mode sesuai kebutuhan.
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

// Export MapView jika dibutuhkan di tempat lain
export { MapView };