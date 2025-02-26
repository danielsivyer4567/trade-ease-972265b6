
import { TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { MapPin, Play, Pause, Utensils } from "lucide-react";

interface JobTimerTabProps {
  jobTimer: number;
  hasLocationPermission: boolean | null;
  handleTimerToggle: () => void;
  handleBreakToggle: () => void;
  isTimerRunning: boolean;
  isOnBreak: boolean;
  locationHistory: Array<{timestamp: number; coords: [number, number]}>;
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
  return (
    <TabsContent value="timer" className="space-y-4">
      <div className="flex flex-col items-center space-y-6">
        <div className="text-4xl font-mono">
          {Math.floor(jobTimer / 3600).toString().padStart(2, '0')}:
          {Math.floor((jobTimer % 3600) / 60).toString().padStart(2, '0')}:
          {(jobTimer % 60).toString().padStart(2, '0')}
        </div>
        <div className="flex flex-col items-center space-y-4">
          {!hasLocationPermission && (
            <div className="text-sm text-red-500 mb-2">
              Location access is required to use the timer
            </div>
          )}
          <div className="flex items-center justify-center space-x-4">
            {!hasLocationPermission ? (
              <Button
                onClick={handleTimerToggle}
                variant="default"
                className="w-48"
              >
                <MapPin className="w-4 h-4 mr-2" />
                Enable Location Access
              </Button>
            ) : (
              <>
                <Button
                  onClick={handleTimerToggle}
                  variant={isTimerRunning ? "destructive" : "default"}
                  className="w-32"
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
                  className="w-32"
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
          <div className="w-full mt-6 space-y-2">
            <h3 className="font-medium text-lg">Location History</h3>
            <div className="border rounded-lg p-4 space-y-2 max-h-[200px] overflow-y-auto">
              {locationHistory.map((entry, index) => (
                <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span>
                    {new Date(entry.timestamp).toLocaleTimeString()}: {entry.coords[1].toFixed(6)}, {entry.coords[0].toFixed(6)}
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
