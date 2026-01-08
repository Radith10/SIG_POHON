import { useEffect, useMemo, useState } from "react";
import "../styles/insight.css";

export default function Insight() {
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

  const insights = useMemo(() => {
    const total = data.length;
    if (!total) return null;

    // Helper untuk parse number
    const parseNum = (x) => {
      const n = Number(String(x ?? "").replace(",", "."));
      return Number.isFinite(n) ? n : null;
    };

    // Analisis kondisi (handle whitespace)
    const sehat = data.filter((d) => d.properties?.KONDISI?.trim() === "Sehat");
    const tidakSehat = data.filter(
      (d) => d.properties?.KONDISI?.trim() === "Tidak Sehat"
    );

    const sehatPct = ((sehat.length / total) * 100).toFixed(1);
    const tidakSehatPct = ((tidakSehat.length / total) * 100).toFixed(1);

    // Analisis lokasi
    const lokasiMap = {};
    data.forEach((d) => {
      const lok = (d.properties?.LOKASI || "Tidak diketahui").trim();
      lokasiMap[lok] = (lokasiMap[lok] || 0) + 1;
    });

    const lokasiSorted = Object.entries(lokasiMap).sort((a, b) => b[1] - a[1]);
    const topLokasi = lokasiSorted[0];
    const lowLokasi = lokasiSorted[lokasiSorted.length - 1];

    // Analisis jenis pohon
    const jenisMap = {};
    data.forEach((d) => {
      const jenis = (d.properties?.JENIS || "Tidak diketahui").trim();
      jenisMap[jenis] = (jenisMap[jenis] || 0) + 1;
    });
    const jenisSorted = Object.entries(jenisMap).sort((a, b) => b[1] - a[1]);

    // Analisis diameter
    const diameters = data
      .map((d) => parseNum(d.properties?.DIAMETER))
      .filter((n) => n != null);

    const avgDiameter =
      diameters.length > 0
        ? (diameters.reduce((a, b) => a + b, 0) / diameters.length).toFixed(1)
        : 0;

    const maxDiameter = diameters.length > 0 ? Math.max(...diameters) : 0;
    const minDiameter = diameters.length > 0 ? Math.min(...diameters) : 0;

    // Analisis efek pendinginan (selisih suhu)
    const suhuData = data
      .map((d) => {
        const suhuSekitar = parseNum(d.properties?.["SUHU SEKITAR \nPOHON"]);
        const suhuLuar = parseNum(d.properties?.["SUHU DILUAR \nPOHON"]);
        if (suhuSekitar != null && suhuLuar != null) {
          return { suhuSekitar, suhuLuar, selisih: suhuLuar - suhuSekitar };
        }
        return null;
      })
      .filter((d) => d != null);

    const avgSelisihSuhu =
      suhuData.length > 0
        ? (
            suhuData.reduce((a, b) => a + b.selisih, 0) / suhuData.length
          ).toFixed(2)
        : 0;

    const avgSuhuSekitar =
      suhuData.length > 0
        ? (
            suhuData.reduce((a, b) => a + b.suhuSekitar, 0) / suhuData.length
          ).toFixed(1)
        : 0;

    const avgSuhuLuar =
      suhuData.length > 0
        ? (
            suhuData.reduce((a, b) => a + b.suhuLuar, 0) / suhuData.length
          ).toFixed(1)
        : 0;

    const maxSelisih =
      suhuData.length > 0 ? Math.max(...suhuData.map((d) => d.selisih)) : 0;

    // Analisis jarak dari jalan
    const jarakData = data
      .map((d) => parseNum(d.properties?.["JARAK DARI \nJALAN (m)"]))
      .filter((n) => n != null);

    const avgJarak =
      jarakData.length > 0
        ? (jarakData.reduce((a, b) => a + b, 0) / jarakData.length).toFixed(2)
        : 0;

    // Kondisi per lokasi (untuk identifikasi area kritis)
    const kondisiPerLokasi = {};
    data.forEach((d) => {
      const lok = (d.properties?.LOKASI || "Tidak diketahui").trim();
      const kondisi = d.properties?.KONDISI?.trim();
      if (!kondisiPerLokasi[lok]) {
        kondisiPerLokasi[lok] = { sehat: 0, tidakSehat: 0 };
      }
      if (kondisi === "Sehat") kondisiPerLokasi[lok].sehat++;
      else if (kondisi === "Tidak Sehat") kondisiPerLokasi[lok].tidakSehat++;
    });

    // Area dengan persentase tidak sehat tertinggi
    const areaKritis = Object.entries(kondisiPerLokasi)
      .map(([lok, counts]) => {
        const totalLok = counts.sehat + counts.tidakSehat;
        const pctTidakSehat =
          totalLok > 0 ? (counts.tidakSehat / totalLok) * 100 : 0;
        return { lokasi: lok, pctTidakSehat, total: totalLok };
      })
      .filter((a) => a.total >= 3) // minimal 3 pohon
      .sort((a, b) => b.pctTidakSehat - a.pctTidakSehat)
      .slice(0, 3);

    // Efek pendinginan per lokasi
    const pendinginanPerLokasi = {};
    data.forEach((d) => {
      const lok = (d.properties?.LOKASI || "Tidak diketahui").trim();
      const suhuSekitar = parseNum(d.properties?.["SUHU SEKITAR \nPOHON"]);
      const suhuLuar = parseNum(d.properties?.["SUHU DILUAR \nPOHON"]);
      if (suhuSekitar != null && suhuLuar != null) {
        if (!pendinginanPerLokasi[lok]) {
          pendinginanPerLokasi[lok] = { total: 0, count: 0 };
        }
        pendinginanPerLokasi[lok].total += suhuLuar - suhuSekitar;
        pendinginanPerLokasi[lok].count++;
      }
    });

    const topPendinginan = Object.entries(pendinginanPerLokasi)
      .map(([lok, val]) => ({
        lokasi: lok,
        avgPendinginan: val.count > 0 ? val.total / val.count : 0,
        count: val.count,
      }))
      .filter((a) => a.count >= 3)
      .sort((a, b) => b.avgPendinginan - a.avgPendinginan)
      .slice(0, 3);

    return {
      total,
      sehat: sehat.length,
      tidakSehat: tidakSehat.length,
      sehatPct,
      tidakSehatPct,
      topLokasi,
      lowLokasi,
      avgDiameter,
      maxDiameter,
      minDiameter,
      totalLokasi: lokasiSorted.length,
      areaKritis,
      jenisSorted,
      avgSelisihSuhu,
      avgSuhuSekitar,
      avgSuhuLuar,
      maxSelisih: maxSelisih.toFixed(1),
      avgJarak,
      topPendinginan,
    };
  }, [data]);

  if (loading) {
    return <div className="ins-loading">Memuat insight...</div>;
  }

  if (!insights) {
    return (
      <div className="ins-loading">Data tidak tersedia untuk analisis.</div>
    );
  }

  return (
    <div className="ins-page">
      {/* HERO */}
      <section className="ins-hero">
        <div className="ins-hero-inner">
          <h1 className="ins-title">Temuan & Rekomendasi</h1>
          <p className="ins-desc">
            Interpretasi mendalam dari hasil analisis spasial pohon peneduh
            untuk mendukung pengambilan keputusan dalam perencanaan lingkungan
            perkotaan yang berkelanjutan.
          </p>
        </div>
      </section>

      <div className="ins-container">
        {/* RINGKASAN UTAMA */}
        <div className="ins-summary">
          <SummaryCard
            icon="icon/tree2.png"
            label="Total Pohon"
            value="100"
            accent="primary"
          />
          <SummaryCard
            icon="icon/healthcare.png"
            label="Kondisi Sehat"
            value={`${insights.sehatPct}%`}
            sub={`${insights.sehat} pohon`}
            accent="success"
          />
          <SummaryCard
            icon="icon/cooling.png"
            label="Efek Pendinginan"
            value={`${insights.avgSelisihSuhu}°C`}
            sub="Rata-rata penurunan suhu"
            accent="info"
          />
          <SummaryCard
            icon="icon/location.png"
            label="Kabupaten"
            value={insights.totalLokasi}
            accent="warning"
          />
        </div>

        {/* EFEK PENDINGINAN */}
        <section className="ins-section">
          <div className="ins-section-header">
            <h2>Efek Pendinginan Pohon</h2>
            <span>Analisis penurunan suhu oleh vegetasi</span>
          </div>

          <div className="ins-temp-grid">
            <div className="ins-temp-card">
              <div className="ins-temp-icon hot">☀️</div>
              <div className="ins-temp-info">
                <span>Suhu Luar Pohon</span>
                <h3>{insights.avgSuhuLuar}°C</h3>
                <p>Rata-rata suhu tanpa naungan</p>
              </div>
            </div>
            <div className="ins-temp-arrow">→</div>
            <div className="ins-temp-card">
              <div className="ins-temp-icon cool">🌿</div>
              <div className="ins-temp-info">
                <span>Suhu Sekitar Pohon</span>
                <h3>{insights.avgSuhuSekitar}°C</h3>
                <p>Rata-rata suhu di bawah naungan</p>
              </div>
            </div>
            <div className="ins-temp-result">
              <span>Penurunan</span>
              <h2>{insights.avgSelisihSuhu}°C</h2>
              <p>Maks: {insights.maxSelisih}°C</p>
            </div>
          </div>
        </section>

        {/* TEMUAN UTAMA */}
        <section className="ins-section">
          <div className="ins-section-header">
            <h2> Temuan Utama</h2>
            <span>Hasil analisis data pohon peneduh</span>
          </div>

          <div className="ins-findings">
            <FindingCard
              number="01"
              title="Mayoritas Vegetasi dalam Kondisi Baik"
              description={`Sebanyak ${insights.sehatPct}% dari total ${insights.total} pohon tercatat dalam kondisi sehat. Hanya ${insights.tidakSehatPct}% (${insights.tidakSehat} pohon) yang memerlukan perhatian khusus.`}
              type="positive"
            />
            <FindingCard
              number="02"
              title="Konsentrasi Pohon Tertinggi"
              description={`Lokasi "${insights.topLokasi?.[0]}" memiliki konsentrasi pohon tertinggi dengan ${insights.topLokasi?.[1]} pohon peneduh. Area ini menjadi zona hijau utama di kawasan perkotaan.`}
              type="neutral"
            />
            <FindingCard
              number="03"
              title="Efek Pendinginan Signifikan"
              description={`Pohon peneduh mampu menurunkan suhu rata-rata ${insights.avgSelisihSuhu}°C dari ${insights.avgSuhuLuar}°C menjadi ${insights.avgSuhuSekitar}°C. Efek maksimum mencapai ${insights.maxSelisih}°C.`}
              type="positive"
            />
            <FindingCard
              number="04"
              title="Karakteristik Diameter Pohon"
              description={`Rata-rata diameter pohon adalah ${insights.avgDiameter} cm, dengan rentang ${insights.minDiameter} - ${insights.maxDiameter} cm. Variasi ini menunjukkan keberagaman usia vegetasi.`}
              type="neutral"
            />
          </div>
        </section>

        {/* JENIS POHON */}
        <section className="ins-section">
          <div className="ins-section-header">
            <h2> Distribusi Jenis Pohon</h2>
            <span>Komposisi jenis vegetasi peneduh</span>
          </div>

          <div className="ins-jenis-grid">
            {insights.jenisSorted.map(([jenis, count], idx) => (
              <JenisCard
                key={idx}
                jenis={jenis}
                count={count}
                total={insights.total}
                rank={idx + 1}
              />
            ))}
          </div>
        </section>

        {/* TOP PENDINGINAN */}
        {insights.topPendinginan.length > 0 && (
          <section className="ins-section">
            <div className="ins-section-header">
              <h2> Lokasi Pendinginan Terbaik</h2>
              <span>Area dengan efek pendinginan tertinggi</span>
            </div>

            <div className="ins-cooling">
              {insights.topPendinginan.map((area, idx) => (
                <CoolingArea
                  key={idx}
                  rank={idx + 1}
                  lokasi={area.lokasi}
                  avgCooling={area.avgPendinginan.toFixed(2)}
                  count={area.count}
                />
              ))}
            </div>
          </section>
        )}

        {/* AREA KRITIS */}
        {insights.areaKritis.length > 0 &&
          insights.areaKritis.some((a) => a.pctTidakSehat > 0) && (
            <section className="ins-section">
              <div className="ins-section-header">
                <h2> Area Prioritas Perawatan</h2>
                <span>Lokasi dengan vegetasi tidak sehat tertinggi</span>
              </div>

              <div className="ins-critical">
                {insights.areaKritis
                  .filter((a) => a.pctTidakSehat > 0)
                  .map((area, idx) => (
                    <CriticalArea
                      key={idx}
                      rank={idx + 1}
                      lokasi={area.lokasi}
                      pct={area.pctTidakSehat.toFixed(1)}
                      total={area.total}
                    />
                  ))}
              </div>
            </section>
          )}

        {/* REKOMENDASI */}
        <section className="ins-section">
          <div className="ins-section-header">
            <h2>💡 Rekomendasi</h2>
            <span>Langkah strategis berdasarkan analisis</span>
          </div>

          <div className="ins-recommendations">
            <RecommendationCard
              icon="🌡️"
              title="Optimalisasi Pendinginan"
              items={[
                "Perbanyak penanaman di area dengan suhu tinggi",
                `Fokus pada lokasi dengan efek pendinginan > ${insights.avgSelisihSuhu}°C`,
                "Prioritaskan jenis pohon dengan kanopi lebar untuk naungan maksimal",
              ]}
            />
            <RecommendationCard
              icon="🔧"
              title="Perawatan & Pemeliharaan"
              items={[
                `Perhatikan ${insights.tidakSehat} pohon dengan kondisi tidak sehat`,
                "Lakukan inspeksi rutin minimal setiap 3 bulan",
                `Rata-rata jarak pohon dari jalan ${insights.avgJarak}m perlu diperhatikan`,
              ]}
            />
            <RecommendationCard
              icon="📊"
              title="Monitoring Berkelanjutan"
              items={[
                "Update data kondisi dan suhu secara berkala",
                "Gunakan analisis spasial untuk tracking perubahan iklim mikro",
                "Libatkan masyarakat dalam pelaporan kondisi vegetasi",
              ]}
            />
          </div>
        </section>

        {/* KESIMPULAN */}
        <section className="ins-conclusion">
          <div className="ins-conclusion-inner">
            <h3> Kesimpulan</h3>
            <p>
              Analisis spasial terhadap <strong>{insights.total}</strong> pohon
              peneduh menunjukkan bahwa <strong>{insights.sehatPct}%</strong>{" "}
              vegetasi dalam kondisi sehat dengan efek pendinginan rata-rata{" "}
              <strong>{insights.avgSelisihSuhu}°C</strong>. Pohon peneduh
              berperan penting dalam menurunkan suhu dari{" "}
              <strong>{insights.avgSuhuLuar}°C</strong> menjadi{" "}
              <strong>{insights.avgSuhuSekitar}°C</strong>. Lokasi{" "}
              <strong>{insights.topLokasi?.[0]}</strong> menjadi zona hijau
              utama dengan konsentrasi tertinggi. Fokus perbaikan diarahkan pada
              area prioritas dengan pendekatan pemeliharaan sistematis untuk
              keberlanjutan ruang terbuka hijau perkotaan.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

/* ========== KOMPONEN PENDUKUNG ========== */

function SummaryCard({ icon, label, value, sub, accent = "primary" }) {
  return (
    <div className={`ins-summary-card ${accent}`}>
      <span className="ins-summary-icon">
        <img
          src={icon}
          style={{
            width: "40px",
            height: "40px",
            objectFit: "contain",
            display: "block",
          }}
          className="theme-card-icon-img"
        />
      </span>
      <div className="ins-summary-content">
        <p className="ins-summary-label">{label}</p>
        <h3 className="ins-summary-value">{value}</h3>
        {sub && <span className="ins-summary-sub">{sub}</span>}
      </div>
    </div>
  );
}

function FindingCard({ number, title, description, type = "neutral" }) {
  return (
    <div className={`ins-finding ${type}`}>
      <span className="ins-finding-num">{number}</span>
      <div className="ins-finding-content">
        <h4>{title}</h4>
        <p>{description}</p>
      </div>
    </div>
  );
}

function JenisCard({ jenis, count, total, rank }) {
  const pct = ((count / total) * 100).toFixed(1);
  const jenisName =
    jenis === "P"
      ? "Pohon Peneduh (P)"
      : jenis === "BP"
      ? "Bukan Pohon (BP)"
      : jenis;

  return (
    <div className="ins-jenis-card">
      <span className="ins-jenis-rank">#{rank}</span>
      <div className="ins-jenis-info">
        <h4>{jenisName}</h4>
        <p>
          <strong>{count}</strong> pohon ({pct}%)
        </p>
      </div>
      <div className="ins-jenis-bar">
        <div
          className="ins-jenis-fill"
          style={{ width: `${Math.min(parseFloat(pct), 100)}%` }}
        />
      </div>
    </div>
  );
}

function CoolingArea({ rank, lokasi, avgCooling, count }) {
  return (
    <div className="ins-cooling-card">
      <span className="ins-cooling-rank">#{rank}</span>
      <div className="ins-cooling-info">
        <h4>{lokasi}</h4>
        <p>
          Rata-rata penurunan <strong>{avgCooling}°C</strong> dari {count} pohon
        </p>
      </div>
      <div className="ins-cooling-badge">
        <span>❄️ {avgCooling}°C</span>
      </div>
    </div>
  );
}

function CriticalArea({ rank, lokasi, pct, total }) {
  return (
    <div className="ins-critical-card">
      <span className="ins-critical-rank">#{rank}</span>
      <div className="ins-critical-info">
        <h4>{lokasi}</h4>
        <p>
          <strong>{pct}%</strong> tidak sehat dari {total} pohon
        </p>
      </div>
      <div className="ins-critical-bar">
        <div
          className="ins-critical-fill"
          style={{ width: `${Math.min(pct, 100)}%` }}
        />
      </div>
    </div>
  );
}

function RecommendationCard({ icon, title, items }) {
  return (
    <div className="ins-rec-card">
      <div className="ins-rec-header">
        <span className="ins-rec-icon">{icon}</span>
        <h4>{title}</h4>
      </div>
      <ul className="ins-rec-list">
        {items.map((item, idx) => (
          <li key={idx}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
