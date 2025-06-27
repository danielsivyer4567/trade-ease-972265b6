import React from "react";
import { AppLayout } from "@/components/ui/AppLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Calculator, Percent, Gauge, Ruler, Construction, Compass, ArrowUpDown, Square, FileCode, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import { SectionHeader } from "@/components/ui/SectionHeader";

const Calculators = () => {
  const calculators = [{
    title: "Trade Rate Calculator",
    description: "Calculate hourly rates, markups, and profit margins for different trades",
    icon: <Calculator className="h-6 w-6 text-blue-500" />,
    path: "/settings/trade-rates"
  }, {
    title: "Markup Calculator",
    description: "Calculate price markups and profit margins for quotes and invoices",
    icon: <Percent className="h-6 w-6 text-green-500" />,
    path: "/calculators/markup"
  }, {
    title: "Job Cost Estimator",
    description: "Estimate total job costs including materials, labor, and overhead",
    icon: <Gauge className="h-6 w-6 text-purple-500" />,
    path: "/calculators/job-cost"
  }, {
    title: "Loads and Spans Calculator",
    description: "Calculate timber beam loads and spans for construction projects",
    icon: <Ruler className="h-6 w-6 text-amber-500" />,
    path: "/calculators/loads-spans"
  }, {
    title: "Concrete Calculator",
    description: "Calculate concrete volume needed based on area and thickness measurements",
    icon: <Construction className="h-6 w-6 text-gray-500" />,
    path: "/calculators/concrete"
  }, {
    title: "Angle Calculator",
    description: "Calculate angles and slopes using various measurement methods",
    icon: <Compass className="h-6 w-6 text-indigo-500" />,
    path: "/calculators/angle"
  }, {
    title: "Stairs Calculator",
    description: "Calculate stair dimensions, risers, and treads for building projects",
    icon: <ArrowUpDown className="h-6 w-6 text-orange-500" />,
    path: "/calculators/stairs"
  }, {
    title: "Fencing Calculator",
    description: "Calculate materials needed for fencing projects including posts, panels, and gates",
    icon: <Square className="h-6 w-6 text-emerald-500" />,
    path: "/calculators/fencing"
  }, {
    title: "NCC Codes Reference",
    description: "Search and reference National Construction Code clauses for building compliance",
    icon: <FileCode className="h-6 w-6 text-red-500" />,
    path: "/calculators/ncc-codes"
  }, {
    title: "Qbcc Forms",
    description: "Access Queensland Building and Construction Commission forms.",
    icon: <FileText className="h-6 w-6 text-blue-500" />,
    path: "/qbcc-forms"
  }, {
    title: "Timber Qld Technical Data Sheet",
    description: "View technical data sheets from Timber Queensland.",
    icon: <FileText className="h-6 w-6 text-green-700" />,
    path: "/timber-qld-technical-data-sheet"
  }, {
    title: "SafeWork NSW",
    description: "Access SafeWork NSW resources and guidelines.",
    icon: <FileText className="h-6 w-6 text-orange-500" />,
    path: "/safework-nsw"
  }, {
    title: "Consumer and Business Services",
    description: "Consumer and Business Services resources.",
    icon: <FileText className="h-6 w-6 text-yellow-600" />,
    path: "/consumer-business-services"
  }, {
    title: "Building and Energy",
    description: "Building and Energy compliance and information.",
    icon: <FileText className="h-6 w-6 text-blue-700" />,
    path: "/building-and-energy"
  }, {
    title: "Building Practitioners Board",
    description: "Building Practitioners Board resources.",
    icon: <FileText className="h-6 w-6 text-purple-700" />,
    path: "/building-practitioners-board"
  }, {
    title: "Access Canberra (Building and Planning)",
    description: "Access Canberra Building and Planning resources.",
    icon: <FileText className="h-6 w-6 text-pink-700" />,
    path: "/access-canberra-building-planning"
  }, {
    title: "Consumer, Building and Occupational Services",
    description: "Consumer, Building and Occupational Services resources.",
    icon: <FileText className="h-6 w-6 text-gray-700" />,
    path: "/consumer-building-occupational-services"
  }];
  
  return (
    <AppLayout>
      <div className="container mx-auto py-6 px-4 space-y-6">
        <SectionHeader title="Tricks of the Trade" />
        
        <p className="text-xl font-bold text-center text-gray-700 mb-6">
          Trade Calculators
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {calculators.filter(c => ![
            "NCC Codes Reference",
            "Timber Qld Technical Data Sheet",
            "Qbcc Forms",
            "SafeWork NSW",
            "Consumer and Business Services",
            "Building and Energy",
            "Building Practitioners Board",
            "Access Canberra (Building and Planning)",
            "Consumer, Building and Occupational Services"
          ].includes(c.title)).map((calculator, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardHeader className="bg-slate-200 p-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base md:text-lg">{calculator.title}</CardTitle>
                  {calculator.icon}
                </div>
                <CardDescription className="line-clamp-2 min-h-[40px]">{calculator.description}</CardDescription>
              </CardHeader>
              <CardFooter className="bg-slate-200 p-4">
                <Link 
                  to={calculator.path} 
                  className="w-full bg-blue-50 text-blue-600 py-2 rounded-md text-center hover:bg-blue-100 transition-colors"
                >
                  Open Calculator
                </Link>
              </CardFooter>
            </Card>
          ))}
          {/* Full-width border as a grid item */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-3">
            <div className="border-t-2 border-gray-300 my-4 w-full"></div>
            <h2 className="text-xl font-bold text-center text-gray-700 mt-6 mb-4">Building industry regulators</h2>
          </div>
          {/* NCC Codes Reference card as a grid item, plus new resources */}
          {calculators.filter(c => [
            "NCC Codes Reference",
            "Qbcc Forms",
            "Timber Qld Technical Data Sheet",
            "SafeWork NSW",
            "Consumer and Business Services",
            "Building and Energy",
            "Building Practitioners Board",
            "Access Canberra (Building and Planning)",
            "Consumer, Building and Occupational Services"
          ].includes(c.title)).map((calculator, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardHeader className="bg-slate-200 p-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base md:text-lg">{calculator.title}</CardTitle>
                  {calculator.icon}
                </div>
                <CardDescription className="line-clamp-2 min-h-[40px]">{calculator.description}</CardDescription>
              </CardHeader>
              <CardFooter className="bg-slate-200 p-4">
                <Link 
                  to={calculator.path} 
                  className="w-full bg-blue-50 text-blue-600 py-2 rounded-md text-center hover:bg-blue-100 transition-colors"
                >
                  Open Reference
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
