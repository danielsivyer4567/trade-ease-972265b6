export const materialCategories = [
  'Concrete & Masonry',
  'Steel & Metal',
  'Lumber & Wood',
  'Roofing',
  'Insulation',
  'Drywall & Finishes',
  'Flooring',
  'Plumbing',
  'Electrical',
  'HVAC',
  'Doors & Windows',
  'Site Work'
];

export const commonMaterials = {
  'Concrete & Masonry': [
    { name: 'Concrete 3000 PSI', unit: 'CY', basePrice: 125, wasteFactor: 5 },
    { name: 'Concrete 4000 PSI', unit: 'CY', basePrice: 135, wasteFactor: 5 },
    { name: 'Rebar #4', unit: 'LF', basePrice: 0.75, wasteFactor: 3 },
    { name: 'Rebar #5', unit: 'LF', basePrice: 1.10, wasteFactor: 3 },
    { name: 'CMU Block 8"', unit: 'EA', basePrice: 1.85, wasteFactor: 5 },
    { name: 'Mortar Type S', unit: 'BAG', basePrice: 12.50, wasteFactor: 10 },
  ],
  'Steel & Metal': [
    { name: 'Steel Beam W8x24', unit: 'LF', basePrice: 45, wasteFactor: 2 },
    { name: 'Steel Column HSS 4x4', unit: 'LF', basePrice: 28, wasteFactor: 2 },
    { name: 'Metal Decking 20GA', unit: 'SF', basePrice: 3.25, wasteFactor: 5 },
    { name: 'Steel Studs 20GA 6"', unit: 'LF', basePrice: 2.85, wasteFactor: 10 },
  ],
  'Lumber & Wood': [
    { name: '2x4 SPF Stud', unit: 'LF', basePrice: 0.65, wasteFactor: 10 },
    { name: '2x6 SPF', unit: 'LF', basePrice: 0.95, wasteFactor: 10 },
    { name: '2x10 SPF', unit: 'LF', basePrice: 1.85, wasteFactor: 10 },
    { name: 'OSB 7/16"', unit: 'SF', basePrice: 0.75, wasteFactor: 8 },
    { name: 'Plywood 3/4" CDX', unit: 'SF', basePrice: 1.25, wasteFactor: 8 },
  ],
  'Roofing': [
    { name: 'Asphalt Shingles 30yr', unit: 'SQ', basePrice: 95, wasteFactor: 10 },
    { name: 'TPO Membrane 60mil', unit: 'SF', basePrice: 1.85, wasteFactor: 10 },
    { name: 'Metal Roofing Standing Seam', unit: 'SF', basePrice: 4.50, wasteFactor: 5 },
    { name: 'Roofing Felt 15#', unit: 'SQ', basePrice: 25, wasteFactor: 10 },
  ],
  'Insulation': [
    { name: 'Batt Insulation R-13', unit: 'SF', basePrice: 0.55, wasteFactor: 5 },
    { name: 'Batt Insulation R-19', unit: 'SF', basePrice: 0.75, wasteFactor: 5 },
    { name: 'Spray Foam Closed Cell', unit: 'SF', basePrice: 1.25, wasteFactor: 15 },
    { name: 'Rigid Insulation 2"', unit: 'SF', basePrice: 1.35, wasteFactor: 5 },
  ],
  'Drywall & Finishes': [
    { name: 'Drywall 1/2"', unit: 'SF', basePrice: 0.45, wasteFactor: 10 },
    { name: 'Drywall 5/8" Type X', unit: 'SF', basePrice: 0.55, wasteFactor: 10 },
    { name: 'Joint Compound', unit: 'GAL', basePrice: 15, wasteFactor: 20 },
    { name: 'Paint Interior', unit: 'GAL', basePrice: 35, wasteFactor: 10 },
  ]
};

export const laborTrades = [
  'Carpenter',
  'Electrician',
  'Plumber',
  'Mason',
  'Concrete Finisher',
  'Painter',
  'Roofer',
  'HVAC Technician',
  'Drywall Installer',
  'Flooring Installer',
  'Foreman',
  'General Laborer',
  'Equipment Operator',
  'Welder',
  'Glazier'
];

