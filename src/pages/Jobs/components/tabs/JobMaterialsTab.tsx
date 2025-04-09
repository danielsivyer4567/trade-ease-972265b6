
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { 
  Package2, 
  Plus, 
  Search, 
  Truck, 
  Mail, 
  X, 
  Minimize2, 
  Maximize2,
  AlignJustify,
  Send
} from "lucide-react";
import { toast } from "sonner";
import type { Job } from '@/types/job';
import { ImportPriceListItems } from '@/components/materials/ImportPriceListItems';
import { sendEmail } from '@/utils/emailService';

interface JobMaterialsTabProps {
  job: Job;
}

export function JobMaterialsTab({ job }: JobMaterialsTabProps) {
  const [selectedMaterial, setSelectedMaterial] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [searchTerm, setSearchTerm] = useState("");
  const [orderItems, setOrderItems] = useState<Array<{id: string, name: string, quantity: number, price: number}>>([]);
  const [emailView, setEmailView] = useState(false);
  const [emailSubject, setEmailSubject] = useState(`Material Order for Job #${job.jobNumber}`);
  const [emailTo, setEmailTo] = useState("");
  const [emailCc, setEmailCc] = useState("");
  const [emailBcc, setEmailBcc] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [isExpanded, setIsExpanded] = useState(true);
  
  // Prepare the email body on component mount or when order items change
  useEffect(() => {
    if (orderItems.length > 0) {
      const itemsList = orderItems.map(item => 
        `- ${item.quantity}x ${item.name} - $${(item.price * item.quantity).toFixed(2)}`
      ).join('\n');
      
      setEmailBody(
`Please provide the following materials for Job #${job.jobNumber} at ${job.description || 'job location'}:

${itemsList}

Total: $${calculateTotal().toFixed(2)}

Delivery Address: ${job.description || 'Job location'}
Required By: As soon as possible

Thank you,
Trade Ease Team`
      );
    }
  }, [orderItems, job]);
  
  const materials = [
    { id: "m1", name: "Copper Pipe (1m)", category: "Plumbing", price: 8.50 },
    { id: "m2", name: "PVC Pipe (1m)", category: "Plumbing", price: 3.25 },
    { id: "m3", name: "Circuit Breaker", category: "Electrical", price: 12.99 },
    { id: "m4", name: "Electrical Wire (5m)", category: "Electrical", price: 7.49 },
    { id: "m5", name: "Wall Outlet", category: "Electrical", price: 4.99 },
    { id: "m6", name: "Paint - White (1L)", category: "Painting", price: 15.99 },
    { id: "m7", name: "Paint - Off-White (1L)", category: "Painting", price: 15.99 }
  ];
  
  const filteredMaterials = materials.filter(material => 
    material.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    material.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedMaterialItem = materials.find(m => m.id === selectedMaterial);
  
  const handleAddToOrder = () => {
    if (!selectedMaterial || !selectedMaterialItem) {
      toast.error("Please select a material");
      return;
    }
    
    const quantityNum = parseInt(quantity);
    if (isNaN(quantityNum) || quantityNum <= 0) {
      toast.error("Please enter a valid quantity");
      return;
    }
    
    const existingItemIndex = orderItems.findIndex(item => item.id === selectedMaterial);
    
    if (existingItemIndex >= 0) {
      const updatedItems = [...orderItems];
      updatedItems[existingItemIndex].quantity += quantityNum;
      setOrderItems(updatedItems);
    } else {
      setOrderItems([
        ...orderItems,
        {
          id: selectedMaterialItem.id,
          name: selectedMaterialItem.name,
          quantity: quantityNum,
          price: selectedMaterialItem.price
        }
      ]);
    }
    
    toast.success(`Added ${quantity} x ${selectedMaterialItem.name} to order`);
    
    setSelectedMaterial("");
    setQuantity("1");
  };
  
  const handleRemoveItem = (id: string) => {
    setOrderItems(orderItems.filter(item => item.id !== id));
    toast.success("Item removed from order");
  };
  
  const handleImportItems = (items: Array<{name: string, quantity: string, unit: string}>) => {
    const newItems = items.map((item, index) => {
      const similarItem = materials.find(m => 
        m.name.toLowerCase().includes(item.name.toLowerCase()) || 
        item.name.toLowerCase().includes(m.name.toLowerCase())
      );
      
      const price = similarItem ? similarItem.price : 0;
      
      return {
        id: `imported-${Date.now()}-${index}`,
        name: item.name,
        quantity: parseInt(item.quantity) || 1,
        price
      };
    });
    
    setOrderItems([...orderItems, ...newItems]);
    toast.success(`Imported ${newItems.length} items from file`);
  };
  
  const handlePlaceOrder = () => {
    if (orderItems.length === 0) {
      toast.error("Your order is empty");
      return;
    }
    
    // Switch to email view to finalize the order
    setEmailView(true);
  };
  
  const handleSendEmail = async () => {
    if (!emailTo) {
      toast.error("Please enter a recipient email address");
      return;
    }
    
    try {
      toast.promise(
        sendEmail({
          to: emailTo,
          subject: emailSubject,
          html: emailBody.replace(/\n/g, '<br>'),
          text: emailBody
        }),
        {
          loading: "Sending order...",
          success: () => {
            setEmailView(false);
            setOrderItems([]);
            return "Order sent successfully!";
          },
          error: "Failed to send order. Please try again."
        }
      );
    } catch (error) {
      console.error("Error sending email:", error);
      toast.error("Failed to send order");
    }
  };
  
  const calculateTotal = () => {
    return orderItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  return (
    <div className="p-4 space-y-6">
      {!emailView ? (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="flex items-center gap-2">
              <Package2 className="w-5 h-5 text-primary" />
              <CardTitle>
                Order Materials for Job: {job.title || job.jobNumber}
              </CardTitle>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setIsExpanded(!isExpanded)}
                title={isExpanded ? "Minimize" : "Maximize"}
              >
                {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Job Reference Card */}
            <div className="bg-slate-50 p-3 rounded-lg border mb-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="font-semibold text-sm">Job #{job.jobNumber}</p>
                  <p className="text-sm text-muted-foreground">{job.description || 'No address specified'}</p>
                </div>
                <div className="mt-2 md:mt-0">
                  <Badge variant="outline">{job.status || 'Active'}</Badge>
                </div>
              </div>
            </div>

            {isExpanded && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="space-y-2">
                  <Label htmlFor="material-search">Search Materials</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="material-search"
                      placeholder="Search by name or category"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="material-select">Select Material</Label>
                  <Select value={selectedMaterial} onValueChange={setSelectedMaterial}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a material" />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredMaterials.map(material => (
                        <SelectItem key={material.id} value={material.id}>
                          {material.name} - ${material.price.toFixed(2)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="quantity"
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                    />
                    <Button 
                      onClick={handleAddToOrder} 
                      disabled={!selectedMaterial}
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add
                    </Button>
                  </div>
                </div>
              </div>
            )}
            
            <div className="border rounded-md p-4 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-medium">Current Order</h3>
                {isExpanded && <ImportPriceListItems onImportItems={handleImportItems} />}
              </div>
              
              {orderItems.length > 0 ? (
                <div className="space-y-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Material</TableHead>
                        <TableHead className="text-right">Quantity</TableHead>
                        <TableHead className="text-right">Price</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orderItems.map(item => (
                        <TableRow key={item.id}>
                          <TableCell>{item.name}</TableCell>
                          <TableCell className="text-right">{item.quantity}</TableCell>
                          <TableCell className="text-right">${item.price.toFixed(2)}</TableCell>
                          <TableCell className="text-right">${(item.price * item.quantity).toFixed(2)}</TableCell>
                          <TableCell>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleRemoveItem(item.id)}
                              className="h-7 px-2 text-red-500 hover:text-red-700"
                            >
                              Remove
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  
                  <div className="flex justify-between items-center pt-4 border-t">
                    <div className="font-medium text-lg">
                      Total: ${calculateTotal().toFixed(2)}
                    </div>
                    <Button onClick={handlePlaceOrder}>
                      <Mail className="w-4 h-4 mr-2" />
                      Place Order via Email
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 text-gray-500">
                  <Package2 className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                  <p>Your order is empty</p>
                  <p className="text-sm mt-1">Select materials and click 'Add' to build your order</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-t-4 border-t-blue-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="flex items-center">
              <Mail className="w-5 h-5 mr-2" />
              New Material Order
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={() => setEmailView(false)}>
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="flex flex-col space-y-2">
                <Label htmlFor="email-to">To</Label>
                <Input 
                  id="email-to" 
                  placeholder="supplier@example.com" 
                  value={emailTo}
                  onChange={(e) => setEmailTo(e.target.value)}
                />
              </div>
              
              <div className="flex flex-row space-x-2">
                <div className="flex-1">
                  <Label htmlFor="email-cc">Cc</Label>
                  <Input 
                    id="email-cc" 
                    placeholder="manager@example.com" 
                    value={emailCc}
                    onChange={(e) => setEmailCc(e.target.value)}
                  />
                </div>
                <div className="flex-1">
                  <Label htmlFor="email-bcc">Bcc</Label>
                  <Input 
                    id="email-bcc" 
                    placeholder="admin@example.com" 
                    value={emailBcc}
                    onChange={(e) => setEmailBcc(e.target.value)}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="email-subject">Subject</Label>
                <Input 
                  id="email-subject" 
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="email-body">Message</Label>
                <Textarea 
                  id="email-body" 
                  value={emailBody}
                  onChange={(e) => setEmailBody(e.target.value)}
                  className="min-h-[200px]"
                />
              </div>
              
              <div className="pt-4 flex justify-between items-center">
                <Button variant="outline" onClick={() => setEmailView(false)}>
                  Back to Order
                </Button>
                <Button onClick={handleSendEmail}>
                  <Send className="w-4 h-4 mr-2" />
                  Send Order
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
