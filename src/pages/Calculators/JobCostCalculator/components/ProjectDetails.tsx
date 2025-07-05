import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { CalendarIcon, MapPin, Building2, Ruler, Plus, Trash2, Users, DollarSign, Clock, Shield, FileText, Calculator, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { format } from 'date-fns';
import { ProjectDetails, UnionRequirement, UnionCostItem } from '../types';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';

interface ProjectDetailsFormProps {
  details: ProjectDetails;
  unionRequirement: UnionRequirement;
  onChange: (details: ProjectDetails) => void;
  onUnionChange: (requirement: UnionRequirement) => void;
}

const projectTypes = [
  'Residential - Single Family',
  'Residential - Multi Family',
  'Commercial - Office',
  'Commercial - Retail',
  'Commercial - Warehouse',
  'Industrial',
  'Infrastructure',
  'Renovation',
  'Mixed Use'
];

export const ProjectDetailsForm: React.FC<ProjectDetailsFormProps> = ({ 
  details, 
  unionRequirement,
  onChange,
  onUnionChange
}) => {
  const handleChange = (field: keyof ProjectDetails, value: any) => {
    onChange({ ...details, [field]: value });
  };

  const handleUnionToggle = (checked: boolean) => {
    handleChange('unionRequirements', checked);
    onUnionChange({
      ...unionRequirement,
      isRequired: checked,
      costItems: checked ? unionRequirement.costItems : []
    });
  };

  const handleAddUnionCostItem = () => {
    const newItem: UnionCostItem = {
      id: Date.now().toString(),
      category: 'wages',
      type: 'Journeyman Base Rate',
      description: '',
      rate: 0,
      unit: 'hour',
      quantity: 0,
      total: 0,
      isPercentage: false
    };
    
    onUnionChange({
      ...unionRequirement,
      costItems: [...unionRequirement.costItems, newItem]
    });
  };

  const handleUpdateUnionCostItem = (id: string, updates: Partial<UnionCostItem>) => {
    const updatedItems = unionRequirement.costItems.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, ...updates };
        
        // Recalculate total based on rate and quantity
        if ('rate' in updates || 'quantity' in updates) {
          if (updatedItem.isPercentage) {
            const totalLaborCost = unionRequirement.costItems
              .filter(i => i.category === 'wages' && !i.isPercentage)
              .reduce((sum, i) => sum + i.total, 0);
            updatedItem.total = (totalLaborCost * updatedItem.rate) / 100;
          } else {
            updatedItem.total = updatedItem.rate * updatedItem.quantity;
          }
        }
        
        return updatedItem;
      }
      return item;
    });
    
    onUnionChange({
      ...unionRequirement,
      costItems: updatedItems
    });
  };

  const handleRemoveUnionCostItem = (id: string) => {
    onUnionChange({
      ...unionRequirement,
      costItems: unionRequirement.costItems.filter(item => item.id !== id)
    });
  };

  const getCostTypesByCategory = (category: string): string[] => {
    switch (category) {
      case 'wages':
        return [
          'Journeyman Base Rate',
          'Apprentice Rates (1st Year)',
          'Apprentice Rates (2nd Year)',
          'Apprentice Rates (3rd Year)',
          'Apprentice Rates (4th Year)',
          'Foreman Rate',
          'General Foreman Rate',
          'Shift Differential',
          'Hazard Pay',
          'Travel Time Pay'
        ];
      case 'benefits':
        return [
          'Health & Welfare',
          'Pension Contribution',
          'Annuity/401(k)',
          'Vacation Fund',
          'Training Fund',
          'Industry Fund',
          'Supplemental Benefits',
          'Dental Insurance',
          'Vision Insurance',
          'Life Insurance',
          'Disability Insurance'
        ];
      case 'training':
        return [
          'Apprenticeship Program',
          'Safety Training',
          'Certification Costs',
          'Continuing Education',
          'Skills Assessment',
          'Union Training Fund'
        ];
      case 'compliance':
        return [
          'Certified Payroll Reporting',
          'Prevailing Wage Compliance',
          'Union Reporting',
          'Audit Costs',
          'Legal Compliance',
          'Davis-Bacon Requirements',
          'State Prevailing Wage',
          'Fringe Benefit Statements'
        ];
      case 'overtime':
        return [
          'Time and a Half (1.5x)',
          'Double Time (2x)',
          'Sunday Premium',
          'Holiday Premium',
          'Night Shift Premium',
          'Weekend Premium'
        ];
      case 'administrative':
        return [
          'Union Dues Check-off',
          'Working Assessment',
          'Political Action Fund',
          'Market Recovery',
          'Industry Advancement',
          'Supplemental Dues',
          'Administrative Fee'
        ];
      default:
        return [];
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'wages': return <DollarSign className="h-4 w-4" />;
      case 'benefits': return <Shield className="h-4 w-4" />;
      case 'training': return <Users className="h-4 w-4" />;
      case 'compliance': return <FileText className="h-4 w-4" />;
      case 'overtime': return <Clock className="h-4 w-4" />;
      case 'administrative': return <Calculator className="h-4 w-4" />;
      default: return <DollarSign className="h-4 w-4" />;
    }
  };

  const totalUnionCosts = unionRequirement.costItems.reduce((sum, item) => sum + item.total, 0);

  return (
    <div style={{ 
      background: '#e2e8f0', 
      borderRadius: '20px', 
      padding: '25px', 
      boxShadow: '0 10px 30px rgba(0,0,0,0.2)', 
      backdropFilter: 'blur(10px)', 
      border: '2px solid #94a3b8' 
    }}>
      <div style={{ 
        textAlign: 'center', 
        marginBottom: '20px', 
        paddingBottom: '15px', 
        borderBottom: '2px solid #f0f0f0' 
      }}>
        <h3 style={{ fontSize: '1.4rem', color: '#333', marginBottom: '8px' }}>
          <Building2 className="h-5 w-5 inline mr-2" style={{ color: '#6c757d' }} />
          Project Details
        </h3>
        <small style={{ color: '#6c757d' }}>Basic project information and specifications</small>
      </div>
      
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '5px', 
              fontWeight: '600', 
              color: '#555', 
              fontSize: '0.95rem' 
            }}>
              📏 Project Name
            </label>
            <input
              type="text"
              value={details.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Enter project name"
              style={{
                width: '100%',
                padding: '12px 15px',
                border: '2px solid #e9ecef',
                borderRadius: '10px',
                fontSize: '1rem',
                background: 'white'
              }}
            />
          </div>
          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '5px', 
              fontWeight: '600', 
              color: '#555', 
              fontSize: '0.95rem' 
            }}>
              👤 Client Name
            </label>
            <input
              type="text"
              value={details.client}
              onChange={(e) => handleChange('client', e.target.value)}
              placeholder="Enter client name"
              style={{
                width: '100%',
                padding: '12px 15px',
                border: '2px solid #e9ecef',
                borderRadius: '10px',
                fontSize: '1rem',
                background: 'white'
              }}
            />
          </div>
        </div>

        <div>
          <label style={{ 
            display: 'block', 
            marginBottom: '5px', 
            fontWeight: '600', 
            color: '#555', 
            fontSize: '0.95rem' 
          }}>
            📍 Project Location
          </label>
          <input
            type="text"
            value={details.location}
            onChange={(e) => handleChange('location', e.target.value)}
            placeholder="Enter project address"
            style={{
              width: '100%',
              padding: '12px 15px',
              border: '2px solid #e9ecef',
              borderRadius: '10px',
              fontSize: '1rem',
              background: 'white'
            }}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '5px', 
              fontWeight: '600', 
              color: '#555', 
              fontSize: '0.95rem' 
            }}>
              🏗️ Project Type
            </label>
            <Select value={details.type} onValueChange={(value) => handleChange('type', value)}>
              <SelectTrigger style={{
                border: '2px solid #e9ecef',
                borderRadius: '10px',
                fontSize: '1rem',
                background: 'white',
                padding: '12px 15px'
              }}>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {projectTypes.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '5px', 
              fontWeight: '600', 
              color: '#555', 
              fontSize: '0.95rem' 
            }}>
              📐 Project Size
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                value={details.size}
                onChange={(e) => handleChange('size', parseFloat(e.target.value) || 0)}
                placeholder="Size"
                style={{
                  flex: 1,
                  padding: '12px 15px',
                  border: '2px solid #e9ecef',
                  borderRadius: '10px',
                  fontSize: '1rem',
                  background: 'white'
                }}
              />
              <Select value={details.sizeUnit} onValueChange={(value) => handleChange('sizeUnit', value)}>
                <SelectTrigger className="w-24" style={{
                  border: '2px solid #e9ecef',
                  borderRadius: '10px',
                  fontSize: '1rem',
                  background: 'white',
                  padding: '12px'
                }}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sqft">sq ft</SelectItem>
                  <SelectItem value="sqm">sq m</SelectItem>
                  <SelectItem value="lf">lin ft</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '5px', 
              fontWeight: '600', 
              color: '#555', 
              fontSize: '0.95rem' 
            }}>
              ⚡ Complexity
            </label>
            <Select value={details.complexity} onValueChange={(value: 'low' | 'medium' | 'high') => handleChange('complexity', value)}>
              <SelectTrigger style={{
                border: '2px solid #e9ecef',
                borderRadius: '10px',
                fontSize: '1rem',
                background: 'white',
                padding: '12px 15px'
              }}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '5px', 
              fontWeight: '600', 
              color: '#555', 
              fontSize: '0.95rem' 
            }}>
              📅 Start Date
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                  style={{
                    border: '2px solid #e9ecef',
                    borderRadius: '10px',
                    fontSize: '1rem',
                    background: 'white',
                    padding: '12px 15px',
                    color: details.startDate ? '#333' : '#999'
                  }}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {details.startDate ? format(details.startDate, 'PPP') : 'Pick a date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={details.startDate}
                  onSelect={(date) => handleChange('startDate', date || new Date())}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '5px', 
              fontWeight: '600', 
              color: '#555', 
              fontSize: '0.95rem' 
            }}>
              ⏱️ Duration (days)
            </label>
            <input
              type="number"
              value={details.duration}
              onChange={(e) => handleChange('duration', parseInt(e.target.value) || 0)}
              placeholder="Project duration"
              style={{
                width: '100%',
                padding: '12px 15px',
                border: '2px solid #e9ecef',
                borderRadius: '10px',
                fontSize: '1rem',
                background: 'white'
              }}
            />
          </div>
        </div>

        <div>
          <label style={{ 
            display: 'block', 
            marginBottom: '5px', 
            fontWeight: '600', 
            color: '#555', 
            fontSize: '0.95rem' 
          }}>
            🏗️ Site Conditions
          </label>
          <textarea
            value={details.siteConditions}
            onChange={(e) => handleChange('siteConditions', e.target.value)}
            placeholder="Describe site conditions, access restrictions, etc."
            rows={3}
            style={{
              width: '100%',
              padding: '12px 15px',
              border: '2px solid #e9ecef',
              borderRadius: '10px',
              fontSize: '1rem',
              background: 'white',
              resize: 'none'
            }}
          />
        </div>

        <div className="space-y-3 pt-4" style={{ borderTop: '2px solid #f0f0f0' }}>
          {/* Weather Risk Toggle */}
          <div 
            className="flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer hover:bg-orange-50 transition-colors"
            style={{ borderColor: details.weatherRisk ? '#f97316' : '#e2e8f0', backgroundColor: details.weatherRisk ? '#fff7ed' : 'transparent' }}
            onClick={() => handleChange('weatherRisk', !details.weatherRisk)}
          >
            <input
              type="checkbox"
              id="weather-risk"
              checked={details.weatherRisk}
              onChange={(e) => {e.stopPropagation(); handleChange('weatherRisk', e.target.checked);}}
              className="rounded"
              style={{ width: '20px', height: '20px', cursor: 'pointer' }}
            />
            <div className="flex items-center justify-center w-8 h-8 rounded-full" style={{ backgroundColor: details.weatherRisk ? '#f97316' : '#e2e8f0' }}>
              <span style={{ fontSize: '16px' }}>☔</span>
            </div>
            <div className="flex-1">
              <label htmlFor="weather-risk" style={{ color: '#333', fontWeight: '600', fontSize: '1rem', cursor: 'pointer' }}>
                Weather Risk
              </label>
              <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: 0 }}>
                Configure weather-related delays and additional costs
              </p>
            </div>
            {details.weatherRisk && (
              <span style={{ color: '#f97316', fontSize: '0.875rem', fontWeight: '500' }}>
                Active
              </span>
            )}
          </div>
          
          {/* Weather Risk Dropdown Section */}
          {details.weatherRisk && (
            <div className="mt-2 p-4 bg-white rounded-lg border-2 border-orange-200">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-[#333] flex items-center gap-2">
                  <span style={{ fontSize: '20px' }}>🌦️</span>
                  Weather Risk Assessment
                </h4>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open('/weather-intelligence', '_blank')}
                    className="text-blue-600 border-blue-200 hover:bg-blue-50"
                  >
                    📡 Live Weather Data
                  </Button>
                  <ChevronDown className="h-5 w-5 text-gray-500" />
                </div>
              </div>

              <Alert className="bg-orange-50 border-orange-200 mb-4">
                <AlertCircle className="h-4 w-4 text-orange-600" />
                <AlertDescription className="text-orange-800">
                  Account for potential weather delays, seasonal conditions, and protective measures.
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-[#555]">Risk Level</Label>
                    <Select defaultValue="medium">
                      <SelectTrigger className="bg-white">
                        <SelectValue placeholder="Select risk level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                            Low Risk (5-10% contingency)
                          </div>
                        </SelectItem>
                        <SelectItem value="medium">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                            Medium Risk (10-15% contingency)
                          </div>
                        </SelectItem>
                        <SelectItem value="high">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-500"></div>
                            High Risk (15-25% contingency)
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-[#555]">Season/Climate</Label>
                    <Select defaultValue="temperate">
                      <SelectTrigger className="bg-white">
                        <SelectValue placeholder="Select climate conditions" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tropical">🌴 Tropical (Rain season)</SelectItem>
                        <SelectItem value="temperate">🌤️ Temperate (Seasonal)</SelectItem>
                        <SelectItem value="arid">🏜️ Arid (Dust storms)</SelectItem>
                        <SelectItem value="cold">❄️ Cold (Winter conditions)</SelectItem>
                        <SelectItem value="coastal">🌊 Coastal (High winds)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-[#555]">Expected Delay Days</Label>
                    <Input
                      type="number"
                      placeholder="0"
                      className="bg-white"
                      min="0"
                      max="30"
                    />
                  </div>
                  <div>
                    <Label className="text-[#555]">Additional Cost ($)</Label>
                    <Input
                      type="number"
                      placeholder="0.00"
                      className="bg-white"
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-[#555]">Weather Mitigation Measures</Label>
                  <Textarea
                    placeholder="Describe protective measures, alternative schedules, or contingency plans..."
                    className="bg-white"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="temp-shelter" />
                    <Label htmlFor="temp-shelter" className="text-sm">Temporary shelter</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="weather-monitoring" />
                    <Label htmlFor="weather-monitoring" className="text-sm">Weather monitoring</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="flexible-schedule" />
                    <Label htmlFor="flexible-schedule" className="text-sm">Flexible scheduling</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="equipment-protection" />
                    <Label htmlFor="equipment-protection" className="text-sm">Equipment protection</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="drainage-systems" />
                    <Label htmlFor="drainage-systems" className="text-sm">Drainage systems</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="backup-power" />
                    <Label htmlFor="backup-power" className="text-sm">Backup power</Label>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Union Requirements Toggle - More Prominent */}
          <div 
            className="flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer hover:bg-blue-50 transition-colors"
            style={{ borderColor: details.unionRequirements ? '#3b82f6' : '#e2e8f0', backgroundColor: details.unionRequirements ? '#eff6ff' : 'transparent' }}
            onClick={() => handleUnionToggle(!details.unionRequirements)}
          >
            <input
              type="checkbox"
              id="union-req"
              checked={details.unionRequirements || false}
              onChange={(e) => {e.stopPropagation(); handleUnionToggle(e.target.checked);}}
              className="rounded"
              style={{ width: '20px', height: '20px', cursor: 'pointer' }}
            />
            <div className="flex items-center justify-center w-8 h-8 rounded-full" style={{ backgroundColor: details.unionRequirements ? '#3b82f6' : '#e2e8f0' }}>
              <Users className="h-4 w-4" style={{ color: details.unionRequirements ? 'white' : '#6b7280' }} />
            </div>
            <div className="flex-1">
              <label 
                htmlFor="union-req" 
                style={{ color: '#333', fontWeight: '600', fontSize: '1rem', cursor: 'pointer' }}
              >
                👷 Union Requirements
              </label>
              <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: 0 }}>
                Configure union wages, benefits, and compliance costs
              </p>
            </div>
            {details.unionRequirements && (
              <span style={{ color: '#3b82f6', fontSize: '0.875rem', fontWeight: '500' }}>
                Active
              </span>
            )}
          </div>
        </div>

        {/* Union Requirements Dropdown Section */}
        {details.unionRequirements && (
          <div className="mt-4 p-4 bg-white rounded-lg border-2 border-blue-200">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-[#333] flex items-center gap-2">
                <Users className="h-5 w-5" />
                Union Requirements Details
              </h4>
              {details.unionRequirements && (
                <ChevronDown className="h-5 w-5 text-gray-500" />
              )}
            </div>

            <Alert className="bg-blue-50 border-blue-200 mb-4">
              <AlertCircle className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800">
                Configure union wages, benefits, training, compliance, and administrative costs below.
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="union-local" className="text-[#555]">Union Local Number</Label>
                  <Input
                    id="union-local"
                    value={unionRequirement.localNumber || ''}
                    onChange={(e) => onUnionChange({ ...unionRequirement, localNumber: e.target.value })}
                    placeholder="e.g., Local 123"
                    className="bg-white"
                  />
                </div>
                <div>
                  <Label htmlFor="union-trade" className="text-[#555]">Trade/Craft</Label>
                  <Select
                    value={unionRequirement.trade || ''}
                    onValueChange={(value) => onUnionChange({ ...unionRequirement, trade: value })}
                  >
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="Select trade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="electrical">Electrical</SelectItem>
                      <SelectItem value="plumbing">Plumbing</SelectItem>
                      <SelectItem value="hvac">HVAC</SelectItem>
                      <SelectItem value="carpentry">Carpentry</SelectItem>
                      <SelectItem value="ironworkers">Ironworkers</SelectItem>
                      <SelectItem value="laborers">Laborers</SelectItem>
                      <SelectItem value="operators">Operating Engineers</SelectItem>
                      <SelectItem value="teamsters">Teamsters</SelectItem>
                      <SelectItem value="painters">Painters</SelectItem>
                      <SelectItem value="roofers">Roofers</SelectItem>
                      <SelectItem value="sheetmetal">Sheet Metal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="cba-reference" className="text-[#555]">CBA Reference/Agreement</Label>
                <Input
                  id="cba-reference"
                  value={unionRequirement.cbaReference || ''}
                  onChange={(e) => onUnionChange({ ...unionRequirement, cbaReference: e.target.value })}
                  placeholder="Collective Bargaining Agreement reference"
                  className="bg-white"
                />
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-3">
                  <h5 className="font-medium text-[#333]">Union Cost Items</h5>
                  <Button
                    onClick={handleAddUnionCostItem}
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-4"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Cost Item
                  </Button>
                </div>

                <div className="space-y-3">
                  {unionRequirement.costItems.map((item) => (
                    <div key={item.id} className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                      <div className="grid grid-cols-1 md:grid-cols-6 gap-2">
                        <div>
                          <Label className="text-[#555] text-sm">Category</Label>
                          <Select
                            value={item.category}
                            onValueChange={(value) => handleUpdateUnionCostItem(item.id, { 
                              category: value as 'wages' | 'benefits' | 'training' | 'compliance' | 'overtime' | 'administrative',
                              type: getCostTypesByCategory(value)[0] || ''
                            })}
                          >
                            <SelectTrigger className="bg-white h-9">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="wages">
                                <div className="flex items-center gap-2">
                                  <DollarSign className="h-3 w-3" />
                                  Wages
                                </div>
                              </SelectItem>
                              <SelectItem value="benefits">
                                <div className="flex items-center gap-2">
                                  <Shield className="h-3 w-3" />
                                  Benefits
                                </div>
                              </SelectItem>
                              <SelectItem value="training">
                                <div className="flex items-center gap-2">
                                  <Users className="h-3 w-3" />
                                  Training
                                </div>
                              </SelectItem>
                              <SelectItem value="compliance">
                                <div className="flex items-center gap-2">
                                  <FileText className="h-3 w-3" />
                                  Compliance
                                </div>
                              </SelectItem>
                              <SelectItem value="overtime">
                                <div className="flex items-center gap-2">
                                  <Clock className="h-3 w-3" />
                                  Overtime
                                </div>
                              </SelectItem>
                              <SelectItem value="administrative">
                                <div className="flex items-center gap-2">
                                  <Calculator className="h-3 w-3" />
                                  Administrative
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="md:col-span-2">
                          <Label className="text-[#555] text-sm">Type</Label>
                          <Select
                            value={item.type}
                            onValueChange={(value) => handleUpdateUnionCostItem(item.id, { type: value })}
                          >
                            <SelectTrigger className="bg-white h-9">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {getCostTypesByCategory(item.category).map((type) => (
                                <SelectItem key={type} value={type}>
                                  {type}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label className="text-[#555] text-sm">Rate</Label>
                          <div className="flex items-center gap-1">
                            <Input
                              type="number"
                              value={item.rate}
                              onChange={(e) => handleUpdateUnionCostItem(item.id, { rate: parseFloat(e.target.value) || 0 })}
                              className="bg-white h-9"
                              step="0.01"
                            />
                            {item.category === 'administrative' && (
                              <div className="flex items-center">
                                <Checkbox
                                  checked={item.isPercentage}
                                  onCheckedChange={(checked) => handleUpdateUnionCostItem(item.id, { isPercentage: checked as boolean })}
                                />
                                <Label className="ml-1 text-xs">%</Label>
                              </div>
                            )}
                          </div>
                        </div>

                        <div>
                          <Label className="text-[#555] text-sm">Hours</Label>
                          <Input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => handleUpdateUnionCostItem(item.id, { quantity: parseFloat(e.target.value) || 0 })}
                            className="bg-white h-9"
                            disabled={item.isPercentage}
                          />
                        </div>

                        <div className="flex items-end gap-2">
                          <div className="flex-1">
                            <Label className="text-[#555] text-sm">Total</Label>
                            <Input
                              type="number"
                              value={item.total.toFixed(2)}
                              readOnly
                              className="bg-gray-100 h-9"
                            />
                          </div>
                          <Button
                            onClick={() => handleRemoveUnionCostItem(item.id)}
                            size="sm"
                            variant="ghost"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 h-9 w-9 p-0"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {unionRequirement.costItems.length > 0 && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-[#333]">Total Union Costs:</span>
                      <span className="text-lg font-bold text-blue-600">
                        ${totalUnionCosts.toFixed(2)}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}; 