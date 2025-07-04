import React from 'react';
import { AppLayout } from "@/components/ui/AppLayout";
import { MicrophoneTest } from '@/components/gemini-live/MicrophoneTest';

const MicrophoneTestPage = () => {
  return (
    <AppLayout>
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-3">Audio System Test</h1>
          <p className="text-lg text-muted-foreground">
            Verify your Arctis Nova Pro Wireless microphone and headphones are working properly with Gemini
          </p>
        </div>
        
        <MicrophoneTest />
        
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>This test verifies:</p>
          <ul className="mt-2 space-y-1">
            <li>✓ Microphone audio levels</li>
            <li>✓ Speech recognition capability</li>
            <li>✓ Audio output through headphones</li>
            <li>✓ Overall system compatibility with Gemini</li>
          </ul>
        </div>
      </div>
    </AppLayout>
  );
};

export default MicrophoneTestPage; 