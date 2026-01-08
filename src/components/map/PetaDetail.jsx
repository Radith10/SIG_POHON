import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import "ol/ol.css";
import Overlay from "ol/Overlay";
import HeatmapLayer from "ol/layer/Heatmap";
import VectorSource from "ol/source/Vector";
import GeoJSON from "ol/format/GeoJSON";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import XYZ from "ol/source/XYZ";
import OSM from "ol/source/OSM";
import { fromLonLat } from "ol/proj";
import VectorLayer from "ol/layer/Vector";
import Style from "ol/style/Style";
import Icon from "ol/style/Icon";
import "../../styles/peta.css";
import Legend from "./Legend";
import FilterPopup from "./FilterPopup";

const BASEMAP_BY_TEMA = {
  tematik: {
    title: "Peta Tematik",
    lightSource: new OSM(),
    darkSource: new XYZ({ url: "https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}.png" }),
  },
  Humanitarian: {
    title: "Peta Humanitarian",
    lightSource: new XYZ({ url: "https://{a-c}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png" }),
    darkSource: new XYZ({ url: "https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}.png" }),
  },
  basemap: {
    title: "Peta Umum",
    lightSource: new OSM(),
    darkSource: new XYZ({ url: "https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}.png" }),
  },
  petaSatelit: {
    title: "Peta Satelit",
    lightSource: new XYZ({ url: "https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}" }),
    darkSource: new XYZ({ url: "https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}" }),
  },
  CyclOSM: {
    title: "Peta CyclOSM",
    lightSource: new XYZ({ url: "https://{a-c}.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png" }),
    darkSource: new XYZ({ url: "https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}.png" }),
  },
  terrain: {
    title: "Peta Terrain",
    lightSource: new XYZ({ url: "https://{a-c}.tile.opentopomap.org/{z}/{x}/{y}.png" }),
    darkSource: new XYZ({ url: "https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}.png" }),
  },
  hybrid: {
    title: "Peta Hybrid",
    lightSource: new XYZ({ url: "https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}" }),
    darkSource: new XYZ({ url: "https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}" }),
  },
};

