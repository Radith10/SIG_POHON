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
    description: "Visualisasi intensitas suhu ...",
    iconType: "image",
    icon: "/images/1.png",
    color: "#0B6623",
    dataUrl: DATA_URL,
    features: ["Gradasi Warna Suhu", "Zona Intensitas", "Analisis Thermal"],
  },

  Humanitarian: {
    title: "Peta Humanitarian",
    description:
      "Peta dengan kontras tinggi dan simbol jelas untuk aksesibilitas maksimal dalam identifikasi lokasi vegetasi.",
    icon: "/images/2.png",
    iconType: "image",
    color: "#D32F2F",
    dataUrl: DATA_URL,
    features: ["Kontras Tinggi", "Simbol Jelas", "Aksesibel"],
  },
  basemap: {
    title: "Peta Umum (OSM)",
    description:
      "Peta dasar OpenStreetMap dengan detail jalan, bangunan, dan landmark untuk navigasi lokasi pohon peneduh.",
    icon: "/images/3.png",
    iconType: "image",

    color: "#0B6623",
    dataUrl: DATA_URL,
    features: ["Detail Jalan", "Landmark", "Navigasi"],
  },
  petaSatelit: {
    title: "Peta Satelit",
    description:
      "Citra satelit resolusi tinggi untuk melihat tutupan vegetasi aktual dan kondisi lingkungan sekitar pohon.",
    icon: "/images/4.png",
    iconType: "image",
    color: "#1976D2",
    dataUrl: DATA_URL,
    features: ["Citra Satelit", "Tutupan Vegetasi", "Kondisi Real"],
  },
  CyclOSM: {
    title: "Peta CyclOSM",
    description:
      "Peta khusus dengan detail jalur sepeda dan pedestrian, cocok untuk analisis aksesibilitas ruang hijau.",
    icon: "/images/5.png",
    iconType: "image",
    color: "#7B1FA2",
    dataUrl: DATA_URL,
    features: ["Jalur Sepeda", "Pedestrian", "Aksesibilitas"],
  },
  terrain: {
    title: "Peta Terrain",
    description:
      "Visualisasi topografi dan elevasi untuk memahami karakteristik geografis lokasi pohon peneduh.",
    icon: "/images/6.png",
    iconType: "image",
    color: "#5D4037",
    dataUrl: DATA_URL,
    features: ["Topografi", "Elevasi", "Kontur"],
  },
  hybrid: {
    title: "Peta Hybrid",
    description:
      "Kombinasi citra satelit dengan label jalan dan nama lokasi untuk identifikasi komprehensif area vegetasi.",
    icon: "/images/7.png",
    color: "#00796B",
    dataUrl: DATA_URL,
    iconType: "image",
    features: ["Satelit + Label", "Nama Jalan", "Identifikasi Lokasi"],
  },
};


// Deskripsi fitur peta
const MAP_FEATURES = [
  {
    icon: "/icons/tree.png",
    iconType: "image",
    title: "Marker Interaktif",
    desc: "Klik pada titik pohon untuk melihat informasi detail seperti jenis, diameter, kondisi, dan data suhu.",
  },
  {
    iconType: "image",
    icon: "/images/7.png",
    title: "Legend Dinamis",
    desc: "Setiap peta dilengkapi legend yang menjelaskan simbol dan warna untuk memudahkan interpretasi data.",
  },
  {
    iconType: "image",
    icon: "/images/7.png",
    title: "Mode Tampilan",
    desc: "Pilihan Dark Mode dan Light Mode untuk kenyamanan penggunaan di berbagai kondisi pencahayaan.",
  },
  {
    iconType: "image",
    icon: "/images/7.png",
    title: "Popup Detail",
    desc: "Informasi lengkap setiap pohon termasuk suhu sekitar, suhu luar, dan efek pendinginan.",
  },
  {
    iconType: "image",
    icon: "/images/7.png",
    title: "Zoom & Pan",
    desc: "Navigasi peta dengan zoom in/out dan geser untuk eksplorasi detail area tertentu.",
  },
  {
    iconType: "image",
    icon: "/images/7.png",
    title: "Ekspor Data",
    desc: "Kemampuan untuk mengekspor tampilan peta dalam berbagai format untuk dokumentasi.",
  },
];

// Deskripsi tema peta
const TEMA_DESCRIPTIONS = [
  {
    iconType: "image",
    icon: "/images/1.png",
    title: "HeatMap Suhu",
    desc: "Menampilkan distribusi suhu dengan gradasi warna dari biru (dingin) hingga merah (panas). Berguna untuk mengidentifikasi zona dengan efek pendinginan tinggi dari pohon peneduh dan area yang membutuhkan penambahan vegetasi.",
  },
  {
    iconType: "image",
    icon: "/images/2.png",
    title: "Humanitarian",
    desc: "Peta dengan desain kontras tinggi yang mengutamakan keterbacaan dan aksesibilitas. Ideal untuk presentasi, laporan, dan penggunaan oleh berbagai kalangan termasuk yang memiliki keterbatasan penglihatan.",
  },
  {
    iconType: "image",
    icon: "/images/3.png",
    title: "OpenStreetMap",
    desc: "Peta dasar dengan informasi lengkap tentang jalan, bangunan, dan fasilitas umum. Memudahkan navigasi dan identifikasi lokasi pohon peneduh dalam konteks lingkungan perkotaan.",
  },
  {
    iconType: "image",
    icon: "/images/4.png",
    title: "Satelit",
    desc: "Citra satelit resolusi tinggi yang menampilkan kondisi aktual tutupan lahan. Sangat berguna untuk verifikasi keberadaan vegetasi dan analisis perubahan tutupan hijau dari waktu ke waktu.",
  },
  {
    iconType: "image",
    icon: "/images/5.png",
    title: "CyclOSM",
    desc: "Peta khusus yang menonjolkan jalur sepeda, trotoar, dan area pedestrian. Berguna untuk menganalisis aksesibilitas ruang hijau bagi pejalan kaki dan pesepeda.",
  },
  {
    iconType: "image",
    icon: "/images/6.png",
    title: "Terrain",
    desc: "Visualisasi topografi dengan informasi elevasi dan kontur. Membantu memahami karakteristik geografis lokasi dan pengaruhnya terhadap distribusi vegetasi.",
  },
  {
    iconType: "image",
    icon: "/images/7.png",
    title: "Hybrid",
    desc: "Kombinasi terbaik dari citra satelit dan peta vektor dengan label jalan dan nama lokasi. Memberikan konteks visual yang lengkap untuk analisis spasial vegetasi.",
  },
];

