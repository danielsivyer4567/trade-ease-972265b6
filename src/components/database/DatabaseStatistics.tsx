
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Database as DatabaseIcon, FileText, CreditCard, Briefcase, List, CheckSquare } from "lucide-react";

type StatisticItem = {
  entity_type: string;
  count: number;
};

export function DatabaseStatistics() {
  const [statistics, setStatistics] = useState<StatisticItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadStatistics() {
      try {
        setLoading(true);

        // Call the function to calculate and store current counts
        await supabase.rpc('calculate_database_statistics');

        // Fetch the latest statistics with proper typing
        const { data, error } = await supabase
          .from('statistics_history')
          .select('entity_type, count')
          .eq('count_date', new Date().toISOString().split('T')[0]);

        if (error) throw error;
        
        if (data) {
          // Explicitly transform the data to match the StatisticItem type
          const typedStatistics: StatisticItem[] = data.map(item => ({
            entity_type: item.entity_type as string,
            count: item.count as number
          }));
          setStatistics(typedStatistics);
        }
      } catch (err: any) {
        console.error('Error loading statistics:', err);
        setError('Failed to load database statistics');
      } finally {
        setLoading(false);
      }
    }
    
    loadStatistics();
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case 'invoices':
        return <FileText className="h-5 w-5 text-blue-500" />;
      case 'payments':
        return <CreditCard className="h-5 w-5 text-green-500" />;
      case 'payrolls':
        return <Briefcase className="h-5 w-5 text-purple-500" />;
      case 'price_list_items':
        return <List className="h-5 w-5 text-yellow-500" />;
      case 'todos':
        return <CheckSquare className="h-5 w-5 text-red-500" />;
      default:
        return <DatabaseIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const getDisplayName = (type: string) => {
    switch (type) {
      case 'invoices':
        return 'Invoices';
      case 'payments':
        return 'Payments';
      case 'payrolls':
        return 'Payroll Runs';
      case 'price_list_items':
        return 'Price List Items';
      case 'todos':
        return 'Todo Items';
      default:
        return type.charAt(0).toUpperCase() + type.slice(1);
    }
  };

  if (error) {
    return (
      <Card className="bg-red-50">
        <CardContent className="pt-6">
          <p className="text-red-600">Error: {error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Database Statistics</h2>
      
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5].map(i => (
            <Card key={i} className="bg-slate-100 animate-pulse">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg h-6 bg-slate-200 rounded"></CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-slate-200 rounded w-16"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-100">
          {statistics.length === 0 ? (
            <p className="text-gray-500 col-span-full">No statistics available</p>
          ) : (
            statistics.map(stat => (
              <Card key={stat.entity_type} className="bg-slate-100 hover:shadow-md transition-shadow">
                <CardHeader className="pb-2 bg-slate-200">
                  <CardTitle className="text-lg flex items-center gap-2">
                    {getIcon(stat.entity_type)}
                    {getDisplayName(stat.entity_type)}
                  </CardTitle>
                </CardHeader>
                <CardContent className="bg-slate-200">
                  <p className="text-3xl font-bold text-gray-800">{stat.count.toLocaleString()}</p>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
}
