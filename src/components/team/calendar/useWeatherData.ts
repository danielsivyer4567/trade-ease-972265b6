
import { useState, useEffect } from 'react';
import { RainData } from './WeatherDisplay';
import WeatherService from '@/services/WeatherService';
import { useToast } from '@/hooks/use-toast';

export const useWeatherData = () => {
  const [weatherDates, setWeatherDates] = useState<RainData[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const { toast } = useToast();

  // Default location (Brisbane, QLD) - in a real app, this would come from user settings
  const defaultLocation = { lat: -27.4698, lon: 153.0251 };

  const fetchWeatherData = async () => {
    try {
      setLoading(true);
      const forecast = await WeatherService.getWeatherForecast(
        defaultLocation.lat, 
        defaultLocation.lon, 
        14 // Get 14 days of forecast
      );

      const weatherDatesData: RainData[] = forecast.map(day => ({
        date: day.date,
        rainfall: day.conditions.precipitation,
        temperature: Math.round(day.conditions.temperature),
        rainChance: Math.round(day.conditions.precipitation),
        hasLightning: day.conditions.condition.toLowerCase().includes('storm') || 
                     day.conditions.condition.toLowerCase().includes('thunder'),
        condition: getWeatherCondition(day.conditions.condition, day.conditions.precipitation),
        amount: day.conditions.precipitation
      }));

      setWeatherDates(weatherDatesData);
      setLastUpdate(new Date());

      // Check for weather alerts and show notifications
      const alerts = await WeatherService.getWeatherAlerts(defaultLocation.lat, defaultLocation.lon);
      alerts.forEach(alert => {
        if (alert.severity === 'severe' || alert.severity === 'extreme') {
          toast({
            title: `Weather Alert: ${alert.title}`,
            description: alert.description,
            variant: 'destructive'
          });
        }
      });

    } catch (error) {
      console.error('Failed to fetch weather data:', error);
      // Fall back to mock data
      setWeatherDates([
        {
          date: new Date().toISOString().split('T')[0],
          rainfall: 0,
          temperature: 26,
          rainChance: 20,
          hasLightning: false,
          condition: 'partly-cloudy',
          amount: 0
        },
        {
          date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          rainfall: 5,
          temperature: 24,
          rainChance: 60,
          hasLightning: false,
          condition: 'rainy',
          amount: 5
        },
        {
          date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          rainfall: 15,
          temperature: 21,
          rainChance: 85,
          hasLightning: true,
          condition: 'storm',
          amount: 15
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getWeatherCondition = (condition: string, precipitation: number): RainData['condition'] => {
    const lowerCondition = condition.toLowerCase();
    
    if (lowerCondition.includes('storm') || lowerCondition.includes('thunder')) {
      return 'storm';
    }
    if (precipitation > 10 || lowerCondition.includes('rain')) {
      return 'rainy';
    }
    if (precipitation > 0 || lowerCondition.includes('cloud')) {
      return 'cloudy';
    }
    if (lowerCondition.includes('partly') || lowerCondition.includes('partial')) {
      return 'partly-cloudy';
    }
    return 'sunny';
  };

  // Fetch weather data on component mount and set up periodic updates
  useEffect(() => {
    fetchWeatherData();
    
    // Update weather data every 30 minutes
    const interval = setInterval(fetchWeatherData, 30 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  return {
    weatherDates,
    setWeatherDates,
    loading,
    lastUpdate,
    refreshWeatherData: fetchWeatherData
  };
};
