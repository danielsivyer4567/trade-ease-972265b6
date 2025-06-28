import React, { useState } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const RafterRoofCalculator: React.FC = () => {
  const [pitchDeg, setPitchDeg] = useState(30);
  const [spanM, setSpanM] = useState(6);
  const [material, setMaterial] = useState("wood");
  const [windRating, setWindRating] = useState("medium");
  const [rafterSpacing, setRafterSpacing] = useState(600);
  const [rafterWidth, setRafterWidth] = useState(45);
  const [birdsmouthDepth, setBirdsmouthDepth] = useState(50);
  const [roofCovering, setRoofCovering] = useState("colorbond");
  const [ridgeBeam, setRidgeBeam] = useState("no");
  const [ridgeBeamThickness, setRidgeBeamThickness] = useState(90);
  const [result, setResult] = useState<any>(null);

  function calculate() {
    const math = Math;
    const pitch_rad = math.PI * pitchDeg / 180;
    const half_span = spanM / 2;
    const rafter_length = half_span / math.cos(pitch_rad);
    const ridge_cut_angle = 90 - pitchDeg;
    const span_mm = spanM * 1000;
    const num_rafters = math.ceil(span_mm / rafterSpacing) + 1;
    const birdsmouth_seat_cut = birdsmouthDepth;
    const total_rafter_length_m = rafter_length * num_rafters;
    const material_weights: any = { wood: 0.6, metal: 2.0 };
    const material_weight_total = total_rafter_length_m * (material_weights[material] || 0.6);
    const wind_adjustment: any = { low: 1, medium: 0.9, high: 0.75 };
    const adjusted_spacing = rafterSpacing * (wind_adjustment[windRating] || 1);
    const adjusted_num_rafters = math.ceil(span_mm / adjusted_spacing) + 1;
    const adjusted_total_length = rafter_length * adjusted_num_rafters;
    setResult({
      rafter_length_m: Number(rafter_length.toFixed(2)),
      ridge_cut_angle_deg: Number(ridge_cut_angle.toFixed(2)),
      num_rafters_standard: num_rafters,
      num_rafters_adjusted_wind: adjusted_num_rafters,
      birdsmouth_seat_cut_mm: birdsmouth_seat_cut,
      total_rafter_length_m: Number(total_rafter_length_m.toFixed(2)),
      adjusted_total_rafter_length_m: Number(adjusted_total_length.toFixed(2)),
      material_weight_kg: Number(material_weight_total.toFixed(2)),
    });
  }

  return (
    <>
      <div className="w-full flex justify-center mb-6">
        <img 
          src="/lovable-uploads/197b4c992159b.png" 
          alt="Rafter and roof diagram" 
          className="max-w-full h-auto rounded shadow-md border border-gray-200"
          style={{ maxHeight: 240 }}
        />
      </div>
      <Card className="bg-slate-300">
        <CardHeader>
          <CardTitle className="text-black">Rafter & Roof Calculator</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <h2 className="font-semibold text-lg text-black mb-2">Roof Dimensions & Parameters</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2 text-black">
                <Label htmlFor="pitch">Roof Pitch (degrees)</Label>
                <Input id="pitch" type="number" value={pitchDeg} onChange={e => setPitchDeg(Number(e.target.value))} min={1} max={89} className="bg-white text-black" />
              </div>
              <div className="space-y-2 text-black">
                <Label htmlFor="span">Building Span (m)</Label>
                <Input id="span" type="number" value={spanM} onChange={e => setSpanM(Number(e.target.value))} min={0.1} step={0.01} className="bg-white text-black" />
              </div>
              <div className="space-y-2 text-black">
                <Label htmlFor="spacing">Rafter Spacing (mm)</Label>
                <Input id="spacing" type="number" value={rafterSpacing} onChange={e => setRafterSpacing(Number(e.target.value))} min={100} step={1} className="bg-white text-black" />
              </div>
            </div>
          </div>
          <div className="mb-6">
            <h2 className="font-semibold text-lg text-black mb-2">Material & Environmental</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2 text-black">
                <Label htmlFor="material">Material Type</Label>
                <Select value={material} onValueChange={setMaterial}>
                  <SelectTrigger id="material" className="text-black">
                    <SelectValue placeholder="Select material" className="text-black" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="wood" className="text-black">Wood</SelectItem>
                    <SelectItem value="metal" className="text-black">Metal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 text-black">
                <Label htmlFor="wind">Wind Rating</Label>
                <Select value={windRating} onValueChange={setWindRating}>
                  <SelectTrigger id="wind" className="text-black">
                    <SelectValue placeholder="Select wind rating" className="text-black" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low" className="text-black">Low</SelectItem>
                    <SelectItem value="medium" className="text-black">Medium</SelectItem>
                    <SelectItem value="high" className="text-black">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 text-black">
                <Label htmlFor="width">Rafter Width (mm)</Label>
                <Input id="width" type="number" value={rafterWidth} onChange={e => setRafterWidth(Number(e.target.value))} min={10} step={1} className="bg-white text-black" />
              </div>
            </div>
          </div>
          <div className="mb-6">
            <h2 className="font-semibold text-lg text-black mb-2">Roof Covering Material</h2>
            <div className="flex flex-wrap gap-2">
              {[
                { value: "colorbond", label: "Colorbond" },
                { value: "roof_tiles", label: "Roof Tiles" },
                { value: "shingles", label: "Shingles" },
                { value: "slate_rock", label: "Slate Rock" },
                { value: "composite_shingles", label: "Composite Shingles" },
                { value: "solar_tiles", label: "Solar Tiles" },
              ].map(opt => (
                <Button
                  key={opt.value}
                  type="button"
                  className={`px-4 py-2 rounded ${roofCovering === opt.value ? 'bg-amber-500 text-white' : 'bg-white text-black border border-gray-300'}`}
                  onClick={() => setRoofCovering(opt.value)}
                >
                  {opt.label}
                </Button>
              ))}
            </div>
          </div>
          <div className="mb-6">
            <h2 className="font-semibold text-lg text-black mb-2">Birdsmouth Cut</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2 text-black">
                <Label htmlFor="birdsmouth">Birdsmouth Depth (mm) (seat cut)</Label>
                <Input id="birdsmouth" type="number" value={birdsmouthDepth} onChange={e => setBirdsmouthDepth(Number(e.target.value))} min={1} step={1} className="bg-white text-black" />
              </div>
            </div>
          </div>
          <div className="mb-6">
            <h2 className="font-semibold text-lg text-black mb-2">Ridge Beam</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2 text-black">
                <Label htmlFor="ridge-beam">Ridge Beam Added?</Label>
                <Select value={ridgeBeam} onValueChange={setRidgeBeam}>
                  <SelectTrigger id="ridge-beam" className="text-black">
                    <SelectValue placeholder="Select option" className="text-black" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="no" className="text-black">No</SelectItem>
                    <SelectItem value="yes" className="text-black">Yes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {ridgeBeam === "yes" && (
                <div className="space-y-2 text-black">
                  <Label htmlFor="ridge-beam-thickness">Ridge Beam Thickness (mm)</Label>
                  <Input id="ridge-beam-thickness" type="number" value={ridgeBeamThickness} onChange={e => setRidgeBeamThickness(Number(e.target.value))} min={1} step={1} className="bg-white text-black" />
                </div>
              )}
            </div>
          </div>
          <Button className="w-full mt-4 bg-amber-500 hover:bg-amber-600" onClick={calculate}>Calculate</Button>
        </CardContent>
      </Card>
      {result && (
        <Card className="mt-6 bg-slate-300">
          <CardHeader>
            <CardTitle className="text-black">Calculation Results</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-black">
              <li><b>Rafter Length:</b> {result.rafter_length_m} m</li>
              <li><b>Ridge Cut Angle (to cut at ridge):</b> {result.ridge_cut_angle_deg}°</li>
              <li><b>Number of Rafters (standard spacing):</b> {result.num_rafters_standard}</li>
              <li><b>Number of Rafters (adjusted for wind):</b> {result.num_rafters_adjusted_wind}</li>
              <li><b>Birdsmouth Seat Cut Depth:</b> {result.birdsmouth_seat_cut_mm} mm</li>
              <li><b>Total Rafter Length (standard spacing):</b> {result.total_rafter_length_m} m</li>
              <li><b>Total Rafter Length (adjusted for wind):</b> {result.adjusted_total_rafter_length_m} m</li>
              <li><b>Estimated Material Weight:</b> {result.material_weight_kg} kg</li>
              {ridgeBeam === "yes" && (
                <li><b>Ridge Beam Thickness:</b> {ridgeBeamThickness} mm</li>
              )}
            </ul>
          </CardContent>
        </Card>
      )}
    </>
  );
};
