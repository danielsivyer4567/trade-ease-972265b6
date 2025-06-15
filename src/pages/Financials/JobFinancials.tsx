import React, { useState } from 'react';
import { AppLayout } from '@/components/ui/AppLayout';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, PlusCircle, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Data types
type Contractor = {
  id: string;
  name: string;
  cost: number;
};

type Material = {
  id: string;
  name: string;
  cost: number;
};

export default function JobFinancials() {
  const navigate = useNavigate();
  
  // State for contractors and materials
  const [contractors, setContractors] = useState<Contractor[]>([
    { id: 'c1', name: 'Sparky & Co.', cost: 1200 },
    { id: 'c2', name: 'Plumb Perfect', cost: 850 },
  ]);

  const [materials, setMaterials] = useState<Material[]>([
    { id: 'm1', name: 'Copper Wiring (50m)', cost: 350 },
    { id: 'm2', name: 'Circuit Breaker Panel', cost: 450 },
    { id: 'm3', name: 'PVC Pipes (20m)', cost: 150 },
  ]);
  
  // State for adding new items
  const [newContractor, setNewContractor] = useState({ name: '', cost: '' });
  const [newMaterial, setNewMaterial] = useState({ name: '', cost: '' });

  // Calculations
  const totalContractorCost = contractors.reduce((acc, c) => acc + c.cost, 0);
  const totalMaterialCost = materials.reduce((acc, m) => acc + m.cost, 0);
  const totalExpenses = totalContractorCost + totalMaterialCost;
  const totalRevenue = 5000; // Example static total revenue for a job
  const grossProfit = totalRevenue - totalExpenses;
  const gst = totalRevenue * 0.1; // 10% GST
  const taxToPutAway = grossProfit * 0.3; // Assuming a 30% tax rate on profit
  const netProfit = grossProfit - taxToPutAway;

  const handleAddItem = (type: 'contractor' | 'material') => {
    if (type === 'contractor' && newContractor.name && newContractor.cost) {
      setContractors(prev => [...prev, { id: `c${Date.now()}`, name: newContractor.name, cost: parseFloat(newContractor.cost) }]);
      setNewContractor({ name: '', cost: '' });
    } else if (type === 'material' && newMaterial.name && newMaterial.cost) {
      setMaterials(prev => [...prev, { id: `m${Date.now()}`, name: newMaterial.name, cost: parseFloat(newMaterial.cost) }]);
      setNewMaterial({ name: '', cost: '' });
    }
  };

  const handleDeleteItem = (type: 'contractor' | 'material', id: string) => {
    if (type === 'contractor') {
      setContractors(prev => prev.filter(item => item.id !== id));
    } else {
      setMaterials(prev => prev.filter(item => item.id !== id));
    }
  };

  return (
    <AppLayout>
      <div className="p-4 md:p-6 space-y-6">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="mr-2">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Job Financials Breakdown</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content: Costs Breakdown */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contractors */}
            <Card>
              <CardHeader>
                <CardTitle>Contractors</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead className="text-right">Cost</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {contractors.map(c => (
                      <TableRow key={c.id}>
                        <TableCell>{c.name}</TableCell>
                        <TableCell className="text-right">${c.cost.toFixed(2)}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteItem('contractor', c.id)}>
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter className="flex items-center gap-2 p-4 border-t">
                <Input placeholder="Contractor Name" value={newContractor.name} onChange={(e) => setNewContractor({...newContractor, name: e.target.value})} />
                <Input placeholder="Cost" type="number" value={newContractor.cost} onChange={(e) => setNewContractor({...newContractor, cost: e.target.value})} />
                <Button onClick={() => handleAddItem('contractor')}><PlusCircle className="h-4 w-4" /></Button>
              </CardFooter>
            </Card>

            {/* Materials */}
            <Card>
              <CardHeader>
                <CardTitle>Materials</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead className="text-right">Cost</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {materials.map(m => (
                      <TableRow key={m.id}>
                        <TableCell>{m.name}</TableCell>
                        <TableCell className="text-right">${m.cost.toFixed(2)}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteItem('material', m.id)}>
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
               <CardFooter className="flex items-center gap-2 p-4 border-t">
                <Input placeholder="Material Name" value={newMaterial.name} onChange={(e) => setNewMaterial({...newMaterial, name: e.target.value})} />
                <Input placeholder="Cost" type="number" value={newMaterial.cost} onChange={(e) => setNewMaterial({...newMaterial, cost: e.target.value})} />
                <Button onClick={() => handleAddItem('material')}><PlusCircle className="h-4 w-4" /></Button>
              </CardFooter>
            </Card>
          </div>

          {/* Sidebar: Financial Summary */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Financial Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Revenue</span>
                  <span className="font-medium text-lg">${totalRevenue.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Expenses</span>
                  <span className="font-medium text-lg text-red-600">-${totalExpenses.toFixed(2)}</span>
                </div>
                <hr />
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-semibold">Gross Profit</span>
                  <span className="font-semibold text-xl text-blue-600">${grossProfit.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>

             <Card>
              <CardHeader>
                <CardTitle>Tax & Net Profit</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">GST (10%)</span>
                  <span className="font-medium">${gst.toFixed(2)}</span>
                </div>
                 <div className="flex justify-between items-center">
                  <span className="text-gray-600">Tax to Put Away (30%)</span>
                  <span className="font-medium text-orange-600">-${taxToPutAway.toFixed(2)}</span>
                </div>
                <hr />
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-700">Net Profit</span>
                  <span className="font-bold text-2xl text-green-600">${netProfit.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
} 