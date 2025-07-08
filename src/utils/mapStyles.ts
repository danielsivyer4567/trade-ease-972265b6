import { chartColors } from "@/components/shared/ChartCard";

// Custom map styles for consistent theming
export const mapThemes = {
  default: [
    {
      featureType: "poi",
      elementType: "labels",
      stylers: [{ visibility: "off" }]
    },
    {
      featureType: "transit",
      elementType: "labels.icon",
      stylers: [{ visibility: "off" }]
    }
  ],
  
  minimal: [
    {
      featureType: "poi",
      elementType: "labels",
      stylers: [{ visibility: "off" }]
    },
    {
      featureType: "transit",
      stylers: [{ visibility: "off" }]
    },
    {
      featureType: "road",
      elementType: "labels.icon",
      stylers: [{ visibility: "off" }]
    }
  ],

  professional: [
    {
      featureType: "all",
      elementType: "geometry.fill",
      stylers: [{ saturation: -15 }, { lightness: 5 }]
    },
    {
      featureType: "poi",
      elementType: "labels",
      stylers: [{ visibility: "off" }]
    },
    {
      featureType: "water",
      elementType: "geometry.fill",
      stylers: [{ color: "#c8d7e8" }]
    },
    {
      featureType: "landscape",
      elementType: "geometry.fill",
      stylers: [{ color: "#f5f5f5" }]
    }
  ]
};

// Custom marker configurations
export const markerConfigs = {
  job: {
    pending: {
      path: window.google?.maps?.SymbolPath?.CIRCLE || 'M 0, 0 m -5, 0 a 5,5 0 1,0 10,0 a 5,5 0 1,0 -10,0',
      fillColor: chartColors.warning,
      fillOpacity: 1,
      strokeColor: 'white',
      strokeWeight: 2,
      scale: 10
    },
    in_progress: {
      path: window.google?.maps?.SymbolPath?.CIRCLE || 'M 0, 0 m -5, 0 a 5,5 0 1,0 10,0 a 5,5 0 1,0 -10,0',
      fillColor: chartColors.primary,
      fillOpacity: 1,
      strokeColor: 'white',
      strokeWeight: 2,
      scale: 10
    },
    completed: {
      path: window.google?.maps?.SymbolPath?.CIRCLE || 'M 0, 0 m -5, 0 a 5,5 0 1,0 10,0 a 5,5 0 1,0 -10,0',
      fillColor: chartColors.accent,
      fillOpacity: 1,
      strokeColor: 'white',
      strokeWeight: 2,
      scale: 10
    },
    cancelled: {
      path: window.google?.maps?.SymbolPath?.CIRCLE || 'M 0, 0 m -5, 0 a 5,5 0 1,0 10,0 a 5,5 0 1,0 -10,0',
      fillColor: '#ef4444',
      fillOpacity: 1,
      strokeColor: 'white',
      strokeWeight: 2,
      scale: 10
    },
    default: {
      path: window.google?.maps?.SymbolPath?.CIRCLE || 'M 0, 0 m -5, 0 a 5,5 0 1,0 10,0 a 5,5 0 1,0 -10,0',
      fillColor: chartColors.secondary,
      fillOpacity: 1,
      strokeColor: 'white',
      strokeWeight: 2,
      scale: 10
    },
    selected: {
      path: window.google?.maps?.SymbolPath?.CIRCLE || 'M 0, 0 m -5, 0 a 5,5 0 1,0 10,0 a 5,5 0 1,0 -10,0',
      fillColor: chartColors.accent,
      fillOpacity: 1,
      strokeColor: 'white',
      strokeWeight: 3,
      scale: 12
    }
  },

  property: {
    boundary: {
      strokeColor: chartColors.primary,
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: chartColors.primary,
      fillOpacity: 0.1
    },
    measurement: {
      strokeColor: chartColors.warning,
      strokeOpacity: 1,
      strokeWeight: 2,
      fillColor: chartColors.warning,
      fillOpacity: 0.2
    }
  }
};

// Info window styling
export const infoWindowStyles = {
  default: {
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -1px rgb(0 0 0 / 0.06)',
    border: `1px solid ${chartColors.border}`,
    padding: '0'
  },
  
  compact: {
    backgroundColor: 'white',
    borderRadius: '6px',
    boxShadow: '0 2px 4px -1px rgb(0 0 0 / 0.1)',
    border: `1px solid ${chartColors.border}`,
    padding: '0'
  }
};

// Common map options
export const mapOptions = {
  default: {
    disableDefaultUI: false,
    mapTypeControl: true,
    streetViewControl: true,
    fullscreenControl: true,
    zoomControl: true,
    styles: mapThemes.default
  },

  minimal: {
    disableDefaultUI: true,
    zoomControl: true,
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: false,
    styles: mapThemes.minimal
  },

  professional: {
    disableDefaultUI: false,
    mapTypeControl: true,
    streetViewControl: true,
    fullscreenControl: true,
    zoomControl: true,
    styles: mapThemes.professional
  }
};

// Helper functions for marker creation
export const createJobMarker = (status: string, isSelected: boolean = false) => {
  if (isSelected) {
    return markerConfigs.job.selected;
  }
  
  return markerConfigs.job[status] || markerConfigs.job.default;
};

export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'completed': return chartColors.accent;
    case 'in_progress': return chartColors.primary;
    case 'pending': return chartColors.warning;
    case 'cancelled': return '#ef4444';
    default: return chartColors.secondary;
  }
};

// Status badge styles for info windows
export const statusBadgeStyles = {
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  in_progress: 'bg-blue-100 text-blue-800 border-blue-200',
  completed: 'bg-green-100 text-green-800 border-green-200',
  cancelled: 'bg-red-100 text-red-800 border-red-200',
  default: 'bg-gray-100 text-gray-800 border-gray-200'
};

// Default center points for different regions
export const defaultCenters = {
  australia: { lat: -25.2744, lng: 133.7751 },
  sydney: { lat: -33.8688, lng: 151.2093 },
  melbourne: { lat: -37.8136, lng: 144.9631 },
  brisbane: { lat: -27.4698, lng: 153.0251 },
  perth: { lat: -31.9505, lng: 115.8605 },
  adelaide: { lat: -34.9285, lng: 138.6007 }
}; 