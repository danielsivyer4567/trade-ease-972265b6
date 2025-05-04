import L from 'leaflet';

// Simple types for the Leaflet library
declare global {
  interface Window {
    L: typeof L;
  }
}

// Add any custom extensions to Leaflet here if needed
declare module 'leaflet' {
  // No additional custom types needed at this time
}

export {}; 