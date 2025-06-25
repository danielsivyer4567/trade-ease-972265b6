import React from 'react';

interface GeminiIconProps {
  className?: string;
  isListening?: boolean;
}

const GeminiIcon: React.FC<GeminiIconProps> = ({ 
  className = "",
  isListening = false
}) => (
  <svg 
    width="24" 
    height="24" 
    viewBox="0 0 192 192" 
    className={`${className} ${isListening ? 'animate-pulse text-white' : ''}`} 
    fill="currentColor"
  >
    <path d="M96 16c-44.12 0-80 35.88-80 80s35.88 80 80 80 80-35.88 80-80-35.88-80-80-80zm-9.43 151.84v-31.89L61.36 96l25.21-39.95v-31.9c31.15 3.33 55.56 29.64 55.56 61.85 0 32.2-24.41 58.51-55.56 61.84zm-20.28-34.09v20.3c-19.81-6.12-34.22-24.77-34.22-46.05 0-21.29 14.41-39.94 34.22-46.06v20.31L42.26 96l24.03 37.75z" />
  </svg>
);

export default GeminiIcon;
