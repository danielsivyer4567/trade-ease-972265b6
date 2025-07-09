import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppLayout } from "@/components/ui/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, User, Phone, Mail, Home, Calendar, FileText, Clock, Briefcase, FileSignature, History, PenLine, Trash2, MessageSquare, Download, CheckCircle, CircleDashed, MoveRight, AlertCircle, ChevronDown, FileCheck, Package, CheckSquare, Zap, Camera, DollarSign, Share2, ListChecks, NotebookText, Files, Users2, Route, BellOff, MessageCircle, PhoneIncoming, Info, Tag, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Separator } from '@/components/ui/separator';
import { CustomerData } from './components/CustomerCard';
import ErrorBoundary from '@/components/error/ErrorBoundary';
import Noodle from './components/Noodle';
import { Timeline } from './components/Timeline';
import './components/pulseLine.css';
import { ElectricNoodle } from './components/ElectricNoodle';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export interface CustomerWithDetails extends CustomerData {
  business_name?: string;
  abn?: string;
  acn?: string;
  state_licence_state?: string;
  state_licence_number?: string;
  national_certifications?: string[];
  certification_details?: Record<string, string>;
  created_at?: string;
  last_contact?: string;
  customer_code?: string;
}

interface Quote {
  id: string;
  title: string;
  date: string;
  amount: number;
  status: 'draft' | 'sent' | 'accepted' | 'declined';
}

interface Job {
  id: string;
  title: string;
  date: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  progress: number;
}

interface NoteItem {
  id: string;
  text: string;
  date: string;
  user: string;
}

interface SignedDocument {
  id: string;
  title: string;
  signed_date: string;
  document_url: string;
}

// Enhanced WorkflowStep with icon information
export interface WorkflowStep {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'current' | 'upcoming';
  date?: string;
  icon: React.ReactNode;
  shortInfo?: string;
  requiresAction?: boolean; // Added for hazard signal
  isActioned?: boolean;    // Added for hazard signal
}

// Define the workflow steps based on customer data (this is an existing comment, placing new const near it)
const rightNavItems = [
  { id: 'customerJourney', label: 'Customer Journey', icon: Clock },
  { id: 'tasks', label: 'Tasks', icon: CheckSquare },
  { id: 'notes', label: 'Notes', icon: PenLine },
  { id: 'calendar', label: 'Calendar', icon: Calendar },
  { id: 'documents', label: 'Documents', icon: FileText },
  { id: 'payments', label: 'Payments', icon: DollarSign },
  { id: 'associations', label: 'Associations', icon: Share2 },
];

// Helper function to toggle accordion sections
const toggleSection = (sectionId: string, setExpandedSectionsFunc: React.Dispatch<React.SetStateAction<Record<string, boolean>>>) => {
  setExpandedSectionsFunc(prev => ({ ...prev, [sectionId]: !prev[sectionId] }));
};

