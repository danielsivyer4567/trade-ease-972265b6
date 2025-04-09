import React from 'react';
import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, RotateCw, Ruler } from 'lucide-react';
import { toast } from "sonner";
interface MapHeaderProps {
  title: string;
  description: string;
  boundaries: Array<Array<[number, number]>>;
  onReset: () => void;
  onToggleEdgeMeasurements: () => void;
  showEdgeMeasurements: boolean;
  measureMode: boolean;
}
export const MapHeader: React.FC<MapHeaderProps> = ({
  title,
  description,
  boundaries,
  onReset,
  onToggleEdgeMeasurements,
  showEdgeMeasurements,
  measureMode
}) => {
  const handleCopyCoordinates = () => {
    const formattedCoordinates = JSON.stringify(boundaries, null, 2);
    navigator.clipboard.writeText(formattedCoordinates);
    toast.success("Coordinates copied to clipboard");
  };
  return;
};