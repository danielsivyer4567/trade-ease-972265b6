import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface WeatherChartProps {
  selectedDate: string;
  onRainyDateHighlight: (date: string) => void;
}

export function WeatherChart({ selectedDate, onRainyDateHighlight }: WeatherChartProps): JSX.Element {
  const data = [
    { date: '2024-03-01', precipitation: 20 },
    { date: '2024-03-02', precipitation: 45 },
    { date: '2024-03-03', precipitation: 30 },
    { date: '2024-03-04', precipitation: 60 },
    { date: '2024-03-05', precipitation: 15 },
    { date: '2024-03-06', precipitation: 25 },
    { date: '2024-03-07', precipitation: 50 },
  ];

  const handleMouseEnter = (data: any) => {
    if (data && data.payload && data.payload.precipitation > 40) {
      onRainyDateHighlight(data.payload.date);
    }
  };

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis label={{ value: 'Precipitation (%)', angle: -90, position: 'insideLeft' }} />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="precipitation"
            stroke="#8884d8"
            strokeWidth={2}
            dot={{ 
              fill: (entry: any) => entry.date === selectedDate ? '#ff0000' : '#8884d8',
              r: (entry: any) => entry.date === selectedDate ? 6 : 4
            }}
            onMouseEnter={handleMouseEnter}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
