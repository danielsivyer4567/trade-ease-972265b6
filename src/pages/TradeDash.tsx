
import React from 'react';
import { BaseLayout } from "@/components/ui/BaseLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Users, CircleDollarSign, CheckCircle } from 'lucide-react';

const data = [{
  name: 'Jan',
  earnings: 4000,
  expenses: 2400,
  profit: 1600
}, {
  name: 'Feb',
  earnings: 3000,
  expenses: 1398,
  profit: 1602
}, {
  name: 'Mar',
  earnings: 2000,
  expenses: 1800,
  profit: 200
}, {
  name: 'Apr',
  earnings: 2780,
  expenses: 1908,
  profit: 872
}, {
  name: 'May',
  earnings: 1890,
  expenses: 1800,
  profit: 90
}, {
  name: 'Jun',
  earnings: 2390,
  expenses: 1800,
  profit: 590
}, {
  name: 'Jul',
  earnings: 3490,
  expenses: 2300,
  profit: 1190
}];

const TradeDash = () => {
  return (
    <BaseLayout>
      {/* Content goes here */}
    </BaseLayout>
  );
};

export default TradeDash;
