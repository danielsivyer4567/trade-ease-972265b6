
import { AppLayout } from "@/components/ui/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useParams } from "react-router-dom";
import type { Job } from "@/types/job";
import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { JobHeader } from "./components/JobHeader";
import { JobTabs } from "./components/JobTabs";

const mockJobs: Job[] = [{
  id: "1",
  customer: "John Smith",
  type: "Plumbing Repair",
  status: "in-progress",
  date: "Today",
  location: [151.2093, -33.8688],
  address: "123 Main Street, Sydney NSW 2000",
  jobNumber: "PLM-001",
  title: "Emergency Pipe Repair",
  description: "Fix leaking pipe in basement",
  assignedTeam: "Red Team",
  assignedMemberId: "RT-001"
}];

export default function JobDetails() {
  const { id } = useParams();
  const { toast } = useToast();
  const job = mockJobs.find(j => j.id === id);
  const isManager = true;

  const [jobTimer, setJobTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isOnBreak, setIsOnBreak] = useState(false);
  const [jobNotes, setJobNotes] = useState("");
  const [tabNotes, setTabNotes] = useState<Record<string, string>>({
    bills: "",
    costs: "",
    invoices: "",
    purchase_orders: "",
    financials: ""
  });
  const [locationHistory, setLocationHistory] = useState<{timestamp: number; coords: [number, number]}[]>([]);
  const [hasLocationPermission, setHasLocationPermission] = useState<boolean | null>(null);

  useEffect(() => {
    checkLocationPermission();
  }, []);

  useEffect(() => {
    let interval: number | undefined;

    if (isTimerRunning && !isOnBreak) {
      interval = window.setInterval(() => {
        setJobTimer(prev => prev + 1);
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isTimerRunning, isOnBreak]);

  const checkLocationPermission = async () => {
    if (!navigator.geolocation) {
      setHasLocationPermission(false);
      return;
    }

    try {
      const permission = await navigator.permissions.query({ name: 'geolocation' });
      setHasLocationPermission(permission.state === 'granted');
      
      permission.addEventListener('change', () => {
        setHasLocationPermission(permission.state === 'granted');
      });
    } catch (error) {
      navigator.geolocation.getCurrentPosition(
        () => setHasLocationPermission(true),
        () => setHasLocationPermission(false)
      );
    }
  };

  const getCurrentLocation = (action: string) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation = {
            timestamp: Date.now(),
            coords: [position.coords.longitude, position.coords.latitude] as [number, number]
          };
          setLocationHistory(prev => [...prev, newLocation]);
          toast({
            title: action,
            description: `Location recorded: ${position.coords.latitude.toFixed(6)}, ${position.coords.longitude.toFixed(6)}`
          });
        },
        (error) => {
          toast({
            title: "Location Error",
            description: "Could not get current location. Please enable location services.",
            variant: "destructive"
          });
          console.error("Location error:", error);
        }
      );
    }
  };

  const handleTimerToggle = () => {
    if (!hasLocationPermission) {
      requestLocationPermission();
      return;
    }

    setIsTimerRunning(!isTimerRunning);
    if (!isTimerRunning) {
      getCurrentLocation("Timer started");
    } else {
      getCurrentLocation("Timer stopped");
    }
  };

  const handleBreakToggle = () => {
    setIsOnBreak(!isOnBreak);
    if (!isOnBreak) {
      getCurrentLocation("Break started");
    } else {
      getCurrentLocation("Break ended");
    }
  };

  const requestLocationPermission = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        () => {
          setHasLocationPermission(true);
          toast({
            title: "Location Access Granted",
            description: "You can now start the timer.",
          });
        },
        (error) => {
          setHasLocationPermission(false);
          toast({
            title: "Location Access Required",
            description: "Please enable location services to use the timer.",
            variant: "destructive"
          });
        }
      );
    }
  };

  if (!job) {
    return (
      <AppLayout>
        <div className="p-6">
          <h1 className="text-2xl font-bold text-red-600">Job not found</h1>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        <JobHeader job={job} />

        <Card>
          <CardHeader className="space-y-4">
            <div className="text-center">
              <CardTitle className="text-2xl mb-2">
                {job.title || job.type}
                <span className="text-sm font-mono text-gray-500 ml-2">#{job.jobNumber}</span>
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <JobTabs
              job={job}
              isManager={isManager}
              jobTimer={jobTimer}
              jobNotes={jobNotes}
              setJobNotes={setJobNotes}
              tabNotes={tabNotes}
              setTabNotes={setTabNotes}
              locationHistory={locationHistory}
              hasLocationPermission={hasLocationPermission}
              handleTimerToggle={handleTimerToggle}
              handleBreakToggle={handleBreakToggle}
              isTimerRunning={isTimerRunning}
              isOnBreak={isOnBreak}
            />
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
