
import React from "react";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";

export const LoadsSpansTabs: React.FC = () => {
  return (
    <TabsList className="flex flex-wrap justify-center md:grid md:grid-cols-9 px-[4px] rounded-2xl py-2 my-0 mx-0 bg-slate-100 overflow-x-auto">
      <TabsTrigger value="beam-calculator" className="bg-slate-400 hover:bg-slate-300 text-xs md:text-sm whitespace-nowrap">Beam Calculator</TabsTrigger>
      <TabsTrigger value="span-table" className="bg-slate-400 hover:bg-slate-300 text-xs md:text-sm whitespace-nowrap">Span Table</TabsTrigger>
      <TabsTrigger value="james-hardie" className="bg-slate-400 hover:bg-slate-300 text-xs md:text-sm whitespace-nowrap">James Hardie</TabsTrigger>
      <TabsTrigger value="rafter-roof" className="bg-slate-400 hover:bg-slate-300 text-xs md:text-sm whitespace-nowrap">Rafter Roof</TabsTrigger>
      <TabsTrigger value="concrete" className="bg-slate-400 hover:bg-slate-300 text-xs md:text-sm whitespace-nowrap">Concrete</TabsTrigger>
      <TabsTrigger value="squaring" className="bg-slate-400 hover:bg-slate-300 text-xs md:text-sm whitespace-nowrap">Squaring</TabsTrigger>
      <TabsTrigger value="degree" className="bg-slate-400 hover:bg-slate-300 text-xs md:text-sm whitespace-nowrap">Angle</TabsTrigger>
      <TabsTrigger value="stairs" className="bg-slate-400 hover:bg-slate-300 text-xs md:text-sm whitespace-nowrap">Stairs</TabsTrigger>
      <TabsTrigger value="about" className="bg-slate-400 hover:bg-slate-300 text-xs md:text-sm whitespace-nowrap">About</TabsTrigger>
    </TabsList>
  );
};
