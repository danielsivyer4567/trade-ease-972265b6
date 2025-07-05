import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Plus, Trash2, Calculator, AlertTriangle, TrendingUp, Shield } from 'lucide-react';
import { OverheadItem, RiskItem } from '../types';
import { overheadCategories, riskCategories } from '../materialDatabase';
import { calculateRiskScore } from '../utils';

interface OverheadRiskInputProps {
  overhead: OverheadItem[];
  risks: RiskItem[];
  onOverheadChange: (overhead: OverheadItem[]) => void;
  onRisksChange: (risks: RiskItem[]) => void;
  subtotal: number;
}

export const OverheadRiskInput: React.FC<OverheadRiskInputProps> = ({
  overhead,
  risks,
  onOverheadChange,
  onRisksChange,
  subtotal
}) => {
  const [activeTab, setActiveTab] = useState('overhead');
  const [newOverhead, setNewOverhead] = useState<Partial<OverheadItem>>({
    category: '',
    description: '',
    amount: 0,
    allocation: 'percentage',
    percentage: 0
  });
  const [newRisk, setNewRisk] = useState<Partial<RiskItem>>({
    category: '',
    description: '',
    probability: 20,
    impact: 10000,
    mitigation: '',
    contingency: 0
  });

  // Overhead functions
  const addOverhead = () => {
    if (newOverhead.category && newOverhead.description) {
      const overheadItem: OverheadItem = {
        id: Date.now().toString(),
        category: newOverhead.category,
        description: newOverhead.description,
        amount: newOverhead.amount || 0,
        allocation: newOverhead.allocation || 'percentage',
        percentage: newOverhead.percentage || 0
      };
      onOverheadChange([...overhead, overheadItem]);
      setNewOverhead({
        category: '',
        description: '',
        amount: 0,
        allocation: 'percentage',
        percentage: 0
      });
    }
  };

  const updateOverhead = (id: string, field: keyof OverheadItem, value: any) => {
    onOverheadChange(overhead.map(o => o.id === id ? { ...o, [field]: value } : o));
  };

  const removeOverhead = (id: string) => {
    onOverheadChange(overhead.filter(o => o.id !== id));
  };

  const handleCategorySelect = (category: string) => {
    const template = overheadCategories.find(c => c.name === category);
    if (template) {
      setNewOverhead({
        ...newOverhead,
        category: template.name,
        allocation: template.type as 'fixed' | 'percentage',
        percentage: template.type === 'percentage' ? template.default : 0,
        amount: template.type === 'fixed' ? template.default : 0
      });
    }
  };

  // Risk functions
  const addRisk = () => {
    if (newRisk.category && newRisk.description) {
      const riskItem: RiskItem = {
        id: Date.now().toString(),
        category: newRisk.category,
        description: newRisk.description,
        probability: newRisk.probability || 20,
        impact: newRisk.impact || 10000,
        mitigation: newRisk.mitigation || '',
        contingency: calculateRiskScore({
          ...newRisk,
          id: '',
          category: newRisk.category || '',
          description: newRisk.description || '',
          probability: newRisk.probability || 20,
          impact: newRisk.impact || 10000,
          mitigation: newRisk.mitigation || '',
          contingency: (newRisk.probability || 20) * (newRisk.impact || 10000) / 100
        })
      };
      onRisksChange([...risks, riskItem]);
      setNewRisk({
        category: '',
        description: '',
        probability: 20,
        impact: 10000,
        mitigation: '',
        contingency: 0
      });
    }
  };

  const updateRisk = (id: string, field: keyof RiskItem, value: any) => {
    const updatedRisks = risks.map(r => {
      if (r.id === id) {
        const updated = { ...r, [field]: value };
        // Recalculate contingency when probability or impact changes
        if (field === 'probability' || field === 'impact') {
          updated.contingency = calculateRiskScore(updated);
        }
        return updated;
      }
      return r;
    });
    onRisksChange(updatedRisks);
  };

  const removeRisk = (id: string) => {
    onRisksChange(risks.filter(r => r.id !== id));
  };

  const handleRiskCategorySelect = (category: string) => {
    const template = riskCategories.find(c => c.name === category);
    if (template) {
      setNewRisk({
        ...newRisk,
        category: template.name,
        probability: template.probability,
        impact: template.impact,
        mitigation: template.mitigation
      });
    }
  };

  // Calculations
  const totalOverhead = overhead.reduce((sum, o) => {
    if (o.allocation === 'fixed') {
      return sum + o.amount;
    } else {
      return sum + (subtotal * (o.percentage || 0) / 100);
    }
  }, 0);

  const totalRiskContingency = risks.reduce((sum, r) => sum + r.contingency, 0);

  const getRiskLevel = (score: number) => {
    if (score < 1000) return { label: 'Low', color: 'green' };
    if (score < 5000) return { label: 'Medium', color: 'yellow' };
    return { label: 'High', color: 'red' };
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="overhead">
            <Calculator className="h-4 w-4 mr-2" />
            Overhead
          </TabsTrigger>
          <TabsTrigger value="risk">
            <AlertTriangle className="h-4 w-4 mr-2" />
            Risk Management
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overhead" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Overhead Costs</span>
                <span className="text-sm font-normal">
                  Total: ${totalOverhead.toLocaleString('en-US', { 
                    minimumFractionDigits: 2, 
                    maximumFractionDigits: 2 
                  })}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-lg">
                  <div>
                    <Label>Category</Label>
                    <Select value={newOverhead.category} onValueChange={handleCategorySelect}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {overheadCategories.map(cat => (
                          <SelectItem key={cat.name} value={cat.name}>{cat.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Input
                      value={newOverhead.description}
                      onChange={(e) => setNewOverhead({ ...newOverhead, description: e.target.value })}
                      placeholder="Description"
                    />
                  </div>
                  <div className="flex items-end">
                    <Button onClick={addOverhead} className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Overhead
                    </Button>
                  </div>
                </div>

                {overhead.length > 0 && (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Category</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Amount/Percentage</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {overhead.map(item => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.category}</TableCell>
                          <TableCell>{item.description}</TableCell>
                          <TableCell>
                            <Select 
                              value={item.allocation} 
                              onValueChange={(value) => updateOverhead(item.id, 'allocation', value)}
                            >
                              <SelectTrigger className="w-24">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="fixed">Fixed</SelectItem>
                                <SelectItem value="percentage">%</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            {item.allocation === 'fixed' ? (
                              <Input
                                type="number"
                                value={item.amount}
                                onChange={(e) => updateOverhead(item.id, 'amount', parseFloat(e.target.value) || 0)}
                                className="w-24"
                                step="100"
                              />
                            ) : (
                              <div className="flex items-center gap-1">
                                <Input
                                  type="number"
                                  value={item.percentage}
                                  onChange={(e) => updateOverhead(item.id, 'percentage', parseFloat(e.target.value) || 0)}
                                  className="w-16"
                                  step="0.5"
                                />
                                <span>%</span>
                              </div>
                            )}
                          </TableCell>
                          <TableCell className="font-semibold">
                            ${item.allocation === 'fixed' 
                              ? item.amount.toFixed(2)
                              : (subtotal * (item.percentage || 0) / 100).toFixed(2)
                            }
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeOverhead(item.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}

                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                    <span className="font-medium text-blue-900">Overhead Analysis</span>
                  </div>
                  <div className="text-sm text-blue-800">
                    Overhead represents {subtotal > 0 ? ((totalOverhead / subtotal) * 100).toFixed(1) : '0'}% of direct costs.
                    {totalOverhead / subtotal > 0.15 && ' Consider ways to reduce overhead costs.'}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="risk" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Risk Assessment</span>
                <span className="text-sm font-normal">
                  Contingency: ${totalRiskContingency.toLocaleString('en-US', { 
                    minimumFractionDigits: 2, 
                    maximumFractionDigits: 2 
                  })}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg">
                  <div>
                    <Label>Risk Category</Label>
                    <Select value={newRisk.category} onValueChange={handleRiskCategorySelect}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select risk category" />
                      </SelectTrigger>
                      <SelectContent>
                        {riskCategories.map(cat => (
                          <SelectItem key={cat.name} value={cat.name}>{cat.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Input
                      value={newRisk.description}
                      onChange={(e) => setNewRisk({ ...newRisk, description: e.target.value })}
                      placeholder="Risk description"
                    />
                  </div>
                  <div>
                    <Label>Mitigation Strategy</Label>
                    <Textarea
                      value={newRisk.mitigation}
                      onChange={(e) => setNewRisk({ ...newRisk, mitigation: e.target.value })}
                      placeholder="How will you mitigate this risk?"
                      rows={2}
                    />
                  </div>
                  <div className="flex items-end">
                    <Button onClick={addRisk} className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Risk
                    </Button>
                  </div>
                </div>

                {risks.length > 0 && (
                  <div className="space-y-3">
                    {risks.map(risk => {
                      const riskLevel = getRiskLevel(risk.contingency);
                      return (
                        <div key={risk.id} className="border rounded-lg p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-medium">{risk.category}</span>
                                <span className={`text-xs px-2 py-1 rounded bg-${riskLevel.color}-100 text-${riskLevel.color}-800`}>
                                  {riskLevel.label} Risk
                                </span>
                              </div>
                              <p className="text-sm text-gray-600">{risk.description}</p>
                              {risk.mitigation && (
                                <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
                                  <span className="font-medium">Mitigation: </span>
                                  {risk.mitigation}
                                </div>
                              )}
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeRisk(risk.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          
                          <div className="grid grid-cols-3 gap-4">
                            <div>
                              <Label className="text-xs">Probability (%)</Label>
                              <div className="flex items-center gap-2">
                                <Input
                                  type="number"
                                  value={risk.probability}
                                  onChange={(e) => updateRisk(risk.id, 'probability', parseFloat(e.target.value) || 0)}
                                  className="w-20"
                                  min="0"
                                  max="100"
                                />
                                <Progress value={risk.probability} className="flex-1" />
                              </div>
                            </div>
                            <div>
                              <Label className="text-xs">Impact ($)</Label>
                              <Input
                                type="number"
                                value={risk.impact}
                                onChange={(e) => updateRisk(risk.id, 'impact', parseFloat(e.target.value) || 0)}
                                step="1000"
                              />
                            </div>
                            <div>
                              <Label className="text-xs">Contingency</Label>
                              <div className="text-lg font-semibold mt-1">
                                ${risk.contingency.toFixed(2)}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {risks.length > 0 && (
                  <div className="p-4 bg-yellow-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="h-5 w-5 text-yellow-600" />
                      <span className="font-medium text-yellow-900">Risk Summary</span>
                    </div>
                    <div className="text-sm text-yellow-800 space-y-1">
                      <div>Total identified risks: {risks.length}</div>
                      <div>High risk items: {risks.filter(r => r.contingency >= 5000).length}</div>
                      <div>Recommended contingency: {subtotal > 0 ? ((totalRiskContingency / subtotal) * 100).toFixed(1) : '0'}% of direct costs</div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}; 