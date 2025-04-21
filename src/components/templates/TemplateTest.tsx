import React from 'react';
import ConstructionQuote from './ConstructionQuote';
import MinimalistQuote from './MinimalistQuote';
import ConstructionEstimate from './ConstructionEstimate';

const TemplateTest: React.FC = () => {
  return (
    <div className="template-test" style={{ padding: '20px' }}>
      <h1 style={{ fontSize: '24px', marginBottom: '20px' }}>Template Test Page</h1>
      
      <div style={{ marginBottom: '30px', padding: '15px', backgroundColor: '#f0f0f0', borderRadius: '8px' }}>
        <h2 style={{ fontSize: '20px', marginBottom: '10px' }}>Direct Template Component Tests</h2>
        <p>This confirms if templates can be directly rendered:</p>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
        <div style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '8px' }}>
          <h3 style={{ fontSize: '18px', marginBottom: '10px' }}>Construction Quote Template (Preview)</h3>
          <div style={{ border: '1px solid #ddd', height: '200px', overflow: 'hidden', position: 'relative' }}>
            <div style={{ transform: 'scale(0.4)', transformOrigin: 'top left', width: '250%', height: '250%' }}>
              <ConstructionQuote />
            </div>
          </div>
        </div>
        
        <div style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '8px' }}>
          <h3 style={{ fontSize: '18px', marginBottom: '10px' }}>Minimalist Quote Template (Preview)</h3>
          <div style={{ border: '1px solid #ddd', height: '200px', overflow: 'hidden', position: 'relative' }}>
            <div style={{ transform: 'scale(0.4)', transformOrigin: 'top left', width: '250%', height: '250%' }}>
              <MinimalistQuote />
            </div>
          </div>
        </div>
        
        <div style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '8px' }}>
          <h3 style={{ fontSize: '18px', marginBottom: '10px' }}>Construction Estimate Template (Preview)</h3>
          <div style={{ border: '1px solid #ddd', height: '200px', overflow: 'hidden', position: 'relative' }}>
            <div style={{ transform: 'scale(0.4)', transformOrigin: 'top left', width: '250%', height: '250%' }}>
              <ConstructionEstimate />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateTest; 