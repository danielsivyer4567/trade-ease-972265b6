
import React from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";

export const AboutCalculator: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>About the Loads and Spans Calculator</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p>
          This calculator helps you determine the maximum load capacity and deflection of timber beams based on their dimensions, material properties, and span length.
        </p>
        <p>
          <strong>How it works:</strong> The calculator uses engineering principles to estimate the load-bearing capacity and deflection of beams under different load conditions.
        </p>
        <p>
          <strong>Span Table Calculator:</strong> The span table feature provides quick reference for standard timber and James Hardie material dimensions, helping you determine maximum allowable spans based on industry standards.
        </p>
        <p>
          <strong>Important notes:</strong>
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>This calculator provides estimates only and should not replace professional engineering advice for critical structures.</li>
          <li>Always consult local building codes and regulations when designing structural elements.</li>
          <li>The calculations use simplified beam theory and don't account for all real-world variables.</li>
          <li>A safety factor of 2.5 is applied to determine the safe working load.</li>
          <li>The span table calculations include adjustments for span type and load conditions.</li>
        </ul>
      </CardContent>
    </Card>
  );
};
