import React from 'react';
import { Card } from "@/components/ui/card";

interface AuthContainerProps {
  children: React.ReactNode;
}

export const AuthContainer: React.FC<AuthContainerProps> = ({ children }) => {
  // Create an SVG pattern data URL for the background
  const svgPatternUrl = `data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25' viewBox='0 0 1000 1000'%3E%3Cdefs%3E%3Cpattern id='pattern' patternUnits='userSpaceOnUse' width='100' height='100'%3E%3Cpath fill='none' stroke='%23cccccc' stroke-width='1' d='M25,100 L0,25 L50,-25 L75,50 L100,75 L50,125 Z'%3E%3C/path%3E%3Cpath fill='none' stroke='%23dddddd' stroke-width='1' d='M50,75 L125,0 L100,100 L75,150 L0,100 Z'%3E%3C/path%3E%3C/pattern%3E%3C/defs%3E%3Crect fill='%23f0f0f0' width='100%25' height='100%25'%3E%3C/rect%3E%3Crect fill='url(%23pattern)' width='100%25' height='100%25' opacity='0.3'%3E%3C/rect%3E%3C/svg%3E`;

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4 relative">
      {/* Black and white faded background image */}
      <div 
        className="absolute inset-0 z-0 opacity-50 grayscale"
        style={{
          backgroundImage: `url("${svgPatternUrl}")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          margin: '0',
          padding: '0'
        }}
      />
      
      <div className="w-full max-w-md relative z-10">
        <div className="mb-8 text-center">
          <div className="flex justify-center mb-4">
            <img src="/lovable-uploads/6a07dd00-f2c7-49da-8b00-48d960c13610.png" alt="Trade Ease Logo" className="w-16 h-16" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Trade Ease</h1>
          <p className="text-gray-600">Simplifying your business operations</p>
        </div>
        {children}
      </div>
    </div>
  );
};
