import React, { useState, useEffect, useRef } from 'react';
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from "ol/layer/Tile";
import OSM from 'ol/source/OSM';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON';
import Overlay from 'ol/Overlay';
import { fromLonLat } from 'ol/proj';
import { Style, Icon, Stroke, Fill, Circle as CircleStyle } from 'ol/style';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';

// Import data pohon dari file JSON
import treeDataJsonRaw from '../../../public/data/pohon_peneduh.json';

// Konversi data ke array jika bukan array
const treeDataJson = Array.isArray(treeDataJsonRaw) 
  ? treeDataJsonRaw 
  : (treeDataJsonRaw.data || treeDataJsonRaw.features || Object.values(treeDataJsonRaw));

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
        {currentPage === 'home' && <HomePage />}
        {currentPage === 'tematik' && <PetaTematik />}
        {currentPage === 'wilkerstat' && <PetaWilkerstat />}
        {currentPage === 'inflasi' && <PetaInflasi />}
        {currentPage === 'ketenagakerjaan' && <PetaKetenagakerjaan />}
      </div>
    </>
  );
};

// Home Page
const HomePage = () => (
  <div className="max-w-7xl mx-auto px-4 py-12">
    <h1 className="text-4xl font-bold text-green-800 mb-6">Selamat Datang di SIG Pohon Urban</h1>
    <p className="text-lg text-gray-700 mb-4">
      Sistem Informasi Geografis untuk monitoring dan analisis pohon urban di wilayah Pekanbaru.
    </p>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
      <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-green-600">
        <h3 className="text-xl font-semibold text-green-700 mb-2">Total Pohon</h3>
        <p className="text-3xl font-bold text-gray-800">{treeDataJson.length}</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-green-600">
        <h3 className="text-xl font-semibold text-green-700 mb-2">Lokasi</h3>
        <p className="text-3xl font-bold text-gray-800">3</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-green-600">
        <h3 className="text-xl font-semibold text-green-700 mb-2">Kondisi Sehat</h3>
        <p className="text-3xl font-bold text-gray-800">
          {treeDataJson.filter(t => t.kondisi === 'Sehat').length}
        </p>
      </div>
    </div>
  </div>
);

