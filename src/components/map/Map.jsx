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

    const highlightLayer = new VectorLayer({
      source: new VectorSource(),
      style: new Style({
        stroke: new Stroke({ color: "yellow", width: 3 }),
      }),
    });

    const overlay = new Overlay({
      element: popupRef.current,
      positioning: "top-center",
      offset: [0, -12],
    });

    const createdMap = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({ source: new OSM() }),
        riauLayer,
        banjirLayer,
        highlightLayer,
      ],
      overlays: [overlay],
      view: new View({
        center: fromLonLat([101.438309, 0.51044]),
        zoom: 8,
      }),
    });

    // CLICK POPUP
    createdMap.on("singleclick", (evt) => {
      const feature = createdMap.forEachFeatureAtPixel(evt.pixel, (f) => f);
      if (feature) {
        const nama = feature.get("DESA") || feature.get("Nama_Pemetaan") || "-";
        const korban = feature.get("Jumlah_Korban") || "-";

        popupContentRef.current.innerHTML = `
          <h3>Informasi</h3>
          <p><strong>${nama}</strong></p>
          <p>Korban: ${korban}</p>`;
        overlay.setPosition(evt.coordinate);
      } else {
        overlay.setPosition(undefined);
      }
    });

    // HOVER INFO + HIGHLIGHT
    let highlighted = null;
    createdMap.on("pointermove", (evt) => {
      if (evt.dragging) return;

      const feature = createdMap.forEachFeatureAtPixel(evt.pixel, (f) => f);

      if (highlighted !== feature) {
        if (highlighted) highlightLayer.getSource().removeFeature(highlighted);
        if (feature) highlightLayer.getSource().addFeature(feature);
        highlighted = feature;
      }

      setInfoText(feature ? feature.get("DESA") || "" : "");
    });

    setMap(createdMap);
  }, [map]);

  return (
  <div className="map-wrapper">
    <div ref={mapRef} className="map-canvas" />

    <Popup popupRef={popupRef} popupContentRef={popupContentRef} />

    <div className="map-ui">
      <LayerControls map={map} />
    </div>

    <div className="map-info">
      <InfoPanel text={infoText} />
    </div>
  </div>
)}