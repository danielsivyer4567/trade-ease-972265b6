import React, { useState } from "react";
import { AppLayout } from "@/components/ui/AppLayout";
import { Link } from "react-router-dom";
import { ArrowLeft, FileText, Search, Mic, Volume2, Copy } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { TimberQueenslandVoiceSearch } from "@/components/TimberQueenslandVoiceSearch";
import { useFeatureAccess } from "@/hooks/use-feature-access";

// TDS categories with example data
const tdsCategories = {
  "Hardwood": [
    { code: "TQ-H001", title: "F17 Hardwood", description: "Structural grade hardwood suitable for heavy-duty applications. Density: 900-1100 kg/m³", specifications: "Moisture content: 12-15%, Modulus of Elasticity: 16,000 MPa" },
    { code: "TQ-H002", title: "F27 Hardwood", description: "High-strength structural hardwood for critical load-bearing applications. Density: 1000-1200 kg/m³", specifications: "Moisture content: 10-12%, Modulus of Elasticity: 18,000 MPa" },
    { code: "TQ-H003", title: "Spotted Gum", description: "Durable hardwood species with excellent strength properties. Class 1 durability rating.", specifications: "Janka hardness: 11.0 kN, Natural durability: Class 1" },
  ],
  "Softwood": [
    { code: "TQ-S001", title: "F5 Treated Pine", description: "H3 treated pine suitable for above-ground external applications. Density: 550-650 kg/m³", specifications: "Treatment: H3 LOSP, Moisture content: 15-18%" },
    { code: "TQ-S002", title: "F7 Structural Pine", description: "Standard structural grade pine for general framing applications. Density: 600-700 kg/m³", specifications: "Moisture content: 12-15%, Modulus of Elasticity: 8,000 MPa" },
    { code: "TQ-S003", title: "MGP10 Pine", description: "Machine Graded Pine with consistent structural properties. Suitable for wall framing.", specifications: "Modulus of Elasticity: 10,000 MPa, Moisture content: ≤15%" },
  ],
  "Engineered": [
    { code: "TQ-E001", title: "LVL (Laminated Veneer Lumber)", description: "High-strength engineered timber for beams and lintels. Available in various sizes.", specifications: "F11-F17 grades available, E-values: 10,500-13,200 MPa" },
    { code: "TQ-E002", title: "Glulam Beams", description: "Glue-laminated timber beams for long spans and architectural applications.", specifications: "GL10-GL18 grades, Spans up to 30m possible" },
    { code: "TQ-E003", title: "I-Joists", description: "Lightweight engineered joists for floor and roof applications. Superior span capabilities.", specifications: "Depths: 200-400mm, Flange material: LVL or solid timber" },
  ],
  "Plywood & Panels": [
    { code: "TQ-P001", title: "F14 Structural Plywood", description: "Structural grade plywood for bracing and flooring applications. A-bond glue line.", specifications: "Thickness: 7-25mm, Stress grade: F14, Bond: A-bond" },
    { code: "TQ-P002", title: "Marine Plywood", description: "High-quality plywood with superior moisture resistance for marine applications.", specifications: "BS1088 certified, A-bond phenolic glue, Face veneer: A-grade" },
    { code: "TQ-P003", title: "Formply", description: "High-density film-faced plywood for concrete formwork applications.", specifications: "Surface: Phenolic film, Reuse: 20-50 times, Edge sealed" },
  ],
  "Treatment & Durability": [
    { code: "TQ-T001", title: "H3 LOSP Treatment", description: "Light Organic Solvent Preservative treatment for above-ground external use.", specifications: "Hazard level: H3, Method: LOSP, Retention: 0.20% m/m" },
    { code: "TQ-T002", title: "H4 CCA Treatment", description: "Copper Chrome Arsenate treatment for in-ground contact applications.", specifications: "Hazard level: H4, Retention: 0.80% m/m, Penetration: 15mm" },
    { code: "TQ-T003", title: "Durability Classifications", description: "Natural durability ratings for Australian timber species.", specifications: "Class 1: >25 years, Class 2: 15-25 years, Class 3: 5-15 years" },
  ]
};

