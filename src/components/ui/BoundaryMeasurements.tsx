import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Navigation, RotateCw, Home, TreePine, Compass, Map, AlertTriangle } from 'lucide-react';
import { QueenslandSpatialService } from '../../services/QueenslandSpatialService';

interface BoundaryMeasurement {
  length: number;
  direction: string;
}

interface PropertyCoordinate {
  lat: number;
  lng: number;
}

interface BoundaryMeasurementsProps {
  measurements: number[];
  coordinates?: PropertyCoordinate[];
  streetFacing?: 'north' | 'south' | 'east' | 'west';
  propertyData?: any;
  address?: {
    street_number: string;
    street_name: string;
    street_type: string;
    suburb: string;
    postcode: string;
  };
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
  coordinates,
  streetFacing,
  propertyData,
  address
}) => {
  const [boundaryData, setBoundaryData] = useState<BoundaryMeasurement[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [queenslandData, setQueenslandData] = useState<any>(null);
  const [isLoadingQLD, setIsLoadingQLD] = useState(false);

  // Load Queensland Spatial data
  const loadQueenslandData = async () => {
    console.log('BoundaryMeasurements: loadQueenslandData called with address:', address);

    // For testing: create a mock address if none provided
    const testAddress = address || {
      street_number: '2',
      street_name: 'Adelong',
      street_type: 'Close',
      suburb: 'Upper Coomera',
      postcode: '4209'
    };

    if (!testAddress.postcode.startsWith('4')) {
      console.log('BoundaryMeasurements: Not a Queensland postcode:', testAddress.postcode);
      alert('Queensland Spatial Data is only available for Queensland properties (postcodes starting with 4)');
      return;
    }

    setIsLoadingQLD(true);
    console.log('BoundaryMeasurements: Testing with address:', testAddress);

    try {
      console.log('BoundaryMeasurements: Loading Queensland Spatial data for:', testAddress);
      alert('Fetching Queensland Government spatial data... This may take a few seconds.');

      const qldData = await QueenslandSpatialService.getQueenslandPropertyData(testAddress);

      if (qldData) {
        console.log('BoundaryMeasurements: Queensland data loaded successfully:', qldData);
        setQueenslandData(qldData);

        // Convert Queensland boundary data to our format
        const qldBoundaries: BoundaryMeasurement[] = qldData.boundaries.map((boundary, index) => ({
          length: boundary.length,
          direction: boundary.direction
        }));

        setBoundaryData(qldBoundaries);
        alert(`Queensland data loaded! Found Lot ${qldData.lotNumber}, Plan ${qldData.planNumber}`);
      } else {
        console.log('BoundaryMeasurements: No Queensland data available');
        alert('No Queensland spatial data found for this property. This could be due to:\n- Property not in Queensland cadastral database\n- Address not found in government records\n- Temporary API unavailability');
      }
    } catch (error) {
      console.error('BoundaryMeasurements: Queensland data loading failed:', error);
      alert(`Queensland spatial data failed to load:\n${error instanceof Error ? error.message : 'Unknown error'}\n\nCheck browser console for details.`);
    } finally {
      setIsLoadingQLD(false);
    }
  };

  // Initialize boundary data with simple numbering
  useEffect(() => {
    const initializeBoundaries = () => {
      const boundaries = measurements.map((length, index) => ({
        length,
        direction: `Boundary ${index + 1}`
      }));
      setBoundaryData(boundaries);
    };

    initializeBoundaries();
  }, [measurements, coordinates, propertyData]);

  const updateBoundaryDirection = (index: number, newDirection: string) => {
    setBoundaryData(prev => prev.map((boundary, i) => {
      if (i === index) {
        return {
          ...boundary,
          direction: newDirection
        };
      }
      return boundary;
    }));
  };

  const getDirectionInfo = (direction: string) => {
    return DIRECTION_OPTIONS.find(opt => opt.value === direction) || 
           { value: direction, label: direction, icon: Compass, color: 'bg-gray-100 text-gray-800 border-gray-200' };
  };

  const totalPerimeter = boundaryData.reduce((sum, boundary) => sum + boundary.length, 0);

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Home className="h-4 w-4" />
            Property Boundaries
          </CardTitle>
          <div className="flex gap-2">
            {address && address.postcode.startsWith('4') && (
              <Button
                variant="outline"
                size="sm"
                onClick={loadQueenslandData}
                disabled={isLoadingQLD}
                className="text-xs bg-green-50 hover:bg-green-100 text-green-700"
              >
                <Map className="h-3 w-3 mr-1" />
                {isLoadingQLD ? 'Loading QLD Data...' : 'Get QLD Spatial Data'}
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setEditMode(!editMode)}
              className="text-xs"
            >
              <RotateCw className="h-3 w-3 mr-1" />
              {editMode ? 'Done' : 'Edit Labels'}
            </Button>
          </div>
        </div>
        <p className="text-xs text-gray-600">
          Property boundary measurements and labels
        </p>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {/* Boundary List */}
        <div className="space-y-2">
          {boundaryData.map((boundary, index) => (
            <div key={index} className="flex items-center justify-between p-2 border rounded-lg bg-gray-50">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium min-w-[60px] text-center">
                  #{index + 1}
                </div>
                <div className="text-sm font-medium">
                  {boundary.length.toFixed(1)}m
                </div>
              </div>
              
              {editMode ? (
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
              ) : (
                <div className="text-xs text-gray-600">
                  {boundary.direction}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4">
          <div className="text-sm font-medium text-blue-800 mb-1">
            Property Summary
          </div>
          <div className="text-xs text-blue-700 space-y-1">
            <div>Total Boundaries: {boundaryData.length}</div>
            <div>Total Perimeter: {totalPerimeter.toFixed(1)}m</div>
            <div>Average Boundary: {(totalPerimeter / boundaryData.length).toFixed(1)}m</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}; 