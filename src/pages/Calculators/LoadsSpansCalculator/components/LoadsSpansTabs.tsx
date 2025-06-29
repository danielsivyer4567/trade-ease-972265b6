import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TabContents } from "./TabContents";

interface LoadsSpansTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const LoadsSpansTabs = ({ activeTab, setActiveTab }: LoadsSpansTabsProps) => {
  const tabs = [
    { id: "beam", label: "Beam" },
    { id: "rafter", label: "Rafter & Roof" },
    { id: "concrete", label: "Concrete" },
    { id: "squaring", label: "Squaring" },
    { id: "degrees", label: "Degrees" },
    { id: "stairs", label: "Stairs" },
    { id: "decking", label: "Decking" },
    { id: "hardie", label: "James Hardie" }
  ];

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <div className="overflow-x-auto pb-2">
        <TabsList className="grid min-w-max grid-cols-8 mb-6">
          {tabs.map((tab) => (
            <TabsTrigger key={tab.id} value={tab.id} className="text-sm">
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>
      
      {tabs.map((tab) => (
        <TabsContent key={tab.id} value={tab.id} className="space-y-4">
          <TabContents tabId={tab.id} />
        </TabsContent>
      ))}
    </Tabs>
  );
};
