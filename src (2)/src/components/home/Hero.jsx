import { useNavigate } from "react-router-dom";
import "../../styles/home.css";

export default function Hero() {
  const navigate = useNavigate();

  return (
    <section className="hero">
      <div className="hero-overlay"></div>

      <div className="hero-content">
        <h1>Pohon Peneduh untuk Kota Berkelanjutan</h1>
        <p>
          Analisis spasial kondisi vegetasi dan pohon peneduh jalan berbasis
          Sistem Informasi Geografis.
        </p>

        <button
          className="hero-button"
          onClick={() => navigate("/peta")}
        >
          Eksplorasi Peta
        </button>
      </div>
    </section>
  );
}
