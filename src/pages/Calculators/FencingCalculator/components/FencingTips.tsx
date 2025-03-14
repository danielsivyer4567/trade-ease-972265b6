
import React from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";

export const FencingTips = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Fencing Tips</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium mb-2">Installation Considerations:</h3>
            <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
              <li>Check local building codes and regulations before starting</li>
              <li>Call utilities to mark underground lines before digging</li>
              <li>Start and end your fence with a post, not a panel</li>
              <li>For sloped terrain, consider step-down or racked fencing</li>
              <li>Set posts in concrete for stability</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium mb-2">Material Selection:</h3>
            <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
              <li>Choose pressure-treated wood for longer life</li>
              <li>Consider vinyl for low-maintenance options</li>
              <li>Metal posts can provide better stability than wood</li>
              <li>For decorative elements, add post caps and finials</li>
              <li>Choose gate hardware based on gate weight and usage</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
