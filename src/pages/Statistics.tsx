
import { AppLayout } from "@/components/ui/AppLayout";
import { BarChart as BarChartIcon } from "lucide-react";
import { KeyStatistics } from "@/components/statistics/KeyStatistics";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const teamData = [
  {
    name: 'Red Team',
    gross: 145000,
    net: 98000,
    invoiced: 168000,
    defects: 12,
    color: '#ef4444'
  },
  {
    name: 'Blue Team',
    gross: 165000,
    net: 120000,
    invoiced: 182000,
    defects: 8,
    color: '#3b82f6'
  },
  {
    name: 'Green Team',
    gross: 158000,
    net: 110000,
    invoiced: 175000,
    defects: 5,
    color: '#22c55e'
  }
];

export default function StatisticsPage() {
  return (
    <AppLayout>
      <div className="p-6 space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
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
                <BarChart
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
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="invoiced" name="Total Invoiced ($)" fill="#9333ea" />
                  <Bar yAxisId="left" dataKey="gross" name="Gross Revenue ($)" fill="#8884d8" />
                  <Bar yAxisId="left" dataKey="net" name="Net Revenue ($)" fill="#82ca9d" />
                  <Bar yAxisId="right" dataKey="defects" name="Defect Tasks" fill="#ffc658" />
                </BarChart>
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
                    <dt className="font-medium text-gray-500">Total Invoiced</dt>
                    <dd className="text-gray-900">${team.invoiced.toLocaleString()}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="font-medium text-gray-500">Gross Revenue</dt>
                    <dd className="text-gray-900">${team.gross.toLocaleString()}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="font-medium text-gray-500">Net Revenue</dt>
                    <dd className="text-gray-900">${team.net.toLocaleString()}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="font-medium text-gray-500">Collection Rate</dt>
                    <dd className="text-gray-900">
                      {Math.round((team.gross / team.invoiced) * 100)}%
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="font-medium text-gray-500">Profit Margin</dt>
                    <dd className="text-gray-900">
                      {Math.round((team.net / team.gross) * 100)}%
                    </dd>
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
