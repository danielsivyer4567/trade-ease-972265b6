// Google Maps Script Loader with performance optimizations
interface GoogleMapsLoaderOptions {
  apiKey: string;
  libraries?: string[];
  language?: string;
  region?: string;
  version?: string;
}

class GoogleMapsLoader {
  private static instance: GoogleMapsLoader;
  private loadPromise: Promise<void> | null = null;
  private isLoaded = false;
  private apiKey: string | null = null;

  private constructor() {}

  static getInstance(): GoogleMapsLoader {
    if (!GoogleMapsLoader.instance) {
      GoogleMapsLoader.instance = new GoogleMapsLoader();
    }
    return GoogleMapsLoader.instance;
  }

  // Check if Google Maps is already loaded
  isGoogleMapsLoaded(): boolean {
    return !!(window.google && window.google.maps);
  }

  // Load Google Maps script with caching
  async load(options: GoogleMapsLoaderOptions): Promise<void> {
    // If already loaded with same API key, return immediately
    if (this.isLoaded && this.apiKey === options.apiKey && this.isGoogleMapsLoaded()) {
      return Promise.resolve();
    }

    // If currently loading, return the existing promise
    if (this.loadPromise) {
      return this.loadPromise;
    }

    // Store the API key
    this.apiKey = options.apiKey;

    // Create the loading promise
    this.loadPromise = new Promise<void>((resolve, reject) => {
      // Check if already loaded
      if (this.isGoogleMapsLoaded()) {
        this.isLoaded = true;
        resolve();
        return;
      }

      // Create script URL with parameters
      const params = new URLSearchParams({
        key: options.apiKey,
        callback: '__googleMapsCallback',
        ...(options.libraries && { libraries: options.libraries.join(',') }),
        ...(options.language && { language: options.language }),
        ...(options.region && { region: options.region }),
        ...(options.version && { v: options.version }),
      });

      const scriptUrl = `https://maps.googleapis.com/maps/api/js?${params.toString()}`;

      // Check if script already exists
      const existingScript = document.querySelector(`script[src*="maps.googleapis.com"]`);
      if (existingScript) {
        // Wait for existing script to load
        const checkLoaded = setInterval(() => {
          if (this.isGoogleMapsLoaded()) {
            clearInterval(checkLoaded);
            this.isLoaded = true;
            resolve();
          }
        }, 100);

        // Timeout after 10 seconds
        setTimeout(() => {
          clearInterval(checkLoaded);
          reject(new Error('Timeout waiting for existing Google Maps script'));
        }, 10000);
        return;
      }

      // Create and append script
      const script = document.createElement('script');
      script.src = scriptUrl;
      script.async = true;
      script.defer = true;
      script.type = 'text/javascript';

      // Set up global callback
      (window as any).__googleMapsCallback = () => {
        this.isLoaded = true;
        delete (window as any).__googleMapsCallback;
        resolve();
      };

      // Handle errors
      script.onerror = () => {
        this.loadPromise = null;
        delete (window as any).__googleMapsCallback;
        reject(new Error('Failed to load Google Maps script'));
      };

      // Append script to head
      document.head.appendChild(script);
    });

    return this.loadPromise;
  }

  // Unload Google Maps (for cleanup)
  unload(): void {
    const script = document.querySelector(`script[src*="maps.googleapis.com"]`);
    if (script) {
      script.remove();
    }
    this.isLoaded = false;
    this.loadPromise = null;
    this.apiKey = null;
  }

  // Get the current API key
  getApiKey(): string | null {
    return this.apiKey;
  }
}

// Export singleton instance
export const googleMapsLoader = GoogleMapsLoader.getInstance();

// Helper function for easy loading
export async function loadGoogleMaps(apiKey: string, libraries: string[] = ['marker', 'geometry', 'drawing']): Promise<void> {
  return googleMapsLoader.load({
    apiKey,
    libraries,
    version: 'weekly',
  });
} 