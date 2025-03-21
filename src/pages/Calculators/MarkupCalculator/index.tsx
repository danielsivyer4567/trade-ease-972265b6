
import React from "react";
import { AppLayout } from "@/components/ui/AppLayout";
import { Link } from "react-router-dom";
import { ArrowLeft, Percent } from "lucide-react";

const MarkupCalculator = () => {
  return (
    <AppLayout>
      <div className="container mx-auto p-4 md:p-6">
        <div className="flex items-center gap-2 mb-6">
          <Link to="/calculators" className="hover:text-blue-500">
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <Percent className="h-8 w-8 text-green-500" />
          <h1 className="text-3xl font-bold">Markup Calculator</h1>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-center text-gray-500 mb-4">Coming soon! The Markup Calculator is under development.</p>
        </div>
      </div>
    </AppLayout>
  );
};

export default MarkupCalculator;
