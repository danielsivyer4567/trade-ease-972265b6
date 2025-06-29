
import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Ruler } from "lucide-react";

interface LoadsSpansHeaderProps {
  title?: string;
}

export const LoadsSpansHeader: React.FC<LoadsSpansHeaderProps> = ({ 
  title = "Trade calculators" 
}) => {
  return (
    <div className="flex items-center gap-2 mb-6">
      <Link to="/calculators" className="hover:text-blue-500">
        <ArrowLeft className="h-6 w-6" />
      </Link>
      <Ruler className="h-8 w-8 text-blue-500" />
      <h1 className="text-3xl font-bold">{title}</h1>
    </div>
  );
};
