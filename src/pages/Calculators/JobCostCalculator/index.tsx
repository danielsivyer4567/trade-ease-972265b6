import React, { useState, useEffect } from "react";
import { AppLayout } from "@/components/ui/AppLayout";
import { Link } from "react-router-dom";
import { ArrowLeft, Gauge, Save, History, Settings } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

// Import types and utilities
import {
  ProjectDetails,
  MaterialItem,
  LaborItem,
  EquipmentItem,
  SubcontractorItem,
  OverheadItem,
  RiskItem,
  EstimateSettings,
  CostBreakdown,
  UnionRequirement
} from './types';
import {
  calculateCostBreakdown,
  generateAIRecommendations,
  exportToCSV,
  validateEstimate,
  calculateMaterialCost,
  calculateLaborCost,
  calculateEquipmentCost,
  calculateSubcontractorCost
} from './utils';

// Import components
import { ProjectDetailsForm } from './components/ProjectDetails';
import { MaterialsInput } from './components/MaterialsInput';
import { LaborInput } from './components/LaborInput';
import { EquipmentInput } from './components/EquipmentInput';
import { OtherCostsTab } from './components/OtherCostsTab';
import { CostSummary } from './components/CostSummary';
import { EstimateHistory } from './components/EstimateHistory';
import { EstimateSettings as EstimateSettingsComponent } from './components/EstimateSettings';

// No sample data imports - using real data only

