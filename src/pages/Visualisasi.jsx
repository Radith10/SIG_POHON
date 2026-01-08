import { useEffect, useMemo, useState } from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from "chart.js";
import { Doughnut, Bar } from "react-chartjs-2";
import "../styles/visualisasi.css";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

export default function Visualisasi() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/data/pohon_peneduh.json")
      .then((res) => res.json())
      .then((json) => {
        setData(json.features || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Gagal memuat data:", err);
        setLoading(false);
      });
  }, []);

  const stats = useMemo(() => {
    const total = data.length;
    const sehat = data.filter((d) => d.properties?.KONDISI?.trim() === "Sehat").length;
    const tidakSehat = data.filter((d) => d.properties?.KONDISI?.trim() === "Tidak Sehat").length;

    const lokasiMap = {};
    data.forEach((d) => {
      const lokasi = (d.properties?.LOKASI || "Tidak diketahui").trim();
      lokasiMap[lokasi] = (lokasiMap[lokasi] || 0) + 1;
    });

    const lokasiSorted = Object.entries(lokasiMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8);

    return {
      total,
      sehat,
      tidakSehat,
      lokasiLabels: lokasiSorted.map((x) => x[0]),
      lokasiValues: lokasiSorted.map((x) => x[1]),
    };
  }, [data]);

  if (loading) {
    return <div className="vz-loading">Memuat data vegetasi...</div>;
  }

  const donutData = {
    labels: ["Sehat", "Tidak Sehat"],
    datasets: [
      {
        data: [stats.sehat, stats.tidakSehat],
        backgroundColor: ["#22C55E", "#EF4444"],
        borderColor: ["#86EFAC", "#FCA5A5"],
        borderWidth: 1,
        hoverOffset: 8,
      },
    ],
  };

  const donutOptions = {
    responsive: true,
    cutout: "70%",
    plugins: { legend: { display: false } },
  };

  const barData = {
    labels: stats.lokasiLabels,
    datasets: [
      {
        label: "Jumlah Pohon",
        data: stats.lokasiValues,
        backgroundColor: "rgba(11, 102, 35, 0.35)",
        borderColor: "#0B6623",
        borderWidth: 1,
        borderRadius: 10,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { display: false } },
      y: { grid: { color: "rgba(0,0,0,0.06)" } },
    },
  };

  return (
    <div className="vz-page">
      {/* HERO */}
      <section className="vz-hero">
        <div className="vz-hero-inner">
          <span className="vz-pill">Dashboard Analisis Spasial</span>
          <h1 className="vz-title">Visualisasi Kondisi Vegetasi & Pohon Peneduh</h1>
          <p className="vz-desc">
            Halaman ini menampilkan grafik dan visualisasi kondisi vegetasi serta pohon peneduh
            berdasarkan hasil analisis spasial untuk mendukung evaluasi lingkungan perkotaan.
          </p>
        </div>
      </section>

      <div className="vz-container">
        {/* STAT */}
        <div className="vz-stat-grid">
          <StatCard title="Total Data" value={stats.total} tone="primary" />
          <StatCard title="Pohon Sehat" value={stats.sehat} tone="success" />
          <StatCard title="Pohon Tidak Sehat" value={stats.tidakSehat} tone="danger" />
        </div>

        {/* CHARTS */}
        <div className="vz-grid2">
          <div className="vz-panel">
            <div className="vz-panel-head">
              <h3>Kondisi Vegetasi</h3>
              <span>Sehat vs Tidak Sehat</span>
            </div>

            <div className="vz-donut-wrap">
              <div className="vz-donut">
                <Doughnut data={donutData} options={donutOptions} />
              </div>

              <div className="vz-legend">
                <LegendRow color="#22C55E" label="Sehat" value={stats.sehat} />
                <LegendRow color="#EF4444" label="Tidak Sehat" value={stats.tidakSehat} />
                <div className="vz-legend-total">
                  <span>Total</span>
                  <b>{stats.total}</b>
                </div>
              </div>
            </div>
          </div>

          <div className="vz-panel">
            <div className="vz-panel-head">
              <h3>Sebaran Pohon per Lokasi</h3>
              <span>Top 8 lokasi terbanyak</span>
            </div>

            <div className="vz-bar">
              <Bar data={barData} options={barOptions} />
            </div>
          </div>
        </div>

        {/* TABLE */}
        <div className="vz-panel">
          <div className="vz-panel-head">
            <h3>Data Mentah Pohon Peneduh</h3>
            <span>Sumber: Survey Lapangan</span>
          </div>

          <div className="vz-table-wrap">
            <table className="vz-table">
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
                {data.map((item, i) => {
                  const kondisi = item.properties?.KONDISI?.trim();
                  const isSehat = kondisi === "Sehat";
                  return (
                    <tr key={i}>
                      <td>{i + 1}</td>
                      <td>{item.properties?.LOKASI}</td>
                      <td>{item.properties?.JENIS}</td>
                      <td>{item.properties?.DIAMETER}</td>
                      <td>
                        <span className={`vz-badge ${isSehat ? "ok" : "bad"}`}>
                          {kondisi}
                        </span>
                      </td>
                      <td>{item.geometry?.coordinates?.[1]}</td>
                      <td>{item.geometry?.coordinates?.[0]}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, tone = "primary" }) {
  return (
    <div className={`vz-card ${tone}`}>
      <p>{title}</p>
      <h2>{value}</h2>
    </div>
  );
}

function LegendRow({ color, label, value }) {
  return (
    <div className="vz-legend-row">
      <span className="vz-dot" style={{ background: color }} />
      <span className="vz-legend-label">{label}</span>
      <b className="vz-legend-value">{value}</b>
    </div>
  );
}
