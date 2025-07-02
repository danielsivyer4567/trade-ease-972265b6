interface PropertyCoordinate {
  lat: number;
  lng: number;
}

interface FrontBoundaryResult {
  frontIndex: number;
  confidence: number;
  reason: string;
}

/**
 * Unified front boundary identification algorithm
 * Combines multiple heuristics for accurate front boundary detection
 */
export const identifyFrontBoundary = (
  measurements: number[], 
  coords?: PropertyCoordinate[]
): FrontBoundaryResult => {
  console.log('PropertyBoundaryUtils: Identifying front boundary', { measurements, coords });
  
  // For irregular properties (5+ sides), use enhanced coordinate-based analysis
  if (measurements.length >= 5) {
    if (coords && coords.length === measurements.length) {
      return identifyFrontForIrregularProperty(measurements, coords);
    } else {
      return identifyFrontForIrregularPropertyFallback(measurements);
    }
  }
  
  // For rectangular properties (4 sides), use comprehensive analysis
  if (measurements.length === 4) {
    return identifyFrontForRectangularProperty(measurements, coords);
  }
  
  // For triangular properties (3 sides), use basic analysis
  if (measurements.length === 3) {
    return identifyFrontForTriangularProperty(measurements, coords);
  }
  
  // Fallback for other cases
  const longestIndex = measurements.indexOf(Math.max(...measurements));
  return {
    frontIndex: longestIndex,
    confidence: 0.3,
    reason: 'Fallback: longest boundary'
  };
};

/**
 * Front boundary identification for rectangular properties
 */
const identifyFrontForRectangularProperty = (
  measurements: number[], 
  coords?: PropertyCoordinate[]
): FrontBoundaryResult => {
  // If coordinates available, use southern preference + access analysis
  if (coords && coords.length === 4) {
    return identifyFrontWithCoordinateAnalysis(measurements, coords);
  }
  
  // Without coordinates, use intelligent length-based analysis
  const [length1, length2, length3, length4] = measurements;
  
  // Group parallel sides
  const side1 = { length: length1, index: 0 }; // Top
  const side2 = { length: length2, index: 1 }; // Right  
  const side3 = { length: length3, index: 2 }; // Bottom
  const side4 = { length: length4, index: 3 }; // Left
  
  const horizontalSides = [side1, side3]; // Top and bottom
  const verticalSides = [side2, side4];   // Right and left
  
  // Strategy 1: Look for typical street frontage patterns
  const maxLength = Math.max(...measurements);
  const minLength = Math.min(...measurements);
  const lengthRatio = maxLength / minLength;
  
  // If there's a clear longest boundary (> 1.5x others), it's likely street frontage
  if (lengthRatio > 1.5) {
    const longestIndex = measurements.indexOf(maxLength);
    
    // Prefer horizontal boundaries (top/bottom) for front
    if (longestIndex === 0 || longestIndex === 2) {
      return {
        frontIndex: longestIndex,
        confidence: 0.8,
        reason: 'Longest horizontal boundary (typical street frontage)'
      };
    }
    
    // If longest is vertical, check if horizontal boundaries are reasonable
    const longerHorizontal = horizontalSides.reduce((prev, curr) => 
      prev.length > curr.length ? prev : curr
    );
    
    if (longerHorizontal.length >= maxLength * 0.6) {
      return {
        frontIndex: longerHorizontal.index,
        confidence: 0.7,
        reason: 'Substantial horizontal boundary preferred over longest vertical'
      };
    }
    
    return {
      frontIndex: longestIndex,
      confidence: 0.6,
      reason: 'Longest boundary (vertical street frontage)'
    };
  }
  
  // Strategy 2: For similar-length boundaries, prefer bottom then top
  const longerHorizontal = horizontalSides.reduce((prev, curr) => 
    prev.length > curr.length ? prev : curr
  );
  
  return {
    frontIndex: longerHorizontal.index === 0 ? 2 : longerHorizontal.index, // Prefer bottom (2) over top (0)
    confidence: 0.5,
    reason: 'Bottom boundary preferred (typical Australian lot orientation)'
  };
};

