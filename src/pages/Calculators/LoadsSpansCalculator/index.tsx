
import React from "react";
import { AppLayout } from "@/components/ui/AppLayout";
import { Link } from "react-router-dom";
import { ArrowLeft, Ruler, Square, Compass, Stairs } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BeamCalculator } from "./BeamCalculator";
import { SpanTableCalculator } from "./SpanTableCalculator";
import { AboutCalculator } from "./AboutCalculator";
import { JamesHardieCalculator } from "./JamesHardieCalculator";
import { RafterRoofCalculator } from "./RafterRoofCalculator";
import { ConcreteCalculator } from "./ConcreteCalculator";
import { SquaringCalculator } from "./SquaringCalculator";
import { DegreeCalculator } from "./DegreeCalculator";
import { StairsCalculator } from "./StairsCalculator";
import { useBeamCalculator } from "./hooks/useBeamCalculator";
import { useSpanTableCalculator } from "./hooks/useSpanTableCalculator";
import { useJamesHardieCalculator } from "./hooks/useJamesHardieCalculator";
import { useConcreteCalculator } from "./hooks/useConcreteCalculator";
import { useSquaringCalculator } from "./hooks/useSquaringCalculator";
import { useDegreeCalculator } from "./hooks/useDegreeCalculator";
import { useStairsCalculator } from "./hooks/useStairsCalculator";

