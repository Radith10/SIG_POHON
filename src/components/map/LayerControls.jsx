// LayerControls.jsx - Working Basemap Switcher
import React from 'react';
import OSM from 'ol/source/OSM';
import XYZ from 'ol/source/XYZ';

export default function LayerControls({ map }) {
  const [basemap, setBasemap] = React.useState('osm');

  const changeBasemap = (type) => {
    if (!map) {
      console.error('❌ Map not loaded yet');
      return;
    }
    
    setBasemap(type);
    
    // Get base layer (first layer)
    const layers = map.getLayers().getArray();
    const baseLayer = layers[0];
    
    if (!baseLayer) {
      console.error('❌ Base layer not found');
      return;
    }
    
    // Create new source based on type
    let newSource;
    
    switch(type) {
      case 'dark':
        newSource = new XYZ({
          url: 'https://{a-c}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
          attributions: '© OpenStreetMap contributors, © CARTO'
        });
        console.log('✅ Changed to Dark basemap');
        break;
        
      case 'light':
        newSource = new XYZ({
          url: 'https://{a-c}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
          attributions: '© OpenStreetMap contributors, © CARTO'
        });
        console.log('✅ Changed to Light basemap');
        break;
        
      case 'satellite':
        newSource = new XYZ({
          url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
          attributions: 'Tiles © Esri'
        });
        console.log('✅ Changed to Satellite basemap');
        break;
        
      case 'terrain':
        newSource = new XYZ({
          url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
          attributions: 'Tiles © Esri'
        });
        console.log('✅ Changed to Terrain basemap');
        break;
        
      default: // osm
        newSource = new OSM();
        console.log('✅ Changed to OSM basemap');
    }
    
    // Update the source
    baseLayer.setSource(newSource);
    
    // Force map refresh
    map.render();
  };

  return (
    <div style={{
      background: 'white',
      borderRadius: '12px',
      padding: '16px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      border: '1px solid #e5e7eb'
    }}>
      <h4 style={{ 
        margin: '0 0 12px 0', 
        fontSize: '14px', 
        fontWeight: '700',
        color: '#111827',
        letterSpacing: '0.3px'
      }}>
        🗺️ Pilih Basemap
      </h4>
      
      <div style={{ 
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '8px'
      }}>
        {[
          { key: 'osm', label: 'OSM', icon: '🌍' },
          { key: 'dark', label: 'Dark', icon: '🌙' },
          { key: 'light', label: 'Light', icon: '☀️' },
          { key: 'satellite', label: 'Satelit', icon: '🛰️' },
          { key: 'terrain', label: 'Terrain', icon: '⛰️' }
        ].map(({ key, label, icon }) => (
          <button
            key={key}
            onClick={() => changeBasemap(key)}
            style={{
              padding: '10px 12px',
              borderRadius: '8px',
              border: basemap === key ? '2px solid #667eea' : '2px solid transparent',
              background: basemap === key 
                ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
                : '#f9fafb',
              color: basemap === key ? 'white' : '#6b7280',
              fontSize: '13px',
              fontWeight: basemap === key ? '600' : '500',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              boxShadow: basemap === key ? '0 4px 12px rgba(102, 126, 234, 0.3)' : 'none'
            }}
            onMouseEnter={(e) => {
              if (basemap !== key) {
                e.currentTarget.style.background = '#f3f4f6';
                e.currentTarget.style.borderColor = '#d1d5db';
              }
            }}
            onMouseLeave={(e) => {
              if (basemap !== key) {
                e.currentTarget.style.background = '#f9fafb';
                e.currentTarget.style.borderColor = 'transparent';
              }
            }}
          >
            <span>{icon}</span>
            <span>{label}</span>
          </button>
        ))}
      </div>

      {/* Info Text */}
      <div style={{
        marginTop: '12px',
        padding: '10px',
        background: '#eff6ff',
        borderRadius: '8px',
        fontSize: '12px',
        color: '#1e40af',
        lineHeight: '1.4'
      }}>
        💡 <strong>Tip:</strong> Klik peta untuk info detail
      </div>
    </div>
  );
}

// // LayerControls.jsx
// export default function LayerControls({ map }) {
//   const handleToggle = (layerIndex) => {
//     if (!map) return;
//     const layer = map.getLayers().item(layerIndex);
//     layer.setVisible(!layer.getVisible());
//   };

//   return (
//     <div className="layer-control">
//       <h4>Layer Control</h4>

//       <label className="layer-item">
//         <input
//           type="checkbox"
//           defaultChecked
//           onChange={() => handleToggle(1)}
//         />
//         <span>Polygon Riau</span>
//       </label>

//       <label className="layer-item">
//         <input
//           type="checkbox"
//           defaultChecked
//           onChange={() => handleToggle(2)}
//         />
//         <span>Pohon Peneduh</span>
//       </label>
//     </div>
//   );
// }