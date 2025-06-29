
import React from "react";
import { AppLayout } from "@/components/ui/AppLayout";
import { Link } from "react-router-dom";
import { ArrowLeft, Gauge } from "lucide-react";

const JobCostCalculator = () => {
  return (
    <AppLayout>
      <div className="container mx-auto p-4 md:p-6">
        <div className="flex items-center gap-2 mb-6">
          <Link to="/calculators" className="hover:text-blue-500">
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <Gauge className="h-8 w-8 text-purple-500" />
          <h1 className="text-3xl font-bold">Job Cost Estimator</h1>
        </div>
        
        <div className="bg-slate-300 rounded-lg shadow p-6">
          <p className="text-center text-gray-500 mb-4">Coming soon! The Job Cost Estimator is under development.</p>
        </div>
      </div>
    </AppLayout>
  );
};

export default JobCostCalculator;
