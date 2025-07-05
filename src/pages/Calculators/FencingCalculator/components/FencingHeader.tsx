import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const TimberPicketIcon = () => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="text-yellow-600"
  >
    {/* Horizontal rails */}
    <line x1="2" y1="14" x2="30" y2="14" stroke="currentColor" strokeWidth="1.5"/>
    <line x1="2" y1="22" x2="30" y2="22" stroke="currentColor" strokeWidth="1.5"/>
    
    {/* Colonial pine pickets with rounded tops */}
    <rect x="4" y="10" width="2.5" height="16" fill="currentColor" rx="0.5"/>
    <circle cx="5.25" cy="10" r="1.25" fill="currentColor"/>
    
    <rect x="8.5" y="8" width="2.5" height="18" fill="currentColor" rx="0.5"/>
    <circle cx="9.75" cy="8" r="1.25" fill="currentColor"/>
    
    <rect x="13" y="10" width="2.5" height="16" fill="currentColor" rx="0.5"/>
    <circle cx="14.25" cy="10" r="1.25" fill="currentColor"/>
    
    <rect x="17.5" y="8" width="2.5" height="18" fill="currentColor" rx="0.5"/>
    <circle cx="18.75" cy="8" r="1.25" fill="currentColor"/>
    
    <rect x="22" y="10" width="2.5" height="16" fill="currentColor" rx="0.5"/>
    <circle cx="23.25" cy="10" r="1.25" fill="currentColor"/>
    
    <rect x="26.5" y="8" width="2.5" height="18" fill="currentColor" rx="0.5"/>
    <circle cx="27.75" cy="8" r="1.25" fill="currentColor"/>
    
    {/* Wood grain effect lines */}
    <line x1="5" y1="12" x2="5" y2="24" stroke="currentColor" strokeWidth="0.3" opacity="0.4"/>
    <line x1="9.5" y1="10" x2="9.5" y2="24" stroke="currentColor" strokeWidth="0.3" opacity="0.4"/>
    <line x1="14" y1="12" x2="14" y2="24" stroke="currentColor" strokeWidth="0.3" opacity="0.4"/>
    <line x1="18.5" y1="10" x2="18.5" y2="24" stroke="currentColor" strokeWidth="0.3" opacity="0.4"/>
    <line x1="23" y1="12" x2="23" y2="24" stroke="currentColor" strokeWidth="0.3" opacity="0.4"/>
    <line x1="27.5" y1="10" x2="27.5" y2="24" stroke="currentColor" strokeWidth="0.3" opacity="0.4"/>
  </svg>
);

export const FencingHeader = () => {
  return (
    <div className="flex items-center gap-2 mb-6">
      <Link to="/calculators" className="hover:text-blue-500">
        <ArrowLeft className="h-6 w-6" />
      </Link>
      <TimberPicketIcon />
      <h1 className="text-3xl font-bold">|‖|‖|‖|‖|</h1>
    </div>
  );
};
