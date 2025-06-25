import React, { useState } from "react";
import { AppLayout } from "@/components/ui/AppLayout";
import { Link } from "react-router-dom";
import { ArrowLeft, FileCheck, Search, Mic, Download, ExternalLink } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { QBCCVoiceSearch } from "@/components/QBCCVoiceSearch";
import { useFeatureAccess } from "@/hooks/use-feature-access";

// QBCC form categories with examples
const qbccCategories = {
  "Licensing": [
    { code: "QBCC-L001", title: "Contractor Licence Application", description: "Application for new contractor licence including all classes", formNumber: "Form 1", required: true },
    { code: "QBCC-L002", title: "Licence Renewal", description: "Annual licence renewal form for existing contractors", formNumber: "Form 2", required: true },
    { code: "QBCC-L003", title: "Nominee Supervisor Application", description: "Application to become a nominee supervisor for a licensed company", formNumber: "Form 8", required: false },
    { code: "QBCC-L004", title: "Site Supervisor Licence", description: "Application for site supervisor licence", formNumber: "Form 10", required: true },
  ],
  "Contracts": [
    { code: "QBCC-C001", title: "Domestic Building Contract", description: "Standard contract for residential building work over $3,300", formNumber: "Level 1", required: true },
    { code: "QBCC-C002", title: "Commercial Building Contract", description: "Contract template for commercial construction projects", formNumber: "Commercial", required: true },
    { code: "QBCC-C003", title: "Cost Plus Contract", description: "Contract for projects where final cost is not fixed", formNumber: "Cost Plus", required: false },
    { code: "QBCC-C004", title: "Minor Works Contract", description: "Simplified contract for work under $3,300", formNumber: "Minor Works", required: false },
  ],
  "Insurance": [
    { code: "QBCC-I001", title: "Home Warranty Insurance", description: "Notification of home warranty insurance policy", formNumber: "Form 3", required: true },
    { code: "QBCC-I002", title: "Insurance Claim Form", description: "Claim form for home warranty insurance", formNumber: "Form 3A", required: false },
    { code: "QBCC-I003", title: "Professional Indemnity Declaration", description: "Declaration of professional indemnity insurance coverage", formNumber: "Form PI", required: true },
  ],
  "Compliance": [
    { code: "QBCC-CM001", title: "Completion Notice", description: "Notice of practical completion for building work", formNumber: "Form 12", required: true },
    { code: "QBCC-CM002", title: "Defect Notice Response", description: "Response to defect notice issued by homeowner", formNumber: "Form 13", required: false },
    { code: "QBCC-CM003", title: "Variation Request", description: "Request for variation to approved building work", formNumber: "Form 7", required: false },
    { code: "QBCC-CM004", title: "Extension of Time", description: "Application for extension of time for completion", formNumber: "Form EOT", required: false },
  ],
  "Financial": [
    { code: "QBCC-F001", title: "Financial Declaration", description: "Annual financial declaration for licence holders", formNumber: "Form MFR", required: true },
    { code: "QBCC-F002", title: "Deed of Covenant", description: "Financial guarantee for high-risk categories", formNumber: "Form DC", required: false },
    { code: "QBCC-F003", title: "Net Tangible Assets Report", description: "Report demonstrating minimum financial requirements", formNumber: "Form NTA", required: true },
  ],
  "Dispute Resolution": [
    { code: "QBCC-D001", title: "Dispute Notification", description: "Notification of building dispute to QBCC", formNumber: "Form 15", required: false },
    { code: "QBCC-D002", title: "Early Dispute Resolution Request", description: "Request for QBCC early dispute resolution service", formNumber: "Form EDR", required: false },
    { code: "QBCC-D003", title: "Payment Dispute Form", description: "Form for payment disputes under BCIPA", formNumber: "Form 16", required: false },
  ]
};

const QBCCFormsCalculator = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("Licensing");
  const [showVoiceSearch, setShowVoiceSearch] = useState(false);
  const { toast } = useToast();
  const { qbccVoiceSearch } = useFeatureAccess();

  const filteredForms = searchTerm 
    ? Object.entries(qbccCategories).flatMap(([category, forms]) => 
        forms.filter(form => 
          form.code.toLowerCase().includes(searchTerm.toLowerCase()) || 
          form.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          form.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          form.formNumber.toLowerCase().includes(searchTerm.toLowerCase())
        ).map(form => ({ ...form, category }))
      )
    : [];

  const downloadForm = (formCode: string) => {
    toast({
      title: "Download Started",
      description: `Downloading ${formCode} form...`,
    });
    // In a real app, this would trigger actual form download
  };

  return (
    <AppLayout>
      <div className="container mx-auto p-4 md:p-6">
        <div className="flex items-center gap-2 mb-6">
          <Link to="/calculators" className="hover:text-blue-500">
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <FileCheck className="h-8 w-8 text-blue-500" />
          <h1 className="text-3xl font-bold">QBCC Forms Reference</h1>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Queensland Building and Construction Commission Forms</CardTitle>
            <CardDescription>
              Quick reference for QBCC forms, applications, and compliance documents
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search QBCC forms, codes, or descriptions"
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              {qbccVoiceSearch && (
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
                <QBCCVoiceSearch />
              </div>
            )}

            {searchTerm ? (
              <div>
                <h2 className="text-xl font-semibold mb-4">Search Results</h2>
                {filteredForms.length > 0 ? (
                  <div className="space-y-4">
                    {filteredForms.map((form, index) => (
                      <Card key={index}>
                        <CardHeader className="bg-blue-50 p-4">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <CardTitle className="text-lg">
                                {form.code} - {form.title}
                              </CardTitle>
                              {form.required && (
                                <Badge variant="destructive" className="text-xs">Required</Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-500">Form {form.formNumber}</span>
                              <span className="text-sm text-gray-400">|</span>
                              <span className="text-sm text-gray-500">{form.category}</span>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => downloadForm(form.code)}
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="p-4">
                          <p>{form.description}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center p-6 bg-gray-50 rounded-lg">
                    <p className="text-gray-500">No forms found matching your search.</p>
                  </div>
                )}
              </div>
            ) : (
              <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 mb-6">
                  {Object.keys(qbccCategories).map((category) => (
                    <TabsTrigger key={category} value={category} className="text-xs md:text-sm">
                      {category}
                    </TabsTrigger>
                  ))}
                </TabsList>
                
                {Object.entries(qbccCategories).map(([category, forms]) => (
                  <TabsContent key={category} value={category} className="space-y-4">
                    <h2 className="text-xl font-semibold mb-4">{category} Forms</h2>
                    {forms.map((form, index) => (
                      <Card key={index}>
                        <CardHeader className="bg-blue-50 p-4">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <CardTitle className="text-lg">{form.code} - {form.title}</CardTitle>
                              {form.required && (
                                <Badge variant="destructive" className="text-xs">Required</Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-500">Form {form.formNumber}</span>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => downloadForm(form.code)}
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="p-4">
                          <p>{form.description}</p>
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
            This is a reference guide. Always check the official QBCC website for the most current forms and requirements.
          </p>
          <Button 
            variant="outline" 
            className="mt-4" 
            onClick={() => window.open("https://www.qbcc.qld.gov.au/", "_blank")}
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Visit QBCC Official Website
          </Button>
        </div>
      </div>
    </AppLayout>
  );
};

export default QBCCFormsCalculator; 