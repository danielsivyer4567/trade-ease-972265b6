
import { AppLayout } from "@/components/ui/AppLayout";
import { BarChart as BarChartIcon, ArrowLeft } from "lucide-react";
import { KeyStatistics } from "@/components/statistics/KeyStatistics";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Line, ComposedChart } from 'recharts';
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const teamData = [
  {
    name: 'Red Team',
    gross: 145000,
    net: 98000,
    defects: 12,
    profitMargin: 67.6,
    color: '#ef4444'
  },
  {
    name: 'Blue Team',
    gross: 165000,
    net: 120000,
    defects: 8,
    profitMargin: 72.7,
    color: '#3b82f6'
  },
  {
    name: 'Green Team',
    gross: 158000,
    net: 110000,
    defects: 5,
    profitMargin: 69.6,
    color: '#22c55e'
  }
];

export default function StatisticsPage() {
  const navigate = useNavigate();
  
  return (
    <AppLayout>
      <div className="p-6 space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigate(-1)} 
              className="rounded-md border border-gray-300 px-3 py-1 bg-[#D3E4FD] hover:bg-[#B5D1F8] text-[#1E40AF] hover:text-[#1E3A8A]"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <BarChartIcon className="h-8 w-8 text-gray-700" />
            <h1 className="text-3xl font-bold">Business Statistics</h1>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Team Performance Overview</CardTitle>
            <CardDescription>Financial metrics and quality indicators by team</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={teamData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <YAxis yAxisId="profit" orientation="right" tickFormatter={(value) => `${value}%`} />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="gross" name="Gross Revenue ($)" fill="#8884d8" />
                  <Bar yAxisId="left" dataKey="net" name="Net Revenue ($)" fill="#82ca9d" />
                  <Bar yAxisId="right" dataKey="defects" name="Defect Tasks" fill="#ffc658" />
                  <Line 
                    yAxisId="profit" 
                    type="monotone" 
                    dataKey="profitMargin" 
                    name="Profit Margin (%)" 
                    stroke="#ff7300" 
                    strokeWidth={2}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {teamData.map((team) => (
            <Card key={team.name}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: team.color }} />
                  {team.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="space-y-2">
                  <div className="flex justify-between">
                    <dt className="font-medium text-gray-500">Gross Revenue</dt>
                    <dd className="text-gray-900">${team.gross.toLocaleString()}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="font-medium text-gray-500">Net Revenue</dt>
                    <dd className="text-gray-900">${team.net.toLocaleString()}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="font-medium text-gray-500">Profit Margin</dt>
                    <dd className="text-gray-900">{team.profitMargin.toFixed(1)}%</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="font-medium text-gray-500">Defect Tasks</dt>
                    <dd className={`font-medium ${
                      team.defects <= 5 ? 'text-green-600' : 
                      team.defects <= 10 ? 'text-yellow-600' : 
                      'text-red-600'
                    }`}>
                      {team.defects}
                    </dd>
                  </div>
                </dl>
              </CardContent>
            </Card>
          ))}
        </div>

        <KeyStatistics />
      </div>
    </AppLayout>
  );
}
