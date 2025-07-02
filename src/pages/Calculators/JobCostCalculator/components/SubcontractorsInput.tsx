import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Users2, Shield, Star, FileText } from 'lucide-react';
import { SubcontractorItem, SubcontractorBid } from '../types';
import { calculateSubcontractorCost } from '../utils';

interface SubcontractorsInputProps {
  subcontractors: SubcontractorItem[];
  onChange: (subcontractors: SubcontractorItem[]) => void;
}

const trades = [
  'Electrical',
  'Plumbing',
  'HVAC',
  'Roofing',
  'Flooring',
  'Painting',
  'Drywall',
  'Landscaping',
  'Concrete',
  'Steel Erection',
  'Glazing',
  'Insulation',
  'Fire Protection',
  'Elevator',
  'Other'
];

export const SubcontractorsInput: React.FC<SubcontractorsInputProps> = ({ 
  subcontractors, 
  onChange 
}) => {
  const [showDialog, setShowDialog] = useState(false);
  const [showBidsDialog, setShowBidsDialog] = useState(false);
  const [selectedSubId, setSelectedSubId] = useState<string>('');
  const [newSubcontractor, setNewSubcontractor] = useState<Partial<SubcontractorItem>>({
    trade: '',
    scope: '',
    amount: 0,
    retention: 10,
    insurance: true,
    bonded: false,
    previousPerformance: 4
  });
  const [newBid, setNewBid] = useState<SubcontractorBid>({
    company: '',
    amount: 0,
    rating: 4,
    completedProjects: 0
  });

  const addSubcontractor = () => {
    if (newSubcontractor.trade && newSubcontractor.scope && newSubcontractor.amount) {
      const subcontractor: SubcontractorItem = {
        id: Date.now().toString(),
        trade: newSubcontractor.trade,
        scope: newSubcontractor.scope,
        amount: newSubcontractor.amount,
        retention: newSubcontractor.retention || 10,
        insurance: newSubcontractor.insurance !== false,
        bonded: newSubcontractor.bonded || false,
        previousPerformance: newSubcontractor.previousPerformance || 4,
        alternativeBids: []
      };
      onChange([...subcontractors, subcontractor]);
      setNewSubcontractor({
        trade: '',
        scope: '',
        amount: 0,
        retention: 10,
        insurance: true,
        bonded: false,
        previousPerformance: 4
      });
      setShowDialog(false);
    }
  };

  const updateSubcontractor = (id: string, field: keyof SubcontractorItem, value: any) => {
    onChange(subcontractors.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const removeSubcontractor = (id: string) => {
    onChange(subcontractors.filter(s => s.id !== id));
  };

  const addAlternativeBid = () => {
    if (newBid.company && newBid.amount > 0) {
      const sub = subcontractors.find(s => s.id === selectedSubId);
      if (sub) {
        const updatedBids = [...(sub.alternativeBids || []), newBid];
        updateSubcontractor(selectedSubId, 'alternativeBids', updatedBids);
        setNewBid({ company: '', amount: 0, rating: 4, completedProjects: 0 });
        setShowBidsDialog(false);
      }
    }
  };

  const totalSubcontractorsCost = subcontractors.reduce(
    (sum, s) => sum + calculateSubcontractorCost(s), 
    0
  );

  const getPerformanceColor = (rating?: number) => {
    if (!rating) return 'gray';
    if (rating >= 4.5) return 'green';
    if (rating >= 3.5) return 'yellow';
    return 'red';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users2 className="h-5 w-5" />
            Subcontractors
          </div>
          <div className="text-sm font-normal">
            Total: ${totalSubcontractorsCost.toLocaleString('en-US', { 
              minimumFractionDigits: 2, 
              maximumFractionDigits: 2 
            })}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Button onClick={() => setShowDialog(true)} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add Subcontractor
          </Button>

          {subcontractors.length > 0 && (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Trade</TableHead>
                    <TableHead>Scope</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Retention</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Performance</TableHead>
                    <TableHead>Bids</TableHead>
                    <TableHead>Net Cost</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {subcontractors.map(sub => (
                    <TableRow key={sub.id}>
                      <TableCell className="font-medium">{sub.trade}</TableCell>
                      <TableCell className="max-w-xs truncate">{sub.scope}</TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={sub.amount}
                          onChange={(e) => updateSubcontractor(sub.id, 'amount', parseFloat(e.target.value) || 0)}
                          className="w-28"
                          step="100"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={sub.retention}
                          onChange={(e) => updateSubcontractor(sub.id, 'retention', parseFloat(e.target.value) || 0)}
                          className="w-16"
                          min="0"
                          max="20"
                        />
                        %
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {sub.insurance && (
                            <Badge variant="outline" className="text-xs">
                              <Shield className="h-3 w-3 mr-1" />
                              Ins
                            </Badge>
                          )}
                          {sub.bonded && (
                            <Badge variant="outline" className="text-xs">
                              <FileText className="h-3 w-3 mr-1" />
                              Bond
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Star 
                            className={`h-4 w-4 fill-current text-${getPerformanceColor(sub.previousPerformance)}-500`}
                          />
                          <span className="text-sm">{sub.previousPerformance?.toFixed(1) || 'N/A'}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedSubId(sub.id);
                            setShowBidsDialog(true);
                          }}
                        >
                          {sub.alternativeBids?.length || 0} bids
                        </Button>
                      </TableCell>
                      <TableCell className="font-semibold">
                        ${calculateSubcontractorCost(sub).toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeSubcontractor(sub.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {subcontractors.some(s => !s.insurance || !s.bonded) && (
            <div className="flex items-center gap-2 p-3 bg-yellow-50 rounded-lg">
              <Shield className="h-4 w-4 text-yellow-600" />
              <span className="text-sm text-yellow-800">
                Some subcontractors lack insurance or bonding. Consider the additional risk.
              </span>
            </div>
          )}

          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="text-gray-600 mb-1">Total Trades</div>
              <div className="text-lg font-semibold">{subcontractors.length}</div>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="text-gray-600 mb-1">Avg Retention</div>
              <div className="text-lg font-semibold">
                {subcontractors.length > 0 
                  ? (subcontractors.reduce((sum, s) => sum + s.retention, 0) / subcontractors.length).toFixed(1)
                  : '0'}%
              </div>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="text-gray-600 mb-1">Total Retention</div>
              <div className="text-lg font-semibold">
                ${subcontractors.reduce((sum, s) => sum + (s.amount * s.retention / 100), 0).toFixed(2)}
              </div>
            </div>
          </div>
        </div>

        {/* Add Subcontractor Dialog */}
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Subcontractor</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Trade</Label>
                <Select
                  value={newSubcontractor.trade}
                  onValueChange={(value) => setNewSubcontractor({ ...newSubcontractor, trade: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select trade" />
                  </SelectTrigger>
                  <SelectContent>
                    {trades.map(trade => (
                      <SelectItem key={trade} value={trade}>{trade}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Scope of Work</Label>
                <Input
                  value={newSubcontractor.scope}
                  onChange={(e) => setNewSubcontractor({ ...newSubcontractor, scope: e.target.value })}
                  placeholder="Describe the work scope"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Contract Amount ($)</Label>
                  <Input
                    type="number"
                    value={newSubcontractor.amount}
                    onChange={(e) => setNewSubcontractor({ ...newSubcontractor, amount: parseFloat(e.target.value) || 0 })}
                    step="1000"
                  />
                </div>
                <div>
                  <Label>Retention %</Label>
                  <Input
                    type="number"
                    value={newSubcontractor.retention}
                    onChange={(e) => setNewSubcontractor({ ...newSubcontractor, retention: parseFloat(e.target.value) || 0 })}
                    min="0"
                    max="20"
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="insurance"
                    checked={newSubcontractor.insurance}
                    onChange={(e) => setNewSubcontractor({ ...newSubcontractor, insurance: e.target.checked })}
                    className="rounded"
                  />
                  <Label htmlFor="insurance">Insured</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="bonded"
                    checked={newSubcontractor.bonded}
                    onChange={(e) => setNewSubcontractor({ ...newSubcontractor, bonded: e.target.checked })}
                    className="rounded"
                  />
                  <Label htmlFor="bonded">Bonded</Label>
                </div>
                <div>
                  <Label>Performance</Label>
                  <Input
                    type="number"
                    value={newSubcontractor.previousPerformance}
                    onChange={(e) => setNewSubcontractor({ ...newSubcontractor, previousPerformance: parseFloat(e.target.value) || 0 })}
                    min="1"
                    max="5"
                    step="0.1"
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDialog(false)}>Cancel</Button>
              <Button onClick={addSubcontractor}>Add Subcontractor</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Alternative Bids Dialog */}
        <Dialog open={showBidsDialog} onOpenChange={setShowBidsDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Alternative Bids</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {subcontractors.find(s => s.id === selectedSubId)?.alternativeBids?.map((bid, idx) => (
                <div key={idx} className="p-3 border rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">{bid.company}</div>
                      <div className="text-sm text-gray-600">
                        {bid.completedProjects} projects • Rating: {bid.rating}/5
                      </div>
                    </div>
                    <div className="text-lg font-semibold">${bid.amount.toFixed(2)}</div>
                  </div>
                </div>
              ))}
              <div className="border-t pt-4">
                <h4 className="font-medium mb-3">Add New Bid</h4>
                <div className="space-y-3">
                  <Input
                    placeholder="Company name"
                    value={newBid.company}
                    onChange={(e) => setNewBid({ ...newBid, company: e.target.value })}
                  />
                  <div className="grid grid-cols-3 gap-3">
                    <Input
                      type="number"
                      placeholder="Amount"
                      value={newBid.amount || ''}
                      onChange={(e) => setNewBid({ ...newBid, amount: parseFloat(e.target.value) || 0 })}
                    />
                    <Input
                      type="number"
                      placeholder="Rating"
                      value={newBid.rating}
                      onChange={(e) => setNewBid({ ...newBid, rating: parseFloat(e.target.value) || 0 })}
                      min="1"
                      max="5"
                      step="0.1"
                    />
                    <Input
                      type="number"
                      placeholder="Projects"
                      value={newBid.completedProjects}
                      onChange={(e) => setNewBid({ ...newBid, completedProjects: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowBidsDialog(false)}>Close</Button>
              <Button onClick={addAlternativeBid}>Add Bid</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}; 