export const laborRates = {
  'Carpenter': { apprentice: 25, journeyman: 35, master: 45 },
  'Electrician': { apprentice: 28, journeyman: 38, master: 50 },
  'Plumber': { apprentice: 27, journeyman: 37, master: 48 },
  'Mason': { apprentice: 26, journeyman: 36, master: 46 },
  'Concrete Finisher': { apprentice: 28, journeyman: 38, master: 48 },
  'Painter': { apprentice: 22, journeyman: 30, master: 40 },
  'Roofer': { apprentice: 24, journeyman: 32, master: 42 },
  'HVAC Technician': { apprentice: 30, journeyman: 40, master: 52 },
  'Drywall Installer': { apprentice: 23, journeyman: 31, master: 41 },
  'Flooring Installer': { apprentice: 24, journeyman: 33, master: 43 },
  'Foreman': { apprentice: 35, journeyman: 45, master: 55 },
  'General Laborer': { apprentice: 18, journeyman: 22, master: 28 },
  'Equipment Operator': { apprentice: 30, journeyman: 40, master: 50 },
  'Welder': { apprentice: 28, journeyman: 38, master: 50 },
  'Glazier': { apprentice: 26, journeyman: 35, master: 45 }
};

export const equipmentTypes = [
  { name: 'Excavator 20T', dailyRate: 850, operatorRate: 45 },
  { name: 'Excavator 30T', dailyRate: 1200, operatorRate: 45 },
  { name: 'Bulldozer D6', dailyRate: 1000, operatorRate: 50 },
  { name: 'Loader 3CY', dailyRate: 650, operatorRate: 40 },
  { name: 'Backhoe', dailyRate: 450, operatorRate: 40 },
  { name: 'Concrete Pump', dailyRate: 1200, operatorRate: 50 },
  { name: 'Crane 50T', dailyRate: 2000, operatorRate: 60 },
  { name: 'Forklift 5000lb', dailyRate: 350, operatorRate: 35 },
  { name: 'Scissor Lift', dailyRate: 250, operatorRate: 0 },
  { name: 'Boom Lift 60ft', dailyRate: 450, operatorRate: 0 },
  { name: 'Compactor', dailyRate: 300, operatorRate: 35 },
  { name: 'Generator 100kW', dailyRate: 200, operatorRate: 0 },
  { name: 'Concrete Mixer', dailyRate: 150, operatorRate: 0 },
  { name: 'Dump Truck', dailyRate: 600, operatorRate: 40 }
];

export const overheadCategories = [
  { name: 'Project Management', type: 'percentage', default: 8 },
  { name: 'Site Supervision', type: 'percentage', default: 5 },
  { name: 'Office Overhead', type: 'percentage', default: 3 },
  { name: 'Insurance & Bonds', type: 'percentage', default: 2.5 },
  { name: 'Permits & Fees', type: 'fixed', default: 5000 },
  { name: 'Temporary Facilities', type: 'fixed', default: 8000 },
  { name: 'Safety Equipment', type: 'fixed', default: 3000 },
  { name: 'Quality Control', type: 'percentage', default: 1.5 },
  { name: 'Small Tools', type: 'percentage', default: 2 },
  { name: 'Mobilization', type: 'fixed', default: 10000 },
  { name: 'Demobilization', type: 'fixed', default: 8000 },
  { name: 'Warranty Reserve', type: 'percentage', default: 1 }
];

export const riskCategories = [
  { 
    name: 'Weather Delays', 
    probability: 30, 
    impact: 15000, 
    mitigation: 'Monitor weather forecasts, schedule weather-sensitive work appropriately' 
  },
  { 
    name: 'Material Price Escalation', 
    probability: 25, 
    impact: 10000, 
    mitigation: 'Lock in prices early, include escalation clauses in contracts' 
  },
  { 
    name: 'Labor Shortage', 
    probability: 20, 
    impact: 20000, 
    mitigation: 'Maintain relationships with multiple subcontractors, plan ahead' 
  },
  { 
    name: 'Site Conditions', 
    probability: 35, 
    impact: 25000, 
    mitigation: 'Conduct thorough site investigation, include contingency' 
  },
  { 
    name: 'Design Changes', 
    probability: 40, 
    impact: 30000, 
    mitigation: 'Lock in design early, clear change order process' 
  },
  { 
    name: 'Permit Delays', 
    probability: 15, 
    impact: 12000, 
    mitigation: 'Submit permits early, maintain good relationships with authorities' 
  },
  { 
    name: 'Equipment Breakdown', 
    probability: 10, 
    impact: 8000, 
    mitigation: 'Regular maintenance, backup equipment availability' 
  },
  { 
    name: 'Subcontractor Default', 
    probability: 5, 
    impact: 50000, 
    mitigation: 'Verify insurance and bonding, maintain backup contractors' 
  },
  { 
    name: 'Safety Incident', 
    probability: 10, 
    impact: 40000, 
    mitigation: 'Strict safety protocols, regular training, proper insurance' 
  },
  { 
    name: 'Environmental Issues', 
    probability: 15, 
    impact: 20000, 
    mitigation: 'Environmental assessment, proper permits, containment plans' 
  }
]; 