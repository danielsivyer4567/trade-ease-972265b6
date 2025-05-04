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
    
    // Validate center coordinates
    const validCenter = center && center.length === 2 && 
      !isNaN(Number(center[0])) && !isNaN(Number(center[1])) ?
      [Number(center[0]), Number(center[1])] : [-27.5, 153.0];
    
    // Create map
    const map = L.map(mapRef.current).setView(validCenter, zoom);
    
    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    
    // Add center marker
    L.marker(validCenter).addTo(map)
      .bindPopup(title || 'Property Location')
      .openPopup();
    
    // Add boundaries if provided
    const validBoundaries = boundaries.filter(boundary => 
      Array.isArray(boundary) && boundary.length >= 3
    );
    
    if (validBoundaries.length > 0) {
      // Create an array to store valid polygons for fitBounds
      const allPolygons = [];
      
      validBoundaries.forEach((boundary, index) => {
        try {
          // Validate all points in the boundary
          const validPoints = boundary.filter(point => 
            Array.isArray(point) && 
            point.length === 2 && 
            !isNaN(Number(point[0])) && 
            !isNaN(Number(point[1]))
          );
          
          if (validPoints.length >= 3) {
            // Convert to numeric values
            const normalizedPoints = validPoints.map(point => 
              [Number(point[0]), Number(point[1])]
            );
            
            // Create and add polygon
            const polygon = L.polygon(normalizedPoints, {
              color: '#4B55C7',
              fillColor: 'rgba(75, 85, 199, 0.3)',
              fillOpacity: 0.5,
              weight: 3
            }).addTo(map);
            
            allPolygons.push(polygon);
          }
        } catch (error) {
          console.error('Error adding polygon boundary:', error);
        }
      });
      
      // Fit bounds to show all valid boundaries
      if (allPolygons.length > 0) {
        try {
          const allPolygonBounds = L.featureGroup(allPolygons).getBounds();
          map.fitBounds(allPolygonBounds);
        } catch (error) {
          console.error('Error fitting bounds:', error);
          // If fitting bounds fails, center on marker
          map.setView(validCenter, zoom);
        }
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