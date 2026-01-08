import { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabaseClient"; // PENTING: Import koneksi Supabase
import "../styles/dataset.css";

export default function Dataset() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [q, setQ] = useState("");
  const [lokasi, setLokasi] = useState("Semua");
  const [kondisi, setKondisi] = useState("Semua");

  useEffect(() => {
    fetchPohon();
  }, []);

  const fetchPohon = async () => {
    setLoading(true);
    try {
      let { data: pohon, error } = await supabase
        .from('pohon_peneduh')
        .select('*')
        .order('id', { ascending: true });
      
      if (error) throw error;
      
      setData(pohon || []);
    } catch (error) {
      console.error("Gagal mengambil data dari Supabase:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const lokasiOptions = useMemo(() => {
    const set = new Set(data.map((d) => (d.lokasi || "Tidak diketahui").trim()));
    return ["Semua", ...Array.from(set).sort()];
  }, [data]);

  const kondisiOptions = useMemo(() => {
    const set = new Set(data.map((d) => (d.kondisi || "Tidak diketahui").trim()));
    return ["Semua", ...Array.from(set).sort()];
  }, [data]);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();

    return data.filter((d) => {
      const lok = (d.lokasi || "").toString();
      const jen = (d.jenis || "").toString();
      const kon = (d.kondisi || "").toString();

      const matchQuery =
        !query ||
        lok.toLowerCase().includes(query) ||
        jen.toLowerCase().includes(query) ||
        kon.toLowerCase().includes(query);

      const matchLokasi = lokasi === "Semua" || lok.trim() === lokasi;
      const matchKondisi = kondisi === "Semua" || kon.trim() === kondisi;

      return matchQuery && matchLokasi && matchKondisi;
    });
  }, [data, q, lokasi, kondisi]);

  const exportToCSV = () => {
    const rows = filtered.map((d, idx) => ({
      No: idx + 1,
      Lokasi: d.lokasi ?? "",
      Jenis: d.jenis ?? "",
      Diameter: d.diameter ?? "",
      Kondisi: d.kondisi ?? "",
      Suhu_Luar: d.suhu_luar ?? "",
      Latitude: d.latitude ?? "",
      Longitude: d.longitude ?? "",
    }));

    const headers = Object.keys(rows[0] || {});
    const csv = [
      headers.join(","),
      ...rows.map((r) => headers.map((h) => `"${String(r[h] ?? "").replace(/"/g, '""')}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `dataset_supabase_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  if (loading) return <div className="ds-loading">Memuat data dari Database Cloud...</div>;

  return (
    <div className="ds-page">
      <div className="ds-card">
        <div className="ds-head">
          <div>
            <h1 className="ds-title">Manajemen Dataset (Supabase)</h1>
            <p className="ds-sub">
              Menampilkan <b>{filtered.length}</b> dari <b>{data.length}</b> data
            </p>
          </div>

          <button className="ds-export" onClick={exportToCSV}>
            <span className="ds-export-ico">⬇</span> Export ke CSV
          </button>
        </div>

        {/* SEARCH */}
        <div className="ds-searchRow">
          <div className="ds-search">
            <span className="ds-icon">🔍</span>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Cari lokasi, jenis, kondisi..."
            />
          </div>
        </div>

        {/* FILTERS */}
        <div className="ds-filterRow">
          <select value={lokasi} onChange={(e) => setLokasi(e.target.value)}>
            {lokasiOptions.map((x) => <option key={x} value={x}>{x}</option>)}
          </select>

          <select value={kondisi} onChange={(e) => setKondisi(e.target.value)}>
            {kondisiOptions.map((x) => <option key={x} value={x}>{x}</option>)}
          </select>

          <button className="ds-reset" onClick={() => { setQ(""); setLokasi("Semua"); setKondisi("Semua"); }}>
            Reset
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="ds-tableCard">
        <div className="ds-tableWrap">
          <table className="ds-table">
            <thead>
              <tr>
                <th>No</th>
                <th>Lokasi</th>
                <th>Jenis</th>
                <th>Diameter (cm)</th>
                <th>Suhu Luar</th>
                <th>Kondisi</th>
                <th>Koordinat</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((item, idx) => {
                const isSehat = item.kondisi === "Sehat";
                const isPeneduh = item.jenis === "P";

                return (
                  <tr key={item.id || idx}>
                    <td>{idx + 1}</td>
                    <td>{item.lokasi}</td>
                    <td>
                       <span style={{ 
                        padding: "4px 8px", borderRadius: "6px",
                        background: isPeneduh ? "#e6f4ea" : "#fff7e6",
                        color: isPeneduh ? "#1e8e3e" : "#b06000",
                        fontWeight: "600", fontSize: "0.85rem"
                      }}>
                        {isPeneduh ? "Peneduh" : "Bukan Peneduh"}
                      </span>
                    </td>
                    <td>{item.diameter}</td>
                    <td>{item.suhu_luar ? `${item.suhu_luar}°C` : "-"}</td>
                    <td>
                      <span className={`ds-badge ${isSehat ? "ok" : "bad"}`}>
                        {item.kondisi || "-"}
                      </span>
                    </td>
                    <td style={{ fontSize: "0.8rem", color: "#666" }}>
                       {Number(item.latitude).toFixed(4)}, {Number(item.longitude).toFixed(4)}
                    </td>
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

// import { useEffect, useMemo, useState } from "react";
// import "../styles/dataset.css";

// export default function Dataset() {
//   const [raw, setRaw] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const [q, setQ] = useState("");
//   const [lokasi, setLokasi] = useState("Semua");
//   const [kondisi, setKondisi] = useState("Semua");

//   useEffect(() => {
//     fetch("/data/pohon_peneduh.json")
//       .then((res) => res.json())
//       .then((json) => {
//         setRaw(json.features || []);
//         setLoading(false);
//       })
//       .catch((err) => {
//         console.error("Gagal memuat dataset:", err);
//         setLoading(false);
//       });
//   }, []);

//   const lokasiOptions = useMemo(() => {
//     const set = new Set(
//       raw.map((d) => (d.properties?.LOKASI || "Tidak diketahui").trim())
//     );
//     return ["Semua", ...Array.from(set).sort()];
//   }, [raw]);

//   const kondisiOptions = useMemo(() => {
//     const set = new Set(
//       raw.map((d) => (d.properties?.KONDISI || "Tidak diketahui").trim())
//     );
//     return ["Semua", ...Array.from(set).sort()];
//   }, [raw]);

//   const filtered = useMemo(() => {
//     const query = q.trim().toLowerCase();

//     return raw.filter((d) => {
//       const p = d.properties || {};
//       const lok = (p.LOKASI || "").toString();
//       const jen = (p.JENIS || "").toString();
//       const kon = (p.KONDISI || "").toString();

//       const matchQuery =
//         !query ||
//         lok.toLowerCase().includes(query) ||
//         jen.toLowerCase().includes(query) ||
//         kon.toLowerCase().includes(query);

//       const matchLokasi = lokasi === "Semua" || lok.trim() === lokasi;
//       const matchKondisi = kondisi === "Semua" || kon.trim() === kondisi;

//       return matchQuery && matchLokasi && matchKondisi;
//     });
//   }, [raw, q, lokasi, kondisi]);

//   const exportToCSV = () => {
//     const rows = filtered.map((d, idx) => {
//       const p = d.properties || {};
//       const lat = d.geometry?.coordinates?.[1] ?? "";
//       const lon = d.geometry?.coordinates?.[0] ?? "";
//       return {
//         No: idx + 1,
//         Lokasi: p.LOKASI ?? "",
//         Jenis: p.JENIS ?? "",
//         Diameter_cm: p.DIAMETER ?? "",
//         Kondisi: p.KONDISI ?? "",
//         Latitude: lat,
//         Longitude: lon,
//       };
//     });

//     const headers = Object.keys(
//       rows[0] || {
//         No: "",
//         Lokasi: "",
//         Jenis: "",
//         Diameter_cm: "",
//         Kondisi: "",
//         Latitude: "",
//         Longitude: "",
//       }
//     );

//     const escapeCSV = (value) => {
//       const s = String(value ?? "");
//       const needsWrap = /[",\n]/.test(s);
//       const escaped = s.replace(/"/g, '""');
//       return needsWrap ? `"${escaped}"` : escaped;
//     };

//     const csv = [
//       headers.join(","),
//       ...rows.map((r) => headers.map((h) => escapeCSV(r[h])).join(",")),
//     ].join("\n");

//     const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
//     const url = URL.createObjectURL(blob);

//     const now = new Date();
//     const pad = (n) => String(n).padStart(2, "0");
//     const filename = `dataset_pohon_peneduh_${now.getFullYear()}-${pad(
//       now.getMonth() + 1
//     )}-${pad(now.getDate())}.csv`;

//     const a = document.createElement("a");
//     a.href = url;
//     a.download = filename;
//     document.body.appendChild(a);
//     a.click();
//     a.remove();
//     URL.revokeObjectURL(url);
//   };

//   if (loading) return <div className="ds-loading">Memuat dataset...</div>;

//   return (
//     <div className="ds-page">
//       <div className="ds-card">
//         <div className="ds-head">
//           <div>
//             <h1 className="ds-title">Manajemen Dataset Pohon Peneduh</h1>
//             <p className="ds-sub">
//               Menampilkan <b>{filtered.length}</b> dari <b>{raw.length}</b> data
//             </p>
//           </div>

//           <button className="ds-export" onClick={exportToCSV}>
//             <span className="ds-export-ico">⬇</span>
//             Export ke CSV
//           </button>
//         </div>

//         {/* SEARCH FULL WIDTH */}
//         <div className="ds-searchRow">
//           <div className="ds-search">
//             <span className="ds-icon">
//               <svg
//                 width="18"
//                 height="18"
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 stroke="currentColor"
//                 strokeWidth="2"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//               >
//                 <circle cx="11" cy="11" r="8"></circle>
//                 <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
//               </svg>
//             </span>

//             <input
//               value={q}
//               onChange={(e) => setQ(e.target.value)}
//               placeholder="Cari lokasi, jenis, kondisi..."
//             />
//           </div>
//         </div>

//         {/* FILTERS SEPARATE ROW */}
//         <div className="ds-filterRow">
//           <select value={lokasi} onChange={(e) => setLokasi(e.target.value)}>
//             {lokasiOptions.map((x) => (
//               <option key={x} value={x}>
//                 {x}
//               </option>
//             ))}
//           </select>

//           <select value={kondisi} onChange={(e) => setKondisi(e.target.value)}>
//             {kondisiOptions.map((x) => (
//               <option key={x} value={x}>
//                 {x}
//               </option>
//             ))}
//           </select>

//           <button
//             className="ds-reset"
//             onClick={() => {
//               setQ("");
//               setLokasi("Semua");
//               setKondisi("Semua");
//             }}
//           >
//             Reset
//           </button>
//         </div>
//       </div>

//       <div className="ds-tableCard">
//         <div className="ds-tableWrap">
//           <table className="ds-table">
//             <thead>
//               <tr>
//                 <th>No</th>
//                 <th>Lokasi</th>
//                 <th>Jenis</th>
//                 <th>Diameter (cm)</th>
//                 <th>Kondisi</th>
//                 <th>Latitude</th>
//                 <th>Longitude</th>
//               </tr>
//             </thead>

//             <tbody>
//               {filtered.map((item, idx) => {
//                 const p = item.properties || {};
//                 const kondisiVal = (p.KONDISI || "").trim();
//                 const isSehat = kondisiVal === "Sehat";

//                 return (
//                   <tr key={idx}>
//                     <td>{idx + 1}</td>
//                     <td>{p.LOKASI}</td>
//                     <td>{p.JENIS}</td>
//                     <td>{p.DIAMETER}</td>
//                     <td>
//                       <span className={`ds-badge ${isSehat ? "ok" : "bad"}`}>
//                         {kondisiVal || "-"}
//                       </span>
//                     </td>
//                     <td>{item.geometry?.coordinates?.[1] ?? "-"}</td>
//                     <td>{item.geometry?.coordinates?.[0] ?? "-"}</td>
//                   </tr>
//                 );
//               })}

//               {filtered.length === 0 && (
//                 <tr>
//                   <td colSpan={7} className="ds-empty">
//                     Data tidak ditemukan.
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// }
