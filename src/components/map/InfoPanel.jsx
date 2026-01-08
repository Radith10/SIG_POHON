// InfoPanel.jsx - Beautiful hover info
import React from 'react';

export default function InfoPanel({ text }) {
  if (!text) return null;
  
  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.98)',
      padding: '12px 24px',
      borderRadius: '12px',
      boxShadow: '0 8px 24px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.05)',
      fontSize: '14px',
      fontWeight: '600',
      color: '#111827',
      backdropFilter: 'blur(12px)',
      zIndex: 10,
      maxWidth: '80%',
      textAlign: 'center',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      animation: 'fadeInUp 0.3s ease-out',
      border: '2px solid rgba(102, 126, 234, 0.2)'
    }}>
      <style>
        {`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
      <span style={{
        fontSize: '18px',
        filter: 'grayscale(0)'
      }}>📍</span>
      <span>{text}</span>
    </div>
  );
}