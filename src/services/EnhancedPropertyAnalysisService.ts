interface PropertyCoordinate {
  lat: number;
  lng: number;
}

interface EnhancedPropertyData {
  boundaries: Array<{
    coordinates: [PropertyCoordinate, PropertyCoordinate];
    length: number;
    direction?: string;
    facesStreet?: boolean;
    streetName?: string;
    bearing?: number; // Compass bearing in degrees
  }>;
  centroid: PropertyCoordinate;
  address: {
    street_number: string;
    street_name: string;
    street_type: string;
    suburb: string;
    postcode: string;
  };
  nearbyRoads: Array<{
    name: string;
    coordinates: PropertyCoordinate[];
    distance: number;
  }>;
}

export class EnhancedPropertyAnalysisService {
  private static readonly GOOGLE_MAPS_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  private static readonly MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
  
  // Queensland Spatial Data endpoints
  private static readonly QLD_CADASTRAL_WFS = 'https://spatial-gis.information.qld.gov.au/geoserver/ows';
  private static readonly QLD_PROPERTY_API = 'https://gisservices.information.qld.gov.au/arcgis/rest/services';
  
  // Google Services
  private static readonly GOOGLE_GEOCODING_API = 'https://maps.googleapis.com/maps/api/geocode/json';
  private static readonly GOOGLE_ROADS_API = 'https://roads.googleapis.com/v1/nearestRoads';
  
  // Mapbox Services
  private static readonly MAPBOX_GEOCODING_API = 'https://api.mapbox.com/geocoding/v5/mapbox.places';

  /**
   * Get enhanced property data with coordinates and street analysis
   */
  static async getEnhancedPropertyData(address: {
    street_number: string;
    street_name: string;
    street_type: string;
    suburb: string;
    postcode: string;
  }): Promise<EnhancedPropertyData | null> {
    try {
      console.log('EnhancedPropertyAnalysisService: Starting enhanced analysis for:', address);

      // Step 1: Get precise geocoding
      const geocodeResult = await this.getDetailedGeocode(address);
      if (!geocodeResult) {
        console.log('EnhancedPropertyAnalysisService: Geocoding failed');
        return null;
      }

      // Step 2: Get property boundaries from cadastral data
      const boundaryData = await this.getPropertyBoundaries(geocodeResult.location, address);
      if (!boundaryData) {
        console.log('EnhancedPropertyAnalysisService: Boundary data not found');
        return null;
      }

      // Step 3: Identify nearby roads and streets
      const nearbyRoads = await this.getNearbyRoads(boundaryData.centroid);

      // Step 4: Analyze which boundaries face streets
      const enhancedBoundaries = await this.analyzeBoundaryStreetFacing(
        boundaryData.boundaries,
        nearbyRoads
      );

      return {
        boundaries: enhancedBoundaries,
        centroid: boundaryData.centroid,
        address,
        nearbyRoads
      };

    } catch (error) {
      console.error('EnhancedPropertyAnalysisService: Analysis failed:', error);
      return null;
    }
  }

  /**
   * Get detailed geocoding with high precision
   */
  private static async getDetailedGeocode(address: any): Promise<{
    location: PropertyCoordinate;
    precision: string;
  } | null> {
    const addressString = `${address.street_number} ${address.street_name} ${address.street_type}, ${address.suburb} QLD ${address.postcode}, Australia`;
    
    try {
      // Try Google Geocoding first (most accurate for Australian addresses)
      if (this.GOOGLE_MAPS_KEY) {
        const response = await fetch(
          `${this.GOOGLE_GEOCODING_API}?address=${encodeURIComponent(addressString)}&key=${this.GOOGLE_MAPS_KEY}`
        );
        const data = await response.json();
        
        if (data.status === 'OK' && data.results.length > 0) {
          const result = data.results[0];
          return {
            location: {
              lat: result.geometry.location.lat,
              lng: result.geometry.location.lng
            },
            precision: result.geometry.location_type
          };
        }
      }

      // Fallback to Mapbox Geocoding
      if (this.MAPBOX_TOKEN) {
        const response = await fetch(
          `${this.MAPBOX_GEOCODING_API}/${encodeURIComponent(addressString)}.json?access_token=${this.MAPBOX_TOKEN}&country=AU`
        );
        const data = await response.json();
        
        if (data.features && data.features.length > 0) {
          const [lng, lat] = data.features[0].center;
          return {
            location: { lat, lng },
            precision: data.features[0].properties.accuracy || 'approximate'
          };
        }
      }

      return null;
    } catch (error) {
      console.error('EnhancedPropertyAnalysisService: Geocoding error:', error);
      return null;
    }
  }

  /**
   * Get property boundary coordinates from cadastral data
   */
  private static async getPropertyBoundaries(location: PropertyCoordinate, address: any): Promise<{
    boundaries: Array<{
      coordinates: [PropertyCoordinate, PropertyCoordinate];
      length: number;
    }>;
    centroid: PropertyCoordinate;
  } | null> {
    try {
      // Queensland Property Boundaries (WFS Service) 
      const wfsParams = new URLSearchParams({
        service: 'WFS',
        version: '2.0.0',
        request: 'GetFeature',
        typeName: 'cadastre:lot',
        outputFormat: 'application/json',
        cql_filter: `INTERSECTS(geom, POINT(${location.lng} ${location.lat}))`
      });

      const response = await fetch(`${this.QLD_CADASTRAL_WFS}?${wfsParams}`);
      const data = await response.json();

      if (data.features && data.features.length > 0) {
        const feature = data.features[0];
        const geometry = feature.geometry;

        if (geometry.type === 'Polygon') {
          const coordinates = geometry.coordinates[0]; // Exterior ring
          const boundaries = [];
          
          // Convert coordinate pairs to boundaries with lengths
          for (let i = 0; i < coordinates.length - 1; i++) {
            const start: PropertyCoordinate = {
              lng: coordinates[i][0],
              lat: coordinates[i][1]
            };
            const end: PropertyCoordinate = {
              lng: coordinates[i + 1][0],
              lat: coordinates[i + 1][1]
            };
            
            const length = this.calculateDistance(start, end);
            
            boundaries.push({
              coordinates: [start, end] as [PropertyCoordinate, PropertyCoordinate],
              length
            });
          }

          // Calculate centroid
          const centroid = this.calculatePolygonCentroid(
            coordinates.map(coord => ({ lng: coord[0], lat: coord[1] }))
          );

          return { boundaries, centroid };
        }
      }

      return null;
    } catch (error) {
      console.error('EnhancedPropertyAnalysisService: Boundary fetch error:', error);
      return null;
    }
  }

