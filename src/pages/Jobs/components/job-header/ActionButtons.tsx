
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Coffee, PackageX } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";

interface ActionButtonsProps {
  onSmoko?: () => void;
  onPackUp?: () => void;
}

export const ActionButtons = ({ onSmoko, onPackUp }: ActionButtonsProps) => {
  const [isOnSmoko, setIsOnSmoko] = useState(false);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const handleSmoko = () => {
    setIsOnSmoko(!isOnSmoko);
    toast({
      title: isOnSmoko ? "Break Ended" : "Break Started",
      description: isOnSmoko ? "Back to work!" : "Enjoy your break!"
    });
    
    if (onSmoko) {
      onSmoko();
    }
  };

  const handlePackUp = () => {
    toast({
      title: "Packing Up",
      description: "End of work day recorded. Good job!"
    });
    
    if (onPackUp) {
      onPackUp();
    }
  };

  return (
    <div className="flex items-center gap-2 mt-2 md:mt-0">
      <Button 
        className={`bg-red-500 hover:bg-red-600 text-white font-bold uppercase tracking-wider flex items-center gap-2 h-10 ${
          isMobile ? "px-3 text-xs" : "min-w-[150px] h-12"
        } ${isOnSmoko ? 'animate-pulse' : ''}`}
        onClick={handleSmoko}
        aria-label="Take a break"
      >
        <Coffee className={`${isOnSmoko ? 'animate-bounce' : ''} w-5 h-5`} />
        {!isMobile && "SMOKO"}
      </Button>
      <Button 
        className={`bg-red-700 hover:bg-red-800 text-white font-bold uppercase tracking-wider flex items-center gap-2 h-10 ${
          isMobile ? "px-3 text-xs" : "min-w-[150px] h-12"
        }`}
        onClick={handlePackUp}
        aria-label="End work day"
      >
        <PackageX className="w-5 h-5" />
        {!isMobile && "PACK HER UP"}
      </Button>
    </div>
  );
};
