
import React, { useState } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { WIND_LOAD_CATEGORIES } from "../../constants";
import { MapPin, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface WindLoadCardProps {
  windLoad: string;
  setWindLoad: (value: string) => void;
  calculateHardieRequirements: () => void;
}

export const WindLoadCard: React.FC<WindLoadCardProps> = ({
  windLoad,
  setWindLoad,
  calculateHardieRequirements
}) => {
  const [isLocating, setIsLocating] = useState(false);
  const [coordinates, setCoordinates] = useState<{lat: number; lng: number} | null>(null);
  const { toast } = useToast();

  // Function to determine wind category based on location
  // This is a simple demo implementation - in a real app, this would call an API
  const determineWindCategory = (lat: number, lng: number) => {
    // Sample logic - coastal proximity check
    // This is simplified and would need to be replaced with actual wind zone data
    const isCoastal = 
      // Australian east coast rough proximity
      (lng > 150 && lng < 155) || 
      // Western Australia coast
      (lng > 113 && lng < 120 && lat < -20) ||
      // Northern Territory coast
      (lng > 130 && lng < 138 && lat < -12);
    
    const isCyclonic = 
      // Northern Australia (rough cyclonic region)
      (lat > -30 && lat < -10 && lng > 120 && lng < 150);
    
    // Determine category based on rough location
    let category;
    if (isCyclonic) {
      if (lat > -15) {
        category = "C3"; // Severe cyclonic
      } else {
        category = "C1"; // Light cyclonic
      }
    } else if (isCoastal) {
      category = "N4"; // Coastal
    } else {
      category = "N2"; // Normal suburban
    }

    return WIND_LOAD_CATEGORIES.find(w => w.name === category) || WIND_LOAD_CATEGORIES[1];
  };

  const detectLocation = () => {
    setIsLocating(true);
    
    if (!navigator.geolocation) {
      toast({
        title: "Geolocation Error",
        description: "Geolocation is not supported by your browser",
        variant: "destructive"
      });
      setIsLocating(false);
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        
        setCoordinates({ lat, lng });
        
        // Determine appropriate wind category based on location
        const windCategory = determineWindCategory(lat, lng);
        setWindLoad(windCategory.kPa.toString());
        
        toast({
          title: "Location Detected",
          description: `Using ${windCategory.name} (${windCategory.description}) - ${windCategory.kPa} kPa`,
        });
        
        setIsLocating(false);
      },
      (error) => {
        let errorMessage = "Unknown error occurred";
        switch (error.code) {
          case 1:
            errorMessage = "Permission denied";
            break;
          case 2:
            errorMessage = "Position unavailable";
            break;
          case 3:
            errorMessage = "Timeout";
            break;
        }
        
        toast({
          title: "Geolocation Error",
          description: errorMessage,
          variant: "destructive"
        });
        
        setIsLocating(false);
      },
      { 
        enableHighAccuracy: false, 
        timeout: 10000, 
        maximumAge: 0 
      }
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Wind Load Configuration</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="wind-load">Wind Load (kPa)</Label>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-1">
              <Input
                id="wind-load"
                type="number"
                value={windLoad}
                onChange={(e) => setWindLoad(e.target.value)}
                min="0.5"
                max="7"
                step="0.5"
              />
            </div>
            <div className="md:col-span-2">
              <Select 
                onValueChange={(val) => setWindLoad(WIND_LOAD_CATEGORIES.find(w => w.name === val)?.kPa.toString() || windLoad)}
                value={WIND_LOAD_CATEGORIES.find(w => w.kPa.toString() === windLoad)?.name}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Or select wind category" />
                </SelectTrigger>
                <SelectContent>
                  {WIND_LOAD_CATEGORIES.map((category) => (
                    <SelectItem key={category.name} value={category.name}>
                      {category.name} - {category.description} ({category.kPa} kPa)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-1">
              <Button 
                onClick={detectLocation} 
                variant="outline" 
                className="w-full h-10"
                disabled={isLocating}
              >
                {isLocating ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <MapPin className="h-4 w-4 mr-2" />
                )}
                {isLocating ? "Detecting..." : "Detect Location"}
              </Button>
            </div>
          </div>
          {coordinates && (
            <p className="text-xs text-gray-500">
              Current location: {coordinates.lat.toFixed(4)}, {coordinates.lng.toFixed(4)}
            </p>
          )}
          <p className="text-sm text-gray-500 mt-1">
            Wind load affects fastening requirements and support spacing
          </p>
        </div>

        <Button 
          onClick={calculateHardieRequirements} 
          className="w-full mt-4 bg-amber-500 hover:bg-amber-600"
        >
          Calculate Requirements
        </Button>
      </CardContent>
    </Card>
  );
};
