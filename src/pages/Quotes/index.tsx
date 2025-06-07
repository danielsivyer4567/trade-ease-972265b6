"use client";

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BaseLayout } from "@/components/ui/BaseLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Search,
  Plus,
  Filter,
  MoreHorizontal,
  Eye,
  Edit,
  Copy,
  Trash2,
  FileText,
  Calendar,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Building,
  User,
  MapPin,
  Phone,
  Mail,
  ChevronDown,
} from "lucide-react";

interface Quote {
  id: string;
  clientName: string;
  projectTitle: string;
  amount: number;
  status: "draft" | "awaiting" | "accepted" | "declined" | "cancelled";
  createdDate: string;
  expiryDate: string;
  description: string;
  clientEmail: string;
  clientPhone: string;
  clientAddress: string;
}

interface QuoteTemplate {
  id: string;
  name: string;
  description: string;
  baseAmount: number;
  category: string;
}

const mockQuotes: Quote[] = [
  {
    id: "Q-2024-001",
    clientName: "ABC Construction Ltd",
    projectTitle: "Office Building Renovation",
    amount: 125000,
    status: "awaiting",
    createdDate: "2024-01-15",
    expiryDate: "2024-02-15",
    description: "Complete renovation of 3-story office building including electrical, plumbing, and interior work",
    clientEmail: "contact@abcconstruction.com",
    clientPhone: "+1 (555) 123-4567",
    clientAddress: "123 Business Ave, City, State 12345"
  },
  {
    id: "Q-2024-002",
    clientName: "Smith Residential",
    projectTitle: "Kitchen Remodel",
    amount: 45000,
    status: "accepted",
    createdDate: "2024-01-10",
    expiryDate: "2024-02-10",
    description: "Full kitchen renovation with custom cabinets and granite countertops",
    clientEmail: "john.smith@email.com",
    clientPhone: "+1 (555) 987-6543",
    clientAddress: "456 Residential St, City, State 12345"
  },
  {
    id: "Q-2024-003",
    clientName: "Metro Shopping Center",
    projectTitle: "Parking Lot Expansion",
    amount: 89000,
    status: "declined",
    createdDate: "2024-01-08",
    expiryDate: "2024-02-08",
    description: "Expansion of existing parking lot with 50 additional spaces",
    clientEmail: "facilities@metroshopping.com",
    clientPhone: "+1 (555) 456-7890",
    clientAddress: "789 Commerce Blvd, City, State 12345"
  },
  {
    id: "Q-2024-004",
    clientName: "Green Valley Homes",
    projectTitle: "New Home Construction",
    amount: 285000,
    status: "draft",
    createdDate: "2024-01-20",
    expiryDate: "2024-02-20",
    description: "Construction of 2,500 sq ft single-family home with modern amenities",
    clientEmail: "info@greenvalleyhomes.com",
    clientPhone: "+1 (555) 321-0987",
    clientAddress: "321 Valley View Dr, City, State 12345"
  },
  {
    id: "Q-2024-005",
    clientName: "City Municipal",
    projectTitle: "Bridge Repair",
    amount: 156000,
    status: "cancelled",
    createdDate: "2024-01-05",
    expiryDate: "2024-02-05",
    description: "Structural repairs and maintenance for downtown bridge",
    clientEmail: "public.works@city.gov",
    clientPhone: "+1 (555) 654-3210",
    clientAddress: "100 City Hall Plaza, City, State 12345"
  }
];

const mockTemplates: QuoteTemplate[] = [
  {
    id: "T-001",
    name: "Basic Kitchen Remodel",
    description: "Standard kitchen renovation package",
    baseAmount: 35000,
    category: "Residential"
  },
  {
    id: "T-002",
    name: "Office Renovation",
    description: "Commercial office space renovation",
    baseAmount: 75000,
    category: "Commercial"
  },
  {
    id: "T-003",
    name: "Bathroom Remodel",
    description: "Complete bathroom renovation",
    baseAmount: 18000,
    category: "Residential"
  },
  {
    id: "T-004",
    name: "Concrete Driveway",
    description: "Standard concrete driveway installation",
    baseAmount: 8500,
    category: "Exterior"
  },
  {
    id: "T-005",
    name: "Advanced Construction Quote",
    description: "Interactive construction quote template with editable items",
    baseAmount: 172000,
    category: "Construction"
  }
];

