
import React, { useState } from "react";
import { AppLayout } from "@/components/ui/AppLayout";
import { Link } from "react-router-dom";
import { ArrowLeft, Ruler } from "lucide-react";
import { Card } from "@/components/ui/card";
import { LoadsSpansHeader } from "./LoadsSpansHeader";
import { LoadsSpansTabs } from "./LoadsSpansTabs";
import { useIsMobile } from "@/hooks/use-mobile";

const LoadsSpansCalculator = () => {
  const [activeTab, setActiveTab] = useState("beam");
  const isMobile = useIsMobile();

  return (
    <AppLayout>
      <div className="container mx-auto p-4 md:p-6">
        <div className="flex items-center gap-2 mb-6">
          <Link to="/calculators" className="hover:text-blue-500">
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <Ruler className="h-8 w-8 text-blue-500" />
          <h1 className="text-3xl font-bold">Loads & Spans Calculator</h1>
        </div>
        
        <Card className="bg-white p-4 md:p-6 rounded-lg shadow">
          <LoadsSpansHeader />
          <LoadsSpansTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        </Card>
      </div>
    </AppLayout>
  );
};

export default LoadsSpansCalculator;
