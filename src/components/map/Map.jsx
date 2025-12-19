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
import { Style, Icon, Stroke, Fill, Circle as CircleStyle } from "ol/style";

import Popup from "./Popup";
import LayerControls from "./LayerControls";
import InfoPanel from "./InfoPanel";

export default function MapComponent() {
    const mapRef = useRef(null);
    const popupRef = useRef(null);
    const popupContentRef = useRef(null);

    const [map, setMap] = useState(null);
    const [infoText, setInfoText] = useState("");

    useEffect(() => {
        if (map) return;

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

        const pohonSource = new VectorSource({
            url: "/data/pohon_peneduh.json",
            format: new GeoJSON(),
        });

        pohonSource.on('featuresloadend', function() {
            console.log('Pohon features loaded:', pohonSource.getFeatures().length);
        });

        const Pohon = new VectorLayer({
            source: pohonSource,
            style: new Style({
                image: new CircleStyle({
                    radius: 8,
                    fill: new Fill({ color: "#2ecc71" }),
                    stroke: new Stroke({ color: "#27ae60", width: 2 }),
                }),
            }),
            visible: true,
            zIndex: 999,
        });

        const highlightLayer = new VectorLayer({
            source: new VectorSource(),
            style: new Style({
                image: new CircleStyle({
                    radius: 8,
                    fill: new Fill({ color: "rgba(255, 255, 0, 0.3)" }),
                    stroke: new Stroke({ color: "yellow", width: 3 }),
                }),
                stroke: new Stroke({ color: "yellow", width: 3 }),
            }),
        });

        const overlay = new Overlay({
            element: popupRef.current,
            positioning: "bottom-center",
            offset: [0, -12],
        });

        const createdMap = new Map({
            target: mapRef.current,
            layers: [
                new TileLayer({ source: new OSM() }),
                riauLayer,
                Pohon, // Layer pohon sudah aktif
                highlightLayer,
            ],
            overlays: [overlay],
            view: new View({
                center: fromLonLat([101.4488, 0.5372]), 
                zoom: 14, 
            }),
        });

        createdMap.on("singleclick", (evt) => {
            const feature = createdMap.forEachFeatureAtPixel(evt.pixel, (f) => f);
            if (feature) {
                const props = feature.getProperties();
                
                // Cek apakah ini data pohon peneduh
                if (props.LOKASI && props.JENIS) {
                    // Data Pohon Peneduh
                    popupContentRef.current.innerHTML = `
                        <h3 style="margin: 0 0 10px 0; color: #27ae60;">🌳 Pohon Peneduh</h3>
                        <table style="font-size: 12px; width: 100%;">
                            <tr><td><strong>Lokasi:</strong></td><td>${props.LOKASI || "-"}</td></tr>
                            <tr><td><strong>Jenis:</strong></td><td>${props.JENIS || "-"}</td></tr>
                            <tr><td><strong>Diameter:</strong></td><td>${props.DIAMETER || "-"} cm</td></tr>
                            <tr><td><strong>Kondisi:</strong></td><td style="color: ${props.KONDISI === 'Sehat' ? 'green' : 'red'};">${props.KONDISI || "-"}</td></tr>
                            <tr><td><strong>Jumlah:</strong></td><td>${props.JUMLAH || "-"}</td></tr>
                            <tr><td><strong>Suhu Sekitar:</strong></td><td>${props["SUHU SEKITAR \nPOHON"] || "-"}°C</td></tr>
                            <tr><td><strong>Suhu Diluar:</strong></td><td>${props["SUHU DILUAR \nPOHON"] || "-"}°C</td></tr>
                            <tr><td><strong>Jarak dari Jalan:</strong></td><td>${props["JARAK DARI \nJALAN (m)"] || "-"} m</td></tr>
                        </table>`;
                } else {
                    // Data lain (DESA atau banjir)
                    const nama = props.DESA || props.Nama_Pemetaan || "-";
                    const korban = props.Jumlah_Korban || "-";
                    popupContentRef.current.innerHTML = `
                        <h3>Informasi</h3>
                        <p><strong>${nama}</strong></p>
                        <p>Korban: ${korban}</p>`;
                }
                
                overlay.setPosition(evt.coordinate);
            } else {
                overlay.setPosition(undefined);
            }
        });

        // PERBAIKAN: Hover info disesuaikan dengan data pohon
        let highlighted = null;
        createdMap.on("pointermove", (evt) => {
            if (evt.dragging) return;

            const feature = createdMap.forEachFeatureAtPixel(evt.pixel, (f) => f);

            if (highlighted !== feature) {
                if (highlighted) highlightLayer.getSource().removeFeature(highlighted);
                if (feature) highlightLayer.getSource().addFeature(feature);
                highlighted = feature;
            }

            // Update info text berdasarkan tipe data
            if (feature) {
                const props = feature.getProperties();
                if (props.LOKASI && props.JENIS) {
                    setInfoText(`${props.LOKASI} - ${props.JENIS} (${props.KONDISI || "-"})`);
                } else {
                    setInfoText(props.DESA || "");
                }
            } else {
                setInfoText("");
            }
        });

        setMap(createdMap);
    }, [map]);

    return (
        <div
            style={{
                position: "relative",
                width: "100%",
                height: "100%",
                overflow: "hidden",
            }}
        >
            <div
                ref={mapRef}
                style={{
                    width: "100%",
                    height: "100%",
                }}
            />

            <Popup popupRef={popupRef} popupContentRef={popupContentRef} />
            <LayerControls map={map} />
            <InfoPanel text={infoText} />
        </div>
    );
}

