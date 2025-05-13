import React from 'react';
import { Settings } from "lucide-react";
import SettingsPageTemplate from "./SettingsPageTemplate";
import PropertySearch from "@/components/PropertySearch";

export default function PropertySearchSettings() {
  return (
    <SettingsPageTemplate 
      title="Property Search" 
      icon={<Settings className="h-7 w-7 text-gray-700" />}
    >
      <div className="max-w-3xl">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Property Boundary Search</h2>
          <p className="text-gray-600 mb-6">
            Search for property boundaries in Brisbane using the ArcGIS service.
          </p>
          
          <PropertySearch />
        </div>
      </div>
    </SettingsPageTemplate>
  );
} 