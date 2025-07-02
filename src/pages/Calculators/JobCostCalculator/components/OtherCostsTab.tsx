import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users2, Calculator, AlertTriangle } from 'lucide-react';
import { SubcontractorsInput } from './SubcontractorsInput';
import { OverheadRiskInput } from './OverheadRiskInput';
import { SubcontractorItem, OverheadItem, RiskItem } from '../types';

interface OtherCostsTabProps {
  subcontractors: SubcontractorItem[];
  overhead: OverheadItem[];
  risks: RiskItem[];
  onSubcontractorsChange: (subcontractors: SubcontractorItem[]) => void;
  onOverheadChange: (overhead: OverheadItem[]) => void;
  onRisksChange: (risks: RiskItem[]) => void;
  subtotal: number;
}

export const OtherCostsTab: React.FC<OtherCostsTabProps> = ({
  subcontractors,
  overhead,
  risks,
  onSubcontractorsChange,
  onOverheadChange,
  onRisksChange,
  subtotal
}) => {
  return (
    <Tabs defaultValue="subcontractors" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="subcontractors">
          <Users2 className="h-4 w-4 mr-2" />
          Subcontractors
        </TabsTrigger>
        <TabsTrigger value="overhead-risk">
          <Calculator className="h-4 w-4 mr-2" />
          Overhead & Risk
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="subcontractors" className="mt-4">
        <SubcontractorsInput
          subcontractors={subcontractors}
          onChange={onSubcontractorsChange}
        />
      </TabsContent>
      
      <TabsContent value="overhead-risk" className="mt-4">
        <OverheadRiskInput
          overhead={overhead}
          risks={risks}
          onOverheadChange={onOverheadChange}
          onRisksChange={onRisksChange}
          subtotal={subtotal}
        />
      </TabsContent>
    </Tabs>
  );
}; 