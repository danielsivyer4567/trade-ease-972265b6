import React, { useState, useEffect } from "react";
import { AppLayout } from "@/components/ui/AppLayout";
import { Link } from "react-router-dom";
import { ArrowLeft, FileCode, Search, Loader2, RefreshCw, AlertCircle, Mic } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { NCCVoiceSearch } from "@/components/NCCVoiceSearch";
import { useFeatureAccess } from "@/hooks/use-feature-access";

interface NCCCode {
  id: string;
  code: string;
  title: string;
  description: string | null;
  category: string;
  subcategory: string | null;
  section: string | null;
  volume: string | null;
  part: string | null;
  clause: string | null;
  notes: string | null;
  keywords: string[] | null;
}

const NCCCodesCalculator = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("All");
  const [nccCodes, setNccCodes] = useState<NCCCode[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showVoiceSearch, setShowVoiceSearch] = useState(false);
  const { toast } = useToast();
  const { nccVoiceSearch } = useFeatureAccess();

  // Fetch NCC codes from Supabase
  const fetchNCCCodes = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error: fetchError } = await supabase
        .from('ncc_codes')
        .select('*')
        .eq('is_active', true)
        .order('code', { ascending: true });

      if (fetchError) {
        throw fetchError;
      }

      if (data) {
        setNccCodes(data);
        
        // Extract unique categories
        const uniqueCategories = [...new Set(data.map(code => code.category))].filter(Boolean);
        setCategories(['All', ...uniqueCategories]);
      }
    } catch (err: any) {
      console.error('Error fetching NCC codes:', err);
      setError(err.message || 'Failed to load NCC codes');
      toast({
        title: "Error Loading NCC Codes",
        description: "Failed to load NCC codes from database. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Search NCC codes using the database function
  const searchNCCCodes = async (query: string) => {
    if (!query.trim()) {
      fetchNCCCodes();
      return;
    }

    setLoading(true);
    try {
      const { data, error: searchError } = await supabase
        .rpc('search_ncc_codes', { search_query: query });

      if (searchError) {
        throw searchError;
      }

      if (data) {
        setNccCodes(data);
      }
    } catch (err: any) {
      console.error('Error searching NCC codes:', err);
      toast({
        title: "Search Error",
        description: "Failed to search NCC codes. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNCCCodes();
  }, []);

  // Filter codes based on search and category
  const filteredCodes = nccCodes.filter(code => {
    const matchesCategory = activeTab === 'All' || code.category === activeTab;
    const matchesSearch = !searchTerm || 
      code.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      code.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (code.description && code.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (code.keywords && code.keywords.some(k => k.toLowerCase().includes(searchTerm.toLowerCase())));
    
    return matchesCategory && matchesSearch;
  });

  // Group codes by section for display
  const groupedCodes = filteredCodes.reduce((acc, code) => {
    const section = code.section || 'Other';
    if (!acc[section]) {
      acc[section] = [];
    }
    acc[section].push(code);
    return acc;
  }, {} as Record<string, NCCCode[]>);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      searchNCCCodes(searchTerm);
    }
  };

  if (loading && nccCodes.length === 0) {
    return (
      <AppLayout>
        <div className="container mx-auto p-4 md:p-6 flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-gray-500">Loading NCC codes...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

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

        {error && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-red-500" />
                <p className="text-red-700">{error}</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={fetchNCCCodes}
                  className="ml-auto"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Retry
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>National Construction Code Reference</CardTitle>
            <CardDescription>
              Search and browse NCC codes, clauses, and requirements
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="flex gap-2 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search for NCC codes, titles, or descriptions"
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  'Search'
                )}
              </Button>
              {nccVoiceSearch && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowVoiceSearch(!showVoiceSearch)}
                >
                  <Mic className="h-4 w-4" />
                </Button>
              )}
            </form>

            {showVoiceSearch && (
              <div className="mb-6 p-4 border rounded-lg bg-gray-50">
                <NCCVoiceSearch />
              </div>
            )}

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 mb-6">
                {categories.map((category) => (
                  <TabsTrigger key={category} value={category} className="text-sm">
                    {category}
                  </TabsTrigger>
                ))}
              </TabsList>
              
              {categories.map((category) => (
                <TabsContent key={category} value={category} className="space-y-6">
                  {category === 'All' ? (
                    // Show all codes grouped by section
                    Object.entries(groupedCodes).map(([section, codes]) => (
                      <div key={section}>
                        <h2 className="text-xl font-semibold mb-4">Section {section}</h2>
                        <div className="space-y-4">
                          {codes.map((item) => (
                            <Card key={item.id}>
                              <CardHeader className="bg-slate-200 p-4">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <CardTitle className="text-lg">{item.code} - {item.title}</CardTitle>
                                    {item.subcategory && (
                                      <Badge variant="secondary" className="mt-1">{item.subcategory}</Badge>
                                    )}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {item.volume && `Vol ${item.volume}`}
                                    {item.part && ` Part ${item.part}`}
                                  </div>
                                </div>
                              </CardHeader>
                              <CardContent className="p-4">
                                {item.description && <p className="mb-2">{item.description}</p>}
                                {item.notes && (
                                  <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
                                    <strong>Notes:</strong> {item.notes}
                                  </div>
                                )}
                                {item.keywords && item.keywords.length > 0 && (
                                  <div className="mt-2 flex flex-wrap gap-1">
                                    {item.keywords.map((keyword, idx) => (
                                      <Badge key={idx} variant="outline" className="text-xs">
                                        {keyword}
                                      </Badge>
                                    ))}
                                  </div>
                                )}
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    ))
                  ) : (
                    // Show filtered codes for specific category
                    <div className="space-y-4">
                      {filteredCodes.length > 0 ? (
                        filteredCodes.map((item) => (
                          <Card key={item.id}>
                            <CardHeader className="bg-slate-200 p-4">
                              <div className="flex justify-between items-start">
                                <div>
                                  <CardTitle className="text-lg">{item.code} - {item.title}</CardTitle>
                                  {item.subcategory && (
                                    <Badge variant="secondary" className="mt-1">{item.subcategory}</Badge>
                                  )}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {item.volume && `Vol ${item.volume}`}
                                  {item.part && ` Part ${item.part}`}
                                </div>
                              </div>
                            </CardHeader>
                            <CardContent className="p-4">
                              {item.description && <p className="mb-2">{item.description}</p>}
                              {item.notes && (
                                <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
                                  <strong>Notes:</strong> {item.notes}
                                </div>
                              )}
                              {item.keywords && item.keywords.length > 0 && (
                                <div className="mt-2 flex flex-wrap gap-1">
                                  {item.keywords.map((keyword, idx) => (
                                    <Badge key={idx} variant="outline" className="text-xs">
                                      {keyword}
                                    </Badge>
                                  ))}
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        ))
                      ) : (
                        <div className="text-center p-6 bg-gray-50 rounded-lg">
                          <p className="text-gray-500">No codes found in this category.</p>
                        </div>
                      )}
                    </div>
                  )}
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500 mb-2">
            {nccCodes.length} NCC codes loaded from database
          </p>
          <p className="text-sm text-gray-500">
            This is a reference database. For complete and current NCC codes, please refer to the official National Construction Code documentation.
          </p>
          <Button variant="outline" className="mt-4" onClick={() => window.open("https://ncc.abcb.gov.au/", "_blank")}>
            Visit Official NCC Website
          </Button>
        </div>
      </div>
    </AppLayout>
  );
};

export default NCCCodesCalculator;