const JobCostCalculator = () => {
  const { toast } = useToast();
  
  // State management
  const [projectDetails, setProjectDetails] = useState<ProjectDetails>({
    name: '',
    client: '',
    location: '',
    type: 'Commercial - Office',
    size: 0,
    sizeUnit: 'SF',
    startDate: new Date(),
    duration: 90,
    complexity: 'medium',
    weatherRisk: false,
    siteConditions: '',
    accessRestrictions: '',
    workingHours: '7AM-5PM Mon-Fri',
    unionRequirements: false
  });

  const [unionRequirement, setUnionRequirement] = useState<UnionRequirement>({
    isRequired: false,
    costItems: []
  });

  const [materials, setMaterials] = useState<MaterialItem[]>([]);
  const [labor, setLabor] = useState<LaborItem[]>([]);
  const [equipment, setEquipment] = useState<EquipmentItem[]>([]);
  const [subcontractors, setSubcontractors] = useState<SubcontractorItem[]>([]);
  const [overhead, setOverhead] = useState<OverheadItem[]>([
    {
      id: '1',
      category: 'Project Management',
      description: 'PM and supervision',
      amount: 0,
      allocation: 'percentage',
      percentage: 5
    },
    {
      id: '2',
      category: 'Insurance & Bonds',
      description: 'General liability and performance bond',
      amount: 0,
      allocation: 'percentage',
      percentage: 2.5
    }
  ]);
  const [risks, setRisks] = useState<RiskItem[]>([]);
  
  const [showHistory, setShowHistory] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  
  // Load settings from localStorage
  const loadSettings = (): EstimateSettings => {
    const saved = localStorage.getItem('estimateSettings');
    if (saved) {
      return JSON.parse(saved);
    }
    return {
      defaultMarkup: 15,
      defaultWasteFactor: 5,
      defaultOverhead: 10,
      defaultProfit: 10,
      defaultContingency: 5,
      taxRate: 0,
      roundTotals: false,
      includeMarketConditions: false,
      showDetailedBreakdown: true
    };
  };

  const [settings, setSettings] = useState<EstimateSettings>(loadSettings());

  const [activeTab, setActiveTab] = useState('details');
  const [isSaving, setIsSaving] = useState(false);

  // Calculate cost breakdown
  const breakdown = calculateCostBreakdown(
    materials,
    labor,
    equipment,
    subcontractors,
    overhead,
    risks,
    settings,
    projectDetails.size,
    unionRequirement
  );

  // Generate AI recommendations
  const recommendations = generateAIRecommendations(
    breakdown,
    materials,
    labor
  );

  // Calculate subtotal for overhead calculations
  const subtotal = materials.reduce((sum, m) => sum + calculateMaterialCost(m), 0) +
                   labor.reduce((sum, l) => sum + calculateLaborCost(l), 0) +
                   equipment.reduce((sum, e) => sum + calculateEquipmentCost(e), 0) +
                   subcontractors.reduce((sum, s) => sum + calculateSubcontractorCost(s), 0);

  // Save estimate to local storage
  const saveEstimate = () => {
    const estimateData = {
      projectDetails,
      materials,
      labor,
      equipment,
      subcontractors,
      overhead,
      risks,
      unionRequirement,
      settings,
      breakdown: calculateCostBreakdown(
        materials,
        labor,
        equipment,
        subcontractors,
        overhead,
        risks,
        settings,
        projectDetails.size,
        unionRequirement
      ),
      createdAt: new Date().toISOString(),
      status: 'draft'
    };
    
    const estimateId = `estimate_${Date.now()}`;
    localStorage.setItem(estimateId, JSON.stringify(estimateData));
    
    toast({
      title: "Estimate saved",
      description: "Your estimate has been saved to history.",
    });
  };

  // Load estimate from history
  const loadEstimate = (estimateData: any) => {
    if (estimateData.projectDetails) setProjectDetails(estimateData.projectDetails);
    if (estimateData.materials) setMaterials(estimateData.materials);
    if (estimateData.labor) setLabor(estimateData.labor);
    if (estimateData.equipment) setEquipment(estimateData.equipment);
    if (estimateData.subcontractors) setSubcontractors(estimateData.subcontractors);
    if (estimateData.overhead) setOverhead(estimateData.overhead);
    if (estimateData.risks) setRisks(estimateData.risks);
    if (estimateData.unionRequirement) setUnionRequirement(estimateData.unionRequirement);
    if (estimateData.settings) setSettings(estimateData.settings);
    
    setShowHistory(false);
    toast({
      title: "Estimate loaded",
      description: "The estimate has been loaded successfully.",
    });
  };

  // Export to CSV
  const handleExport = () => {
    const csv = exportToCSV(breakdown, projectDetails);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${projectDetails.name || 'estimate'}_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    toast({
      title: "Export Successful",
      description: "Your estimate has been exported to CSV.",
    });
  };

  // Generate proposal (placeholder)
  const handleGenerateProposal = () => {
    toast({
      title: "Coming Soon",
      description: "Proposal generation feature will be available soon.",
    });
  };

  // Validate estimate
  const errors = validateEstimate(materials, labor, projectDetails);
  const isValid = errors.length === 0;

  // Clear all form data
  const clearAllData = () => {
    setProjectDetails({
      name: '',
      client: '',
      location: '',
      type: 'Commercial - Office',
      size: 0,
      sizeUnit: 'SF',
      startDate: new Date(),
      duration: 90,
      complexity: 'medium',
      weatherRisk: false,
      siteConditions: '',
      accessRestrictions: '',
      workingHours: '7AM-5PM Mon-Fri',
      unionRequirements: false
    });
    
    setMaterials([]);
    setLabor([]);
    setEquipment([]);
    setSubcontractors([]);
    setRisks([]);
    
    // Reset basic overhead items
    setOverhead([
      {
        id: '1',
        category: 'Project Management',
        description: 'PM and supervision',
        amount: 0,
        allocation: 'percentage',
        percentage: 5
      },
      {
        id: '2',
        category: 'Insurance & Bonds',
        description: 'General liability and performance bond',
        amount: 0,
        allocation: 'percentage',
        percentage: 2.5
      }
    ]);
    
    toast({
      title: "Form cleared",
      description: "All data has been cleared. You can start fresh.",
    });
  };

  return (
    <AppLayout>
      <div style={{
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
        minHeight: '100vh',
        padding: '20px'
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '30px', color: '#6c757d' }}>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '10px', textShadow: '1px 1px 2px rgba(0,0,0,0.1)' }}>
              🏗️ Advanced Job Cost Estimator
            </h1>
            <p>Professional construction cost estimation tool</p>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={clearAllData}
              style={{
                background: '#ef4444',
                color: 'white',
                border: '2px solid #ef4444',
                padding: '12px 24px',
                borderRadius: '25px',
                cursor: 'pointer',
                fontSize: '1.1rem',
                transition: 'all 0.3s ease',
                fontWeight: '600'
              }}
            >
              <Gauge className="h-4 w-4 mr-2" style={{ display: 'inline' }} />
              Clear All Data
            </button>
            <div className="flex gap-2">
              <button
                onClick={() => setShowHistory(true)}
                style={{
                  background: '#dee2e6',
                  color: '#6c757d',
                  border: '2px solid #dee2e6',
                  padding: '12px 24px',
                  borderRadius: '25px',
                  cursor: 'pointer',
                  fontSize: '1.1rem',
                  transition: 'all 0.3s ease'
                }}
              >
                📜 History
              </button>
              <button
                onClick={() => setShowSettings(true)}
                style={{
                  background: '#dee2e6',
                  color: '#6c757d',
                  border: '2px solid #dee2e6',
                  padding: '12px 24px',
                  borderRadius: '25px',
                  cursor: 'pointer',
                  fontSize: '1.1rem',
                  transition: 'all 0.3s ease'
                }}
              >
                ⚙️ Settings
              </button>
              <button
                onClick={saveEstimate}
                disabled={!isValid}
                style={{
                  background: isValid ? '#3b82f6' : '#dee2e6',
                  color: isValid ? 'white' : '#6c757d',
                  border: `2px solid ${isValid ? '#3b82f6' : '#dee2e6'}`,
                  padding: '12px 24px',
                  borderRadius: '25px',
                  cursor: isValid ? 'pointer' : 'not-allowed',
                  fontSize: '1.1rem',
                  transition: 'all 0.3s ease',
                  opacity: isValid ? 1 : 0.6
                }}
              >
                💾 Save Estimate
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div style={{ 
            background: '#e2e8f0', 
            borderRadius: '20px', 
            padding: '25px', 
            boxShadow: '0 10px 30px rgba(0,0,0,0.2)', 
            backdropFilter: 'blur(10px)', 
            border: '2px solid #94a3b8' 
          }}>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-6" style={{
                background: '#dee2e6',
                borderRadius: '15px',
                padding: '4px',
                marginBottom: '20px'
              }}>
                <TabsTrigger value="details" style={{
                  borderRadius: '10px',
                  transition: 'all 0.3s ease'
                }}>Details</TabsTrigger>
                <TabsTrigger value="materials" style={{
                  borderRadius: '10px',
                  transition: 'all 0.3s ease'
                }}>Materials</TabsTrigger>
                <TabsTrigger value="labor" style={{
                  borderRadius: '10px',
                  transition: 'all 0.3s ease'
                }}>Labor</TabsTrigger>
                <TabsTrigger value="equipment" style={{
                  borderRadius: '10px',
                  transition: 'all 0.3s ease'
                }}>Equipment</TabsTrigger>
                <TabsTrigger value="other" style={{
                  borderRadius: '10px',
                  transition: 'all 0.3s ease'
                }}>Other</TabsTrigger>
                <TabsTrigger value="summary" style={{
                  borderRadius: '10px',
                  transition: 'all 0.3s ease'
                }}>Summary</TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="mt-4">
                <ProjectDetailsForm
                  details={projectDetails}
                  unionRequirement={unionRequirement}
                  onChange={(details) => {
                    setProjectDetails(details);
                    // Sync union requirement state with project details
                    if (details.unionRequirements !== projectDetails.unionRequirements) {
                      setUnionRequirement({
                        ...unionRequirement,
                        isRequired: details.unionRequirements || false
                      });
                    }
                  }}
                  onUnionChange={setUnionRequirement}
                />
              </TabsContent>

              <TabsContent value="materials" className="mt-4">
                <MaterialsInput
                  materials={materials}
                  onChange={setMaterials}
                />
              </TabsContent>

              <TabsContent value="labor" className="mt-4">
                <LaborInput
                  labor={labor}
                  onChange={setLabor}
                />
              </TabsContent>

              <TabsContent value="equipment" className="mt-4">
                <EquipmentInput
                  equipment={equipment}
                  onChange={setEquipment}
                />
              </TabsContent>

              <TabsContent value="other" className="mt-4">
                <OtherCostsTab
                  subcontractors={subcontractors}
                  overhead={overhead}
                  risks={risks}
                  onSubcontractorsChange={setSubcontractors}
                  onOverheadChange={setOverhead}
                  onRisksChange={setRisks}
                  subtotal={subtotal}
                />
              </TabsContent>

              <TabsContent value="summary" className="mt-4">
                <CostSummary
                  breakdown={breakdown}
                  recommendations={recommendations}
                  onExport={handleExport}
                  onGenerateProposal={handleGenerateProposal}
                />
              </TabsContent>
            </Tabs>

            {errors.length > 0 && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <h4 className="font-semibold text-red-800 mb-2">Please fix the following issues:</h4>
                <ul className="list-disc list-inside text-sm text-red-700">
                  {errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* History Modal */}
        {showHistory && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <EstimateHistory
              onLoad={loadEstimate}
              onClose={() => setShowHistory(false)}
            />
          </div>
        )}

        {/* Settings Modal */}
        {showSettings && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <EstimateSettingsComponent
              settings={settings}
              onChange={setSettings}
              onClose={() => setShowSettings(false)}
            />
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default JobCostCalculator;
