
import React from 'react';
import { Line, LineChart, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Card } from '@/components/ui/card';
import { WaterDrop } from 'lucide-react';

interface WeatherDataPoint {
  date: string;
  rainfall: number;
}

interface WeatherChartProps {
  selectedDate: Date | undefined;
  onRainyDateHighlight: (dates: string[]) => void;
}

export function WeatherChart({ selectedDate, onRainyDateHighlight }: WeatherChartProps) {
  // Mock weather data - in a real app, this would come from a weather API
  const weatherData: WeatherDataPoint[] = [
    { date: '2024-03-18', rainfall: 0 },
    { date: '2024-03-19', rainfall: 5 },
    { date: '2024-03-20', rainfall: 12 },
    { date: '2024-03-21', rainfall: 8 },
    { date: '2024-03-22', rainfall: 0 },
    { date: '2024-03-23', rainfall: 3 },
    { date: '2024-03-24', rainfall: 15 },
  ];

  React.useEffect(() => {
    // Identify rainy dates (rainfall > 0)
    const rainyDates = weatherData
      .filter(data => data.rainfall > 0)
      .map(data => data.date);
    onRainyDateHighlight(rainyDates);
  }, [onRainyDateHighlight]);

  return (
    <Card className="p-4">
      <div className="flex items-center gap-2 mb-4">
        <WaterDrop className="h-5 w-5 text-blue-500" />
        <h3 className="font-semibold text-gray-900">Weekly Rainfall Forecast</h3>
      </div>
      <div className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={weatherData}>
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12 }}
              tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { weekday: 'short' })}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              label={{ 
                value: 'Rainfall (mm)', 
                angle: -90, 
                position: 'insideLeft',
                style: { fontSize: 12 }
              }}
            />
            <Tooltip 
              formatter={(value: number) => [`${value}mm`, 'Rainfall']}
              labelFormatter={(date) => new Date(date).toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            />
            <Line 
              type="monotone" 
              dataKey="rainfall" 
              stroke="#3B82F6" 
              strokeWidth={2}
              dot={{ fill: '#3B82F6' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
