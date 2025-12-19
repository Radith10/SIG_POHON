import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Import data pohon dari file JSON
import treeDataJson from 'pohon_peneduh.json';

// Navbar Component
const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleMenuClick = (page) => {
    setCurrentPage(page);
    setIsDropdownOpen(false);
  };

  return (
    <>
      <nav className="bg-green-700 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <button 
                onClick={() => handleMenuClick('home')}
                className="text-xl font-bold hover:text-green-200"
              >
                SIG Pohon Urban
              </button>
              
              <div className="relative">
                <button
                  onClick={handleDropdownToggle}
                  className="flex items-center space-x-1 px-4 py-2 rounded hover:bg-green-600 transition"
                >
                  <span>Peta Interaktif</span>
                  <svg className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {isDropdownOpen && (
                  <div className="absolute left-0 mt-2 w-64 bg-white rounded-lg shadow-xl z-50">
                    <button
                      onClick={() => handleMenuClick('tematik')}
                      className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-green-50 hover:text-green-700 transition"
                    >
                      Peta Tematik
                    </button>
                    <button
                      onClick={() => handleMenuClick('wilkerstat')}
                      className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-green-50 hover:text-green-700 transition"
                    >
                      Peta Wilkerstat
                    </button>
                    <button
                      onClick={() => handleMenuClick('inflasi')}
                      className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-green-50 hover:text-green-700 transition"
                    >
                      Peta Inflasi
                    </button>
                    <button
                      onClick={() => handleMenuClick('ketenagakerjaan')}
                      className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-green-50 hover:text-green-700 transition rounded-b-lg"
                    >
                      Peta Ketenagakerjaan Indonesia
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
      
      {/* Content Area */}
      <div className="min-h-screen bg-gray-50">
        {/* {currentPage === 'home' && <HomePage />} */}
        {currentPage === 'tematik' && <PetaTematik />}
        {currentPage === 'wilkerstat' && <PetaWilkerstat />}
        {currentPage === 'inflasi' && <PetaInflasi />}
        {currentPage === 'ketenagakerjaan' && <PetaKetenagakerjaan />}
      </div>
    </>
  );
};

// // Home Page
// const HomePage = () => (
//   <div className="max-w-7xl mx-auto px-4 py-12">
//     <h1 className="text-4xl font-bold text-green-800 mb-6">Selamat Datang di SIG Pohon Urban</h1>
//     <p className="text-lg text-gray-700 mb-4">
//       Sistem Informasi Geografis untuk monitoring dan analisis pohon urban di wilayah Pekanbaru.
//     </p>
//     <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
//       <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-green-600">
//         <h3 className="text-xl font-semibold text-green-700 mb-2">Total Pohon</h3>
//         <p className="text-3xl font-bold text-gray-800">{treeDataJson.length}</p>
//       </div>
//       <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-green-600">
//         <h3 className="text-xl font-semibold text-green-700 mb-2">Lokasi</h3>
//         <p className="text-3xl font-bold text-gray-800">3</p>
//       </div>
//       <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-green-600">
//         <h3 className="text-xl font-semibold text-green-700 mb-2">Kondisi Sehat</h3>
//         <p className="text-3xl font-bold text-gray-800">
//           {treeDataJson.filter(t => t.kondisi === 'Sehat').length}
//         </p>
//       </div>
//     </div>
//   </div>
// );

// Peta Tematik Page - HALAMAN UTAMA
const PetaTematik = () => {
  // Hitung efek pendinginan (suhu luar - suhu sekitar)
  const dataWithCooling = treeDataJson.map(tree => ({
    ...tree,
    cooling: tree.suhu_luar - tree.suhu_sekitar
  }));

  // Fungsi untuk mendapatkan warna berdasarkan efek pendinginan
  const getColorByCooling = (cooling) => {
    if (cooling >= 5) return '#166534'; // Hijau tua - efek tinggi
    if (cooling >= 3) return '#16a34a'; // Hijau sedang
    if (cooling >= 1) return '#4ade80'; // Hijau muda
    return '#fbbf24'; // Kuning - efek rendah
  };

  // Fungsi untuk mendapatkan ukuran marker berdasarkan diameter
  const getRadiusByDiameter = (diameter) => {
    if (diameter > 300) return 12;
    if (diameter > 150) return 9;
    if (diameter > 50) return 6;
    return 4;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-green-800 mb-6">Peta Tematik - Efek Pendinginan Pohon Urban</h1>
      
      {/* Legend */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <h3 className="font-semibold text-gray-800 mb-3">Legend - Efek Pendinginan (°C)</h3>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center">
            <div className="w-6 h-6 rounded-full bg-[#166534] mr-2"></div>
            <span className="text-sm">≥ 5°C (Tinggi)</span>
          </div>
          <div className="flex items-center">
            <div className="w-6 h-6 rounded-full bg-[#16a34a] mr-2"></div>
            <span className="text-sm">3-5°C (Sedang-Tinggi)</span>
          </div>
          <div className="flex items-center">
            <div className="w-6 h-6 rounded-full bg-[#4ade80] mr-2"></div>
            <span className="text-sm">1-3°C (Sedang)</span>
          </div>
          <div className="flex items-center">
            <div className="w-6 h-6 rounded-full bg-[#fbbf24] mr-2"></div>
            <span className="text-sm">&lt; 1°C (Rendah)</span>
          </div>
        </div>
        <div className="mt-3 pt-3 border-t">
          <p className="text-sm text-gray-600">
            <span className="font-semibold">Ukuran marker</span> menunjukkan diameter pohon (semakin besar diameter, semakin besar marker)
          </p>
        </div>
      </div>

      {/* Map Container */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <MapContainer 
          center={[0.555, 101.435]} 
          zoom={12} 
          style={{ height: '600px', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          
          {dataWithCooling.map((tree, idx) => (
            <CircleMarker
              key={idx}
              center={[tree.lat, tree.lng]}
              radius={getRadiusByDiameter(tree.diameter)}
              fillColor={getColorByCooling(tree.cooling)}
              color={tree.kondisi === 'Tidak Sehat' ? '#dc2626' : '#fff'}
              weight={tree.kondisi === 'Tidak Sehat' ? 2 : 1}
              opacity={1}
              fillOpacity={0.8}
            >
              <Popup>
                <div className="p-2">
                  <h4 className="font-bold text-green-700 mb-2">{tree.lokasi}</h4>
                  <p className="text-sm"><strong>Jenis:</strong> {tree.jenis === 'P' ? 'Pohon' : 'Buah Pohon'}</p>
                  <p className="text-sm"><strong>Diameter:</strong> {tree.diameter} cm</p>
                  <p className="text-sm"><strong>Kondisi:</strong> <span className={tree.kondisi === 'Sehat' ? 'text-green-600' : 'text-red-600'}>{tree.kondisi}</span></p>
                  <p className="text-sm"><strong>Suhu Sekitar:</strong> {tree.suhu_sekitar}°C</p>
                  <p className="text-sm"><strong>Suhu Luar:</strong> {tree.suhu_luar}°C</p>
                  <p className="text-sm font-semibold text-green-700">
                    <strong>Efek Pendinginan:</strong> {tree.cooling.toFixed(1)}°C
                  </p>
                  <p className="text-sm"><strong>Jarak dari Jalan:</strong> {tree.jarak} m</p>
                </div>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
        <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-600">
          <p className="text-sm text-gray-600">Rata-rata Pendinginan</p>
          <p className="text-2xl font-bold text-green-700">
            {(dataWithCooling.reduce((sum, t) => sum + t.cooling, 0) / dataWithCooling.length).toFixed(1)}°C
          </p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-600">
          <p className="text-sm text-gray-600">Pendinginan Maksimal</p>
          <p className="text-2xl font-bold text-green-700">
            {Math.max(...dataWithCooling.map(t => t.cooling)).toFixed(1)}°C
          </p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-600">
          <p className="text-sm text-gray-600">Total Pohon Sehat</p>
          <p className="text-2xl font-bold text-green-700">
            {dataWithCooling.filter(t => t.kondisi === 'Sehat').length}
          </p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg border-l-4 border-red-600">
          <p className="text-sm text-gray-600">Pohon Tidak Sehat</p>
          <p className="text-2xl font-bold text-red-700">
            {dataWithCooling.filter(t => t.kondisi === 'Tidak Sehat').length}
          </p>
        </div>
      </div>
    </div>
  );
};

// Other Pages
const PetaWilkerstat = () => (
  <div className="max-w-7xl mx-auto px-4 py-12">
    <h1 className="text-3xl font-bold text-green-800 mb-4">Peta Wilkerstat</h1>
    <p className="text-gray-700">Halaman Peta Wilkerstat akan segera hadir.</p>
  </div>
);

const PetaInflasi = () => (
  <div className="max-w-7xl mx-auto px-4 py-12">
    <h1 className="text-3xl font-bold text-green-800 mb-4">Peta Inflasi</h1>
    <p className="text-gray-700">Halaman Peta Inflasi akan segera hadir.</p>
  </div>
);

const PetaKetenagakerjaan = () => (
  <div className="max-w-7xl mx-auto px-4 py-12">
    <h1 className="text-3xl font-bold text-green-800 mb-4">Peta Ketenagakerjaan Indonesia</h1>
    <p className="text-gray-700">Halaman Peta Ketenagakerjaan akan segera hadir.</p>
  </div>
);

// Main App
export default function App() {
  return <Navbar />;
}