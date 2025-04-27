import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Trash2, Clock } from "lucide-react";

export interface CalculationRecord {
  id: string;
  timestamp: number;
  calculatorType: string;
  inputs: Record<string, any>;
  results: Record<string, any>;
}

interface CalculationHistoryProps {
  calculations: CalculationRecord[];
  onDelete: (id: string) => void;
  onRestore: (calculation: CalculationRecord) => void;
}

export function CalculationHistory({ calculations, onDelete, onRestore }: CalculationHistoryProps) {
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Calculation History
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          {calculations.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No calculations yet
            </p>
          ) : (
            <div className="space-y-4">
              {calculations.map((calc) => (
                <Card key={calc.id} className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-medium">{calc.calculatorType}</h3>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(calc.timestamp)}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onRestore(calc)}
                      >
                        Restore
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(calc.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <h4 className="text-sm font-medium">Inputs:</h4>
                      <pre className="text-xs bg-muted p-2 rounded">
                        {JSON.stringify(calc.inputs, null, 2)}
                      </pre>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">Results:</h4>
                      <pre className="text-xs bg-muted p-2 rounded">
                        {JSON.stringify(calc.results, null, 2)}
                      </pre>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
} 