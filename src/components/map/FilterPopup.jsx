import React, { useState, useEffect } from "react";

export default function FilterPopup({ onFilterChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState({
    jenis: {
      P: true,      // Peneduh
      BP: true,     // Bukan Peneduh
    },
    suhu: {
      panas: true,  // > 35°C
      normal: true, // <= 35°C
    },
    kondisi: {
      "Sehat": true,
      "Tidak Sehat": true,
    },
  });

  // Panggil onFilterChange saat komponen pertama kali dimuat
  useEffect(() => {
    if (onFilterChange) {
      onFilterChange(filters);
    }
  }, []);

  const handleCheckboxChange = (category, key) => {
    const newFilters = {
      ...filters,
      [category]: {
        ...filters[category],
        [key]: !filters[category][key],
      },
    };
    
    console.log('Filter changed:', category, key, 'to', !filters[category][key]);
    console.log('New filters:', newFilters);
    
    setFilters(newFilters);
    
    if (onFilterChange) {
      onFilterChange(newFilters);
    }
  };

  const resetFilters = () => {
    const defaultFilters = {
      jenis: { P: true, BP: true },
      suhu: { panas: true, normal: true },
      kondisi: { "Sehat": true, "Tidak Sehat": true},
    };
    
    console.log('Resetting filters to:', defaultFilters);
    
    setFilters(defaultFilters);
    
    if (onFilterChange) {
      onFilterChange(defaultFilters);
    }
  };

  const countActive = () => {
    let count = 0;
    Object.values(filters).forEach(category => {
      Object.values(category).forEach(val => {
        if (val) count++;
      });
    });
    return count;
  };

  return (
    <div className="filter-popup-wrapper">
      <button
        type="button"
        className="filter-toggle-btn"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle Filter"
      >
        <span className="filter-icon">🔍</span>
        <span className="filter-text">Filter</span>
        <span className="filter-badge">{countActive()}</span>
      </button>

      {isOpen && (
        <div className="filter-popup">
          <div className="filter-popup-header">
            <h3>Filter Pohon</h3>
            <button
              type="button"
              className="filter-close-btn"
              onClick={() => setIsOpen(false)}
              aria-label="Close"
            >
              ✕
            </button>
          </div>

          <div className="filter-popup-content">
            {/* Filter Jenis Pohon */}
            <div className="filter-section">
              <h4 className="filter-section-title">
                <span className="filter-section-icon">🌳</span>
                Jenis Pohon
              </h4>
              <label className="filter-checkbox-label">
                <input
                  type="checkbox"
                  checked={filters.jenis.P}
                  onChange={() => handleCheckboxChange("jenis", "P")}
                />
                <span className="checkbox-custom"></span>
                <img src="/icon/tree.png" alt="" className="filter-icon-img" />
                <span>Pohon Peneduh</span>
              </label>

              <label className="filter-checkbox-label">
                <input
                  type="checkbox"
                  checked={filters.jenis.BP}
                  onChange={() => handleCheckboxChange("jenis", "BP")}
                />
                <span className="checkbox-custom"></span>
                <img src="/icon/orange.png" alt="" className="filter-icon-img" />
                <span>Bukan Peneduh</span>
              </label>
            </div>

            {/* Filter Suhu */}
            <div className="filter-section">
              <h4 className="filter-section-title">
                <span className="filter-section-icon">🌡️</span>
                Suhu Sekitar
              </h4>
              <label className="filter-checkbox-label">
                <input
                  type="checkbox"
                  checked={filters.suhu.panas}
                  onChange={() => handleCheckboxChange("suhu", "panas")}
                />
                <span className="checkbox-custom"></span>
                <span className="filter-temp-indicator temp-hot">🔥</span>
                <span>Panas (&gt; 35°C)</span>
              </label>

              <label className="filter-checkbox-label">
                <input
                  type="checkbox"
                  checked={filters.suhu.normal}
                  onChange={() => handleCheckboxChange("suhu", "normal")}
                />
                <span className="checkbox-custom"></span>
                <span className="filter-temp-indicator temp-normal">❄️</span>
                <span>Normal (≤ 35°C)</span>
              </label>
            </div>

            {/* Filter Kondisi */}
            <div className="filter-section">
              <h4 className="filter-section-title">
                <span className="filter-section-icon">💚</span>
                Kondisi Pohon
              </h4>
              <label className="filter-checkbox-label">
                <input
                  type="checkbox"
                  checked={filters.kondisi.Sehat}
                  onChange={() => handleCheckboxChange("kondisi", "Sehat")}
                />
                <span className="checkbox-custom"></span>
                <span className="filter-status-dot status-sehat">●</span>
                <span>Sehat</span>
              </label>

              <label className="filter-checkbox-label">
                <input
                  type="checkbox"
                  checked={filters.kondisi["Tidak Sehat"]}
                  onChange={() => handleCheckboxChange("kondisi", "Tidak Sehat")}
                />
                <span className="checkbox-custom"></span>
                <span className="filter-status-dot status-tidak-sehat">●</span>
                <span>Tidak Sehat</span>
              </label>
            </div>
          </div>

          <div className="filter-popup-footer">
            <button type="button" className="filter-reset-btn" onClick={resetFilters}>
              Reset Filter
            </button>
          </div>
        </div>
      )}

      <style>{`
        .filter-popup-wrapper {
          position: relative;
        }

        .filter-toggle-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 16px;
          background: white;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 600;
          color: #374151;
          transition: all 0.2s;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }

        .filter-toggle-btn:hover {
          border-color: #0B6623;
          background: #f9fafb;
          transform: translateY(-1px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

        .filter-icon {
          font-size: 18px;
        }

        .filter-text {
          font-weight: 600;
        }

        .filter-badge {
          background: #0B6623;
          color: white;
          padding: 2px 8px;
          border-radius: 10px;
          font-size: 12px;
          font-weight: 700;
          min-width: 20px;
          text-align: center;
        }

        .filter-popup {
          position: absolute;
          bottom: calc(100% + 8px);
          left: 0;
          width: 320px;
          background: white;
          border: 2px solid #e5e7eb;
          border-radius: 16px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
          z-index: 10000;
          animation: slideUp 0.2s ease-out;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .filter-popup-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 20px;
          border-bottom: 2px solid #f3f4f6;
        }

        .filter-popup-header h3 {
          margin: 0;
          font-size: 16px;
          font-weight: 700;
          color: #111827;
        }

        .filter-close-btn {
          background: none;
          border: none;
          font-size: 20px;
          color: #6b7280;
          cursor: pointer;
          padding: 4px;
          line-height: 1;
          transition: color 0.2s;
        }

        .filter-close-btn:hover {
          color: #ef4444;
        }

        .filter-popup-content {
          padding: 16px 20px;
          max-height: 400px;
          overflow-y: auto;
        }

        .filter-section {
          margin-bottom: 20px;
        }

        .filter-section:last-child {
          margin-bottom: 0;
        }

        .filter-section-title {
          display: flex;
          align-items: center;
          gap: 8px;
          margin: 0 0 12px 0;
          font-size: 14px;
          font-weight: 700;
          color: #374151;
        }

        .filter-section-icon {
          font-size: 16px;
        }

        .filter-checkbox-label {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px;
          margin-bottom: 8px;
          border-radius: 8px;
          cursor: pointer;
          transition: background 0.2s;
          user-select: none;
        }

        .filter-checkbox-label:hover {
          background: #f9fafb;
        }

        .filter-checkbox-label input[type="checkbox"] {
          position: absolute;
          opacity: 0;
          pointer-events: none;
        }

        .checkbox-custom {
          width: 20px;
          height: 20px;
          border: 2px solid #d1d5db;
          border-radius: 6px;
          transition: all 0.2s;
          flex-shrink: 0;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .filter-checkbox-label input[type="checkbox"]:checked + .checkbox-custom {
          background: #0B6623;
          border-color: #0B6623;
        }

        .filter-checkbox-label input[type="checkbox"]:checked + .checkbox-custom::after {
          content: "✓";
          color: white;
          font-size: 14px;
          font-weight: 700;
        }

        .filter-icon-img {
          width: 24px;
          height: 24px;
          object-fit: contain;
        }

        .filter-temp-indicator {
          font-size: 20px;
          width: 24px;
          text-align: center;
        }

        .filter-status-dot {
          font-size: 20px;
          width: 24px;
          text-align: center;
        }

        .status-sehat {
          color: #22c55e;
        }

        .status-tidak-sehat {
          color: #f59e0b;
        }

        .status-mati {
          color: #ef4444;
        }

        .filter-popup-footer {
          padding: 12px 20px;
          border-top: 2px solid #f3f4f6;
        }

        .filter-reset-btn {
          width: 100%;
          padding: 10px;
          background: #f3f4f6;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          color: #6b7280;
          cursor: pointer;
          transition: all 0.2s;
        }

        .filter-reset-btn:hover {
          background: #e5e7eb;
          color: #374151;
        }

        .filter-reset-btn:active {
          transform: scale(0.98);
        }
      `}</style>
    </div>
  );
}