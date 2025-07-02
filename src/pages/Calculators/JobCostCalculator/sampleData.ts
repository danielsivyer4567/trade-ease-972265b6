import { MaterialItem, LaborItem, EquipmentItem, SubcontractorItem, RiskItem } from './types';

export const sampleMaterials: MaterialItem[] = [
  {
    id: '1',
    category: 'Concrete & Masonry',
    name: 'Concrete 4000 PSI',
    unit: 'CY',
    quantity: 150,
    unitCost: 135,
    markup: 15,
    wasteFactor: 5,
    supplier: 'ABC Concrete Supply'
  },
  {
    id: '2',
    category: 'Steel & Metal',
    name: 'Rebar #5',
    unit: 'LF',
    quantity: 5000,
    unitCost: 1.10,
    markup: 12,
    wasteFactor: 3,
    supplier: 'Steel Solutions Inc'
  },
  {
    id: '3',
    category: 'Lumber & Wood',
    name: '2x4 SPF Stud',
    unit: 'LF',
    quantity: 3000,
    unitCost: 0.65,
    markup: 18,
    wasteFactor: 10,
    supplier: 'Lumber Depot'
  }
];

export const sampleLabor: LaborItem[] = [
  {
    id: '1',
    trade: 'Concrete Finisher',
    description: 'Foundation pour and finish',
    workers: 4,
    hours: 40,
    rate: 38,
    overtime: 10,
    productivity: 90,
    skillLevel: 'journeyman'
  },
  {
    id: '2',
    trade: 'Carpenter',
    description: 'Framing work',
    workers: 6,
    hours: 80,
    rate: 35,
    overtime: 15,
    productivity: 85,
    skillLevel: 'journeyman'
  },
  {
    id: '3',
    trade: 'Foreman',
    description: 'Site supervision',
    workers: 1,
    hours: 120,
    rate: 50,
    overtime: 0,
    productivity: 100,
    skillLevel: 'master'
  }
];

export const sampleEquipment: EquipmentItem[] = [
  {
    id: '1',
    name: 'Excavator 20T',
    type: 'rented',
    dailyRate: 850,
    days: 5,
    mobilization: 500,
    demobilization: 500,
    operator: true,
    operatorRate: 45,
    fuelCost: 150,
    maintenanceCost: 0
  },
  {
    id: '2',
    name: 'Concrete Pump',
    type: 'rented',
    dailyRate: 1200,
    days: 2,
    mobilization: 400,
    demobilization: 400,
    operator: true,
    operatorRate: 50,
    fuelCost: 100,
    maintenanceCost: 0
  }
];

export const sampleSubcontractors: SubcontractorItem[] = [
  {
    id: '1',
    trade: 'Electrical',
    scope: 'Complete electrical installation including panels, wiring, and fixtures',
    amount: 45000,
    retention: 10,
    insurance: true,
    bonded: true,
    previousPerformance: 4.5,
    alternativeBids: [
      {
        company: 'PowerTech Electric',
        amount: 48000,
        rating: 4.2,
        completedProjects: 15
      },
      {
        company: 'Bright Spark Electrical',
        amount: 43500,
        rating: 3.8,
        completedProjects: 8
      }
    ]
  },
  {
    id: '2',
    trade: 'Plumbing',
    scope: 'All plumbing rough-in and fixtures',
    amount: 32000,
    retention: 10,
    insurance: true,
    bonded: false,
    previousPerformance: 4.0,
    alternativeBids: []
  },
  {
    id: '3',
    trade: 'HVAC',
    scope: 'Complete HVAC system installation',
    amount: 55000,
    retention: 10,
    insurance: true,
    bonded: true,
    previousPerformance: 4.8,
    alternativeBids: []
  }
];

export const sampleRisks: RiskItem[] = [
  {
    id: '1',
    category: 'Weather Delays',
    description: 'Potential delays due to rainy season during foundation work',
    probability: 30,
    impact: 15000,
    mitigation: 'Schedule foundation work before rainy season, have weather contingency plan',
    contingency: 4500
  },
  {
    id: '2',
    category: 'Material Price Escalation',
    description: 'Steel prices showing volatility in current market',
    probability: 40,
    impact: 10000,
    mitigation: 'Lock in prices with supplier, include escalation clause in contract',
    contingency: 4000
  },
  {
    id: '3',
    category: 'Site Conditions',
    description: 'Unknown soil conditions may require additional excavation',
    probability: 20,
    impact: 25000,
    mitigation: 'Conduct thorough geotechnical investigation, budget for worst case',
    contingency: 5000
  }
]; 