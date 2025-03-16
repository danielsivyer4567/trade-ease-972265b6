
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
      <div className="flex flex-col items-center space-y-6">
        <div className="text-4xl font-mono bg-slate-100 p-4 rounded-lg w-full text-center">
          {Math.floor(jobTimer / 3600).toString().padStart(2, '0')}:
          {Math.floor(jobTimer % 3600 / 60).toString().padStart(2, '0')}:
          {(jobTimer % 60).toString().padStart(2, '0')}
        </div>
        
        <div className="flex flex-col items-center space-y-4 w-full">
          {hasLocationPermission === false && 
            <div className="text-sm text-red-500 mb-2 p-2 bg-red-50 rounded-md w-full text-center">
              Location access is required to use the timer
            </div>
          }
          
          <div className={`flex items-center justify-center ${isMobile ? 'flex-col space-y-2' : 'space-x-4'} w-full`}>
            {hasLocationPermission === null || hasLocationPermission === false ? (
              <Button 
                onClick={handleTimerToggle} 
                variant="default" 
                className={`${isMobile ? 'w-full' : 'w-48'} bg-slate-700 hover:bg-slate-800`}
              >
                <MapPin className="w-4 h-4 mr-2" />
                Enable Location Access
              </Button>
            ) : (
              <>
                <Button 
                  onClick={handleTimerToggle} 
                  variant={isTimerRunning ? "destructive" : "default"} 
                  className={`${isMobile ? 'w-full' : 'w-32'} ${isTimerRunning ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}
                >
                  {isTimerRunning ? (
                    <>
                      <Pause className="w-4 h-4 mr-2" />
                      Stop
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Start
                    </>
                  )}
                </Button>
                
                <Button 
                  onClick={handleBreakToggle} 
                  variant={isOnBreak ? "outline" : "secondary"} 
                  className={`${isMobile ? 'w-full' : 'w-32'} ${isOnBreak ? 'bg-white border-2 border-amber-500 text-amber-600' : 'bg-amber-500 hover:bg-amber-600 text-white'}`}
                  disabled={!isTimerRunning}
                >
                  <Utensils className="w-4 h-4 mr-2" />
                  {isOnBreak ? "End Break" : "Break"}
                </Button>
              </>
            )}
          </div>
        </div>
        
        {locationHistory.length > 0 && (
          <div className="w-full mt-6 space-y-2 bg-slate-50 p-3 rounded-lg">
            <h3 className="font-medium text-lg">Location History</h3>
            <div className="border rounded-lg p-4 space-y-2 max-h-[200px] overflow-y-auto bg-white">
              {locationHistory.map((entry, index) => (
                <div key={index} className="flex items-center gap-2 text-sm text-gray-600 p-2 hover:bg-slate-50 rounded">
                  <MapPin className="w-4 h-4 text-slate-400" />
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
