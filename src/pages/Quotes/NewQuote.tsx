import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/ui/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Upload, FilePlus, FileText, BarChartBig, Paperclip, Palette, Settings, CheckCircle, Layers, Search, Download, MessageSquare, Filter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { CustomerForm } from "./components/CustomerForm";
import { QuoteItemsForm, QuoteItem } from "./components/QuoteItemsForm";
import { PriceListForm } from "./components/PriceListForm";
import { TermsForm } from "./components/TermsForm";
import { QuotePreview } from "./components/QuotePreview";
import { FileUpload } from "@/components/tasks/FileUpload";
import { ImagesGrid } from "@/components/tasks/ImagesGrid";
import { ErrorBoundary } from "react-error-boundary";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Quote status options
const statusFilters = [
  { name: "Draft", count: 24, color: "bg-slate-200" },
  { name: "Awaiting Acceptance", count: 12, color: "bg-slate-200" },
  { name: "Accepted", count: 22, color: "bg-slate-200" },
  { name: "Declined", count: 10, color: "bg-slate-200" },
  { name: "Canceled", count: 5, color: "bg-slate-200" },
  { name: "All", count: 73, color: "bg-slate-200" },
  { name: "Templates", count: 14, color: "bg-slate-200" }
];

function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div className="p-6 text-center">
      <h2 className="text-lg font-semibold text-red-600">Something went wrong:</h2>
      <pre className="mt-2 text-sm overflow-auto p-4 bg-gray-100 rounded">{error.message}</pre>
      <Button onClick={resetErrorBoundary} className="mt-4">Try again</Button>
    </div>
  );
}

