import React from "react";
import { AppLayout } from "@/components/ui/AppLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Calculator, Percent, Gauge, Ruler, Construction, Compass, ArrowUpDown, Square, FileCode, FileText, Zap, Droplets } from "lucide-react";
import { Link } from "react-router-dom";
import { SectionHeader } from "@/components/ui/SectionHeader";

const HardHatIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
  >
    {/* Hard hat brim/visor */}
    <ellipse 
      cx="12" 
      cy="17" 
      rx="10" 
      ry="2" 
      fill="#FFF" 
      stroke="#333" 
      strokeWidth="1.5"
    />
    
    {/* Hard hat main body */}
    <path
      d="M4 17c0-4.4 3.6-8 8-8s8 3.6 8 8"
      fill="#FFF"
      stroke="#333"
      strokeWidth="2"
    />
    
    {/* Hard hat top ridge */}
    <path
      d="M6 15c0-3.3 2.7-6 6-6s6 2.7 6 6"
      fill="none"
      stroke="#666"
      strokeWidth="1"
    />
    
    {/* Hard hat crown/top */}
    <path
      d="M8 13c0-2.2 1.8-4 4-4s4 1.8 4 4"
      fill="none"
      stroke="#999"
      strokeWidth="0.8"
    />
    
    {/* Side reinforcement points */}
    <circle cx="6.5" cy="15.5" r="1" fill="#333"/>
    <circle cx="17.5" cy="15.5" r="1" fill="#333"/>
    
    {/* Center logo/emblem area */}
    <circle cx="12" cy="13" r="1.5" fill="none" stroke="#666" strokeWidth="1"/>
    <circle cx="12" cy="13" r="0.8" fill="#E5E5E5"/>
  </svg>
);

const PropertyBoundaryIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6 text-blue-600"
  >
    {/* Property boundary outline - animated drawing */}
    <path
      d="M6 8 L24 8 L24 22 L6 22 Z"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeDasharray="60"
      strokeDashoffset="60"
    >
      <animate
        attributeName="stroke-dashoffset"
        values="60;0;60"
        dur="3s"
        repeatCount="indefinite"
      />
    </path>
    
    {/* Corner markers */}
    <circle cx="6" cy="8" r="1.5" fill="currentColor" opacity="0">
      <animate attributeName="opacity" values="0;1;0" dur="3s" begin="0.5s" repeatCount="indefinite"/>
    </circle>
    <circle cx="24" cy="8" r="1.5" fill="currentColor" opacity="0">
      <animate attributeName="opacity" values="0;1;0" dur="3s" begin="1s" repeatCount="indefinite"/>
    </circle>
    <circle cx="24" cy="22" r="1.5" fill="currentColor" opacity="0">
      <animate attributeName="opacity" values="0;1;0" dur="3s" begin="1.5s" repeatCount="indefinite"/>
    </circle>
    <circle cx="6" cy="22" r="1.5" fill="currentColor" opacity="0">
      <animate attributeName="opacity" values="0;1;0" dur="3s" begin="2s" repeatCount="indefinite"/>
    </circle>
    
    {/* Measurement lines */}
    <g opacity="0">
      <animate attributeName="opacity" values="0;1;1;0" dur="3s" begin="2.5s" repeatCount="indefinite"/>
      
      {/* Top measurement */}
      <line x1="6" y1="6" x2="24" y2="6" stroke="currentColor" strokeWidth="1"/>
      <line x1="6" y1="5" x2="6" y2="7" stroke="currentColor" strokeWidth="1"/>
      <line x1="24" y1="5" x2="24" y2="7" stroke="currentColor" strokeWidth="1"/>
      <text x="15" y="4" fontSize="3" fill="currentColor" textAnchor="middle">25m</text>
      
      {/* Right measurement */}
      <line x1="26" y1="8" x2="26" y2="22" stroke="currentColor" strokeWidth="1"/>
      <line x1="25" y1="8" x2="27" y2="8" stroke="currentColor" strokeWidth="1"/>
      <line x1="25" y1="22" x2="27" y2="22" stroke="currentColor" strokeWidth="1"/>
      <text x="29" y="16" fontSize="3" fill="currentColor" textAnchor="middle">15m</text>
    </g>
    
    {/* Survey compass indicator */}
    <g transform="translate(28,4)" opacity="0">
      <animate attributeName="opacity" values="0;1;1;0" dur="3s" begin="1s" repeatCount="indefinite"/>
      <circle cx="0" cy="0" r="2" fill="none" stroke="currentColor" strokeWidth="0.5"/>
      <path d="M0,-1.5 L0.5,1 L0,0.5 L-0.5,1 Z" fill="currentColor"/>
      <text x="0" y="3.5" fontSize="2.5" fill="currentColor" textAnchor="middle">N</text>
    </g>
  </svg>
);

