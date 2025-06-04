import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Check, ShoppingCart, Image, List } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

// Mock data for quote templates
const QUOTE_TEMPLATES = [{
  id: "temp-1",
  name: "Basic Plumbing Service",
  category: "Plumbing",
  usageCount: 24,
  imageUrl: "/images/templates/plumbing-basic.jpg",
  isPremium: false,
  items: [{
    description: "Labor - Standard Rate",
    quantity: 2,
    rate: 85
  }, {
    description: "Basic Materials",
    quantity: 1,
    rate: 45
  }]
}, {
  id: "temp-2",
  name: "Bathroom Renovation",
  category: "Renovation",
  usageCount: 18,
  imageUrl: "/images/templates/bathroom-reno.jpg",
  isPremium: true,
  price: 9.99,
  items: [{
    description: "Labor - Standard Rate",
    quantity: 16,
    rate: 85
  }, {
    description: "Premium Fixtures",
    quantity: 1,
    rate: 850
  }, {
    description: "Tiles and Grout",
    quantity: 1,
    rate: 350
  }, {
    description: "Plumbing Materials",
    quantity: 1,
    rate: 220
  }]
}, {
  id: "temp-3",
  name: "Electrical Repair",
  category: "Electrical",
  usageCount: 32,
  imageUrl: "/images/templates/electrical-repair.jpg",
  isPremium: false,
  items: [{
    description: "Electrician Labor",
    quantity: 3,
    rate: 95
  }, {
    description: "Electrical Supplies",
    quantity: 1,
    rate: 125
  }]
}, {
  id: "temp-4",
  name: "Kitchen Remodeling",
  category: "Renovation",
  usageCount: 15,
  imageUrl: "/images/templates/kitchen-remodel.jpg",
  isPremium: true,
  price: 14.99,
  items: [{
    description: "Labor - Premium Rate",
    quantity: 24,
    rate: 95
  }, {
    description: "Cabinetry",
    quantity: 1,
    rate: 3200
  }, {
    description: "Countertops",
    quantity: 1,
    rate: 1800
  }, {
    description: "Appliances",
    quantity: 1,
    rate: 2500
  }, {
    description: "Plumbing and Electrical",
    quantity: 1,
    rate: 950
  }]
}, {
  id: "temp-5",
  name: "HVAC Maintenance",
  category: "HVAC",
  usageCount: 28,
  imageUrl: "/images/templates/hvac-maintenance.jpg",
  isPremium: false,
  items: [{
    description: "HVAC Technician",
    quantity: 2,
    rate: 90
  }, {
    description: "Filters and Parts",
    quantity: 1,
    rate: 120
  }]
}];

// Updated categories to match the ones in the screenshot
const CATEGORIES = [
  "All", 
  "Plumbing", 
  "Renovation", 
  "Electrical", 
  "HVAC", 
  "Tech & IT",
  "Business Services",
  "Finance & Insurance",
  "Construction",
  "Real Estate",
  "Hospitality & Events",
  "Health & Fitness",
  "Legal Services",
  "Creative Services"
];

interface QuoteTemplateSelectorProps {
  onSelectTemplate: (templateId: string) => void;
  selectedTemplate: string | null;
}

