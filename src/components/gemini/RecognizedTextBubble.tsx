
import React from 'react';
import { CheckCircle2 } from 'lucide-react';

interface RecognizedTextBubbleProps {
  text: string;
}

const RecognizedTextBubble: React.FC<RecognizedTextBubbleProps> = ({ text }) => {
  return (
    <div className="absolute bottom-16 right-0 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg min-w-[250px] max-w-[300px] animate-fade-in">
      <div className="flex items-start gap-2">
        <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-sm font-medium mb-1">I heard:</p>
          <p className="text-sm text-gray-600 dark:text-gray-300 break-words">{text}</p>
        </div>
      </div>
    </div>
  );
};

export default RecognizedTextBubble;
