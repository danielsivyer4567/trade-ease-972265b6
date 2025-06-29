import { GOOGLE_MAPS_CONFIG } from '@/config/google-maps';

export interface AddressSuggestion {
  placeId: string;
  description: string;
  mainText: string;
  secondaryText: string;
  streetNumber?: string;
  streetName?: string;
  streetType?: string;
  suburb?: string;
  postcode?: string;
  state?: string;
  country?: string;
}

export interface AddressComponents {
  street_number: string;
  street_name: string;
  street_type: string;
  suburb: string;
  postcode: string;
}

export class AddressAutocompleteService {
  private static readonly GOOGLE_PLACES_API_URL = 'https://maps.googleapis.com/maps/api/place';
  
  /**
   * Get address suggestions based on user input
   */
  static async getAddressSuggestions(input: string, countryCode: string = 'AU'): Promise<AddressSuggestion[]> {
    if (!input || input.length < 3) {
      return [];
    }

    const apiKey = GOOGLE_MAPS_CONFIG.apiKey;
    if (!apiKey) {
      console.warn('Google Maps API key not configured for autocomplete');
      return [];
    }

    try {
      const response = await fetch(
        `${this.GOOGLE_PLACES_API_URL}/autocomplete/json?` +
        `input=${encodeURIComponent(input)}&` +
        `types=address&` +
        `components=country:${countryCode}&` +
        `key=${apiKey}`
      );

      const data = await response.json();

      if (data.status === 'OK' && data.predictions) {
        return data.predictions.map((prediction: any) => ({
          placeId: prediction.place_id,
          description: prediction.description,
          mainText: prediction.structured_formatting?.main_text || prediction.description,
          secondaryText: prediction.structured_formatting?.secondary_text || ''
        }));
      }

      return [];
    } catch (error) {
      console.error('Error fetching address suggestions:', error);
      return [];
    }
  }

  /**
   * Get detailed address components from a place ID
   */
  static async getAddressDetails(placeId: string): Promise<AddressComponents | null> {
    const apiKey = GOOGLE_MAPS_CONFIG.apiKey;
    if (!apiKey) {
      console.warn('Google Maps API key not configured for place details');
      return null;
    }

    try {
      const response = await fetch(
        `${this.GOOGLE_PLACES_API_URL}/details/json?` +
        `place_id=${placeId}&` +
        `fields=address_components&` +
        `key=${apiKey}`
      );

      const data = await response.json();

      if (data.status === 'OK' && data.result?.address_components) {
        return this.parseAddressComponents(data.result.address_components);
      }

      return null;
    } catch (error) {
      console.error('Error fetching address details:', error);
      return null;
    }
  }

  /**
   * Parse Google Places API address components into our format
   */
  private static parseAddressComponents(components: any[]): AddressComponents {
    const result: Partial<AddressComponents> = {
      street_number: '',
      street_name: '',
      street_type: '',
      suburb: '',
      postcode: ''
    };

    components.forEach((component: any) => {
      const types = component.types;
      
      if (types.includes('street_number')) {
        result.street_number = component.long_name;
      } else if (types.includes('route')) {
        // Split route into name and type (e.g., "Smith Street" -> "Smith" + "Street")
        const routeParts = component.long_name.split(' ');
        if (routeParts.length >= 2) {
          result.street_type = routeParts.pop() || '';
          result.street_name = routeParts.join(' ');
        } else {
          result.street_name = component.long_name;
        }
      } else if (types.includes('locality') || types.includes('sublocality')) {
        result.suburb = component.long_name;
      } else if (types.includes('postal_code')) {
        result.postcode = component.long_name;
      }
    });

    return result as AddressComponents;
  }

  /**
   * Fallback autocomplete using ArcGIS geocoding service
   */
  static async getAddressSuggestionsArcGIS(input: string): Promise<AddressSuggestion[]> {
    if (!input || input.length < 3) {
      return [];
    }

    try {
      const response = await fetch(
        `https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/suggest?` +
        `text=${encodeURIComponent(input)}&` +
        `f=json&` +
        `countryCode=AUS&` +
        `category=Address&` +
        `maxSuggestions=5`
      );

      const data = await response.json();

      if (data.suggestions) {
        return data.suggestions.map((suggestion: any) => ({
          placeId: suggestion.magicKey,
          description: suggestion.text,
          mainText: suggestion.text,
          secondaryText: ''
        }));
      }

      return [];
    } catch (error) {
      console.error('Error fetching ArcGIS address suggestions:', error);
      return [];
    }
  }
} 