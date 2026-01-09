import { motion } from "framer-motion";
import "../styles/contact.css";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0 }
};

export default function Contact() {
  const team = [
    { id: 1, name: "Elviana Golina", role: "Dokumentasi", desc: "Laporan akademik & koordinasi." },
    { id: 2, name: "Jessica Nathania", role: "WebGIS", desc: "OpenLayers & spasial fitur." },
    { id: 3, name: "M. Khairullah Hafidz", role: "Data Analyst", desc: "Olahan data & insight vegetasi." },
    { id: 4, name: "Radith Rachman", role: "Frontend UI", desc: "Antarmuka & integrasi visual." }
  ];

  return (
    <div className="contact-page">
      {/* 1. HERO BANNER */}
      <section className="contact-hero">
        <div className="contact-hero-overlay"></div>
        <div className="contact-hero-container">
          <motion.div className="contact-hero-left" initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}>
            <span className="badge-hero-alt">Project Team</span>
            <h1>Tim Pengembang <span className="text-highlight">SIG</span></h1>
            <p>Kolaborasi mahasiswa untuk Analisis Vegetasi Kota Pekanbaru.</p>
          </motion.div>

          {/* Sisi Kanan: Floating Group */}
          <motion.div className="contact-hero-right" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}>
            <div className="floating-wrapper">
              <div className="float-item fi-1">👥 <span>4 Members</span></div>
              <div className="float-item fi-2">🎓 <span>Academic Project</span></div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. TEAM SECTION */}
      <section className="contact-section">
        <div className="team-grid">
          <div className="team-card">
             <img src="/images/rach.png" alt="Anggota 3" />
            <h3>Radith</h3>
           
            <span>Frontend & UI</span>
            <p>
              Bertanggung jawab pada desain antarmuka, halaman Home, serta
              integrasi visual frontend.
            </p>
          </div>

          <div className="team-card">
            <img src="/images/Jes.JPG" alt="Anggota 1" />
            <h3>Jessica</h3>
            <span>WebGIS & Insight</span>
            <p>
              Mengembangkan peta interaktif dan mengolah data vegetasi,
              melakukan analisis spasial, serta menyusun insight hasil
              penelitian.
            </p>
          </div>

          <div className="team-card">
            <img src="/images/ELVI.png" alt="Anggota 3" />
            <h3>Elviana</h3>
            <span>Filter Maps</span>
            <p>
              Membuat Fitur Data yang sudah di kelola pada bagian peta
              interaktif.
            </p>
          </div>

          <div className="team-card">
           <img src="/images/kha.png" alt="Anggota 2" />
            <h3>Khairullah</h3>
            <span>Visualisasi & Dataset</span>
            <p>
              Menyusun laporan akademik, dokumentasi proyek, dan membuat visualisasi serta menu Dataset
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}