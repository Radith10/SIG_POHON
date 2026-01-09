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
        <div className="section-title-simple">
          <h2>Anggota Kelompok</h2>
          <div className="line-dec"></div>
        </div>
        
        <motion.div className="team-grid-4col" variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          {team.map((member) => (
            <motion.div key={member.id} className="member-card-sleek" variants={itemVariants}>
              <div className="img-wrapper">
                <img src={`/images/team/anggota${member.id}.jpg`} alt={member.name} />
              </div>
              <div className="member-info">
                <span className="mini-role">{member.role}</span>
                <h4>{member.name}</h4>
                <p>{member.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* 3. INFO BAR STRIP */}
      <section className="bottom-info-strip">
        <div className="strip-container">
          <div className="strip-item">
            <span className="strip-icon">📍</span>
            <div>
              <p className="label">Lokasi Studi</p>
              <p className="val">Pekanbaru, Riau</p>
            </div>
          </div>
          <div className="strip-item active">
            <span className="strip-icon">📅</span>
            <div>
              <p className="label">Semester</p>
              <p className="val">Ganjil 25/26</p>
            </div>
          </div>
          <div className="strip-item">
            <span className="strip-icon">🛠️</span>
            <div>
              <p className="label">Metodologi</p>
              <p className="val">Spasial & Observasi</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}