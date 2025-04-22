export interface Property {
  id: string;
  name: string;
  description: string;
  location: [number, number]; // [latitude, longitude]
  boundaries: Array<Array<[number, number]>>; // array of boundary coordinates
  address?: string; // Optional address field for searching
  measurements?: {
    totalLength: number; // Total boundary length in meters
    segments: Array<{
      length: number; // Length of this segment in meters
      coordinates: [number, number][]; // Start and end coordinates of segment
    }>;
    area: number; // Area in square meters
  };
}
