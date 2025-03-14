
import React from "react";
import { AppLayout } from "@/components/ui/AppLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Calculator, Percent, Gauge, Ruler, Construction, Compass } from "lucide-react";
import { Link } from "react-router-dom";
import { SectionHeader } from "@/components/ui/SectionHeader";

const Calculators = () => {
  const calculators = [
    {
      title: "Trade Rate Calculator",
      description: "Calculate hourly rates, markups, and profit margins for different trades",
      icon: <Calculator className="h-6 w-6 text-blue-500" />,
      path: "/settings/trade-rates"
    },
    {
      title: "Markup Calculator",
      description: "Calculate price markups and profit margins for quotes and invoices",
      icon: <Percent className="h-6 w-6 text-green-500" />,
      path: "/calculators/markup"
    },
    {
      title: "Job Cost Estimator",
      description: "Estimate total job costs including materials, labor, and overhead",
      icon: <Gauge className="h-6 w-6 text-purple-500" />,
      path: "/calculators/job-cost"
    },
    {
      title: "Loads and Spans Calculator",
      description: "Calculate timber beam loads and spans for construction projects",
      icon: <Ruler className="h-6 w-6 text-amber-500" />,
      path: "/calculators/loads-spans"
    },
    {
      title: "Concrete Calculator",
      description: "Calculate concrete volume needed based on area and thickness measurements",
      icon: <Construction className="h-6 w-6 text-gray-500" />,
      path: "/calculators/loads-spans?tab=concrete"
    },
    {
      title: "Angle Calculator",
      description: "Calculate angles and slopes using various measurement methods",
      icon: <Compass className="h-6 w-6 text-indigo-500" />,
      path: "/calculators/loads-spans?tab=degree"
    }
  ];

  return (
    <AppLayout>
      <div className="container mx-auto py-6 space-y-6">
        <SectionHeader 
          title="Trade Calculators" 
        />
        
        <p className="text-center text-gray-600 mb-6">
          Use these calculators to help with your trade business operations
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {calculators.map((calculator, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">{calculator.title}</CardTitle>
                  {calculator.icon}
                </div>
                <CardDescription>{calculator.description}</CardDescription>
              </CardHeader>
              <CardFooter>
                <Link 
                  to={calculator.path}
                  className="w-full bg-blue-50 text-blue-600 py-2 rounded-md text-center hover:bg-blue-100 transition-colors"
                >
                  Open Calculator
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  );
};

export default Calculators;
