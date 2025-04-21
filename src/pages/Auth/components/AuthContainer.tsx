import React from 'react';
import { Card } from "@/components/ui/card";

interface AuthContainerProps {
  children: React.ReactNode;
}

export const AuthContainer: React.FC<AuthContainerProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4 relative">
      {/* Solid background color to match the image */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundColor: '#f0f0f0',
        }}
      />
      
      {/* Non-stretched background image */}
      <div 
        className="absolute inset-0 z-0 opacity-50 grayscale"
        style={{
          backgroundImage: 'url("/images/Screenshot 2025-04-21 125049.png")',
          backgroundSize: 'contain',
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
