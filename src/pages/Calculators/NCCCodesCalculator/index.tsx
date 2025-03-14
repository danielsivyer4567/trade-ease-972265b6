
import React, { useState } from "react";
import { AppLayout } from "@/components/ui/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SearchCode, FileCode, Info } from "lucide-react";

const NCCCodesCalculator = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const codeCategories = [
    { id: "building", name: "Building Codes" },
    { id: "plumbing", name: "Plumbing Codes" },
    { id: "fire", name: "Fire Safety Codes" },
    { id: "accessibility", name: "Accessibility Codes" },
    { id: "energy", name: "Energy Efficiency" }
  ];

  const sampleCodes = [
    { id: "B1.1", category: "building", title: "Structural Provisions", description: "Requirements for structural stability and resistance to actions." },
    { id: "B1.2", category: "building", title: "Determination of Individual Actions", description: "Methods to determine actions on structures." },
    { id: "B1.4", category: "building", title: "Structural Resistance", description: "Requirements for structural resistance to permanent, imposed and other actions." },
    { id: "P2.1", category: "plumbing", title: "Water Services", description: "Requirements for cold water services, heated water services and non-drinking water services." },
    { id: "P2.2", category: "plumbing", title: "Sanitary Plumbing and Drainage", description: "Requirements for sanitary plumbing and drainage systems." },
    { id: "F1.1", category: "fire", title: "Fire Hazard Properties", description: "Requirements for fire hazard properties of materials." },
    { id: "F2.1", category: "fire", title: "Fire Resistance and Stability", description: "Requirements for fire resistance of building elements." },
    { id: "D3.1", category: "accessibility", title: "General Access Requirements", description: "Requirements for general access to buildings." },
    { id: "J1.1", category: "energy", title: "Building Fabric", description: "Requirements for building fabric thermal performance." }
  ];

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }

    const results = sampleCodes.filter(
      code => 
        code.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
        code.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        code.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    setSearchResults(results);
  };

  return (
    <AppLayout>
      <div className="container mx-auto py-6 space-y-6">
        <SectionHeader 
          title="NCC Codes Calculator" 
        />
        
        <p className="text-center text-gray-600 mb-6">
          Search and reference National Construction Code (NCC) clauses for your building projects
        </p>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <SearchCode className="h-5 w-5 text-blue-500" />
              Search NCC Codes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input 
                type="text" 
                placeholder="Search by code, title, or description..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1"
              />
              <Button onClick={handleSearch}>Search</Button>
            </div>

            {searchResults.length > 0 && (
              <div className="mt-4 space-y-3">
                <h3 className="font-medium">Search Results:</h3>
                {searchResults.map(result => (
                  <Card key={result.id} className="p-3 hover:bg-gray-50">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-semibold flex items-center gap-2">
                          <FileCode className="h-4 w-4 text-blue-500" />
                          {result.id}: {result.title}
                        </div>
                        <p className="text-sm text-gray-600">{result.description}</p>
                      </div>
                      <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                        {codeCategories.find(cat => cat.id === result.category)?.name}
                      </span>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Tabs defaultValue="building" className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-4">
            {codeCategories.map(category => (
              <TabsTrigger key={category.id} value={category.id}>
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {codeCategories.map(category => (
            <TabsContent key={category.id} value={category.id} className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>{category.name} Reference</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {sampleCodes
                      .filter(code => code.category === category.id)
                      .map(code => (
                        <Card key={code.id} className="p-3 hover:bg-gray-50">
                          <div className="font-semibold flex items-center gap-2">
                            <FileCode className="h-4 w-4 text-blue-500" />
                            {code.id}: {code.title}
                          </div>
                          <p className="text-sm text-gray-600">{code.description}</p>
                        </Card>
                      ))
                    }
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="pt-6">
                  <div className="flex gap-3">
                    <Info className="h-6 w-6 text-blue-500 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-medium mb-1">About {category.name}</h3>
                      <p className="text-sm text-gray-700">
                        These codes provide guidance for construction professionals to ensure buildings 
                        meet safety, health, amenity and sustainability standards in Australia.
                        Always refer to the official NCC documentation for complete and up-to-date information.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default NCCCodesCalculator;
