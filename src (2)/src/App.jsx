// src/App.jsx - Dengan Product Tour
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Suspense, lazy, useState, useCallback } from "react";
import Navbar from "./components/Navbar";
import Chatbot from "./components/Chatbot";
import ProductTour, { TourTriggerButton, useTour } from "./components/ProductTour";
import { AppProvider } from "./context/AppContext";

// Lazy load pages
const Home = lazy(() => import("./pages/Home"));
const Peta = lazy(() => import("./pages/Peta"));
const Visualisasi = lazy(() => import("./pages/Visualisasi"));
const Insight = lazy(() => import("./pages/Insight"));
const Contact = lazy(() => import("./pages/Contact"));
const PetaDetail = lazy(() => import("./components/map/PetaDetail"));
const Data = lazy(() => import("./pages/Dataset"));

// Konfigurasi Tour Steps - Sesuaikan dengan elemen yang ada
const tourSteps = [
  {
    id: "navbar",
    selector: ".navbar",
    title: "🧭 Navigasi Utama",
    description:
      "Ini adalah navbar utama. Di sini kamu bisa mengakses semua menu website seperti Home, Peta, Visualisasi, Insight, dan halaman lainnya.",
    position: "bottom",
  },
  {
    id: "navbar-logo",
    selector: ".navbar-logo",
    title: "🏠 Logo ProyekSIG",
    description: "Klik logo ini kapanpun untuk kembali ke halaman utama.",
    position: "bottom",
  },
  {
    id: "navbar-menu",
    selector: ".navbar-menu",
    title: "📋 Menu Navigasi",
    description:
      "Menu lengkap untuk menjelajahi website: Peta, Visualisasi, Insight, Contact, dan Dataset.",
    position: "bottom",
  },
  {
    id: "hero-content",
    selector: ".hero-content",
    title: "🌿 Selamat Datang!",
    description:
      "Hero section menampilkan informasi utama tentang proyek analisis vegetasi perkotaan berbasis Sistem Informasi Geografis.",
    position: "bottom",
  },
  {
    id: "hero-button",
    selector: ".hero-button",
    title: "🗺️ Eksplorasi Peta",
    description:
      "Klik tombol ini untuk masuk ke halaman peta interaktif dan menjelajahi data pohon peneduh.",
    position: "bottom",
  },
  {
    id: "home-cta",
    selector: ".home-cta",
    title: "⚡ Tombol Aksi",
    description:
      "Tombol-tombol ini tersebar di website untuk navigasi cepat ke halaman yang relevan.",
    position: "top",
  },
  {
    id: "chatbot",
    selector: ".chatbot-toggle",
    title: "💬 Asisten Virtual",
    description:
      "Butuh bantuan? Klik icon chat untuk membuka chatbot yang siap menjawab pertanyaanmu!",
    position: "left",
  },
];

// Loading component
function LoadingFallback() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            width: "48px",
            height: "48px",
            border: "4px solid #E0E0E0",
            borderTop: "4px solid #0B6623",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
            margin: "0 auto 16px",
          }}
        />
        <p style={{ color: "#666", fontSize: "16px" }}>Memuat halaman...</p>
      </div>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

// Main App Content - perlu di dalam BrowserRouter untuk useLocation
function AppContent() {
  const location = useLocation();
  const { resetTour, hasSeenTour } = useTour("proyekSIGTour");
  const [tourKey, setTourKey] = useState(0);

  // Hanya tampilkan tour di halaman Home
  const isHomePage = location.pathname === "/";

  // Handler untuk restart tour
  const handleRestartTour = useCallback(() => {
    resetTour();
    setTourKey((prev) => prev + 1);
  }, [resetTour]);

  return (
    <div className="app-container">
      <Navbar />

      {/* Tombol untuk restart tour - tampil jika sudah pernah lihat tour */}
      {isHomePage && hasSeenTour() && (
        <TourTriggerButton onClick={handleRestartTour} />
      )}

      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          {/* Home Route */}
          <Route path="/" element={<Home />} />

          {/* Peta Routes */}
          <Route path="/peta" element={<Peta />} />
          <Route path="/peta/:tema" element={<PetaDetail />} />

          {/* Other Routes */}
          <Route path="/visualisasi" element={<Visualisasi />} />
          <Route path="/insight" element={<Insight />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/dataset" element={<Data />} />

          {/* 404 Route */}
          <Route
            path="*"
            element={
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100vh",
                  flexDirection: "column",
                  fontFamily:
                    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                }}
              >
                <h1 style={{ fontSize: "72px", margin: 0, color: "#0B6623" }}>
                  404
                </h1>
                <p style={{ fontSize: "18px", color: "#666" }}>
                  Halaman tidak ditemukan
                </p>
                <a
                  href="/"
                  style={{
                    marginTop: "20px",
                    padding: "12px 24px",
                    background: "#0B6623",
                    color: "white",
                    textDecoration: "none",
                    borderRadius: "8px",
                    fontWeight: "600",
                  }}
                >
                  Kembali ke Home
                </a>
              </div>
            }
          />
        </Routes>
      </Suspense>

      {/* Chatbot - Muncul di semua halaman */}
      <Chatbot />

      {/* Product Tour - Hanya di halaman Home */}
      {isHomePage && (
        <ProductTour
          key={tourKey}
          steps={tourSteps}
          storageKey="proyekSIGTour"
          onComplete={() => console.log("🎉 Tour selesai!")}
          onSkip={() => console.log("Tour dilewati")}
          autoStart={true}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AppProvider>
  );
}
