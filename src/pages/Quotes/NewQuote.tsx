import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/ui/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { QuoteTemplateSelector } from "./components/QuoteTemplateSelector";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Plus, Trash2, ChevronRight, ChevronLeft, Save, SendHorizontal, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function NewQuote() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("details");
  const [quoteItems, setQuoteItems] = useState<{ description: string; quantity: number; rate: number; total: number }[]>([
    { description: "", quantity: 1, rate: 0, total: 0 }
  ]);
  
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [searchPriceList, setSearchPriceList] = useState("");
  
  const [priceListItems, setPriceListItems] = useState([
    { id: "pl1", name: "Hourly Labor - Standard", category: "Labor", price: 85 },
    { id: "pl2", name: "Hourly Labor - Premium", category: "Labor", price: 120 },
    { id: "pl3", name: "Material - Pine Wood (per sqft)", category: "Materials", price: 3.50 },
    { id: "pl4", name: "Material - Oak Wood (per sqft)", category: "Materials", price: 7.25 },
    { id: "pl5", name: "Material - Tile (per sqft)", category: "Materials", price: 5.75 },
    { id: "pl6", name: "Tool Rental - Basic Kit", category: "Equipment", price: 75 },
    { id: "pl7", name: "Tool Rental - Premium Kit", category: "Equipment", price: 150 },
    { id: "pl8", name: "Disposal Fee", category: "Services", price: 200 },
    { id: "pl9", name: "Cleanup Service", category: "Services", price: 150 },
    { id: "pl10", name: "Inspection Fee", category: "Services", price: 125 },
  ]);
  
  const [newPriceItem, setNewPriceItem] = useState({
    name: "",
    category: "Materials",
    price: 0
  });
  
  const filteredPriceItems = priceListItems.filter(item => 
    item.name.toLowerCase().includes(searchPriceList.toLowerCase()) ||
    item.category.toLowerCase().includes(searchPriceList.toLowerCase())
  );
  
  const handleBack = () => {
    navigate("/quotes");
  };
  
  const handleAddItem = () => {
    setQuoteItems([...quoteItems, { description: "", quantity: 1, rate: 0, total: 0 }]);
  };
  
  const handleRemoveItem = (index: number) => {
    const newItems = [...quoteItems];
    newItems.splice(index, 1);
    setQuoteItems(newItems);
  };
  
  const handleItemChange = (index: number, field: string, value: string | number) => {
    const newItems = [...quoteItems];
    newItems[index] = {
      ...newItems[index],
      [field]: value,
      total: field === 'quantity' || field === 'rate' 
        ? Number(field === 'quantity' ? value : newItems[index].quantity) * Number(field === 'rate' ? value : newItems[index].rate)
        : newItems[index].total
    };
    setQuoteItems(newItems);
  };
  
  const totalAmount = quoteItems.reduce((sum, item) => sum + item.total, 0);
  
  const handleSelectTemplate = (templateId: string) => {
    setSelectedTemplate(templateId);
    toast({
      title: "Template Selected",
      description: `Template ${templateId} has been applied to your quote`,
    });
    
    setQuoteItems([
      { description: "Labor - Standard Rate", quantity: 8, rate: 85, total: 680 },
      { description: "Materials - Premium Grade", quantity: 1, rate: 450, total: 450 },
      { description: "Equipment Rental", quantity: 1, rate: 200, total: 200 }
    ]);
  };
  
  const handleAddPriceListItem = (item: typeof priceListItems[0]) => {
    const newItem = {
      description: item.name,
      quantity: 1,
      rate: item.price,
      total: item.price
    };
    
    setQuoteItems([...quoteItems, newItem]);
    
    toast({
      title: "Item Added",
      description: `${item.name} has been added to your quote`,
    });
    
    setActiveTab("items");
  };
  
  const handleAddNewPriceItem = () => {
    if (!newPriceItem.name) {
      toast({
        title: "Error",
        description: "Please enter a name for the price list item",
        variant: "destructive"
      });
      return;
    }
    
    if (newPriceItem.price <= 0) {
      toast({
        title: "Error",
        description: "Price must be greater than 0",
        variant: "destructive"
      });
      return;
    }
    
    const newItem = {
      id: `pl${priceListItems.length + 1}`,
      name: newPriceItem.name,
      category: newPriceItem.category,
      price: parseFloat(newPriceItem.price.toString())
    };
    
    setPriceListItems([...priceListItems, newItem]);
    
    toast({
      title: "Price List Item Added",
      description: `${newItem.name} has been added to your price list`,
    });
    
    setNewPriceItem({
      name: "",
      category: "Materials",
      price: 0
    });
  };
  
  const handleSaveQuote = () => {
    toast({
      title: "Quote Saved",
      description: "Quote has been saved successfully",
    });
  };
  
  const handleSendQuote = () => {
    toast({
      title: "Quote Sent",
      description: "Quote has been sent to the customer",
    });
    navigate("/quotes");
  };
  
  return (
    <AppLayout>
      <div className="p-6 max-w-7xl mx-auto w-full">
        <div className="flex items-center mb-6">
          <Button variant="ghost" onClick={handleBack} className="mr-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Quotes
          </Button>
          <h1 className="text-2xl font-bold">Create New Quote</h1>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-5 mb-6">
                <TabsTrigger value="details">Customer Details</TabsTrigger>
                <TabsTrigger value="items">Quote Items</TabsTrigger>
                <TabsTrigger value="price-list">Price List</TabsTrigger>
                <TabsTrigger value="terms">Terms & Notes</TabsTrigger>
                <TabsTrigger value="preview">Preview</TabsTrigger>
              </TabsList>
              
              <Card>
                <CardContent className="p-6">
                  <TabsContent value="details" className="mt-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="customer">Customer</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a customer" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="john-smith">John Smith</SelectItem>
                              <SelectItem value="sarah-johnson">Sarah Johnson</SelectItem>
                              <SelectItem value="michael-williams">Michael Williams</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="email">Email</Label>
                          <Input id="email" placeholder="customer@example.com" />
                        </div>
                        <div>
                          <Label htmlFor="phone">Phone</Label>
                          <Input id="phone" placeholder="(555) 123-4567" />
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="address">Address</Label>
                          <Textarea id="address" placeholder="Customer address" rows={3} />
                        </div>
                        <div>
                          <Label htmlFor="quote-number">Quote #</Label>
                          <Input id="quote-number" value="Q-2024-009" readOnly className="bg-gray-50" />
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-end mt-6 space-x-2">
                      <Button onClick={() => setActiveTab("items")}>
                        Next: Quote Items
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="items" className="mt-0">
                    <div className="space-y-6">
                      <div>
                        <Label htmlFor="quote-title">Quote Title</Label>
                        <Input 
                          id="quote-title" 
                          placeholder="e.g., Kitchen Renovation" 
                          className="mt-1" 
                        />
                      </div>
                      
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="font-medium">Quote Items</h3>
                          <Button size="sm" variant="outline" onClick={handleAddItem}>
                            <Plus className="h-4 w-4 mr-1" />
                            Add Item
                          </Button>
                        </div>
                        
                        <div className="border rounded-md overflow-hidden">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="bg-gray-50 border-b">
                                <th className="text-left py-2 px-3 font-medium">Description</th>
                                <th className="text-left py-2 px-3 font-medium w-20">Qty</th>
                                <th className="text-left py-2 px-3 font-medium w-28">Rate</th>
                                <th className="text-left py-2 px-3 font-medium w-28">Total</th>
                                <th className="text-center py-2 px-3 font-medium w-16">Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {quoteItems.map((item, index) => (
                                <tr key={index} className="border-b">
                                  <td className="py-2 px-3">
                                    <Input 
                                      placeholder="Item description" 
                                      value={item.description}
                                      onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                                    />
                                  </td>
                                  <td className="py-2 px-3">
                                    <Input 
                                      type="number" 
                                      min="1" 
                                      value={item.quantity}
                                      onChange={(e) => handleItemChange(index, 'quantity', Number(e.target.value))}
                                    />
                                  </td>
                                  <td className="py-2 px-3">
                                    <div className="relative">
                                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                                      <Input 
                                        type="number" 
                                        className="pl-7"
                                        value={item.rate}
                                        onChange={(e) => handleItemChange(index, 'rate', Number(e.target.value))}
                                      />
                                    </div>
                                  </td>
                                  <td className="py-2 px-3">
                                    <Input 
                                      value={`$${item.total.toFixed(2)}`}
                                      disabled
                                      className="bg-gray-50"
                                    />
                                  </td>
                                  <td className="py-2 px-3 text-center">
                                    {quoteItems.length > 1 && (
                                      <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        onClick={() => handleRemoveItem(index)}
                                      >
                                        <Trash2 className="h-4 w-4 text-red-500" />
                                      </Button>
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                            <tfoot>
                              <tr className="bg-gray-50 font-medium">
                                <td colSpan={3} className="text-right py-3 px-4">Total:</td>
                                <td className="py-3 px-3">${totalAmount.toFixed(2)}</td>
                                <td></td>
                              </tr>
                            </tfoot>
                          </table>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between mt-6">
                      <Button variant="outline" onClick={() => setActiveTab("details")}>
                        <ChevronLeft className="mr-2 h-4 w-4" />
                        Back
                      </Button>
                      <Button onClick={() => setActiveTab("terms")}>
                        Next: Terms & Notes
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="price-list" className="mt-0">
                    <div className="space-y-6">
                      <div>
                        <Label htmlFor="price-list-search">Search Price List</Label>
                        <div className="relative mt-1">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                          <Input 
                            id="price-list-search" 
                            placeholder="Search by name or category..." 
                            className="pl-10"
                            value={searchPriceList}
                            onChange={(e) => setSearchPriceList(e.target.value)}
                          />
                        </div>
                      </div>
                      
                      <div className="border rounded-md p-4 bg-gray-50">
                        <h3 className="font-medium mb-3">Add New Price List Item</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <Label htmlFor="item-name">Item Name</Label>
                            <Input
                              id="item-name"
                              placeholder="Enter item name"
                              value={newPriceItem.name}
                              onChange={(e) => setNewPriceItem({...newPriceItem, name: e.target.value})}
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label htmlFor="item-category">Category</Label>
                            <Select 
                              value={newPriceItem.category}
                              onValueChange={(value) => setNewPriceItem({...newPriceItem, category: value})}
                            >
                              <SelectTrigger id="item-category" className="mt-1">
                                <SelectValue placeholder="Select a category" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Labor">Labor</SelectItem>
                                <SelectItem value="Materials">Materials</SelectItem>
                                <SelectItem value="Equipment">Equipment</SelectItem>
                                <SelectItem value="Services">Services</SelectItem>
                                <SelectItem value="Other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="item-price">Price ($)</Label>
                            <Input
                              id="item-price"
                              type="number"
                              placeholder="0.00"
                              value={newPriceItem.price}
                              onChange={(e) => setNewPriceItem({...newPriceItem, price: parseFloat(e.target.value) || 0})}
                              className="mt-1"
                              min="0"
                              step="0.01"
                            />
                          </div>
                        </div>
                        <Button 
                          className="mt-3"
                          onClick={handleAddNewPriceItem}
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Add to Price List
                        </Button>
                      </div>
                      
                      <div className="border rounded-md overflow-hidden">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="bg-gray-50 border-b">
                              <th className="text-left py-2 px-4 font-medium">Item</th>
                              <th className="text-left py-2 px-4 font-medium">Category</th>
                              <th className="text-right py-2 px-4 font-medium">Price</th>
                              <th className="text-center py-2 px-4 font-medium w-24">Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredPriceItems.length > 0 ? (
                              filteredPriceItems.map((item) => (
                                <tr key={item.id} className="border-b hover:bg-gray-50">
                                  <td className="py-3 px-4">{item.name}</td>
                                  <td className="py-3 px-4">
                                    <Badge variant="secondary" className="font-normal">
                                      {item.category}
                                    </Badge>
                                  </td>
                                  <td className="py-3 px-4 text-right">${item.price.toFixed(2)}</td>
                                  <td className="py-3 px-4 text-center">
                                    <Button 
                                      size="sm" 
                                      onClick={() => handleAddPriceListItem(item)}
                                    >
                                      <Plus className="h-4 w-4 mr-1" />
                                      Add
                                    </Button>
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan={4} className="py-8 text-center text-gray-500">
                                  No items found matching your search criteria
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                    
                    <div className="flex justify-between mt-6">
                      <Button variant="outline" onClick={() => setActiveTab("items")}>
                        <ChevronLeft className="mr-2 h-4 w-4" />
                        Back
                      </Button>
                      <Button onClick={() => setActiveTab("terms")}>
                        Next: Terms & Notes
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="terms" className="mt-0">
                    <div className="space-y-6">
                      <div>
                        <Label htmlFor="quote-validity">Quote Validity (Days)</Label>
                        <Input 
                          id="quote-validity" 
                          type="number" 
                          defaultValue="30" 
                          className="mt-1 max-w-xs" 
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="payment-terms">Payment Terms</Label>
                        <Select defaultValue="14-days">
                          <SelectTrigger className="mt-1 max-w-md">
                            <SelectValue placeholder="Select payment terms" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="immediate">Due on Receipt</SelectItem>
                            <SelectItem value="7-days">Net 7 Days</SelectItem>
                            <SelectItem value="14-days">Net 14 Days</SelectItem>
                            <SelectItem value="30-days">Net 30 Days</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label htmlFor="notes">Notes to Customer</Label>
                        <Textarea 
                          id="notes" 
                          placeholder="Additional information or terms for the customer" 
                          rows={5} 
                          className="mt-1" 
                        />
                      </div>
                    </div>
                    
                    <div className="flex justify-between mt-6">
                      <Button variant="outline" onClick={() => setActiveTab("items")}>
                        <ChevronLeft className="mr-2 h-4 w-4" />
                        Back
                      </Button>
                      <Button onClick={() => setActiveTab("preview")}>
                        Next: Preview Quote
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="preview" className="mt-0">
                    <div className="space-y-6">
                      <div className="bg-gray-50 border p-4 rounded-md">
                        <div className="flex justify-between">
                          <div>
                            <h2 className="font-bold text-xl">QUOTE</h2>
                            <p className="text-gray-500 text-sm mt-1">Kitchen Renovation</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">Quote #: Q-2024-009</p>
                            <p className="text-sm text-gray-500 mt-1">Date: {new Date().toLocaleDateString()}</p>
                            <p className="text-sm text-gray-500">Valid until: {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}</p>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-6 mt-6">
                          <div>
                            <h3 className="font-medium text-sm text-gray-500 mb-1">FROM</h3>
                            <p className="font-medium">Your Company Name</p>
                            <p className="text-sm">123 Business Street</p>
                            <p className="text-sm">City, State ZIP</p>
                            <p className="text-sm">Phone: (555) 987-6543</p>
                            <p className="text-sm">Email: info@yourcompany.com</p>
                          </div>
                          <div>
                            <h3 className="font-medium text-sm text-gray-500 mb-1">TO</h3>
                            <p className="font-medium">John Smith</p>
                            <p className="text-sm">456 Residential Ave</p>
                            <p className="text-sm">City, State ZIP</p>
                            <p className="text-sm">Phone: (555) 123-4567</p>
                            <p className="text-sm">Email: john@example.com</p>
                          </div>
                        </div>
                        
                        <div className="mt-8">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="border-b border-gray-300">
                                <th className="text-left py-2 font-medium">Description</th>
                                <th className="text-center py-2 font-medium">Qty</th>
                                <th className="text-right py-2 font-medium">Rate</th>
                                <th className="text-right py-2 font-medium">Amount</th>
                              </tr>
                            </thead>
                            <tbody>
                              {quoteItems.map((item, index) => (
                                <tr key={index} className="border-b border-gray-200">
                                  <td className="py-3">{item.description || "Item description"}</td>
                                  <td className="py-3 text-center">{item.quantity}</td>
                                  <td className="py-3 text-right">${item.rate.toFixed(2)}</td>
                                  <td className="py-3 text-right">${item.total.toFixed(2)}</td>
                                </tr>
                              ))}
                            </tbody>
                            <tfoot>
                              <tr>
                                <td colSpan={3} className="text-right py-4 font-medium">Subtotal:</td>
                                <td className="text-right py-4 font-medium">${totalAmount.toFixed(2)}</td>
                              </tr>
                              <tr>
                                <td colSpan={3} className="text-right py-2">Tax (10%):</td>
                                <td className="text-right py-2">${(totalAmount * 0.1).toFixed(2)}</td>
                              </tr>
                              <tr className="text-lg">
                                <td colSpan={3} className="text-right py-4 font-bold">Total:</td>
                                <td className="text-right py-4 font-bold">${(totalAmount * 1.1).toFixed(2)}</td>
                              </tr>
                            </tfoot>
                          </table>
                        </div>
                        
                        <div className="mt-8 border-t pt-4">
                          <h3 className="font-medium mb-2">Terms & Conditions</h3>
                          <p className="text-sm">Payment due within 14 days of quote acceptance. This quote is valid for 30 days from the date of issue.</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between mt-6">
                      <Button variant="outline" onClick={() => setActiveTab("terms")}>
                        <ChevronLeft className="mr-2 h-4 w-4" />
                        Back
                      </Button>
                      <div className="space-x-2">
                        <Button variant="outline" onClick={handleSaveQuote}>
                          <Save className="mr-2 h-4 w-4" />
                          Save Quote
                        </Button>
                        <Button onClick={handleSendQuote}>
                          <SendHorizontal className="mr-2 h-4 w-4" />
                          Send to Customer
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                </CardContent>
              </Card>
            </Tabs>
          </div>
          
          <div>
            <QuoteTemplateSelector onSelectTemplate={handleSelectTemplate} selectedTemplate={selectedTemplate} />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
