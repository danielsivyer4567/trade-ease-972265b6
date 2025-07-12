
import { useState } from 'react';

export const useJobLocation = () => {
  const [hasLocationPermission, setHasLocationPermission] = useState<boolean | null>(null);
  const [locationHistory, setLocationHistory] = useState<Array<{timestamp: number; coords: [number, number]}>>([]);

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

  const handleTimerToggle = async (isTimerRunning: boolean, setIsTimerRunning: (isRunning: boolean) => void) => {
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

  return {
    hasLocationPermission,
    locationHistory,
    handleTimerToggle
  };
};
