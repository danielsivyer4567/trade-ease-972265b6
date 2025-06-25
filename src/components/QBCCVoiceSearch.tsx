import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useFeatureAccess } from '@/hooks/use-feature-access';
import { QBCCSearchService, QBCCForm } from '@/services/QBCCSearchService';
import { QBCC_CONFIG, getQBCCCategoryInfo, openExternalQBCC } from '@/config/qbcc-config';
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

export const QBCCVoiceSearch: React.FC = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [searchResults, setSearchResults] = useState<QBCCForm[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedForm, setSelectedForm] = useState<QBCCForm | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const { qbccVoiceSearch, isLoading } = useFeatureAccess();
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
      recognitionRef.current.lang = QBCC_CONFIG.search.voiceRecognitionLang;

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
      const categoriesList = await QBCCSearchService.getQBCCCategories();
      setCategories(categoriesList);
    } catch (error) {
      console.error('Error loading categories:', error);
      toast({
        title: "Error Loading Categories",
        description: "Failed to load QBCC categories. Please try again.",
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
        description: "Speak your QBCC form search query now.",
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
      const response = await QBCCSearchService.searchQBCCForms(
        query, 
        QBCC_CONFIG.search.defaultLimit,
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
        description: "Failed to search QBCC forms. Please try again.",
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
      description: "QBCC form code has been copied to your clipboard.",
    });
  };

  const speakForm = (form: QBCCForm) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(
        `${form.form_code}. ${form.title}. ${form.description || ''}`
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

  if (!qbccVoiceSearch) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-orange-600">
            <Mic className="h-5 w-5" />
            Feature Not Available
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            QBCC Forms Voice Search is only available for Premium Edge and Skeleton Key subscription tiers.
            Please upgrade your subscription to access this feature.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Mic className="h-6 w-6 text-blue-500" />
          QBCC Forms Voice Search
        </h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => openExternalQBCC('officialQBCC')}
            className="flex items-center gap-2"
          >
            <Globe className="h-4 w-4" />
            Official QBCC
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => openExternalQBCC('formsPortal')}
            className="flex items-center gap-2"
          >
            <FileText className="h-4 w-4" />
            Forms Portal
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
                <Label htmlFor="search" className="sr-only">Search QBCC Forms</Label>
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
              {searchResults.map((form) => (
                <div
                  key={form.id}
                  className="border rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => setSelectedForm(form)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-mono text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          {form.form_code}
                        </span>
                        <span className="text-sm text-gray-500">{form.category}</span>
                        {form.subcategory && (
                          <span className="text-sm text-gray-400">{form.subcategory}</span>
                        )}
                      </div>
                      <h3 className="font-semibold text-lg mb-1">{form.title}</h3>
                      {form.description && (
                        <p className="text-gray-600 mb-2">{form.description}</p>
                      )}
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        {form.form_type && (
                          <span>Type: {form.form_type}</span>
                        )}
                        {form.version && (
                          <span>Version: {form.version}</span>
                        )}
                        {form.status && (
                          <span>Status: {form.status}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          copyToClipboard(form.form_code);
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
                            speakForm(form);
                          }
                        }}
                      >
                        {isPlaying ? (
                          <Pause className="h-4 w-4" />
                        ) : (
                          <Volume2 className="h-4 w-4" />
                        )}
                      </Button>
                      {form.external_url && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(form.external_url!, '_blank', 'noopener,noreferrer');
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