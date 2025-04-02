
import React from 'react';
import { PieChart, BarChart, ResponsiveContainer, Pie, Cell, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

interface ChartData {
  name: string;
  value: number;
}

interface ExpenseChartsProps {
  data: ChartData[];
  chartType: 'pie' | 'bar';
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#a05195', '#d45087', '#f95d6a', '#ff7c43'];

const ExpenseCharts: React.FC<ExpenseChartsProps> = ({ data, chartType }) => {
  const renderChart = () => {
    if (chartType === 'pie') {
      return (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={true}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => `$${value}`} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      );
    }
    
    if (chartType === 'bar') {
      return (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip formatter={(value) => `$${value}`} />
            <Legend />
            <Bar dataKey="value" fill="#8884d8">
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      );
    }
    
    return null;
  };
  
  return (
    <div className="w-full h-[300px]">
      {data.length > 0 ? (
        renderChart()
      ) : (
        <div className="flex items-center justify-center h-full">
          <p className="text-muted-foreground">No data available</p>
        </div>
      )}
    </div>
  );
};

export default ExpenseCharts;
