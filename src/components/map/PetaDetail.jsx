import { useEffect, useMemo, useRef } from "react";
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

const BASEMAP_BY_TEMA = {
  tematik: {
    title: "Peta Tematik",
    lightSource: new OSM(),
    darkSource: new XYZ({
      url: "https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}.png",
    }),
  },
  Humanitarian: {
    title: "Peta Humanitarian",
    lightSource: new XYZ({
      url: "https://{a-c}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png",
    }),
    darkSource: new XYZ({
      url: "https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}.png",
    }),
  },
  basemap: {
    title: "Peta Umum",
    lightSource: new OSM(),
    darkSource: new XYZ({
      url: "https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}.png",
    }),
  },
  petaSatelit: {
    title: "Peta Satelit",
    lightSource: new XYZ({
      url: "https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}",
    }),
    darkSource: new XYZ({
      url: "https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}",
    }),
  },
  CyclOSM: {
    title: "Peta CyclOSM",
    lightSource: new XYZ({
      url: "https://{a-c}.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png",
    }),
    darkSource: new XYZ({
      url: "https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}.png",
    }),
  },
  terrain: {
    title: "Peta Terrain",
    lightSource: new XYZ({
      url: "https://{a-c}.tile.opentopomap.org/{z}/{x}/{y}.png",
    }),
    darkSource: new XYZ({
      url: "https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}.png",
    }),
  },
  hybrid: {
    title: "Peta Hybrid",
    lightSource: new XYZ({
      url: "https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}",
    }),
    darkSource: new XYZ({
      url: "https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}",
    }),
  },
};