const CustomerPortfolio = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [customer, setCustomer] = useState<CustomerWithDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    contactInfo: true, // Default open for contact info
    businessDetails: true, // Default open for business details
    commandTags: false, // Add commandTags, default closed
    dndSettings: false, // Add DND settings, default closed
  }); // State for accordion sections
  const nodeRefs = useRef<(HTMLDivElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const chatScrollRef = useRef<HTMLDivElement | null>(null);
  const [nodePositions, setNodePositions] = useState<{ x: number; y: number }[]>([]);
  const [rightColumnActiveTab, setRightColumnActiveTab] = useState('customerJourney'); // New state for right column nav
  const [messageInput, setMessageInput] = useState(''); // State for message input
  const [playingRecording, setPlayingRecording] = useState<string | null>(null); // Track which recording is playing
  const [recordingProgress, setRecordingProgress] = useState<{ [key: string]: number }>({});
  const [messages, setMessages] = useState<Array<{
    id: string;
    text: string;
    type: 'incoming' | 'outgoing';
    time: string;
    channel: string;
  }>>([
    // Initial mock messages
    {
      id: '1',
      text: 'Hi Sajad. This is Ana from Affordable Fencing Gold Coast. I need to confirm which colour sleeper you would like for your retaining wall?',
      type: 'outgoing',
      time: '15:52',
      channel: 'SMS'
    },
    {
      id: '2',
      text: 'Hi, could we please get monument? thanks',
      type: 'incoming',
      time: '17:07',
      channel: 'SMS'
    },
    {
      id: '3',
      text: 'You sure can. Thank you',
      type: 'outgoing',
      time: '17:41',
      channel: 'SMS'
    }
  ]);
  
  // State for DND options
  const [dndOptions, setDndOptions] = useState({
    allChannels: false,
    emails: false,
    textMessages: false,
    callsVoicemails: false,
    gbp: false,
    inboundCallsSms: false,
  });

  // State for Command Tags
  const [commandTagInput, setCommandTagInput] = useState('');
  const [commandTagsList, setCommandTagsList] = useState<string[]>(['new enquiry', '01_base_assistant']); // Initial example tags

  const handleDndChange = (option: keyof typeof dndOptions) => {
    setDndOptions(prev => {
      const newState = { ...prev, [option]: !prev[option] };
      if (option === 'allChannels' && newState.allChannels) {
        // If "allChannels" is checked, check all individual channels except inboundCallsSms
        return {
          allChannels: true,
          emails: true,
          textMessages: true,
          callsVoicemails: true,
          gbp: true,
          inboundCallsSms: newState.inboundCallsSms, // Preserve its state
        };
      } else if (option === 'allChannels' && !newState.allChannels) {
        // If "allChannels" is unchecked, uncheck all individual channels
        return {
          allChannels: false,
          emails: false,
          textMessages: false,
          callsVoicemails: false,
          gbp: false,
          inboundCallsSms: newState.inboundCallsSms, // Preserve its state
        };
      } else if (['emails', 'textMessages', 'callsVoicemails', 'gbp'].includes(option) && !newState[option]) {
        // If any individual channel is unchecked, uncheck "allChannels"
        newState.allChannels = false;
      } else if (newState.emails && newState.textMessages && newState.callsVoicemails && newState.gbp) {
        // If all individual channels are checked, check "allChannels"
        newState.allChannels = true;
      }
      return newState;
    });
  };

  const handleAddCommandTag = () => {
    if (commandTagInput.trim() !== '' && !commandTagsList.includes(commandTagInput.trim())) {
      setCommandTagsList([...commandTagsList, commandTagInput.trim()]);
      setCommandTagInput('');
      toast({ title: "Tag Added", description: `Tag "${commandTagInput.trim()}" added.` });
    } else if (commandTagsList.includes(commandTagInput.trim())) {
      toast({ title: "Tag Exists", description: "This tag has already been added.", variant: "destructive" });
    }
    setCommandTagInput(''); // Clear input even if tag exists or is empty
  };

  const handleRemoveCommandTag = (tagToRemove: string) => {
    setCommandTagsList(commandTagsList.filter(tag => tag !== tagToRemove));
    toast({ title: "Tag Removed", description: `Tag "${tagToRemove}" removed.` });
  };

  // Helper function to determine gender from name
  const getGenderFromName = (name?: string): 'male' | 'female' => {
    if (!name) return 'male';
    
    const nameLower = name.toLowerCase();
    const firstName = nameLower.split(' ')[0];
    
    // Common Australian female names
    const femaleNames = [
      'ana', 'anna', 'sarah', 'emma', 'olivia', 'charlotte', 'mia', 'amelia', 
      'isla', 'grace', 'sophia', 'chloe', 'ruby', 'matilda', 'emily', 'lily',
      'lucy', 'ella', 'evie', 'ivy', 'hannah', 'zoe', 'sophie', 'jessica',
      'isabella', 'ava', 'georgia', 'alice', 'holly', 'jasmine', 'madison',
      'claire', 'kate', 'rachel', 'amy', 'rebecca', 'michelle', 'jennifer',
      'sienna', 'harper', 'scarlett', 'willow', 'violet', 'daisy', 'poppy',
      'zara', 'layla', 'audrey', 'victoria', 'penelope', 'stella', 'hazel',
      'aurora', 'savannah', 'aria', 'mila', 'nora', 'rose', 'eva', 'elena',
      'ellie', 'maya', 'abigail', 'sofia', 'avery', 'elizabeth', 'camila',
      'luna', 'megan', 'stephanie', 'lauren', 'nicole', 'natalie', 'samantha',
      'alexandra', 'kayla', 'maria', 'allison', 'amanda', 'diana', 'andrea',
      'laura', 'monica', 'julie', 'julia', 'christina', 'kelly', 'melissa'
    ];
    
    // Check if the first name is in the female names list
    if (femaleNames.some(femaleName => firstName.includes(femaleName))) {
      return 'female';
    }
    
    // Default to male for unknown names
    return 'male';
  };

  // Mock recordings data with speaker info
  const mockRecordings = {
    'outgoing-call': {
      transcript: "G'day, this is Ana from Affordable Fencing Gold Coast. I'm calling to follow up on your fence installation inquiry. We've got some brilliant options for your property, including colorbond and timber fencing. I wanted to check if you had any specific preferences for the style or height of the fence you're looking for. We're currently offering a 10% discount on all installations booked this month. Would you be keen to schedule a free on-site quote? We can pop around as early as tomorrow arvo if that suits you.",
      duration: 45, // seconds
      speaker: 'Ana Richmond',
      gender: 'female'
    },
    'incoming-call': {
      transcript: customer?.name?.toLowerCase().includes('ana') 
        ? "Oh hi there! Thanks for getting back to me. Yeah, I'm definitely interested in getting a quote. I was thinking about a colorbond fence, probably around 1.8 meters high for privacy. The property's a corner block, so we'd need fencing on two sides. Can you give me a rough idea of the pricing? Also, do you handle the council permits? I'm not too sure what the requirements are in our area."
        : "G'day Ana, cheers for calling back mate. Yeah, I'm definitely keen on getting a quote sorted. I reckon a colorbond fence would be the go, probably around 1.8 meters high for a bit of privacy. The property's on a corner, so we'd need fencing on two sides. What's the damage looking like price-wise? And do you blokes handle the council paperwork? Not really across what's needed in this area.",
      duration: 32, // seconds
      speaker: customer?.name || 'Customer',
      gender: getGenderFromName(customer?.name)
    }
  };

  // ElevenLabs voice IDs for Australian accents
  const elevenLabsVoices = {
    female: {
      voiceId: 'EXAVITQu4vr4xnSDxMaL', // Sarah - Australian accent
      name: 'Sarah'
    },
    male: {
      voiceId: 'onwK4e9ZLuTAKqWW03F9', // Daniel - Australian accent
      name: 'Daniel'
    }
  };

  const playRecording = async (recordingId: string) => {
    if (playingRecording === recordingId) {
      // Stop playing
      setPlayingRecording(null);
      setRecordingProgress(prev => ({ ...prev, [recordingId]: 0 }));
      
      // Stop any playing audio
      const audioElement = document.getElementById(`audio-${recordingId}`) as HTMLAudioElement;
      if (audioElement) {
        audioElement.pause();
        audioElement.currentTime = 0;
      }
      
      toast({
        title: "Recording Stopped",
        description: "Playback has been stopped"
      });
    } else {
      // Start playing
      setPlayingRecording(recordingId);
      setRecordingProgress(prev => ({ ...prev, [recordingId]: 0 }));
      
      const recording = mockRecordings[recordingId as keyof typeof mockRecordings];
      if (recording) {
        toast({
          title: "Playing Recording",
          description: "Loading Australian voice..."
        });
        
        try {
          // Get the appropriate voice based on gender
          const voice = elevenLabsVoices[recording.gender as keyof typeof elevenLabsVoices];
          
          // Use ElevenLabs API or free alternatives
          const ELEVEN_LABS_API_KEY = import.meta.env.VITE_ELEVEN_LABS_API_KEY || 'demo_key';
          const USE_FREE_TTS = import.meta.env.VITE_USE_FREE_TTS === 'true' || ELEVEN_LABS_API_KEY === 'demo_key';
          
          if (USE_FREE_TTS) {
            // Try Azure Cognitive Services first (best free Australian voices)
            const azureKey = import.meta.env.VITE_AZURE_TTS_KEY;
            const azureRegion = import.meta.env.VITE_AZURE_TTS_REGION || 'australiaeast';
            
            if (azureKey && azureKey !== 'demo_key') {
              try {
                // Azure has the best Australian neural voices
                const azureVoices = {
                  female: 'en-AU-NatashaNeural', // Very natural Australian female
                  male: 'en-AU-WilliamNeural'    // Very natural Australian male
                };
                
                const selectedVoice = azureVoices[recording.gender as keyof typeof azureVoices];
                
                const ssml = `
                  <speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="en-AU">
                    <voice name="${selectedVoice}">
                      <prosody rate="0.9" pitch="medium">
                        ${recording.transcript.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}
                      </prosody>
                    </voice>
                  </speak>
                `;
                
                const response = await fetch(`https://${azureRegion}.tts.speech.microsoft.com/cognitiveservices/v1`, {
                  method: 'POST',
                  headers: {
                    'Ocp-Apim-Subscription-Key': azureKey,
                    'Content-Type': 'application/ssml+xml',
                    'X-Microsoft-OutputFormat': 'audio-16khz-128kbitrate-mono-mp3'
                  },
                  body: ssml
                });
                
                if (response.ok) {
                  const audioBlob = await response.blob();
                  const audioUrl = URL.createObjectURL(audioBlob);
                  
                  let audioElement = document.getElementById(`audio-${recordingId}`) as HTMLAudioElement;
                  if (!audioElement) {
                    audioElement = document.createElement('audio');
                    audioElement.id = `audio-${recordingId}`;
                    document.body.appendChild(audioElement);
                  }
                  
                  audioElement.src = audioUrl;
                  audioElement.onended = () => {
                    setPlayingRecording(null);
                    setRecordingProgress(prev => ({ ...prev, [recordingId]: 0 }));
                    URL.revokeObjectURL(audioUrl);
                    toast({
                      title: "Recording Finished",
                      description: "Azure TTS playback completed"
                    });
                  };
                  
                  audioElement.play();
                  
                  toast({
                    title: "Playing Recording",
                    description: `Using Azure ${selectedVoice} (Premium Australian accent)`
                  });
                  
                  return; // Success with Azure
                }
              } catch (error) {
                console.log('Azure TTS failed, trying alternatives');
              }
            }
            
            // Try OpenAI TTS (also has good voices)
            const openaiKey = import.meta.env.VITE_OPENAI_API_KEY;
            if (openaiKey && openaiKey !== 'demo_key') {
              try {
                const response = await fetch('https://api.openai.com/v1/audio/speech', {
                  method: 'POST',
                  headers: {
                    'Authorization': `Bearer ${openaiKey}`,
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({
                    model: 'tts-1',
                    input: recording.transcript,
                    voice: recording.gender === 'female' ? 'nova' : 'onyx', // Natural voices
                    speed: 0.9
                  })
                });
                
                if (response.ok) {
                  const audioBlob = await response.blob();
                  const audioUrl = URL.createObjectURL(audioBlob);
                  
                  let audioElement = document.getElementById(`audio-${recordingId}`) as HTMLAudioElement;
                  if (!audioElement) {
                    audioElement = document.createElement('audio');
                    audioElement.id = `audio-${recordingId}`;
                    document.body.appendChild(audioElement);
                  }
                  
                  audioElement.src = audioUrl;
                  audioElement.onended = () => {
                    setPlayingRecording(null);
                    setRecordingProgress(prev => ({ ...prev, [recordingId]: 0 }));
                    URL.revokeObjectURL(audioUrl);
                    toast({
                      title: "Recording Finished",
                      description: "OpenAI TTS playback completed"
                    });
                  };
                  
                  audioElement.play();
                  
                  toast({
                    title: "Playing Recording",
                    description: `Using OpenAI ${recording.gender === 'female' ? 'Nova' : 'Onyx'} voice`
                  });
                  
                  return; // Success with OpenAI
                }
              } catch (error) {
                console.log('OpenAI TTS failed, using browser synthesis');
              }
            }
            
            // Enhanced browser speech synthesis fallback
            if ('speechSynthesis' in window) {
              const utterance = new SpeechSynthesisUtterance(recording.transcript);
              
              const setVoice = () => {
                const voices = window.speechSynthesis.getVoices();
                
                // Enhanced voice selection with better Australian detection
                let bestVoice = null;
                
                // Priority 1: Look for specific Australian voices by name
                const australianNames = recording.gender === 'female' 
                  ? ['karen', 'catherine', 'natasha', 'zoe', 'fiona']
                  : ['lee', 'russell', 'william', 'james', 'alex'];
                
                for (const name of australianNames) {
                  bestVoice = voices.find(v => 
                    v.name.toLowerCase().includes(name) && 
                    (v.lang.includes('en-AU') || v.lang.includes('en-GB'))
                  );
                  if (bestVoice) break;
                }
                
                // Priority 2: Any Australian voice
                if (!bestVoice) {
                  bestVoice = voices.find(v => v.lang.includes('en-AU'));
                }
                
                // Priority 3: British English (closer accent)
                if (!bestVoice) {
                  bestVoice = voices.find(v => 
                    v.lang.includes('en-GB') &&
                    (recording.gender === 'female' 
                      ? !v.name.toLowerCase().includes('male')
                      : v.name.toLowerCase().includes('male') || !v.name.toLowerCase().includes('female'))
                  );
                }
                
                if (bestVoice) {
                  utterance.voice = bestVoice;
                }
                
                                 // Optimize speech parameters for more natural Australian sound
                 utterance.rate = 0.9; // Natural speaking pace
                 utterance.pitch = recording.gender === 'female' ? 1.1 : 0.9; // Slightly higher for female
                 utterance.volume = 1.0;
                 
                 // Add Australian-style pronunciation hints if available
                 if (bestVoice?.lang.includes('en-AU') || bestVoice?.lang.includes('en-GB')) {
                   // These voices typically handle Australian pronunciation better
                   utterance.rate = 0.95; // Slightly faster for Australian style
                 }
                
                utterance.onend = () => {
                  setPlayingRecording(null);
                  setRecordingProgress(prev => ({ ...prev, [recordingId]: 0 }));
                  toast({
                    title: "Recording Finished",
                    description: "Playback completed"
                  });
                };
                
                window.speechSynthesis.cancel();
                window.speechSynthesis.speak(utterance);
                
                toast({
                  title: "Playing Recording",
                  description: `Using ${bestVoice ? bestVoice.name : 'default'} voice (${bestVoice?.lang || 'system default'})`
                });
              };
              
              // Wait for voices to load
              if (window.speechSynthesis.getVoices().length === 0) {
                window.speechSynthesis.onvoiceschanged = setVoice;
              } else {
                setVoice();
              }
            }
          } else {
            // Use ElevenLabs API
            const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voice.voiceId}`, {
              method: 'POST',
              headers: {
                'Accept': 'audio/mpeg',
                'Content-Type': 'application/json',
                'xi-api-key': ELEVEN_LABS_API_KEY
              },
              body: JSON.stringify({
                text: recording.transcript,
                model_id: 'eleven_monolingual_v1',
                voice_settings: {
                  stability: 0.5,
                  similarity_boost: 0.5
                }
              })
            });
            
            if (response.ok) {
              const audioBlob = await response.blob();
              const audioUrl = URL.createObjectURL(audioBlob);
              
              // Create audio element
              let audioElement = document.getElementById(`audio-${recordingId}`) as HTMLAudioElement;
              if (!audioElement) {
                audioElement = document.createElement('audio');
                audioElement.id = `audio-${recordingId}`;
                document.body.appendChild(audioElement);
              }
              
              audioElement.src = audioUrl;
              audioElement.onended = () => {
                setPlayingRecording(null);
                setRecordingProgress(prev => ({ ...prev, [recordingId]: 0 }));
                URL.revokeObjectURL(audioUrl);
                toast({
                  title: "Recording Finished",
                  description: "Playback completed"
                });
              };
              
              audioElement.play();
              
              toast({
                title: "Playing Recording",
                description: `Using ElevenLabs ${voice.name} voice with Australian accent`
              });
            } else {
              throw new Error('ElevenLabs API request failed');
            }
          }
        } catch (error) {
          console.error('Error playing recording:', error);
          setPlayingRecording(null);
          toast({
            title: "Playback Error",
            description: "Failed to load voice. Please try again.",
            variant: "destructive"
          });
        }
      }
    }
  };

  const saveToVault = (recordingId: string) => {
    const recording = mockRecordings[recordingId as keyof typeof mockRecordings];
    if (recording) {
      toast({
        title: "Saved to Vault",
        description: "Recording and transcript have been saved",
        variant: "default"
      });
    }
  };

  const shareRecording = (recordingId: string) => {
    toast({
      title: "Share Recording",
      description: "Share link copied to clipboard"
    });
  };

  // Early check for missing customer ID
  if (!id) {
    return <div className="p-8 text-center text-red-500">No customer ID provided in the URL.</div>;
  }

  // Define the animation style for the electrical effect
  const electricAnimationStyle = `
    @keyframes moveDown {
      0% {
        transform: translateY(-100%);
        opacity: 0.3;
      }
      50% {
        opacity: 1;
      }
      100% {
        transform: translateY(100%);
        opacity: 0.3;
      }
    }
    
    @keyframes slowFlash {
      0% {
        opacity: 0.7;
        box-shadow: 0 0 5px rgba(219, 39, 119, 0.3);
      }
      50% {
        opacity: 1;
        box-shadow: 0 0 15px rgba(219, 39, 119, 0.6);
      }
      100% {
        opacity: 0.7;
        box-shadow: 0 0 5px rgba(219, 39, 119, 0.3);
      }
    }
    
    @keyframes glow {
      0% {
        box-shadow: 0 0 8px rgba(59, 130, 246, 0.4);
      }
      50% {
        box-shadow: 0 0 20px rgba(59, 130, 246, 0.8);
      }
      100% {
        box-shadow: 0 0 8px rgba(59, 130, 246, 0.4);
      }
    }
    
    @keyframes noodlePulse {
      0% {
        opacity: 0.2;
        transform: translateY(-5px) scale(0.8);
      }
      20% {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
      80% {
        opacity: 1;
        transform: translateY(20px) scale(1);
      }
      100% {
        opacity: 0.2;
        transform: translateY(30px) scale(0.8);
      }
    }
    
    @keyframes progressPulse {
      0% {
        transform: translateY(0) scale(0.8);
        opacity: 0.7;
        box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
      }
      50% {
        transform: translateY(40px) scale(1.3);
        opacity: 1;
        box-shadow: 0 0 20px rgba(59, 130, 246, 0.9);
      }
      100% {
        transform: translateY(80px) scale(0.8);
        opacity: 0;
        box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
      }
    }
  `;
  
  // Mock data (would be fetched from API in production)
  const [quotes, setQuotes] = useState<Quote[]>([
    { id: '1', title: 'Bathroom Renovation', date: '2023-10-15', amount: 5200, status: 'accepted' },
    { id: '2', title: 'Kitchen Countertops', date: '2023-11-05', amount: 3800, status: 'sent' },
    { id: '3', title: 'Deck Installation', date: '2023-12-01', amount: 6500, status: 'draft' }
  ]);
  
  const [jobs, setJobs] = useState<Job[]>([
    { id: '1', title: 'Bathroom Renovation', date: '2023-10-20', status: 'in_progress', progress: 65 },
    { id: '2', title: 'Fence Repair', date: '2023-09-15', status: 'completed', progress: 100 }
  ]);
  
  const [notes, setNotes] = useState<NoteItem[]>([
    { id: '1', text: 'Customer prefers communication via email', date: '2023-10-05', user: 'John Doe' },
    { id: '2', text: 'Follow up about kitchen renovation next month', date: '2023-11-10', user: 'Sarah Smith' }
  ]);
  
  const [documents, setDocuments] = useState<SignedDocument[]>([
    { id: '1', title: 'Service Agreement', signed_date: '2023-10-18', document_url: '#' },
    { id: '2', title: 'Bathroom Renovation Quote', signed_date: '2023-10-15', document_url: '#' }
  ]);

  useEffect(() => {
    const fetchCustomerData = async () => {
      if (!id) {
        setError("No customer ID provided");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        const { data: session } = await supabase.auth.getSession();
        if (!session?.session?.user) {
          throw new Error("Authentication required to view customer details");
        }

        const { data, error } = await supabase
          .from('customers')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          throw error;
        }

        if (!data) {
          throw new Error("Customer not found");
        }

        setCustomer({
          id: data.id,
          name: data.name,
          email: data.email || '',
          phone: data.phone || '',
          address: data.address || '',
          city: data.city || '',
          state: data.state || '',
          zipCode: data.zipcode || '',
          status: data.status as 'active' | 'inactive',
          business_name: data.business_name,
          abn: data.abn,
          acn: data.acn,
          state_licence_state: data.state_licence_state,
          state_licence_number: data.state_licence_number,
          national_certifications: data.national_certifications || [],
          certification_details: data.certification_details || {},
          created_at: data.created_at,
          last_contact: data.last_contact,
          customer_code: data.customer_code
        });
        
        // In a real implementation, we would fetch related data here
        // Such as quotes, jobs, notes, documents, etc.
        
      } catch (err: any) {
        console.error("Error fetching customer data:", err);
        setError(err.message || "Failed to load customer details");
        toast({
          title: "Error",
          description: err.message || "Failed to load customer details",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCustomerData();
  }, [id, toast]);

  // Define the workflow steps based on customer data
  const getWorkflowSteps = (): WorkflowStep[] => {
    if (!customer) return [];
    
    let steps: WorkflowStep[] = [
      {
        id: 'inquiry',
        title: 'Customer Inquiry',
        description: 'Initial contact',
        status: 'completed',
        date: customer.created_at ? new Date(customer.created_at).toLocaleDateString() : undefined,
        icon: <User className="h-6 w-6" />,
        shortInfo: 'New Contact'
      },
      {
        id: 'quote',
        title: 'Quote Creation',
        description: 'Preparing estimates',
        status: quotes.length > 0 ? 'completed' : 'upcoming',
        date: quotes.length > 0 ? quotes[0].date : undefined,
        icon: <FileText className="h-6 w-6" />,
        shortInfo: quotes.length > 0 ? `${quotes.length} Quotes` : 'No Quotes'
      },
      {
        id: 'approval',
        title: 'Quote Approval',
        description: 'Customer review',
        status: quotes.some(q => q.status === 'accepted') ? 'completed' : quotes.some(q => q.status === 'sent') ? 'current' : 'upcoming',
        icon: <FileCheck className="h-6 w-6" />,
        shortInfo: quotes.some(q => q.status === 'accepted') ? 'Approved' : 'Pending'
      },
      {
        id: 'job',
        title: 'Job Creation',
        description: 'Schedule work',
        status: jobs.length > 0 ? 'completed' : quotes.some(q => q.status === 'accepted') ? 'current' : 'upcoming',
        date: jobs.length > 0 ? jobs[0].date : undefined,
        icon: <Briefcase className="h-6 w-6" />,
        shortInfo: jobs.length > 0 ? `${jobs.length} Jobs` : 'No Jobs'
      },
      {
        id: 'execution',
        title: 'Job Execution',
        description: 'Work in progress',
        status: jobs.some(j => j.status === 'in_progress') ? 'current' : jobs.some(j => j.status === 'completed') ? 'completed' : 'upcoming',
        icon: <Package className="h-6 w-6" />,
        shortInfo: jobs.some(j => j.status === 'in_progress') ? 'In Progress' : 'Not Started'
      },
      {
        id: 'completion',
        title: 'Job Completion',
        description: 'Customer sign-off',
        status: jobs.some(j => j.status === 'completed') ? 'completed' : 'upcoming',
        icon: <CheckSquare className="h-6 w-6" />,
        shortInfo: jobs.some(j => j.status === 'completed') ? 'Complete' : 'Pending'
      }
    ];

    // Add requiresAction and isActioned flags
    steps = steps.map(step => ({
      ...step,
      requiresAction: step.status === 'current', // Example: current steps require action
      isActioned: step.isActioned || false, // Initialize isActioned if not present
    }));

    return steps;
  };
  
  const [workflowSteps, setWorkflowSteps] = useState<WorkflowStep[]>([]);

  useEffect(() => {
    setWorkflowSteps(getWorkflowSteps());
  }, [customer, quotes, jobs]); // Re-calculate when these change

  // Scroll to bottom when new messages are added
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleWorkflowStepAction = (stepId: string) => {
    setWorkflowSteps(prevSteps =>
      prevSteps.map(step =>
        step.id === stepId ? { ...step, isActioned: true, requiresAction: false } : step
      )
    );
    toast({
      title: "Step Actioned",
      description: `Step "${workflowSteps.find(s => s.id === stepId)?.title}" marked as actioned.`,
    });
  };

  useEffect(() => {
    if (!containerRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    const positions = nodeRefs.current.map(ref => {
      if (!ref) return { x: 0, y: 0 };
      const rect = ref.getBoundingClientRect();
      return {
        x: rect.left + rect.width / 2 - containerRect.left,
        y: rect.top + rect.height - containerRect.top,
      };
    });
    setNodePositions(positions);
  }, [loading, workflowSteps.length]);

  const handleAddNote = () => {
    const newNote = {
      id: `new-${Date.now()}`,
      text: 'New customer note...',
      date: new Date().toISOString().split('T')[0],
      user: 'Current User'
    };
    
    setNotes([newNote, ...notes]);
    
    toast({
      title: "Note Added",
      description: "Your note has been added successfully"
    });
  };

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      const newMessage = {
        id: Date.now().toString(),
        text: messageInput,
        type: 'outgoing' as const,
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
        channel: 'SMS'
      };
      
      setMessages([...messages, newMessage]);
      setMessageInput('');
      
      // Simulate incoming response after 2 seconds
      setTimeout(() => {
        const responses = [
          "Thanks for your message!",
          "I'll get back to you soon.",
          "That sounds great, let's proceed.",
          "Can you provide more details?",
          "I'm interested, please send me a quote.",
          "What are the next steps?",
          "When can we start the project?"
        ];
        
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        const incomingMessage = {
          id: (Date.now() + 1).toString(),
          text: randomResponse,
          type: 'incoming' as const,
          time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
          channel: 'SMS'
        };
        
        setMessages(prev => [...prev, incomingMessage]);
      }, 2000);
      
      toast({
        title: "Message Sent",
        description: "Your message has been sent to the customer"
      });
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="container mx-auto p-6 flex items-center justify-center min-h-[80vh] bg-slate-300 rounded-lg">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </AppLayout>
    );
  }

  if (error || !customer) {
    return (
      <AppLayout>
        <div className="container mx-auto p-6">
          <div className="flex items-center gap-2 mb-6">
            <Button variant="ghost" onClick={() => navigate('/customers')} className="hover:bg-slate-200">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold text-gray-800">Customer Portfolio</h1>
          </div>
          
          <Card className="p-8 text-center bg-slate-300 border-gray-400">
            <h2 className="text-red-600 font-bold text-lg mb-2">Error Loading Customer</h2>
            <p className="mb-4 text-gray-700">{error || "Customer not found"}</p>
            <Button onClick={() => navigate("/customers")} className="bg-blue-500 hover:bg-blue-600">Return to Customers</Button>
          </Card>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      {/* Inject the CSS animation for the electrical effect and scrollbar styles */}
      <style dangerouslySetInnerHTML={{ __html: electricAnimationStyle + scrollbarStyles }} />
      
      <div className="w-full px-3 py-4 h-[calc(100vh-4rem)] overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-full">
          {/* Sidebar */}
          <div className="lg:col-span-3 flex flex-col h-full">
            <Card className="h-[calc(100vh-8rem)] flex flex-col bg-slate-300">
              <CardHeader className="p-4 pb-2 bg-[#E2E8F0] border-b border-gray-400">
                <div className="flex items-center gap-2 mb-2">
                  <Button variant="ghost" size="sm" onClick={() => navigate('/customers')} className="p-1 hover:bg-slate-400/50">
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                  <h1 className="text-xl font-semibold text-gray-800 text-center flex-1 mr-8">Customer Portfolio</h1>
                </div>
                <div className="flex justify-center mb-2">
                  <div className="w-3/4 border-b border-white"></div>
                </div>
                <div className="relative flex flex-col items-center text-center">
                  {/* Avatar/Profile Picture with upload & Street View */}
                  <ProfilePictureUpload
                    customer={customer}
                    customerId={id}
                  />
                  <h2 className="text-md font-semibold text-gray-800 text-center">
                    {customer.name}
                  </h2>
                  <div className="mt-1 text-center">
                    <span className={`inline-block px-2 py-0.5 text-xs rounded-full ${
                      customer.status === 'active' ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {customer.status}
                    </span>
                  </div>
                  {customer.business_name && (
                    <p className="text-xs text-gray-600 mt-1 text-center">{customer.business_name}</p>
                  )}
                  {customer.customer_code && (
                    <span className="absolute bottom-0 left-0 bg-blue-100 px-1.5 py-0.5 rounded-full text-black" style={{fontSize: '6px'}}>
                      {customer.customer_code}
                    </span>
                  )}
                </div>
              </CardHeader>
              
              <Separator className="bg-gray-400" />

              {/* Accordion Sections Start Here */}
              <CardContent className="p-3 flex-grow space-y-1 overflow-y-auto bg-white custom-scrollbar"> {/* Reduced space-y, added scroll */}
                
                {/* Contact Info Accordion Item */}
                <div className="border-b border-gray-400 last:border-b-0">
                  <Button 
                    onClick={() => toggleSection('contactInfo', setExpandedSections)}
                    variant="ghost"
                    className="w-full flex justify-between items-center py-2 text-sm font-medium text-gray-800 hover:bg-slate-400/50 rounded-t-md h-auto"
                  >
                    <span>Contact Info</span>
                    <ChevronDown className={`h-4 w-4 transition-transform ${expandedSections['contactInfo'] ? 'rotate-180' : ''}`} />
                  </Button>
                  {expandedSections['contactInfo'] && (
                    <div className="pt-1 pb-2 space-y-1.5 pl-2 pr-1"> {/* Content padding */}
                      <div className="space-y-1.5">
                        {/* Email, Phone, Address */}
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-blue-600 flex-shrink-0" />
                          <span className="text-sm truncate text-gray-800" title={customer.email}>{customer.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-blue-600 flex-shrink-0" />
                          <span className="text-sm truncate text-gray-800" title={customer.phone}>{customer.phone}</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <Home className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-800">
                            {customer.address}, {customer.city}, {customer.state} {customer.zipCode}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-1.5 pt-2">
                        {/* Send Message, Edit Customer Buttons */}
                        <Button variant="outline" size="sm" className="w-full flex items-center gap-2 justify-start bg-blue-500 hover:bg-blue-600 text-white border-blue-500" onClick={handleSendMessage}>
                          <MessageSquare className="h-4 w-4" />
                          <span>Send Message</span>
                        </Button>
                        <Button variant="outline" size="sm" className="w-full flex items-center gap-2 justify-start hover:bg-slate-400/50 border-gray-400" onClick={() => navigate(`/customers/${id}/edit`)}>
                          <PenLine className="h-4 w-4" />
                          <span>Edit Customer</span>
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Business Details Accordion Item */}
                <div className="border-b border-gray-400 last:border-b-0">
                  <Button 
                    onClick={() => toggleSection('businessDetails', setExpandedSections)}
                    variant="ghost"
                    className="w-full flex justify-between items-center py-2 text-sm font-medium text-gray-800 hover:bg-slate-400/50 h-auto"
                  >
                    <span>Business Details</span>
                    <ChevronDown className={`h-4 w-4 transition-transform ${expandedSections['businessDetails'] ? 'rotate-180' : ''}`} />
                  </Button>
                  {expandedSections['businessDetails'] && (
                    <div className="pt-1 pb-2 space-y-1.5 pl-2 pr-1"> {/* Content padding */}
                      <div>
                        <p className="text-xs font-medium text-gray-800">Business Name</p>
                        <p className="text-xs text-gray-600">{customer.business_name || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-800">ABN</p>
                        <p className="text-xs text-gray-600">{customer.abn || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-800">ACN</p>
                        <p className="text-xs text-gray-600">{customer.acn || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-800">State License</p>
                        <p className="text-xs text-gray-600">
                          {customer.state_licence_state && customer.state_licence_number
                            ? `${customer.state_licence_state}: ${customer.state_licence_number}`
                            : 'N/A'}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* COMMANDEMENTS Section */}
                <div className="pt-2">
                  <h3 className="px-1 pt-3 pb-1 text-xs font-semibold uppercase text-blue-700 tracking-wider">
                    COMMANDEMENTS
                  </h3>
                  {/* Command Tags Accordion Item */}
                  <div className="border-b border-gray-400 last:border-b-0">
                    <Button
                      onClick={() => toggleSection('commandTags', setExpandedSections)}
                      variant="ghost"
                      className="w-full flex justify-between items-center py-2 text-sm font-medium text-gray-800 hover:bg-slate-400/50 rounded-t-md h-auto"
                    >
                      <span className="flex items-center">
                        <Tag className="h-4 w-4 mr-2 text-blue-600 flex-shrink-0" />
                        Command Tags
                      </span>
                      <ChevronDown className={`h-4 w-4 transition-transform ${expandedSections['commandTags'] ? 'rotate-180' : ''}`} />
                    </Button>
                    {expandedSections['commandTags'] && (
                      <div className="pt-2 pb-3 space-y-3 pl-2 pr-1">
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            placeholder="Add Tags"
                            value={commandTagInput}
                            onChange={(e) => setCommandTagInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleAddCommandTag()}
                            className="flex-grow p-1.5 border border-gray-400 rounded-md text-xs focus:ring-blue-500 focus:border-blue-500 bg-white"
                          />
                          <Button size="sm" onClick={handleAddCommandTag} className="text-xs px-2.5 py-1.5 bg-blue-500 hover:bg-blue-600">Add</Button>
                        </div>
                        {commandTagsList.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {commandTagsList.map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs font-normal pl-2 pr-1 py-0.5 bg-blue-100 text-blue-800">
                                {tag}
                                <Button
                                  onClick={() => handleRemoveCommandTag(tag)}
                                  variant="ghost"
                                  size="icon"
                                  className="ml-1.5 p-0.5 h-4 w-4 rounded-full hover:bg-blue-200"
                                  aria-label={`Remove ${tag}`}
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  {/* Placeholder for future Automation and Opportunities sections within COMMANDEMENTS */}
                </div>

                {/* DND Settings Accordion Item */}
                <div className="border-b border-gray-400 last:border-b-0 pt-2"> {/* Added pt-2 for spacing */}
                  <Button
                    onClick={() => toggleSection('dndSettings', setExpandedSections)}
                    variant="ghost"
                    className="w-full flex justify-between items-center py-2 text-sm font-medium text-gray-800 hover:bg-slate-400/50 h-auto"
                  >
                    <span>DND Settings</span>
                    <ChevronDown className={`h-4 w-4 transition-transform ${expandedSections['dndSettings'] ? 'rotate-180' : ''}`} />
                  </Button>
                  {expandedSections['dndSettings'] && (
                    <div className="pt-2 pb-3 space-y-2.5 pl-2 pr-1">
                      {/* DND all channels */}
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="dndAll"
                          checked={dndOptions.allChannels}
                          onChange={() => handleDndChange('allChannels')}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-400 rounded"
                        />
                        <label htmlFor="dndAll" className="text-xs font-medium text-gray-800 flex items-center">
                          <BellOff className="h-4 w-4 mr-1.5 text-blue-600" /> DND all channels
                        </label>
                      </div>

                      <div className="relative my-2">
                        <div className="absolute inset-0 flex items-center" aria-hidden="true">
                          <div className="w-full border-t border-gray-400" />
                        </div>
                        <div className="relative flex justify-center">
                          <span className="bg-white px-2 text-xs text-gray-600">OR</span>
                        </div>
                      </div>

                      {/* Individual DND options */}
                      {[
                        { id: 'emails', label: 'Emails', icon: Mail, optionKey: 'emails' as keyof typeof dndOptions },
                        { id: 'textMessages', label: 'Text Messages', icon: MessageSquare, optionKey: 'textMessages' as keyof typeof dndOptions },
                        { id: 'callsVoicemails', label: 'Calls & Voicemails', icon: PhoneIncoming, optionKey: 'callsVoicemails' as keyof typeof dndOptions },
                        { id: 'gbp', label: 'GBP', icon: Users2, optionKey: 'gbp' as keyof typeof dndOptions }, // Assuming Users2 for GBP, replace if a better icon exists
                      ].map(item => (
                        <div key={item.id} className="flex items-center space-x-2 pl-1">
                          <input
                            type="checkbox"
                            id={item.id}
                            checked={dndOptions[item.optionKey]}
                            onChange={() => handleDndChange(item.optionKey)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-400 rounded"
                            disabled={dndOptions.allChannels && item.optionKey !== 'inboundCallsSms'}
                          />
                          <label htmlFor={item.id} className="text-xs text-gray-700 flex items-center">
                            <item.icon className="h-4 w-4 mr-1.5 text-blue-600" /> {item.label}
                          </label>
                        </div>
                      ))}
                      
                      <Separator className="my-2.5 bg-gray-400" />

                      {/* DND Inbound Calls and SMS */}
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="dndInbound"
                          checked={dndOptions.inboundCallsSms}
                          onChange={() => handleDndChange('inboundCallsSms')}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-400 rounded"
                        />
                        <label htmlFor="dndInbound" className="text-xs font-medium text-gray-800 flex items-center">
                          DND Inbound Calls and SMS
                          <span /* title="This setting affects direct inbound calls and SMS messages only." */ >
                            <Info className="h-3.5 w-3.5 ml-1 text-blue-600 cursor-pointer" />
                          </span>
                        </label>
                      </div>
                    </div>
                  )}
                </div>

                {/* Placeholder Accordion Items */}
                {[
                  'General Info', 'Additional Info', 'Forms', 'Automations', 
                  'Opportunities', 'Client Portal', 'Groups'
                ].map(sectionTitle => (
                  <div key={sectionTitle} className="border-b border-gray-400 last:border-b-0">
                    <button 
                      onClick={() => toggleSection(sectionTitle.toLowerCase().replace(' ', ''), setExpandedSections)}
                      className="w-full flex justify-between items-center py-2 text-sm font-medium text-gray-800 hover:bg-slate-400/50"
                    >
                      <span>{sectionTitle}</span>
                      <ChevronDown className={`h-4 w-4 transition-transform ${expandedSections[sectionTitle.toLowerCase().replace(' ', '')] ? 'rotate-180' : ''}`} />
                    </button>
                    {expandedSections[sectionTitle.toLowerCase().replace(' ', '')] && (
                      <div className="pt-1 pb-2 pl-2 pr-1 text-xs text-gray-600">
                        Inputs and custom fields for {sectionTitle} to be added here.
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
          
          {/* Main Content */}
          <div className="lg:col-span-6">
            <Card className="bg-slate-300 h-[calc(100vh-8rem)]">
              <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full h-full flex flex-col">
                <div className="bg-[#E2E8F0] border-b border-gray-400">
                  <CardHeader className="p-4 pb-2 flex-shrink-0">
                    <TabsList className="grid grid-cols-5 bg-slate-200">
                    <TabsTrigger value="overview" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">Communications</TabsTrigger>
                    <TabsTrigger value="quotes" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">Quotes</TabsTrigger>
                    <TabsTrigger value="jobs" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">Jobs</TabsTrigger>
                    <TabsTrigger value="documents" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">Documents</TabsTrigger>
                    <TabsTrigger value="notes" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">Notes</TabsTrigger>
                  </TabsList>
                  </CardHeader>
                </div>
                
                <CardContent className="p-6 bg-white flex flex-col flex-1 min-h-0">
                  <TabsContent value="overview" className="mt-0 flex flex-col h-full">
                    {/* --- SCROLLABLE CHAT AREA --- */}
                    <div ref={chatScrollRef} className="flex-1 overflow-y-auto space-y-3 pr-2 max-h-[calc(100vh-20rem)] custom-scrollbar">
                      {/* Outgoing Call Card */}
                      <div className="border rounded-lg p-2 bg-white shadow-sm mb-1 border-gray-200">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-blue-600" />
                            <span className="font-medium text-sm text-blue-900">Outgoing Call</span>
                          </div>
                          <span className="font-medium text-sm text-blue-800">15:23 <span className="uppercase">EAST</span></span>
                        </div>
                        <div className="flex items-center gap-4 mb-2">
                          <span className="text-xs text-blue-700">Duration: <span className="font-medium">12:45</span></span>
                          <span className="text-xs text-blue-600">2 days ago</span>
                        </div>
                        <div className="flex gap-1">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className={`text-xs px-2 py-1 h-7 flex items-center gap-1 ${
                              playingRecording === 'outgoing-call' 
                                ? 'bg-red-500 hover:bg-red-600 text-white border-red-500' 
                                : 'bg-blue-500 hover:bg-blue-600 text-white border-blue-500'
                            }`}
                            onClick={() => playRecording('outgoing-call')}
                          >
                            {playingRecording === 'outgoing-call' ? (
                              <>
                                <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                  <rect x="6" y="4" width="4" height="16" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                  <rect x="14" y="4" width="4" height="16" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                Stop
                              </>
                            ) : (
                              <>
                                <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                  <path d="M5 3l14 9-14 9V3z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                Play Recording
                              </>
                            )}
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-xs px-2 py-1 h-7 flex items-center gap-1 border-gray-400 hover:bg-white"
                            onClick={() => saveToVault('outgoing-call')}
                          >
                            <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                              <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2v16z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            Save to Vault
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-xs px-2 py-1 h-7 flex items-center gap-1 border-gray-400 hover:bg-white"
                            onClick={() => shareRecording('outgoing-call')}
                          >
                            <Share2 className="h-3 w-3" />
                            Share
                          </Button>
                        </div>
                        {/* Show transcript when playing */}
                        {playingRecording === 'outgoing-call' && (
                          <div className="mt-2 p-2 bg-blue-50 rounded-lg border border-blue-200">
                            <div className="flex items-start gap-2">
                              <svg className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="currentColor" stroke="none"/>
                              </svg>
                              <div className="flex-1">
                                <p className="text-xs font-medium text-blue-900 mb-1">AI Transcript:</p>
                                <p className="text-xs text-blue-800 italic">{mockRecordings['outgoing-call'].transcript}</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Conversation Thread */}
                      <div className="bg-white rounded-xl p-2 shadow-inner">
                        {/* Date Separator */}
                        <div className="flex justify-center mb-2">
                          <span className="bg-white px-3 py-0.5 rounded-full text-sm font-medium text-blue-800 shadow border border-gray-200">9th May, 2025</span>
                        </div>
                        {/* Dynamic Messages */}
                        {messages.map((message) => (
                          <div key={message.id} className={`flex ${message.type === 'outgoing' ? 'justify-end' : 'justify-start'} mb-1`}>
                            <div className="max-w-xl">
                              <div className="flex items-end gap-1">
                                {message.type === 'incoming' && (
                                  <div className="w-6 h-6 rounded-full bg-white border border-gray-300 flex items-center justify-center text-xs font-bold text-gray-700">
                                    {customer.name ? customer.name.charAt(0) : 'N'}
                                  </div>
                                )}
                                <div className={`flex flex-col ${message.type === 'outgoing' ? 'items-end' : 'items-start'}`}>
                                  <span className="text-xs text-blue-700 mb-0.5">{message.channel}</span>
                                  <div className={`${
                                    message.type === 'outgoing' 
                                      ? 'bg-blue-500 text-white' 
                                      : 'bg-white border border-gray-300 text-gray-900'
                                  } rounded-2xl px-3 py-2 text-sm font-medium shadow-${message.type === 'outgoing' ? 'md' : 'sm'}`}>
                                    {message.text}
                                  </div>
                                  <span className="text-xs text-blue-700 mt-0.5">{message.time} <span className="uppercase">EAST</span></span>
                                </div>
                                {message.type === 'outgoing' && (
                                  <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center text-xs font-bold text-blue-600">AR</div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Incoming Call Card */}
                      <div className="border rounded-lg p-2 bg-white shadow-sm mt-3 border-gray-200">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-blue-600" />
                            <span className="font-medium text-sm text-blue-900">Incoming Call</span>
                          </div>
                          <span className="font-medium text-sm text-blue-800">08:45 <span className="uppercase">EAST</span></span>
                        </div>
                        <div className="flex items-center gap-4 mb-2">
                          <span className="text-xs text-blue-700">Duration: <span className="font-medium">05:12</span></span>
                          <span className="text-xs text-blue-600">1 week ago</span>
                        </div>
                        <div className="flex gap-1">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className={`text-xs px-2 py-1 h-7 flex items-center gap-1 ${
                              playingRecording === 'incoming-call' 
                                ? 'bg-red-500 hover:bg-red-600 text-white border-red-500' 
                                : 'bg-blue-500 hover:bg-blue-600 text-white border-blue-500'
                            }`}
                            onClick={() => playRecording('incoming-call')}
                          >
                            {playingRecording === 'incoming-call' ? (
                              <>
                                <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                  <rect x="6" y="4" width="4" height="16" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                  <rect x="14" y="4" width="4" height="16" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                Stop
                              </>
                            ) : (
                              <>
                                <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                  <path d="M5 3l14 9-14 9V3z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                Play Recording
                              </>
                            )}
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-xs px-2 py-1 h-7 flex items-center gap-1 border-gray-400 hover:bg-white"
                            onClick={() => saveToVault('incoming-call')}
                          >
                            <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                              <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2v16z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            Save to Vault
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-xs px-2 py-1 h-7 flex items-center gap-1 border-gray-400 hover:bg-white"
                            onClick={() => shareRecording('incoming-call')}
                          >
                            <Share2 className="h-3 w-3" />
                            Share
                          </Button>
                        </div>
                        {/* Show transcript when playing */}
                        {playingRecording === 'incoming-call' && (
                          <div className="mt-2 p-2 bg-blue-50 rounded-lg border border-blue-200">
                            <div className="flex items-start gap-2">
                              <svg className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="currentColor" stroke="none"/>
                              </svg>
                              <div className="flex-1">
                                <p className="text-xs font-medium text-blue-900 mb-1">AI Transcript:</p>
                                <p className="text-xs text-blue-800 italic">{mockRecordings['incoming-call'].transcript}</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* --- FIXED MESSAGE INPUT BAR --- */}
                    <div className="mt-4 bg-white rounded-xl shadow p-3 border-t border-gray-200">
                        <div className="flex flex-wrap gap-2 mb-2">
                          <Button variant="ghost" size="sm" className="font-bold text-blue-600 bg-blue-100">SMS</Button>
                          <Button variant="ghost" size="sm" className="hover:bg-white">WhatsApp</Button>
                          <Button variant="ghost" size="sm" className="hover:bg-white">Email</Button>
                          <Button variant="ghost" size="sm" className="hover:bg-white">Facebook</Button>
                          <Button variant="ghost" size="sm" className="hover:bg-white">TikTok</Button>
                          <Button variant="ghost" size="sm" className="hover:bg-white">Instagram</Button>
                          <Button variant="ghost" size="sm" className="hover:bg-white">GBP</Button>
                          <Button variant="ghost" size="sm" className="hover:bg-white">Website</Button>
                          <span className="ml-auto text-xs text-gray-600">Internal Comment</span>
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs text-gray-600">From:</span>
                          <input className="border border-gray-400 rounded px-2 py-1 text-xs w-40 bg-white" value={customer.phone} readOnly />
                          <span className="text-xs text-gray-600">To:</span>
                          <input className="border border-gray-400 rounded px-2 py-1 text-xs w-40 bg-white" value={customer.phone} readOnly />
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                          <input 
                            className="flex-grow border border-gray-400 rounded px-3 py-2 text-base bg-white focus:ring-blue-500 focus:border-blue-500" 
                            placeholder="Type a message"
                            value={messageInput}
                            onChange={(e) => setMessageInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                          />
                          <Button variant="outline" size="icon" className="border-gray-400 hover:bg-white"><svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="10" strokeWidth="2"/><path d="M8 12l2 2 4-4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></Button>
                          <Button variant="outline" size="icon" className="border-gray-400 hover:bg-white"><svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><polyline points="17 8 12 3 7 8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><line x1="12" y1="3" x2="12" y2="15" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></Button>
                          <Button variant="outline" size="icon" className="border-gray-400 hover:bg-white"><svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="10" strokeWidth="2"/><path d="M8 12l2 2 4-4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></Button>
                        </div>
                        <div className="flex flex-wrap gap-2 mb-2">
                          <Badge variant="secondary" className="text-xs font-normal bg-blue-100 text-blue-800">new client form</Badge>
                          <Badge variant="secondary" className="text-xs font-normal bg-blue-100 text-blue-800">basic contract</Badge>
                          <Badge variant="secondary" className="text-xs font-normal bg-blue-100 text-blue-800">defect form</Badge>
                          <Badge variant="secondary" className="text-xs font-normal bg-blue-100 text-blue-800">variation approval</Badge>
                          <Badge variant="secondary" className="text-xs font-normal bg-blue-100 text-blue-800">job preference form</Badge>
                        </div>
                        <div className="flex gap-2 mt-2">
                          <Button variant="outline" size="sm" className="font-semibold border-gray-400 hover:bg-white">Call Customer</Button>
                          <Button variant="outline" size="sm" className="border-gray-400 hover:bg-white" onClick={() => setMessageInput('')}>Clear</Button>
                          <Button variant="default" size="sm" className="font-semibold bg-blue-500 hover:bg-blue-600" onClick={handleSendMessage}>Send</Button>
                        </div>
                      </div>
                  </TabsContent>
                  
                  <TabsContent value="quotes" className="mt-0">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-lg font-medium text-gray-800">Customer Quotes</h2>
                      <Button size="sm" onClick={() => navigate('/quotes/new')} className="bg-blue-500 hover:bg-blue-600">New Quote</Button>
                    </div>
                    
                    {quotes.length > 0 ? (
                      <div className="space-y-4">
                        {quotes.map((quote) => (
                          <Card key={quote.id} className="bg-white border-gray-200">
                            <CardContent className="p-4 flex justify-between items-center">
                              <div>
                                <h3 className="font-medium text-blue-900">{quote.title}</h3>
                                <div className="text-sm text-blue-700">
                                  Created: {quote.date} • ${quote.amount.toLocaleString()}
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge variant={
                                  quote.status === 'accepted' ? 'default' : 
                                  quote.status === 'sent' ? 'secondary' : 
                                  'outline'
                                } className={`
                                  ${quote.status === 'accepted' ? 'bg-blue-500 text-white' : ''}
                                  ${quote.status === 'sent' ? 'bg-blue-100 text-blue-800' : ''}
                                  ${quote.status === 'draft' ? 'border-blue-300 text-blue-700' : ''}
                                `}>
                                  {quote.status}
                                </Badge>
                                <Button variant="outline" size="sm" className="border-blue-300 text-blue-700 hover:bg-blue-100">View</Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 bg-white rounded-lg border border-gray-200">
                        <FileText className="h-10 w-10 text-blue-600 mx-auto mb-2" />
                        <p className="text-gray-700">No quotes found for this customer</p>
                        <Button variant="outline" size="sm" className="mt-4 bg-blue-500 hover:bg-blue-600 text-white border-blue-500" onClick={() => navigate('/quotes/new')}>
                          Create a Quote
                        </Button>
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="jobs" className="mt-0">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-lg font-medium text-gray-800">Customer Jobs</h2>
                      <Button size="sm" onClick={() => navigate('/jobs/new')} className="bg-blue-500 hover:bg-blue-600">New Job</Button>
                    </div>
                    
                    {jobs.length > 0 ? (
                      <div className="space-y-4">
                        {jobs.map((job) => (
                          <Card key={job.id} className="bg-white border-gray-200">
                            <CardContent className="p-4">
                              <div className="flex justify-between items-center mb-2">
                                <h3 className="font-medium text-blue-900">{job.title}</h3>
                                <Badge variant={
                                  job.status === 'completed' ? 'default' : 
                                  job.status === 'in_progress' ? 'secondary' : 
                                  'outline'
                                } className={`
                                  ${job.status === 'completed' ? 'bg-blue-500 text-white' : ''}
                                  ${job.status === 'in_progress' ? 'bg-blue-100 text-blue-800' : ''}
                                  ${job.status === 'scheduled' ? 'border-blue-300 text-blue-700' : ''}
                                `}>
                                  {job.status.replace('_', ' ')}
                                </Badge>
                              </div>
                              <div className="text-sm text-blue-700 mb-2">
                                Start Date: {job.date} • Progress: {job.progress}%
                              </div>
                              <div className="w-full bg-white border border-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-blue-500 rounded-full h-2"
                                  style={{ width: `${job.progress}%` }}
                                ></div>
                              </div>
                              <div className="mt-4 flex justify-end">
                                <Button variant="outline" size="sm" className="border-blue-300 text-blue-700 hover:bg-blue-100">View Details</Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 bg-white rounded-lg border border-gray-200">
                        <Briefcase className="h-10 w-10 text-blue-600 mx-auto mb-2" />
                        <p className="text-gray-700">No jobs found for this customer</p>
                        <Button variant="outline" size="sm" className="mt-4 bg-blue-500 hover:bg-blue-600 text-white border-blue-500" onClick={() => navigate('/jobs/new')}>
                          Create a Job
                        </Button>
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="documents" className="mt-0">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-lg font-medium text-gray-800">Signed Documents</h2>
                      <Button size="sm" className="bg-blue-500 hover:bg-blue-600">Upload Document</Button>
                    </div>
                    
                    {documents.length > 0 ? (
                      <div className="space-y-4">
                        {documents.map((doc) => (
                          <Card key={doc.id} className="bg-white border-gray-200">
                            <CardContent className="p-4 flex justify-between items-center">
                              <div>
                                <h3 className="font-medium text-blue-900">{doc.title}</h3>
                                <div className="text-sm text-blue-700">
                                  Signed: {doc.signed_date}
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Button variant="outline" size="sm" className="border-blue-300 text-blue-700 hover:bg-blue-100">
                                  <FileText className="h-4 w-4 mr-2" />
                                  View
                                </Button>
                                <Button variant="outline" size="sm" className="border-blue-300 text-blue-700 hover:bg-blue-100">
                                  <Download className="h-4 w-4 mr-2" />
                                  Download
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 bg-white rounded-lg border border-gray-200">
                        <FileSignature className="h-10 w-10 text-blue-600 mx-auto mb-2" />
                        <p className="text-gray-700">No signed documents found</p>
                        <Button variant="outline" size="sm" className="mt-4 bg-blue-500 hover:bg-blue-600 text-white border-blue-500">
                          Request Signature
                        </Button>
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="notes" className="mt-0">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-lg font-medium text-gray-800">Customer Notes</h2>
                      <Button size="sm" onClick={handleAddNote} className="bg-blue-500 hover:bg-blue-600">Add Note</Button>
                    </div>
                    
                    {notes.length > 0 ? (
                      <div className="space-y-4">
                        {notes.map((note) => (
                          <Card key={note.id} className="bg-white border-gray-200">
                            <CardContent className="p-4">
                              <div className="flex justify-between items-center mb-2">
                                <div className="flex items-center gap-2">
                                  <Clock className="h-4 w-4 text-blue-600" />
                                  <span className="text-sm text-blue-700">{note.date}</span>
                                </div>
                                <span className="text-sm text-blue-700">{note.user}</span>
                              </div>
                              <p className="text-sm text-gray-800">{note.text}</p>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 bg-white rounded-lg border border-gray-200">
                        <MessageSquare className="h-10 w-10 text-blue-600 mx-auto mb-2" />
                        <p className="text-gray-700">No notes found for this customer</p>
                        <Button variant="outline" size="sm" className="mt-4 bg-blue-500 hover:bg-blue-600 text-white border-blue-500" onClick={handleAddNote}>
                          Add First Note
                        </Button>
                      </div>
                    )}
                  </TabsContent>
                </CardContent>
              </Tabs>
            </Card>
          </div>
          
          {/* === Right Column - Transformed === */}
          <div className="lg:col-span-3 overflow-hidden h-full">
            <Card className="h-[calc(100vh-8rem)] flex flex-col bg-slate-300 overflow-hidden">
              {/* Icon Navigation Bar */}
              <div className="p-4 pb-2 border-b border-gray-400 flex justify-around items-center bg-[#E2E8F0]">
                {rightNavItems.map(item => (
                  <Button
                    key={item.id}
                    variant="ghost"
                    size="icon"
                    className={`h-8 w-8 p-1.5 ${rightColumnActiveTab === item.id ? 'bg-blue-500 text-white' : 'text-blue-600 hover:text-blue-700 hover:bg-blue-100'}`}
                    onClick={() => setRightColumnActiveTab(item.id)}
                    title={item.label}
                  >
                    <item.icon className="h-5 w-5" />
                  </Button>
                ))}
              </div>

              {/* Content Area for Right Column */}
              <CardContent className="flex-grow p-0 overflow-hidden bg-slate-300">
                {rightColumnActiveTab === 'customerJourney' && (
                  <Timeline steps={workflowSteps} onStepAction={handleWorkflowStepAction} />
                )}
                {rightColumnActiveTab === 'tasks' && (
                  <div className="p-4 text-sm text-gray-700">Tasks content will go here.</div>
                )}
                {rightColumnActiveTab === 'notes' && (
                  <div className="p-4 text-sm text-gray-700">Notes content will go here.</div>
                )}
                {rightColumnActiveTab === 'calendar' && (
                  <div className="p-4 text-sm text-gray-700">Calendar content will go here.</div>
                )}
                {rightColumnActiveTab === 'documents' && (
                  <div className="p-4 text-sm text-gray-700">Documents content will go here.</div>
                )}
                {rightColumnActiveTab === 'payments' && (
                  <div className="p-4 text-sm text-gray-700">Payments content will go here.</div>
                )}
                {rightColumnActiveTab === 'associations' && (
                  <div className="p-4 text-sm text-gray-700">Associations content will go here.</div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

function ProfilePictureUpload({ customer, customerId }: { customer: any, customerId: string }) {
  const [streetViewUrl, setStreetViewUrl] = useState<string | null>(null);

  // Helper to clean and format the address
  const formatAddress = () => {
    if (!customer) return '';
    // Remove extra spaces and commas, and avoid duplicate suburb
    let address = `${customer.address || ''}, ${customer.city || ''}, ${customer.state || ''} ${customer.zipCode || ''}`;
    address = address.replace(/\\s+,/g, ',').replace(/,+/g, ',').replace(/\\s{2,}/g, ' ').trim();
    return address;
  };

  // Generate Google Street View image URL
  const getStreetViewUrl = () => {
    const address = encodeURIComponent(formatAddress());
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ""; // Use environment variable
    return `https://maps.googleapis.com/maps/api/streetview?size=200x200&location=${address}&key=${apiKey}`;
  };

  useEffect(() => {
    if (customer && customer.address) {
      const url = getStreetViewUrl();
      setStreetViewUrl(url);
      console.log('Street View URL:', url); // For debugging
    }
  }, [customer]);

  return (
    <div className="relative w-60 h-36 mb-2 flex flex-col items-center mx-auto">
      <div className="w-60 h-36 rounded-lg overflow-hidden border-2 border-gray-300 shadow-sm">
        {streetViewUrl ? (
          <img
            src={streetViewUrl}
            alt="Street View"
            className="w-full h-full object-cover"
            onError={e => (e.currentTarget.src = '/fallback-image.png')}
          />
        ) : (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
            <User className="h-16 w-16 text-primary" />
          </div>
        )}
      </div>
    </div>
  );
}

// Custom scrollbar styles
const scrollbarStyles = `
  /* Custom scrollbar for webkit browsers */
  .custom-scrollbar::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 4px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
  
  /* For Firefox */
  .custom-scrollbar {
    scrollbar-width: thin;
    scrollbar-color: #888 #f1f1f1;
  }
`;

export default function CustomerPortfolioPage() {
  return (
    <ErrorBoundary
      fallback={
        <AppLayout>
          <div className="container mx-auto p-6">
            <div className="flex items-center gap-2 mb-6">
              <Button variant="ghost" onClick={() => window.location.href = '/customers'} className="hover:bg-slate-200">
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-2xl font-bold text-gray-800">Customer Portfolio</h1>
            </div>
            
            <Card className="p-8 text-center bg-slate-300 border-gray-400">
              <h2 className="text-red-600 font-bold text-lg mb-2">Error Loading Customer</h2>
              <p className="mb-4 text-gray-700">There was an error rendering the customer portfolio. Please try again later.</p>
              <Button onClick={() => window.location.href = "/customers"} className="bg-blue-500 hover:bg-blue-600">Return to Customers</Button>
            </Card>
          </div>
        </AppLayout>
      }
    >
      <CustomerPortfolio />
    </ErrorBoundary>
  );
} 