import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useFeatureAccess } from '@/hooks/use-feature-access';
import { TimberQueenslandSearchService, TimberQueenslandData } from '@/services/TimberQueenslandSearchService';
import { TIMBER_QUEENSLAND_CONFIG, getTimberQueenslandCategoryInfo, openExternalTimberQueensland } from '@/config/timber-queensland-config';
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

export const TimberQueenslandVoiceSearch: React.FC = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [searchResults, setSearchResults] = useState<TimberQueenslandData[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedData, setSelectedData] = useState<TimberQueenslandData | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const { timberQueenslandVoiceSearch, isLoading } = useFeatureAccess();
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
      recognitionRef.current.lang = TIMBER_QUEENSLAND_CONFIG.search.voiceRecognitionLang;

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
      const categoriesList = await TimberQueenslandSearchService.getTimberQueenslandCategories();
      setCategories(categoriesList);
    } catch (error) {
      console.error('Error loading categories:', error);
      toast({
        title: "Error Loading Categories",
        description: "Failed to load Timber Queensland categories. Please try again.",
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
        description: "Speak your Timber Queensland data search query now.",
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
      const response = await TimberQueenslandSearchService.searchTimberQueenslandData(
        query, 
        TIMBER_QUEENSLAND_CONFIG.search.defaultLimit,
        selectedCategory || undefined
      );
      setSearchResults(response.results);
      
      if (response.results.length === 0) {
        toast({
          title: "No Results Found",
          description: "Try a different search term or check the spelling.",
        });
      }
    } catch (error) {
      console.error('Search error:', error);
      toast({
        title: "Search Error",
        description: "Failed to search Timber Queensland data. Please try again.",
        variant: "destructive"
      });
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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to Clipboard",
      description: "Timber Queensland data code has been copied to your clipboard.",
    });
  };

  const speakData = (data: TimberQueenslandData) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(
        `${data.data_code}. ${data.title}. ${data.description || ''}`
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

  const renderProperties = (properties: any) => {
    if (!properties || typeof properties !== 'object') return null;
    
    return (
      <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
        <strong>Properties:</strong>
        <div className="grid grid-cols-2 gap-1 mt-1">
          {Object.entries(properties).map(([key, value]) => (
            <div key={key} className="flex justify-between">
              <span className="font-medium">{key.replace(/_/g, ' ')}:</span>
              <span>{String(value)}</span>
            </div>
          ))}
        </div>
      </div>
    );
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

  // Removed Timber Queensland voice search access check - all users now have access

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Mic className="h-6 w-6 text-blue-500" />
          Timber Queensland Voice Search
        </h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => openExternalTimberQueensland('officialTimberQueensland')}
            className="flex items-center gap-2"
          >
            <Globe className="h-4 w-4" />
            Official Timber Queensland
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => openExternalTimberQueensland('technicalData')}
            className="flex items-center gap-2"
          >
            <FileText className="h-4 w-4" />
            Technical Data
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
                <Label htmlFor="search" className="sr-only">Search Timber Queensland Data</Label>
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
                onClick={() => setSelectedCategory('')}
              >
                All Categories
              </Button>
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search Results */}
      {searchResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Search Results ({searchResults.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {searchResults.map((data) => (
                <div
                  key={data.id}
                  className="border rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => setSelectedData(data)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-mono text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
                          {data.data_code}
                        </span>
                        <span className="text-sm text-gray-500">{data.category}</span>
                        {data.subcategory && (
                          <span className="text-sm text-gray-400">{data.subcategory}</span>
                        )}
                      </div>
                      <h3 className="font-semibold text-lg mb-1">{data.title}</h3>
                      {data.description && (
                        <p className="text-gray-600 mb-2">{data.description}</p>
                      )}
                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                        {data.timber_type && (
                          <span>Type: {data.timber_type}</span>
                        )}
                        {data.grade && (
                          <span>Grade: {data.grade}</span>
                        )}
                        {data.dimensions && (
                          <span>Dimensions: {data.dimensions}</span>
                        )}
                      </div>
                      {data.specifications && (
                        <p className="text-sm text-gray-600 mb-2">{data.specifications}</p>
                      )}
                      {renderProperties(data.properties)}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          copyToClipboard(data.data_code);
                        }}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (isPlaying) {
                            stopSpeaking();
                          } else {
                            speakData(data);
                          }
                        }}
                      >
                        {isPlaying ? (
                          <Pause className="h-4 w-4" />
                        ) : (
                          <Volume2 className="h-4 w-4" />
                        )}
                      </Button>
                      {data.external_url && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(data.external_url!, '_blank', 'noopener,noreferrer');
                          }}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* No Results */}
      {searchResults.length === 0 && transcript && !isSearching && (
        <Card>
          <CardContent className="flex items-center justify-center p-6">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Results Found</h3>
              <p className="text-gray-600">
                Try adjusting your search terms or browse categories to find what you're looking for.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}; 