// Peta Tematik Page - HALAMAN UTAMA dengan OpenLayers
const PetaTematik = () => {
  const mapRef = useRef(null);
  const popupRef = useRef(null);
  const [map, setMap] = useState(null);
  const [selectedTree, setSelectedTree] = useState(null);

  // Hitung efek pendinginan
  const dataWithCooling = treeDataJson.map(tree => ({
    ...tree,
    cooling: tree.suhu_luar - tree.suhu_sekitar
  }));

  useEffect(() => {
    if (map || !mapRef.current) return;

    // Fungsi untuk mendapatkan warna berdasarkan efek pendinginan
    const getColorByCooling = (cooling) => {
      if (cooling >= 5) return [22, 101, 52, 1]; // Hijau tua
      if (cooling >= 3) return [22, 163, 74, 1]; // Hijau sedang
      if (cooling >= 1) return [74, 222, 128, 1]; // Hijau muda
      return [251, 191, 36, 1]; // Kuning
    };

    // Fungsi untuk mendapatkan ukuran berdasarkan diameter
    const getRadiusByDiameter = (diameter) => {
      if (diameter > 300) return 12;
      if (diameter > 150) return 9;
      if (diameter > 50) return 6;
      return 4;
    };

    // Buat features dari data pohon
    const features = dataWithCooling.map((tree, idx) => {
      const feature = new Feature({
        geometry: new Point(fromLonLat([tree.lng, tree.lat])),
        ...tree
      });
      return feature;
    });

    // Layer pohon
    const treeLayer = new VectorLayer({
      source: new VectorSource({
        features: features
      }),
      style: (feature) => {
        const cooling = feature.get('cooling');
        const diameter = feature.get('diameter');
        const kondisi = feature.get('kondisi');
        const color = getColorByCooling(cooling);
        
        return new Style({
          image: new CircleStyle({
            radius: getRadiusByDiameter(diameter),
            fill: new Fill({ color: color }),
            stroke: new Stroke({
              color: kondisi === 'Tidak Sehat' ? [220, 38, 38, 1] : [255, 255, 255, 1],
              width: kondisi === 'Tidak Sehat' ? 2 : 1
            })
          })
        });
      }
    });

    // Highlight layer
    const highlightLayer = new VectorLayer({
      source: new VectorSource(),
      style: new Style({
        image: new CircleStyle({
          radius: 15,
          stroke: new Stroke({ color: 'yellow', width: 3 }),
          fill: new Fill({ color: 'rgba(255, 255, 0, 0.1)' })
        })
      })
    });

    // Overlay untuk popup
    const overlay = new Overlay({
      element: popupRef.current,
      positioning: 'top-center',
      offset: [0, -15],
      autoPan: true,
      autoPanAnimation: { duration: 250 }
    });

    // Buat map
    const createdMap = new Map({
      target: mapRef.current,
      layers: [
        new OLTileLayer({ source: new OSM() }),
        treeLayer,
        highlightLayer
      ],
      overlays: [overlay],
      view: new View({
        center: fromLonLat([101.435, 0.555]),
        zoom: 12
      })
    });

    // Click event
    createdMap.on('singleclick', (evt) => {
      const feature = createdMap.forEachFeatureAtPixel(evt.pixel, (f) => f);
      if (feature && feature.get('lokasi')) {
        setSelectedTree({
          lokasi: feature.get('lokasi'),
          jenis: feature.get('jenis'),
          diameter: feature.get('diameter'),
          kondisi: feature.get('kondisi'),
          suhu_sekitar: feature.get('suhu_sekitar'),
          suhu_luar: feature.get('suhu_luar'),
          cooling: feature.get('cooling'),
          jarak: feature.get('jarak')
        });
        overlay.setPosition(evt.coordinate);
      } else {
        overlay.setPosition(undefined);
        setSelectedTree(null);
      }
    });

    // Hover event
    let highlighted = null;
    createdMap.on('pointermove', (evt) => {
      if (evt.dragging) return;
      
      const feature = createdMap.forEachFeatureAtPixel(evt.pixel, (f) => f);
      
      if (highlighted !== feature) {
        if (highlighted) highlightLayer.getSource().removeFeature(highlighted);
        if (feature && feature.get('lokasi')) {
          highlightLayer.getSource().addFeature(feature);
        }
        highlighted = feature;
      }

      createdMap.getTargetElement().style.cursor = feature && feature.get('lokasi') ? 'pointer' : '';
    });

    setMap(createdMap);

    return () => {
      if (createdMap) createdMap.setTarget(null);
    };
  }, [map]);

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
            <span className="font-semibold">Ukuran marker</span> menunjukkan diameter pohon • 
            <span className="font-semibold text-red-600"> Border merah</span> = Tidak Sehat
          </p>
        </div>
      </div>

      {/* Map Container */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden relative">
        <div 
          ref={mapRef} 
          style={{ height: '600px', width: '100%' }}
        />
        
        {/* Popup */}
        <div
          ref={popupRef}
          className="bg-white rounded-lg shadow-xl border-2 border-green-600 p-4 min-w-[250px]"
          style={{ display: selectedTree ? 'block' : 'none' }}
        >
          {selectedTree && (
            <div>
              <button
                onClick={() => {
                  setSelectedTree(null);
                  if (map) {
                    map.getOverlays().getArray()[0].setPosition(undefined);
                  }
                }}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 font-bold text-xl"
              >
                ×
              </button>
              <h4 className="font-bold text-green-700 mb-2 text-lg">{selectedTree.lokasi}</h4>
              <div className="space-y-1 text-sm">
                <p><strong>Jenis:</strong> {selectedTree.jenis === 'P' ? 'Pohon' : 'Buah Pohon'}</p>
                <p><strong>Diameter:</strong> {selectedTree.diameter} cm</p>
                <p><strong>Kondisi:</strong> <span className={selectedTree.kondisi === 'Sehat' ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>{selectedTree.kondisi}</span></p>
                <p><strong>Suhu Sekitar:</strong> {selectedTree.suhu_sekitar}°C</p>
                <p><strong>Suhu Luar:</strong> {selectedTree.suhu_luar}°C</p>
                <p className="text-green-700 font-bold pt-2 border-t">
                  <strong>Efek Pendinginan:</strong> {selectedTree.cooling.toFixed(1)}°C
                </p>
                <p><strong>Jarak dari Jalan:</strong> {selectedTree.jarak} m</p>
              </div>
            </div>
          )}
        </div>
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