const TDSCalculator = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("Hardwood");
  const [showVoiceSearch, setShowVoiceSearch] = useState(false);
  const { toast } = useToast();
  const { timberQueenslandVoiceSearch } = useFeatureAccess();

  const filteredData = searchTerm 
    ? Object.entries(tdsCategories).flatMap(([category, items]) => 
        items.filter(item => 
          item.code.toLowerCase().includes(searchTerm.toLowerCase()) || 
          item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.specifications.toLowerCase().includes(searchTerm.toLowerCase())
        ).map(item => ({ ...item, category }))
      )
    : [];

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to Clipboard",
      description: "TDS code has been copied to your clipboard.",
    });
  };

  const speakData = (item: any) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(
        `${item.code}. ${item.title}. ${item.description}. Specifications: ${item.specifications}`
      );
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <AppLayout>
      <div className="container mx-auto p-4 md:p-6">
        <div className="flex items-center gap-2 mb-6">
          <Link to="/calculators" className="hover:text-blue-500">
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <FileText className="h-8 w-8 text-green-500" />
          <h1 className="text-3xl font-bold">TDS Reference</h1>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Timber Queensland Data Sheets</CardTitle>
            <CardDescription>
              Quick reference for timber specifications, grades, and technical data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search TDS codes, timber types, or specifications"
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              {timberQueenslandVoiceSearch && (
                <Button
                  variant="outline"
                  onClick={() => setShowVoiceSearch(!showVoiceSearch)}
                  className="flex items-center gap-2"
                >
                  <Mic className="h-4 w-4" />
                  Voice Search
                </Button>
              )}
            </div>

            {showVoiceSearch && (
              <div className="mb-6 p-4 border rounded-lg bg-gray-50">
                <TimberQueenslandVoiceSearch />
              </div>
            )}

            {searchTerm ? (
              <div>
                <h2 className="text-xl font-semibold mb-4">Search Results</h2>
                {filteredData.length > 0 ? (
                  <div className="space-y-4">
                    {filteredData.map((item, index) => (
                      <Card key={index}>
                        <CardHeader className="bg-green-50 p-4">
                          <div className="flex justify-between items-center">
                            <CardTitle className="text-lg">
                              {item.code} - {item.title}
                            </CardTitle>
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-500">{item.category}</span>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => copyToClipboard(item.code)}
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => speakData(item)}
                              >
                                <Volume2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="p-4">
                          <p className="mb-2">{item.description}</p>
                          <p className="text-sm text-gray-600">
                            <strong>Specifications:</strong> {item.specifications}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center p-6 bg-gray-50 rounded-lg">
                    <p className="text-gray-500">No TDS data found matching your search.</p>
                  </div>
                )}
              </div>
            ) : (
              <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-2 md:grid-cols-5 mb-6">
                  {Object.keys(tdsCategories).map((category) => (
                    <TabsTrigger key={category} value={category} className="text-sm">
                      {category}
                    </TabsTrigger>
                  ))}
                </TabsList>
                
                {Object.entries(tdsCategories).map(([category, items]) => (
                  <TabsContent key={category} value={category} className="space-y-4">
                    <h2 className="text-xl font-semibold mb-4">{category}</h2>
                    {items.map((item, index) => (
                      <Card key={index}>
                        <CardHeader className="bg-green-50 p-4">
                          <div className="flex justify-between items-center">
                            <CardTitle className="text-lg">{item.code} - {item.title}</CardTitle>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => copyToClipboard(item.code)}
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => speakData(item)}
                              >
                                <Volume2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="p-4">
                          <p className="mb-2">{item.description}</p>
                          <p className="text-sm text-gray-600">
                            <strong>Specifications:</strong> {item.specifications}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </TabsContent>
                ))}
              </Tabs>
            )}
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            This is a reference guide. For complete technical data and current specifications, please refer to official Timber Queensland documentation.
          </p>
          <Button variant="outline" className="mt-4" onClick={() => window.open("https://www.timberqueensland.com.au/", "_blank")}>
            Visit Timber Queensland
          </Button>
        </div>
      </div>
    </AppLayout>
  );
};

export default TDSCalculator; 