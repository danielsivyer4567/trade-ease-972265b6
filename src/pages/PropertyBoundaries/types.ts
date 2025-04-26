
export interface Property {
  id: string;
  name: string;
  description: string;
  location: [number, number]; // [latitude, longitude]
  boundaries: Array<Array<[number, number]>>; // array of boundary coordinates
  address?: string; // Optional address field for searching
}
