
// Type definition for a property
export interface Property {
  id: number;
  name: string;
  location: [number, number]; // Tuple type for location
  description: string;
  boundaries: Array<Array<[number, number]>>; // Correct type for boundaries
}

// Sample property boundaries data with correct typing
export const sampleProperties: Property[] = [
  {
    id: 1,
    name: "Residential Property",
    location: [151.209900, -33.865143],
    description: "Single family home with backyard",
    boundaries: [
      [
        [151.209300, -33.864743],
        [151.210300, -33.864843],
        [151.210400, -33.865443],
        [151.209400, -33.865543],
        [151.209300, -33.864743],
      ]
    ]
  },
  {
    id: 2,
    name: "Commercial Lot",
    location: [151.211000, -33.863000],
    description: "Commercial property with parking",
    boundaries: [
      [
        [151.210600, -33.862600],
        [151.211400, -33.862700],
        [151.211500, -33.863300],
        [151.210700, -33.863400],
        [151.210600, -33.862600],
      ]
    ]
  },
  {
    id: 3,
    name: "Construction Site",
    location: [151.208000, -33.866000],
    description: "New development project",
    boundaries: [
      [
        [151.207600, -33.865600],
        [151.208400, -33.865500],
        [151.208600, -33.866200],
        [151.207800, -33.866300],
        [151.207600, -33.865600],
      ]
    ]
  }
];
