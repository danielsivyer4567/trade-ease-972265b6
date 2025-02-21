import React from 'react';
import { Line, LineChart, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Card } from '@/components/ui/card';
import { Droplet } from 'lucide-react';
interface WeatherDataPoint {
  date: string;
  rainfall: number;
  rainChance: number;
  hasLightning: boolean;
  condition: 'sunny' | 'partly-cloudy' | 'cloudy' | 'rainy' | 'storm';
}
interface WeatherChartProps {
  selectedDate: Date | undefined;
  onRainyDateHighlight: (dates: string[], weatherData: WeatherDataPoint[]) => void;
}
export function WeatherChart({
  selectedDate,
  onRainyDateHighlight
}: WeatherChartProps) {
  // Enhanced mock weather data with more details
  const weatherData: WeatherDataPoint[] = [{
    date: '2024-03-18',
    rainfall: 0,
    rainChance: 5,
    hasLightning: false,
    condition: 'sunny'
  }, {
    date: '2024-03-19',
    rainfall: 5,
    rainChance: 40,
    hasLightning: false,
    condition: 'rainy'
  }, {
    date: '2024-03-20',
    rainfall: 12,
    rainChance: 80,
    hasLightning: true,
    condition: 'storm'
  }, {
    date: '2024-03-21',
    rainfall: 8,
    rainChance: 60,
    hasLightning: false,
    condition: 'rainy'
  }, {
    date: '2024-03-22',
    rainfall: 0,
    rainChance: 0,
    hasLightning: false,
    condition: 'sunny'
  }, {
    date: '2024-03-23',
    rainfall: 3,
    rainChance: 30,
    hasLightning: false,
    condition: 'partly-cloudy'
  }, {
    date: '2024-03-24',
    rainfall: 15,
    rainChance: 90,
    hasLightning: true,
    condition: 'storm'
  }];
  React.useEffect(() => {
    // Identify rainy dates (rainfall > 0)
    const rainyDates = weatherData.filter(data => data.rainfall > 0).map(data => data.date);
    onRainyDateHighlight(rainyDates, weatherData);
  }, [onRainyDateHighlight]);
  return;
}