/**
 * Front boundary identification using coordinate analysis
 */
const identifyFrontWithCoordinateAnalysis = (
  measurements: number[], 
  coords: PropertyCoordinate[]
): FrontBoundaryResult => {
  let bestFrontIndex = 0;
  let bestScore = 0;
  
  for (let i = 0; i < coords.length; i++) {
    const currentPoint = coords[i];
    const nextPoint = coords[(i + 1) % coords.length];
    const length = measurements[i];
    
    // Calculate boundary midpoint
    const midpoint = {
      lat: (currentPoint.lat + nextPoint.lat) / 2,
      lng: (currentPoint.lng + nextPoint.lng) / 2
    };
    
    let score = 0;
    
    // Factor 1: Southern positioning (40% weight) - most properties front south
    const maxLat = Math.max(...coords.map(c => c.lat));
    const minLat = Math.min(...coords.map(c => c.lat));
    const latRange = maxLat - minLat;
    if (latRange > 0) {
      const southernScore = (maxLat - midpoint.lat) / latRange;
      score += southernScore * 40;
    }
    
    // Factor 2: Length appropriateness (35% weight) - not too short, reasonable for access
    const maxLength = Math.max(...measurements);
    const minLength = Math.min(...measurements);
    const lengthRange = maxLength - minLength;
    
    if (lengthRange > 0) {
      // Prefer boundaries that are substantial but not necessarily longest
      const lengthRatio = (length - minLength) / lengthRange;
      let lengthScore = 0;
      
      if (lengthRatio >= 0.6) {
        lengthScore = 1.0; // Strong preference for longer boundaries
      } else if (lengthRatio >= 0.3) {
        lengthScore = 0.8; // Good for medium boundaries
      } else {
        lengthScore = lengthRatio / 0.3 * 0.4; // Reduced score for short boundaries
      }
      
      score += lengthScore * 35;
    }
    
    // Factor 3: Orientation preference (25% weight) - prefer east-west orientation
    const boundaryAngle = calculateAngle(currentPoint, nextPoint);
    const orientationScore = Math.abs(Math.cos(boundaryAngle * Math.PI / 180));
    score += orientationScore * 25;
    
    if (score > bestScore) {
      bestScore = score;
      bestFrontIndex = i;
    }
  }
  
  const confidence = Math.min(bestScore / 100, 0.95);
  
  return {
    frontIndex: bestFrontIndex,
    confidence,
    reason: `Coordinate analysis (score: ${bestScore.toFixed(1)})`
  };
};

/**
 * Front boundary identification for irregular properties with coordinates
 */
