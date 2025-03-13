
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
