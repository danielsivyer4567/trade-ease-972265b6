import React, { useState } from "react";
import { AppLayout } from "@/components/ui/AppLayout";
import { Link } from "react-router-dom";
import { ArrowLeft, Ruler } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BeamCalculator } from "./BeamCalculator";
import { SpanTableCalculator } from "./SpanTableCalculator";
import { AboutCalculator } from "./AboutCalculator";
import { useBeamCalculator } from "./hooks/useBeamCalculator";

const LoadsSpansCalculator = () => {
  const {
    beamWidth, setBeamWidth,
    beamDepth, setBeamDepth,
    woodType, setWoodType,
    loadType, setLoadType,
    span, setSpan,
    calculatedResult, setCalculatedResult
  } = useBeamCalculator();

  const [material, setMaterial] = useState("Timber");
  const [grade, setGrade] = useState("MGP10");
  const [dimension, setDimension] = useState("140x45");
  const [spacing, setSpacing] = useState("450mm");
  const [load, setLoad] = useState("2.0");
  const [spanType, setSpanType] = useState("Single span");
  const [spanResult, setSpanResult] = useState<string | null>(null);

  return (
    <AppLayout>
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center gap-2 mb-6">
          <Link to="/calculators" className="hover:text-blue-500">
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <Ruler className="h-8 w-8 text-amber-500" />
          <h1 className="text-3xl font-bold">Loads and Spans Calculator</h1>
        </div>

        <Tabs defaultValue="beam-calculator" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="beam-calculator">Beam Calculator</TabsTrigger>
            <TabsTrigger value="span-table">Span Table</TabsTrigger>
            <TabsTrigger value="about">About This Calculator</TabsTrigger>
          </TabsList>

          <TabsContent value="beam-calculator" className="space-y-6">
            <BeamCalculator 
              beamWidth={beamWidth}
              setBeamWidth={setBeamWidth}
              beamDepth={beamDepth}
              setBeamDepth={setBeamDepth}
              woodType={woodType}
              setWoodType={setWoodType}
              loadType={loadType}
              setLoadType={setLoadType}
              span={span}
              setSpan={setSpan}
              calculatedResult={calculatedResult}
              setCalculatedResult={setCalculatedResult}
            />
          </TabsContent>

          <TabsContent value="span-table" className="space-y-6">
            <SpanTableCalculator 
              material={material}
              setMaterial={setMaterial}
              grade={grade}
              setGrade={setGrade}
              dimension={dimension}
              setDimension={setDimension}
              spacing={spacing}
              setSpacing={setSpacing}
              load={load}
              setLoad={setLoad}
              spanType={spanType}
              setSpanType={setSpanType}
              spanResult={spanResult}
              setSpanResult={setSpanResult}
            />
          </TabsContent>

          <TabsContent value="about">
            <AboutCalculator />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default LoadsSpansCalculator;
