
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Coffee, PackageX } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ActionButtonsProps {
  onSmoko: () => void;
  onPackUp: () => void;
}

export const ActionButtons = () => {
  const [isOnSmoko, setIsOnSmoko] = useState(false);
  const { toast } = useToast();

  const handleSmoko = () => {
    setIsOnSmoko(!isOnSmoko);
    toast({
      title: isOnSmoko ? "Break Ended" : "Break Started",
      description: isOnSmoko ? "Back to work!" : "Enjoy your break!"
    });
  };

  const handlePackUp = () => {
    toast({
      title: "Packing Up",
      description: "End of work day recorded. Good job!"
    });
  };

  return (
    <>
      <Button 
        className={`bg-red-500 hover:bg-red-600 text-white font-bold uppercase tracking-wider flex items-center gap-2 min-w-[150px] h-12 ${isOnSmoko ? 'animate-pulse' : ''}`} 
        onClick={handleSmoko}
      >
        <Coffee className={isOnSmoko ? 'animate-bounce' : ''} />
        SMOKO
      </Button>
      <Button 
        className="bg-red-700 hover:bg-red-800 text-white font-bold uppercase tracking-wider flex items-center gap-2 min-w-[150px] h-12" 
        onClick={handlePackUp}
      >
        <PackageX />
        PACK HER UP
      </Button>
    </>
  );
};
