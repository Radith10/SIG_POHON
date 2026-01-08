import { useNavigate } from "react-router-dom";
import Hero from "../components/home/Hero";

export default function Home() {
  const navigate = useNavigate();

  return (
    <>
      <Hero />
      {/* VISUALISASI */}
      <section className="section section-light">
        <div className="home-section reverse">
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

      {/* INSIGHT */}
      <section className="section">
        <div className="home-section">
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
    </>
  );
}
