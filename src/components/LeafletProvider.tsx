import React, { ReactNode, useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { MapContainer, TileLayer, Polygon, Marker, Popup } from 'react-leaflet';

// Fix Leaflet marker icon issues
function fixLeafletIcons() {
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
    fixLeafletIcons();
  }, []);

  // Simple wrapper to avoid context issues
  return <>{children}</>;
};

// Define a proxy component that wraps MapContainer to avoid type issues
export interface MapWrapperProps {
  center: [number, number];
  zoom: number;
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onMapReady?: () => void;
}

export const MapWrapper: React.FC<MapWrapperProps> = ({ 
  center, 
  zoom, 
  children, 
  className,
  style = { height: '400px', width: '100%' }, 
  onMapReady 
}) => {
  // The actual MapContainer is imported dynamically to prevent SSR issues
  useEffect(() => {
    import('react-leaflet').then(() => {
      // Leaflet is now loaded
      if (onMapReady) onMapReady();
    });
  }, [onMapReady]);

  // Use dynamic import for MapContainer to avoid SSR issues
  const [MapComponent, setMapComponent] = React.useState<any>(null);

  useEffect(() => {
    // Dynamically import the MapContainer component
    if (typeof window !== 'undefined') {
      import('react-leaflet').then(module => {
        setMapComponent(() => module.MapContainer);
      });
    }
  }, []);

  if (!MapComponent) {
    return <div style={style} className={className}>Loading map...</div>;
  }

  return (
    <MapComponent
      center={center}
      zoom={zoom}
      className={className}
      style={style}
      whenReady={onMapReady}
    >
      {children}
    </MapComponent>
  );
};

// Also provide a simple TileLayer wrapper
export interface TileLayerWrapperProps {
  url: string;
  attribution: string;
}

export const TileLayerWrapper: React.FC<TileLayerWrapperProps> = ({ url, attribution }) => {
  const [TileLayerComponent, setTileLayerComponent] = React.useState<any>(null);

  useEffect(() => {
    // Dynamically import the TileLayer component
    if (typeof window !== 'undefined') {
      import('react-leaflet').then(module => {
        setTileLayerComponent(() => module.TileLayer);
      });
    }
  }, []);

  if (!TileLayerComponent) return null;

  return <TileLayerComponent attribution={attribution} url={url} />;
}; 