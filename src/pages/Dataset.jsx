import { useEffect, useMemo, useState } from "react";
import "../styles/dataset.css";

export default function Dataset() {
  const [raw, setRaw] = useState([]);
  const [loading, setLoading] = useState(true);

  const [q, setQ] = useState("");
  const [lokasi, setLokasi] = useState("Semua");
  const [kondisi, setKondisi] = useState("Semua");

  useEffect(() => {
    fetch("/data/pohon_peneduh.json")
      .then((res) => res.json())
      .then((json) => {
        setRaw(json.features || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Gagal memuat dataset:", err);
        setLoading(false);
      });
  }, []);

  const lokasiOptions = useMemo(() => {
    const set = new Set(
      raw.map((d) => (d.properties?.LOKASI || "Tidak diketahui").trim())
    );
    return ["Semua", ...Array.from(set).sort()];
  }, [raw]);

  const kondisiOptions = useMemo(() => {
    const set = new Set(
      raw.map((d) => (d.properties?.KONDISI || "Tidak diketahui").trim())
    );
    return ["Semua", ...Array.from(set).sort()];
  }, [raw]);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();

    return raw.filter((d) => {
      const p = d.properties || {};
      const lok = (p.LOKASI || "").toString();
      const jen = (p.JENIS || "").toString();
      const kon = (p.KONDISI || "").toString();

      const matchQuery =
        !query ||
        lok.toLowerCase().includes(query) ||
        jen.toLowerCase().includes(query) ||
        kon.toLowerCase().includes(query);

      const matchLokasi = lokasi === "Semua" || lok.trim() === lokasi;
      const matchKondisi = kondisi === "Semua" || kon.trim() === kondisi;

      return matchQuery && matchLokasi && matchKondisi;
    });
  }, [raw, q, lokasi, kondisi]);

  const exportToCSV = () => {
    const rows = filtered.map((d, idx) => {
      const p = d.properties || {};
      const lat = d.geometry?.coordinates?.[1] ?? "";
      const lon = d.geometry?.coordinates?.[0] ?? "";
      return {
        No: idx + 1,
        Lokasi: p.LOKASI ?? "",
        Jenis: p.JENIS ?? "",
        Diameter_cm: p.DIAMETER ?? "",
        Kondisi: p.KONDISI ?? "",
        Latitude: lat,
        Longitude: lon,
      };
    });

    const headers = Object.keys(
      rows[0] || {
        No: "",
        Lokasi: "",
        Jenis: "",
        Diameter_cm: "",
        Kondisi: "",
        Latitude: "",
        Longitude: "",
      }
    );

    const escapeCSV = (value) => {
      const s = String(value ?? "");
      const needsWrap = /[",\n]/.test(s);
      const escaped = s.replace(/"/g, '""');
      return needsWrap ? `"${escaped}"` : escaped;
    };

    const csv = [
      headers.join(","),
      ...rows.map((r) => headers.map((h) => escapeCSV(r[h])).join(",")),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const now = new Date();
    const pad = (n) => String(n).padStart(2, "0");
    const filename = `dataset_pohon_peneduh_${now.getFullYear()}-${pad(
      now.getMonth() + 1
    )}-${pad(now.getDate())}.csv`;

    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  if (loading) return <div className="ds-loading">Memuat dataset...</div>;

  return (
    <div className="ds-page">
      <div className="ds-card">
        <div className="ds-head">
          <div>
            <h1 className="ds-title">Manajemen Dataset Pohon Peneduh</h1>
            <p className="ds-sub">
              Menampilkan <b>{filtered.length}</b> dari <b>{raw.length}</b> data
            </p>
          </div>

          <button className="ds-export" onClick={exportToCSV}>
            <span className="ds-export-ico">⬇</span>
            Export ke CSV
          </button>
        </div>

        {/* SEARCH FULL WIDTH */}
        <div className="ds-searchRow">
          <div className="ds-search">
            <span className="ds-icon">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </span>

            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Cari lokasi, jenis, kondisi..."
            />
          </div>
        </div>

        {/* FILTERS SEPARATE ROW */}
        <div className="ds-filterRow">
          <select value={lokasi} onChange={(e) => setLokasi(e.target.value)}>
            {lokasiOptions.map((x) => (
              <option key={x} value={x}>
                {x}
              </option>
            ))}
          </select>

          <select value={kondisi} onChange={(e) => setKondisi(e.target.value)}>
            {kondisiOptions.map((x) => (
              <option key={x} value={x}>
                {x}
              </option>
            ))}
          </select>

          <button
            className="ds-reset"
            onClick={() => {
              setQ("");
              setLokasi("Semua");
              setKondisi("Semua");
            }}
          >
            Reset
          </button>
        </div>
      </div>

      <div className="ds-tableCard">
        <div className="ds-tableWrap">
          <table className="ds-table">
            <thead>
              <tr>
                <th>No</th>
                <th>Lokasi</th>
                <th>Jenis</th>
                <th>Diameter (cm)</th>
                <th>Kondisi</th>
                <th>Latitude</th>
                <th>Longitude</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((item, idx) => {
                const p = item.properties || {};
                const kondisiVal = (p.KONDISI || "").trim();
                const isSehat = kondisiVal === "Sehat";

                return (
                  <tr key={idx}>
                    <td>{idx + 1}</td>
                    <td>{p.LOKASI}</td>
                    <td>{p.JENIS}</td>
                    <td>{p.DIAMETER}</td>
                    <td>
                      <span className={`ds-badge ${isSehat ? "ok" : "bad"}`}>
                        {kondisiVal || "-"}
                      </span>
                    </td>
                    <td>{item.geometry?.coordinates?.[1] ?? "-"}</td>
                    <td>{item.geometry?.coordinates?.[0] ?? "-"}</td>
                  </tr>
                );
              })}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="ds-empty">
                    Data tidak ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