// Card Tema (lebih interaktif)

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
          {config.iconType === "image" ? (
            <img
              src={config.icon}
              alt={config.title}
              className="theme-card-icon-img"
            />
          ) : (
            <span>{config.icon}</span>
          )}
        </div>
      </div>

      <h3 className="theme-card-title">{config.title}</h3>
      <p className="theme-card-description">{config.description}</p>

      <div className="theme-card-actions">
        {config.features ? (
          config.features.map((feat, i) => (
            <span key={i} className="theme-card-pill">
              {feat}
            </span>
          ))
        ) : (
          <>
            <span className="theme-card-pill">Legend</span>
            <span className="theme-card-pill">Popup</span>
            <span className="theme-card-pill">Mode</span>
          </>
        )}
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
          Jelajahi berbagai visualisasi data geografis pohon peneduh untuk
          mendapatkan wawasan mendalam tentang distribusi vegetasi dan efek
          pendinginan. Klik kartu untuk membuka peta interaktif.

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

      {/* TENTANG PETA INTERAKTIF */}
      <section className="peta-about-section">
        <div className="peta-about-header">
          <span className="peta-about-pill">✨ Panduan</span>
          <h2>Tentang Peta Interaktif</h2>
          <p>
            Peta interaktif ini dirancang untuk memvisualisasikan data pohon
            peneduh secara komprehensif. Setiap jenis peta memiliki keunggulan
            dan kegunaan tersendiri untuk analisis spasial vegetasi perkotaan.
          </p>
        </div>

        {/* DATA YANG DITAMPILKAN */}
        <div className="peta-data-info">
          <h3> Data yang Ditampilkan</h3>
          <div className="peta-data-grid">
            <div className="peta-data-card">
              <span className="peta-data-icon">🌳</span>
              <h4>Lokasi Pohon</h4>
              <p>Koordinat geografis setiap pohon peneduh yang tercatat</p>
            </div>
            <div className="peta-data-card">
              <span className="peta-data-icon">🌡️</span>
              <h4>Data Suhu</h4>
              <p>Suhu di sekitar pohon dan suhu di luar naungan</p>
            </div>
            <div className="peta-data-card">
              <span className="peta-data-icon">📏</span>
              <h4>Diameter</h4>
              <p>Ukuran diameter batang pohon dalam centimeter</p>
            </div>
            <div className="peta-data-card">
              <span className="peta-data-icon">✅</span>
              <h4>Kondisi</h4>
              <p>Status kesehatan pohon (Sehat / Tidak Sehat)</p>
            </div>
            <div className="peta-data-card">
              <span className="peta-data-icon">🛤️</span>
              <h4>Jarak dari Jalan</h4>
              <p>Jarak pohon dari tepi jalan dalam meter</p>
            </div>
            <div className="peta-data-card">
              <span className="peta-data-icon">🏷️</span>
              <h4>Jenis Pohon</h4>
              <p>Klasifikasi jenis vegetasi (P / BP)</p>
            </div>
          </div>
        </div>

        {/* DESKRIPSI TEMA PETA */}
        <div className="peta-themes-detail">
          <h3> Deskripsi Tema Peta</h3>
          <div className="peta-themes-list">
            {TEMA_DESCRIPTIONS.map((tema, idx) => (
              <div key={idx} className="peta-theme-item">
                <div className="theme-card-icon" aria-hidden="true">
                  {tema.iconType === "image" ? (
                    <img
                      src={tema.icon}
                      alt={tema.title}
                      style={{
                        width: "300px",
                        height: "300px",
                        objectFit: "contain",
                        display: "block",
                      }}
                      className="theme-card-icon-img"
                    />
                  ) : (
                    <span>{tema.icon}</span>
                  )}
                </div>{" "}
                <div className="peta-theme-content">
                  <h4>{tema.title}</h4>
                  <p>{tema.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* TIPS PENGGUNAAN */}
        <div className="peta-tips-section">
          <h3>💡 Tips Penggunaan</h3>
          <ul className="peta-tips-list">
            <li>
              <strong>Gunakan HeatMap Suhu</strong> untuk mengidentifikasi area
              dengan efek pendinginan terbaik dan zona yang membutuhkan
              penambahan vegetasi.
            </li>
            <li>
              <strong>Peta Satelit</strong> cocok untuk verifikasi visual
              kondisi tutupan hijau dan perencanaan lokasi penanaman baru.
            </li>
            <li>
              <strong>Mode Dark</strong> disarankan untuk penggunaan di malam
              hari atau ruangan dengan pencahayaan rendah.
            </li>
            <li>
              <strong>Klik pada marker</strong> untuk melihat detail lengkap
              setiap pohon termasuk data suhu dan efek pendinginan.
            </li>
            <li>
              <strong>Zoom in</strong> untuk melihat distribusi pohon di area
              tertentu dengan lebih detail.
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}

// Export MapView jika dibutuhkan di tempat lain
export { MapView };