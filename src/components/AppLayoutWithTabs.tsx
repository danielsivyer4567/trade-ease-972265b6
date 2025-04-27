import React from "react";
import { TabsProvider } from "@/contexts/TabsContext";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "sonner";
import { Analytics } from "@vercel/analytics/react";
import { Outlet } from "react-router-dom";

export function AppLayoutWithTabs() {
  return (
    <TabsProvider>
      <Outlet />
      <Toaster />
      <SonnerToaster position="bottom-right" closeButton richColors />
      <Analytics />
    </TabsProvider>
  );
} 