const TimberPicketIcon = () => (
  <svg
    width="24"
    height="24"
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

const Calculators = () => {
  const calculators = [{
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
    title: "Carpentry Calculators",
    description: "Calculate timber beam loads, spans, and other carpentry measurements for construction projects",
          icon: <Ruler className="h-6 w-6 text-blue-500" />,
    path: "/calculators/loads-spans"
  }, {
    title: "Concrete Calculator",
    description: "Calculate concrete volume needed based on area and thickness measurements",
    icon: <Construction className="h-6 w-6 text-gray-500" />,
    path: "/calculators/concrete"
  }, {
    title: "Fencing Calculator",
    description: "Calculate materials needed for fencing projects including posts, panels, and gates",
    icon: <TimberPicketIcon />,
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
                  className="w-full bg-blue-600 text-white py-2 rounded-md text-center hover:bg-blue-700 transition-colors"
                >
                  Open Calculator
                </Link>
              </CardFooter>
            </Card>
          ))}
          {/* Electrician Calculator Card */}
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="bg-slate-200 p-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base md:text-lg">Electrician Calculator</CardTitle>
                <Zap className="h-6 w-6 text-yellow-500" />
              </div>
              <CardDescription className="line-clamp-2 min-h-[40px]">
                Calculate electrical loads, wire sizes, voltage drops, and more for electrical projects.
              </CardDescription>
            </CardHeader>
            <CardFooter className="bg-slate-200 p-4">
              <Link 
                to="/calculators/electrician" 
                className="w-full bg-blue-600 text-white py-2 rounded-md text-center hover:bg-blue-700 transition-colors"
              >
                Open Calculator
              </Link>
            </CardFooter>
          </Card>
          {/* Plumbing Calculator Card */}
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="bg-slate-200 p-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base md:text-lg">Plumbing Calculator</CardTitle>
                <Droplets className="h-6 w-6 text-blue-500" />
              </div>
              <CardDescription className="line-clamp-2 min-h-[40px]">
                Calculate pipe sizes, pressure loss, tank volumes, and more for plumbing projects.
              </CardDescription>
            </CardHeader>
            <CardFooter className="bg-slate-200 p-4">
              <Link 
                to="/calculators/plumbing" 
                className="w-full bg-blue-600 text-white py-2 rounded-md text-center hover:bg-blue-700 transition-colors"
              >
                Open Calculator
              </Link>
            </CardFooter>
          </Card>
        </div>

        {/* Property Measurement and Specialized Tools section */}
        <div className="mt-8">
          <div className="border-t-2 border-gray-300 my-4 w-full"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Property Measurement Tool Card */}
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="bg-slate-200 p-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base md:text-lg">Automatic Boundary Measure</CardTitle>
                  <PropertyBoundaryIcon />
                </div>
                <CardDescription className="line-clamp-2 min-h-[40px]">
                  Measure property dimensions and calculate area for site planning and compliance.
                </CardDescription>
              </CardHeader>
              <CardFooter className="bg-slate-200 p-4">
                <Link 
                  to="/property-measurement" 
                  className="w-full bg-blue-600 text-white py-2 rounded-md text-center hover:bg-blue-700 transition-colors"
                >
                  Open Calculator
                </Link>
              </CardFooter>
            </Card>
            {/* Trade Rate Calculator Card */}
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="bg-slate-200 p-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base md:text-lg">Trade Rate Calculator</CardTitle>
                  <HardHatIcon />
                </div>
                <CardDescription className="line-clamp-2 min-h-[40px]">
                  Calculate hourly rates, markups, and profit margins for different trades
                </CardDescription>
              </CardHeader>
              <CardFooter className="bg-slate-200 p-4">
                <Link 
                  to="/settings/trade-rates" 
                  className="w-full bg-blue-600 text-white py-2 rounded-md text-center hover:bg-blue-700 transition-colors"
                >
                  Open Calculator
                </Link>
              </CardFooter>
            </Card>
          </div>
        </div>

        {/* Building industry regulators section */}
        <div className="mt-8">
          <div className="border-t-2 border-gray-300 my-4 w-full"></div>
          <h2 className="text-xl font-bold text-center text-gray-700 mt-6 mb-6">Building industry regulators</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
                    className="w-full bg-blue-600 text-white py-2 rounded-md text-center hover:bg-blue-700 transition-colors"
                  >
                    Open Reference
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Calculators;
