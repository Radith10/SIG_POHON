import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import Navbar from "./components/Navbar";

const Home = lazy(() => import("./pages/Home"));
const Peta = lazy(() => import("./pages/Peta"));
const Visualisasi = lazy(() => import("./pages/Visualisasi"));
const Insight = lazy(() => import("./pages/Insight"));
const Contact = lazy(() => import("./pages/Contact"));

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/peta" element={<Peta />} />
          <Route path="/visualisasi" element={<Visualisasi />} />
          <Route path="/insight" element={<Insight />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