const identifyFrontForIrregularProperty = (
  measurements: number[], 
  coords: PropertyCoordinate[]
): FrontBoundaryResult => {
  const centroid = calculateCentroid(coords);
  let bestFrontIndex = 0;
  let bestScore = 0;
  
  for (let i = 0; i < coords.length; i++) {
    const currentPoint = coords[i];
    const nextPoint = coords[(i + 1) % coords.length];
    const length = measurements[i];
    
    const midpoint = {
      lat: (currentPoint.lat + nextPoint.lat) / 2,
      lng: (currentPoint.lng + nextPoint.lng) / 2
    };
    
    const boundaryAngle = calculateAngle(currentPoint, nextPoint);
    let score = 0;
    
    // Factor 1: Southern positioning (30% weight)
    const maxLat = Math.max(...coords.map(c => c.lat));
    const minLat = Math.min(...coords.map(c => c.lat));
    const latRange = maxLat - minLat;
    if (latRange > 0) {
      const southernScore = (maxLat - midpoint.lat) / latRange;
      score += southernScore * 30;
    }
    
    // Factor 2: Length suitability (30% weight) - avoid very short and very long
    const maxLength = Math.max(...measurements);
    const minLength = Math.min(...measurements);
    const lengthRange = maxLength - minLength;
    
    if (lengthRange > 0) {
      const lengthRatio = (length - minLength) / lengthRange;
      let lengthScore = 0;
      
      // Sweet spot for front boundaries: 20-70% of length range
      if (lengthRatio >= 0.2 && lengthRatio <= 0.7) {
        lengthScore = 1.0 - Math.abs(lengthRatio - 0.45) / 0.25;
      } else if (lengthRatio < 0.2) {
        lengthScore = lengthRatio / 0.2 * 0.3; // Penalty for very short
      } else {
        lengthScore = Math.max(0, (1.0 - lengthRatio) / 0.3 * 0.5); // Penalty for very long
      }
      
      score += lengthScore * 30;
    }
    
    // Factor 3: Orientation (25% weight) - prefer horizontal orientation
    const orientationScore = Math.abs(Math.cos(boundaryAngle * Math.PI / 180));
    score += orientationScore * 25;
    
    // Factor 4: Accessibility (15% weight) - prefer boundaries closer to centroid
    const distanceFromCentroid = Math.sqrt(
      Math.pow(midpoint.lat - centroid.lat, 2) + 
      Math.pow(midpoint.lng - centroid.lng, 2)
    );
    
    const maxDistance = Math.max(...coords.map(coord => 
      Math.sqrt(Math.pow(coord.lat - centroid.lat, 2) + Math.pow(coord.lng - centroid.lng, 2))
    ));
    
    if (maxDistance > 0) {
      const accessibilityScore = 1 - (distanceFromCentroid / maxDistance);
      score += accessibilityScore * 15;
    }
    
    if (score > bestScore) {
      bestScore = score;
      bestFrontIndex = i;
    }
  }
  
  const confidence = Math.min(bestScore / 100, 0.9);
  
  return {
    frontIndex: bestFrontIndex,
    confidence,
    reason: `Irregular property analysis (score: ${bestScore.toFixed(1)})`
  };
};

/**
 * Fallback for irregular properties without coordinates
 */
const identifyFrontForIrregularPropertyFallback = (measurements: number[]): FrontBoundaryResult => {
  const sortedIndices = measurements
    .map((length, index) => ({ length, index }))
    .sort((a, b) => a.length - b.length);
  
  const minLength = sortedIndices[0].length;
  const maxLength = sortedIndices[sortedIndices.length - 1].length;
  const lengthRange = maxLength - minLength;
  
  // For irregular properties, look for medium-length boundaries (good for access)
  if (lengthRange > minLength * 2) {
    const candidates = sortedIndices.filter(item => {
      const ratio = (item.length - minLength) / lengthRange;
      return ratio >= 0.25 && ratio <= 0.65; // Sweet spot for access
    });
    
    if (candidates.length > 0) {
      const frontCandidate = candidates[0]; // First suitable candidate
      return {
        frontIndex: frontCandidate.index,
        confidence: 0.6,
        reason: 'Medium-length boundary suitable for access'
      };
    }
  }
  
  // Fallback: 30th percentile boundary
  const frontCandidateIndex = Math.floor(sortedIndices.length * 0.3);
  const frontCandidate = sortedIndices[frontCandidateIndex];
  
  return {
    frontIndex: frontCandidate.index,
    confidence: 0.4,
    reason: '30th percentile boundary (irregular property fallback)'
  };
};

/**
 * Front boundary identification for triangular properties
 */
const identifyFrontForTriangularProperty = (
  measurements: number[], 
  coords?: PropertyCoordinate[]
): FrontBoundaryResult => {
  if (coords && coords.length === 3) {
    // Use coordinate analysis for triangular properties
    return identifyFrontWithCoordinateAnalysis(measurements, coords);
  }
  
  // Without coordinates, use longest boundary (likely street frontage)
  const longestIndex = measurements.indexOf(Math.max(...measurements));
  return {
    frontIndex: longestIndex,
    confidence: 0.7,
    reason: 'Longest boundary (triangular lot street frontage)'
  };
};

/**
 * Calculate angle between two coordinate points
 */
const calculateAngle = (p1: PropertyCoordinate, p2: PropertyCoordinate): number => {
  const deltaLng = p2.lng - p1.lng;
  const deltaLat = p2.lat - p1.lat;
  return Math.atan2(deltaLat, deltaLng) * (180 / Math.PI);
};

/**
 * Calculate the centroid of property coordinates
 */
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