export default function QuotesMain() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeSection, setActiveSection] = useState("customer");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [quoteItems, setQuoteItems] = useState<QuoteItem[]>([{
    description: "",
    quantity: 1,
    rate: 0,
    total: 0
  }]);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [quoteLetterSpecs, setQuoteLetterSpecs] = useState("");
  const [requestForQuote, setRequestForQuote] = useState("");
  const [quoteName, setQuoteName] = useState("New Quote");
  const [showTemplates, setShowTemplates] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedTemplateCategory, setSelectedTemplateCategory] = useState("All Categories");

  const handleBack = () => {
    navigate("/quotes");
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setUploadedFiles(prev => [...prev, ...newFiles]);

      // Create preview URLs for images
      const newPreviewUrls = newFiles.map(file => {
        if (file.type.startsWith('image/')) {
          return URL.createObjectURL(file);
        }
        return '';
      }).filter(url => url !== '');
      setPreviewImages(prev => [...prev, ...newPreviewUrls]);
      toast({
        title: "Files Uploaded",
        description: `${newFiles.length} file(s) added to quote`
      });
    }
  };

  const handleAddPriceListItem = (item: any) => {
    const newItem = {
      description: item.name,
      quantity: 1,
      rate: item.price,
      total: item.price
    };
    setQuoteItems([...quoteItems, newItem]);
    toast({
      title: "Item Added",
      description: `${item.name} has been added to your quote`
    });
  };

  const handleSaveQuote = () => {
    toast({
      title: "Quote Saved",
      description: "Quote has been saved successfully"
    });
  };

  const handleSendQuote = () => {
    toast({
      title: "Quote Sent",
      description: "Quote has been sent to the customer"
    });
    navigate("/quotes");
  };

  const handleStatusChange = (status) => {
    setSelectedStatus(status);
    if (status === "Templates") {
      setShowTemplates(true);
    } else {
      setShowTemplates(false);
    }
  };

  // Render the active section component
  const renderActiveSection = () => {
    switch (activeSection) {
      case "customer":
        return <CustomerForm onNextTab={() => setActiveSection("items")} />;
      case "items":
        return <QuoteItemsForm 
          quoteItems={quoteItems} 
          setQuoteItems={setQuoteItems} 
          onPrevTab={() => setActiveSection("customer")} 
          onNextTab={() => setActiveSection("terms")} 
        />;
      case "priceList":
        return <PriceListForm onAddItemToQuote={handleAddPriceListItem} onChangeTab={() => setActiveSection("items")} />;
      case "terms":
        return <TermsForm onPrevTab={() => setActiveSection("items")} onNextTab={() => setActiveSection("customer")} />;
      case "specs":
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-slate-800">Quote Letter Specifications</h3>
            <textarea 
              className="w-full p-3 border rounded-md h-40 focus:ring-2 focus:ring-blue-400 focus:border-blue-400" 
              placeholder="Enter quote letter specifications..."
              value={quoteLetterSpecs}
              onChange={(e) => setQuoteLetterSpecs(e.target.value)}
            />
            <Button 
              onClick={() => setActiveSection("request")}
              className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800"
            >
              Next
            </Button>
          </div>
        );
      case "request":
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-slate-800">Request for Quote</h3>
            <textarea 
              className="w-full p-3 border rounded-md h-40 focus:ring-2 focus:ring-blue-400 focus:border-blue-400" 
              placeholder="Enter request for quote details..."
              value={requestForQuote}
              onChange={(e) => setRequestForQuote(e.target.value)}
            />
            <Button 
              onClick={() => setActiveSection("customer")}
              className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800"
            >
              Next
            </Button>
          </div>
        );
      case "estimate":
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-slate-800">Estimates & Costings</h3>
            <QuoteItemsForm 
              quoteItems={quoteItems} 
              setQuoteItems={setQuoteItems} 
              onPrevTab={() => setActiveSection("request")} 
              onNextTab={() => setActiveSection("terms")} 
            />
          </div>
        );
      default:
        return <CustomerForm onNextTab={() => setActiveSection("items")} />;
    }
  };

  const renderQuoteTemplates = () => {
    const templates = [
      { id: 1, name: "CRM Integration Proposal", industry: "Technology", category: "Tech & IT", imgUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070", price: 9.99 },
      { id: 2, name: "Consulting Proposal", industry: "Business", category: "Business Services", imgUrl: "https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?q=80&w=987", price: 9.99 },
      { id: 3, name: "Insurance Proposal", industry: "Insurance", category: "Finance & Insurance", imgUrl: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=2070", price: 9.99 },
      { id: 4, name: "Home Renovation", industry: "Construction", category: "Construction", imgUrl: "https://images.unsplash.com/photo-1556912167-f556f1f39fdf?q=80&w=2070", price: 9.99 },
      { id: 5, name: "Real Estate Agreement", industry: "Real Estate", category: "Real Estate", imgUrl: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1973", price: 9.99 },
      { id: 6, name: "Catering Contract", industry: "Food & Beverage", category: "Hospitality & Events", imgUrl: "https://images.unsplash.com/photo-1465351230898-5de95d07f51a?q=80&w=2069", price: 9.99 },
      { id: 7, name: "Gym Release of Liability", industry: "Fitness", category: "Health & Fitness", imgUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=2070", price: 9.99 },
      { id: 8, name: "Investment Advisor Proposal", industry: "Finance", category: "Finance & Insurance", imgUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070", price: 9.99 },
      { id: 9, name: "Legal Services Agreement", industry: "Legal", category: "Legal Services", imgUrl: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=2070", price: 9.99 },
      { id: 10, name: "Wedding Photography Contract", industry: "Photography", category: "Creative Services", imgUrl: "https://images.unsplash.com/photo-1537633552985-df8429e8048b?q=80&w=2070", price: 9.99 },
      { id: 11, name: "Website Development Proposal", industry: "Web Development", category: "Tech & IT", imgUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=2072", price: 9.99 },
      { id: 12, name: "HVAC Maintenance Agreement", industry: "Maintenance", category: "Construction", imgUrl: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=2069", price: 9.99 }
    ];

    // Extract unique categories for the sidebar
    const categories = Array.from(new Set(templates.map(t => t.category)));
    
    // Filter templates by selected category
    const filteredTemplates = selectedTemplateCategory === "All Categories" 
      ? templates 
      : templates.filter(t => t.category === selectedTemplateCategory);

    return (
      <div className="flex h-full">
        {/* Categories Sidebar */}
        <div className="w-1/4 bg-slate-50 border-r border-slate-200 p-4 min-h-screen">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-slate-800 mb-2">Categories</h2>
            <p className="text-sm text-slate-600 mb-4">Browse templates by industry</p>
            
            <div className="relative w-full mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input 
                placeholder="Search categories" 
                className="pl-10 h-10 border-slate-300 focus:border-blue-500 w-full"
              />
            </div>
            
            <div className="space-y-1">
              <button 
                className={`w-full text-left p-2.5 rounded-md text-sm font-medium ${
                  selectedTemplateCategory === "All Categories" 
                    ? "bg-blue-50 text-blue-700" 
                    : "text-slate-700 hover:bg-slate-100"
                }`}
                onClick={() => setSelectedTemplateCategory("All Categories")}
              >
                All Categories
              </button>
              
              {categories.map(category => (
                <button 
                  key={category}
                  className={`w-full text-left p-2.5 rounded-md text-sm font-medium ${
                    selectedTemplateCategory === category 
                      ? "bg-blue-50 text-blue-700" 
                      : "text-slate-700 hover:bg-slate-100"
                  }`}
                  onClick={() => setSelectedTemplateCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
          
          <div className="border-t border-slate-200 pt-4">
            <h3 className="text-sm font-medium text-slate-700 mb-3">Popular Tags</h3>
            <div className="flex flex-wrap gap-2">
              {["New", "Popular", "Premium", "Free", "Simple", "Professional"].map(tag => (
                <Badge key={tag} className="bg-slate-100 text-slate-700 hover:bg-slate-200 cursor-pointer">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Templates Content */}
        <div className="w-3/4 p-6 overflow-y-auto">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Quote Templates</h2>
            <p className="text-slate-600">Browse and purchase professional templates for your quotes</p>
          </div>

          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-3">
              <Button variant="outline" className="rounded-full flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <span>Filters</span>
              </Button>
            </div>
            <div className="flex items-center space-x-3">
              <div className="relative w-72">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input 
                  placeholder="Search for a Template" 
                  className="pl-10 h-10 border-slate-300 focus:border-blue-500"
                />
              </div>
              <select className="h-10 px-4 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option>Most Popular</option>
                <option>Newest</option>
                <option>Highest Rated</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map(template => (
              <div key={template.id} className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300 border border-slate-200">
                <div 
                  className="absolute inset-0 bg-cover bg-center" 
                  style={{ backgroundImage: `url(${template.imgUrl})` }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/70 to-transparent"></div>
                <div className="absolute inset-0 flex flex-col justify-between p-4">
                  <div className="flex justify-between">
                    <Badge className="bg-blue-500/80 hover:bg-blue-600 backdrop-blur-sm text-white">{template.industry}</Badge>
                    <div className="flex space-x-1">
                      <button className="h-8 w-8 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-sm flex items-center justify-center text-white transition-colors">
                        <Download className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">{template.name}</h3>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-xs text-slate-300">Premium Template</p>
                      <p className="text-sm font-semibold text-white">${template.price}</p>
                    </div>
                    <Button 
                      className="mt-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white w-full"
                      size="sm"
                    >
                      Purchase Template
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <AppLayout>
        {/* Status Filter Bar */}
        <div className="bg-slate-50 border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
            <div className="flex items-center overflow-x-auto py-2 scrollbar-none">
              {statusFilters.map((filter) => (
                <div
                  key={filter.name}
                  onClick={() => handleStatusChange(filter.name)}
                  className={`flex items-center space-x-1 px-3 py-1 rounded-md mr-3 cursor-pointer select-none transition-colors ${
                    selectedStatus === filter.name
                      ? "bg-slate-200 shadow-sm"
                      : "hover:bg-slate-100"
                  }`}
                >
                  <span className="text-sm font-medium text-slate-700">{filter.name}</span>
                  <span className={`text-xs font-semibold rounded-full px-2 py-0.5 text-slate-700 bg-slate-200`}>
                    {filter.count}
                  </span>
                </div>
              ))}
            </div>
            
            {/* Notifications */}
            <div className="flex items-center">
              <div className="relative">
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="h-9 w-9 rounded-full p-0 relative"
                  onClick={() => setShowNotifications(!showNotifications)}
                >
                  <MessageSquare className="h-5 w-5 text-slate-700" />
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center">3</span>
                </Button>
                
                {showNotifications && (
                  <div className="absolute top-full right-0 mt-1 w-80 bg-white rounded-lg shadow-lg border border-slate-200 z-50">
                    <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                      <h3 className="text-sm font-medium text-slate-700">Quote Replies</h3>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0 rounded-full">
                        <span className="sr-only">Close</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                      </Button>
                    </div>
                    
                    <div className="max-h-96 overflow-y-auto p-3 divide-y divide-slate-100">
                      <div className="py-2">
                        <div className="flex justify-between items-start mb-1">
                          <p className="font-medium text-slate-800 text-sm">John Smith</p>
                          <span className="text-xs text-slate-500">2h ago</span>
                        </div>
                        <p className="text-slate-600 text-xs">Could you adjust the price for the fence material?</p>
                        <div className="flex mt-1 justify-end">
                          <Button variant="ghost" size="sm" className="h-6 text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-50 p-1">Reply</Button>
                        </div>
                      </div>
                      
                      <div className="py-2">
                        <div className="flex justify-between items-start mb-1">
                          <p className="font-medium text-slate-800 text-sm">Sarah Johnson</p>
                          <span className="text-xs text-slate-500">3h ago</span>
                        </div>
                        <p className="text-slate-600 text-xs">Can you send me a revised quote with the additional items we discussed?</p>
                        <div className="flex mt-1 justify-end">
                          <Button variant="ghost" size="sm" className="h-6 text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-50 p-1">Reply</Button>
                        </div>
                      </div>
                      
                      <div className="py-2">
                        <div className="flex justify-between items-start mb-1">
                          <p className="font-medium text-slate-800 text-sm">Tom Williams</p>
                          <span className="text-xs text-slate-500">Yesterday</span>
                        </div>
                        <p className="text-slate-600 text-xs">Thanks for the quote. Looking forward to getting started.</p>
                        <div className="flex mt-1 justify-end">
                          <Button variant="ghost" size="sm" className="h-6 text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-50 p-1">Reply</Button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-3 bg-slate-50 border-t border-slate-200">
                      <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white text-xs">
                        View All Messages
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {showTemplates ? (
          renderQuoteTemplates()
        ) : (
          <div className="p-6 max-w-7xl mx-auto w-full">
            {/* Quote Header Controls */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-4">
              <div className="bg-slate-300 rounded-md p-2 border border-slate-200 shadow-sm">
                <h3 className="text-xs font-medium text-slate-700 mb-1">Quote Letter Specs</h3>
                <div className="flex items-center justify-center p-2 bg-white rounded border border-slate-200 text-xs text-slate-700 h-7">
                  <FileText className="h-3.5 w-3.5 mr-1.5 text-slate-500" />
                  <span>Edit Specifications</span>
                </div>
              </div>
              
              <div className="bg-slate-300 rounded-md p-2 border border-slate-200 shadow-sm">
                <h3 className="text-xs font-medium text-slate-700 mb-1">Requests for Quotes</h3>
                <div className="flex items-center justify-center p-2 bg-white rounded border border-slate-200 text-xs text-slate-700 h-7">
                  <FilePlus className="h-3.5 w-3.5 mr-1.5 text-slate-500" />
                  <span>View Requests</span>
                </div>
              </div>
              
              <div className="bg-slate-300 rounded-md p-2 border border-slate-200 shadow-sm">
                <h3 className="text-xs font-medium text-slate-700 mb-1">Estimates & Costings</h3>
                <div className="flex items-center justify-center p-2 bg-white rounded border border-slate-200 text-xs text-slate-700 h-7">
                  <BarChartBig className="h-3.5 w-3.5 mr-1.5 text-slate-500" />
                  <span>Calculate Costs</span>
                </div>
              </div>
              
              <div className="bg-slate-300 rounded-md p-2 border border-slate-200 shadow-sm">
                <h3 className="text-xs font-medium text-slate-700 mb-1">Upload Files</h3>
                <div className="flex items-center justify-center p-2 bg-white rounded border border-slate-200 text-xs text-slate-700 h-7">
                  <Upload className="h-3.5 w-3.5 mr-1.5 text-slate-500" />
                  <span>Upload Plans/Photos</span>
                </div>
              </div>
            </div>
            
            {/* Display uploaded images */}
            {previewImages.length > 0 && (
              <div className="mb-6 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <Paperclip className="h-4 w-4 mr-1 text-blue-500" />
                  Attached Files ({previewImages.length})
                </h3>
                <div className="max-h-24 overflow-y-auto">
                  <ImagesGrid images={previewImages} />
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Left Panel - Navigation */}
              <div className="md:col-span-3">
                <div className="bg-slate-50 rounded-md shadow-sm overflow-hidden border border-slate-200">
                  <div className="p-3 bg-slate-300 font-medium flex items-center text-sm border-b border-slate-200">
                    <Layers className="h-4 w-4 mr-2 text-blue-500" /> 
                    <span className="text-slate-700">SECTIONS</span>
                  </div>
                  <div className="divide-y divide-slate-100">
                    <div className="p-1">
                      <Button 
                        variant={activeSection === "specs" ? "default" : "ghost"} 
                        className={`justify-start w-full ${activeSection === "specs" 
                          ? "bg-blue-500 text-white hover:bg-blue-600" 
                          : "text-slate-700 hover:text-slate-900 hover:bg-slate-100"}`}
                        onClick={() => setActiveSection("specs")}
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        Quote Specifications
                      </Button>
                    </div>
                    <div className="p-1">
                      <Button 
                        variant={activeSection === "request" ? "default" : "ghost"} 
                        className={`justify-start w-full ${activeSection === "request" 
                          ? "bg-blue-500 text-white hover:bg-blue-600" 
                          : "text-slate-700 hover:text-slate-900 hover:bg-slate-100"}`}
                        onClick={() => setActiveSection("request")}
                      >
                        <FilePlus className="h-4 w-4 mr-2" />
                        Request for Quote
                      </Button>
                    </div>
                    <div className="p-1">
                      <Button 
                        variant={activeSection === "customer" ? "default" : "ghost"} 
                        className={`justify-start w-full ${activeSection === "customer" 
                          ? "bg-blue-500 text-white hover:bg-blue-600" 
                          : "text-slate-700 hover:text-slate-900 hover:bg-slate-100"}`}
                        onClick={() => setActiveSection("customer")}
                      >
                        <Paperclip className="h-4 w-4 mr-2" />
                        Customer Details
                      </Button>
                    </div>
                    <div className="p-1">
                      <Button 
                        variant={activeSection === "items" ? "default" : "ghost"} 
                        className={`justify-start w-full ${activeSection === "items" 
                          ? "bg-blue-500 text-white hover:bg-blue-600" 
                          : "text-slate-700 hover:text-slate-900 hover:bg-slate-100"}`}
                        onClick={() => setActiveSection("items")}
                      >
                        <Paperclip className="h-4 w-4 mr-2" />
                        Quote Items
                      </Button>
                    </div>
                    <div className="p-1">
                      <Button 
                        variant={activeSection === "priceList" ? "default" : "ghost"} 
                        className={`justify-start w-full ${activeSection === "priceList" 
                          ? "bg-blue-500 text-white hover:bg-blue-600" 
                          : "text-slate-700 hover:text-slate-900 hover:bg-slate-100"}`}
                        onClick={() => setActiveSection("priceList")}
                      >
                        <Paperclip className="h-4 w-4 mr-2" />
                        Price List
                      </Button>
                    </div>
                    <div className="p-1">
                      <Button 
                        variant={activeSection === "terms" ? "default" : "ghost"} 
                        className={`justify-start w-full ${activeSection === "terms" 
                          ? "bg-blue-500 text-white hover:bg-blue-600" 
                          : "text-slate-700 hover:text-slate-900 hover:bg-slate-100"}`}
                        onClick={() => setActiveSection("terms")}
                      >
                        <Paperclip className="h-4 w-4 mr-2" />
                        Terms & Conditions
                      </Button>
                    </div>
                    <div className="p-1">
                      <Button 
                        variant={activeSection === "estimate" ? "default" : "ghost"} 
                        className={`justify-start w-full ${activeSection === "estimate" 
                          ? "bg-blue-500 text-white hover:bg-blue-600" 
                          : "text-slate-700 hover:text-slate-900 hover:bg-slate-100"}`}
                        onClick={() => setActiveSection("estimate")}
                      >
                        <BarChartBig className="h-4 w-4 mr-2" />
                        Estimates & Costings
                      </Button>
                    </div>
                    
                    {/* Template Options section */}
                    <div className="p-3 bg-slate-300 flex items-center justify-between border-t border-slate-200">
                      <div className="flex items-center space-x-2 text-sm text-slate-700">
                        <Settings className="h-4 w-4 text-blue-500" />
                        <span>Template Options</span>
                      </div>
                      <Button size="sm" variant="ghost" className="h-7 px-2 hover:bg-slate-200 text-blue-500">
                        <Palette className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Middle Panel - Active Section */}
              <div className="md:col-span-4">
                <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-slate-200">
                  <div className="p-3 bg-slate-300 border-b border-slate-300 flex items-center justify-between">
                    <h3 className="font-medium text-slate-700 flex items-center">
                      <span className="h-2 w-2 rounded-full bg-blue-500 mr-2"></span>
                      Edit {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}
                    </h3>
                    <Button size="sm" variant="ghost" className="h-7 w-7 p-0 rounded-full hover:bg-slate-300/50">
                      <Settings className="h-3.5 w-3.5 text-slate-500" />
                    </Button>
                  </div>
                  <div className="p-5">
                    {renderActiveSection()}
                  </div>
                  <div className="bg-gradient-to-r from-slate-50 to-slate-100 p-3 border-t border-slate-200 flex justify-end">
                    <Button size="sm" className="bg-blue-500 text-white hover:bg-blue-600">
                      <CheckCircle className="h-3.5 w-3.5 mr-1" />
                      Update
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* Right Panel - Preview */}
              <div className="md:col-span-5">
                <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-slate-200">
                  <div className="p-3 bg-slate-700 text-white flex items-center justify-between">
                    <h3 className="font-medium flex items-center">
                      <span className="h-2 w-2 rounded-full bg-green-400 mr-2"></span>
                      Live Preview
                    </h3>
                    <div className="flex items-center space-x-1">
                      <Button size="sm" variant="ghost" className="h-7 text-xs text-slate-300 hover:bg-slate-600 hover:text-white">
                        Print
                      </Button>
                      <Button size="sm" variant="ghost" className="h-7 text-xs text-slate-300 hover:bg-slate-600 hover:text-white">
                        Email
                      </Button>
                    </div>
                  </div>
                  <div className="p-5 max-h-[700px] overflow-y-auto bg-gray-50">
                    <QuotePreview quoteItems={quoteItems} onPrevTab={() => {}} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </AppLayout>
    </ErrorBoundary>
  );
}
