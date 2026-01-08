// src/App.jsx - VERSI YANG BENAR
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react"; // ✅ Tidak perlu import useState
import Navbar from "./components/Navbar";
import { AppProvider } from "./context/AppContext"; // ✅ Import AppProvider

// Lazy load pages
const Home = lazy(() => import("./pages/Home"));
const Peta = lazy(() => import("./pages/Peta"));
const Visualisasi = lazy(() => import("./pages/Visualisasi"));
const Insight = lazy(() => import("./pages/Insight"));
const Contact = lazy(() => import("./pages/Contact"));
const PetaDetail = lazy(() => import("./components/map/PetaDetail"));

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

export default function App() {


  return (
    <AppProvider>
      {" "}
    
      <BrowserRouter>
        <div className="app-container">
      
          <Navbar />

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
                    <h1
                      style={{ fontSize: "72px", margin: 0, color: "#0B6623" }}
                    >
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
        </div>
      </BrowserRouter>
    </AppProvider>
  );
}
