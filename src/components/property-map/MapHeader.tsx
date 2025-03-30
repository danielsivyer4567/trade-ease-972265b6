import React from 'react';
import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, MapPin, RotateCw, Ruler } from 'lucide-react';
import { toast } from "sonner";
interface MapHeaderProps {
  title: string;
  description: string;
  boundaries: Array<Array<[number, number]>>;
  onReset: () => void;
  onToggleEdgeMeasurements?: () => void;
  showEdgeMeasurements?: boolean;
  measureMode?: boolean;
}
export const MapHeader: React.FC<MapHeaderProps> = ({
  title,
  description,
  boundaries,
  onReset,
  onToggleEdgeMeasurements,
  showEdgeMeasurements = false,
  measureMode = false
}) => {
  const handleCopyCoordinates = () => {
    const formattedCoordinates = boundaries.map(boundary => boundary.map(coord => `[${coord[0]}, ${coord[1]}]`).join(',\n  ')).join('\n\n');
    navigator.clipboard.writeText(`[\n  ${formattedCoordinates}\n]`);
    toast.success("Coordinates copied to clipboard");
  };
  return;
};