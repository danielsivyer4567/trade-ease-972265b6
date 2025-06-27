interface PropertyMeasurementRequest {
  street_number: string;
  street_name: string;
  street_type: string;
  suburb: string;
  postcode: string;
}

interface PropertyMeasurementResponse {
  success: boolean;
  data?: any;
  error?: string;
}

export class PropertyMeasurementService {
  private static readonly API_URL = 'https://property-measurement-47233712259.australia-southeast1.run.app/visualize';
  private static readonly API_KEY = '5a218f5e-58cf-4dd9-ad40-ed1d90ce4fc7';
  private static readonly CORS_PROXY = 'https://cors-anywhere.herokuapp.com/';
  private static readonly CORS_PROXY_ALT = 'https://api.allorigins.win/get?url=';
  private static readonly CORS_PROXY_ALT2 = 'https://thingproxy.freeboard.io/fetch/';
  private static readonly SUPABASE_FUNCTION = '/functions/v1/property-measurement';

  static async getPropertyMeasurementWithProxy(data: PropertyMeasurementRequest, useProxy: boolean = false): Promise<PropertyMeasurementResponse> {
    const url = useProxy ? `${this.CORS_PROXY}${this.API_URL}` : this.API_URL;
    console.log(`PropertyMeasurementService: Using ${useProxy ? 'CORS proxy' : 'direct'} URL:`, url);
    
    return this.makeRequest(data, url, useProxy);
  }

  static async getPropertyMeasurementViaSupabase(data: PropertyMeasurementRequest): Promise<PropertyMeasurementResponse> {
    try {
      console.log('PropertyMeasurementService: Using Supabase function...');
      
      // Call the Supabase function directly
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      
      if (!supabaseUrl) {
        return {
          success: false,
          error: 'Supabase URL not configured'
        };
      }

      const response = await fetch(`${supabaseUrl}/functions/v1/property-measurement`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      console.log('PropertyMeasurementService: Supabase function response status:', response.status);

      const result = await response.json();
      console.log('PropertyMeasurementService: Supabase function result:', result);

      return result;
    } catch (error) {
      console.error('PropertyMeasurementService: Supabase function error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Supabase function failed'
      };
    }
  }

  static async getPropertyMeasurementFast(data: PropertyMeasurementRequest): Promise<PropertyMeasurementResponse> {
    // Fast mode: Try multiple proxy methods quickly
    console.log('PropertyMeasurementService: Trying fast mode with multiple proxies...');
    
    const tryProxy = async (proxyUrl: string, timeout: number = 8000) => {
      return Promise.race([
        this.makeRequest(data, proxyUrl, true),
        new Promise<PropertyMeasurementResponse>((_, reject) => 
          setTimeout(() => reject(new Error(`Proxy timeout (${timeout/1000}s)`)), timeout)
        )
      ]);
    };

    // Try proxies in order of speed/reliability
    const proxiesToTry = [
      { url: `${this.CORS_PROXY_ALT2}${this.API_URL}`, name: 'ThingProxy', timeout: 8000 },
      { url: `${this.CORS_PROXY}${this.API_URL}`, name: 'CORS-Anywhere', timeout: 10000 }
    ];

    for (const proxy of proxiesToTry) {
      try {
        console.log(`PropertyMeasurementService: Trying ${proxy.name}...`);
        const result = await tryProxy(proxy.url, proxy.timeout);
        if (result.success) {
          console.log(`PropertyMeasurementService: ${proxy.name} succeeded!`);
          return result;
        }
      } catch (error) {
        console.log(`PropertyMeasurementService: ${proxy.name} failed:`, error instanceof Error ? error.message : 'Unknown error');
        continue;
      }
    }

    throw new Error('All fast mode proxies failed. Try the regular mode or enable CORS proxy access.');
  }

  static async getPropertyMeasurement(data: PropertyMeasurementRequest): Promise<PropertyMeasurementResponse> {
    // Try Supabase function first (fastest when available), then CORS proxies as fallback
    try {
      console.log('PropertyMeasurementService: Attempting Supabase function...');
      const supabaseResult = await Promise.race([
        this.getPropertyMeasurementViaSupabase(data),
        new Promise<PropertyMeasurementResponse>((_, reject) => 
          setTimeout(() => reject(new Error('Supabase function timeout')), 3000)
        )
      ]);
      
      if (supabaseResult.success) {
        return supabaseResult;
      }
      console.log('PropertyMeasurementService: Supabase function failed, trying CORS proxy...');
    } catch (error) {
      console.log('PropertyMeasurementService: Supabase function error/timeout, trying CORS proxy...');
    }

    // Fallback to CORS proxy methods with timeout
    try {
      console.log('PropertyMeasurementService: Trying CORS proxy with timeout...');
      return await Promise.race([
        this.makeRequest(data, `${this.CORS_PROXY}${this.API_URL}`, true),
        new Promise<PropertyMeasurementResponse>((_, reject) => 
          setTimeout(() => reject(new Error('CORS proxy timeout')), 15000)
        )
      ]);
    } catch (proxyError) {
      console.log('PropertyMeasurementService: CORS proxy failed/timeout, trying alternative proxy...');
      try {
        return await Promise.race([
          this.makeRequest(data, `${this.CORS_PROXY_ALT}${encodeURIComponent(this.API_URL)}`, true, true),
          new Promise<PropertyMeasurementResponse>((_, reject) => 
            setTimeout(() => reject(new Error('Alternative proxy timeout')), 15000)
          )
        ]);
      } catch (altProxyError) {
        return {
          success: false,
          error: `All methods failed or timed out. This service can be slow due to CORS proxy overhead. Consider deploying the Supabase function for faster results.`
        };
      }
    }
  }

  private static async makeRequest(data: PropertyMeasurementRequest, url: string, isProxy: boolean = false, isAltProxy: boolean = false): Promise<PropertyMeasurementResponse> {
    try {
      console.log('PropertyMeasurementService: Making API call with data:', data);
      console.log('PropertyMeasurementService: Using URL:', url);

      // Validate required fields
      if (!data.street_number || !data.street_name || !data.street_type || !data.suburb || !data.postcode) {
        return {
          success: false,
          error: 'All property fields are required'
        };
      }

      const requestBody = {
        street_number: data.street_number.toString(),
        street_name: data.street_name.toString(),
        street_type: data.street_type.toString(),
        suburb: data.suburb.toString(),
        postcode: data.postcode.toString()
      };

      console.log('PropertyMeasurementService: Sending request...');

      // Prepare headers - different proxies need different handling
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };

      // Handle different proxy types
      if (url.includes('thingproxy.freeboard.io')) {
        // ThingProxy: Simple proxy, pass auth in headers
        headers['Authorization'] = `Bearer ${this.API_KEY}`;
      } else if (!isAltProxy) {
        // Most proxies and direct calls need the auth header
        headers['Authorization'] = `Bearer ${this.API_KEY}`;
      }

      if (isProxy) {
        // Some CORS proxies need this
        headers['X-Requested-With'] = 'XMLHttpRequest';
      }

      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: isAltProxy && !url.includes('thingproxy.freeboard.io') ? JSON.stringify({
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(requestBody)
        }) : JSON.stringify(requestBody)
      });

