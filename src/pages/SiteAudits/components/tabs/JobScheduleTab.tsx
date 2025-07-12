
import React from "react";
import type { Job } from "@/types/job";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock, Play, Pause, Utensils } from "lucide-react";
import { Button } from "@/components/ui/button";

interface JobScheduleTabProps {
  job: Job;
  jobTimer: number;
  isTimerRunning: boolean;
  isOnBreak: boolean;
  handleTimerToggle: () => void;
  handleBreakToggle: () => void;
  locationHistory: Array<{
    timestamp: number;
    coords: [number, number];
  }>;
}

export function JobScheduleTab({
  job,
  jobTimer,
  isTimerRunning,
  isOnBreak,
  handleTimerToggle,
  handleBreakToggle,
  locationHistory
}: JobScheduleTabProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Schedule Details</h3>
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-500">{job.date}</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-2">Timer</h4>
              <div className="bg-gray-100 p-4 rounded-lg">
                <div className="text-2xl font-mono text-center mb-3">
                  {Math.floor(jobTimer / 3600).toString().padStart(2, '0')}:
                  {Math.floor(jobTimer % 3600 / 60).toString().padStart(2, '0')}:
                  {(jobTimer % 60).toString().padStart(2, '0')}
                </div>
                
                <div className="flex justify-center space-x-2">
                  <Button 
                    onClick={handleTimerToggle} 
                    variant={isTimerRunning ? "destructive" : "default"} 
                    size="sm"
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
                    size="sm"
                    disabled={!isTimerRunning}
                  >
                    <Utensils className="w-3 h-3 mr-1" />
                    {isOnBreak ? "End Break" : "Take Break"}
                  </Button>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Scheduled Times</h4>
              <div className="space-y-2">
                <div className="flex justify-between p-2 bg-gray-50 rounded">
                  <span>Scheduled Start:</span>
                  <span className="font-medium">10:00 AM</span>
                </div>
                <div className="flex justify-between p-2 bg-gray-50 rounded">
                  <span>Scheduled End:</span>
                  <span className="font-medium">4:00 PM</span>
                </div>
                <div className="flex justify-between p-2 bg-gray-50 rounded">
                  <span>Actual Time:</span>
                  <span className="font-medium">
                    {Math.floor(jobTimer / 3600)}h {Math.floor(jobTimer % 3600 / 60)}m
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
