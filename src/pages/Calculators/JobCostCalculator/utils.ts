import {
  MaterialItem,
  LaborItem,
  EquipmentItem,
  SubcontractorItem,
  OverheadItem,
  RiskItem,
  CostBreakdown,
  ProjectPhase,
  EstimateSettings,
  MarketCondition,
  AIRecommendation
} from './types';

// Material cost calculations
export const calculateMaterialCost = (item: MaterialItem): number => {
  const baseCost = item.quantity * item.unitCost;
  const wasteAdjusted = baseCost * (1 + item.wasteFactor / 100);
  const withMarkup = wasteAdjusted * (1 + item.markup / 100);
  return withMarkup;
};

export const calculateMaterialsTotal = (materials: MaterialItem[]): number => {
  return materials.reduce((total, item) => total + calculateMaterialCost(item), 0);
};

// Labor cost calculations
export const calculateLaborCost = (item: LaborItem): number => {
  const regularHours = item.hours * (1 - item.overtime / 100);
  const overtimeHours = item.hours * (item.overtime / 100);
  const regularCost = regularHours * item.rate * item.workers;
  const overtimeCost = overtimeHours * item.rate * 1.5 * item.workers;
  const productivityAdjusted = (regularCost + overtimeCost) / (item.productivity / 100);
  return productivityAdjusted;
};

export const calculateLaborTotal = (labor: LaborItem[]): number => {
  return labor.reduce((total, item) => total + calculateLaborCost(item), 0);
};

// Equipment cost calculations
export const calculateEquipmentCost = (item: EquipmentItem): number => {
  let cost = item.dailyRate * item.days;
  cost += item.mobilization + item.demobilization;
  
  if (item.operator && item.operatorRate) {
    cost += item.operatorRate * item.days * 8; // 8 hours per day
  }
  
  if (item.fuelCost) {
    cost += item.fuelCost * item.days;
  }
  
  if (item.maintenanceCost) {
    cost += item.maintenanceCost;
  }
  
  return cost;
};

export const calculateEquipmentTotal = (equipment: EquipmentItem[]): number => {
  return equipment.reduce((total, item) => total + calculateEquipmentCost(item), 0);
};

// Subcontractor calculations
export const calculateSubcontractorCost = (item: SubcontractorItem): number => {
  return item.amount * (1 - item.retention / 100);
};

export const calculateSubcontractorsTotal = (subcontractors: SubcontractorItem[]): number => {
  return subcontractors.reduce((total, item) => total + calculateSubcontractorCost(item), 0);
};

// Overhead calculations
export const calculateOverheadTotal = (
  overhead: OverheadItem[],
  subtotal: number
): number => {
  return overhead.reduce((total, item) => {
    if (item.allocation === 'fixed') {
      return total + item.amount;
    } else {
      return total + (subtotal * (item.percentage || 0) / 100);
    }
  }, 0);
};

// Risk and contingency calculations
export const calculateRiskScore = (risk: RiskItem): number => {
  return (risk.probability / 100) * (risk.impact / 100) * risk.contingency;
};

export const calculateTotalContingency = (risks: RiskItem[]): number => {
  return risks.reduce((total, risk) => total + calculateRiskScore(risk), 0);
};

// Total cost breakdown
export const calculateCostBreakdown = (
  materials: MaterialItem[],
  labor: LaborItem[],
  equipment: EquipmentItem[],
  subcontractors: SubcontractorItem[],
  overhead: OverheadItem[],
  risks: RiskItem[],
  settings: EstimateSettings,
  projectSize?: number
): CostBreakdown => {
  const materialsCost = calculateMaterialsTotal(materials);
  const laborCost = calculateLaborTotal(labor);
  const equipmentCost = calculateEquipmentTotal(equipment);
  const subcontractorsCost = calculateSubcontractorsTotal(subcontractors);
  
  const subtotal = materialsCost + laborCost + equipmentCost + subcontractorsCost;
  const overheadCost = calculateOverheadTotal(overhead, subtotal);
  const contingencyCost = calculateTotalContingency(risks) + (subtotal * settings.contingency / 100);
  
  const beforeProfit = subtotal + overheadCost + contingencyCost;
  const profitAmount = beforeProfit * (settings.profitMargin / 100);
  
  const total = beforeProfit + profitAmount;
  
  return {
    materials: materialsCost,
    labor: laborCost,
    equipment: equipmentCost,
    subcontractors: subcontractorsCost,
    overhead: overheadCost,
    contingency: contingencyCost,
    profit: profitAmount,
    total: total,
    perSquareFoot: projectSize ? total / projectSize : undefined,
    perUnit: undefined
  };
};

// Market adjustment calculations
export const applyMarketConditions = (
  materials: MaterialItem[],
  conditions: MarketCondition[]
): MaterialItem[] => {
  return materials.map(material => {
    const condition = conditions.find(c => 
      material.name.toLowerCase().includes(c.material.toLowerCase())
    );
    
    if (condition) {
      return {
        ...material,
        unitCost: material.unitCost * (1 + condition.priceChange / 100)
      };
    }
    
    return material;
  });
};

