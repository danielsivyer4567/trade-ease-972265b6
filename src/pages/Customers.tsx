
import { AppLayout } from "@/components/ui/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, User, Phone, Mail, MapPin, FileText, Image, Clock, DollarSign, UserPlus, Filter } from "lucide-react";
import { useState } from "react";
import { ImagesGrid } from "@/components/tasks/ImagesGrid";

export default function CustomersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  
  const customers = [
    {
      id: 1,
      name: "John Smith",
      phone: "+1 234 567 8901",
      email: "john.smith@email.com",
      address: "123 Main St, City",
      status: "active",
      recentJobs: [
        { id: "j1", title: "Bathroom Renovation", status: "completed", date: "2024-02-15" },
        { id: "j2", title: "Kitchen Plumbing", status: "in-progress", date: "2024-02-20" }
      ],
      projectImages: [
        "/lovable-uploads/147b0371-94bb-403e-a449-f6fc081c4d6c.png",
        "/lovable-uploads/6a07dd00-f2c7-49da-8b00-48d960c13610.png"
      ],
      totalSpent: "5,280.00",
      lastService: "2024-02-20"
    },
    {
      id: 2,
      name: "Sarah Johnson",
      phone: "+1 234 567 8902",
      email: "sarah.j@email.com",
      address: "456 Park Ave, City",
      status: "inactive",
      recentJobs: [
        { id: "j3", title: "Electrical Repair", status: "completed", date: "2024-01-10" }
      ],
      projectImages: [],
      totalSpent: "850.00",
      lastService: "2024-01-10"
    },
    {
      id: 3,
      name: "Michael Brown",
      phone: "+1 234 567 8903",
      email: "michael.b@email.com",
      address: "789 Oak Rd, City",
      status: "active",
      recentJobs: [
        { id: "j4", title: "Garden Landscaping", status: "pending", date: "2024-03-01" }
      ],
      projectImages: [],
      totalSpent: "2,100.00",
      lastService: "2024-01-25"
    },
  ];

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = 
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.phone.includes(searchQuery);
    
    if (selectedFilter === "all") return matchesSearch;
    return matchesSearch && customer.status === selectedFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "text-green-600";
      case "in-progress": return "text-blue-600";
      case "pending": return "text-yellow-600";
      default: return "text-gray-600";
    }
  };

  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        <div className="flex flex-col space-y-4">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <User className="h-8 w-8" />
              Customers
            </h1>
            <Button>
              <UserPlus className="h-4 w-4 mr-2" />
              Add Customer
            </Button>
          </div>
          
          <div className="flex gap-4 flex-col sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input 
                className="pl-10"
                placeholder="Search customers by name, email, or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button 
                variant={selectedFilter === "all" ? "default" : "outline"}
                onClick={() => setSelectedFilter("all")}
              >
                All
              </Button>
              <Button 
                variant={selectedFilter === "active" ? "default" : "outline"}
                onClick={() => setSelectedFilter("active")}
              >
                Active
              </Button>
              <Button 
                variant={selectedFilter === "inactive" ? "default" : "outline"}
                onClick={() => setSelectedFilter("inactive")}
              >
                Inactive
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredCustomers.map(customer => (
            <Card key={customer.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
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

                <div className="space-y-2">
                  <h4 className="text-sm font-medium flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Recent Jobs
                  </h4>
                  <div className="space-y-1">
                    {customer.recentJobs.map(job => (
                      <div key={job.id} className="text-sm flex items-center justify-between">
                        <span>{job.title}</span>
                        <span className={getStatusColor(job.status)}>
                          {job.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <ImagesGrid 
                  images={customer.projectImages}
                  title="Project Images"
                />

                <div className="pt-2 border-t flex justify-between text-sm">
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-4 w-4 text-gray-500" />
                    <span>Total Spent: ${customer.totalSpent}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span>Last Service: {customer.lastService}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
