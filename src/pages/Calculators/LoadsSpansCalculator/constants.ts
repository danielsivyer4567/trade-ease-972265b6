
// Wood types with their properties
export const WOOD_TYPES = [
  { name: "Pine", strengthFactor: 1.0, densityFactor: 0.9 },
  { name: "Oak", strengthFactor: 1.5, densityFactor: 1.3 },
  { name: "Hardwood", strengthFactor: 1.3, densityFactor: 1.2 },
  { name: "Softwood", strengthFactor: 0.8, densityFactor: 0.8 },
  { name: "Cedar", strengthFactor: 0.7, densityFactor: 0.7 },
];

// Load types with their multipliers
export const LOAD_TYPES = [
  { name: "Residential - Light", factor: 1.0 },
  { name: "Residential - Heavy", factor: 1.5 },
  { name: "Commercial", factor: 2.0 },
  { name: "Industrial", factor: 2.5 },
];

// Span table data converted from the Python example
export const SPAN_TABLE = {
  "Timber": {
    "MGP10": {
      "140x45": {"450mm": 2.7, "600mm": 2.4},
      "190x45": {"450mm": 3.2, "600mm": 2.8},
    },
    "MGP12": {
      "140x45": {"450mm": 3.0, "600mm": 2.6},
      "190x45": {"450mm": 3.5, "600mm": 3.0},
    },
  },
  "James Hardie": {
    "6mm": {"450mm": 1.5, "600mm": 1.2},
    "9mm": {"450mm": 1.7, "600mm": 1.4},
    "10mm": {"450mm": 1.8, "600mm": 1.5},
    "12mm": {"450mm": 2.0, "600mm": 1.8},
    "16mm": {"450mm": 2.4, "600mm": 2.0},
    "18mm": {"450mm": 2.7, "600mm": 2.3},
  },
};

// Material grades
export const MATERIAL_GRADES = {
  "Timber": ["MGP10", "MGP12"],
  "James Hardie": ["6mm", "9mm", "10mm", "12mm", "16mm", "18mm"],
};

// Material dimensions
export const MATERIAL_DIMENSIONS = {
  "Timber": {
    "MGP10": ["140x45", "190x45"],
    "MGP12": ["140x45", "190x45"],
  },
  "James Hardie": {
    "6mm": ["450mm", "600mm"],
    "9mm": ["450mm", "600mm"],
    "10mm": ["450mm", "600mm"],
    "12mm": ["450mm", "600mm"],
    "16mm": ["450mm", "600mm"],
    "18mm": ["450mm", "600mm"],
  },
};

// Joist spacings
export const JOIST_SPACINGS = ["450mm", "600mm"];

// Span types
export const SPAN_TYPES = ["Single span", "Continuous span", "Cantilever"];

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

// Wind load zones based on Australian Standards
export const WIND_LOAD_CATEGORIES = [
  { name: "N1", kPa: 0.5, description: "Protected suburban areas" },
  { name: "N2", kPa: 1.0, description: "Normal suburban areas" },
  { name: "N3", kPa: 1.5, description: "Open terrain, near coast" },
  { name: "N4", kPa: 2.1, description: "Coastal areas" },
  { name: "N5", kPa: 2.7, description: "Severe coastal areas" },
  { name: "N6", kPa: 3.5, description: "Cyclonic areas" },
  { name: "C1", kPa: 4.2, description: "Cyclonic region C - light" },
  { name: "C2", kPa: 5.0, description: "Cyclonic region C - medium" },
  { name: "C3", kPa: 6.0, description: "Cyclonic region C - severe" },
  { name: "C4", kPa: 7.0, description: "Cyclonic region C - very severe" }
];