const getStatusIcon = (status: Quote["status"]) => {
  switch (status) {
    case "draft":
      return <FileText className="h-4 w-4" />;
    case "awaiting":
      return <Clock className="h-4 w-4" />;
    case "accepted":
      return <CheckCircle className="h-4 w-4" />;
    case "declined":
      return <XCircle className="h-4 w-4" />;
    case "cancelled":
      return <AlertCircle className="h-4 w-4" />;
    default:
      return <FileText className="h-4 w-4" />;
  }
};

const getStatusColor = (status: Quote["status"]) => {
  switch (status) {
    case "draft":
      return "bg-gray-100 text-gray-800 border-gray-200";
    case "awaiting":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "accepted":
      return "bg-green-100 text-green-800 border-green-200";
    case "declined":
      return "bg-red-100 text-red-800 border-red-200";
    case "cancelled":
      return "bg-orange-100 text-orange-800 border-orange-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const QuoteDetailsDialog = ({ quote, open, onOpenChange }: { quote: Quote; open: boolean; onOpenChange: (open: boolean) => void }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Quote Details - {quote.id}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium text-sm text-muted-foreground">Project Information</h4>
              <div className="space-y-1">
                <p className="font-semibold">{quote.projectTitle}</p>
                <p className="text-sm text-muted-foreground">{quote.description}</p>
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-sm text-muted-foreground">Quote Details</h4>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span className="font-semibold text-lg">{formatCurrency(quote.amount)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={`${getStatusColor(quote.status)} border`}>
                    {getStatusIcon(quote.status)}
                    <span className="ml-1 capitalize">{quote.status}</span>
                  </Badge>
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-medium text-sm text-muted-foreground">Client Information</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  <span>{quote.clientName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{quote.clientEmail}</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{quote.clientPhone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{quote.clientAddress}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium text-sm text-muted-foreground">Created Date</h4>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>{formatDate(quote.createdDate)}</span>
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-sm text-muted-foreground">Expiry Date</h4>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>{formatDate(quote.expiryDate)}</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const ConstructionQuotingPage = () => {
  const navigate = useNavigate();
  const [quotes] = useState<Quote[]>(mockQuotes);
  const [templates] = useState<QuoteTemplate[]>(mockTemplates);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [showTemplateSelect, setShowTemplateSelect] = useState(false);

  const filteredQuotes = quotes.filter((quote) => {
    const matchesSearch = 
      quote.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quote.projectTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quote.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === "all") return matchesSearch;
    return matchesSearch && quote.status === activeTab;
  });

  const getTabCount = (status: string) => {
    if (status === "all") return quotes.length;
    return quotes.filter(q => q.status === status).length;
  };

  const handleViewDetails = (quote: Quote) => {
    setSelectedQuote(quote);
    setDetailsOpen(true);
  };

  const handleNewQuote = () => {
    navigate('/quotes/new');
  };

  const handleFromTemplate = () => {
    setShowTemplateSelect(true);
  };

  const handleTemplateSelect = (templateId: string) => {
    if (templateId === "T-005") {
      // Advanced Construction Quote template
      navigate('/quotes/new?template=advanced-construction');
    } else {
      // Regular templates
      navigate(`/quotes/new?template=${templateId}`);
    }
    setShowTemplateSelect(false);
  };

  return (
    <BaseLayout>
      <div className="container mx-auto p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Quotes</h1>
              <p className="text-muted-foreground">Manage your project quotes and proposals</p>
        </div>
            <div className="flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Quote
                    <ChevronDown className="h-4 w-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem onClick={() => navigate('/quotes/new?type=blank')}>
                    <FileText className="h-4 w-4 mr-2" />
                    From Blank
                  </DropdownMenuItem>
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                      <FileText className="h-4 w-4 mr-2" />
                      From Template
                    </DropdownMenuSubTrigger>
                    <DropdownMenuSubContent className="w-56">
                      {templates.map(template => (
                        <DropdownMenuItem 
                          key={template.id}
                          onClick={() => handleTemplateSelect(template.id)}
                        >
                          <span className="font-medium">{template.name}</span>
                          <span className="ml-auto text-xs text-muted-foreground">
                            {template.category}
                          </span>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuSubContent>
                  </DropdownMenuSub>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <Button variant="outline" onClick={handleNewQuote}>
                <Plus className="h-4 w-4 mr-2" />
                Quote Templates
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Quotes</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{quotes.length}</div>
                <p className="text-xs text-muted-foreground">Active proposals</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Value</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(quotes.reduce((sum, quote) => sum + quote.amount, 0))}
                </div>
                <p className="text-xs text-muted-foreground">Combined quote value</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Accepted</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {quotes.filter(q => q.status === "accepted").length}
                </div>
                <p className="text-xs text-muted-foreground">Approved quotes</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending</CardTitle>
                <Clock className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">
                  {quotes.filter(q => q.status === "awaiting").length}
                </div>
                <p className="text-xs text-muted-foreground">Awaiting response</p>
              </CardContent>
            </Card>
            </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search quotes by client, project, or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>

          {/* Tabs and Table */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="all" className="flex items-center gap-2">
                All ({getTabCount("all")})
              </TabsTrigger>
              <TabsTrigger value="draft" className="flex items-center gap-2">
                Draft ({getTabCount("draft")})
              </TabsTrigger>
              <TabsTrigger value="awaiting" className="flex items-center gap-2">
                Awaiting ({getTabCount("awaiting")})
              </TabsTrigger>
              <TabsTrigger value="accepted" className="flex items-center gap-2">
                Accepted ({getTabCount("accepted")})
              </TabsTrigger>
              <TabsTrigger value="declined" className="flex items-center gap-2">
                Declined ({getTabCount("declined")})
              </TabsTrigger>
              <TabsTrigger value="cancelled" className="flex items-center gap-2">
                Cancelled ({getTabCount("cancelled")})
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="space-y-4">
              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Quote ID</TableHead>
                        <TableHead>Client</TableHead>
                        <TableHead>Project</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead>Expires</TableHead>
                        <TableHead className="w-[50px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredQuotes.map((quote) => (
                        <TableRow key={quote.id}>
                          <TableCell className="font-medium">{quote.id}</TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{quote.clientName}</div>
                              <div className="text-sm text-muted-foreground">{quote.clientEmail}</div>
                  </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{quote.projectTitle}</div>
                              <div className="text-sm text-muted-foreground truncate max-w-[200px]">
                                {quote.description}
                  </div>
                  </div>
                          </TableCell>
                          <TableCell className="font-semibold">
                            {formatCurrency(quote.amount)}
                          </TableCell>
                          <TableCell>
                            <Badge className={`${getStatusColor(quote.status)} border`}>
                              {getStatusIcon(quote.status)}
                              <span className="ml-1 capitalize">{quote.status}</span>
                            </Badge>
                          </TableCell>
                          <TableCell>{formatDate(quote.createdDate)}</TableCell>
                          <TableCell>{formatDate(quote.expiryDate)}</TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleViewDetails(quote)}>
                                  <Eye className="h-4 w-4 mr-2" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit Quote
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Copy className="h-4 w-4 mr-2" />
                                  Duplicate
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-red-600">
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Templates Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Quote Templates
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {templates.map((template) => (
                  <Card 
                    key={template.id} 
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => handleTemplateSelect(template.id)}
                  >
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <h4 className="font-semibold">{template.name}</h4>
                        <p className="text-sm text-muted-foreground">{template.description}</p>
                        <div className="flex justify-between items-center">
                          <Badge variant="outline">{template.category}</Badge>
                          <span className="font-semibold">{formatCurrency(template.baseAmount)}</span>
                  </div>
                  </div>
                    </CardContent>
                  </Card>
                ))}
                  </div>
            </CardContent>
          </Card>

          {/* Quote Details Dialog */}
          {selectedQuote && (
            <QuoteDetailsDialog
              quote={selectedQuote}
              open={detailsOpen}
              onOpenChange={setDetailsOpen}
            />
          )}
        </div>
      </div>
    </BaseLayout>
  );
};

export default ConstructionQuotingPage;
