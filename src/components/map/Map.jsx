// Map.jsx
import React, { useEffect, useRef, useState } from "react";
import "ol/ol.css";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import GeoJSON from "ol/format/GeoJSON";
import Overlay from "ol/Overlay";
import { fromLonLat } from "ol/proj";
import { Style, Icon, Stroke, Fill } from "ol/style";

import Popup from "./Popup";
import LayerControls from "./LayerControls";
import InfoPanel from "./InfoPanel";
import FilterPopup from "./FilterPopup";

export default function MapComponent() {
  const mapRef = useRef(null);
  const popupRef = useRef(null);
  const popupContentRef = useRef(null);

  const [map, setMap] = useState(null);
  const [infoText, setInfoText] = useState("");
  const [pohonLayer, setPohonLayer] = useState(null);
  const [allFeatures, setAllFeatures] = useState([]);

  // Function to check if feature passes filters
  const featurePassesFilter = (feature, filters) => {
    const jenis = feature.get("JENIS");
    const kondisi = feature.get("KONDISI");
    const suhu = feature.get("SUHU SEKITAR \nPOHON");

    // Check jenis filter
    if (jenis === "P" && !filters.jenis.P) return false;
    if (jenis === "BP" && !filters.jenis.BP) return false;

    // Check kondisi filter
    if (!filters.kondisi[kondisi]) return false;

    // Check suhu filter
    const isPanas = suhu > 35;
    if (isPanas && !filters.suhu.panas) return false;
    if (!isPanas && !filters.suhu.normal) return false;

    return true;
  };

  // Handle filter changes
  const handleFilterChange = (filters) => {
    if (!pohonLayer || !allFeatures.length) return;

    const source = pohonLayer.getSource();
    source.clear();

    // Filter and add features
    const filteredFeatures = allFeatures.filter((feature) =>
      featurePassesFilter(feature, filters)
    );
    
    source.addFeatures(filteredFeatures);
  };

  useEffect(() => {
    if (map) return;

    // Layer Polygon Riau
    const riauLayer = new VectorLayer({
      source: new VectorSource({
        url: "/data/polygon_riau.json",
        format: new GeoJSON(),
      }),
      style: new Style({
        stroke: new Stroke({ color: "#0078ff", width: 2 }),
        fill: new Fill({ color: "rgba(0,120,255,0.15)" }),
      }),
    });

    // Layer Banjir
    const banjirLayer = new VectorLayer({
      source: new VectorSource({
        url: "/data/banjir.json",
        format: new GeoJSON(),
      }),
      style: new Style({
        image: new Icon({
          src: "/icon/flood.png",
          scale: 0.08,
          anchor: [0.5, 1],
        }),
      }),
    });

    // Pohon Layer dengan icon tree
    const pohonVectorLayer = new VectorLayer({
      source: new VectorSource({
        url: "/data/pohon_peneduh.json",
        format: new GeoJSON(),
      }),
      style: (feature) => {
        const kondisi = feature.get("KONDISI");
        
        // Tentukan icon berdasarkan kondisi
        let iconSrc = "/icon/tree.png"; // default icon
        let iconScale = 0.08;
        
        // Jika ingin icon berbeda per kondisi, uncomment ini:
        // if (kondisi === "Sehat") iconSrc = "/icon/tree-green.png";
        // if (kondisi === "Kurang Sehat") iconSrc = "/icon/tree-yellow.png";
        // if (kondisi === "Mati") iconSrc = "/icon/tree-red.png";

        return new Style({
          image: new Icon({
            src: iconSrc,
            scale: iconScale,
            anchor: [0.5, 1], // anchor di bawah tengah
          }),
        });
      },
    });

    // Load all features for filtering
    pohonVectorLayer.getSource().on("featuresloadend", (event) => {
      const features = pohonVectorLayer.getSource().getFeatures();
      console.log("Pohon features loaded:", features.length); // Debug
      setAllFeatures(features);
    });

    // Error handling
    pohonVectorLayer.getSource().on("featuresloaderror", (event) => {
      console.error("Error loading pohon features:", event);
    });

    setPohonLayer(pohonVectorLayer);

    // Highlight Layer
    const highlightLayer = new VectorLayer({
      source: new VectorSource(),
      style: new Style({
        stroke: new Stroke({ color: "yellow", width: 3 }),
      }),
    });

    // Popup Overlay
    const overlay = new Overlay({
      element: popupRef.current,
      positioning: "top-center",
      offset: [0, -12],
    });

    // Create Map
    const createdMap = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({ source: new OSM() }),
        riauLayer,
        banjirLayer,
        pohonVectorLayer,
        highlightLayer,
      ],
      overlays: [overlay],
      view: new View({
        center: fromLonLat([101.438309, 0.51044]),
        zoom: 10, // Zoom lebih dekat untuk melihat pohon
      }),
    });

    // CLICK POPUP - Menampilkan info saat diklik
    createdMap.on("singleclick", (evt) => {
      const feature = createdMap.forEachFeatureAtPixel(evt.pixel, (f) => f);
      if (feature) {
        // Check if it's a pohon feature
        if (feature.get("LOKASI")) {
          const lokasi = feature.get("LOKASI") || "-";
          const jenis = feature.get("JENIS") || "-";
          const kondisi = feature.get("KONDISI") || "-";
          const suhu = feature.get("SUHU SEKITAR \nPOHON") || "-";
          const suhuLuar = feature.get("SUHU DILUAR \nPOHON") || "-";
          const diameter = feature.get("DIAMETER") || "-";
          const jarak = feature.get("JARAK DARI \nJALAN (m)") || "-";

          popupContentRef.current.innerHTML = `
            <h3>🌳 Info Pohon</h3>
            <p><strong>Lokasi:</strong> ${lokasi}</p>
            <p><strong>Jenis:</strong> ${
              jenis === "P" ? "Peneduh" : 
              jenis === "BP" ? "Bukan Peneduh" : jenis
            }</p>
            <p><strong>Kondisi:</strong> <span style="color: ${
              kondisi === "Sehat" ? "#22c55e" : 
              kondisi === "Tidak Sehat" ? "#f59e0b" : "#ef4444"
            }">●</span> ${kondisi}</p>
            <p><strong>Suhu Sekitar:</strong> ${suhu}°C</p>
            <p><strong>Suhu Diluar:</strong> ${suhuLuar}°C</p>
            <p><strong>Diameter:</strong> ${diameter} cm</p>
            <p><strong>Jarak dari Jalan:</strong> ${jarak} m</p>`;
        } else {
          // Banjir or other feature
          const nama = feature.get("DESA") || feature.get("Nama_Pemetaan") || "-";
          const korban = feature.get("Jumlah_Korban") || "-";

          popupContentRef.current.innerHTML = `
            <h3>💧 Informasi Banjir</h3>
            <p><strong>${nama}</strong></p>
            <p>Korban: ${korban}</p>`;
        }
        overlay.setPosition(evt.coordinate);
      } else {
        overlay.setPosition(undefined);
      }
    });

    // HOVER INFO + HIGHLIGHT - Menampilkan info saat hover
    let highlighted = null;
    createdMap.on("pointermove", (evt) => {
      if (evt.dragging) return;

      const feature = createdMap.forEachFeatureAtPixel(evt.pixel, (f) => f);

      if (highlighted !== feature) {
        if (highlighted) highlightLayer.getSource().removeFeature(highlighted);
        if (feature) highlightLayer.getSource().addFeature(feature);
        highlighted = feature;
      }

      setInfoText(
        feature
          ? feature.get("DESA") || feature.get("LOKASI") || ""
          : ""
      );
    });

    setMap(createdMap);
  }, [map]);

  return (
    <div className="map-wrapper">
      <div ref={mapRef} className="map-canvas" />

      <Popup popupRef={popupRef} popupContentRef={popupContentRef} />

      <div className="map-ui">
        <LayerControls map={map} />
        <div style={{ marginTop: "10px" }}>
          <FilterPopup onFilterChange={handleFilterChange} />
        </div>
      </div>

      <div className="map-info">
        <InfoPanel text={infoText} />
      </div>
    </div>
  );
}