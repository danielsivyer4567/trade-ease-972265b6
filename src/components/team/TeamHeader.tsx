
import React from 'react';

interface TeamHeaderProps {
  teamName: string;
}

export function TeamHeader({ teamName }: TeamHeaderProps) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <img src="/lovable-uploads/6a07dd00-f2c7-49da-8b00-48d960c13610.png" alt="Trade Ease Logo" className="w-8 h-8" />
      <h2 className="text-xl font-semibold text-zinc-950">{teamName} Calendar</h2>
    </div>
  );
}
