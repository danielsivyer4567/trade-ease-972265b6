import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Trash2, Users, TrendingDown, Clock } from 'lucide-react';
import { LaborItem } from '../types';
import { laborTrades, laborRates } from '../materialDatabase';
import { calculateLaborCost } from '../utils';

interface LaborInputProps {
  labor: LaborItem[];
  onChange: (labor: LaborItem[]) => void;
}

export const LaborInput: React.FC<LaborInputProps> = ({ labor, onChange }) => {
  const [newLabor, setNewLabor] = useState<Partial<LaborItem>>({
    trade: '',
    description: '',
    workers: 1,
    hours: 8,
    rate: 0,
    overtime: 0,
    productivity: 100,
    skillLevel: 'journeyman'
  });

  const addLabor = () => {
    if (newLabor.trade && newLabor.description) {
      const laborItem: LaborItem = {
        id: Date.now().toString(),
        trade: newLabor.trade,
        description: newLabor.description,
        workers: newLabor.workers || 1,
        hours: newLabor.hours || 8,
        rate: newLabor.rate || laborRates[newLabor.trade as keyof typeof laborRates]?.[newLabor.skillLevel || 'journeyman'] || 35,
        overtime: newLabor.overtime || 0,
        productivity: newLabor.productivity || 100,
        skillLevel: newLabor.skillLevel || 'journeyman'
      };
      onChange([...labor, laborItem]);
      setNewLabor({
        trade: '',
        description: '',
        workers: 1,
        hours: 8,
        rate: 0,
        overtime: 0,
        productivity: 100,
        skillLevel: 'journeyman'
      });
    }
  };

  const updateLabor = (id: string, field: keyof LaborItem, value: any) => {
    onChange(labor.map(l => l.id === id ? { ...l, [field]: value } : l));
  };

  const removeLabor = (id: string) => {
    onChange(labor.filter(l => l.id !== id));
  };

  const handleTradeChange = (trade: string) => {
    const rate = laborRates[trade as keyof typeof laborRates]?.[newLabor.skillLevel || 'journeyman'] || 35;
    setNewLabor({
      ...newLabor,
      trade,
      rate
    });
  };

  const totalLaborCost = labor.reduce((sum, l) => sum + calculateLaborCost(l), 0);
  const totalHours = labor.reduce((sum, l) => sum + (l.hours * l.workers), 0);
  const avgProductivity = labor.length > 0 
    ? labor.reduce((sum, l) => sum + l.productivity, 0) / labor.length 
    : 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Labor
          </div>
          <div className="text-sm font-normal space-x-4">
            <span>Total Hours: {totalHours}</span>
            <span>Cost: ${totalLaborCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-lg">
            <div>
              <Label>Trade</Label>
              <Select
                value={newLabor.trade}
                onValueChange={(value) => {
                  const rate = laborRates[value]?.[newLabor.skillLevel || 'journeyman'] || 35;
                  setNewLabor({ ...newLabor, trade: value, rate });
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select trade" />
                </SelectTrigger>
                <SelectContent>
                  {laborTrades.map(trade => (
                    <SelectItem key={trade} value={trade}>{trade}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Description</Label>
              <Input
                value={newLabor.description}
                onChange={(e) => setNewLabor({ ...newLabor, description: e.target.value })}
                placeholder="Task description"
              />
            </div>
            <div>
              <Label>Workers</Label>
              <Input
                type="number"
                value={newLabor.workers}
                onChange={(e) => setNewLabor({ ...newLabor, workers: parseInt(e.target.value) || 1 })}
                min="1"
              />
            </div>
            <div className="flex items-end">
              <Button onClick={addLabor} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add Labor
              </Button>
            </div>
          </div>

          {avgProductivity < 80 && labor.length > 0 && (
            <div className="flex items-center gap-2 p-3 bg-orange-50 rounded-lg">
              <TrendingDown className="h-4 w-4 text-orange-600" />
              <span className="text-sm text-orange-800">
                Average productivity is below 80%. Consider training or equipment improvements.
              </span>
            </div>
          )}

          {labor.length > 0 && (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Trade</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Workers</TableHead>
                    <TableHead>Hours</TableHead>
                    <TableHead>Rate/Hr</TableHead>
                    <TableHead>OT %</TableHead>
                    <TableHead>Productivity %</TableHead>
                    <TableHead>Skill</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {labor.map(item => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.trade}</TableCell>
                      <TableCell>{item.description}</TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={item.workers}
                          onChange={(e) => updateLabor(item.id, 'workers', parseInt(e.target.value) || 1)}
                          className="w-16"
                          min="1"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={item.hours}
                          onChange={(e) => updateLabor(item.id, 'hours', parseFloat(e.target.value) || 0)}
                          className="w-20"
                          step="0.5"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={item.rate}
                          onChange={(e) => updateLabor(item.id, 'rate', parseFloat(e.target.value) || 0)}
                          className="w-20"
                          step="0.01"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={item.overtime}
                          onChange={(e) => updateLabor(item.id, 'overtime', parseFloat(e.target.value) || 0)}
                          className="w-16"
                          min="0"
                          max="100"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={item.productivity}
                          onChange={(e) => updateLabor(item.id, 'productivity', parseFloat(e.target.value) || 100)}
                          className="w-20"
                          min="1"
                          max="150"
                        />
                      </TableCell>
                      <TableCell>
                        <Select 
                          value={item.skillLevel} 
                          onValueChange={(value) => updateLabor(item.id, 'skillLevel', value)}
                        >
                          <SelectTrigger className="w-24">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="apprentice">Apprentice</SelectItem>
                            <SelectItem value="journeyman">Journeyman</SelectItem>
                            <SelectItem value="master">Master</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="font-semibold">
                        ${calculateLaborCost(item).toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeLabor(item.id)}
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

          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 text-gray-600 mb-1">
                <Clock className="h-4 w-4" />
                <span>Total Labor Hours</span>
              </div>
              <div className="text-lg font-semibold">{totalHours}</div>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="text-gray-600 mb-1">Average Rate</div>
              <div className="text-lg font-semibold">
                ${labor.length > 0 ? (labor.reduce((sum, l) => sum + l.rate, 0) / labor.length).toFixed(2) : '0.00'}/hr
              </div>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="text-gray-600 mb-1">Productivity</div>
              <div className="text-lg font-semibold">{avgProductivity.toFixed(0)}%</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}; 