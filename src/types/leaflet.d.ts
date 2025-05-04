import { MapContainer, TileLayer } from 'react-leaflet';

declare module 'react-leaflet' {
  interface MapContainerProps {
    center: [number, number];
    zoom: number;
    children?: React.ReactNode;
    style?: React.CSSProperties;
    className?: string;
    whenReady?: () => void;
  }

  interface TileLayerProps {
    attribution: string;
    url: string;
  }
} 