// Phase-based calculations
export const calculatePhaseProgress = (phase: ProjectPhase): number => {
  const totalDays = Math.ceil(
    (phase.endDate.getTime() - phase.startDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  const elapsedDays = Math.ceil(
    (new Date().getTime() - phase.startDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  
  return Math.min(100, Math.max(0, (elapsedDays / totalDays) * 100));
};

// AI-powered recommendations
export const generateAIRecommendations = (
  breakdown: CostBreakdown,
  materials: MaterialItem[],
  labor: LaborItem[],
  historicalData?: any
): AIRecommendation[] => {
  const recommendations: AIRecommendation[] = [];
  
  // Material optimization
  const highMarkupMaterials = materials.filter(m => m.markup > 15);
  if (highMarkupMaterials.length > 0) {
    recommendations.push({
      category: 'Materials',
      suggestion: `Consider negotiating bulk pricing for ${highMarkupMaterials.length} materials with markup over 15%`,
      potentialSaving: highMarkupMaterials.reduce((sum, m) => 
        sum + (calculateMaterialCost(m) * 0.05), 0
      ),
      confidence: 0.8,
      basedOn: 'High markup analysis'
    });
  }
  
  // Labor productivity
  const lowProductivityLabor = labor.filter(l => l.productivity < 80);
  if (lowProductivityLabor.length > 0) {
    recommendations.push({
      category: 'Labor',
      suggestion: 'Improve productivity through training or better equipment',
      potentialSaving: lowProductivityLabor.reduce((sum, l) => 
        sum + (calculateLaborCost(l) * 0.1), 0
      ),
      confidence: 0.7,
      basedOn: 'Productivity analysis'
    });
  }
  
  // Cost ratio analysis
  const laborRatio = breakdown.labor / breakdown.total;
  if (laborRatio > 0.4) {
    recommendations.push({
      category: 'Cost Structure',
      suggestion: 'Labor costs are high (>40%). Consider prefabrication or automation',
      potentialSaving: breakdown.labor * 0.15,
      confidence: 0.6,
      basedOn: 'Industry benchmarks'
    });
  }
  
  return recommendations;
};

// Export functions
export const exportToCSV = (breakdown: CostBreakdown, details: any): string => {
  const rows = [
    ['Job Cost Estimate Summary'],
    [''],
    ['Category', 'Amount', 'Percentage'],
    ['Materials', breakdown.materials.toFixed(2), ((breakdown.materials / breakdown.total) * 100).toFixed(1) + '%'],
    ['Labor', breakdown.labor.toFixed(2), ((breakdown.labor / breakdown.total) * 100).toFixed(1) + '%'],
    ['Equipment', breakdown.equipment.toFixed(2), ((breakdown.equipment / breakdown.total) * 100).toFixed(1) + '%'],
    ['Subcontractors', breakdown.subcontractors.toFixed(2), ((breakdown.subcontractors / breakdown.total) * 100).toFixed(1) + '%'],
    ['Overhead', breakdown.overhead.toFixed(2), ((breakdown.overhead / breakdown.total) * 100).toFixed(1) + '%'],
    ['Contingency', breakdown.contingency.toFixed(2), ((breakdown.contingency / breakdown.total) * 100).toFixed(1) + '%'],
    ['Profit', breakdown.profit.toFixed(2), ((breakdown.profit / breakdown.total) * 100).toFixed(1) + '%'],
    [''],
    ['Total', breakdown.total.toFixed(2), '100%']
  ];
  
  if (breakdown.perSquareFoot) {
    rows.push(['Cost per Square Foot', breakdown.perSquareFoot.toFixed(2), '']);
  }
  
  return rows.map(row => row.join(',')).join('\n');
};

// Validation functions
export const validateEstimate = (
  materials: MaterialItem[],
  labor: LaborItem[],
  projectDetails: any
): string[] => {
  const errors: string[] = [];
  
  if (materials.length === 0) {
    errors.push('No materials added to estimate');
  }
  
  if (labor.length === 0) {
    errors.push('No labor items added to estimate');
  }
  
  if (!projectDetails.name) {
    errors.push('Project name is required');
  }
  
  if (!projectDetails.size || projectDetails.size <= 0) {
    errors.push('Valid project size is required');
  }
  
  return errors;
};

// Historical data analysis
export const analyzeHistoricalAccuracy = (
  estimates: any[],
  actuals: any[]
): { accuracy: number; trends: string[] } => {
  if (estimates.length === 0 || actuals.length === 0) {
    return { accuracy: 0, trends: [] };
  }
  
  const variances = estimates.map((est, i) => {
    const actual = actuals[i];
    if (!actual) return 0;
    return ((actual.total - est.total) / est.total) * 100;
  });
  
  const avgVariance = variances.reduce((sum, v) => sum + Math.abs(v), 0) / variances.length;
  const accuracy = 100 - avgVariance;
  
  const trends: string[] = [];
  if (avgVariance > 10) {
    trends.push('Estimates tend to be off by more than 10%');
  }
  
  const overruns = variances.filter(v => v > 0).length;
  if (overruns > variances.length * 0.7) {
    trends.push('70% of projects exceed estimated costs');
  }
  
  return { accuracy, trends };
}; 