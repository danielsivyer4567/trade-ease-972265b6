export const fetchLatLng = async (address: string): Promise<[number, number]> => {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
    );
    const json = await response.json();
  
    if (json.status !== "OK" || !json.results.length) {
      throw new Error("Failed to geocode address");
    }
  
    const { lat, lng } = json.results[0].geometry.location;
    return [lng, lat]; // Supabase stores [lng, lat]
  };
  