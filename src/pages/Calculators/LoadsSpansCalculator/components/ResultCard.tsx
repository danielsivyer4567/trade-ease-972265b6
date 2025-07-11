import React from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";

interface ResultCardProps {
  spanResult: string | null;
}

export const ResultCard: React.FC<ResultCardProps> = ({ spanResult }) => {
  if (!spanResult) return null;
  
  return (
    <Card className="bg-slate-300">
      <CardHeader>
        <CardTitle className="text-blue-800">Span Calculation Result</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="p-4 bg-white rounded-lg shadow-sm text-white">
                      <p className="text-2xl font-bold text-blue-600">{spanResult}</p>
        </div>
      </CardContent>
    </Card>
  );
};
