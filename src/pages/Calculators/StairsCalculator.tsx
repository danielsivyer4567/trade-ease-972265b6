import React from "react";
import { AppLayout } from "@/components/ui/AppLayout";
import { SectionHeader } from "@/components/ui/SectionHeader";

const StairsCalculator = () => (
  <AppLayout>
    <div className="container mx-auto py-6 px-4">
      <SectionHeader title="Stairs Calculator" />
      <div className="mt-6 p-6 bg-white rounded shadow">
        {/* TODO: Implement stairs calculator UI here */}
        <p>This is the Stairs Calculator page.</p>
      </div>
    </div>
  </AppLayout>
);

export default StairsCalculator; 