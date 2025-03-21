
import React from "react";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";

export const LoadsSpansTabs: React.FC = () => {
  return (
    <TabsList className="flex flex-wrap justify-start md:justify-center gap-1 px-2 md:px-4 py-2 my-0 mx-0 bg-slate-100 rounded-2xl overflow-x-auto max-w-full">
      <TabsTrigger value="beam-calculator" className="bg-slate-300 hover:bg-slate-200 text-xs md:text-sm px-2 md:px-3 py-1 rounded-md whitespace-nowrap flex-shrink-0">Beam Calculator</TabsTrigger>
      <TabsTrigger value="span-table" className="bg-slate-300 hover:bg-slate-200 text-xs md:text-sm px-2 md:px-3 py-1 rounded-md whitespace-nowrap flex-shrink-0">Span Table</TabsTrigger>
      <TabsTrigger value="james-hardie" className="bg-slate-300 hover:bg-slate-200 text-xs md:text-sm px-2 md:px-3 py-1 rounded-md whitespace-nowrap flex-shrink-0">James Hardie</TabsTrigger>
      <TabsTrigger value="rafter-roof" className="bg-slate-300 hover:bg-slate-200 text-xs md:text-sm px-2 md:px-3 py-1 rounded-md whitespace-nowrap flex-shrink-0">Rafter Roof</TabsTrigger>
      <TabsTrigger value="concrete" className="bg-slate-300 hover:bg-slate-200 text-xs md:text-sm px-2 md:px-3 py-1 rounded-md whitespace-nowrap flex-shrink-0">Concrete</TabsTrigger>
      <TabsTrigger value="squaring" className="bg-slate-300 hover:bg-slate-200 text-xs md:text-sm px-2 md:px-3 py-1 rounded-md whitespace-nowrap flex-shrink-0">Squaring</TabsTrigger>
      <TabsTrigger value="degree" className="bg-slate-300 hover:bg-slate-200 text-xs md:text-sm px-2 md:px-3 py-1 rounded-md whitespace-nowrap flex-shrink-0">Angle</TabsTrigger>
      <TabsTrigger value="stairs" className="bg-slate-300 hover:bg-slate-200 text-xs md:text-sm px-2 md:px-3 py-1 rounded-md whitespace-nowrap flex-shrink-0">Stairs</TabsTrigger>
      <TabsTrigger value="about" className="bg-slate-300 hover:bg-slate-200 text-xs md:text-sm px-2 md:px-3 py-1 rounded-md whitespace-nowrap flex-shrink-0">About</TabsTrigger>
    </TabsList>
  );
};
