
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function JobCreationHeader() {
  const navigate = useNavigate();
  
  return (
    <div className="flex items-center mb-6">
      <Button 
        variant="outline" 
        size="icon" 
        onClick={() => navigate("/jobs")} 
        className="mr-2 rounded-md border border-gray-300 bg-slate-400 hover:bg-slate-300"
      >
        <ArrowLeft className="h-5 w-5" />
      </Button>
      <h1 className="text-3xl font-bold">Create New Job</h1>
    </div>
  );
}
