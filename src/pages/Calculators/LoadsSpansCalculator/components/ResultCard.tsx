
import React from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";

interface ResultCardProps {
  spanResult: string | null;
}

export const ResultCard: React.FC<ResultCardProps> = ({ spanResult }) => {
  if (!spanResult) return null;
  
  return (
    <Card className="bg-amber-50 border-amber-200">
      <CardHeader>
        <CardTitle className="text-amber-800">Span Calculation Result</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="p-4 bg-white rounded-lg shadow-sm">
          <p className="text-2xl font-bold text-amber-600">{spanResult}</p>
        </div>
      </CardContent>
    </Card>
  );
};
