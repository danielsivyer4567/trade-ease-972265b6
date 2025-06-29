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
  coordinates,
  streetFacing,
  propertyData 
}) => {
  const [boundaryData, setBoundaryData] = useState<BoundaryMeasurement[]>([]);
  const [editMode, setEditMode] = useState(false);

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
    
    // Method 1: Use the shortest boundary (common for regular residential lots)
    const shortestIndex = measurements.indexOf(Math.min(...measurements));
    
    // Method 2: If coordinates available, use geometric analysis for regular properties
    if (coords && coords.length === measurements.length) {
      // For rectangular properties, prefer southern boundary if it's reasonably short
      const shortestScore = 0.7;
      let bestIndex = shortestIndex;
      let bestScore = shortestScore;
      
      // Find the most southern boundary (lowest latitude)
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
      
      // If the most southern boundary is within reasonable range, prefer it
      const southernScore = 0.8;
      if (mostSouthernIndex !== shortestIndex) {
        const southernLength = measurements[mostSouthernIndex];
        const shortestLength = measurements[shortestIndex];
        
        // If southern boundary is within 100% of shortest, prefer it
        if (southernLength <= shortestLength * 2.0) {
          bestIndex = mostSouthernIndex;
          bestScore = southernScore;
        }
      }
      
      console.log('BoundaryMeasurements: Regular property front boundary analysis:', {
        shortestIndex,
        mostSouthernIndex,
        bestIndex,
        bestScore
      });
      
      return bestIndex;
    }
    
    // Method 3: For properties without coordinates, use intelligent defaults
    if (measurements.length === 4) {
      const sortedIndices = measurements
        .map((length, index) => ({ length, index }))
        .sort((a, b) => a.length - b.length);
      
      const shortestTwo = sortedIndices.slice(0, 2);
      const longestTwo = sortedIndices.slice(2, 4);
      const avgShort = (shortestTwo[0].length + shortestTwo[1].length) / 2;
      const avgLong = (longestTwo[0].length + longestTwo[1].length) / 2;
      
      if (avgLong > avgShort * 1.5) {
        return shortestTwo[0].index;
      }
    }
    
    console.log('BoundaryMeasurements: Using shortest boundary as front:', shortestIndex);
    return shortestIndex;
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
            <Compass className="h-4 w-4" />
            Property Boundary Measurements
          </CardTitle>
          <div className="flex gap-2">
            {!coordinates && measurements.length >= 5 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  // Quick fix: For irregular properties without coordinates, 
                  // try one of the longer boundaries as front
                  const sortedByLength = measurements
                    .map((length, index) => ({ length, index }))
                    .sort((a, b) => b.length - a.length);
                  
                  // Try the 3rd or 4th longest (avoiding the very longest which might be rear)
                  const candidateIndex = sortedByLength.length > 4 ? 3 : 1;
                  const newFrontIndex = sortedByLength[candidateIndex].index;
                  
                  // Manually set this boundary as front and reassign all others
                  const newBoundaries = measurements.map((length, index) => {
                    if (index === newFrontIndex) {
                      return { length, direction: 'front', isStreetFacing: true };
                    } else {
                      // Clear previous front assignments and use generic labels
                      return { length, direction: `side-${index + 1}`, isStreetFacing: false };
                    }
                  });
                  setBoundaryData(newBoundaries);
                }}
                className="text-xs bg-amber-50 hover:bg-amber-100 text-amber-700"
              >
                Try Longer Front
              </Button>
            )}
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

        {/* Automatic Direction Detection Info */}
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <Label className="text-xs font-medium text-green-800 mb-2 block">🎯 Automatic Direction Detection:</Label>
          <div className="text-xs text-green-700 space-y-1">
            <div><strong>Property Type:</strong> {
              boundaryData.length === 3 ? 'Triangular' :
              boundaryData.length === 4 ? 'Rectangular' :
              'Irregular'
            } ({boundaryData.length} sides)</div>
                         <div><strong>Detection Method:</strong> {
               coordinates 
                 ? (measurements.length >= 5 ? 'Advanced Irregular Property Analysis' : 'Enhanced (coordinate geometry)')
                 : 'Standard (pattern-based analysis)'
             }</div>
             <div><strong>Front Identification:</strong> {
               measurements.length >= 5 
                 ? (coordinates 
                     ? 'Multi-factor scoring: position, length, orientation, accessibility' 
                     : 'Medium-length boundary analysis (avoiding utility boundaries)')
                 : (coordinates 
                     ? 'Geometric analysis with street positioning' 
                     : 'Shortest boundary (typical for residential lots)')
             }</div>
            <div><strong>Direction Assignment:</strong> Left/Right relative to standing at front boundary</div>
                     {!coordinates && (
               <div className="text-amber-600 mt-1">
                 <strong>💡 Enhancement:</strong> Coordinate data would enable more precise direction detection
                 <br />
                 <span className="text-xs">
                   • Check "View Raw JSON Response" below for coordinate data in the API response
                   <br />
                   • Use "Try Longer Front" button for irregular properties with incorrect front detection
                   <br />
                   • Use "Edit Directions" to manually assign any boundary directions
                 </span>
               </div>
             )}
          </div>
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