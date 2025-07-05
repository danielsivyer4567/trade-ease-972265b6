import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Trash2, Truck, Fuel, Wrench } from 'lucide-react';
import { EquipmentItem } from '../types';
import { equipmentTypes } from '../materialDatabase';
import { calculateEquipmentCost } from '../utils';

interface EquipmentInputProps {
  equipment: EquipmentItem[];
  onChange: (equipment: EquipmentItem[]) => void;
}

export const EquipmentInput: React.FC<EquipmentInputProps> = ({ equipment, onChange }) => {
  const [newEquipment, setNewEquipment] = useState<Partial<EquipmentItem>>({
    name: '',
    type: 'rented',
    dailyRate: 0,
    days: 1,
    mobilization: 0,
    demobilization: 0,
    operator: false,
    operatorRate: 0,
    fuelCost: 0,
    maintenanceCost: 0
  });

  const addEquipment = () => {
    if (newEquipment.name && newEquipment.dailyRate) {
      const equipmentItem: EquipmentItem = {
        id: Date.now().toString(),
        name: newEquipment.name,
        type: newEquipment.type || 'rented',
        dailyRate: newEquipment.dailyRate,
        days: newEquipment.days || 1,
        mobilization: newEquipment.mobilization || 0,
        demobilization: newEquipment.demobilization || 0,
        operator: newEquipment.operator || false,
        operatorRate: newEquipment.operatorRate || 0,
        fuelCost: newEquipment.fuelCost || 0,
        maintenanceCost: newEquipment.maintenanceCost || 0
      };
      onChange([...equipment, equipmentItem]);
      setNewEquipment({
        name: '',
        type: 'rented',
        dailyRate: 0,
        days: 1,
        mobilization: 0,
        demobilization: 0,
        operator: false,
        operatorRate: 0,
        fuelCost: 0,
        maintenanceCost: 0
      });
    }
  };

  const updateEquipment = (id: string, field: keyof EquipmentItem, value: any) => {
    onChange(equipment.map(e => e.id === id ? { ...e, [field]: value } : e));
  };

  const removeEquipment = (id: string) => {
    onChange(equipment.filter(e => e.id !== id));
  };

  const handleEquipmentSelect = (name: string) => {
    const selected = equipmentTypes.find(e => e.name === name);
    if (selected) {
      setNewEquipment({
        ...newEquipment,
        name: selected.name,
        dailyRate: selected.dailyRate,
        mobilization: selected.mobilization,
        demobilization: selected.mobilization
      });
    }
  };

  const totalEquipmentCost = equipment.reduce((sum, e) => sum + calculateEquipmentCost(e), 0);
  const totalDays = equipment.reduce((sum, e) => sum + e.days, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Truck className="h-5 w-5" />
            Equipment
          </div>
          <div className="text-sm font-normal">
            Total: ${totalEquipmentCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-lg">
            <div>
              <Label>Equipment</Label>
              <Select value={newEquipment.name} onValueChange={handleEquipmentSelect}>
                <SelectTrigger>
                  <SelectValue placeholder="Select equipment" />
                </SelectTrigger>
                <SelectContent>
                  {equipmentTypes.map(eq => (
                    <SelectItem key={eq.name} value={eq.name}>{eq.name}</SelectItem>
                  ))}
                  <SelectItem value="custom">Custom Equipment</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Type</Label>
              <Select 
                value={newEquipment.type} 
                onValueChange={(value) => setNewEquipment({ ...newEquipment, type: value as 'owned' | 'rented' | 'leased' })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="owned">Owned</SelectItem>
                  <SelectItem value="rented">Rented</SelectItem>
                  <SelectItem value="leased">Leased</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button onClick={addEquipment} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add Equipment
              </Button>
            </div>
          </div>

          {equipment.length > 0 && (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Equipment</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Days</TableHead>
                    <TableHead>Daily Rate</TableHead>
                    <TableHead>Mobilization</TableHead>
                    <TableHead>Operator</TableHead>
                    <TableHead>Fuel/Day</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {equipment.map(item => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>
                        <span className="text-xs px-2 py-1 rounded bg-gray-100">
                          {item.type}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={item.days}
                          onChange={(e) => updateEquipment(item.id, 'days', parseInt(e.target.value) || 1)}
                          className="w-16"
                          min="1"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={item.dailyRate}
                          onChange={(e) => updateEquipment(item.id, 'dailyRate', parseFloat(e.target.value) || 0)}
                          className="w-24"
                          step="10"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={item.mobilization}
                          onChange={(e) => updateEquipment(item.id, 'mobilization', parseFloat(e.target.value) || 0)}
                          className="w-20"
                        />
                      </TableCell>
                      <TableCell>
                        <input
                          type="checkbox"
                          checked={item.operator}
                          onChange={(e) => updateEquipment(item.id, 'operator', e.target.checked)}
                          className="rounded"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={item.fuelCost || 0}
                          onChange={(e) => updateEquipment(item.id, 'fuelCost', parseFloat(e.target.value) || 0)}
                          className="w-20"
                        />
                      </TableCell>
                      <TableCell className="font-semibold">
                        ${calculateEquipmentCost(item).toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeEquipment(item.id)}
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
                <Truck className="h-4 w-4" />
                <span>Total Equipment Days</span>
              </div>
              <div className="text-lg font-semibold">{totalDays}</div>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 text-gray-600 mb-1">
                <Fuel className="h-4 w-4" />
                <span>Total Fuel Cost</span>
              </div>
              <div className="text-lg font-semibold">
                ${equipment.reduce((sum, e) => sum + (e.fuelCost || 0) * e.days, 0).toFixed(2)}
              </div>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 text-gray-600 mb-1">
                <Wrench className="h-4 w-4" />
                <span>Mobilization</span>
              </div>
              <div className="text-lg font-semibold">
                ${equipment.reduce((sum, e) => sum + e.mobilization + e.demobilization, 0).toFixed(2)}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}; 