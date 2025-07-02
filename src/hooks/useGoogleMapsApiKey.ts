import { useState, useEffect } from "react";

export function useGoogleMapsApiKey() {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const key = process.env.VITE_GOOGLE_MAPS_API_KEY;
      if (!key) {
        setError("Missing Google Maps API key in environment variables.");
      } else {
        setApiKey(key);
      }
    } catch (err) {
      setError("Failed to load API key.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { apiKey, isLoading, error };
}
