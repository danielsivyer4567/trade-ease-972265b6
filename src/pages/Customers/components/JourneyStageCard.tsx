import React from "react";

interface JourneyStageCardProps {
  icon: React.ReactNode;
  title: string;
  status: string;
  date?: string;
  isCurrent?: boolean;
}

export const JourneyStageCard: React.FC<JourneyStageCardProps> = ({ icon, title, status, date, isCurrent }) => {
  return (
    <div className="relative flex flex-col items-center w-full">
      <div className={`flex items-center justify-center w-12 h-12 rounded-full border-4
        ${isCurrent ? "border-blue-400 bg-blue-50 animate-pulse" : status === "completed" ? "border-green-400 bg-green-50" : "border-gray-300 bg-white"}
        z-10`}>
        {icon}
      </div>
      <div className="mt-2 text-center">
        <div className="font-semibold">{title}</div>
        <div className={`text-xs mt-1 ${status === "completed" ? "text-green-600" : isCurrent ? "text-blue-600" : "text-gray-400"}`}>
          {status}
        </div>
        {date && <div className="text-xs text-gray-400 mt-1">{date}</div>}
      </div>
    </div>
  );
}; 