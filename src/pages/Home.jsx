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
      <section className="section bg-white">
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
            <span className="badge">Data Analysis</span>
            <h2>Visualisasi Kondisi Vegetasi</h2>
            <p>Representasi 99 titik data lapangan ke dalam grafik interaktif.</p>
            <button className="home-cta" onClick={() => navigate("/visualisasi")}>Lihat Grafik</button>
          </div>
        </div>
      </section>

      {/* 2. INSIGHT */}
      <section className="section bg-soft-green">
        <div className="home-section">
          <div className="insight-preview-card">
            <div className="insight-icon">💡</div>
            <div className="insight-content">
              <h4>Kesimpulan Analisis</h4>
              <p>Interpretasi hasil dari 99 titik observasi.</p>
            </div>
          </div>
          <div className="home-text">
            <span className="badge">Knowledge</span>
            <h2>Insight & Strategi</h2>
            <p>Kesimpulan fungsional untuk perencanaan lingkungan perkotaan.</p>
            <button className="home-cta" onClick={() => navigate("/insight")}>Baca Insight</button>
          </div>
        </div>
      </section>

      {/* 3. DATASET */}
      <section className="section bg-white">
        <div className="home-section reverse">
          <div className="dataset-visual-box">
             <div className="file-stack">
                <div className="file-item geojson"><span>GeoJSON</span></div>
                <div className="file-item csv"><span>CSV</span></div>
             </div>
          </div>
          <div className="home-text">
            <span className="badge">Resource</span>
            <h2>Akses Dataset Spasial</h2>
            <p>Unduh data mentah berupa koordinat dan inventarisasi vegetasi.</p>
            <button className="home-cta" onClick={() => navigate("/dataset")}>Eksplorasi Data</button>
          </div>
        </div>
      </section>

      {/* 4. STATS */}
      <section className="stats-bar dark-theme">
        <div className="stat-item"><h3>99</h3><p>Titik Observasi</p></div>
        <div className="stat-item"><h3>4</h3><p>Pilar Utama</p></div>
        <div className="stat-item"><h3>100%</h3><p>Data Lapangan</p></div>
      </section>

      {/* 5. CONTACT */}
      <section className="section bg-soft-green">
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