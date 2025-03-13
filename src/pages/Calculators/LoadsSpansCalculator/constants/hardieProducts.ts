
// James Hardie product types with detailed properties
export const HARDIE_PRODUCT_TYPES = [
  { 
    name: "HardiePlank®", 
    premium: false, 
    weatherResistant: true,
    description: "Exterior cladding solution with horizontal weatherboard look",
    applications: ["Exterior Cladding"],
    fireRating: "Non-combustible, meets AS 1530.1"
  },
  { 
    name: "HardiePanel®", 
    premium: false, 
    weatherResistant: true,
    description: "Versatile panel for both interior and exterior applications",
    applications: ["Exterior Cladding", "Interior Lining"],
    fireRating: "Non-combustible, meets AS 1530.1"
  },
  { 
    name: "HardieFlex®", 
    premium: false, 
    weatherResistant: true,
    description: "Flexible sheet for interior wall and ceiling lining",
    applications: ["Interior Lining", "Wet Areas"],
    fireRating: "Non-combustible, meets AS 1530.1"
  },
  { 
    name: "HardieFloor®", 
    premium: true, 
    weatherResistant: false,
    description: "Durable flooring substrate for tile, vinyl and carpet applications",
    applications: ["Flooring"],
    fireRating: "Non-combustible, meets AS 1530.1",
    loadBearing: "Up to 3.0 kPa (commercial)"
  },
  { 
    name: "HardieGroove®", 
    premium: true, 
    weatherResistant: true,
    description: "Vertical groove lining for feature walls and ceilings",
    applications: ["Exterior Cladding", "Interior Lining"],
    fireRating: "Non-combustible, meets AS 1530.1"
  },
];

// James Hardie thickness options
export const HARDIE_THICKNESSES = [
  "6mm",
  "7.5mm",
  "9mm",
  "10mm",
  "12mm",
  "16mm",
  "18mm"
];

// James Hardie application areas
export const HARDIE_APPLICATION_AREAS = [
  "Exterior Wall",
  "Interior Wall",
  "Wet Areas",
  "Flooring",
  "Ceiling"
];

// James Hardie technical properties
export const HARDIE_TECHNICAL_PROPERTIES = {
  density: 1.3, // g/cm³
  thermalConductivity: 0.15, // m²·K/W
  soundReduction: {
    "6mm": 25,   // dB (STC rating)
    "9mm": 30,
    "12mm": 35,
    "16mm": 40,
    "18mm": 45
  },
  // Load capacity in kPa based on thickness and application
  loadCapacity: {
    "Flooring": {
      "16mm": 2.0, // kPa
      "18mm": 3.0
    },
    "Wall": {
      "6mm": 0.5,
      "9mm": 0.8,
      "12mm": 1.2
    }
  },
  // Bushfire rating by thickness
  bushfireRating: {
    "6mm": "BAL-12.5",
    "9mm": "BAL-29",
    "12mm": "BAL-40",
    "16mm": "BAL-FZ",
    "18mm": "BAL-FZ"
  }
};

// James Hardie recommended fastener types based on application
export const HARDIE_FASTENER_TYPES = [
  {
    name: "Galvanized Nails",
    applications: ["Exterior Wall", "Interior Wall"],
    minLength: 30, // mm
    corrosionResistance: "Medium"
  },
  {
    name: "Stainless Steel Nails",
    applications: ["Wet Areas", "Exterior Wall", "Coastal Areas"],
    minLength: 30, // mm
    corrosionResistance: "High"
  },
  {
    name: "Countersunk Screws",
    applications: ["Flooring", "Wet Areas", "Interior Wall"],
    minLength: 40, // mm
    corrosionResistance: "Medium to High"
  },
  {
    name: "Stainless Steel Screws",
    applications: ["Wet Areas", "Exterior Wall", "Coastal Areas", "Flooring"],
    minLength: 40, // mm
    corrosionResistance: "Very High"
  }
];
