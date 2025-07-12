import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  CheckCircle, 
  AlertCircle,
  Headphones,
  Activity
} from 'lucide-react';

// Speech Recognition types
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
    testRecognition?: any;
  }
}

interface MicrophoneTestProps {
  onClose?: () => void;
}

export const MicrophoneTest: React.FC<MicrophoneTestProps> = ({ onClose }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [microphoneInfo, setMicrophoneInfo] = useState<MediaDeviceInfo | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const microphoneRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    // Get microphone info
    navigator.mediaDevices.enumerateDevices().then(devices => {
      const audioInputs = devices.filter(device => device.kind === 'audioinput');
      const defaultMic = audioInputs.find(device => device.deviceId === 'default') || audioInputs[0];
      setMicrophoneInfo(defaultMic);
    });

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
      }
    };
  }, []);

  const startAudioLevelMonitoring = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      });

      audioContextRef.current = new AudioContext();
      analyserRef.current = audioContextRef.current.createAnalyser();
      microphoneRef.current = audioContextRef.current.createMediaStreamSource(stream);
      
      microphoneRef.current.connect(analyserRef.current);
      analyserRef.current.fftSize = 256;
      
      const bufferLength = analyserRef.current.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const updateLevel = () => {
        if (!analyserRef.current) return;
        
        analyserRef.current.getByteFrequencyData(dataArray);
        const average = dataArray.reduce((a, b) => a + b) / bufferLength;
        setAudioLevel(Math.min(100, (average / 128) * 100));
        
        animationRef.current = requestAnimationFrame(updateLevel);
      };

      updateLevel();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopAudioLevelMonitoring = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    if (microphoneRef.current) {
      microphoneRef.current.disconnect();
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close();
    }
    setIsRecording(false);
    setAudioLevel(0);
  };

  const startSpeechRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setTranscript('Speech recognition not supported in this browser');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      setTranscript('Listening... Say something!');
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const last = event.results.length - 1;
      const text = event.results[last][0].transcript;
      setTranscript(text);
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('Speech recognition error:', event.error);
      setTranscript(`Error: ${event.error}`);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
    
    // Store recognition instance for stopping
    window.testRecognition = recognition;
  };

  const stopSpeechRecognition = () => {
    if (window.testRecognition) {
      window.testRecognition.stop();
      delete window.testRecognition;
    }
    setIsListening(false);
  };

  const playTestSound = () => {
    const utterance = new SpeechSynthesisUtterance('Testing audio output. Can you hear me clearly through your headphones?');
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    speechSynthesis.speak(utterance);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mic className="h-5 w-5" />
          Microphone & Audio Test
        </CardTitle>
      </CardHeader>
      <ScrollArea className="h-[60vh]">
        <CardContent className="space-y-6 p-6">
          {/* Device Info */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Headphones className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Output:</span>
              <span className="text-muted-foreground">Headphones (3- Arctis Nova Pro Wireless)</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Mic className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Input:</span>
              <span className="text-muted-foreground">
                {microphoneInfo?.label || 'Microphone (3- Arctis Nova Pro Wireless)'}
              </span>
            </div>
          </div>

          {/* Audio Level Monitor */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Audio Level Monitor</h3>
              <Activity className={`h-4 w-4 ${isRecording ? 'text-green-500 animate-pulse' : 'text-muted-foreground'}`} />
            </div>
            <Progress value={audioLevel} className="h-3" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Silent</span>
              <span className={audioLevel > 30 ? 'text-green-500 font-medium' : ''}>
                {audioLevel > 30 ? 'Good signal!' : 'Speak to see levels'}
              </span>
              <span>Loud</span>
            </div>
            <Button
              onClick={isRecording ? stopAudioLevelMonitoring : startAudioLevelMonitoring}
              variant={isRecording ? "destructive" : "default"}
              className="w-full"
            >
              {isRecording ? (
                <>
                  <MicOff className="h-4 w-4 mr-2" />
                  Stop Monitoring
                </>
              ) : (
                <>
                  <Mic className="h-4 w-4 mr-2" />
                  Start Audio Level Test
                </>
              )}
            </Button>
          </div>

          {/* Speech Recognition Test */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium">Speech Recognition Test</h3>
            <div className="min-h-[60px] p-3 bg-muted rounded-lg">
              <p className="text-sm">{transcript || 'Click "Start Speech Test" and say something...'}</p>
            </div>
            <Button
              onClick={isListening ? stopSpeechRecognition : startSpeechRecognition}
              variant={isListening ? "destructive" : "secondary"}
              className="w-full"
            >
              {isListening ? 'Stop Speech Test' : 'Start Speech Test'}
            </Button>
          </div>

          {/* Audio Output Test */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium">Audio Output Test</h3>
            <Button
              onClick={playTestSound}
              variant="outline"
              className="w-full"
            >
              <Volume2 className="h-4 w-4 mr-2" />
              Play Test Sound
            </Button>
          </div>

          {/* Test Results */}
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <p className="font-medium mb-2">Quick Tests:</p>
              <ul className="space-y-1 text-sm">
                <li className="flex items-center gap-2">
                  {audioLevel > 20 ? (
                    <CheckCircle className="h-3 w-3 text-green-500" />
                  ) : (
                    <AlertCircle className="h-3 w-3 text-yellow-500" />
                  )}
                  Audio levels {audioLevel > 20 ? 'detected' : 'not detected yet'}
                </li>
                <li className="flex items-center gap-2">
                  {transcript && transcript !== 'Listening... Say something!' ? (
                    <CheckCircle className="h-3 w-3 text-green-500" />
                  ) : (
                    <AlertCircle className="h-3 w-3 text-yellow-500" />
                  )}
                  Speech recognition {transcript && transcript !== 'Listening... Say something!' ? 'working' : 'not tested'}
                </li>
                <li className="flex items-center gap-2">
                  <AlertCircle className="h-3 w-3 text-yellow-500" />
                  Audio output (test manually)
                </li>
              </ul>
            </AlertDescription>
          </Alert>

          {onClose && (
            <Button onClick={onClose} variant="outline" className="w-full">
              Close Test
            </Button>
          )}
        </CardContent>
      </ScrollArea>
    </Card>
  );
}; 