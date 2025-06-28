import React, { useState } from "react";
import { AppLayout } from "@/components/ui/AppLayout";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { useNavigate } from 'react-router-dom';

const ConcreteCalculator = () => {
  const navigate = useNavigate();
  const [selectedCalculator, setSelectedCalculator] = useState('rect');
  const [currentUnit, setCurrentUnit] = useState('metric');
  const [results, setResults] = useState({});

  const switchUnits = (unit) => {
    setCurrentUnit(unit);
    setResults({});
  };

  const calculatorOptions = [
    { value: 'rect', label: '🔲 Rectangular Slab' },
    { value: 'round', label: '🔄 Round Corners Slab' },
    { value: 'piers', label: '🔩 Concrete Piers' },
    { value: 'block', label: '🧱 Block Work Fill' },
    { value: 'post', label: '🔲 Post Holes' },
    { value: 'footing', label: '🔲 Strip Footings' }
  ];

  const calculateRectangular = (unit: string) => {
    if (unit === 'metric') {
      const length = parseFloat((document.getElementById('rect-length-m') as HTMLInputElement)?.value || '0');
      const width = parseFloat((document.getElementById('rect-width-m') as HTMLInputElement)?.value || '0');
      const thickness = parseFloat((document.getElementById('rect-thickness-m') as HTMLInputElement)?.value || '0');
      
      if (length > 0 && width > 0 && thickness > 0) {
        const volume = length * width * (thickness / 1000); // convert mm to m
        setResults(prev => ({ ...prev, 'rect-metric': volume.toFixed(3) }));
      }
    } else {
      const length = parseFloat((document.getElementById('rect-length-i') as HTMLInputElement)?.value || '0');
      const width = parseFloat((document.getElementById('rect-width-i') as HTMLInputElement)?.value || '0');
      const thickness = parseFloat((document.getElementById('rect-thickness-i') as HTMLInputElement)?.value || '0');
      
      if (length > 0 && width > 0 && thickness > 0) {
        const volumeCubicFeet = length * width * (thickness / 12); // convert inches to feet
        const volumeCubicYards = volumeCubicFeet / 27; // convert cubic feet to cubic yards
        setResults(prev => ({ ...prev, 'rect-imperial': volumeCubicYards.toFixed(3) }));
      }
    }
  };

  const calculateRoundCorners = (unit: string) => {
    if (unit === 'metric') {
      const length = parseFloat((document.getElementById('round-length-m') as HTMLInputElement)?.value || '0');
      const width = parseFloat((document.getElementById('round-width-m') as HTMLInputElement)?.value || '0');
      const radius = parseFloat((document.getElementById('round-radius-m') as HTMLInputElement)?.value || '0');
      const thickness = parseFloat((document.getElementById('round-thickness-m') as HTMLInputElement)?.value || '0');
      
      if (length > 0 && width > 0 && radius > 0 && thickness > 0) {
        const radiusM = radius / 1000; // convert mm to m
        const thicknessM = thickness / 1000; // convert mm to m
        // Formula: (A×B - 4×R² + π×R²) × C
        const area = length * width - 4 * radiusM * radiusM + Math.PI * radiusM * radiusM;
        const volume = area * thicknessM;
        setResults(prev => ({ ...prev, 'round-metric': volume.toFixed(3) }));
      }
    } else {
      const length = parseFloat((document.getElementById('round-length-i') as HTMLInputElement)?.value || '0');
      const width = parseFloat((document.getElementById('round-width-i') as HTMLInputElement)?.value || '0');
      const radius = parseFloat((document.getElementById('round-radius-i') as HTMLInputElement)?.value || '0');
      const thickness = parseFloat((document.getElementById('round-thickness-i') as HTMLInputElement)?.value || '0');
      
      if (length > 0 && width > 0 && radius > 0 && thickness > 0) {
        const radiusFt = radius / 12; // convert inches to feet
        const thicknessFt = thickness / 12; // convert inches to feet
        // Formula: (A×B - 4×R² + π×R²) × C
        const area = length * width - 4 * radiusFt * radiusFt + Math.PI * radiusFt * radiusFt;
        const volumeCubicFeet = area * thicknessFt;
        const volumeCubicYards = volumeCubicFeet / 27;
        setResults(prev => ({ ...prev, 'round-imperial': volumeCubicYards.toFixed(3) }));
      }
    }
  };

  const calculatePiers = (unit: string) => {
    if (unit === 'metric') {
      const diameter = parseFloat((document.getElementById('pier-diameter-m') as HTMLInputElement)?.value || '0');
      const height = parseFloat((document.getElementById('pier-height-m') as HTMLInputElement)?.value || '0');
      const count = parseFloat((document.getElementById('pier-count-m') as HTMLInputElement)?.value || '0');
      
      if (diameter > 0 && height > 0 && count > 0) {
        const radius = (diameter / 1000) / 2; // convert mm to m and get radius
        // Formula: π × R² × H × Count
        const volume = Math.PI * radius * radius * height * count;
        setResults(prev => ({ ...prev, 'pier-metric': volume.toFixed(3) }));
      }
    } else {
      const diameter = parseFloat((document.getElementById('pier-diameter-i') as HTMLInputElement)?.value || '0');
      const height = parseFloat((document.getElementById('pier-height-i') as HTMLInputElement)?.value || '0');
      const count = parseFloat((document.getElementById('pier-count-i') as HTMLInputElement)?.value || '0');
      
      if (diameter > 0 && height > 0 && count > 0) {
        const radius = (diameter / 12) / 2; // convert inches to feet and get radius
        // Formula: π × R² × H × Count
        const volumeCubicFeet = Math.PI * radius * radius * height * count;
        const volumeCubicYards = volumeCubicFeet / 27;
        setResults(prev => ({ ...prev, 'pier-imperial': volumeCubicYards.toFixed(3) }));
      }
    }
  };

  const calculateBlockWork = (unit: string) => {
    if (unit === 'metric') {
      const length = parseFloat((document.getElementById('block-length-m') as HTMLInputElement)?.value || '0');
      const height = parseFloat((document.getElementById('block-height-m') as HTMLInputElement)?.value || '0');
      const width = parseFloat((document.getElementById('block-width-m') as HTMLInputElement)?.value || '0');
      const hollow = parseFloat((document.getElementById('block-hollow-m') as HTMLInputElement)?.value || '0');
      
      if (length > 0 && height > 0 && width > 0 && hollow > 0) {
        const widthM = width / 1000; // convert mm to m
        // Formula: A × B × C × (Hollow% ÷ 100)
        const volume = length * height * widthM * (hollow / 100);
        setResults(prev => ({ ...prev, 'block-metric': volume.toFixed(3) }));
      }
    } else {
      const length = parseFloat((document.getElementById('block-length-i') as HTMLInputElement)?.value || '0');
      const height = parseFloat((document.getElementById('block-height-i') as HTMLInputElement)?.value || '0');
      const width = parseFloat((document.getElementById('block-width-i') as HTMLInputElement)?.value || '0');
      const hollow = parseFloat((document.getElementById('block-hollow-i') as HTMLInputElement)?.value || '0');
      
      if (length > 0 && height > 0 && width > 0 && hollow > 0) {
        const widthFt = width / 12; // convert inches to feet
        // Formula: A × B × C × (Hollow% ÷ 100)
        const volumeCubicFeet = length * height * widthFt * (hollow / 100);
        const volumeCubicYards = volumeCubicFeet / 27;
        setResults(prev => ({ ...prev, 'block-imperial': volumeCubicYards.toFixed(3) }));
      }
    }
  };

  const calculatePostHoles = (unit: string) => {
    if (unit === 'metric') {
      const diameter = parseFloat((document.getElementById('posthole-diameter-m') as HTMLInputElement)?.value || '0');
      const depth = parseFloat((document.getElementById('posthole-depth-m') as HTMLInputElement)?.value || '0');
      const postWidth = parseFloat((document.getElementById('posthole-width-m') as HTMLInputElement)?.value || '0');
      const postThickness = parseFloat((document.getElementById('posthole-thickness-m') as HTMLInputElement)?.value || '0');
      const count = parseFloat((document.getElementById('posthole-count-m') as HTMLInputElement)?.value || '0');
      
      if (diameter > 0 && depth > 0 && postWidth > 0 && postThickness > 0 && count > 0) {
        const holeRadius = (diameter / 1000) / 2; // convert mm to m and get radius
        const depthM = depth / 1000; // convert mm to m
        const postWidthM = postWidth / 1000; // convert mm to m
        const postThicknessM = postThickness / 1000; // convert mm to m
        
        // Formula: [π×(D/2)² - W×T] × Depth × Count
        const holeVolume = Math.PI * holeRadius * holeRadius;
        const postVolume = postWidthM * postThicknessM;
        const concreteVolumePerHole = (holeVolume - postVolume) * depthM;
        const totalVolume = concreteVolumePerHole * count;
        setResults(prev => ({ ...prev, 'posthole-metric': totalVolume.toFixed(3) }));
      }
    } else {
      const diameter = parseFloat((document.getElementById('posthole-diameter-i') as HTMLInputElement)?.value || '0');
      const depth = parseFloat((document.getElementById('posthole-depth-i') as HTMLInputElement)?.value || '0');
      const postWidth = parseFloat((document.getElementById('posthole-width-i') as HTMLInputElement)?.value || '0');
      const postThickness = parseFloat((document.getElementById('posthole-thickness-i') as HTMLInputElement)?.value || '0');
      const count = parseFloat((document.getElementById('posthole-count-i') as HTMLInputElement)?.value || '0');
      
      if (diameter > 0 && depth > 0 && postWidth > 0 && postThickness > 0 && count > 0) {
        const holeRadius = (diameter / 12) / 2; // convert inches to feet and get radius
        const depthFt = depth / 12; // convert inches to feet
        const postWidthFt = postWidth / 12; // convert inches to feet
        const postThicknessFt = postThickness / 12; // convert inches to feet
        
        // Formula: [π×(D/2)² - W×T] × Depth × Count
        const holeVolume = Math.PI * holeRadius * holeRadius;
        const postVolume = postWidthFt * postThicknessFt;
        const concreteVolumePerHole = (holeVolume - postVolume) * depthFt;
        const totalVolumeCubicFeet = concreteVolumePerHole * count;
        const totalVolumeCubicYards = totalVolumeCubicFeet / 27;
        setResults(prev => ({ ...prev, 'posthole-imperial': totalVolumeCubicYards.toFixed(3) }));
      }
    }
  };

  const calculateFootings = (unit: string) => {
    if (unit === 'metric') {
      const length = parseFloat((document.getElementById('footing-length-m') as HTMLInputElement)?.value || '0');
      const width = parseFloat((document.getElementById('footing-width-m') as HTMLInputElement)?.value || '0');
      const depth = parseFloat((document.getElementById('footing-depth-m') as HTMLInputElement)?.value || '0');
      
      if (length > 0 && width > 0 && depth > 0) {
        const widthM = width / 1000; // convert mm to m
        const depthM = depth / 1000; // convert mm to m
        // Formula: A × B × C
        const volume = length * widthM * depthM;
        setResults(prev => ({ ...prev, 'footing-metric': volume.toFixed(3) }));
      }
    } else {
      const length = parseFloat((document.getElementById('footing-length-i') as HTMLInputElement)?.value || '0');
      const width = parseFloat((document.getElementById('footing-width-i') as HTMLInputElement)?.value || '0');
      const depth = parseFloat((document.getElementById('footing-depth-i') as HTMLInputElement)?.value || '0');
      
      if (length > 0 && width > 0 && depth > 0) {
        const widthFt = width / 12; // convert inches to feet
        const depthFt = depth / 12; // convert inches to feet
        // Formula: A × B × C
        const volumeCubicFeet = length * widthFt * depthFt;
        const volumeCubicYards = volumeCubicFeet / 27;
        setResults(prev => ({ ...prev, 'footing-imperial': volumeCubicYards.toFixed(3) }));
      }
    }
  };

  return (
    <AppLayout>
      <div style={{
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
        minHeight: '100vh',
        padding: '20px'
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '30px', color: '#6c757d' }}>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '10px', textShadow: '1px 1px 2px rgba(0,0,0,0.1)' }}>
              🏗️ Concrete Volume Calculators
            </h1>
            <p>Professional concrete calculation tools for construction projects</p>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '30px' }}>
            <button
              style={{
                background: currentUnit === 'metric' ? '#3b82f6' : '#dee2e6',
                color: currentUnit === 'metric' ? 'white' : '#6c757d',
                border: '2px solid #dee2e6',
                padding: '12px 24px',
                borderRadius: '25px',
                cursor: 'pointer',
                fontSize: '1.1rem',
                transition: 'all 0.3s ease'
              }}
              onClick={() => switchUnits('metric')}
            >
              📏 Metric (mm/cm/m)
            </button>
            <button
              style={{
                background: currentUnit === 'imperial' ? '#3b82f6' : '#dee2e6',
                color: currentUnit === 'imperial' ? 'white' : '#6c757d',
                border: '2px solid #dee2e6',
                padding: '12px 24px',
                borderRadius: '25px',
                cursor: 'pointer',
                fontSize: '1.1rem',
                transition: 'all 0.3s ease'
              }}
              onClick={() => switchUnits('imperial')}
            >
              📐 Imperial (ft/in)
            </button>
          </div>

          <select
            value={selectedCalculator}
            onChange={(e) => setSelectedCalculator(e.target.value)}
            style={{
              width: '25%',
              padding: '12px 15px',
              border: '2px solid #e9ecef',
              borderRadius: '10px',
              fontSize: '1rem',
              marginBottom: '20px',
              margin: '0 auto 20px auto',
              display: 'block',
              background: 'white',
              cursor: 'pointer',
              appearance: 'none',
              backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%233b82f6' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 12px center',
              backgroundSize: '18px',
              paddingRight: '40px'
            }}
          >
            {calculatorOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          {selectedCalculator === 'rect' && (
            <>
              {currentUnit === 'metric' ? (
                <div style={{ background: '#e2e8f0', borderRadius: '20px', padding: '25px', boxShadow: '0 10px 30px rgba(0,0,0,0.2)', backdropFilter: 'blur(10px)', border: '2px solid #94a3b8' }}>
                  <div style={{ textAlign: 'center', marginBottom: '20px', paddingBottom: '15px', borderBottom: '2px solid #f0f0f0' }}>
                    <h3 style={{ fontSize: '1.4rem', color: '#333', marginBottom: '8px' }}>🔲 Rectangular Slab</h3>
                    <small>Standard concrete slabs & foundations</small>
                  </div>
                  <div style={{ background: '#f8f9fa', borderRadius: '10px', padding: '15px', margin: '15px 0', textAlign: 'center', border: '2px dashed #dee2e6' }}>
                    <img src="/lovable-uploads/197b43d06f3c3.png" alt="Rectangular slab with labeled length, width, and thickness" style={{ maxWidth: '320px', width: '100%', display: 'block', margin: '0 auto' }} />
                  </div>
                  <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#555', fontSize: '0.95rem' }}>
                      📏 A - Length (meters)
                    </label>
                    <input
                      type="number"
                      id="rect-length-m"
                      placeholder="e.g., 5.5"
                      step="0.01"
                      style={{
                        width: '100%',
                        padding: '12px 15px',
                        border: '2px solid #e9ecef',
                        borderRadius: '10px',
                        fontSize: '1rem'
                      }}
                    />
                  </div>
                  <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#555', fontSize: '0.95rem' }}>
                      📏 B - Width (meters)
                    </label>
                    <input
                      type="number"
                      id="rect-width-m"
                      placeholder="e.g., 3.2"
                      step="0.01"
                      style={{
                        width: '100%',
                        padding: '12px 15px',
                        border: '2px solid #e9ecef',
                        borderRadius: '10px',
                        fontSize: '1rem'
                      }}
                    />
                  </div>
                  <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#555', fontSize: '0.95rem' }}>
                      📏 C - Thickness (mm)
                    </label>
                    <input
                      type="number"
                      id="rect-thickness-m"
                      placeholder="e.g., 150"
                      step="1"
                      style={{
                        width: '100%',
                        padding: '12px 15px',
                        border: '2px solid #e9ecef',
                        borderRadius: '10px',
                        fontSize: '1rem'
                      }}
                    />
                  </div>
                  <button
                    onClick={() => calculateRectangular('metric')}
                    style={{
                      width: '100%',
                      background: 'white',
                      color: '#333',
                      border: '2px solid #e9ecef',
                      padding: '15px',
                      borderRadius: '10px',
                      fontSize: '1.1rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      margin: '20px 0'
                    }}
                  >
                    Calculate Volume 🧮
                  </button>
                  {results['rect-metric'] && (
                    <div style={{
                      background: '#6c757d',
                      color: 'white',
                      padding: '20px',
                      borderRadius: '15px',
                      textAlign: 'center',
                      marginTop: '15px'
                    }}>
                      <div style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '5px' }}>
                        {results['rect-metric']}
                      </div>
                      <div style={{ fontSize: '1rem', opacity: '0.9' }}>
                        cubic meters (m³)
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div style={{ background: '#e2e8f0', borderRadius: '20px', padding: '25px', boxShadow: '0 10px 30px rgba(0,0,0,0.2)', backdropFilter: 'blur(10px)', border: '2px solid #94a3b8' }}>
                  <div style={{ textAlign: 'center', marginBottom: '20px', paddingBottom: '15px', borderBottom: '2px solid #f0f0f0' }}>
                    <h3 style={{ fontSize: '1.4rem', color: '#333', marginBottom: '8px' }}>🔲 Rectangular Slab</h3>
                    <small>Standard concrete slabs & foundations</small>
                  </div>
                  <div style={{ background: '#f8f9fa', borderRadius: '10px', padding: '15px', margin: '15px 0', textAlign: 'center', border: '2px dashed #dee2e6' }}>
                    <img src="/lovable-uploads/197b43d06f3c3.png" alt="Rectangular slab with labeled length, width, and thickness" style={{ maxWidth: '320px', width: '100%', display: 'block', margin: '0 auto' }} />
                  </div>
                  <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#555', fontSize: '0.95rem' }}>
                      📏 A - Length (feet)
                    </label>
                    <input
                      type="number"
                      id="rect-length-i"
                      placeholder="e.g., 18.5"
                      step="0.1"
                      style={{
                        width: '100%',
                        padding: '12px 15px',
                        border: '2px solid #e9ecef',
                        borderRadius: '10px',
                        fontSize: '1rem'
                      }}
                    />
                  </div>
                  <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#555', fontSize: '0.95rem' }}>
                      📏 B - Width (feet)
                    </label>
                    <input
                      type="number"
                      id="rect-width-i"
                      placeholder="e.g., 12.0"
                      step="0.1"
                      style={{
                        width: '100%',
                        padding: '12px 15px',
                        border: '2px solid #e9ecef',
                        borderRadius: '10px',
                        fontSize: '1rem'
                      }}
                    />
                  </div>
                  <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#555', fontSize: '0.95rem' }}>
                      📏 C - Thickness (inches)
                    </label>
                    <input
                      type="number"
                      id="rect-thickness-i"
                      placeholder="e.g., 6"
                      step="0.25"
                      style={{
                        width: '100%',
                        padding: '12px 15px',
                        border: '2px solid #e9ecef',
                        borderRadius: '10px',
                        fontSize: '1rem'
                      }}
                    />
                  </div>
                  <button
                    onClick={() => calculateRectangular('imperial')}
                    style={{
                      width: '100%',
                      background: 'white',
                      color: '#333',
                      border: '2px solid #e9ecef',
                      padding: '15px',
                      borderRadius: '10px',
                      fontSize: '1.1rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      margin: '20px 0'
                    }}
                  >
                    Calculate Volume 🧮
                  </button>
                  {results['rect-imperial'] && (
                    <div style={{
                      background: '#6c757d',
                      color: 'white',
                      padding: '20px',
                      borderRadius: '15px',
                      textAlign: 'center',
                      marginTop: '15px'
                    }}>
                      <div style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '5px' }}>
                        {results['rect-imperial']}
                      </div>
                      <div style={{ fontSize: '1rem', opacity: '0.9' }}>
                        cubic yards (yd³)
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
          {selectedCalculator === 'round' && (
            <>
              {currentUnit === 'metric' ? (
                <div style={{ background: '#e2e8f0', borderRadius: '20px', padding: '25px', boxShadow: '0 10px 30px rgba(0,0,0,0.2)', backdropFilter: 'blur(10px)', border: '2px solid #94a3b8' }}>
                  <div style={{ textAlign: 'center', marginBottom: '20px', paddingBottom: '15px', borderBottom: '2px solid #f0f0f0' }}>
                    <h3 style={{ fontSize: '1.4rem', color: '#333', marginBottom: '8px' }}>🔘 Round Corners Slab</h3>
                    <small>Slab with rounded corner radius</small>
                  </div>
                  <div style={{ background: '#f8f9fa', borderRadius: '10px', padding: '15px', margin: '15px 0', textAlign: 'center', border: '2px dashed #dee2e6' }}>
                    <img src="/lovable-uploads/197b4506514e3.png" alt="Slab with rounded corners: labeled length, width, thickness, and corner radius" style={{ maxWidth: '320px', width: '100%', display: 'block', margin: '0 auto' }} />
                  </div>
                  <div style={{ marginBottom: '15px' }}>
                    <input type="number" id="round-length-m" placeholder="e.g., 5.0" step="0.1" style={{ width: '100%', padding: '12px 15px', border: '2px solid #e9ecef', borderRadius: '10px', fontSize: '1rem' }} />
                    <label style={{ fontSize: '0.9rem', color: '#666' }}>📏 A - Length (meters)</label>
                  </div>
                  <div style={{ marginBottom: '15px' }}>
                    <input type="number" id="round-width-m" placeholder="e.g., 3.0" step="0.1" style={{ width: '100%', padding: '12px 15px', border: '2px solid #e9ecef', borderRadius: '10px', fontSize: '1rem' }} />
                    <label style={{ fontSize: '0.9rem', color: '#666' }}>📏 B - Width (meters)</label>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '15px' }}>
                    <div>
                      <input type="number" id="round-radius-m" placeholder="e.g., 200" step="1" style={{ width: '100%', padding: '12px 15px', border: '2px solid #e9ecef', borderRadius: '10px', fontSize: '1rem' }} />
                      <label style={{ fontSize: '0.8rem', color: '#666' }}>🔄 R - Corner Radius (mm)</label>
                    </div>
                    <div>
                      <input type="number" id="round-thickness-m" placeholder="e.g., 150" step="1" style={{ width: '100%', padding: '12px 15px', border: '2px solid #e9ecef', borderRadius: '10px', fontSize: '1rem' }} />
                      <label style={{ fontSize: '0.8rem', color: '#666' }}>📏 C - Thickness (mm)</label>
                    </div>
                  </div>
                  <div style={{ background: '#fff3cd', border: '1px solid #ffeaa7', borderRadius: '8px', padding: '10px', margin: '10px 0', fontSize: '0.85rem', color: '#856404' }}>
                    💡 Formula: (A×B - 4×R² + π×R²) × C
                  </div>
                  <button onClick={() => calculateRoundCorners('metric')} style={{ width: '100%', background: 'white', color: '#333', border: '2px solid #e9ecef', padding: '15px', borderRadius: '10px', fontSize: '1.1rem', fontWeight: '600', cursor: 'pointer', margin: '20px 0' }}>
                    Calculate Volume 🧮
                  </button>
                  {results['round-metric'] && (
                    <div style={{ background: '#6c757d', color: 'white', padding: '20px', borderRadius: '15px', textAlign: 'center', marginTop: '15px' }}>
                      <div style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '5px' }}>{results['round-metric']}</div>
                      <div style={{ fontSize: '1rem', opacity: '0.9' }}>cubic meters (m³)</div>
                    </div>
                  )}
                </div>
              ) : (
                <div style={{ background: '#e2e8f0', borderRadius: '20px', padding: '25px', boxShadow: '0 10px 30px rgba(0,0,0,0.2)', backdropFilter: 'blur(10px)', border: '2px solid #94a3b8' }}>
                  <div style={{ textAlign: 'center', marginBottom: '20px', paddingBottom: '15px', borderBottom: '2px solid #f0f0f0' }}>
                    <h3 style={{ fontSize: '1.4rem', color: '#333', marginBottom: '8px' }}>🔘 Round Corners Slab</h3>
                    <small>Slab with rounded corner radius</small>
                  </div>
                  <div style={{ background: '#f8f9fa', borderRadius: '10px', padding: '15px', margin: '15px 0', textAlign: 'center', border: '2px dashed #dee2e6' }}>
                    <img src="/lovable-uploads/197b4506514e3.png" alt="Slab with rounded corners: labeled length, width, thickness, and corner radius" style={{ maxWidth: '320px', width: '100%', display: 'block', margin: '0 auto' }} />
                  </div>
                  <div style={{ marginBottom: '15px' }}>
                    <input type="number" id="round-length-i" placeholder="e.g., 16.0" step="0.1" style={{ width: '100%', padding: '12px 15px', border: '2px solid #e9ecef', borderRadius: '10px', fontSize: '1rem' }} />
                    <label style={{ fontSize: '0.9rem', color: '#666' }}>📏 A - Length (feet)</label>
                  </div>
                  <div style={{ marginBottom: '15px' }}>
                    <input type="number" id="round-width-i" placeholder="e.g., 10.0" step="0.1" style={{ width: '100%', padding: '12px 15px', border: '2px solid #e9ecef', borderRadius: '10px', fontSize: '1rem' }} />
                    <label style={{ fontSize: '0.9rem', color: '#666' }}>📏 B - Width (feet)</label>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '15px' }}>
                    <div>
                      <input type="number" id="round-radius-i" placeholder="e.g., 8" step="0.25" style={{ width: '100%', padding: '12px 15px', border: '2px solid #e9ecef', borderRadius: '10px', fontSize: '1rem' }} />
                      <label style={{ fontSize: '0.8rem', color: '#666' }}>🔄 R - Corner Radius (inches)</label>
                    </div>
                    <div>
                      <input type="number" id="round-thickness-i" placeholder="e.g., 5" step="0.25" style={{ width: '100%', padding: '12px 15px', border: '2px solid #e9ecef', borderRadius: '10px', fontSize: '1rem' }} />
                      <label style={{ fontSize: '0.8rem', color: '#666' }}>📏 C - Thickness (inches)</label>
                    </div>
                  </div>
                  <div style={{ background: '#fff3cd', border: '1px solid #ffeaa7', borderRadius: '8px', padding: '10px', margin: '10px 0', fontSize: '0.85rem', color: '#856404' }}>
                    💡 Formula: (A×B - 4×R² + π×R²) × C
                  </div>
                  <button onClick={() => calculateRoundCorners('imperial')} style={{ width: '100%', background: 'white', color: '#333', border: '2px solid #e9ecef', padding: '15px', borderRadius: '10px', fontSize: '1.1rem', fontWeight: '600', cursor: 'pointer', margin: '20px 0' }}>
                    Calculate Volume 🧮
                  </button>
                  {results['round-imperial'] && (
                    <div style={{ background: '#6c757d', color: 'white', padding: '20px', borderRadius: '15px', textAlign: 'center', marginTop: '15px' }}>
                      <div style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '5px' }}>{results['round-imperial']}</div>
                      <div style={{ fontSize: '1rem', opacity: '0.9' }}>cubic yards (yd³)</div>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
          {selectedCalculator === 'piers' && (
            <>
              {currentUnit === 'metric' ? (
                <div style={{ background: '#e2e8f0', borderRadius: '20px', padding: '25px', boxShadow: '0 10px 30px rgba(0,0,0,0.2)', backdropFilter: 'blur(10px)', border: '2px solid #94a3b8' }}>
                  <div style={{ textAlign: 'center', marginBottom: '20px', paddingBottom: '15px', borderBottom: '2px solid #f0f0f0' }}>
                    <h3 style={{ fontSize: '1.4rem', color: '#333', marginBottom: '8px' }}>🔩 Concrete Piers</h3>
                    <small>Cylindrical piers for house foundations</small>
                  </div>
                  <div style={{ background: '#f8f9fa', borderRadius: '10px', padding: '15px', margin: '15px 0', textAlign: 'center', border: '2px dashed #dee2e6' }}>
                    <img src="/lovable-uploads/197b450c1e26c (2).png" alt="Concrete piers: labeled diameter, height, and count" style={{ maxWidth: '320px', width: '100%', display: 'block', margin: '0 auto' }} />
                  </div>
                  <div style={{ marginBottom: '15px' }}>
                    <input type="number" id="pier-diameter-m" placeholder="e.g., 300" step="1" style={{ width: '100%', padding: '12px 15px', border: '2px solid #e9ecef', borderRadius: '10px', fontSize: '1rem' }} />
                    <label style={{ fontSize: '0.9rem', color: '#666' }}>⚪ Diameter (mm)</label>
                  </div>
                  <div style={{ marginBottom: '15px' }}>
                    <input type="number" id="pier-height-m" placeholder="e.g., 1.5" step="0.01" style={{ width: '100%', padding: '12px 15px', border: '2px solid #e9ecef', borderRadius: '10px', fontSize: '1rem' }} />
                    <label style={{ fontSize: '0.9rem', color: '#666' }}>📏 H - Height (meters)</label>
                  </div>
                  <div style={{ marginBottom: '15px' }}>
                    <input type="number" id="pier-count-m" placeholder="e.g., 12" step="1" min="1" style={{ width: '100%', padding: '12px 15px', border: '2px solid #e9ecef', borderRadius: '10px', fontSize: '1rem' }} />
                    <label style={{ fontSize: '0.9rem', color: '#666' }}>🔢 Number of Piers</label>
                  </div>
                  <div style={{ background: '#fff3cd', border: '1px solid #ffeaa7', borderRadius: '8px', padding: '10px', margin: '10px 0', fontSize: '0.85rem', color: '#856404' }}>
                    💡 Formula: π × (D/2)² × H × Count
                  </div>
                  <button onClick={() => calculatePiers('metric')} style={{ width: '100%', background: 'white', color: '#333', border: '2px solid #e9ecef', padding: '15px', borderRadius: '10px', fontSize: '1.1rem', fontWeight: '600', cursor: 'pointer', margin: '20px 0' }}>
                    Calculate Volume 🧮
                  </button>
                  {results['pier-metric'] && (
                    <div style={{ background: '#6c757d', color: 'white', padding: '20px', borderRadius: '15px', textAlign: 'center', marginTop: '15px' }}>
                      <div style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '5px' }}>{results['pier-metric']}</div>
                      <div style={{ fontSize: '1rem', opacity: '0.9' }}>cubic meters (m³)</div>
                    </div>
                  )}
                </div>
              ) : (
                <div style={{ background: '#e2e8f0', borderRadius: '20px', padding: '25px', boxShadow: '0 10px 30px rgba(0,0,0,0.2)', backdropFilter: 'blur(10px)', border: '2px solid #94a3b8' }}>
                  <div style={{ textAlign: 'center', marginBottom: '20px', paddingBottom: '15px', borderBottom: '2px solid #f0f0f0' }}>
                    <h3 style={{ fontSize: '1.4rem', color: '#333', marginBottom: '8px' }}>🔩 Concrete Piers</h3>
                    <small>Cylindrical piers for house foundations</small>
                  </div>
                  <div style={{ background: '#f8f9fa', borderRadius: '10px', padding: '15px', margin: '15px 0', textAlign: 'center', border: '2px dashed #dee2e6' }}>
                    <img src="/lovable-uploads/197b450c1e26c (2).png" alt="Concrete piers: labeled diameter, height, and count" style={{ maxWidth: '320px', width: '100%', display: 'block', margin: '0 auto' }} />
                  </div>
                  <div style={{ marginBottom: '15px' }}>
                    <input type="number" id="pier-diameter-i" placeholder="e.g., 12" step="0.25" style={{ width: '100%', padding: '12px 15px', border: '2px solid #e9ecef', borderRadius: '10px', fontSize: '1rem' }} />
                    <label style={{ fontSize: '0.9rem', color: '#666' }}>⚪ Diameter (inches)</label>
                  </div>
                  <div style={{ marginBottom: '15px' }}>
                    <input type="number" id="pier-height-i" placeholder="e.g., 5.0" step="0.1" style={{ width: '100%', padding: '12px 15px', border: '2px solid #e9ecef', borderRadius: '10px', fontSize: '1rem' }} />
                    <label style={{ fontSize: '0.9rem', color: '#666' }}>📏 H - Height (feet)</label>
                  </div>
                  <div style={{ marginBottom: '15px' }}>
                    <input type="number" id="pier-count-i" placeholder="e.g., 12" step="1" min="1" style={{ width: '100%', padding: '12px 15px', border: '2px solid #e9ecef', borderRadius: '10px', fontSize: '1rem' }} />
                    <label style={{ fontSize: '0.9rem', color: '#666' }}>🔢 Number of Piers</label>
                  </div>
                  <div style={{ background: '#fff3cd', border: '1px solid #ffeaa7', borderRadius: '8px', padding: '10px', margin: '10px 0', fontSize: '0.85rem', color: '#856404' }}>
                    💡 Formula: π × (D/2)² × H × Count
                  </div>
                  <button onClick={() => calculatePiers('imperial')} style={{ width: '100%', background: 'white', color: '#333', border: '2px solid #e9ecef', padding: '15px', borderRadius: '10px', fontSize: '1.1rem', fontWeight: '600', cursor: 'pointer', margin: '20px 0' }}>
                    Calculate Volume 🧮
                  </button>
                  {results['pier-imperial'] && (
                    <div style={{ background: '#6c757d', color: 'white', padding: '20px', borderRadius: '15px', textAlign: 'center', marginTop: '15px' }}>
                      <div style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '5px' }}>{results['pier-imperial']}</div>
                      <div style={{ fontSize: '1rem', opacity: '0.9' }}>cubic yards (yd³)</div>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
          {selectedCalculator === 'block' && (
            <>
              {currentUnit === 'metric' ? (
                <div style={{ background: '#e2e8f0', borderRadius: '20px', padding: '25px', boxShadow: '0 10px 30px rgba(0,0,0,0.2)', backdropFilter: 'blur(10px)', border: '2px solid #94a3b8' }}>
                  <div style={{ textAlign: 'center', marginBottom: '20px', paddingBottom: '15px', borderBottom: '2px solid #f0f0f0' }}>
                    <h3 style={{ fontSize: '1.4rem', color: '#333', marginBottom: '8px' }}>🧱 Block Work Fill</h3>
                    <small>Concrete fill for hollow blocks</small>
                  </div>
                  <div style={{ background: '#f8f9fa', borderRadius: '10px', padding: '15px', margin: '15px 0', textAlign: 'center', border: '2px dashed #dee2e6' }}>
                    <img src="/lovable-uploads/197b4511d3446.png" alt="Block work fill: labeled length, height, thickness, and fill percentage" style={{ maxWidth: '320px', width: '100%', display: 'block', margin: '0 auto' }} />
                  </div>
                  <div style={{ marginBottom: '15px' }}>
                    <input type="number" id="block-length-m" placeholder="e.g., 10.0" step="0.1" style={{ width: '100%', padding: '12px 15px', border: '2px solid #e9ecef', borderRadius: '10px', fontSize: '1rem' }} />
                    <label style={{ fontSize: '0.9rem', color: '#666' }}>📏 L - Length (meters)</label>
                  </div>
                  <div style={{ marginBottom: '15px' }}>
                    <input type="number" id="block-height-m" placeholder="e.g., 2.4" step="0.1" style={{ width: '100%', padding: '12px 15px', border: '2px solid #e9ecef', borderRadius: '10px', fontSize: '1rem' }} />
                    <label style={{ fontSize: '0.9rem', color: '#666' }}>📏 H - Height (meters)</label>
                  </div>
                  <div style={{ marginBottom: '15px' }}>
                    <input type="number" id="block-width-m" placeholder="e.g., 0.2" step="0.01" style={{ width: '100%', padding: '12px 15px', border: '2px solid #e9ecef', borderRadius: '10px', fontSize: '1rem' }} />
                    <label style={{ fontSize: '0.9rem', color: '#666' }}> T - Thickness (meters)</label>
                  </div>
                  <div style={{ marginBottom: '15px' }}>
                    <input type="number" id="block-fill-percent-m" placeholder="e.g., 25" step="1" min="0" max="100" style={{ width: '100%', padding: '12px 15px', border: '2px solid #e9ecef', borderRadius: '10px', fontSize: '1rem' }} />
                    <label style={{ fontSize: '0.9rem', color: '#666' }}>💯 Fill Percentage (%)</label>
                  </div>
                  <div style={{ background: '#fff3cd', border: '1px solid #ffeaa7', borderRadius: '8px', padding: '10px', margin: '10px 0', fontSize: '0.85rem', color: '#856404' }}>
                    💡 Formula: L × H × T × (Fill% / 100)
                  </div>
                  <button onClick={() => calculateBlockWork('metric')} style={{ width: '100%', background: 'white', color: '#333', border: '2px solid #e9ecef', padding: '15px', borderRadius: '10px', fontSize: '1.1rem', fontWeight: '600', cursor: 'pointer', margin: '20px 0' }}>
                    Calculate Volume 🧮
                  </button>
                  {results['block-metric'] && (
                    <div style={{ background: '#6c757d', color: 'white', padding: '20px', borderRadius: '15px', textAlign: 'center', marginTop: '15px' }}>
                      <div style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '5px' }}>{results['block-metric']}</div>
                      <div style={{ fontSize: '1rem', opacity: '0.9' }}>cubic meters (m³)</div>
                    </div>
                  )}
                </div>
              ) : (
                <div style={{ background: '#e2e8f0', borderRadius: '20px', padding: '25px', boxShadow: '0 10px 30px rgba(0,0,0,0.2)', backdropFilter: 'blur(10px)', border: '2px solid #94a3b8' }}>
                  <div style={{ textAlign: 'center', marginBottom: '20px', paddingBottom: '15px', borderBottom: '2px solid #f0f0f0' }}>
                    <h3 style={{ fontSize: '1.4rem', color: '#333', marginBottom: '8px' }}>🧱 Block Work Fill</h3>
                    <small>Concrete fill for hollow blocks</small>
                  </div>
                  <div style={{ background: '#f8f9fa', borderRadius: '10px', padding: '15px', margin: '15px 0', textAlign: 'center', border: '2px dashed #dee2e6' }}>
                    <img src="/lovable-uploads/197b4511d3446.png" alt="Block work fill: labeled length, height, thickness, and fill percentage" style={{ maxWidth: '320px', width: '100%', display: 'block', margin: '0 auto' }} />
                  </div>
                  <div style={{ marginBottom: '15px' }}>
                    <input type="number" id="block-length-i" placeholder="e.g., 32.8" step="0.1" style={{ width: '100%', padding: '12px 15px', border: '2px solid #e9ecef', borderRadius: '10px', fontSize: '1rem' }} />
                    <label style={{ fontSize: '0.9rem', color: '#666' }}>📏 L - Length (feet)</label>
                  </div>
                  <div style={{ marginBottom: '15px' }}>
                    <input type="number" id="block-height-i" placeholder="e.g., 7.9" step="0.1" style={{ width: '100%', padding: '12px 15px', border: '2px solid #e9ecef', borderRadius: '10px', fontSize: '1rem' }} />
                    <label style={{ fontSize: '0.9rem', color: '#666' }}>📏 H - Height (feet)</label>
                  </div>
                  <div style={{ marginBottom: '15px' }}>
                    <input type="number" id="block-width-i" placeholder="e.g., 0.66" step="0.01" style={{ width: '100%', padding: '12px 15px', border: '2px solid #e9ecef', borderRadius: '10px', fontSize: '1rem' }} />
                    <label style={{ fontSize: '0.9rem', color: '#666' }}>📏 T - Thickness (feet)</label>
                  </div>
                  <div style={{ marginBottom: '15px' }}>
                    <input type="number" id="block-fill-percent-i" placeholder="e.g., 25" step="1" min="0" max="100" style={{ width: '100%', padding: '12px 15px', border: '2px solid #e9ecef', borderRadius: '10px', fontSize: '1rem' }} />
                    <label style={{ fontSize: '0.9rem', color: '#666' }}>💯 Fill Percentage (%)</label>
                  </div>
                  <div style={{ background: '#fff3cd', border: '1px solid #ffeaa7', borderRadius: '8px', padding: '10px', margin: '10px 0', fontSize: '0.85rem', color: '#856404' }}>
                    💡 Formula: L × H × T × (Fill% / 100)
                  </div>
                  <button onClick={() => calculateBlockWork('imperial')} style={{ width: '100%', background: 'white', color: '#333', border: '2px solid #e9ecef', padding: '15px', borderRadius: '10px', fontSize: '1.1rem', fontWeight: '600', cursor: 'pointer', margin: '20px 0' }}>
                    Calculate Volume 🧮
                  </button>
                  {results['block-imperial'] && (
                    <div style={{ background: '#6c757d', color: 'white', padding: '20px', borderRadius: '15px', textAlign: 'center', marginTop: '15px' }}>
                      <div style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '5px' }}>{results['block-imperial']}</div>
                      <div style={{ fontSize: '1rem', opacity: '0.9' }}>cubic yards (yd³)</div>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
          {selectedCalculator === 'post' && (
            <>
              {currentUnit === 'metric' ? (
                <div style={{ background: '#e2e8f0', borderRadius: '20px', padding: '25px', boxShadow: '0 10px 30px rgba(0,0,0,0.2)', backdropFilter: 'blur(10px)', border: '2px solid #64748b' }}>
                  <div style={{ textAlign: 'center', marginBottom: '20px', paddingBottom: '15px', borderBottom: '2px solid #f0f0f0' }}>
                    <h3 style={{ fontSize: '1.4rem', color: '#333', marginBottom: '8px' }}>🔲 Post Holes</h3>
                    <small>Cylindrical holes for posts</small>
                  </div>
                  <div style={{ background: '#f8f9fa', borderRadius: '10px', padding: '15px', margin: '15px 0', textAlign: 'center', border: '2px dashed #dee2e6' }}>
                    <div style={{ fontFamily: 'monospace', fontSize: '0.9rem', color: '#666', lineHeight: '1.6' }}>
                      📐 Cylindrical Post Holes<br/>
                      <br/>
                      |     |<br/>
                      |     | H (Depth)<br/>
                      |     |<br/>
                      ----+-----+----<br/>
                        D (Diameter)<br/>
                      Volume: π × (D/2)² × H × Count
                    </div>
                  </div>
                  <div style={{ marginBottom: '15px' }}>
                    <input type="number" id="posthole-diameter-m" placeholder="e.g., 100" step="1" style={{ width: '100%', padding: '12px 15px', border: '2px solid #e9ecef', borderRadius: '10px', fontSize: '1rem' }} />
                    <label style={{ fontSize: '0.9rem', color: '#666' }}>⚪ Diameter (mm)</label>
                  </div>
                  <div style={{ marginBottom: '15px' }}>
                    <input type="number" id="posthole-depth-m" placeholder="e.g., 1.5" step="0.01" style={{ width: '100%', padding: '12px 15px', border: '2px solid #e9ecef', borderRadius: '10px', fontSize: '1rem' }} />
                    <label style={{ fontSize: '0.9rem', color: '#666' }}>📏 H - Depth (meters)</label>
                  </div>
                  <div style={{ marginBottom: '15px' }}>
                    <input type="number" id="posthole-count-m" placeholder="e.g., 12" step="1" min="1" style={{ width: '100%', padding: '12px 15px', border: '2px solid #e9ecef', borderRadius: '10px', fontSize: '1rem' }} />
                    <label style={{ fontSize: '0.9rem', color: '#666' }}>🔢 Number of Holes</label>
                  </div>
                  <div style={{ background: '#fff3cd', border: '1px solid #ffeaa7', borderRadius: '8px', padding: '10px', margin: '10px 0', fontSize: '0.85rem', color: '#856404' }}>
                    💡 Formula: π × (D/2)² × H × Count
                  </div>
                  <button onClick={() => calculatePostHoles('metric')} style={{ width: '100%', background: 'white', color: '#333', border: '2px solid #e9ecef', padding: '15px', borderRadius: '10px', fontSize: '1.1rem', fontWeight: '600', cursor: 'pointer', margin: '20px 0' }}>
                    Calculate Volume 🧮
                  </button>
                  {results['posthole-metric'] && (
                    <div style={{ background: '#6c757d', color: 'white', padding: '20px', borderRadius: '15px', textAlign: 'center', marginTop: '15px' }}>
                      <div style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '5px' }}>{results['posthole-metric']}</div>
                      <div style={{ fontSize: '1rem', opacity: '0.9' }}>cubic meters (m³)</div>
                    </div>
                  )}
                </div>
              ) : (
                <div style={{ background: '#e2e8f0', borderRadius: '20px', padding: '25px', boxShadow: '0 10px 30px rgba(0,0,0,0.2)', backdropFilter: 'blur(10px)', border: '2px solid #94a3b8' }}>
                  <div style={{ textAlign: 'center', marginBottom: '20px', paddingBottom: '15px', borderBottom: '2px solid #f0f0f0' }}>
                    <h3 style={{ fontSize: '1.4rem', color: '#333', marginBottom: '8px' }}>🔲 Post Holes</h3>
                    <small>Cylindrical holes for posts</small>
                  </div>
                  <div style={{ background: '#f8f9fa', borderRadius: '10px', padding: '15px', margin: '15px 0', textAlign: 'center', border: '2px dashed #dee2e6' }}>
                    <div style={{ fontFamily: 'monospace', fontSize: '0.9rem', color: '#666', lineHeight: '1.6' }}>
                      📐 Cylindrical Post Holes<br/>
                      <br/>
                      |     |<br/>
                      |     | H (Depth)<br/>
                      |     |<br/>
                      ----+-----+----<br/>
                        D (Diameter)<br/>
                      Volume: π × (D/2)² × H × Count
                    </div>
                  </div>
                  <div style={{ marginBottom: '15px' }}>
                    <input type="number" id="posthole-diameter-i" placeholder="e.g., 4" step="0.25" style={{ width: '100%', padding: '12px 15px', border: '2px solid #e9ecef', borderRadius: '10px', fontSize: '1rem' }} />
                    <label style={{ fontSize: '0.9rem', color: '#666' }}>⚪ Diameter (inches)</label>
                  </div>
                  <div style={{ marginBottom: '15px' }}>
                    <input type="number" id="posthole-depth-i" placeholder="e.g., 6" step="0.25" style={{ width: '100%', padding: '12px 15px', border: '2px solid #e9ecef', borderRadius: '10px', fontSize: '1rem' }} />
                    <label style={{ fontSize: '0.9rem', color: '#666' }}>📏 H - Depth (inches)</label>
                  </div>
                  <div style={{ marginBottom: '15px' }}>
                    <input type="number" id="posthole-count-i" placeholder="e.g., 12" step="1" min="1" style={{ width: '100%', padding: '12px 15px', border: '2px solid #e9ecef', borderRadius: '10px', fontSize: '1rem' }} />
                    <label style={{ fontSize: '0.9rem', color: '#666' }}>🔢 Number of Holes</label>
                  </div>
                  <div style={{ background: '#fff3cd', border: '1px solid #ffeaa7', borderRadius: '8px', padding: '10px', margin: '10px 0', fontSize: '0.85rem', color: '#856404' }}>
                    💡 Formula: π × (D/2)² × H × Count
                  </div>
                  <button onClick={() => calculatePostHoles('imperial')} style={{ width: '100%', background: 'white', color: '#333', border: '2px solid #e9ecef', padding: '15px', borderRadius: '10px', fontSize: '1.1rem', fontWeight: '600', cursor: 'pointer', margin: '20px 0' }}>
                    Calculate Volume 🧮
                  </button>
                  {results['posthole-imperial'] && (
                    <div style={{ background: '#6c757d', color: 'white', padding: '20px', borderRadius: '15px', textAlign: 'center', marginTop: '15px' }}>
                      <div style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '5px' }}>{results['posthole-imperial']}</div>
                      <div style={{ fontSize: '1rem', opacity: '0.9' }}>cubic yards (yd³)</div>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
          {selectedCalculator === 'footing' && (
            <>
              {currentUnit === 'metric' ? (
                <div style={{ background: '#e2e8f0', borderRadius: '20px', padding: '25px', boxShadow: '0 10px 30px rgba(0,0,0,0.2)', backdropFilter: 'blur(10px)', border: '2px solid #64748b' }}>
                  <div style={{ textAlign: 'center', marginBottom: '20px', paddingBottom: '15px', borderBottom: '2px solid #f0f0f0' }}>
                    <h3 style={{ fontSize: '1.4rem', color: '#333', marginBottom: '8px' }}>🔲 Strip Footings</h3>
                    <small>Concrete footings for strip foundations</small>
                  </div>
                  <div style={{ background: '#f8f9fa', borderRadius: '10px', padding: '15px', margin: '15px 0', textAlign: 'center', border: '2px dashed #dee2e6' }}>
                    <div style={{ fontFamily: 'monospace', fontSize: '0.9rem', color: '#666', lineHeight: '1.6' }}>
                      📐 Strip Footings<br/>
                      <br/>
                      ┌─────────────┐<br/>
                      │ █ █ █ █ █ │ H (Height)<br/>
                      │ █ █ █ █ █ │<br/>
                      └─────────────┘<br/>
                        L (Length)<br/>
                      Volume: L × H × T
                    </div>
                  </div>
                  <div style={{ marginBottom: '15px' }}>
                    <input type="number" id="footing-length-m" placeholder="e.g., 10.0" step="0.1" style={{ width: '100%', padding: '12px 15px', border: '2px solid #e9ecef', borderRadius: '10px', fontSize: '1rem' }} />
                    <label style={{ fontSize: '0.9rem', color: '#666' }}>📏 L - Length (meters)</label>
                  </div>
                  <div style={{ marginBottom: '15px' }}>
                    <input type="number" id="footing-width-m" placeholder="e.g., 0.3" step="0.01" style={{ width: '100%', padding: '12px 15px', border: '2px solid #e9ecef', borderRadius: '10px', fontSize: '1rem' }} />
                    <label style={{ fontSize: '0.9rem', color: '#666' }}>📏 T - Thickness (meters)</label>
                  </div>
                  <div style={{ marginBottom: '15px' }}>
                    <input type="number" id="footing-depth-m" placeholder="e.g., 0.5" step="0.01" style={{ width: '100%', padding: '12px 15px', border: '2px solid #e9ecef', borderRadius: '10px', fontSize: '1rem' }} />
                    <label style={{ fontSize: '0.9rem', color: '#666' }}> H - Height (meters)</label>
                  </div>
                  <div style={{ background: '#fff3cd', border: '1px solid #ffeaa7', borderRadius: '8px', padding: '10px', margin: '10px 0', fontSize: '0.85rem', color: '#856404' }}>
                    💡 Formula: L × H × T
                  </div>
                  <button onClick={() => calculateFootings('metric')} style={{ width: '100%', background: 'white', color: '#333', border: '2px solid #e9ecef', padding: '15px', borderRadius: '10px', fontSize: '1.1rem', fontWeight: '600', cursor: 'pointer', margin: '20px 0' }}>
                    Calculate Volume 🧮
                  </button>
                  {results['footing-metric'] && (
                    <div style={{ background: '#6c757d', color: 'white', padding: '20px', borderRadius: '15px', textAlign: 'center', marginTop: '15px' }}>
                      <div style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '5px' }}>{results['footing-metric']}</div>
                      <div style={{ fontSize: '1rem', opacity: '0.9' }}>cubic meters (m³)</div>
                    </div>
                  )}
                </div>
              ) : (
                <div style={{ background: '#e2e8f0', borderRadius: '20px', padding: '25px', boxShadow: '0 10px 30px rgba(0,0,0,0.2)', backdropFilter: 'blur(10px)', border: '2px solid #94a3b8' }}>
                  <div style={{ textAlign: 'center', marginBottom: '20px', paddingBottom: '15px', borderBottom: '2px solid #f0f0f0' }}>
                    <h3 style={{ fontSize: '1.4rem', color: '#333', marginBottom: '8px' }}>🔲 Strip Footings</h3>
                    <small>Concrete footings for strip foundations</small>
                  </div>
                  <div style={{ background: '#f8f9fa', borderRadius: '10px', padding: '15px', margin: '15px 0', textAlign: 'center', border: '2px dashed #dee2e6' }}>
                    <div style={{ fontFamily: 'monospace', fontSize: '0.9rem', color: '#666', lineHeight: '1.6' }}>
                      📐 Strip Footings<br/>
                      <br/>
                      ┌─────────────┐<br/>
                      │ █ █ █ █ █ │ H (Height)<br/>
                      │ █ █ █ █ █ │<br/>
                      └─────────────┘<br/>
                        L (Length)<br/>
                      Volume: L × H × T
                    </div>
                  </div>
                  <div style={{ marginBottom: '15px' }}>
                    <input type="number" id="footing-length-i" placeholder="e.g., 32.8" step="0.1" style={{ width: '100%', padding: '12px 15px', border: '2px solid #e9ecef', borderRadius: '10px', fontSize: '1rem' }} />
                    <label style={{ fontSize: '0.9rem', color: '#666' }}>📏 L - Length (feet)</label>
                  </div>
                  <div style={{ marginBottom: '15px' }}>
                    <input type="number" id="footing-width-i" placeholder="e.g., 1.0" step="0.01" style={{ width: '100%', padding: '12px 15px', border: '2px solid #e9ecef', borderRadius: '10px', fontSize: '1rem' }} />
                    <label style={{ fontSize: '0.9rem', color: '#666' }}>📏 T - Thickness (feet)</label>
                  </div>
                  <div style={{ marginBottom: '15px' }}>
                    <input type="number" id="footing-depth-i" placeholder="e.g., 1.5" step="0.01" style={{ width: '100%', padding: '12px 15px', border: '2px solid #e9ecef', borderRadius: '10px', fontSize: '1rem' }} />
                    <label style={{ fontSize: '0.9rem', color: '#666' }}>📏 H - Height (feet)</label>
                  </div>
                  <div style={{ background: '#fff3cd', border: '1px solid #ffeaa7', borderRadius: '8px', padding: '10px', margin: '10px 0', fontSize: '0.85rem', color: '#856404' }}>
                    💡 Formula: L × H × T
                  </div>
                  <button onClick={() => calculateFootings('imperial')} style={{ width: '100%', background: 'white', color: '#333', border: '2px solid #e9ecef', padding: '15px', borderRadius: '10px', fontSize: '1.1rem', fontWeight: '600', cursor: 'pointer', margin: '20px 0' }}>
                    Calculate Volume 🧮
                  </button>
                  {results['footing-imperial'] && (
                    <div style={{ background: '#6c757d', color: 'white', padding: '20px', borderRadius: '15px', textAlign: 'center', marginTop: '15px' }}>
                      <div style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '5px' }}>{results['footing-imperial']}</div>
                      <div style={{ fontSize: '1rem', opacity: '0.9' }}>cubic yards (yd³)</div>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default ConcreteCalculator; 