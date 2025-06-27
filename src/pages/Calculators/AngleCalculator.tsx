import React from "react";
import { AppLayout } from "@/components/ui/AppLayout";
import { SectionHeader } from "@/components/ui/SectionHeader";

const AngleCalculator = () => (
  <AppLayout>
    <div className="container mx-auto py-6 px-4">
      <SectionHeader title="Angle Calculator" />
      <div className="mt-6 p-6 bg-white rounded shadow">
        {/* TODO: Implement angle calculator UI here */}
        <p>This is the Angle Calculator page.</p>
      </div>
    </div>
  </AppLayout>
);

export default AngleCalculator; 