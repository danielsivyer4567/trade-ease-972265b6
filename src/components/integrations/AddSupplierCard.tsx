
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Plus, UserPlus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const AddSupplierCard = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [type, setType] = useState('material');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !email.trim()) {
      toast({
        title: "Missing required fields",
        description: "Please fill out all required fields",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // In a real app, this would save to the database
      // For now, we'll simulate success
      await new Promise(resolve => setTimeout(resolve, 700));
      
      toast({
        title: "Supplier added",
        description: `${name} has been added to your suppliers`,
      });
      
      // Clear form and close dialog
      setName('');
      setEmail('');
      setPhone('');
      setType('material');
      setDescription('');
      setIsOpen(false);
    } catch (error) {
      console.error("Error adding supplier:", error);
      toast({
        title: "Could not add supplier",
        description: "There was an error adding the supplier. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Card className="bg-white border-dashed border-2 border-blue-200 hover:border-blue-400 transition-colors cursor-pointer h-full">
        <CardContent className="p-6 flex flex-col items-center justify-center h-full text-center" onClick={() => setIsOpen(true)}>
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
            <UserPlus className="h-6 w-6 text-blue-600" />
          </div>
          <h3 className="font-medium text-lg mb-1">Add New Supplier</h3>
          <p className="text-gray-500 text-sm">Create a new supplier connection</p>
          <Button variant="outline" className="mt-4 border-blue-200 text-blue-600 hover:bg-blue-50">
            <Plus className="h-4 w-4 mr-2" />
            Add Supplier
          </Button>
        </CardContent>
      </Card>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Supplier</DialogTitle>
            <DialogDescription>
              Add a new supplier to your network. Fill out the details below.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="required">Supplier Name</Label>
              <Input 
                id="name" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                placeholder="ABC Building Supplies" 
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email" className="required">Email Address</Label>
              <Input 
                id="email" 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="contact@abcsupplies.com" 
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input 
                id="phone" 
                value={phone} 
                onChange={(e) => setPhone(e.target.value)} 
                placeholder="(555) 123-4567" 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="type">Supplier Type</Label>
              <select 
                id="type" 
                value={type} 
                onChange={(e) => setType(e.target.value)} 
                className="w-full p-2 border rounded-md"
              >
                <option value="material">Material</option>
                <option value="equipment">Equipment</option>
                <option value="service">Service</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description" 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                placeholder="Brief description of the supplier and what they provide" 
                className="h-20"
              />
            </div>
            
            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Adding..." : "Add Supplier"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};