  /**
   * Get nearby roads and streets
   */
  private static async getNearbyRoads(location: PropertyCoordinate): Promise<Array<{
    name: string;
    coordinates: PropertyCoordinate[];
    distance: number;
  }>> {
    try {
      const roads = [];

      // Google Roads API
      if (this.GOOGLE_MAPS_KEY) {
        const response = await fetch(
          `${this.GOOGLE_ROADS_API}?points=${location.lat},${location.lng}&key=${this.GOOGLE_MAPS_KEY}`
        );
        const data = await response.json();
        
        // Process Google Roads data
        if (data.nearestRoads) {
          for (const road of data.nearestRoads) {
            roads.push({
              name: road.placeId || 'Unknown Road',
              coordinates: [location], // Simplified - would need additional API calls for full road geometry
              distance: 0 // Would calculate from road geometry
            });
          }
        }
      }

      return roads;
    } catch (error) {
      console.error('EnhancedPropertyAnalysisService: Roads fetch error:', error);
      return [];
    }
  }

  /**
   * Analyze which boundaries face streets
   */
  private static async analyzeBoundaryStreetFacing(
    boundaries: Array<{
      coordinates: [PropertyCoordinate, PropertyCoordinate];
      length: number;
    }>,
    nearbyRoads: Array<{
      name: string;
      coordinates: PropertyCoordinate[];
      distance: number;
    }>
  ): Promise<Array<{
    coordinates: [PropertyCoordinate, PropertyCoordinate];
    length: number;
    direction?: string;
    facesStreet?: boolean;
    streetName?: string;
    bearing?: number;
  }>> {
    return boundaries.map((boundary, index) => {
      const [start, end] = boundary.coordinates;
      
      // Calculate bearing (compass direction) of this boundary
      const bearing = this.calculateBearing(start, end);
      
      // Calculate midpoint of boundary
      const midpoint: PropertyCoordinate = {
        lat: (start.lat + end.lat) / 2,
        lng: (start.lng + end.lng) / 2
      };

      // Determine if this boundary faces a street (simplified logic)
      const facesStreet = nearbyRoads.length > 0; // Would need more sophisticated analysis
      const streetName = facesStreet ? nearbyRoads[0]?.name : undefined;

      // Assign direction based on bearing
      let direction = '';
      if (bearing >= 337.5 || bearing < 22.5) direction = 'north';
      else if (bearing >= 22.5 && bearing < 67.5) direction = 'northeast';
      else if (bearing >= 67.5 && bearing < 112.5) direction = 'east';
      else if (bearing >= 112.5 && bearing < 157.5) direction = 'southeast';
      else if (bearing >= 157.5 && bearing < 202.5) direction = 'south';
      else if (bearing >= 202.5 && bearing < 247.5) direction = 'southwest';
      else if (bearing >= 247.5 && bearing < 292.5) direction = 'west';
      else if (bearing >= 292.5 && bearing < 337.5) direction = 'northwest';

      return {
        ...boundary,
        direction,
        facesStreet,
        streetName,
        bearing
      };
    });
  }

  /**
   * Calculate distance between two coordinates (Haversine formula)
   */
  private static calculateDistance(point1: PropertyCoordinate, point2: PropertyCoordinate): number {
    const R = 6371000; // Earth's radius in meters
    const dLat = (point2.lat - point1.lat) * Math.PI / 180;
    const dLng = (point2.lng - point1.lng) * Math.PI / 180;
    
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(point1.lat * Math.PI / 180) * Math.cos(point2.lat * Math.PI / 180) *
              Math.sin(dLng / 2) * Math.sin(dLng / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  /**
   * Calculate bearing between two coordinates
   */
  private static calculateBearing(point1: PropertyCoordinate, point2: PropertyCoordinate): number {
    const dLng = (point2.lng - point1.lng) * Math.PI / 180;
    const lat1 = point1.lat * Math.PI / 180;
    const lat2 = point2.lat * Math.PI / 180;

    const y = Math.sin(dLng) * Math.cos(lat2);
    const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);

    let bearing = Math.atan2(y, x) * 180 / Math.PI;
    return (bearing + 360) % 360; // Normalize to 0-360 degrees
  }

  /**
   * Calculate polygon centroid
   */
  private static calculatePolygonCentroid(coordinates: PropertyCoordinate[]): PropertyCoordinate {
    const centroid = coordinates.reduce(
      (acc, coord) => ({
        lat: acc.lat + coord.lat,
        lng: acc.lng + coord.lng
      }),
      { lat: 0, lng: 0 }
    );

    return {
      lat: centroid.lat / coordinates.length,
      lng: centroid.lng / coordinates.length
    };
  }
} 