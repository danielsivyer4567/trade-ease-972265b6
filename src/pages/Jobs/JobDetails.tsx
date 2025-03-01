
import { useParams, useNavigate } from 'react-router-dom';
import { JobHeader } from './components/JobHeader';
import { JobTabs } from './components/JobTabs';
import { useState, useEffect } from 'react';
import type { Job } from '@/types/job';

const mockJobs: Job[] = [{
  id: "1",
  customer: "John Smith",
  type: "Plumbing",
  status: "ready",
  date: "2024-03-15",
  location: [151.2093, -33.8688],
  jobNumber: "PLM-001",
  title: "Water Heater Installation",
  description: "Install new water heater system",
  assignedTeam: "Red Team"
}, {
  id: "2",
  customer: "Sarah Johnson",
  type: "HVAC",
  status: "in-progress",
  date: "2024-03-14",
  location: [151.2543, -33.8688],
  jobNumber: "HVAC-001",
  title: "HVAC Maintenance",
  description: "Regular maintenance check",
  assignedTeam: "Blue Team"
}, {
  id: "3",
  customer: "Mike Brown",
  type: "Electrical",
  status: "to-invoice",
  date: "2024-03-13",
  location: [151.1943, -33.8788],
  jobNumber: "ELE-001",
  title: "Electrical Panel Upgrade",
  description: "Upgrade main electrical panel",
  assignedTeam: "Green Team"
}];

export function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const job = mockJobs.find(j => j.id === id);
  const [jobTimer, setJobTimer] = useState(0);
  const [hasLocationPermission, setHasLocationPermission] = useState<boolean | null>(null);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isOnBreak, setIsOnBreak] = useState(false);
  const [locationHistory, setLocationHistory] = useState<Array<{timestamp: number; coords: [number, number]}>>([]);
  const [jobNotes, setJobNotes] = useState("");
  const [tabNotes, setTabNotes] = useState<Record<string, string>>({});
  const isManager = true;

  useEffect(() => {
    if (!job) {
      navigate('/jobs');
    }
  }, [job, navigate]);

  // Implement timer functionality
  useEffect(() => {
    let timerInterval: number | null = null;
    
    if (isTimerRunning) {
      timerInterval = window.setInterval(() => {
        setJobTimer(prev => prev + 1);
        
        // Capture location data if we have permission and not on break
        if (hasLocationPermission === true && !isOnBreak) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const { latitude, longitude } = position.coords;
              setLocationHistory(prev => [
                ...prev,
                {
                  timestamp: Date.now(),
                  coords: [longitude, latitude]
                }
              ]);
            },
            (error) => {
              console.error("Error getting location:", error);
              setHasLocationPermission(false);
            }
          );
        }
      }, 1000);
    }
    
    return () => {
      if (timerInterval !== null) {
        clearInterval(timerInterval);
      }
    };
  }, [isTimerRunning, hasLocationPermission, isOnBreak]);

  const handleTimerToggle = () => {
    if (hasLocationPermission === null) {
      // Request permission when user tries to start timer
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setHasLocationPermission(true);
          setIsTimerRunning(true);
          // Add initial location to history
          const { latitude, longitude } = position.coords;
          setLocationHistory([{
            timestamp: Date.now(),
            coords: [longitude, latitude]
          }]);
        },
        (error) => {
          console.error("Error getting location permission:", error);
          setHasLocationPermission(false);
        }
      );
    } else if (hasLocationPermission === false) {
      // Try requesting permission again
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setHasLocationPermission(true);
          setIsTimerRunning(true);
          // Add initial location to history
          const { latitude, longitude } = position.coords;
          setLocationHistory([{
            timestamp: Date.now(),
            coords: [longitude, latitude]
          }]);
        },
        (error) => {
          console.error("Error getting location permission:", error);
          alert("Location permission is required to use the timer.");
        }
      );
    } else {
      // Toggle timer state when we already have permission
      setIsTimerRunning(!isTimerRunning);
    }
  };

  const handleBreakToggle = () => {
    setIsOnBreak(!isOnBreak);
  };

  if (!job) {
    return null;
  }

  return (
    <div className="space-y-6 p-6">
      <JobHeader job={job} />
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
    </div>
  );
}
