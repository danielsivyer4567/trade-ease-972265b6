
import React, { useState } from "react";
import { AppLayout } from "@/components/ui/AppLayout";
import { Link } from "react-router-dom";
import { ArrowLeft, FileCode, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// NCC code sections with examples
const nccSections = {
  "Section A": [
    { code: "A1.1", title: "Interpretation", description: "Provisions for interpreting the NCC, including definitions, references, and acceptability of design solutions." },
    { code: "A1.2", title: "Compliance with the NCC", description: "Requirements for demonstrating compliance with the NCC." },
    { code: "A1.3", title: "Meeting the Performance Requirements", description: "Methods that can be used to comply with the Performance Requirements." },
  ],
  "Section B": [
    { code: "B1.1", title: "Structural Provisions", description: "Performance requirements for structural resistance, construction, and materials." },
    { code: "B1.2", title: "Structural Resistance", description: "Requirements for buildings to withstand actions including permanent, imposed, wind, and earthquake actions." },
    { code: "B1.4", title: "Structural Joints", description: "Requirements for structural joints and connections to maintain structural stability." },
  ],
  "Section C": [
    { code: "C1.1", title: "Fire Resistance", description: "Requirements for structural elements to maintain fire resistance to prevent failure." },
    { code: "C1.2", title: "Fire Compartmentation", description: "Requirements for fire-resistant construction to contain fire spread." },
    { code: "C1.3", title: "Protection of Openings", description: "Requirements for protection of openings in fire-resistant construction." },
  ],
  "Section E": [
    { code: "E1.3", title: "Fire Hydrants", description: "Requirements for the installation of fire hydrants to facilitate firefighting operations." },
    { code: "E1.4", title: "Sprinklers", description: "Requirements for automatic fire sprinkler systems." },
    { code: "E1.5", title: "Fire Hose Reels", description: "Requirements for fire hose reels to provide first attack firefighting capability." },
  ],
  "Section F": [
    { code: "F1.1", title: "Damp and Weatherproofing", description: "Requirements for preventing moisture from external sources and condensation." },
    { code: "F1.4", title: "Roof Drainage", description: "Requirements for installation of roof drainage systems." },
    { code: "F1.7", title: "Waterproofing of Wet Areas", description: "Requirements for waterproofing of wet areas in buildings." },
  ]
};

const NCCCodesCalculator = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("Section A");

  const filteredCodes = searchTerm 
    ? Object.entries(nccSections).flatMap(([section, codes]) => 
        codes.filter(code => 
          code.code.toLowerCase().includes(searchTerm.toLowerCase()) || 
          code.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          code.description.toLowerCase().includes(searchTerm.toLowerCase())
        ).map(code => ({ ...code, section }))
      )
    : [];

  return (
    <AppLayout>
      <div className="container mx-auto p-4 md:p-6">
        <div className="flex items-center gap-2 mb-6">
          <Link to="/calculators" className="hover:text-blue-500">
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <FileCode className="h-8 w-8 text-red-500" />
          <h1 className="text-3xl font-bold">NCC Codes Reference</h1>
        </div>
        
        <div className="bg-slate-300 rounded-lg shadow p-6">
          <div className="relative mb-6">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search for NCC codes, titles, or descriptions"
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {searchTerm ? (
            <div>
              <h2 className="text-xl font-semibold mb-4">Search Results</h2>
              {filteredCodes.length > 0 ? (
                <div className="space-y-4">
                  {filteredCodes.map((item, index) => (
                    <Card key={index}>
                      <CardHeader className="bg-slate-200 p-4">
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-lg">
                            {item.code} - {item.title}
                          </CardTitle>
                          <span className="text-sm text-gray-500">{item.section}</span>
                        </div>
                      </CardHeader>
                      <CardContent className="p-4">
                        <p>{item.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center p-6 bg-gray-50 rounded-lg">
                  <p className="text-gray-500">No codes found matching your search.</p>
                </div>
              )}
            </div>
          ) : (
            <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-2 md:grid-cols-5 mb-6">
                {Object.keys(nccSections).map((section) => (
                  <TabsTrigger key={section} value={section} className="text-sm">
                    {section}
                  </TabsTrigger>
                ))}
              </TabsList>
              
              {Object.entries(nccSections).map(([section, codes]) => (
                <TabsContent key={section} value={section} className="space-y-4">
                  <h2 className="text-xl font-semibold mb-4">{section}</h2>
                  {codes.map((item, index) => (
                    <Card key={index}>
                      <CardHeader className="bg-slate-200 p-4">
                        <CardTitle className="text-lg">{item.code} - {item.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4">
                        <p>{item.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>
              ))}
            </Tabs>
          )}

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              This is a simplified reference. For complete and current NCC codes, please refer to the official National Construction Code documentation.
            </p>
            <Button variant="outline" className="mt-4" onClick={() => window.open("https://ncc.abcb.gov.au/", "_blank")}>
              Visit Official NCC Website
            </Button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default NCCCodesCalculator;
