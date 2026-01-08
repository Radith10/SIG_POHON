import OSM from "ol/source/OSM";
import XYZ from "ol/source/XYZ";

export const BASEMAPS = {
  osm: {
    title: "OpenStreetMap",
    description: "Peta standar OSM",
    color: "#3b82f6",
    gradient: "linear-gradient(135deg, #60a5fa, #2563eb)",
    icon: "🗺️",
    makeSource: () => new OSM(),
  },

  dark: {
    title: "Dark Map",
    description: "Nyaman untuk malam hari",
    color: "#111827",
    gradient: "linear-gradient(135deg, #1f2933, #000000)",
    icon: "🌙",
    makeSource: () =>
      new XYZ({
        url: "https://tiles.stadiamaps.com/tiles/alidade_dark/{z}/{x}/{y}.png",
        attributions: "© Stadia Maps",
      }),
  },

  light: {
    title: "Light Map",
    description: "Tampilan cerah & bersih",
    color: "#f9fafb",
    gradient: "linear-gradient(135deg, #ffffff, #e5e7eb)",
    icon: "☀️",
    makeSource: () =>
      new XYZ({
        url: "https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}.png",
      }),
  },

  satellite: {
    title: "Satellite",
    description: "Citra satelit",
    color: "#065f46",
    gradient: "linear-gradient(135deg, #10b981, #064e3b)",
    icon: "🛰️",
    makeSource: () =>
      new XYZ({
        url:
          "https://server.arcgisonline.com/ArcGIS/rest/services/" +
          "World_Imagery/MapServer/tile/{z}/{y}/{x}",
      }),
  },
};
