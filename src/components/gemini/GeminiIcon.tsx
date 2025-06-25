<<<<<<< HEAD
=======

>>>>>>> 36fe2b8b6a4c5197b88aa6f671b0288a98028ae7
import React from 'react';

interface GeminiIconProps {
  className?: string;
  isListening?: boolean;
}

<<<<<<< HEAD
const GeminiIcon: React.FC<GeminiIconProps> = ({ className, isListening }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M12 2.25a.75.75 0 01.75.75v3.026a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75z" />
      <path d="M12 18a.75.75 0 01.75.75v3.026a.75.75 0 11-1.5 0V18.75a.75.75 0 01.75-.75z" />
      <path
        fillRule="evenodd"
        d="M10.21 4.933a.75.75 0 01.913.51l.66 2.583a.75.75 0 001.442 0l.66-2.583a.75.75 0 111.423.363l-.66 2.583a2.25 2.25 0 01-4.326 0l-.66-2.583a.75.75 0 01.51-.913z"
        clipRule="evenodd"
      />
      <path
        fillRule="evenodd"
        d="M4.933 13.79a.75.75 0 01.51-.913l2.583-.66a.75.75 0 000-1.442l-2.583-.66a.75.75 0 01-.363-1.423l2.583.66a2.25 2.25 0 010 4.326l-2.583.66a.75.75 0 01-.913-.51z"
        clipRule="evenodd"
      />
      <path
        fillRule="evenodd"
        d="M13.79 19.067a.75.75 0 01-.913-.51l-.66-2.583a.75.75 0 00-1.442 0l-.66 2.583a.75.75 0 11-1.423-.363l.66-2.583a2.25 2.25 0 014.326 0l.66 2.583a.75.75 0 01-.51.913z"
        clipRule="evenodd"
      />
      <path
        fillRule="evenodd"
        d="M19.067 10.21a.75.75 0 01-.51.913l-2.583.66a.75.75 0 000 1.442l2.583.66a.75.75 0 11.363 1.423l-2.583-.66a2.25 2.25 0 010-4.326l2.583-.66a.75.75 0 01.913.51z"
        clipRule="evenodd"
      />
    </svg>
  );
};

export default GeminiIcon; 
=======
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
>>>>>>> 36fe2b8b6a4c5197b88aa6f671b0288a98028ae7
