// FilterPopup.jsx
import React, { useState } from "react";
import { Filter, X } from "lucide-react";

export default function FilterPopup({ onFilterChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState({
    jenis: { 
      P: true,    // Peneduh
      BP: true    // Bukan Peneduh
    },
    kondisi: { 
      Sehat: true,
      "Tidak Sehat": true
    },
    suhu: {
      panas: true,    // suhu > 35
      normal: true    // suhu <= 35
    }
  });

  const handleCheckboxChange = (category, value) => {
    const newFilters = {
      ...filters,
      [category]: {
        ...filters[category],
        [value]: !filters[category][value]
      }
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const resetFilters = () => {
    const resetState = {
      jenis: { 
        P: true,
        BP: true
      },
      kondisi: { 
        Sehat: true,
        "Tidak Sehat": true
      },
      suhu: {
        panas: true,
        normal: true
      }
    };
    setFilters(resetState);
    onFilterChange(resetState);
  };

  return (
    <>
      {/* Filter Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          background: "white",
          boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
          borderRadius: "8px",
          padding: "12px",
          border: "1px solid #ddd",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          fontWeight: "500",
          transition: "background 0.2s"
        }}
        onMouseOver={(e) => e.currentTarget.style.background = "#f9fafb"}
        onMouseOut={(e) => e.currentTarget.style.background = "white"}
      >
        <Filter size={20} />
        <span>Filter Pohon</span>
      </button>

      {/* Filter Popup */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            onClick={() => setIsOpen(false)}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(0,0,0,0.3)",
              zIndex: 40
            }}
          />

          {/* Popup Content */}
          <div style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            background: "white",
            borderRadius: "12px",
            boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)",
            zIndex: 50,
            width: "384px",
            maxHeight: "80vh",
            overflowY: "auto"
          }}>
            {/* Header */}
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "16px",
              borderBottom: "1px solid #e5e7eb"
            }}>
              <h3 style={{
                fontSize: "18px",
                fontWeight: "bold",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                margin: 0
              }}>
                <Filter size={20} />
                Filter Data Pohon
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                style={{
                  background: "none",
                  border: "none",
                  color: "#6b7280",
                  cursor: "pointer",
                  padding: "4px"
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Filter Content */}
            <div style={{ padding: "16px" }}>
              {/* Jenis Pohon */}
              <div style={{ marginBottom: "24px" }}>
                <h4 style={{
                  fontWeight: "600",
                  marginBottom: "12px",
                  color: "#374151",
                  fontSize: "14px"
                }}>Jenis Pohon</h4>
                <div>
                  <label style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    cursor: "pointer",
                    padding: "8px",
                    borderRadius: "4px",
                    marginBottom: "4px"
                  }}>
                    <input
                      type="checkbox"
                      checked={filters.jenis.P}
                      onChange={() => handleCheckboxChange("jenis", "P")}
                      style={{ width: "16px", height: "16px", cursor: "pointer" }}
                    />
                    <span>Pohon Peneduh</span>
                  </label>
                  <label style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    cursor: "pointer",
                    padding: "8px",
                    borderRadius: "4px"
                  }}>
                    <input
                      type="checkbox"
                      checked={filters.jenis.BP}
                      onChange={() => handleCheckboxChange("jenis", "BP")}
                      style={{ width: "16px", height: "16px", cursor: "pointer" }}
                    />
                    <span>Pohon Bukan Peneduh</span>
                  </label>
                </div>
              </div>

              {/* Kondisi Pohon */}
              <div style={{ marginBottom: "24px" }}>
                <h4 style={{
                  fontWeight: "600",
                  marginBottom: "12px",
                  color: "#374151",
                  fontSize: "14px"
                }}>Kondisi Pohon</h4>
                <div>
                  {Object.keys(filters.kondisi).map((kondisi) => (
                    <label
                      key={kondisi}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        cursor: "pointer",
                        padding: "8px",
                        borderRadius: "4px",
                        marginBottom: "4px"
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={filters.kondisi[kondisi]}
                        onChange={() => handleCheckboxChange("kondisi", kondisi)}
                        style={{ width: "16px", height: "16px", cursor: "pointer" }}
                      />
                      <span>{kondisi}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Suhu */}
              <div>
                <h4 style={{
                  fontWeight: "600",
                  marginBottom: "12px",
                  color: "#374151",
                  fontSize: "14px"
                }}>Suhu Sekitar</h4>
                <div>
                  <label style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    cursor: "pointer",
                    padding: "8px",
                    borderRadius: "4px",
                    marginBottom: "4px"
                  }}>
                    <input
                      type="checkbox"
                      checked={filters.suhu.panas}
                      onChange={() => handleCheckboxChange("suhu", "panas")}
                      style={{ width: "16px", height: "16px", cursor: "pointer" }}
                    />
                    <span>Panas (&gt; 35°C)</span>
                  </label>
                  <label style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    cursor: "pointer",
                    padding: "8px",
                    borderRadius: "4px"
                  }}>
                    <input
                      type="checkbox"
                      checked={filters.suhu.normal}
                      onChange={() => handleCheckboxChange("suhu", "normal")}
                      style={{ width: "16px", height: "16px", cursor: "pointer" }}
                    />
                    <span>Normal (≤ 35°C)</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div style={{
              padding: "16px",
              borderTop: "1px solid #e5e7eb",
              display: "flex",
              gap: "8px"
            }}>
              <button
                onClick={resetFilters}
                style={{
                  flex: 1,
                  padding: "8px 16px",
                  border: "1px solid #d1d5db",
                  borderRadius: "8px",
                  background: "white",
                  cursor: "pointer",
                  fontWeight: "500",
                  transition: "background 0.2s"
                }}
                onMouseOver={(e) => e.currentTarget.style.background = "#f9fafb"}
                onMouseOut={(e) => e.currentTarget.style.background = "white"}
              >
                Reset
              </button>
              <button
                onClick={() => setIsOpen(false)}
                style={{
                  flex: 1,
                  padding: "8px 16px",
                  background: "#2563eb",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: "500",
                  transition: "background 0.2s"
                }}
                onMouseOver={(e) => e.currentTarget.style.background = "#1d4ed8"}
                onMouseOut={(e) => e.currentTarget.style.background = "#2563eb"}
              >
                Terapkan
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}