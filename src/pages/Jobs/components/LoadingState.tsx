
import React from "react";
import { AppLayout } from "@/components/ui/AppLayout";

export function LoadingState() {
  return (
    <AppLayout>
      <div className="p-6 flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-lg">Checking authentication...</p>
        </div>
      </div>
    </AppLayout>
  );
}
