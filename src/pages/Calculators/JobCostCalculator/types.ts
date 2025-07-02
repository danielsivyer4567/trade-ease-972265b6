// Types for the Advanced Job Cost Estimator

export interface MaterialItem {
  id: string;
  category: string;
  name: string;
  unit: string;
  quantity: number;
  unitCost: number;
  markup: number;
  wasteFactor: number;
  supplier?: string;
  leadTime?: number;
  notes?: string;
  alternativeOptions?: AlternativeMaterial[];
}

export interface AlternativeMaterial {
  name: string;
  unitCost: number;
  supplier: string;
  qualityRating: number;
}

export interface LaborItem {
  id: string;
  trade: string;
  description: string;
  workers: number;
  hours: number;
  rate: number;
  overtime: number;
  productivity: number;
  skillLevel: 'apprentice' | 'journeyman' | 'master';
  certification?: string;
}

export interface EquipmentItem {
  id: string;
  name: string;
  type: 'owned' | 'rented' | 'leased';
  dailyRate: number;
  days: number;
  mobilization: number;
  demobilization: number;
  operator: boolean;
  operatorRate?: number;
  fuelCost?: number;
  maintenanceCost?: number;
}

export interface SubcontractorItem {
  id: string;
  trade: string;
  scope: string;
  amount: number;
  retention: number;
  insurance: boolean;
  bonded: boolean;
  previousPerformance?: number;
  alternativeBids?: SubcontractorBid[];
}

export interface SubcontractorBid {
  company: string;
  amount: number;
  rating: number;
  completedProjects: number;
}

export interface OverheadItem {
  id: string;
  category: string;
  description: string;
  amount: number;
  allocation: 'fixed' | 'percentage';
  percentage?: number;
}

export interface RiskItem {
  id: string;
  category: string;
  description: string;
  probability: number;
  impact: number;
  mitigation: string;
  contingency: number;
}

export interface ProjectPhase {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  materials: MaterialItem[];
  labor: LaborItem[];
  equipment: EquipmentItem[];
  subcontractors: SubcontractorItem[];
  dependencies?: string[];
  criticalPath: boolean;
}

export interface CostBreakdown {
  materials: number;
  labor: number;
  equipment: number;
  subcontractors: number;
  overhead: number;
  contingency: number;
  profit: number;
  total: number;
  perSquareFoot?: number;
  perUnit?: number;
}

export interface ProjectDetails {
  name: string;
  client: string;
  location: string;
  type: string;
  size: number;
  sizeUnit: string;
  startDate: Date;
  duration: number;
  complexity: 'low' | 'medium' | 'high';
  weatherRisk: boolean;
  siteConditions: string;
  accessRestrictions?: string;
  workingHours?: string;
  unionRequirements?: boolean;
}

export interface UnionCostItem {
  id: string;
  category: 'wages' | 'benefits' | 'training' | 'compliance' | 'overtime' | 'administrative';
  type: string;
  description: string;
  rate: number;
  unit: string;
  quantity: number;
  total: number;
  isPercentage: boolean;
}

export interface UnionRequirement {
  isRequired: boolean;
  localNumber?: string;
  trade?: string;
  cbaReference?: string;
  specialRequirements?: string;
  costItems: UnionCostItem[];
}

export interface EstimateSettings {
  defaultMarkup: number;
  defaultWasteFactor: number;
  defaultOverhead: number;
  defaultProfit: number;
  defaultContingency: number;
  taxRate: number;
  roundTotals: boolean;
  includeMarketConditions: boolean;
  companyName?: string;
  licenseNumber?: string;
  phone?: string;
  email?: string;
  address?: string;
  includeLogo?: boolean;
  autoSave?: boolean;
  estimateTerms?: string;
  paymentTerms?: string;
  validityPeriod?: number;
  includeWarranty?: boolean;
  warrantyPeriod?: string;
  warrantyCoverage?: string;
  warrantyExclusions?: string;
  warrantyContact?: string;
  showDetailedBreakdown?: boolean;
}

export interface HistoricalData {
  projectType: string;
  avgCostPerSqFt: number;
  avgDuration: number;
  commonRisks: string[];
  typicalMarkup: number;
}

export interface MarketCondition {
  material: string;
  priceChange: number;
  volatility: 'low' | 'medium' | 'high';
  forecast: 'increasing' | 'stable' | 'decreasing';
}

export interface CostDatabase {
  materials: Record<string, MaterialPricing>;
  labor: Record<string, LaborRate>;
  equipment: Record<string, EquipmentRate>;
  location: string;
  lastUpdated: Date;
}

export interface MaterialPricing {
  name: string;
  unit: string;
  basePrice: number;
  priceHistory: PricePoint[];
  suppliers: string[];
  leadTime: number;
}

export interface LaborRate {
  trade: string;
  baseRate: number;
  overtimeRate: number;
  benefits: number;
  unionRate?: number;
}

export interface EquipmentRate {
  name: string;
  dailyRate: number;
  weeklyRate: number;
  monthlyRate: number;
  mobilization: number;
}

export interface PricePoint {
  date: Date;
  price: number;
  source: string;
}

export interface EstimateComparison {
  estimated: CostBreakdown;
  actual?: CostBreakdown;
  variance?: number;
  reasons?: string[];
}

export interface AIRecommendation {
  category: string;
  suggestion: string;
  potentialSaving: number;
  confidence: number;
  basedOn: string;
} 