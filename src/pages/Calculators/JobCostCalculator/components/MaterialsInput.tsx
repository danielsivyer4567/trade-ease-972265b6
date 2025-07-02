import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Trash2, Package, Search, TrendingUp, AlertCircle } from 'lucide-react';
import { MaterialItem } from '../types';
import { materialCategories, commonMaterials } from '../materialDatabase';
import { calculateMaterialCost } from '../utils';

interface MaterialsInputProps {
  materials: MaterialItem[];
  onChange: (materials: MaterialItem[]) => void;
}

export const MaterialsInput: React.FC<MaterialsInputProps> = ({ materials, onChange }) => {
  const [showDialog, setShowDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [newMaterial, setNewMaterial] = useState<Partial<MaterialItem>>({
    category: '',
    name: '',
    unit: 'EA',
    quantity: 1,
    unitCost: 0,
    markup: 10,
    wasteFactor: 5
  });

  const addMaterial = () => {
    if (newMaterial.name && newMaterial.unitCost) {
      const material: MaterialItem = {
        id: Date.now().toString(),
        category: newMaterial.category || 'General',
        name: newMaterial.name,
        unit: newMaterial.unit || 'EA',
        quantity: newMaterial.quantity || 1,
        unitCost: newMaterial.unitCost,
        markup: newMaterial.markup || 10,
        wasteFactor: newMaterial.wasteFactor || 5
      };
      onChange([...materials, material]);
      setNewMaterial({
        category: '',
        name: '',
        unit: 'EA',
        quantity: 1,
        unitCost: 0,
        markup: 10,
        wasteFactor: 5
      });
      setShowDialog(false);
    }
  };

  const addFromDatabase = (material: any) => {
    const newItem: MaterialItem = {
      id: Date.now().toString(),
      category: selectedCategory,
      name: material.name,
      unit: material.unit,
      quantity: 1,
      unitCost: material.basePrice,
      markup: 10,
      wasteFactor: material.wasteFactor
    };
    onChange([...materials, newItem]);
  };

  const updateMaterial = (id: string, field: keyof MaterialItem, value: any) => {
    onChange(materials.map(m => m.id === id ? { ...m, [field]: value } : m));
  };

  const removeMaterial = (id: string) => {
    onChange(materials.filter(m => m.id !== id));
  };

  const filteredMaterials = selectedCategory && commonMaterials[selectedCategory as keyof typeof commonMaterials]
    ? commonMaterials[selectedCategory as keyof typeof commonMaterials].filter(m =>
        m.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  const totalMaterialsCost = materials.reduce((sum, m) => sum + calculateMaterialCost(m), 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Materials
          </div>
          <div className="text-sm font-normal">
            Total: ${totalMaterialsCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex gap-2">
            <Button onClick={() => setShowDialog(true)} className="flex-1">
              <Plus className="h-4 w-4 mr-2" />
              Add Material
            </Button>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Quick Add from Database" />
              </SelectTrigger>
              <SelectContent>
                {materialCategories.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedCategory && (
            <div className="border rounded-lg p-3 space-y-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search materials..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
              <div className="max-h-40 overflow-y-auto space-y-1">
                {filteredMaterials.map((mat, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2 hover:bg-gray-50 rounded cursor-pointer"
                    onClick={() => addFromDatabase(mat)}
                  >
                    <span className="text-sm">{mat.name}</span>
                    <span className="text-sm text-muted-foreground">
                      ${mat.basePrice}/{mat.unit}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {materials.length > 0 && (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Material</TableHead>
                    <TableHead>Qty</TableHead>
                    <TableHead>Unit</TableHead>
                    <TableHead>Unit Cost</TableHead>
                    <TableHead>Markup %</TableHead>
                    <TableHead>Waste %</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {materials.map(material => (
                    <TableRow key={material.id}>
                      <TableCell className="font-medium">{material.name}</TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={material.quantity}
                          onChange={(e) => updateMaterial(material.id, 'quantity', parseFloat(e.target.value) || 0)}
                          className="w-20"
                        />
                      </TableCell>
                      <TableCell>{material.unit}</TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={material.unitCost}
                          onChange={(e) => updateMaterial(material.id, 'unitCost', parseFloat(e.target.value) || 0)}
                          className="w-24"
                          step="0.01"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={material.markup}
                          onChange={(e) => updateMaterial(material.id, 'markup', parseFloat(e.target.value) || 0)}
                          className="w-16"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={material.wasteFactor}
                          onChange={(e) => updateMaterial(material.id, 'wasteFactor', parseFloat(e.target.value) || 0)}
                          className="w-16"
                        />
                      </TableCell>
                      <TableCell className="font-semibold">
                        ${calculateMaterialCost(material).toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeMaterial(material.id)}
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

          {materials.some(m => m.markup > 20) && (
            <div className="flex items-center gap-2 p-3 bg-yellow-50 rounded-lg">
              <AlertCircle className="h-4 w-4 text-yellow-600" />
              <span className="text-sm text-yellow-800">
                Some materials have high markup (&gt;20%). Consider negotiating with suppliers.
              </span>
            </div>
          )}
        </div>

        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Custom Material</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Category</Label>
                <Select
                  value={newMaterial.category}
                  onValueChange={(value) => setNewMaterial({ ...newMaterial, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {materialCategories.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Material Name</Label>
                <Input
                  value={newMaterial.name}
                  onChange={(e) => setNewMaterial({ ...newMaterial, name: e.target.value })}
                  placeholder="e.g., Concrete 4000 PSI"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Quantity</Label>
                  <Input
                    type="number"
                    value={newMaterial.quantity}
                    onChange={(e) => setNewMaterial({ ...newMaterial, quantity: parseFloat(e.target.value) || 0 })}
                  />
                </div>
                <div>
                  <Label>Unit</Label>
                  <Select
                    value={newMaterial.unit}
                    onValueChange={(value) => setNewMaterial({ ...newMaterial, unit: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="EA">EA</SelectItem>
                      <SelectItem value="LF">LF</SelectItem>
                      <SelectItem value="SF">SF</SelectItem>
                      <SelectItem value="CY">CY</SelectItem>
                      <SelectItem value="TON">TON</SelectItem>
                      <SelectItem value="GAL">GAL</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>Unit Cost ($)</Label>
                  <Input
                    type="number"
                    value={newMaterial.unitCost}
                    onChange={(e) => setNewMaterial({ ...newMaterial, unitCost: parseFloat(e.target.value) || 0 })}
                    step="0.01"
                  />
                </div>
                <div>
                  <Label>Markup %</Label>
                  <Input
                    type="number"
                    value={newMaterial.markup}
                    onChange={(e) => setNewMaterial({ ...newMaterial, markup: parseFloat(e.target.value) || 0 })}
                  />
                </div>
                <div>
                  <Label>Waste %</Label>
                  <Input
                    type="number"
                    value={newMaterial.wasteFactor}
                    onChange={(e) => setNewMaterial({ ...newMaterial, wasteFactor: parseFloat(e.target.value) || 0 })}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDialog(false)}>Cancel</Button>
              <Button onClick={addMaterial}>Add Material</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}; 