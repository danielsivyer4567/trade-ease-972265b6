import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Navigation, RotateCw, Home, TreePine, Compass } from 'lucide-react';

interface BoundaryMeasurement {
  length: number;
  direction: string;
  isStreetFacing?: boolean;
}

interface PropertyCoordinate {
  lat: number;
  lng: number;
}

interface BoundaryMeasurementsProps {
  measurements: number[];
  coordinates?: PropertyCoordinate[];
  streetFacing?: 'north' | 'south' | 'east' | 'west';
  propertyData?: any; // Full API response for additional analysis
}

const DIRECTION_OPTIONS = [
  { value: 'front', label: 'Front (Street)', icon: Home, color: 'bg-blue-100 text-blue-800 border-blue-200' },
  { value: 'back', label: 'Back (Rear)', icon: TreePine, color: 'bg-green-100 text-green-800 border-green-200' },
  { value: 'left', label: 'Left Side', icon: Navigation, color: 'bg-purple-100 text-purple-800 border-purple-200' },
  { value: 'right', label: 'Right Side', icon: Navigation, color: 'bg-orange-100 text-orange-800 border-orange-200' },
  { value: 'north', label: 'North', icon: Compass, color: 'bg-red-100 text-red-800 border-red-200' },
  { value: 'south', label: 'South', icon: Compass, color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
  { value: 'east', label: 'East', icon: Compass, color: 'bg-pink-100 text-pink-800 border-pink-200' },
  { value: 'west', label: 'West', icon: Compass, color: 'bg-indigo-100 text-indigo-800 border-indigo-200' },
];

export const BoundaryMeasurements: React.FC<BoundaryMeasurementsProps> = ({ 
  measurements, 
  streetFacing 
}) => {
  const [boundaryData, setBoundaryData] = useState<BoundaryMeasurement[]>([]);
  const [editMode, setEditMode] = useState(false);

  // Initialize boundary data with smart defaults
  useEffect(() => {
    const initializeBoundaries = () => {
      const boundaries: BoundaryMeasurement[] = measurements.map((length, index) => {
        // Smart default assignment based on typical property layouts
        let direction = '';
        let isStreetFacing = false;

        if (measurements.length === 4) {
          // Rectangular property - most common case
          switch (index) {
            case 0:
              direction = 'front';
              isStreetFacing = true;
              break;
            case 1:
              direction = 'right';
              break;
            case 2:
              direction = 'back';
              break;
            case 3:
              direction = 'left';
              break;
          }
        } else if (measurements.length === 3) {
          // Triangular property
          switch (index) {
            case 0:
              direction = 'front';
              isStreetFacing = true;
              break;
            case 1:
              direction = 'right';
              break;
            case 2:
              direction = 'left';
              break;
          }
        } else {
          // Irregular property - use generic numbering
          direction = index === 0 ? 'front' : `side-${index}`;
          isStreetFacing = index === 0;
        }

        return {
          length,
          direction,
          isStreetFacing
        };
      });

      setBoundaryData(boundaries);
    };

    initializeBoundaries();
  }, [measurements]);

  const updateBoundaryDirection = (index: number, newDirection: string) => {
    setBoundaryData(prev => prev.map((boundary, i) => {
      if (i === index) {
        return {
          ...boundary,
          direction: newDirection,
          isStreetFacing: newDirection === 'front'
        };
      }
      // If setting a new front, clear the previous front
      if (newDirection === 'front' && boundary.direction === 'front') {
        return {
          ...boundary,
          direction: `side-${i + 1}`,
          isStreetFacing: false
        };
      }
      return boundary;
    }));
  };

  const getDirectionInfo = (direction: string) => {
    return DIRECTION_OPTIONS.find(opt => opt.value === direction) || 
           { value: direction, label: direction, icon: Compass, color: 'bg-gray-100 text-gray-800 border-gray-200' };
  };

  const getDirectionEmoji = (direction: string) => {
    const emojiMap: Record<string, string> = {
      'front': '🏠',
      'back': '🌳',
      'left': '⬅️',
      'right': '➡️',
      'north': '⬆️',
      'south': '⬇️',
      'east': '➡️',
      'west': '⬅️'
    };
    return emojiMap[direction] || '📏';
  };

  const totalPerimeter = boundaryData.reduce((sum, boundary) => sum + boundary.length, 0);

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Compass className="h-4 w-4" />
            Property Boundary Measurements
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setEditMode(!editMode)}
            className="text-xs"
          >
            <RotateCw className="h-3 w-3 mr-1" />
            {editMode ? 'Done' : 'Edit Directions'}
          </Button>
        </div>
        <p className="text-xs text-gray-600">
          {editMode ? 'Click to assign directions to each boundary' : 'Boundaries labeled with smart defaults'}
        </p>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {/* Boundary Grid */}
        <div className="grid grid-cols-1 gap-2">
          {boundaryData.map((boundary, index) => {
            const directionInfo = getDirectionInfo(boundary.direction);
            const Icon = directionInfo.icon;
            
            return (
              <div key={index} className="flex items-center gap-3">
                {/* Direction Label */}
                <div className={`px-3 py-1.5 rounded-md border text-xs font-medium flex items-center gap-1.5 min-w-[120px] ${directionInfo.color}`}>
                  <Icon className="h-3 w-3" />
                  <span>{getDirectionEmoji(boundary.direction)}</span>
                  <span className="capitalize">{directionInfo.label}</span>
                </div>
                
                {/* Measurement */}
                <div className="bg-slate-100 px-3 py-1.5 rounded text-sm font-medium flex-1">
                  {boundary.length}m
                </div>
                
                {/* Edit Dropdown */}
                {editMode && (
                  <select
                    value={boundary.direction}
                    onChange={(e) => updateBoundaryDirection(index, e.target.value)}
                    className="text-xs border rounded px-2 py-1 bg-white"
                  >
                    {DIRECTION_OPTIONS.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            );
          })}
        </div>

        {/* Summary */}
        <div className="border-t pt-3 space-y-2">
          <div className="flex justify-between items-center p-2 bg-green-50 rounded text-sm">
            <span className="font-medium text-green-800">Total Perimeter:</span>
            <span className="font-bold text-green-900">{totalPerimeter.toFixed(2)}m</span>
          </div>
          
          {/* Street-facing highlight */}
          {boundaryData.some(b => b.isStreetFacing) && (
            <div className="flex justify-between items-center p-2 bg-blue-50 rounded text-sm">
              <span className="font-medium text-blue-800">Street Frontage:</span>
              <span className="font-bold text-blue-900">
                {boundaryData.find(b => b.isStreetFacing)?.length.toFixed(2)}m
              </span>
            </div>
          )}
        </div>

        {/* Property Layout Visualization */}
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <Label className="text-xs font-medium text-gray-700 mb-2 block">Property Layout Guide:</Label>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="space-y-1">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-blue-100 border border-blue-200 rounded"></div>
                <span>Front: Street-facing boundary</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-green-100 border border-green-200 rounded"></div>
                <span>Back: Rear boundary</span>
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-purple-100 border border-purple-200 rounded"></div>
                <span>Left: Standing at front</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-orange-100 border border-orange-200 rounded"></div>
                <span>Right: Standing at front</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}; 