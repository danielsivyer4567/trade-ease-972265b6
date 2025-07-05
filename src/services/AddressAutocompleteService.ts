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
  unit_number: string;
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
      unit_number: '',
      street_number: '',
      street_name: '',
      street_type: '',
      suburb: '',
      postcode: ''
    };

         // Australian street type abbreviations and their full forms
    const streetTypeMap: Record<string, string> = {
      'St': 'Street', 'Rd': 'Road', 'Ave': 'Avenue', 'Av': 'Avenue', 'Dr': 'Drive',
      'Cl': 'Close', 'Ct': 'Court', 'Pl': 'Place', 'Cres': 'Crescent',
      'Tce': 'Terrace', 'Pde': 'Parade', 'Hwy': 'Highway', 'Blvd': 'Boulevard',
      'Espl': 'Esplanade', 'Pkwy': 'Parkway', 'Ln': 'Lane', 'Way': 'Way',
      'Cct': 'Circuit', 'Rise': 'Rise', 'Grove': 'Grove', 'Walk': 'Walk'
    };

    components.forEach((component: any) => {
      const types = component.types;
      const longName = component.long_name;
      
      if (types.includes('subpremise')) {
        // Unit/apartment number
        result.unit_number = longName;
      } else if (types.includes('street_number')) {
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
      unit_number: (result.unit_number || '').trim(),
      street_number: (result.street_number || '').trim(),
      street_name: (result.street_name || '').trim(),
      street_type: (result.street_type || '').trim(),
      suburb: (result.suburb || '').trim(),
      postcode: (result.postcode || '').trim()
    };

    return cleanResult;
  }

  /**
   * Parse address description string into components (fallback method)
   */
  static parseAddressDescription(description: string): AddressComponents {
    console.log('🔍 Parsing address description:', description);
    
    const result: AddressComponents = {
      unit_number: '',
      street_number: '',
      street_name: '',
      street_type: '',
      suburb: '',
      postcode: ''
    };

    // Australian street type patterns (both abbreviated and full forms)
    const streetTypes = [
      'Street', 'St', 'Road', 'Rd', 'Avenue', 'Ave', 'Av', 'Drive', 'Dr',
      'Close', 'Cl', 'Court', 'Ct', 'Place', 'Pl', 'Crescent', 'Cres',
      'Terrace', 'Tce', 'Parade', 'Pde', 'Highway', 'Hwy', 'Boulevard', 'Blvd',
      'Esplanade', 'Espl', 'Parkway', 'Pkwy', 'Lane', 'Ln', 'Way',
      'Circuit', 'Cct', 'Rise', 'Grove', 'Walk', 'Loop', 'Bend'
    ];

    // Street type standardization map
    const streetTypeStandardMap: Record<string, string> = {
      'St': 'Street', 'Rd': 'Road', 'Ave': 'Avenue', 'Av': 'Avenue', 'Dr': 'Drive',
      'Cl': 'Close', 'Ct': 'Court', 'Pl': 'Place', 'Cres': 'Crescent',
      'Tce': 'Terrace', 'Pde': 'Parade', 'Hwy': 'Highway', 'Blvd': 'Boulevard',
      'Espl': 'Esplanade', 'Pkwy': 'Parkway', 'Ln': 'Lane'
    };

    // Split by comma to separate main address from suburb/state/postcode
    const parts = description.split(',').map(part => part.trim());
    console.log('📝 Address parts:', parts);
    
    if (parts.length >= 1) {
      // Parse the first part (street address)
      let streetPart = parts[0].trim();
      
      // Check for unit/apartment number patterns
      // Patterns: "Unit 1/123 Smith St", "1/123 Smith St", "Apt 5, 67 Park Ave"
      const unitPatterns = [
        /^(Unit|Apt|Apartment|Shop|Suite|Level|Floor)\s+(\w+)[\/,]\s*(.+)$/i,  // "Unit 1/123 Smith St" or "Apt 5, 67 Park Ave"
        /^(\w+)\/(.+)$/,  // "1/123 Smith St" (but make sure it's not just a street name)
        /^(Unit|Apt|Apartment|Shop|Suite|Level|Floor)\s+(\w+)\s+(.+)$/i  // "Unit 1 123 Smith St" (space instead of slash)
      ];
      
      for (const pattern of unitPatterns) {
        const unitMatch = streetPart.match(pattern);
        if (unitMatch) {
          if (pattern.source.includes('Unit|Apt')) {
            // Patterns with unit type specified
            result.unit_number = unitMatch[2];
            streetPart = unitMatch[3];
          } else {
            // Simple number/address pattern (e.g., "1/123 Smith St")
            // Make sure the first part is actually a unit number (not a complex street name)
            const potentialUnit = unitMatch[1];
            if (/^\w{1,4}$/.test(potentialUnit)) { // Unit numbers are typically short
              result.unit_number = potentialUnit;
              streetPart = unitMatch[2];
            }
          }
          break;
        }
      }
      
      console.log('🏢 After unit parsing - Unit:', result.unit_number, 'Street part:', streetPart);
      
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
          // Standardize the street type
          result.street_type = streetTypeStandardMap[foundStreetType] || foundStreetType;
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
          // Standardize the street type
          result.street_type = streetTypeStandardMap[matchedType] || matchedType;
        } else {
          result.street_name = streetPart;
        }
      }
    }
    
    if (parts.length >= 2) {
      // Parse suburb from second part, but make sure it's not a unit remnant
      let suburbPart = parts[1].trim();
      
      // Check if this looks like a unit number that wasn't caught earlier
      // Patterns like "Unit 2", "Apt 5", etc. should not be treated as suburbs
      const unitRemnantPattern = /^(Unit|Apt|Apartment|Shop|Suite|Level|Floor)\s+\w+$/i;
      if (unitRemnantPattern.test(suburbPart)) {
        // This is actually a unit number, not a suburb
        const unitMatch = suburbPart.match(/^(Unit|Apt|Apartment|Shop|Suite|Level|Floor)\s+(\w+)$/i);
        if (unitMatch && !result.unit_number) {
          result.unit_number = unitMatch[2];
        }
        
        // Look for suburb in the next part
        if (parts.length >= 3) {
          suburbPart = parts[2].trim();
        } else {
          suburbPart = ''; // No suburb available
        }
      }
      
      if (suburbPart) {
        // Extract postcode (4 digits at the end)
        const postcodeMatch = suburbPart.match(/^(.+?)\s+(\d{4})$/);
        
        if (postcodeMatch) {
          result.suburb = postcodeMatch[1].trim();
          result.postcode = postcodeMatch[2];
        } else {
          result.suburb = suburbPart;
        }
      }
    }
    
    // Extract postcode from any part of the address (look for 4-digit numbers)
    if (!result.postcode) {
      for (let i = 1; i < parts.length; i++) {
        const part = parts[i].trim();
        const postcodeMatch = part.match(/\b(\d{4})\b/);
        if (postcodeMatch) {
          result.postcode = postcodeMatch[1];
          
          // If this part contained a postcode, remove it and use the remaining text for suburb
          if (i === 1 && !result.suburb) {
            const suburbText = part.replace(/\b\d{4}\b/, '').trim();
            if (suburbText) {
              result.suburb = suburbText;
            }
          }
          break;
        }
      }
    }

    // If still no suburb and we have multiple parts, try to extract suburb better
    if (!result.suburb && parts.length >= 2) {
      // Take the second part and clean it up
      let suburbPart = parts[1].trim();
      
      // Remove state abbreviations (QLD, NSW, VIC, etc.)
      suburbPart = suburbPart.replace(/\b(QLD|NSW|VIC|SA|WA|TAS|NT|ACT)\b/gi, '').trim();
      
      // Remove postcodes
      suburbPart = suburbPart.replace(/\b\d{4}\b/, '').trim();
      
      // Remove extra commas and spaces
      suburbPart = suburbPart.replace(/^,+|,+$/g, '').trim();
      
      if (suburbPart) {
        result.suburb = suburbPart;
      }
    }

    // Clean all fields
    Object.keys(result).forEach(key => {
      result[key as keyof AddressComponents] = result[key as keyof AddressComponents].trim();
    });

    console.log('✅ Final parsed result:', result);
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