import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useFeatureAccess } from '@/hooks/use-feature-access';
import { NCCSearchService, NCCCode } from '@/services/NCCSearchService';
import { NCC_CONFIG, getCategoryInfo, openExternalNCC } from '@/config/ncc-config';
import { 
  Mic, 
  MicOff, 
  Search, 
  Volume2, 
  Copy, 
  BookOpen,
  AlertCircle,
  Loader2,
  Play,
  Pause,
  Filter,
  ExternalLink,
  FileText,
  Globe
} from 'lucide-react';

export const NCCVoiceSearch: React.FC = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [searchResults, setSearchResults] = useState<NCCCode[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedCode, setSelectedCode] = useState<NCCCode | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const { nccVoiceSearch, isLoading } = useFeatureAccess();
  const { toast } = useToast();
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Load categories on component mount
    loadCategories();
  }, []);

  useEffect(() => {
    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = NCC_CONFIG.search.voiceRecognitionLang;

      recognitionRef.current.onresult = (event: any) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript) {
          setTranscript(finalTranscript);
          handleSearch(finalTranscript);
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        toast({
          title: "Voice Recognition Error",
          description: "There was an error with voice recognition. Please try again.",
          variant: "destructive"
        });
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [toast]);

  const loadCategories = async () => {
    setIsLoadingCategories(true);
    try {
      const categoriesList = await NCCSearchService.getNCCCategories();
      setCategories(categoriesList);
    } catch (error) {
      console.error('Error loading categories:', error);
      toast({
        title: "Error Loading Categories",
        description: "Failed to load NCC categories. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoadingCategories(false);
    }
  };

  const startListening = () => {
    if (!recognitionRef.current) {
      toast({
        title: "Voice Recognition Not Available",
        description: "Voice recognition is not supported in your browser.",
        variant: "destructive"
      });
      return;
    }

    try {
      recognitionRef.current.start();
      setIsListening(true);
      setTranscript('');
      setSearchResults([]);
      toast({
        title: "Listening...",
        description: "Speak your NCC code search query now.",
      });
    } catch (error) {
      console.error('Error starting speech recognition:', error);
      toast({
        title: "Error Starting Voice Recognition",
        description: "Please try again or use text search instead.",
        variant: "destructive"
      });
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  };

  const handleSearch = async (query: string) => {
    if (!query.trim()) return;

    setIsSearching(true);
    
    try {
      const response = await NCCSearchService.searchNCCCodes(
        query, 
        NCC_CONFIG.search.defaultLimit, 
        selectedCategory || undefined
      );
      
      if (response.error) {
        throw new Error(response.error);
      }
      
      setSearchResults(response.results);
      
      if (response.results.length === 0) {
        toast({
          title: "No Results Found",
          description: "Try adjusting your search terms or use different keywords.",
        });
      } else {
        toast({
          title: "Search Complete",
          description: `Found ${response.results.length} NCC code(s) matching your query.`,
        });
      }
    } catch (error) {
      console.error('Error searching NCC codes:', error);
      toast({
        title: "Search Error",
        description: error instanceof Error ? error.message : "There was an error searching NCC codes. Please try again.",
        variant: "destructive"
      });
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleTextSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (transcript.trim()) {
      handleSearch(transcript);
    }
  };

  const handleCategoryFilter = async (category: string) => {
    setSelectedCategory(category);
    if (transcript.trim()) {
      await handleSearch(transcript);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to Clipboard",
      description: "NCC code has been copied to your clipboard.",
    });
  };

  const speakCode = (code: NCCCode) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(
        `${code.code}. ${code.title}. ${code.description || ''}`
      );
      utterance.rate = 0.8;
      utterance.pitch = 1;
      
      utterance.onstart = () => setIsPlaying(true);
      utterance.onend = () => setIsPlaying(false);
      
      window.speechSynthesis.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-6">
          <Loader2 className="h-6 w-6 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  // Removed NCC voice search access check - all users now have access

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Mic className="h-6 w-6 text-blue-500" />
          NCC Code Search via Voice
        </h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => openExternalNCC('officialNCC')}
            className="flex items-center gap-2"
          >
            <Globe className="h-4 w-4" />
            Official NCC
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => openExternalNCC('abcBWebsite')}
            className="flex items-center gap-2"
          >
            <FileText className="h-4 w-4" />
            ABCB Website
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Voice Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-2">
              <Button
                onClick={isListening ? stopListening : startListening}
                variant={isListening ? "destructive" : "default"}
                className="flex items-center gap-2"
                disabled={!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)}
              >
                {isListening ? (
                  <>
                    <MicOff className="h-4 w-4" />
                    Stop Listening
                  </>
                ) : (
                  <>
                    <Mic className="h-4 w-4" />
                    Start Voice Search
                  </>
                )}
              </Button>
              
              {isListening && (
                <div className="flex items-center gap-2 text-sm text-blue-600">
                  <div className="animate-pulse w-2 h-2 bg-blue-600 rounded-full"></div>
                  Listening...
                </div>
              )}
            </div>

            <form onSubmit={handleTextSearch} className="flex gap-2">
              <div className="flex-1">
                <Label htmlFor="search" className="sr-only">Search NCC Codes</Label>
                <Input
                  id="search"
                  value={transcript}
                  onChange={(e) => setTranscript(e.target.value)}
                  placeholder="Or type your search query here..."
                  disabled={isListening}
                />
              </div>
              <Button type="submit" disabled={!transcript.trim() || isSearching}>
                {isSearching ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Search className="h-4 w-4" />
                )}
              </Button>
            </form>

            {transcript && (
              <div className="text-sm text-muted-foreground">
                <strong>Search query:</strong> "{transcript}"
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Category Filter */}
      {categories.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filter by Category
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedCategory === '' ? "default" : "outline"}
                size="sm"
                onClick={() => handleCategoryFilter('')}
              >
                All Categories
              </Button>
              {categories.map((category) => {
                const categoryInfo = getCategoryInfo(category);
                return (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleCategoryFilter(category)}
                    title={categoryInfo?.description}
                  >
                    {category}
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {searchResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Search Results ({searchResults.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {searchResults.map((code) => {
                const categoryInfo = getCategoryInfo(code.category);
                return (
                  <div
                    key={code.id}
                    className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-blue-600">{code.code}</h3>
                        <p className="text-gray-700 mt-1">{code.title}</p>
                        {code.description && (
                          <p className="text-gray-600 mt-2 text-sm">{code.description}</p>
                        )}
                        <div className="flex gap-2 mt-2">
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            {code.category}
                          </span>
                          {code.subcategory && (
                            <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                              {code.subcategory}
                            </span>
                          )}
                          {code.section && (
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                              Section {code.section}
                            </span>
                          )}
                          {categoryInfo && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-auto p-1 text-xs"
                              onClick={() => openExternalNCC('nccVolume1')}
                            >
                              <ExternalLink className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(code.code)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => isPlaying ? stopSpeaking() : speakCode(code)}
                        >
                          {isPlaying ? (
                            <Pause className="h-4 w-4" />
                          ) : (
                            <Volume2 className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                    {code.notes && (
                      <p className="text-sm text-gray-600 mt-2 italic">{code.notes}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {searchResults.length === 0 && transcript && !isSearching && (
        <Card>
          <CardContent className="text-center py-8">
            <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No NCC Codes Found</h3>
            <p className="text-gray-500">
              Try adjusting your search terms or use different keywords.
            </p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            About NCC Codes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-gray-600 space-y-2">
            <p>
              NCC (National Construction Code) codes are standardized codes used in the construction industry 
              for various types of work and installations.
            </p>
            <p>
              Use voice search to quickly find relevant codes by speaking keywords like "construction", "electrical", 
              "plumbing", or specific code numbers.
            </p>
            <p>
              <strong>Tip:</strong> Speak clearly and use specific terms for better search results.
            </p>
            <div className="flex gap-2 mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => openExternalNCC('officialNCC')}
                className="flex items-center gap-2"
              >
                <ExternalLink className="h-4 w-4" />
                Visit Official NCC
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => openExternalNCC('nccUpdates')}
                className="flex items-center gap-2"
              >
                <FileText className="h-4 w-4" />
                NCC Updates
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 