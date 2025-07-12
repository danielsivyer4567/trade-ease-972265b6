
import { TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { MapPin, Play, Pause, Utensils } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface JobTimerTabProps {
  jobTimer: number;
  hasLocationPermission: boolean | null;
  handleTimerToggle: () => void;
  handleBreakToggle: () => void;
  isTimerRunning: boolean;
  isOnBreak: boolean;
  locationHistory: Array<{
    timestamp: number;
    coords: [number, number];
  }>;
}

export const JobTimerTab = ({
  jobTimer,
  hasLocationPermission,
  handleTimerToggle,
  handleBreakToggle,
  isTimerRunning,
  isOnBreak,
  locationHistory
}: JobTimerTabProps) => {
  const isMobile = useIsMobile();
  
  return (
    <TabsContent value="timer" className="space-y-4 bg-white p-4 rounded-lg shadow-sm border border-gray-100">
      <div className="flex flex-col items-center space-y-4">
        {/* Compact timer display */}
        <div className="text-2xl font-mono bg-slate-100 py-2 px-3 rounded-lg w-full text-center">
          {Math.floor(jobTimer / 3600).toString().padStart(2, '0')}:
          {Math.floor(jobTimer % 3600 / 60).toString().padStart(2, '0')}:
          {(jobTimer % 60).toString().padStart(2, '0')}
        </div>
        
        <div className="flex flex-col items-center space-y-3 w-full">
          {hasLocationPermission === false && 
            <div className="text-xs text-red-500 mb-1 p-1.5 bg-red-50 rounded-md w-full text-center">
              Location access required
            </div>
          }
          
          <div className={`flex items-center justify-center ${isMobile ? 'flex-col space-y-2' : 'space-x-2'} w-full`}>
            {hasLocationPermission === null || hasLocationPermission === false ? (
              <Button 
                onClick={handleTimerToggle} 
                variant="default" 
                className={`${isMobile ? 'w-full' : 'w-auto'} bg-slate-700 hover:bg-slate-800 text-xs py-1 px-2 h-8`}
              >
                <MapPin className="w-3 h-3 mr-1" />
                Enable Location
              </Button>
            ) : (
              <>
                <Button 
                  onClick={handleTimerToggle} 
                  variant={isTimerRunning ? "destructive" : "default"} 
                  className={`${isMobile ? 'w-full' : 'w-auto'} ${isTimerRunning ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'} text-xs py-1 px-2 h-8`}
                >
                  {isTimerRunning ? (
                    <>
                      <Pause className="w-3 h-3 mr-1" />
                      Stop
                    </>
                  ) : (
                    <>
                      <Play className="w-3 h-3 mr-1" />
                      Start
                    </>
                  )}
                </Button>
                
                <Button 
                  onClick={handleBreakToggle} 
                  variant={isOnBreak ? "outline" : "secondary"} 
                  className={`${isMobile ? 'w-full' : 'w-auto'} ${isOnBreak ? 'bg-white border-2 border-amber-500 text-amber-600' : 'bg-amber-500 hover:bg-amber-600 text-white'} text-xs py-1 px-2 h-8`}
                  disabled={!isTimerRunning}
                >
                  <Utensils className="w-3 h-3 mr-1" />
                  {isOnBreak ? "End" : "Break"}
                </Button>
              </>
            )}
          </div>
        </div>
        
        {locationHistory.length > 0 && (
          <div className="w-full mt-2 space-y-1 bg-slate-50 p-2 rounded-lg">
            <h3 className="font-medium text-sm">Location History</h3>
            <div className="border rounded-lg p-2 space-y-1 max-h-[150px] overflow-y-auto bg-white">
              {locationHistory.map((entry, index) => (
                <div key={index} className="flex items-center gap-1 text-xs text-gray-600 p-1 hover:bg-slate-50 rounded">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  <span>
                    {new Date(entry.timestamp).toLocaleTimeString()}: {entry.coords[0].toFixed(6)}, {entry.coords[1].toFixed(6)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </TabsContent>
  );
};
