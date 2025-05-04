import React, { ReactNode } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { MapContainer, TileLayer, Polygon, Marker, Popup } from 'react-leaflet';

// Fix Leaflet marker icon issues
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

interface LeafletProviderProps {
  children: ReactNode;
}

/**
 * LeafletProvider component to handle Leaflet map context and initialization
 * This prevents the direct rendering of Context.Consumer issues
 */
export const LeafletProvider: React.FC<LeafletProviderProps> = ({ children }) => {
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
  return (
    <LeafletProvider>
      <MapContainer
        center={center}
        zoom={zoom}
        className={className}
        style={style}
        whenReady={onMapReady}
      >
        {children}
      </MapContainer>
    </LeafletProvider>
  );
};

// Also provide a simple TileLayer wrapper
export interface TileLayerWrapperProps {
  url: string;
  attribution: string;
}

export const TileLayerWrapper: React.FC<TileLayerWrapperProps> = ({ url, attribution }) => {
  return <TileLayer attribution={attribution} url={url} />;
}; 