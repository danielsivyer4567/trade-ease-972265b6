import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, Building2, Calculator, FileText, Save } from 'lucide-react';
import { EstimateSettings as EstimateSettingsType } from '../types';
import { useToast } from '@/hooks/use-toast';

interface EstimateSettingsProps {
  settings: EstimateSettingsType;
  onChange: (settings: EstimateSettingsType) => void;
  onClose: () => void;
}

export const EstimateSettings: React.FC<EstimateSettingsProps> = ({ 
  settings, 
  onChange, 
  onClose 
}) => {
  const { toast } = useToast();
  const [localSettings, setLocalSettings] = React.useState(settings);

  const handleSave = () => {
    onChange(localSettings);
    // Save to localStorage
    localStorage.setItem('estimateSettings', JSON.stringify(localSettings));
    toast({
      title: "Settings saved",
      description: "Your estimate settings have been updated.",
    });
    onClose();
  };

  const updateSettings = (updates: Partial<EstimateSettingsType>) => {
    setLocalSettings({ ...localSettings, ...updates });
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Estimate Settings
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Save Settings
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="general">
              <Building2 className="h-4 w-4 mr-2" />
              General
            </TabsTrigger>
            <TabsTrigger value="calculations">
              <Calculator className="h-4 w-4 mr-2" />
              Calculations
            </TabsTrigger>
            <TabsTrigger value="templates">
              <FileText className="h-4 w-4 mr-2" />
              Templates
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Company Name</Label>
                <Input
                  value={localSettings.companyName || ''}
                  onChange={(e) => updateSettings({ companyName: e.target.value })}
                  placeholder="Your Company Name"
                />
              </div>
              <div>
                <Label>License Number</Label>
                <Input
                  value={localSettings.licenseNumber || ''}
                  onChange={(e) => updateSettings({ licenseNumber: e.target.value })}
                  placeholder="License #"
                />
              </div>
              <div>
                <Label>Phone</Label>
                <Input
                  value={localSettings.phone || ''}
                  onChange={(e) => updateSettings({ phone: e.target.value })}
                  placeholder="(555) 123-4567"
                />
              </div>
              <div>
                <Label>Email</Label>
                <Input
                  value={localSettings.email || ''}
                  onChange={(e) => updateSettings({ email: e.target.value })}
                  placeholder="email@company.com"
                />
              </div>
              <div className="col-span-2">
                <Label>Address</Label>
                <Input
                  value={localSettings.address || ''}
                  onChange={(e) => updateSettings({ address: e.target.value })}
                  placeholder="123 Main St, City, State ZIP"
                />
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Include Company Logo</Label>
                  <p className="text-sm text-gray-500">Show logo on estimates and proposals</p>
                </div>
                <Switch
                  checked={localSettings.includeLogo || false}
                  onCheckedChange={(checked) => updateSettings({ includeLogo: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Auto-save Estimates</Label>
                  <p className="text-sm text-gray-500">Automatically save estimates every 5 minutes</p>
                </div>
                <Switch
                  checked={localSettings.autoSave || false}
                  onCheckedChange={(checked) => updateSettings({ autoSave: checked })}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="calculations" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Default Markup (%)</Label>
                <Input
                  type="number"
                  value={localSettings.defaultMarkup || 15}
                  onChange={(e) => updateSettings({ defaultMarkup: parseFloat(e.target.value) || 0 })}
                  min="0"
                  max="100"
                />
              </div>
              <div>
                <Label>Default Waste Factor (%)</Label>
                <Input
                  type="number"
                  value={localSettings.defaultWasteFactor || 5}
                  onChange={(e) => updateSettings({ defaultWasteFactor: parseFloat(e.target.value) || 0 })}
                  min="0"
                  max="50"
                />
              </div>
              <div>
                <Label>Default Overhead (%)</Label>
                <Input
                  type="number"
                  value={localSettings.defaultOverhead || 10}
                  onChange={(e) => updateSettings({ defaultOverhead: parseFloat(e.target.value) || 0 })}
                  min="0"
                  max="50"
                />
              </div>
              <div>
                <Label>Default Profit Margin (%)</Label>
                <Input
                  type="number"
                  value={localSettings.defaultProfit || 10}
                  onChange={(e) => updateSettings({ defaultProfit: parseFloat(e.target.value) || 0 })}
                  min="0"
                  max="50"
                />
              </div>
              <div>
                <Label>Default Contingency (%)</Label>
                <Input
                  type="number"
                  value={localSettings.defaultContingency || 5}
                  onChange={(e) => updateSettings({ defaultContingency: parseFloat(e.target.value) || 0 })}
                  min="0"
                  max="25"
                />
              </div>
              <div>
                <Label>Tax Rate (%)</Label>
                <Input
                  type="number"
                  value={localSettings.taxRate || 0}
                  onChange={(e) => updateSettings({ taxRate: parseFloat(e.target.value) || 0 })}
                  min="0"
                  max="25"
                  step="0.1"
                />
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Round to Nearest Dollar</Label>
                  <p className="text-sm text-gray-500">Round final totals to whole dollars</p>
                </div>
                <Switch
                  checked={localSettings.roundTotals || false}
                  onCheckedChange={(checked) => updateSettings({ roundTotals: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Include Market Conditions</Label>
                  <p className="text-sm text-gray-500">Apply market condition adjustments to estimates</p>
                </div>
                <Switch
                  checked={localSettings.includeMarketConditions || false}
                  onCheckedChange={(checked) => updateSettings({ includeMarketConditions: checked })}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="templates" className="space-y-4 mt-4">
            <div className="space-y-4">
              <div>
                <Label>Estimate Terms & Conditions</Label>
                <textarea
                  className="w-full mt-2 p-3 border rounded-md resize-none"
                  rows={6}
                  value={localSettings.estimateTerms || ''}
                  onChange={(e) => updateSettings({ estimateTerms: e.target.value })}
                  placeholder="Enter standard terms and conditions for your estimates..."
                />
              </div>
              <div>
                <Label>Payment Terms</Label>
                <Input
                  value={localSettings.paymentTerms || 'Net 30'}
                  onChange={(e) => updateSettings({ paymentTerms: e.target.value })}
                  placeholder="e.g., Net 30, 50% deposit"
                />
              </div>
              <div>
                <Label>Validity Period (days)</Label>
                <Input
                  type="number"
                  value={localSettings.validityPeriod || 30}
                  onChange={(e) => updateSettings({ validityPeriod: parseInt(e.target.value) || 30 })}
                  min="1"
                  max="365"
                />
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Include Warranty Information</Label>
                  <p className="text-sm text-gray-500">Add warranty details to proposals</p>
                </div>
                <Switch
                  checked={localSettings.includeWarranty || false}
                  onCheckedChange={(checked) => updateSettings({ includeWarranty: checked })}
                />
              </div>
              
              {localSettings.includeWarranty && (
                <div className="ml-6 space-y-3 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <Label>Warranty Period</Label>
                    <Input
                      value={localSettings.warrantyPeriod || '1 year'}
                      onChange={(e) => updateSettings({ warrantyPeriod: e.target.value })}
                      placeholder="e.g., 1 year, 5 years, 10 years"
                    />
                  </div>
                  <div>
                    <Label>Warranty Coverage</Label>
                    <textarea
                      className="w-full mt-2 p-3 border rounded-md resize-none"
                      rows={3}
                      value={localSettings.warrantyCoverage || ''}
                      onChange={(e) => updateSettings({ warrantyCoverage: e.target.value })}
                      placeholder="What does the warranty cover? (e.g., Materials and workmanship, structural defects, etc.)"
                    />
                  </div>
                  <div>
                    <Label>Warranty Exclusions</Label>
                    <textarea
                      className="w-full mt-2 p-3 border rounded-md resize-none"
                      rows={3}
                      value={localSettings.warrantyExclusions || ''}
                      onChange={(e) => updateSettings({ warrantyExclusions: e.target.value })}
                      placeholder="What is NOT covered? (e.g., Normal wear and tear, acts of nature, improper maintenance, etc.)"
                    />
                  </div>
                  <div>
                    <Label>Warranty Contact Information</Label>
                    <Input
                      value={localSettings.warrantyContact || ''}
                      onChange={(e) => updateSettings({ warrantyContact: e.target.value })}
                      placeholder="Phone number or email for warranty claims"
                    />
                  </div>
                </div>
              )}
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>Show Detailed Breakdown</Label>
                  <p className="text-sm text-gray-500">Include itemized costs in client proposals</p>
                </div>
                <Switch
                  checked={localSettings.showDetailedBreakdown !== false}
                  onCheckedChange={(checked) => updateSettings({ showDetailedBreakdown: checked })}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}; 