import { AppLayout } from "@/components/ui/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, User, Phone, Mail, MapPin, FileText, Image, Clock, DollarSign, UserPlus, Upload, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { ImagesGrid } from "@/components/tasks/ImagesGrid";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
export default function CustomersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [expandedCustomerId, setExpandedCustomerId] = useState<number | null>(null);
  const navigate = useNavigate();
  const {
    toast
  } = useToast();
  const customers = [{
    id: 1,
    name: "John Smith",
    phone: "+1 234 567 8901",
    email: "john.smith@email.com",
    address: "123 Main St, City",
    status: "active",
    recentJobs: [{
      id: "j1",
      title: "Bathroom Renovation",
      status: "completed",
      date: "2024-02-15"
    }, {
      id: "j2",
      title: "Kitchen Plumbing",
      status: "in-progress",
      date: "2024-02-20"
    }],
    projectImages: ["/lovable-uploads/147b0371-94bb-403e-a449-f6fc081c4d6c.png", "/lovable-uploads/6a07dd00-f2c7-49da-8b00-48d960c13610.png"],
    totalSpent: "5,280.00",
    lastService: "2024-02-20"
  }, {
    id: 2,
    name: "Sarah Johnson",
    phone: "+1 234 567 8902",
    email: "sarah.j@email.com",
    address: "456 Park Ave, City",
    status: "inactive",
    recentJobs: [{
      id: "j3",
      title: "Electrical Repair",
      status: "completed",
      date: "2024-01-10"
    }],
    projectImages: [],
    totalSpent: "850.00",
    lastService: "2024-01-10"
  }, {
    id: 3,
    name: "Michael Brown",
    phone: "+1 234 567 8903",
    email: "michael.b@email.com",
    address: "789 Oak Rd, City",
    status: "active",
    recentJobs: [{
      id: "j4",
      title: "Garden Landscaping",
      status: "pending",
      date: "2024-03-01"
    }],
    projectImages: [],
    totalSpent: "2,100.00",
    lastService: "2024-01-25"
  }];
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // This is a placeholder for actual file processing
      toast({
        title: "File received",
        description: `Processing ${file.name}. This feature is coming soon!`
      });
    }
  };
  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchQuery.toLowerCase()) || customer.email.toLowerCase().includes(searchQuery.toLowerCase()) || customer.phone.includes(searchQuery);
    if (selectedFilter === "all") return matchesSearch;
    return matchesSearch && customer.status === selectedFilter;
  });
  return <AppLayout>
      <div className="p-6 space-y-6">
        <div className="flex flex-col space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => navigate(-1)} className="rounded-md border border-gray-300 px-3 py-1 bg-[#D3E4FD] hover:bg-[#B5D1F8] text-[#1E40AF] hover:text-[#1E3A8A]">
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
              <Button onClick={() => navigate('/customers/new')} className="bg-slate-200 hover:bg-slate-100 text-zinc-950">
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
              <Button variant={selectedFilter === "all" ? "default" : "outline"} onClick={() => setSelectedFilter("all")} className="text-slate-200">
                All
              </Button>
              <Button variant={selectedFilter === "active" ? "default" : "outline"} onClick={() => setSelectedFilter("active")} className="bg-slate-200 hover:bg-slate-100">
                Active
              </Button>
              <Button variant={selectedFilter === "inactive" ? "default" : "outline"} onClick={() => setSelectedFilter("inactive")} className="bg-slate-200 hover:bg-slate-100">
                Inactive
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {filteredCustomers.map(customer => <Card key={customer.id} className={`hover:shadow-md transition-all cursor-pointer`} onClick={() => navigate(`/customers/${customer.id}`)}>
              <CardHeader className="py-3 bg-slate-200">
                <CardTitle className="text-lg flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <User className="h-5 w-5 text-gray-500" />
                    {customer.name}
                  </div>
                  <span className={`text-sm ${customer.status === 'active' ? 'text-green-600' : 'text-gray-500'}`}>
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
                    {customer.address}
                  </div>
                </div>
              </CardContent>
            </Card>)}
        </div>
      </div>
    </AppLayout>;
}