export function QuoteTemplateSelector({
  onSelectTemplate,
  selectedTemplate
}: QuoteTemplateSelectorProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"list" | "grid">("grid");
  const [category, setCategory] = useState("All");
  
  // Add null check and default to empty array
  const templates = QUOTE_TEMPLATES || [];
  
  const filteredTemplates = templates.filter(template => 
    (template.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    template.category.toLowerCase().includes(searchQuery.toLowerCase())) &&
    (category === "All" || template.category === category)
  );

  const handleBuyTemplate = (templateId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    // Implementation would connect to payment gateway
    toast.success(`Purchasing template ${templateId}`);
  };

  const handleCategoryChange = (newCategory: string) => {
    setCategory(newCategory);
    toast.success(`Showing ${newCategory === 'All' ? 'all templates' : `${newCategory} templates`}`);
  };

  const handleSelectTemplate = (templateId: string) => {
    onSelectTemplate(templateId);
    toast.success(`Template selected: ${templates.find(t => t.id === templateId)?.name}`);
  };
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium">Quote Templates</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input 
              placeholder="Search templates..." 
              value={searchQuery} 
              onChange={e => setSearchQuery(e.target.value)} 
              className="pl-9" 
            />
          </div>
          
          <Select value={category} onValueChange={handleCategoryChange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map(cat => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <div className="flex rounded-md border">
            <Button 
              variant={viewMode === "grid" ? "default" : "ghost"} 
              size="sm" 
              onClick={() => setViewMode("grid")}
              className="rounded-r-none"
            >
              <Image className="h-4 w-4" />
            </Button>
            <Button 
              variant={viewMode === "list" ? "default" : "ghost"} 
              size="sm" 
              onClick={() => setViewMode("list")}
              className="rounded-l-none"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Category buttons - horizontal scrollable list */}
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
          {CATEGORIES.map(cat => (
            <Button
              key={cat}
              variant={category === cat ? "default" : "outline"}
              size="sm"
              onClick={() => handleCategoryChange(cat)}
              className="whitespace-nowrap"
            >
              {cat}
            </Button>
          ))}
        </div>
        
        <div className={`space-y-3 max-h-[600px] overflow-y-auto pr-1 ${viewMode === "grid" ? "grid grid-cols-2 gap-3" : ""}`}>
          {filteredTemplates.length === 0 ? (
            <div className="text-center py-8 text-gray-500 col-span-2">
              <p>No templates found for the selected category</p>
            </div>
          ) : (
            filteredTemplates.map(template => (
              <div 
                key={template.id} 
                onClick={() => handleSelectTemplate(template.id)} 
                className={`bg-slate-100 p-3 rounded-md cursor-pointer hover:bg-slate-200 transition-colors ${
                  selectedTemplate === template.id ? "ring-2 ring-blue-500" : ""
                }`}
              >
                {viewMode === "grid" && template.imageUrl && (
                  <div className="aspect-video bg-slate-200 rounded mb-2 overflow-hidden">
                    <img 
                      src={template.imageUrl} 
                      alt={template.name} 
                      className="w-full h-full object-cover"
                      onError={(e) => (e.target as HTMLImageElement).src = "/images/placeholder.jpg"}
                    />
                  </div>
                )}
                
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-sm line-clamp-1">{template.name}</h3>
                    <div className="flex items-center mt-1 gap-2">
                      <Badge variant="outline" className="text-xs bg-slate-300">
                        {template.category}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        Used {template.usageCount} times
                      </span>
                    </div>
                  </div>
                  {selectedTemplate === template.id && (
                    <Badge className="bg-blue-500">
                      <Check className="h-3 w-3 mr-1" />
                      Selected
                    </Badge>
                  )}
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  {(template.items || []).length} items · Total: $
                  {(template.items || []).reduce((sum, item) => sum + item.quantity * item.rate, 0).toLocaleString()}
                </div>
                
                {template.isPremium && (
                  <div className="mt-2 flex justify-between items-center">
                    <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">
                      Premium
                    </Badge>
                    {template.price && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-xs" 
                        onClick={(e) => handleBuyTemplate(template.id, e)}
                      >
                        <ShoppingCart className="h-3 w-3 mr-1" />
                        Buy ${template.price}
                      </Button>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => {
              setSearchQuery("");
              setCategory("All");
              toast.success("Showing all templates");
            }} 
            className="flex-1 bg-slate-500 hover:bg-slate-400 text-white"
          >
            Show All Templates
          </Button>
          
          <Button 
            variant="outline" 
            className="bg-blue-500 hover:bg-blue-400 text-white"
            onClick={() => {
              window.open('/template-marketplace', '_blank');
              toast.success("Opening template marketplace in new tab");
            }}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Template Marketplace
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
