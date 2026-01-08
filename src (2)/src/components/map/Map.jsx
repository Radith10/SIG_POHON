import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
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
    icon: "/icons/7.png",
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

// Halaman utama
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
