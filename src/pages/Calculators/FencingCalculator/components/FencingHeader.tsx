
import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Square } from "lucide-react";

export const FencingHeader = () => {
  return (
    <div className="flex items-center gap-2 mb-6">
      <Link to="/calculators" className="hover:text-blue-500">
        <ArrowLeft className="h-6 w-6" />
      </Link>
      <Square className="h-8 w-8 text-emerald-500" />
      <h1 className="text-3xl font-bold">Fencing Calculator</h1>
    </div>
  );
};
