// Popup.jsx - Improved Design
import React from 'react';

export default function Popup({ popupRef, popupContentRef }) {
  return (
    <div
      ref={popupRef}
      style={{
        position: 'absolute',
        background: 'white',
        borderRadius: '16px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.08)',
        minWidth: '340px',
        maxWidth: '400px',
        border: 'none',
        zIndex: 20,
        overflow: 'hidden',
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}
    >
      <style>
        {`
          .ol-popup {
            position: relative;
          }
          
          /* Close button */
          .ol-popup-close {
            position: absolute;
            top: 16px;
            right: 16px;
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgba(255,255,255,0.9);
            border-radius: 50%;
            cursor: pointer;
            font-size: 16px;
            color: #6b7280;
            transition: all 0.2s;
            z-index: 10;
            border: 1px solid rgba(0,0,0,0.08);
          }
          
          .ol-popup-close:hover {
            background: #fee2e2;
            color: #dc2626;
            transform: rotate(90deg);
            border-color: #fecaca;
          }

          /* Header with gradient */
          .ol-popup h3 {
            margin: 0;
            padding: 24px 52px 20px 24px;
            font-size: 17px;
            font-weight: 600;
            color: white;
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            display: flex;
            align-items: center;
            gap: 10px;
            letter-spacing: 0.2px;
            border-bottom: 3px solid rgba(255,255,255,0.2);
          }
          
          .ol-popup h3::before {
            font-size: 22px;
            filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
          }

          /* Content area */
          .ol-popup-content {
            padding: 20px 24px 24px 24px;
            background: #fafafa;
          }

          /* Info row styling */
          .info-row {
            margin: 0 0 12px 0;
            font-size: 14px;
            display: flex;
            align-items: flex-start;
            gap: 12px;
            padding: 12px 14px;
            background: white;
            border-radius: 10px;
            border: 1px solid #e5e7eb;
            transition: all 0.2s;
            box-shadow: 0 1px 2px rgba(0,0,0,0.04);
          }
          
          .info-row:hover {
            border-color: #10b981;
            box-shadow: 0 4px 12px rgba(16, 185, 129, 0.15);
            transform: translateY(-1px);
          }

          .info-row:last-child {
            margin-bottom: 0;
          }

          .info-label {
            color: #6b7280;
            font-weight: 500;
            min-width: 110px;
            flex-shrink: 0;
            font-size: 13px;
            display: flex;
            align-items: center;
            gap: 6px;
          }

          .info-value {
            color: #111827;
            font-weight: 400;
            flex: 1;
            word-break: break-word;
          }

          /* Status badges */
          .status-badge {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 6px 14px;
            border-radius: 20px;
            font-size: 13px;
            font-weight: 600;
            letter-spacing: 0.3px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.08);
          }

          .status-sehat {
            background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
            color: #065f46;
            border: 1px solid #6ee7b7;
          }

          .status-tidak-sehat {
            background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
            color: #78350f;
            border: 1px solid #fcd34d;
          }

          .status-mati {
            background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
            color: #7f1d1d;
            border: 1px solid #fca5a5;
          }

          /* Temperature indicator */
          .temp-value {
            display: inline-flex;
            align-items: center;
            gap: 5px;
            padding: 5px 12px;
            background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
            border-radius: 8px;
            font-weight: 600;
            color: #1e40af;
            font-size: 14px;
            border: 1px solid #93c5fd;
          }

          .temp-hot {
            background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
            color: #991b1b;
            border: 1px solid #fca5a5;
          }

          .temp-value::before {
            content: '🌡️';
            font-size: 14px;
          }

          /* Divider */
          .ol-popup-divider {
            height: 1px;
            background: linear-gradient(90deg, transparent, #d1d5db, transparent);
            margin: 16px 0;
          }

          /* Jenis badge */
          .jenis-badge {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 5px 12px;
            border-radius: 8px;
            font-size: 13px;
            font-weight: 600;
            background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
            color: #166534;
            border: 1px solid #bbf7d0;
          }

          .jenis-badge.bukan-peneduh {
            background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
            color: #78350f;
            border: 1px solid #fcd34d;
          }

          /* Animation */
          @keyframes popupFadeIn {
            from {
              opacity: 0;
              transform: translateY(-12px) scale(0.96);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }

          .ol-popup {
            animation: popupFadeIn 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
          }

          /* Tail/Arrow */
          .popup-tail {
            position: absolute;
            bottom: -10px;
            left: 50%;
            transform: translateX(-50%);
            width: 0;
            height: 0;
            border-left: 12px solid transparent;
            border-right: 12px solid transparent;
            border-top: 10px solid white;
            filter: drop-shadow(0 4px 6px rgba(0,0,0,0.08));
          }

          /* Subtle pulse on hover for interactive elements */
          .info-row:active {
            transform: scale(0.98);
          }

          /* Icon styling in labels */
          .info-label::before {
            font-size: 14px;
            opacity: 0.7;
          }
        `}
      </style>
      <div ref={popupContentRef} className="ol-popup" />
      <div className="popup-tail" />
    </div>
  );
}