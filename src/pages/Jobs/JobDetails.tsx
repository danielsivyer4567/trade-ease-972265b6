
import { useParams, useNavigate } from 'react-router-dom';
import { JobHeader } from './components/JobHeader';
import { JobTabs } from './components/JobTabs';
import { useState, useEffect } from 'react';
import type { Job } from '@/types/job';
import { DocumentApproval } from './components/DocumentApproval';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const mockJobs: Job[] = [
  {
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
  }
];

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
  const [extractedFinancialData, setExtractedFinancialData] = useState<any[]>([]);
  const isManager = true;

  useEffect(() => {
    if (!job) {
      navigate('/jobs');
    }
    
    // Fetch any existing financial data for this job
    const loadFinancialData = async () => {
      try {
        if (id) {
          const storageKey = `job-${id}-financial-data`;
          const storedData = JSON.parse(localStorage.getItem(storageKey) || '[]');
          if (storedData.length > 0) {
            setExtractedFinancialData(storedData);
          }
          
          // Also check Supabase for any stored financial data
          const { data, error } = await supabase
            .from('job_financial_data')
            .select('*')
            .eq('job_id', id);
            
          if (!error && data && data.length > 0) {
            // Format the data to match our expected structure
            const formattedData = data.map(item => ({
              ...item.extracted_data,
              id: item.id,
              status: item.status
            }));
            
            // Merge with local storage data
            const mergedData = [...storedData];
            
            // Add any items from Supabase that aren't in localStorage
            formattedData.forEach(item => {
              if (!mergedData.some(m => m.timestamp === item.timestamp)) {
                mergedData.push(item);
              }
            });
            
            setExtractedFinancialData(mergedData);
            localStorage.setItem(storageKey, JSON.stringify(mergedData));
          }
        }
      } catch (error) {
        console.error("Error loading financial data:", error);
      }
    };
    
    loadFinancialData();
  }, [job, navigate, id]);

  useEffect(() => {
    let timerInterval: number | null = null;
    
    if (isTimerRunning) {
      timerInterval = window.setInterval(() => {
        setJobTimer(prev => prev + 1);
      }, 1000);
    }
    
    return () => {
      if (timerInterval !== null) {
        clearInterval(timerInterval);
      }
    };
  }, [isTimerRunning]);

  const getLocation = () => {
    return new Promise<[number, number]>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          resolve([longitude, latitude]);
        },
        (error) => {
          console.error("Error getting location:", error);
          reject(error);
        }
      );
    });
  };

  const handleTimerToggle = async () => {
    if (hasLocationPermission === null) {
      try {
        const coords = await getLocation();
        setHasLocationPermission(true);
        setIsTimerRunning(true);
        
        setLocationHistory([{
          timestamp: Date.now(),
          coords: coords
        }]);
      } catch (error) {
        console.error("Error getting location permission:", error);
        setHasLocationPermission(false);
      }
    } else if (hasLocationPermission === false) {
      try {
        const coords = await getLocation();
        setHasLocationPermission(true);
        setIsTimerRunning(true);
        
        setLocationHistory([{
          timestamp: Date.now(),
          coords: coords
        }]);
      } catch (error) {
        console.error("Error getting location permission:", error);
        alert("Location permission is required to use the timer.");
      }
    } else {
      const newTimerState = !isTimerRunning;
      setIsTimerRunning(newTimerState);
      
      if (isTimerRunning) {
        try {
          const coords = await getLocation();
          setLocationHistory(prev => [
            ...prev,
            {
              timestamp: Date.now(),
              coords: coords
            }
          ]);
        } catch (error) {
          console.error("Error getting stop location:", error);
        }
      } else {
        try {
          const coords = await getLocation();
          setLocationHistory(prev => [
            ...prev,
            {
              timestamp: Date.now(),
              coords: coords
            }
          ]);
        } catch (error) {
          console.error("Error getting start location:", error);
        }
      }
    }
  };

  const handleBreakToggle = () => {
    setIsOnBreak(!isOnBreak);
  };
  
  const handleFinancialDataExtracted = (newData: any) => {
    setExtractedFinancialData(prev => [...prev, newData]);
    
    // Update localStorage
    if (id) {
      const storageKey = `job-${id}-financial-data`;
      const storedData = JSON.parse(localStorage.getItem(storageKey) || '[]');
      localStorage.setItem(storageKey, JSON.stringify([...storedData, newData]));
    }
    
    // Update job notes with the extracted financial data
    setTabNotes(prev => ({
      ...prev,
      financials: `${prev.financials || ''}\n\nExtracted amount of $${newData.amount.toFixed(2)} from document "${newData.source}" on ${new Date().toLocaleString()}`
    }));
    
    toast.success(`Financial data has been extracted and added to the job`);
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
        extractedFinancialData={extractedFinancialData}
      />
      
      {isManager && (
        <DocumentApproval 
          jobId={job.id} 
          onFinancialDataExtracted={handleFinancialDataExtracted} 
        />
      )}
    </div>
  );
}
