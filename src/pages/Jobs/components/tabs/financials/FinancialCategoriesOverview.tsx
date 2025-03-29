
import { Card, CardContent } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Briefcase, Box, FilePlus, Receipt, AlertTriangle } from "lucide-react";

interface FinancialCategoriesOverviewProps {
  financialTotals: {
    invoiced: number;
    variations: number;
    subcontractors: number;
    materials: number;
    unexpected: number;
  };
}

export const FinancialCategoriesOverview = ({ financialTotals }: FinancialCategoriesOverviewProps) => {
  return (
    <div className="mb-6">
      <SectionHeader 
        title="Financial Overview" 
        description="Summary of all financial categories for this job" 
      />
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mt-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Receipt className="h-5 w-5 text-blue-600 mr-2" />
                <h3 className="font-medium text-blue-800">Invoiced</h3>
              </div>
              <span className="text-lg font-bold text-blue-700">${financialTotals.invoiced.toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <FilePlus className="h-5 w-5 text-purple-600 mr-2" />
                <h3 className="font-medium text-purple-800">Variations</h3>
              </div>
              <span className="text-lg font-bold text-purple-700">${financialTotals.variations.toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Briefcase className="h-5 w-5 text-amber-600 mr-2" />
                <h3 className="font-medium text-amber-800">Subcontractors</h3>
              </div>
              <span className="text-lg font-bold text-amber-700">${financialTotals.subcontractors.toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Box className="h-5 w-5 text-green-600 mr-2" />
                <h3 className="font-medium text-green-800">Materials</h3>
              </div>
              <span className="text-lg font-bold text-green-700">${financialTotals.materials.toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
                <h3 className="font-medium text-red-800">Unexpected</h3>
              </div>
              <span className="text-lg font-bold text-red-700">${financialTotals.unexpected.toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
