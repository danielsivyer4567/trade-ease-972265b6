import React, { useState } from 'react';

export const DebugOverlay = () => {
  const [clicks, setClicks] = useState(0);
  const [dragStatus, setDragStatus] = useState('Not dragging');
  
  return (
    <div 
      style={{
        position: 'fixed',
        top: 10,
        right: 10,
        background: 'rgba(255, 0, 0, 0.9)',
        color: 'white',
        padding: '10px',
        borderRadius: '5px',
        zIndex: 99999,
        pointerEvents: 'auto',
        cursor: 'pointer'
      }}
      onClick={() => setClicks(clicks + 1)}
      onDragOver={() => setDragStatus('Drag over detected!')}
      onDrop={() => setDragStatus('Drop detected!')}
    >
      <div>DEBUG OVERLAY</div>
      <div>Clicks: {clicks}</div>
      <div>Drag Status: {dragStatus}</div>
      <div>Time: {new Date().toLocaleTimeString()}</div>
      <button 
        style={{ marginTop: '5px', cursor: 'pointer' }}
        onClick={(e) => {
          e.stopPropagation();
          alert('Button clicked! Page is interactive.');
        }}
      >
        Test Button
      </button>
    </div>
  );
}; 