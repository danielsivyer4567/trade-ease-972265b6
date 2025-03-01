
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Check } from "lucide-react";

// Mock data for quote templates
const QUOTE_TEMPLATES = [
  {
    id: "temp-1",
    name: "Basic Plumbing Service",
    category: "Plumbing",
    usageCount: 24,
    items: [
      { description: "Labor - Standard Rate", quantity: 2, rate: 85 },
      { description: "Basic Materials", quantity: 1, rate: 45 }
    ]
  },
  {
    id: "temp-2",
    name: "Bathroom Renovation",
    category: "Renovation",
    usageCount: 18,
    items: [
      { description: "Labor - Standard Rate", quantity: 16, rate: 85 },
      { description: "Premium Fixtures", quantity: 1, rate: 850 },
      { description: "Tiles and Grout", quantity: 1, rate: 350 },
      { description: "Plumbing Materials", quantity: 1, rate: 220 }
    ]
  },
  {
    id: "temp-3",
    name: "Electrical Repair",
    category: "Electrical",
    usageCount: 32,
    items: [
      { description: "Electrician Labor", quantity: 3, rate: 95 },
      { description: "Electrical Supplies", quantity: 1, rate: 125 }
    ]
  },
  {
    id: "temp-4",
    name: "Kitchen Remodeling",
    category: "Renovation",
    usageCount: 15,
    items: [
      { description: "Labor - Premium Rate", quantity: 24, rate: 95 },
      { description: "Cabinetry", quantity: 1, rate: 3200 },
      { description: "Countertops", quantity: 1, rate: 1800 },
      { description: "Appliances", quantity: 1, rate: 2500 },
      { description: "Plumbing and Electrical", quantity: 1, rate: 950 }
    ]
  },
  {
    id: "temp-5",
    name: "HVAC Maintenance",
    category: "HVAC",
    usageCount: 28,
    items: [
      { description: "HVAC Technician", quantity: 2, rate: 90 },
      { description: "Filters and Parts", quantity: 1, rate: 120 }
    ]
  }
];

interface QuoteTemplateSelectorProps {
  onSelectTemplate: (templateId: string) => void;
  selectedTemplate: string | null;
}

export function QuoteTemplateSelector({ onSelectTemplate, selectedTemplate }: QuoteTemplateSelectorProps) {
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredTemplates = QUOTE_TEMPLATES.filter(template => 
    template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    template.category.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium">Quote Templates</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        
        <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
          {filteredTemplates.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No templates found</p>
            </div>
          ) : (
            filteredTemplates.map(template => (
              <div 
                key={template.id} 
                className={`border rounded-md p-3 transition-all hover:bg-gray-50 cursor-pointer ${
                  selectedTemplate === template.id ? 'border-blue-500 bg-blue-50 hover:bg-blue-50' : ''
                }`}
                onClick={() => onSelectTemplate(template.id)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-sm line-clamp-1">{template.name}</h3>
                    <div className="flex items-center mt-1 gap-2">
                      <Badge variant="outline" className="text-xs bg-gray-50">
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
                  {template.items.length} items · Total: $
                  {template.items.reduce((sum, item) => sum + (item.quantity * item.rate), 0).toLocaleString()}
                </div>
              </div>
            ))
          )}
        </div>
        
        <Button variant="outline" className="w-full" onClick={() => setSearchQuery("")}>
          Show All Templates
        </Button>
      </CardContent>
    </Card>
  );
}