export default function PetaDetail() {
  const { tema } = useParams();
  const navigate = useNavigate();
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const layersRef = useRef([]); 
  const allFeaturesRef = useRef([]);

  const { isDarkMode, setIsDarkMode, isExporting, setIsExporting } = useAppContext();
  const [activeFilters, setActiveFilters] = useState(null);

  const temaConfig = useMemo(() => BASEMAP_BY_TEMA[tema], [tema]);

  const styleByJenis = (feature) => {
    const jenis = feature.get("JENIS");
    return new Style({
      image: new Icon({
        src: jenis === "P" ? "/icon/tree.png" : "/icon/orange.png",
        scale: 0.08,
        anchor: [0.5, 1],
      }),
    });
  };

  const checkFeaturePassesFilter = (feature, filters) => {
    if (!filters) return true;
    const props = feature.getProperties();
    const jenis = props.JENIS || ""; 
    const kondisi = props.KONDISI || "";
    const suhu = parseFloat(props["SUHU SEKITAR \nPOHON"]);

    if (jenis === "P" && !filters.jenis.P) return false;
    if (jenis === "BP" && !filters.jenis.BP) return false;
    if (!filters.kondisi[kondisi]) return false;

    const isPanas = suhu > 35;
    if (isPanas && !filters.suhu.panas) return false;
    if (!isPanas && !filters.suhu.normal) return false;

    return true;
  };

  const handleFilterChange = useCallback((newFilters) => {
    setActiveFilters(newFilters);
    if (allFeaturesRef.current.length === 0) return;
    const filteredFeatures = allFeaturesRef.current.filter(feature => 
      checkFeaturePassesFilter(feature, newFilters)
    );
    layersRef.current.forEach(layer => {
      const source = layer.getSource();
      if (source && typeof source.clear === 'function') {
        source.clear();
        source.addFeatures(filteredFeatures);
      }
    });
  }, []);

  useEffect(() => {
    if (!temaConfig || !mapRef.current) return;
    if (mapInstance.current) mapInstance.current.setTarget(null);

    const baseLayer = new TileLayer({
      source: isDarkMode ? temaConfig.darkSource : temaConfig.lightSource,
    });

    const vectorSource = new VectorSource({ format: new GeoJSON() });

    fetch("/data/pohon_peneduh.json")
      .then(res => res.json())
      .then(data => {
        const features = new GeoJSON().readFeatures(data, { featureProjection: "EPSG:3857" });
        allFeaturesRef.current = features;
        const initialFeatures = activeFilters 
          ? features.filter(f => checkFeaturePassesFilter(f, activeFilters))
          : features;
        vectorSource.addFeatures(initialFeatures);
      });

    const mapLayers = [baseLayer];
    layersRef.current = [];

    if (tema === "tematik") {
      const heatLayerPeneduh = new HeatmapLayer({
        source: vectorSource,
        weight: (f) => f.get("JENIS") === "P" ? f.get("DIAMETER") / 200 : 0,
        radius: 20, blur: 25,
        gradient: ["rgba(255, 255, 0, 0)", "rgba(255, 200, 0, 1)"],
      });
      const heatLayerBukanPeneduh = new HeatmapLayer({
        source: vectorSource,
        weight: (f) => f.get("JENIS") !== "P" ? f.get("DIAMETER") / 200 : 0,
        radius: 20, blur: 25,
        gradient: ["rgba(255, 0, 0, 0)", "rgba(200, 0, 0, 1)"],
      });
      mapLayers.push(heatLayerPeneduh, heatLayerBukanPeneduh);
      layersRef.current.push(heatLayerPeneduh, heatLayerBukanPeneduh);
    } else {
      const pohonLayer = new VectorLayer({ source: vectorSource, style: styleByJenis });
      mapLayers.push(pohonLayer);
      layersRef.current.push(pohonLayer);
    }

    const map = new Map({
      target: mapRef.current,
      layers: mapLayers,
      view: new View({ center: fromLonLat([101.4478, 0.5071]), zoom: 13 }),
    });

    if (tema !== "tematik") {
      const popupElement = document.getElementById("popup");
      const popupContent = document.getElementById("popup-content");
      if(popupElement) {
          const overlayPopup = new Overlay({
            element: popupElement,
            offset: [0, -15],
            positioning: "bottom-center",
            stopEvent: false,
          });
          map.addOverlay(overlayPopup);
          
          map.on("pointermove", (evt) => {
            if (evt.dragging) return;
            const feature = map.forEachFeatureAtPixel(evt.pixel, (feat) => feat);
            if (!feature) {
              overlayPopup.setPosition(undefined);
              popupElement.classList.remove("show");
              map.getTargetElement().style.cursor = "";
              return;
            }
             const props = feature.getProperties();
             const jenisPohon = props.JENIS === "P" ? "Peneduh" : props.JENIS === "BP" ? "Bukan Peneduh" : "Tidak diketahui";
             popupContent.innerHTML = `
                <div class="popup-card">
                  <div class="popup-header">📍 Data Pohon</div>
                  <div class="popup-section">
                    <div class="popup-item"><span class="label">📌 Lokasi</span><span class="value">${props.LOKASI}</span></div>
                    <div class="popup-item"><span class="label">🌳 Jenis</span><span class="badge ${props.JENIS === "P" ? "badge-green" : "badge-orange"}">${jenisPohon}</span></div>
                    <div class="popup-item"><span class="label">💚 Kondisi</span><span class="value">${props.KONDISI}</span></div>
                  </div>
                </div>`;
             overlayPopup.setPosition(evt.coordinate);
             popupElement.classList.add("show");
             map.getTargetElement().style.cursor = "pointer";
          });
      }
    }

    mapInstance.current = map;
    return () => { if(mapInstance.current) mapInstance.current.setTarget(null); }
  }, [temaConfig, tema, isDarkMode]);

  const handleExportMap = () => { /* Logic export */ };

  if (!temaConfig) return <div>Tema Error</div>;

  return (
    <div className={`peta-detail-page ${isDarkMode ? "dark-mode" : ""}`}>
      {/* Control Panel (Kanan Atas) */}
      <div className="map-controls">
        <button onClick={() => setIsDarkMode(!isDarkMode)} className="control-btn">{isDarkMode ? "☀️" : "🌙"}</button>
        <button onClick={handleExportMap} className="control-btn export-btn" disabled={isExporting}>{isExporting ? "⏳" : "📸"}</button>
        <button onClick={() => navigate("/peta")} className="control-btn back-btn">←</button>
      </div>

      <div ref={mapRef} className="peta-map-container" />

      {tema !== "tematik" && (
        <div id="popup" className="ol-popup"><div id="popup-content"></div></div>
      )}

      {/* --- CONTAINER STACKING (PERBAIKAN UTAMA) --- */}
      {/* Container ini akan memaksa anak-anaknya berbaris vertikal */}
      <div className="ui-stack-left">
        
        {/* Item 1: Filter (Diatas) */}
        <div className="stack-item-filter">
          <FilterPopup onFilterChange={handleFilterChange} />
        </div>

        {/* Item 2: Legend (Dibawahnya) */}
        <div className="stack-item-legend">
           <Legend isDarkMode={isDarkMode} />
        </div>
      
      </div>

    </div>
  );
}