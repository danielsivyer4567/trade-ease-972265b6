export const geocodingService = {
  async geocodeAddress(address: string): Promise<[number, number]> {

    const apiKey = process.env.VITE_GOOGLE_MAPS_API_KEY;
   
    const encodedAddress = encodeURIComponent(address);
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${apiKey}`
    );
    const data = await response.json();

    if (data.status === "OK" && data.results.length > 0) {
      const { lat, lng } = data.results[0].geometry.location;
      return [lng, lat]; // [longitude, latitude]
    } else {
      throw new Error("Failed to geocode address");
    }
  },
};
