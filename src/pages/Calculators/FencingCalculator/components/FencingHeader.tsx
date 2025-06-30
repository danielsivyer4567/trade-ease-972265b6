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
    className="text-blue-500"
  >
    {/* Horizontal rails */}
    <line x1="2" y1="12" x2="30" y2="12" stroke="currentColor" strokeWidth="2"/>
    <line x1="2" y1="20" x2="30" y2="20" stroke="currentColor" strokeWidth="2"/>
    
    {/* Picket posts */}
    <rect x="4" y="8" width="2" height="16" fill="currentColor" rx="1"/>
    <rect x="9" y="6" width="2" height="18" fill="currentColor" rx="1"/>
    <rect x="14" y="8" width="2" height="16" fill="currentColor" rx="1"/>
    <rect x="19" y="6" width="2" height="18" fill="currentColor" rx="1"/>
    <rect x="24" y="8" width="2" height="16" fill="currentColor" rx="1"/>
    
    {/* Pointed tops for pickets */}
    <polygon points="5,8 4,6 6,6" fill="currentColor"/>
    <polygon points="10,6 9,4 11,4" fill="currentColor"/>
    <polygon points="15,8 14,6 16,6" fill="currentColor"/>
    <polygon points="20,6 19,4 21,4" fill="currentColor"/>
    <polygon points="25,8 24,6 26,6" fill="currentColor"/>
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
