import React, { ReactNode, useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Remove direct import of react-leaflet components to prevent SSR issues
// import { MapContainer, TileLayer, Polygon, Marker, Popup } from 'react-leaflet';

// Fix Leaflet marker icon issues
function fixLeafletIcons() {
  if (typeof window === 'undefined') return;
  
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  });
}

interface LeafletProviderProps {
  children: ReactNode;
}

/**
 * LeafletProvider component to handle Leaflet map context and initialization
 * This prevents the direct rendering of Context.Consumer issues
 */
export const LeafletProvider: React.FC<LeafletProviderProps> = ({ children }) => {
  // Initialize Leaflet only on client-side
  useEffect(() => {
    if (typeof window !== 'undefined') {
      fixLeafletIcons();
    }
  }, []);

  // Simple wrapper to avoid context issues
  return <>{children}</>;
};

// Define a proxy component that creates a map manually instead of using MapContainer
export interface MapWrapperProps {
  center: [number, number];
  zoom: number;
  children?: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onMapReady?: () => void;
}

export const MapWrapper: React.FC<MapWrapperProps> = ({ 
  center, 
  zoom, 
  children, 
  className = '',
  style = { height: '400px', width: '100%' }, 
  onMapReady 
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [isMapReady, setIsMapReady] = React.useState(false);
  
  // Create the map manually with vanilla Leaflet instead of using react-leaflet
  useEffect(() => {
    if (typeof window === 'undefined' || !mapRef.current) return;
    
    // Only initialize map once
    if (mapInstanceRef.current) return;
    
    // Import Leaflet directly to avoid React context issues
    const L = require('leaflet');
    
    // Create the map
    const map = L.map(mapRef.current).setView(center, zoom);
    
    // Add OpenStreetMap tiles by default
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    
    // Store map instance
    mapInstanceRef.current = map;
    
    // Notify parent component
    setIsMapReady(true);
    if (onMapReady) onMapReady();
    
    // Cleanup on unmount
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [center, zoom, onMapReady]);
  
  return (
    <div ref={mapRef} className={className} style={style}>
      {isMapReady && children}
    </div>
  );
};

// Simplified map component
export const SimplePropertyMap: React.FC<{
  center: [number, number];
  zoom?: number;
  boundaries?: Array<Array<[number, number]>>;
  title?: string;
  onMapReady?: () => void;
}> = ({ center, zoom = 15, boundaries = [], title = '', onMapReady }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (typeof window === 'undefined' || !mapRef.current) return;
    
    // Import Leaflet directly
    const L = require('leaflet');
    
    // Fix icons
    fixLeafletIcons();
    
    // Create map
    const map = L.map(mapRef.current).setView(center, zoom);
    
    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    
    // Add center marker
    L.marker(center).addTo(map)
      .bindPopup(title || 'Property Location')
      .openPopup();
    
    // Add boundaries if provided
    if (boundaries && boundaries.length > 0) {
      boundaries.forEach((boundary, index) => {
        if (boundary && boundary.length >= 3) {
          L.polygon(boundary, {
            color: '#4B55C7',
            fillColor: 'rgba(75, 85, 199, 0.3)',
            fillOpacity: 0.5,
            weight: 3
          }).addTo(map);
        }
      });
      
      // Fit bounds to show all boundaries
      const allPoints = boundaries.flat();
      if (allPoints.length > 0) {
        const bounds = L.latLngBounds(allPoints);
        map.fitBounds(bounds);
      }
    }
    
    // Notify when ready
    if (onMapReady) onMapReady();
    
    // Cleanup
    return () => {
      map.remove();
    };
  }, [center, zoom, boundaries, title, onMapReady]);
  
  return <div ref={mapRef} style={{ height: '400px', width: '100%' }} />;
}; 