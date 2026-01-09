import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Hero from "../components/home/Hero";
import "../styles/home.css";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-wrapper">
      <Hero />
      
      {/* 1. VISUALISASI */}
      <section className="bg-white section">
        <div className="home-section reverse">
          <div className="home-features-grid">
            <motion.div className="feat-box active" whileHover={{ y: -5 }}>
              <div className="icon">📊</div>
              <h4>Dashboard SIG</h4>
              <p>Pemetaan digital interaktif</p>
            </motion.div>
            <motion.div className="feat-box" whileHover={{ y: -5 }}>
              <div className="icon">🌿</div>
              <h4>Kondisi Fisik</h4>
              <p>Analisis kesehatan pohon</p>
            </motion.div>
          </div>
          <div className="home-text">
            <h2>Visualisasi Data</h2>
            <p>
              Grafik dan ringkasan kondisi vegetasi yang membantu memahami pola,
              intensitas, dan distribusi pohon peneduh di kawasan perkotaan.
            </p>
            <button
              className="home-cta"
              onClick={() => navigate("/visualisasi")}
            >
              Lihat Visualisasi
            </button>
          </div>
        </div>
      </section>

      {/* 2. INSIGHT */}
      <section className="bg-soft-green section">
        <div className="home-section">
          <div className="insight-preview-card">
            <div className="insight-icon">💡</div>
            <div className="insight-content">
              <h4>Kesimpulan Analisis</h4>
              <p>Interpretasi hasil dari 99 titik observasi.</p>
            </div>
          </div>
          <div className="home-text">
            <h2>Insight Analisis</h2>
            <p>
              Interpretasi hasil analisis spasial untuk mendukung perencanaan
              lingkungan perkotaan yang berkelanjutan.
            </p>
            <button className="home-cta" onClick={() => navigate("/insight")}>
              Baca Insight
            </button>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section className="section section-light">
        <div className="home-center">
          <h2>Profil Tim & Kontak</h2>
          <p style={{ margin: "16px 0 24px" }}>
            Informasi pengembang dan konteks akademik proyek Analisis Spasial
            Vegetasi Perkotaan.
          </p>
          <button className="home-cta" onClick={() => navigate("/contact")}>
            Lihat Profil Tim
          </button>
        </div>
      </section>

      {/* 4. STATS */}
      <section className="stats-bar dark-theme">
        <div className="stat-item"><h3>99</h3><p>Titik Observasi</p></div>
        <div className="stat-item"><h3>4</h3><p>Pilar Utama</p></div>
        <div className="stat-item"><h3>100%</h3><p>Data Lapangan</p></div>
      </section>

      {/* 5. CONTACT */}
      <section className="bg-soft-green section">
        <div className="home-center">
          <span className="badge">Our Team</span>
          <h2>Profil Tim & Kontak</h2>
          <p>Kenali pengembang dibalik proyek SIG ini.</p>
          <button className="home-cta" onClick={() => navigate("/contact")}>Hubungi Kami</button>
        </div>
      </section>
    </div>
  );
}