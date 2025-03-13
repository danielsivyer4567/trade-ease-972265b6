
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
    "10mm": {"450mm": 1.8, "600mm": 1.5},
    "12mm": {"450mm": 2.0, "600mm": 1.8},
  },
};

// Material grades
export const MATERIAL_GRADES = {
  "Timber": ["MGP10", "MGP12"],
  "James Hardie": ["10mm", "12mm"],
};

// Material dimensions
export const MATERIAL_DIMENSIONS = {
  "Timber": {
    "MGP10": ["140x45", "190x45"],
    "MGP12": ["140x45", "190x45"],
  },
  "James Hardie": {
    "10mm": ["450mm", "600mm"],
    "12mm": ["450mm", "600mm"],
  },
};

// Joist spacings
export const JOIST_SPACINGS = ["450mm", "600mm"];

// Span types
export const SPAN_TYPES = ["Single span", "Continuous span", "Cantilever"];

// James Hardie product types
export const HARDIE_PRODUCT_TYPES = [
  { name: "HardiePlank®", premium: false, weatherResistant: true },
  { name: "HardiePanel®", premium: false, weatherResistant: true },
  { name: "HardieBoard®", premium: true, weatherResistant: true },
  { name: "HardieBacker®", premium: true, weatherResistant: false },
  { name: "HardieZone®", premium: true, weatherResistant: true },
];

// James Hardie thickness options
export const HARDIE_THICKNESSES = [
  "6mm",
  "8mm",
  "9mm",
  "12mm",
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
