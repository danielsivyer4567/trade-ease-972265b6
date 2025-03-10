
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Phone, Plus, Trash2, RefreshCw, DollarSign } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface PhoneNumberForSale {
  id: string;
  phone_number: string;
  price: number;
  status: 'available' | 'sold' | 'reserved';
  user_id: string | null;
  created_at: string;
}

export const AdminPhoneNumberManager = () => {
  const [phoneNumbers, setPhoneNumbers] = useState<PhoneNumberForSale[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [adminKey, setAdminKey] = useState('');
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  
  // New phone number form state
  const [newPhoneNumber, setNewPhoneNumber] = useState('');
  const [newPrice, setNewPrice] = useState('');
  
  // Function to load phone numbers
  const loadPhoneNumbers = async () => {
    if (!adminKey) {
      toast.error('Admin key is required');
      return;
    }
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('admin-manage-numbers', {
        body: { 
          action: 'list', 
          adminKey 
        }
      });
      
      if (error || !data.success) {
        throw new Error(error?.message || data?.message || 'Failed to load phone numbers');
      }
      
      setPhoneNumbers(data.numbers || []);
    } catch (error) {
      console.error('Error loading phone numbers:', error);
      toast.error('Failed to load phone numbers: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Function to add a new phone number
  const handleAddPhoneNumber = async () => {
    if (!adminKey) {
      toast.error('Admin key is required');
      return;
    }
    
    if (!newPhoneNumber || !newPrice) {
      toast.error('Phone number and price are required');
      return;
    }
    
    try {
      const { data, error } = await supabase.functions.invoke('admin-manage-numbers', {
        body: { 
          action: 'add', 
          phoneNumber: newPhoneNumber,
          price: parseFloat(newPrice),
          status: 'available',
          adminKey 
        }
      });
      
      if (error || !data.success) {
        throw new Error(error?.message || data?.message || 'Failed to add phone number');
      }
      
      toast.success('Phone number added successfully');
      setAddDialogOpen(false);
      setNewPhoneNumber('');
      setNewPrice('');
      
      // Reload the list
      loadPhoneNumbers();
    } catch (error) {
      console.error('Error adding phone number:', error);
      toast.error('Failed to add phone number: ' + error.message);
    }
  };
  
  // Function to update a phone number's status
  const handleUpdateStatus = async (phoneNumber: string, newStatus: 'available' | 'sold' | 'reserved') => {
    if (!adminKey) {
      toast.error('Admin key is required');
      return;
    }
    
    try {
      const { data, error } = await supabase.functions.invoke('admin-manage-numbers', {
        body: { 
          action: 'update', 
          phoneNumber,
          status: newStatus,
          adminKey 
        }
      });
      
      if (error || !data.success) {
        throw new Error(error?.message || data?.message || 'Failed to update phone number');
      }
      
      toast.success('Status updated successfully');
      
      // Update the local state
      setPhoneNumbers(prev => 
        prev.map(num => 
          num.phone_number === phoneNumber 
            ? { ...num, status: newStatus } 
            : num
        )
      );
    } catch (error) {
      console.error('Error updating phone number:', error);
      toast.error('Failed to update status: ' + error.message);
    }
  };
  
  // Function to delete a phone number
  const handleDeletePhoneNumber = async (phoneNumber: string) => {
    if (!adminKey) {
      toast.error('Admin key is required');
      return;
    }
    
    if (!confirm(`Are you sure you want to delete ${phoneNumber}?`)) {
      return;
    }
    
    try {
      const { data, error } = await supabase.functions.invoke('admin-manage-numbers', {
        body: { 
          action: 'delete', 
          phoneNumber,
          adminKey 
        }
      });
      
      if (error || !data.success) {
        throw new Error(error?.message || data?.message || 'Failed to delete phone number');
      }
      
      toast.success('Phone number deleted successfully');
      
      // Update the local state
      setPhoneNumbers(prev => prev.filter(num => num.phone_number !== phoneNumber));
    } catch (error) {
      console.error('Error deleting phone number:', error);
      toast.error('Failed to delete phone number: ' + error.message);
    }
  };
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Phone Numbers Administration</span>
          <Button 
            size="sm" 
            onClick={() => setAddDialogOpen(true)}
            className="bg-green-500 hover:bg-green-600"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Number
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <Label htmlFor="admin-key">Admin Key</Label>
              <Input 
                id="admin-key" 
                type="password"
                value={adminKey} 
                onChange={(e) => setAdminKey(e.target.value)}
                placeholder="Enter admin key to manage phone numbers" 
              />
            </div>
            <Button 
              onClick={loadPhoneNumbers} 
              disabled={isLoading || !adminKey}
              className="bg-slate-400 hover:bg-slate-300"
            >
              {isLoading ? 'Loading...' : (
                <>
                  <RefreshCw className="h-4 w-4 mr-1" />
                  Load Numbers
                </>
              )}
            </Button>
          </div>
          
          {phoneNumbers.length > 0 ? (
            <div className="border rounded-md overflow-hidden">
              <table className="w-full">
                <thead className="bg-slate-300">
                  <tr>
                    <th className="px-4 py-2 text-left">Phone Number</th>
                    <th className="px-4 py-2 text-left">Price</th>
                    <th className="px-4 py-2 text-left">Status</th>
                    <th className="px-4 py-2 text-left">Assigned To</th>
                    <th className="px-4 py-2 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {phoneNumbers.map((number) => (
                    <tr key={number.id} className="border-b">
                      <td className="px-4 py-2">{number.phone_number}</td>
                      <td className="px-4 py-2">{formatCurrency(number.price)}</td>
                      <td className="px-4 py-2">
                        <Select 
                          value={number.status} 
                          onValueChange={(value) => handleUpdateStatus(number.phone_number, value as any)}
                        >
                          <SelectTrigger className="w-[120px]">
                            <SelectValue placeholder="Status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="available">Available</SelectItem>
                            <SelectItem value="reserved">Reserved</SelectItem>
                            <SelectItem value="sold">Sold</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="px-4 py-2">{number.user_id || 'Not assigned'}</td>
                      <td className="px-4 py-2">
                        <div className="flex justify-center">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleDeletePhoneNumber(number.phone_number)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center p-4 text-gray-500">
              {isLoading ? 'Loading phone numbers...' : 'No phone numbers found. Add one or load the list.'}
            </div>
          )}
        </div>
      </CardContent>
      
      {/* Add Phone Number Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Phone Number</DialogTitle>
            <DialogDescription>
              Add a new phone number to make it available for sale.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="phone-number">Phone Number</Label>
              <Input
                id="phone-number"
                placeholder="+1XXXXXXXXXX"
                value={newPhoneNumber}
                onChange={(e) => setNewPhoneNumber(e.target.value)}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="price">Price (USD)</Label>
              <div className="relative">
                <DollarSign className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  id="price"
                  type="number"
                  placeholder="29.99"
                  className="pl-8"
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                />
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddPhoneNumber} disabled={!newPhoneNumber || !newPrice}>
              Add Phone Number
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};
