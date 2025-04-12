
import React from 'react';
import GeminiVoiceAssistant from './GeminiVoiceAssistant';

interface GeminiListenProps {
  className?: string;
}

const GeminiListen: React.FC<GeminiListenProps> = ({
  className
}) => {
  return <GeminiVoiceAssistant className={className} />;
};

export default GeminiListen;