      console.log('PropertyMeasurementService: Response status:', response.status);
      console.log('PropertyMeasurementService: Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.error('PropertyMeasurementService: External API error:', errorText);
        return {
          success: false,
          error: `External API error: ${response.status} - ${errorText}`
        };
      }

      // Check content length
      const contentLength = response.headers.get('content-length');
      console.log('PropertyMeasurementService: Content-Length:', contentLength);

      let responseData = '';
      try {
        responseData = await response.text();
        console.log('PropertyMeasurementService: Raw response:', responseData);
        console.log('PropertyMeasurementService: Response length:', responseData.length);
      } catch (error) {
        console.error('PropertyMeasurementService: Failed to read response text:', error);
        return {
          success: false,
          error: 'Failed to read API response'
        };
      }

      // Handle empty response
      if (!responseData || responseData.trim() === '') {
        console.log('PropertyMeasurementService: Empty response received');
        return {
          success: true,
          data: 'Empty response received from external API'
        };
      }

      // Try to parse as JSON, if it fails return as text
      try {
        const jsonData = JSON.parse(responseData);
        console.log('PropertyMeasurementService: Successfully parsed JSON response');
        return {
          success: true,
          data: jsonData
        };
      } catch (parseError) {
        console.log('PropertyMeasurementService: Response is not JSON, returning as text:', parseError);
        return {
          success: true,
          data: responseData
        };
      }

    } catch (error) {
      console.error('PropertyMeasurementService: Service error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown service error'
      };
    }
  }
} 