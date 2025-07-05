import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useFeatureAccess } from '@/hooks/use-feature-access';
import { 
  Building2, 
  Users, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  FileText, 
  Settings,
  Plus,
  Trash2,
  Save,
  Download
} from 'lucide-react';

interface BusinessStructure {
  id: string;
  name: string;
  type: 'headquarters' | 'branch' | 'warehouse' | 'office' | 'workshop';
  address: string;
  phone: string;
  email: string;
  website?: string;
  description: string;
  manager?: string;
  employees?: number;
  departments: string[];
}

export const BusinessStructureMap: React.FC = () => {
  const [structures, setStructures] = useState<BusinessStructure[]>([]);
  const [editingStructure, setEditingStructure] = useState<BusinessStructure | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const { businessStructureMap, isLoading } = useFeatureAccess();
  const { toast } = useToast();

  const handleAddStructure = () => {
    const newStructure: BusinessStructure = {
      id: Date.now().toString(),
      name: '',
      type: 'office',
      address: '',
      phone: '',
      email: '',
      description: '',
      departments: []
    };
    setEditingStructure(newStructure);
    setIsAdding(true);
  };

  const handleSaveStructure = () => {
    if (!editingStructure) return;

    if (!editingStructure.name || !editingStructure.address || !editingStructure.phone || !editingStructure.email) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    if (isAdding) {
      setStructures([...structures, editingStructure]);
    } else {
      setStructures(structures.map(s => s.id === editingStructure.id ? editingStructure : s));
    }

    setEditingStructure(null);
    setIsAdding(false);
    toast({
      title: "Structure Saved",
      description: "Business structure has been saved successfully.",
    });
  };

  const handleDeleteStructure = (id: string) => {
    setStructures(structures.filter(s => s.id !== id));
    toast({
      title: "Structure Deleted",
      description: "Business structure has been removed.",
    });
  };

  const handleEditStructure = (structure: BusinessStructure) => {
    setEditingStructure(structure);
    setIsAdding(false);
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(structures, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'business-structure-map.json';
    link.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Exported Successfully",
      description: "Business structure map has been exported.",
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-6">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
        </CardContent>
      </Card>
    );
  }

  // Removed business structure map access check - all users now have access

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Building2 className="h-6 w-6 text-blue-500" />
          Business Structure Layout Map
        </h2>
        <div className="flex gap-2">
          <Button onClick={handleExport} variant="outline" disabled={structures.length === 0}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={handleAddStructure}>
            <Plus className="h-4 w-4 mr-2" />
            Add Structure
          </Button>
        </div>
      </div>

      {editingStructure && (
        <Card>
          <CardHeader>
            <CardTitle>{isAdding ? 'Add New Structure' : 'Edit Structure'}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Structure Name *</Label>
                <Input
                  id="name"
                  value={editingStructure.name}
                  onChange={(e) => setEditingStructure({...editingStructure, name: e.target.value})}
                  placeholder="e.g., Main Office"
                />
              </div>
              
              <div>
                <Label htmlFor="type">Structure Type *</Label>
                <Select 
                  value={editingStructure.type} 
                  onValueChange={(value: BusinessStructure['type']) => 
                    setEditingStructure({...editingStructure, type: value})
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="headquarters">Headquarters</SelectItem>
                    <SelectItem value="branch">Branch Office</SelectItem>
                    <SelectItem value="warehouse">Warehouse</SelectItem>
                    <SelectItem value="office">Office</SelectItem>
                    <SelectItem value="workshop">Workshop</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="address">Address *</Label>
                <Input
                  id="address"
                  value={editingStructure.address}
                  onChange={(e) => setEditingStructure({...editingStructure, address: e.target.value})}
                  placeholder="Full address"
                />
              </div>

              <div>
                <Label htmlFor="phone">Phone *</Label>
                <Input
                  id="phone"
                  value={editingStructure.phone}
                  onChange={(e) => setEditingStructure({...editingStructure, phone: e.target.value})}
                  placeholder="Phone number"
                />
              </div>

              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={editingStructure.email}
                  onChange={(e) => setEditingStructure({...editingStructure, email: e.target.value})}
                  placeholder="Email address"
                />
              </div>

              <div>
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  value={editingStructure.website || ''}
                  onChange={(e) => setEditingStructure({...editingStructure, website: e.target.value})}
                  placeholder="Website URL"
                />
              </div>

              <div>
                <Label htmlFor="manager">Manager</Label>
                <Input
                  id="manager"
                  value={editingStructure.manager || ''}
                  onChange={(e) => setEditingStructure({...editingStructure, manager: e.target.value})}
                  placeholder="Manager name"
                />
              </div>

              <div>
                <Label htmlFor="employees">Number of Employees</Label>
                <Input
                  id="employees"
                  type="number"
                  value={editingStructure.employees || ''}
                  onChange={(e) => setEditingStructure({...editingStructure, employees: parseInt(e.target.value) || undefined})}
                  placeholder="Employee count"
                />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={editingStructure.description}
                  onChange={(e) => setEditingStructure({...editingStructure, description: e.target.value})}
                  placeholder="Description of this structure's purpose and operations"
                  rows={3}
                />
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <Button onClick={handleSaveStructure}>
                <Save className="h-4 w-4 mr-2" />
                Save Structure
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setEditingStructure(null);
                  setIsAdding(false);
                }}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {structures.map((structure) => (
          <Card key={structure.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-blue-500" />
                  <CardTitle className="text-lg">{structure.name}</CardTitle>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditStructure(structure)}
                  >
                    <Settings className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteStructure(structure.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="text-sm text-muted-foreground capitalize">
                {structure.type.replace('_', ' ')}
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-gray-500" />
                <span className="truncate">{structure.address}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-gray-500" />
                <span>{structure.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-gray-500" />
                <span className="truncate">{structure.email}</span>
              </div>
              {structure.website && (
                <div className="flex items-center gap-2 text-sm">
                  <Globe className="h-4 w-4 text-gray-500" />
                  <span className="truncate">{structure.website}</span>
                </div>
              )}
              {structure.manager && (
                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4 text-gray-500" />
                  <span>Manager: {structure.manager}</span>
                </div>
              )}
              {structure.employees && (
                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4 text-gray-500" />
                  <span>{structure.employees} employees</span>
                </div>
              )}
              {structure.description && (
                <div className="text-sm text-muted-foreground mt-2">
                  <FileText className="h-4 w-4 inline mr-1" />
                  {structure.description}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {structures.length === 0 && !editingStructure && (
        <Card>
          <CardContent className="text-center py-8">
            <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Business Structures</h3>
            <p className="text-gray-500 mb-4">
              Start by adding your first business structure to create your organization's layout map.
            </p>
            <Button onClick={handleAddStructure}>
              <Plus className="h-4 w-4 mr-2" />
              Add First Structure
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}; 