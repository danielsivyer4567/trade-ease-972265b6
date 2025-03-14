
import React from "react";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";

export const LoadsSpansTabs: React.FC = () => {
  return (
    <TabsList className="grid w-full grid-cols-9 px-[4px] rounded-2xl py-[49px] my-0 mx-0 bg-slate-100">
      <TabsTrigger value="beam-calculator" className="bg-slate-400 hover:bg-slate-300">Beam Calculator</TabsTrigger>
      <TabsTrigger value="span-table" className="bg-slate-400 hover:bg-slate-300">Span Table</TabsTrigger>
      <TabsTrigger value="james-hardie" className="bg-slate-400 hover:bg-slate-300">James Hardie</TabsTrigger>
      <TabsTrigger value="rafter-roof" className="bg-slate-400 hover:bg-slate-300">Rafter Roof</TabsTrigger>
      <TabsTrigger value="concrete" className="bg-slate-400 hover:bg-slate-300">Concrete</TabsTrigger>
      <TabsTrigger value="squaring" className="bg-slate-400 hover:bg-slate-300">Squaring</TabsTrigger>
      <TabsTrigger value="degree" className="bg-slate-400 hover:bg-slate-300">Angle</TabsTrigger>
      <TabsTrigger value="stairs" className="bg-slate-400 hover:bg-slate-300">Stairs</TabsTrigger>
      <TabsTrigger value="about" className="bg-slate-400 hover:bg-slate-300">About</TabsTrigger>
    </TabsList>
  );
};
