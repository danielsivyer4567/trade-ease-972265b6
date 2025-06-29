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

    // Australian street type abbreviations and their full forms
    const streetTypeMap: Record<string, string> = {
      'St': 'Street', 'Rd': 'Road', 'Ave': 'Avenue', 'Dr': 'Drive',
      'Cl': 'Close', 'Ct': 'Court', 'Pl': 'Place', 'Cres': 'Crescent',
      'Tce': 'Terrace', 'Pde': 'Parade', 'Hwy': 'Highway', 'Blvd': 'Boulevard',
      'Espl': 'Esplanade', 'Pkwy': 'Parkway', 'Ln': 'Lane', 'Way': 'Way',
      'Cct': 'Circuit', 'Rise': 'Rise', 'Grove': 'Grove', 'Walk': 'Walk'
    };

    console.log('Parsing address components:', components);

    components.forEach((component: any) => {
      const types = component.types;
      const longName = component.long_name;
      const shortName = component.short_name;
      
      console.log(`Component: ${longName} (${shortName}) - Types: ${types.join(', ')}`);
      
      if (types.includes('street_number')) {
        result.street_number = longName;
      } else if (types.includes('route')) {
        // More robust parsing for Australian street addresses
        const routeParts = longName.trim().split(' ');
        
        if (routeParts.length >= 2) {
          // Check if the last part is a known street type
          const lastPart = routeParts[routeParts.length - 1];
          const streetType = streetTypeMap[lastPart] || lastPart;
          
          result.street_type = streetType;
          result.street_name = routeParts.slice(0, -1).join(' ');
        } else {
          // Single word route (unusual but possible)
          result.street_name = longName;
          result.street_type = '';
        }
      } else if (types.includes('sublocality_level_1') || types.includes('sublocality') || types.includes('locality')) {
        // Prioritize more specific locality types
        if (!result.suburb || types.includes('sublocality_level_1')) {
          result.suburb = longName;
        }
      } else if (types.includes('postal_code')) {
        result.postcode = longName;
      }
    });

    // Clean and validate the results
    const cleanResult = {
      street_number: (result.street_number || '').trim(),
      street_name: (result.street_name || '').trim(),
      street_type: (result.street_type || '').trim(),
      suburb: (result.suburb || '').trim(),
      postcode: (result.postcode || '').trim()
    };

    console.log('Parsed address components:', cleanResult);
    return cleanResult;
  }

  /**
   * Parse address description string into components (fallback method)
   */
  static parseAddressDescription(description: string): AddressComponents {
    console.log('Parsing address description:', description);
    
    const result: AddressComponents = {
      street_number: '',
      street_name: '',
      street_type: '',
      suburb: '',
      postcode: ''
    };

    // Australian street type patterns (both abbreviated and full forms)
    const streetTypes = [
      'Street', 'St', 'Road', 'Rd', 'Avenue', 'Ave', 'Drive', 'Dr',
      'Close', 'Cl', 'Court', 'Ct', 'Place', 'Pl', 'Crescent', 'Cres',
      'Terrace', 'Tce', 'Parade', 'Pde', 'Highway', 'Hwy', 'Boulevard', 'Blvd',
      'Esplanade', 'Espl', 'Parkway', 'Pkwy', 'Lane', 'Ln', 'Way',
      'Circuit', 'Cct', 'Rise', 'Grove', 'Walk', 'Loop', 'Bend'
    ];

    // Split by comma to separate main address from suburb/state/postcode
    const parts = description.split(',').map(part => part.trim());
    
    if (parts.length >= 1) {
      // Parse the first part (street address)
      const streetPart = parts[0].trim();
      
      // Extract street number (digits at the beginning)
      const streetNumberMatch = streetPart.match(/^(\d+[a-zA-Z]?)\s+(.+)$/);
      
      if (streetNumberMatch) {
        result.street_number = streetNumberMatch[1];
        const remainingStreet = streetNumberMatch[2];
        
        // Find street type by checking if any word matches known street types
        const streetWords = remainingStreet.split(' ');
        let streetTypeIndex = -1;
        let foundStreetType = '';
        
        for (let i = streetWords.length - 1; i >= 0; i--) {
          const word = streetWords[i];
          const matchedType = streetTypes.find(type => 
            type.toLowerCase() === word.toLowerCase()
          );
          
          if (matchedType) {
            streetTypeIndex = i;
            foundStreetType = matchedType;
            break;
          }
        }
        
        if (streetTypeIndex > 0) {
          result.street_name = streetWords.slice(0, streetTypeIndex).join(' ');
          result.street_type = foundStreetType;
        } else {
          // No street type found, assume the whole remaining part is street name
          result.street_name = remainingStreet;
        }
      } else {
        // No street number found, try to parse street name and type only
        const streetWords = streetPart.split(' ');
        const lastWord = streetWords[streetWords.length - 1];
        const matchedType = streetTypes.find(type => 
          type.toLowerCase() === lastWord.toLowerCase()
        );
        
        if (matchedType && streetWords.length > 1) {
          result.street_name = streetWords.slice(0, -1).join(' ');
          result.street_type = matchedType;
        } else {
          result.street_name = streetPart;
        }
      }
    }
    
    if (parts.length >= 2) {
      // Parse suburb from second part
      const suburbPart = parts[1].trim();
      
      // Extract postcode (4 digits at the end)
      const postcodeMatch = suburbPart.match(/^(.+?)\s+(\d{4})$/);
      
      if (postcodeMatch) {
        result.suburb = postcodeMatch[1].trim();
        result.postcode = postcodeMatch[2];
      } else {
        result.suburb = suburbPart;
      }
    }
    
    // If we have more parts, try to extract postcode from the last part
    if (parts.length >= 3 && !result.postcode) {
      const lastPart = parts[parts.length - 1].trim();
      const postcodeMatch = lastPart.match(/\b(\d{4})\b/);
      if (postcodeMatch) {
        result.postcode = postcodeMatch[1];
      }
    }

    // Clean all fields
    Object.keys(result).forEach(key => {
      result[key as keyof AddressComponents] = result[key as keyof AddressComponents].trim();
    });

    console.log('Parsed description result:', result);
    return result;
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