// import React, { useState, useEffect } from "react";

// export default function LayerControls({ map }) {
//   const [layerStates, setLayerStates] = useState({
//     polygon: true,
//     pohon: true
//   });

//   useEffect(() => {
//     if (!map) return;

//     // Ambil checkbox elements
//     const polygonCheckbox = document.getElementById('polygon_riau');
//     const pohonCheckbox = document.getElementById('pohon_peneduh');

//     // Event listener untuk Polygon Riau
//     const handlePolygonChange = function () {
//       const allLayers = map.getLayers().getArray();
//       const riauLayer = allLayers[1]; // Layer Riau di index 1
//       if (riauLayer) {
//         riauLayer.setVisible(this.checked);
//         setLayerStates(prev => ({ ...prev, polygon: this.checked }));
//         console.log('Polygon Riau visibility:', this.checked);
//       }
//     };

//     // Event listener untuk Pohon Peneduh
//     const handlePohonChange = function () {
//       const allLayers = map.getLayers().getArray();
//       const pohonLayer = allLayers[2]; // Layer Pohon di index 2
//       if (pohonLayer) {
//         pohonLayer.setVisible(this.checked);
//         setLayerStates(prev => ({ ...prev, pohon: this.checked }));
//         console.log('Pohon Peneduh visibility:', this.checked);
//       }
//     };

//     // Tambahkan event listeners
//     if (polygonCheckbox) {
//       polygonCheckbox.addEventListener('change', handlePolygonChange);
//     }
//     if (pohonCheckbox) {
//       pohonCheckbox.addEventListener('change', handlePohonChange);
//     }

//     // Cleanup function
//     return () => {
//       if (polygonCheckbox) {
//         polygonCheckbox.removeEventListener('change', handlePolygonChange);
//       }
//       if (pohonCheckbox) {
//         pohonCheckbox.removeEventListener('change', handlePohonChange);
//       }
//     };
//   }, [map]);

//   return (
//     <div
//       className="overlay-container"
//       style={{
//         position: "absolute",
//         top: 20,
//         right: 30,
//         backgroundColor: "rgba(255, 255, 255, 0.9)",
//         padding: "12px 16px",
//         borderRadius: "8px",
//         boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
//         zIndex: 2000,
//         minWidth: "200px",
//       }}
//     >
//       <h5 style={{
//         margin: "0 0 10px 0",
//         fontSize: "14px",
//         fontWeight: "bold",
//         borderBottom: "2px solid #0078ff",
//         paddingBottom: "5px"
//       }}>
//         🗺️ Layer Control
//       </h5>

//       <label style={{
//         display: "block",
//         marginBottom: "8px",
//         cursor: "pointer",
//         fontSize: "13px",
//         opacity: layerStates.polygon ? 1 : 0.5,
//         transition: "opacity 0.2s"
//       }}>
//         <input
//           type="checkbox"
//           id="polygon_riau"
//           defaultChecked
//           style={{ marginRight: "8px", cursor: "pointer" }}
//         />
//         <span style={{ color: "#0078ff" }}>▬</span>
//         &nbsp;Polygon Riau
//         <span style={{
//           marginLeft: "8px",
//           fontSize: "10px",
//           color: layerStates.polygon ? "#2ecc71" : "#e74c3c"
//         }}>
//           {layerStates.polygon ? "●" : "○"}
//         </span>
//       </label>

//       <label style={{
//         display: "block",
//         cursor: "pointer",
//         fontSize: "13px",
//         opacity: layerStates.pohon ? 1 : 0.5,
//         transition: "opacity 0.2s"
//       }}>
//         <input
//           type="checkbox"
//           id="pohon_peneduh"
//           defaultChecked
//           style={{ marginRight: "8px", cursor: "pointer" }}
//         />
//         <span style={{ color: "#2ecc71" }}>🌳</span>
//         &nbsp;Pohon Peneduh
//         <span style={{
//           marginLeft: "8px",
//           fontSize: "10px",
//           color: layerStates.pohon ? "#2ecc71" : "#e74c3c"
//         }}>
//           {layerStates.pohon ? "●" : "○"}
//         </span>
//       </label>

//       <div style={{
//         marginTop: "10px",
//         paddingTop: "8px",
//         borderTop: "1px solid #eee",
//         fontSize: "10px",
//         color: "#888"
//       }}>
//         💡 {layerStates.polygon && layerStates.pohon ? "Semua layer aktif" :
//           !layerStates.polygon && !layerStates.pohon ? "Semua layer nonaktif" :
//             "Beberapa layer aktif"}
//       </div>
//     </div>
//   );
// }