export default function PetaDetail() {
  const { tema } = useParams();
  const navigate = useNavigate();
  const mapRef = useRef(null);
  const mapInstance = useRef(null);

  // Gunakan context untuk dark mode dan export state
  const { isDarkMode, setIsDarkMode, isExporting, setIsExporting } =
    useAppContext();

  const temaConfig = useMemo(() => {
    return BASEMAP_BY_TEMA[tema];
  }, [tema]);
  //style untuk heat map
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

  // Fungsi untuk export map sebagai image
  const handleExportMap = () => {
    if (!mapInstance.current) return;

    setIsExporting(true);

    mapInstance.current.once("rendercomplete", () => {
      const mapCanvas = document.createElement("canvas");
      const size = mapInstance.current.getSize();
      mapCanvas.width = size[0];
      mapCanvas.height = size[1];
      const mapContext = mapCanvas.getContext("2d");

      Array.prototype.forEach.call(
        mapInstance.current
          .getViewport()
          .querySelectorAll(".ol-layer canvas, canvas.ol-layer"),
        (canvas) => {
          if (canvas.width > 0) {
            const opacity =
              canvas.parentNode.style.opacity || canvas.style.opacity;
            mapContext.globalAlpha = opacity === "" ? 1 : Number(opacity);

            let matrix;
            const transform = canvas.style.transform;
            if (transform) {
              matrix = transform
                .match(/^matrix\(([^\(]*)\)$/)[1]
                .split(",")
                .map(Number);
            } else {
              matrix = [
                parseFloat(canvas.style.width) / canvas.width,
                0,
                0,
                parseFloat(canvas.style.height) / canvas.height,
                0,
                0,
              ];
            }
            CanvasRenderingContext2D.prototype.setTransform.apply(
              mapContext,
              matrix
            );
            const backgroundColor = canvas.parentNode.style.backgroundColor;
            if (backgroundColor) {
              mapContext.fillStyle = backgroundColor;
              mapContext.fillRect(0, 0, canvas.width, canvas.height);
            }
            mapContext.drawImage(canvas, 0, 0);
          }
        }
      );

      mapContext.globalAlpha = 1;
      mapContext.setTransform(1, 0, 0, 1, 0, 0);

      // Download image
      const link = document.createElement("a");
      link.download = `peta-${tema}-${new Date().getTime()}.png`;
      link.href = mapCanvas.toDataURL();
      link.click();

      setIsExporting(false);
    });

    mapInstance.current.renderSync();
  };

  useEffect(() => {
    if (!temaConfig || !mapRef.current) return;

    if (mapInstance.current) {
      mapInstance.current.setTarget(null);
    }

    const baseLayer = new TileLayer({
      source: isDarkMode ? temaConfig.darkSource : temaConfig.lightSource,
    });

    const layers = [baseLayer];

    if (tema === "tematik") {
      const heatLayerPeneduh = new HeatmapLayer({
        source: new VectorSource({
          url: "/data/pohon_peneduh.json",
          format: new GeoJSON(),
        }),
        weight: (feature) => {
          return feature.get("JENIS") === "P"
            ? feature.get("DIAMETER") / 200
            : 0;
        },
        radius: 20,
        blur: 25,
        gradient: [
          "rgba(255, 255, 0, 0)",
          "rgba(255, 255, 0, 0.3)",
          "rgba(255, 255, 0, 0.6)",
          "rgba(255, 220, 0, 0.8)",
          "rgba(255, 200, 0, 1)",
        ],
      });

      const heatLayerBukanPeneduh = new HeatmapLayer({
        source: new VectorSource({
          url: "/data/pohon_peneduh.json",
          format: new GeoJSON(),
        }),
        weight: (feature) => {
          return feature.get("JENIS") !== "P"
            ? feature.get("DIAMETER") / 200
            : 0;
        },
        radius: 20,
        blur: 25,
        gradient: [
          "rgba(255, 0, 0, 0)",
          "rgba(255, 0, 0, 0.4)",
          "rgba(255, 0, 0, 0.7)",
          "rgba(220, 0, 0, 0.9)",
          "rgba(200, 0, 0, 1)",
        ],
      });

      layers.push(heatLayerPeneduh);
      layers.push(heatLayerBukanPeneduh);
    } else {
      const pohonLayer = new VectorLayer({
        source: new VectorSource({
          url: "/data/pohon_peneduh.json",
          format: new GeoJSON(),
        }),
        style: styleByJenis,
      });
      layers.push(pohonLayer);
    }

    const map = new Map({
      target: mapRef.current,
      layers: layers,
      view: new View({
        center: fromLonLat([101.4478, 0.5071]),
        zoom: 13,
      }),
    });

    if (tema !== "tematik") {
      const popupElement = document.getElementById("popup");
      const popupContent = document.getElementById("popup-content");

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
        const jenisPohon =
          props.JENIS === "P"
            ? "Peneduh"
            : props.JENIS === "BP"
            ? "Bukan Peneduh"
            : "Tidak diketahui";
        const suhuSekitar = Number(props["SUHU SEKITAR \nPOHON"]).toFixed(1);
        const suhuLuar = Number(props["SUHU DILUAR \nPOHON"]).toFixed(1);
        const efekSejuk = (suhuLuar - suhuSekitar).toFixed(1);
        const jarakJalan = Number(props["JARAK DARI \nJALAN (m)"]).toFixed(2);

        popupContent.innerHTML = `
          <div class="popup-card">
            <div class="popup-header">📍 Data Pohon</div>
            <div class="popup-section">
              <div class="popup-item">
                <span class="label">📌 Lokasi</span>
                <span class="value">${props.LOKASI}</span>
              </div>
              <div class="popup-item">
                <span class="label">🌳 Jenis Pohon</span>
                <span class="badge ${
                  props.JENIS === "P" ? "badge-green" : "badge-orange"
                }">
                  ${jenisPohon}
                </span>
              </div>
              <div class="popup-item">
                <span class="label">📏 Diameter</span>
                <span class="value">${props.DIAMETER} cm</span>
              </div>
              <div class="popup-item">
                <span class="label">💚 Kondisi</span>
                <span class="value">${props.KONDISI}</span>
              </div>
            </div>
            <div class="popup-divider"></div>
            <div class="popup-section">
              <div class="popup-item">
                <span class="label">🌡️ Suhu Sekitar</span>
                <span class="value">${suhuSekitar} °C</span>
              </div>
              <div class="popup-item">
                <span class="label">☀️ Suhu Luar</span>
                <span class="value">${suhuLuar} °C</span>
              </div>
              <div class="popup-highlight">
                ❄️ Efek Sejuk <b>${efekSejuk} °C</b>
              </div>
            </div>
            <div class="popup-divider"></div>
            <div class="popup-section">
              <div class="popup-item">
                <span class="label">🛣️ Jarak dari Jalan</span>
                <span class="value">${jarakJalan} m</span>
              </div>
              <div class="popup-item">
                <span class="label">🌍 Koordinat</span>
                <span class="value">
                  ${props["Latitude (Y)"]}, ${props["Longitude (X)"]}
                </span>
              </div>
            </div>
          </div>
        `;

        overlayPopup.setPosition(evt.coordinate);
        popupElement.classList.add("show");
        map.getTargetElement().style.cursor = "pointer";
      });
    }

    map.updateSize();
    mapInstance.current = map;
  }, [temaConfig, tema, isDarkMode]);

  if (!temaConfig) {
    return (
      <div className="peta-detail-error">
        <h2>❌ Tema tidak ditemukan</h2>
        <button onClick={() => navigate("/peta")}>Kembali ke Pilih Peta</button>
      </div>
    );
  }

  return (
    <div className={`peta-detail-page ${isDarkMode ? "dark-mode" : ""}`}>
      {/* Control Panel */}
      <div className="map-controls">
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="control-btn"
          title="Toggle Dark Mode"
        >
          {isDarkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </button>

        <button
          onClick={handleExportMap}
          className="control-btn export-btn"
          disabled={isExporting}
          title="Export Map"
        >
          {isExporting ? "⏳ Exporting..." : "📸 Export Map"}
        </button>

        <button
          onClick={() => navigate("/peta")}
          className="control-btn back-btn"
        >
          ← Kembali
        </button>
      </div>

      {/* MAP */}
      <div ref={mapRef} className="peta-map-container" />

      {/* POPUP */}
      {tema !== "tematik" && (
        <div id="popup" className="ol-popup">
          <div id="popup-content"></div>
        </div>
      )}

      <Legend isDarkMode={isDarkMode} />
    </div>
  );
}
