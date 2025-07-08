import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GlassCard } from "@/components/ui/GlassCard";
import { LucideIcon } from "lucide-react";

// Unified color palette for consistent design
export const chartColors = {
  primary: '#1e40af',    // Modern blue
  secondary: '#3b82f6',  // Lighter blue
  tertiary: '#60a5fa',   // Even lighter blue
  accent: '#10b981',     // Green for positive metrics
  warning: '#f59e0b',    // Amber for attention items
  neutral: '#6b7280',    // Gray for secondary info
  background: '#f8fafc', // Light gray background
  border: '#e2e8f0'      // Subtle border color
};

interface ChartCardProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  iconColor?: string;
  backgroundGradient?: string;
  children: React.ReactNode;
  className?: string;
  height?: string;
}

export function ChartCard({ 
  title, 
  description, 
  icon: Icon, 
  iconColor = "text-blue-600",
  backgroundGradient = "from-blue-50 to-indigo-50",
  children, 
  className = "",
  height = "h-[400px]"
}: ChartCardProps) {
  return (
    <GlassCard className={`border-0 shadow-lg ${className}`}>
      <CardHeader className={`bg-gradient-to-r ${backgroundGradient} border-b border-gray-100`}>
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
      </CardHeader>
      <CardContent className="p-6">
        <div className={`w-full ${height}`}>
          {children}
        </div>
      </CardContent>
    </GlassCard>
  );
}

// Common tooltip styles for all charts
export const chartTooltipStyle = {
  backgroundColor: 'white',
  border: `1px solid ${chartColors.border}`,
  borderRadius: '8px',
  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
};

// Common axis styles
export const chartAxisStyle = {
  tick: { fill: chartColors.neutral, fontSize: 12 },
  stroke: chartColors.neutral
};

// Common grid styles
export const chartGridStyle = {
  strokeDasharray: "3 3",
  stroke: chartColors.border
}; 