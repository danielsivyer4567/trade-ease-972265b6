
import { AppLayout } from "@/components/ui/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, User, Phone, Mail, MapPin, UserPlus, Upload, ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useCustomers } from "./Customers/hooks/useCustomers";

export default function CustomersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const navigate = useNavigate();
  const { toast } = useToast();
  const { customers, isLoading, fetchCustomers } = useCustomers();
  
  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      toast({
        title: "File received",
        description: `Processing ${file.name}. This feature is coming soon!`
      });
    }
  };

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         customer.email.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         customer.phone.includes(searchQuery);
    if (selectedFilter === "all") return matchesSearch;
    return matchesSearch && customer.status === selectedFilter;
  });

  const handleCustomerClick = (customerId: string) => {
    navigate(`/customers/${customerId}`);
  };

  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        <div className="flex flex-col space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => navigate(-1)} className="rounded-md border border-gray-300 px-3 py-1 bg-[#D3E4FD] hover:bg-[#B5D1F8] text-gray-950">
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-3xl font-bold flex items-center gap-2">
                <User className="h-8 w-8" />
                Customers
              </h1>
            </div>
            <div className="flex gap-2 bg-slate-200">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <Upload className="h-4 w-4 mr-2" />
                    Import
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>Import Customers</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => {
                  const input = document.createElement('input');
                  input.type = 'file';
                  input.accept = '.csv';
                  input.onchange = e => handleFileUpload(e as any);
                  input.click();
                }}>
                    Import from CSV
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => {
                  const input = document.createElement('input');
                  input.type = 'file';
                  input.accept = '.xlsx,.xls';
                  input.onchange = e => handleFileUpload(e as any);
                  input.click();
                }}>
                    Import from Spreadsheet
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => toast({
                  title: "Google Docs Import",
                  description: "Google Docs integration coming soon!"
                })}>
                    Import from Google Docs
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button onClick={() => navigate('/customers/new')} className="text-zinc-950 bg-slate-400 hover:bg-slate-300">
                <UserPlus className="h-4 w-4 mr-2" />
                Add Customer
              </Button>
            </div>
          </div>
          
          <div className="flex gap-4 flex-col sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input placeholder="Search customers by name, email, or phone..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-10 bg-slate-200" />
            </div>
            <div className="flex gap-2">
              <Button variant={selectedFilter === "all" ? "default" : "outline"} onClick={() => setSelectedFilter("all")} className="bg-slate-400 hover:bg-slate-300">
                All
              </Button>
              <Button variant={selectedFilter === "active" ? "default" : "outline"} onClick={() => setSelectedFilter("active")} className="bg-slate-400 hover:bg-slate-300">
                Active
              </Button>
              <Button variant={selectedFilter === "inactive" ? "default" : "outline"} onClick={() => setSelectedFilter("inactive")} className="bg-slate-400 hover:bg-slate-300">
                Inactive
              </Button>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <p className="text-gray-500">Loading customers...</p>
          </div>
        ) : filteredCustomers.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {filteredCustomers.map(customer => (
              <Card 
                key={customer.id} 
                className="hover:shadow-md transition-all cursor-pointer"
                onClick={() => handleCustomerClick(customer.id)}
              >
                <CardHeader className="py-3 bg-slate-200">
                  <CardTitle className="text-lg flex items-center justify-between text-slate-950">
                    <div className="flex items-center gap-2">
                      <User className="h-5 w-5 text-gray-500" />
                      <span className="cursor-pointer hover:text-blue-600 hover:underline">{customer.name}</span>
                    </div>
                    <span className="">
                      {customer.status === 'active' ? 'Active' : 'Inactive'}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-gray-500" />
                      {customer.phone}
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-gray-500" />
                      {customer.email}
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      {customer.address}, {customer.city}, {customer.state} {customer.zipCode}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex justify-center py-8">
            <p className="text-gray-500">
              {searchQuery ? `No customers found matching '${searchQuery}'` : "No customers yet. Add your first customer!"}
            </p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
