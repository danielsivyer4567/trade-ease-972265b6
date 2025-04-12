
import React from 'react';
import { Mic } from 'lucide-react';

const ListeningBubble: React.FC = () => {
  return (
    <div className="absolute bottom-16 right-0 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg animate-fade-in">
      <div className="flex items-center gap-2">
        <div className="relative">
          <Mic className="h-5 w-5 text-red-500" />
          <span className="absolute -top-1 -right-1 flex h-3 w-3 rounded-full bg-red-500">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          </span>
        </div>
        <p className="text-sm font-medium">Listening...</p>
      </div>
      <div className="flex justify-center mt-2 space-x-1">
        {[...Array(5)].map((_, i) => (
          <div 
            key={i} 
            className="w-1 h-2 bg-primary rounded-full animate-pulse" 
            style={{
              animationDelay: `${i * 0.15}s`,
              height: `${Math.max(4, (i+1) * 3)}px`,
            }}
          />
        ))}
      </div>
      <p className="text-xs mt-2 text-gray-500">Speak now or click to cancel</p>
    </div>
  );
};

export default ListeningBubble;