const LoadsSpansCalculator = () => {
  const {
    beamWidth,
    setBeamWidth,
    beamDepth,
    setBeamDepth,
    woodType,
    setWoodType,
    loadType,
    setLoadType,
    span,
    setSpan,
    calculatedResult,
    setCalculatedResult,
    calculateStress
  } = useBeamCalculator();
  
  const {
    material,
    setMaterial,
    grade,
    setGrade,
    dimension,
    setDimension,
    spacing,
    setSpacing,
    load,
    setLoad,
    spanType,
    setSpanType,
    spanResult,
    setSpanResult,
    getAvailableGrades,
    getAvailableDimensions,
    calculateSpanFromTable
  } = useSpanTableCalculator();
  
  const {
    productType,
    setProductType,
    thickness,
    setThickness,
    applicationArea,
    setApplicationArea,
    supportSpacing,
    setSupportSpacing,
    windLoad,
    setWindLoad,
    hardieResult,
    setHardieResult,
    calculateHardieRequirements
  } = useJamesHardieCalculator();
  
  const {
    length,
    setLength,
    width,
    setWidth,
    thickness: concreteThickness,
    setThickness: setConcreteThickness,
    unit,
    setUnit,
    thicknessUnit,
    setThicknessUnit,
    waste,
    setWaste,
    calculatedVolume,
    calculateConcreteVolume
  } = useConcreteCalculator();

  const {
    width: squaringWidth,
    setWidth: setSquaringWidth,
    length: squaringLength,
    setLength: setSquaringLength,
    diagonalA,
    setDiagonalA,
    diagonalB,
    setDiagonalB,
    unit: squaringUnit,
    setUnit: setSquaringUnit,
    squaringResult,
    calculateSquaring,
    reset: resetSquaring
  } = useSquaringCalculator();

  const {
    calculationType,
    setCalculationType,
    adjacent,
    setAdjacent,
    opposite,
    setOpposite,
    rise,
    setRise,
    run,
    setRun,
    percentage,
    setPercentage,
    gradient,
    setGradient,
    unit: degreeUnit,
    setUnit: setDegreeUnit,
    result: degreeResult,
    calculateAngle,
    reset: resetDegree
  } = useDegreeCalculator();

  // Add stairs calculator hook
  const {
    totalRise,
    setTotalRise,
    floorToFloor,
    setFloorToFloor,
    availableRun,
    setAvailableRun,
    stairType,
    setStairType,
    targetRiser,
    setTargetRiser,
    targetTread,
    setTargetTread,
    unit: stairsUnit,
    setUnit: setStairsUnit,
    headroomHeight,
    setHeadroomHeight,
    result: stairsResult,
    calculateStairs,
    resetStairs
  } = useStairsCalculator();

  return <AppLayout>
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center gap-2 mb-6">
          <Link to="/calculators" className="hover:text-blue-500">
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <Ruler className="h-8 w-8 text-amber-500" />
          <h1 className="text-3xl font-bold">Trade calculators</h1>
        </div>

        <Tabs defaultValue="beam-calculator" className="w-full">
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

          <TabsContent value="beam-calculator" className="space-y-6">
            <BeamCalculator beamWidth={beamWidth} setBeamWidth={setBeamWidth} beamDepth={beamDepth} setBeamDepth={setBeamDepth} woodType={woodType} setWoodType={setWoodType} loadType={loadType} setLoadType={setLoadType} span={span} setSpan={setSpan} calculatedResult={calculatedResult} setCalculatedResult={setCalculatedResult} calculateStress={calculateStress} />
          </TabsContent>

          <TabsContent value="span-table" className="space-y-6">
            <SpanTableCalculator material={material} setMaterial={setMaterial} grade={grade} setGrade={setGrade} dimension={dimension} setDimension={setDimension} spacing={spacing} setSpacing={setSpacing} load={load} setLoad={setLoad} spanType={spanType} setSpanType={setSpanType} spanResult={spanResult} setSpanResult={setSpanResult} getAvailableGrades={getAvailableGrades} getAvailableDimensions={getAvailableDimensions} calculateSpanFromTable={calculateSpanFromTable} />
          </TabsContent>

          <TabsContent value="james-hardie" className="space-y-6">
            <JamesHardieCalculator productType={productType} setProductType={setProductType} thickness={thickness} setThickness={setThickness} applicationArea={applicationArea} setApplicationArea={setApplicationArea} supportSpacing={supportSpacing} setSupportSpacing={setSupportSpacing} windLoad={windLoad} setWindLoad={setWindLoad} hardieResult={hardieResult} setHardieResult={setHardieResult} calculateHardieRequirements={calculateHardieRequirements} />
          </TabsContent>

          <TabsContent value="rafter-roof" className="space-y-6">
            <RafterRoofCalculator />
          </TabsContent>

          <TabsContent value="concrete" className="space-y-6">
            <ConcreteCalculator length={length} setLength={setLength} width={width} setWidth={setWidth} thickness={concreteThickness} setThickness={setConcreteThickness} unit={unit} setUnit={setUnit} thicknessUnit={thicknessUnit} setThicknessUnit={setThicknessUnit} waste={waste} setWaste={setWaste} calculatedVolume={calculatedVolume} calculateConcreteVolume={calculateConcreteVolume} />
          </TabsContent>

          <TabsContent value="squaring" className="space-y-6">
            <SquaringCalculator
              width={squaringWidth}
              setWidth={setSquaringWidth}
              length={squaringLength}
              setLength={setSquaringLength}
              diagonalA={diagonalA}
              setDiagonalA={setDiagonalA}
              diagonalB={diagonalB}
              setDiagonalB={setDiagonalB}
              unit={squaringUnit}
              setUnit={setSquaringUnit}
              squaringResult={squaringResult}
              calculateSquaring={calculateSquaring}
              reset={resetSquaring}
            />
          </TabsContent>

          <TabsContent value="degree" className="space-y-6">
            <DegreeCalculator
              calculationType={calculationType}
              setCalculationType={setCalculationType}
              adjacent={adjacent}
              setAdjacent={setAdjacent}
              opposite={opposite}
              setOpposite={setOpposite}
              rise={rise}
              setRise={setRise}
              run={run}
              setRun={setRun}
              percentage={percentage}
              setPercentage={setPercentage}
              gradient={gradient}
              setGradient={setGradient}
              unit={degreeUnit}
              setUnit={setDegreeUnit}
              result={degreeResult}
              calculateAngle={calculateAngle}
              reset={resetDegree}
            />
          </TabsContent>

          <TabsContent value="stairs" className="space-y-6">
            <StairsCalculator
              totalRise={totalRise}
              setTotalRise={setTotalRise}
              floorToFloor={floorToFloor}
              setFloorToFloor={setFloorToFloor}
              availableRun={availableRun}
              setAvailableRun={setAvailableRun}
              stairType={stairType}
              setStairType={setStairType}
              targetRiser={targetRiser}
              setTargetRiser={setTargetRiser}
              targetTread={targetTread}
              setTargetTread={setTargetTread}
              unit={stairsUnit}
              setUnit={setStairsUnit}
              headroomHeight={headroomHeight}
              setHeadroomHeight={setHeadroomHeight}
              result={stairsResult}
              calculateStairs={calculateStairs}
              resetStairs={resetStairs}
            />
          </TabsContent>

          <TabsContent value="about">
            <AboutCalculator />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>;
};
export default LoadsSpansCalculator;
