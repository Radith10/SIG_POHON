import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "../../styles/home.css";

export default function Hero() {
  const navigate = useNavigate();

  return (
    <section className="hero">
      <div className="hero-overlay"></div>
      
      <div className="hero-container">
        <motion.div 
          className="hero-content-left"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="badge-hero">WebGIS Project 2026</span>
          <h1>Analisis Spasial Vegetasi Kota</h1>
          <p>Monitoring 99 titik pohon peneduh jalan dengan integrasi data spasial yang presisi.</p>
          <div className="hero-btns">
            <button className="hero-button" onClick={() => navigate("/peta")}>
              Mulai Eksplorasi
            </button>
          </div>
        </motion.div>

        <motion.div 
          className="hero-visual-right"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <div className="floating-card c1">📊 <span>99 Data Points</span></div>
          <div className="floating-card c2">🌿 <span>Vegetation Health</span></div>
          <div className="floating-card c3">📍 <span>Spatial Mapping</span></div>
        </motion.div>
      </div>
    </section>
  );
}