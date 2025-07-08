import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GlassCard } from "@/components/ui/GlassCard";
import { LucideIcon } from "lucide-react";

// Import the unified color palette from ChartCard
import { chartColors } from "./ChartCard";

interface MapCardProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  iconColor?: string;
  backgroundGradient?: string;
  children: React.ReactNode;
  className?: string;
  height?: string;
  actions?: React.ReactNode;
}

export function MapCard({ 
  title, 
  description, 
  icon: Icon, 
  iconColor = "text-blue-600",
  backgroundGradient = "from-blue-50 to-indigo-50",
  children, 
  className = "",
  height = "h-[400px]",
  actions
}: MapCardProps) {
  return (
    <GlassCard className={`border-0 shadow-lg relative ${className}`}>
      <CardHeader className={`bg-gradient-to-r ${backgroundGradient} border-b border-gray-100 relative z-10`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {Icon && (
              <div className="p-2 bg-white rounded-lg shadow-sm">
                <Icon className={`h-5 w-5 ${iconColor}`} />
              </div>
            )}
            <div>
              <CardTitle className="text-xl font-semibold text-gray-900">{title}</CardTitle>
              {description && (
                <CardDescription className="text-gray-600">{description}</CardDescription>
              )}
            </div>
          </div>
          {actions && (
            <div className="flex items-center gap-2">
              {actions}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-0 relative">
        <div className={`w-full ${height} relative overflow-hidden map-container`}>
          {children}
        </div>
      </CardContent>
    </GlassCard>
  );
}

// Custom styles for map info windows
export const mapInfoWindowStyle = {
  backgroundColor: 'white',
  borderRadius: '8px',
  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -1px rgb(0 0 0 / 0.06)',
  border: `1px solid ${chartColors.border}`,
  padding: '0'
};

// Custom marker styles
export const mapMarkerStyles = {
  default: {
    path: 'M12 0C5.383 0 0 5.383 0 12s5.383 12 12 12 12-5.383 12-12S18.617 0 12 0zm0 19c-3.859 0-7-3.141-7-7s3.141-7 7-7 7 3.141 7 7-3.141 7-7 7z',
    fillColor: chartColors.primary,
    fillOpacity: 1,
    strokeColor: 'white',
    strokeWeight: 2,
    scale: 1
  },
  active: {
    path: 'M12 0C5.383 0 0 5.383 0 12s5.383 12 12 12 12-5.383 12-12S18.617 0 12 0zm0 19c-3.859 0-7-3.141-7-7s3.141-7 7-7 7 3.141 7 7-3.141 7-7 7z',
    fillColor: chartColors.accent,
    fillOpacity: 1,
    strokeColor: 'white',
    strokeWeight: 3,
    scale: 1.2
  },
  warning: {
    path: 'M12 0C5.383 0 0 5.383 0 12s5.383 12 12 12 12-5.383 12-12S18.617 0 12 0zm0 19c-3.859 0-7-3.141-7-7s3.141-7 7-7 7 3.141 7 7-3.141 7-7 7z',
    fillColor: chartColors.warning,
    fillOpacity: 1,
    strokeColor: 'white',
    strokeWeight: 2,
    scale: 1
  }
};

// Error state component for maps
export function MapErrorState({ 
  title, 
  description, 
  icon: Icon, 
  onRetry 
}: { 
  title: string; 
  description: string; 
  icon?: LucideIcon; 
  onRetry?: () => void; 
}) {
  return (
    <div className="h-full flex items-center justify-center p-8 relative z-10">
      <div className="text-center max-w-md">
        <div className="p-4 bg-red-50 rounded-full w-16 h-16 mx-auto mb-4">
          {Icon && <Icon className="h-8 w-8 text-red-600 mx-auto mt-2" />}
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-4">{description}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
}

// Loading state component for maps
export function MapLoadingState({ message = "Loading map..." }: { message?: string }) {
  return (
    <div className="h-full flex items-center justify-center p-8 relative z-10">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">{message}</p>
      </div>
    </div>
  );
}

// Empty state component for maps
export function MapEmptyState({ 
  title, 
  description, 
  icon: Icon 
}: { 
  title: string; 
  description: string; 
  icon?: LucideIcon; 
}) {
  return (
    <div className="h-full flex items-center justify-center p-8 relative z-10">
      <div className="text-center max-w-md">
        <div className="p-4 bg-gray-50 rounded-full w-16 h-16 mx-auto mb-4">
          {Icon && <Icon className="h-8 w-8 text-gray-400 mx-auto mt-2" />}
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  );
} 