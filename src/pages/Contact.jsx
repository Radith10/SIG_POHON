import "../styles/contact.css";

export default function Contact() {
  return (
    <div className="page-offset">
      {/* BANNER */}
      <section className="contact-hero">
        <div className="contact-hero-overlay"></div>
        <div className="contact-hero-content">
          <h1>Tim Pengembang</h1>
          <p>
            Proyek Analisis Spasial Kondisi Vegetasi dan Pohon Peneduh Jalan
            untuk Lingkungan Perkotaan Berkelanjutan
          </p>
        </div>
      </section>

      {/* TEAM SECTION */}
      <section className="contact-section">
        <div className="team-grid">

          <div className="team-card">
            <img src="/images/team/anggota1.jpg" alt="Anggota 1" />
            <h3>Nama Anggota 1</h3>
            <span>Frontend & UI</span>
            <p>
              Bertanggung jawab pada desain antarmuka, halaman Home,
              serta integrasi visual frontend.
            </p>
          </div>

          <div className="team-card">
            <img src="/images/team/anggota2.jpg" alt="Anggota 2" />
            <h3>Nama Anggota 2</h3>
            <span>WebGIS & OpenLayers</span>
            <p>
              Mengembangkan peta interaktif, layer spasial,
              dan fitur analisis berbasis SIG.
            </p>
          </div>

          <div className="team-card">
            <img src="/images/team/anggota3.jpg" alt="Anggota 3" />
            <h3>Nama Anggota 3</h3>
            <span>Analisis Data</span>
            <p>
              Mengolah data vegetasi, melakukan analisis spasial,
              serta menyusun insight hasil penelitian.
            </p>
          </div>

          <div className="team-card">
            <img src="/images/team/anggota4.jpg" alt="Anggota 4" />
            <h3>Nama Anggota 4</h3>
            <span>Dokumentasi & Laporan</span>
            <p>
              Menyusun laporan akademik, dokumentasi proyek,
              dan koordinasi presentasi.
            </p>
          </div>

        </div>
      </section>
    </div>
  );
}
