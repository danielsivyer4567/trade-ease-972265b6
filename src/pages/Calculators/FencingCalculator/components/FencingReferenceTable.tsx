
import React from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";

interface FencingReferenceTableProps {
  FENCING_COMPONENTS_PER_10M: Record<string, any>;
}

export const FencingReferenceTable: React.FC<FencingReferenceTableProps> = ({ 
  FENCING_COMPONENTS_PER_10M
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Fence Types Reference</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-emerald-50">
                <th className="p-2 text-left border">Fence Type</th>
                <th className="p-2 text-center border">Palings (100x16mm)</th>
                <th className="p-2 text-center border">Panels</th>
                <th className="p-2 text-center border">Post Height</th>
                <th className="p-2 text-center border">Posts</th>
                <th className="p-2 text-center border">Rails (75x38mm)</th>
                <th className="p-2 text-center border">Nails</th>
                <th className="p-2 text-center border">Screws</th>
                <th className="p-2 text-center border">Rapid Set</th>
                <th className="p-2 text-center border">Caps</th>
                <th className="p-2 text-center border">Sleepers</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(FENCING_COMPONENTS_PER_10M)
                .filter(([key]) => !["picket", "privacy", "chain-link", "post-rail"].includes(key))
                .map(([type, data], index) => (
                  <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="p-2 border">{type}</td>
                    <td className="p-2 text-center border">{data.palings}</td>
                    <td className="p-2 text-center border">{data.panels}</td>
                    <td className="p-2 text-center border">{data.postHeight}</td>
                    <td className="p-2 text-center border">{data.posts}</td>
                    <td className="p-2 text-center border">{data.rails}</td>
                    <td className="p-2 text-center border">{data.nails}</td>
                    <td className="p-2 text-center border">{data.screws}</td>
                    <td className="p-2 text-center border">{data.rapidSets}</td>
                    <td className="p-2 text-center border">{data.caps || "-"}</td>
                    <td className="p-2 text-center border">{data.sleepers || "-"}</td>
                  </tr>
                ))}
            </tbody>
          </table>
          <p className="text-xs text-gray-500 mt-2">
            Note: The values above are for 10 meters of fencing. The calculator will scale these values based on your fence length.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
