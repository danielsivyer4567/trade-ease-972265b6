import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Navigation, RotateCw, Home, TreePine, Compass, Map, AlertTriangle } from 'lucide-react';
import { QueenslandSpatialService } from '../../services/QueenslandSpatialService';

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
          direction: boundary.direction,
          isStreetFacing: qldData.streetFrontage?.boundaryIndex === index
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

  // Calculate the angle between two points
  const calculateAngle = (p1: PropertyCoordinate, p2: PropertyCoordinate): number => {
    const deltaLng = p2.lng - p1.lng;
    const deltaLat = p2.lat - p1.lat;
    return Math.atan2(deltaLat, deltaLng) * (180 / Math.PI);
  };

  // Calculate the centroid of the property
  const calculateCentroid = (coords: PropertyCoordinate[]): PropertyCoordinate => {
    const sum = coords.reduce((acc, coord) => ({
      lat: acc.lat + coord.lat,
      lng: acc.lng + coord.lng
    }), { lat: 0, lng: 0 });
    
    return {
      lat: sum.lat / coords.length,
      lng: sum.lng / coords.length
    };
  };

  // Determine which boundary is most likely the front (street-facing)
  const identifyFrontBoundary = (measurements: number[], coords?: PropertyCoordinate[]): number => {
    console.log('BoundaryMeasurements: Identifying front boundary', { measurements, coords });
    
    // For irregular properties (5+ sides), don't assume shortest is front
    if (measurements.length >= 5) {
      console.log('BoundaryMeasurements: Irregular property detected, using enhanced analysis');
      
      if (coords && coords.length === measurements.length) {
        return identifyFrontForIrregularProperty(measurements, coords);
             } else {
         // Without coordinates, for irregular properties, use smarter analysis
         console.log('BoundaryMeasurements: Irregular property without coordinates, using enhanced fallback');
         
         const sortedIndices = measurements
           .map((length, index) => ({ length, index }))
           .sort((a, b) => a.length - b.length);
         
         console.log('BoundaryMeasurements: Sorted measurements:', sortedIndices);
         
         // For irregular properties, avoid very short boundaries (likely utility easements)
         // and very long boundaries (likely rear boundaries)
         const minLength = sortedIndices[0].length;
         const maxLength = sortedIndices[sortedIndices.length - 1].length;
         const lengthRange = maxLength - minLength;
         
         // If there's a big variation in lengths, be more selective
         if (lengthRange > minLength * 2) {
           // Look for boundaries in the 15-50% range of lengths
           const candidates = sortedIndices.filter(item => {
             const ratio = (item.length - minLength) / lengthRange;
             return ratio >= 0.15 && ratio <= 0.5;
           });
           
           if (candidates.length > 0) {
             // From the candidates, prefer the first one (closest to shorter end)
             const frontCandidate = candidates[0];
             console.log('BoundaryMeasurements: Selected front from candidates:', frontCandidate);
             return frontCandidate.index;
           }
         }
         
         // Fallback: take boundary around 25th percentile
         const frontCandidateIndex = Math.floor(sortedIndices.length * 0.25);
         const frontCandidate = sortedIndices[frontCandidateIndex];
         
         console.log('BoundaryMeasurements: Fallback front candidate:', frontCandidate);
         return frontCandidate.index;
       }
    }
    
    // Method 1: Smart boundary selection for rectangular properties
    if (measurements.length === 4) {
      // For rectangular properties, use intelligent analysis
      const maxLength = Math.max(...measurements);
      const maxIndex = measurements.indexOf(maxLength);
      
      // For rectangular properties, front is usually top (0) or bottom (2)
      // If the longest boundary is a side (1 or 3), check if top/bottom are reasonable
      if (maxIndex === 1 || maxIndex === 3) {
        // Check if top or bottom boundaries are substantial (not tiny side access)
        const topLength = measurements[0];
        const bottomLength = measurements[2];
        const longestSide = Math.max(topLength, bottomLength);
        
        // If top or bottom is at least 60% of the longest side, prefer it as front
        if (longestSide >= maxLength * 0.6) {
          const frontIndex = bottomLength >= topLength ? 2 : 0; // Prefer bottom, then top
          console.log('BoundaryMeasurements: Using smart rectangular analysis, front boundary:', frontIndex);
          return frontIndex;
        }
      }
      
      console.log('BoundaryMeasurements: Using longest boundary as front:', maxIndex);
      return maxIndex;
    }
    
    // Method 2: If coordinates available, use geometric analysis for regular properties
    if (coords && coords.length === measurements.length) {
      // Find the most southern boundary (lowest latitude) - often the street-facing side
      let mostSouthernIndex = 0;
      let lowestLat = Infinity;
      
      for (let i = 0; i < coords.length; i++) {
        const currentPoint = coords[i];
        const nextPoint = coords[(i + 1) % coords.length];
        const midLat = (currentPoint.lat + nextPoint.lat) / 2;
        
        if (midLat < lowestLat) {
          lowestLat = midLat;
          mostSouthernIndex = i;
        }
      }
      
      console.log('BoundaryMeasurements: Using most southern boundary as front:', mostSouthernIndex);
      return mostSouthernIndex;
    }
    
    // Method 3: Fallback - use longest boundary (street frontage is typically longest)
    const longestIndex = measurements.indexOf(Math.max(...measurements));
    console.log('BoundaryMeasurements: Using longest boundary as front fallback:', longestIndex);
    return longestIndex;
  };

  // Enhanced front detection for irregular properties using coordinates
  const identifyFrontForIrregularProperty = (measurements: number[], coords: PropertyCoordinate[]): number => {
    console.log('BoundaryMeasurements: Analyzing irregular property for front boundary');
    
    const centroid = calculateCentroid(coords);
    let bestFrontIndex = 0;
    let bestScore = 0;
    
    // Analyze each boundary for "frontness"
    for (let i = 0; i < coords.length; i++) {
      const currentPoint = coords[i];
      const nextPoint = coords[(i + 1) % coords.length];
      const length = measurements[i];
      
      // Calculate boundary midpoint
      const midpoint = {
        lat: (currentPoint.lat + nextPoint.lat) / 2,
        lng: (currentPoint.lng + nextPoint.lng) / 2
      };
      
      // Calculate boundary orientation (angle)
      const boundaryAngle = calculateAngle(currentPoint, nextPoint);
      
      // Score factors for front boundary:
      let score = 0;
      
      // 1. Southern positioning (higher score for lower latitude)
      const maxLat = Math.max(...coords.map(c => c.lat));
      const minLat = Math.min(...coords.map(c => c.lat));
      const latRange = maxLat - minLat;
      if (latRange > 0) {
        const southernScore = (maxLat - midpoint.lat) / latRange;
        score += southernScore * 30; // 30% weight
      }
      
      // 2. Length factor - prefer medium lengths (not too short, not too long)
      const maxLength = Math.max(...measurements);
      const minLength = Math.min(...measurements);
      const lengthRange = maxLength - minLength;
      
      if (lengthRange > 0) {
        // Prefer boundaries that are 20-60% of the way from min to max length
        const lengthRatio = (length - minLength) / lengthRange;
        let lengthScore = 0;
        
        if (lengthRatio >= 0.2 && lengthRatio <= 0.6) {
          lengthScore = 1.0 - Math.abs(lengthRatio - 0.4) / 0.2; // Peak at 40%
        } else if (lengthRatio < 0.2) {
          lengthScore = lengthRatio / 0.2; // Linear increase to 20%
        } else {
          lengthScore = Math.max(0, (1.0 - lengthRatio) / 0.4); // Linear decrease from 60%
        }
        
        score += lengthScore * 25; // 25% weight
      }
      
      // 3. Orientation factor - prefer east-west oriented boundaries (more horizontal)
      const orientationScore = Math.abs(Math.sin(boundaryAngle * Math.PI / 180));
      score += orientationScore * 20; // 20% weight
      
      // 4. Distance from centroid - prefer boundaries closer to centroid (more accessible)
      const distanceFromCentroid = Math.sqrt(
        Math.pow(midpoint.lat - centroid.lat, 2) + 
        Math.pow(midpoint.lng - centroid.lng, 2)
      );
      
      const maxDistance = Math.max(...coords.map(coord => 
        Math.sqrt(Math.pow(coord.lat - centroid.lat, 2) + Math.pow(coord.lng - centroid.lng, 2))
      ));
      
      if (maxDistance > 0) {
        const proximityScore = 1 - (distanceFromCentroid / maxDistance);
        score += proximityScore * 25; // 25% weight
      }
      
      console.log(`BoundaryMeasurements: Boundary ${i} (${length}m) score: ${score.toFixed(2)}`);
      
      if (score > bestScore) {
        bestScore = score;
        bestFrontIndex = i;
      }
    }
    
    console.log(`BoundaryMeasurements: Selected boundary ${bestFrontIndex} as front with score ${bestScore.toFixed(2)}`);
    return bestFrontIndex;
  };

  // Automatically assign directions based on property geometry
  const autoAssignDirections = (measurements: number[], coords?: PropertyCoordinate[]): BoundaryMeasurement[] => {
    const frontIndex = identifyFrontBoundary(measurements, coords);
    
    if (coords && coords.length === measurements.length) {
      return autoAssignWithCoordinates(measurements, coords, frontIndex);
    } else {
      return autoAssignWithoutCoordinates(measurements, frontIndex);
    }
  };

  // Enhanced direction assignment using coordinate geometry
  const autoAssignWithCoordinates = (measurements: number[], coords: PropertyCoordinate[], frontIndex: number): BoundaryMeasurement[] => {
    const centroid = calculateCentroid(coords);
    const boundaries: BoundaryMeasurement[] = [];
    
    measurements.forEach((length, index) => {
      const currentPoint = coords[index];
      const nextPoint = coords[(index + 1) % coords.length];
      
      // Calculate the midpoint of this boundary
      const midpoint = {
        lat: (currentPoint.lat + nextPoint.lat) / 2,
        lng: (currentPoint.lng + nextPoint.lng) / 2
      };
      
      // Calculate angle from centroid to boundary midpoint
      const angleFromCenter = calculateAngle(centroid, midpoint);
      
      let direction = '';
      let isStreetFacing = false;
      
      if (index === frontIndex) {
        direction = 'front';
        isStreetFacing = true;
      } else {
        // Calculate relative position to front boundary
        const frontMidpoint = {
          lat: (coords[frontIndex].lat + coords[(frontIndex + 1) % coords.length].lat) / 2,
          lng: (coords[frontIndex].lng + coords[(frontIndex + 1) % coords.length].lng) / 2
        };
        
        const frontAngle = calculateAngle(centroid, frontMidpoint);
        const relativeAngle = ((angleFromCenter - frontAngle + 360) % 360);
        
        if (relativeAngle >= 45 && relativeAngle < 135) {
          direction = 'right';
        } else if (relativeAngle >= 135 && relativeAngle < 225) {
          direction = 'back';
        } else if (relativeAngle >= 225 && relativeAngle < 315) {
          direction = 'left';
        } else {
          // Close to front, determine if it's front-left or front-right
          direction = relativeAngle < 180 ? 'front-right' : 'front-left';
        }
      }
      
      boundaries.push({
        length,
        direction,
        isStreetFacing
      });
    });
    
    return boundaries;
  };

  // Fallback direction assignment without coordinates
  const autoAssignWithoutCoordinates = (measurements: number[], frontIndex: number): BoundaryMeasurement[] => {
    return measurements.map((length, index) => {
      let direction = '';
      let isStreetFacing = false;
      
      if (index === frontIndex) {
        direction = 'front';
        isStreetFacing = true;
      } else if (measurements.length === 4) {
        // Rectangular property - standard pattern
        const relativePosition = (index - frontIndex + 4) % 4;
        switch (relativePosition) {
          case 1: direction = 'right'; break;
          case 2: direction = 'back'; break;
          case 3: direction = 'left'; break;
          default: direction = 'front';
        }
      } else if (measurements.length === 3) {
        // Triangular property
        const relativePosition = (index - frontIndex + 3) % 3;
        switch (relativePosition) {
          case 1: direction = 'right'; break;
          case 2: direction = 'left'; break;
          default: direction = 'front';
        }
      } else {
        // Irregular property - use intelligent guessing
        if (measurements.length > 4) {
          const halfCount = Math.floor(measurements.length / 2);
          const relativePosition = (index - frontIndex + measurements.length) % measurements.length;
          
          if (relativePosition <= Math.floor(halfCount / 2)) {
            direction = 'right';
          } else if (relativePosition >= measurements.length - Math.floor(halfCount / 2)) {
            direction = 'left';
          } else {
            direction = 'back';
          }
        } else {
          direction = `side-${index + 1}`;
        }
      }
      
      return { length, direction, isStreetFacing };
    });
  };

  // Initialize boundary data with automatic direction detection
  useEffect(() => {
    const initializeBoundaries = () => {
      // Debug logging to understand the data structure
      console.log('BoundaryMeasurements: Initializing with data:', {
        measurements,
        coordinates,
        propertyData: propertyData ? {
          keys: Object.keys(propertyData),
          hasCoordinates: !!propertyData.coordinates,
          hasBoundaryPoints: !!propertyData.boundary_points,
          hasVertices: !!propertyData.vertices,
          hasPolygon: !!propertyData.polygon,
          hasGeometry: !!propertyData.geometry,
          sampleData: propertyData
        } : null
      });

      // Try to extract coordinates from various possible formats
      let finalCoordinates = coordinates;
      
      if (!finalCoordinates && propertyData) {
        // Try different property names that might contain coordinate data
        finalCoordinates = propertyData.coordinates || 
                          propertyData.boundary_points || 
                          propertyData.vertices || 
                          propertyData.polygon || 
                          propertyData.geometry?.coordinates || 
                          propertyData.boundary_coordinates;
        
        console.log('BoundaryMeasurements: Extracted coordinates from propertyData:', finalCoordinates);
      }

      const boundaries = autoAssignDirections(measurements, finalCoordinates);
      setBoundaryData(boundaries);
    };

    initializeBoundaries();
  }, [measurements, coordinates, propertyData]);

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
            <Home className="h-4 w-4" />
            Front Boundary Detection
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
          </div>
        </div>
        <p className="text-xs text-gray-600">
          Automatic identification of the street-facing property boundary
        </p>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {/* Front Boundary Identification Only */}
        <div className="text-center space-y-3">
          {boundaryData.find(b => b.isStreetFacing) ? (
            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
              <div className="flex items-center justify-center gap-3 mb-2">
                <div className="bg-blue-100 p-2 rounded-full">
                  <Home className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-blue-800">Front Boundary Identified</h3>
              </div>
              <p className="text-blue-700 text-sm">
                The street-facing boundary has been automatically detected and highlighted on the property map.
              </p>
              <div className="mt-3 inline-flex items-center gap-2 bg-blue-100 px-3 py-1 rounded-full text-xs font-medium text-blue-800">
                <span>🏠</span>
                <span>Front (Street)</span>
              </div>
            </div>
          ) : (
            <div className="bg-amber-50 border-2 border-amber-200 rounded-lg p-4">
              <div className="flex items-center justify-center gap-3 mb-2">
                <div className="bg-amber-100 p-2 rounded-full">
                  <AlertTriangle className="h-5 w-5 text-amber-600" />
                </div>
                <h3 className="text-lg font-semibold text-amber-800">Front Detection in Progress</h3>
              </div>
              <p className="text-amber-700 text-sm">
                Analyzing property boundaries to identify the street-facing side...
              </p>
            </div>
          )}

          {/* Simple Detection Method Info */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
            <div className="text-xs text-gray-600 space-y-1">
              <div><strong>Detection Method:</strong> {
                queenslandData 
                  ? 'Queensland Government Spatial Data'
                  : coordinates 
                    ? 'Geometric Analysis'
                    : 'Pattern-Based Analysis'
              }</div>
              <div><strong>Goal:</strong> Identify street-facing boundary for property orientation</div>
            </div>
          </div>

          {/* QLD Data Button */}
          {address && address.postcode.startsWith('4') && !queenslandData && (
            <Button
              variant="outline"
              onClick={loadQueenslandData}
              disabled={isLoadingQLD}
              className="w-full bg-green-50 hover:bg-green-100 text-green-700"
            >
              <Map className="h-4 w-4 mr-2" />
              {isLoadingQLD ? 'Loading QLD Data...' : 'Get Official QLD Boundary Data'}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}; 