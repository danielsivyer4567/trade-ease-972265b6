import React from "react";
import { JourneyStageCard } from "./JourneyStageCard";
import { User, FileText, CheckCircle, Briefcase, Package } from "lucide-react";

const stages = [
  {
    title: "Customer Inquiry",
    icon: <User className="w-6 h-6" />,
    status: "completed",
    date: "2023-09-04",
  },
  {
    title: "Quote Creation",
    icon: <FileText className="w-6 h-6" />,
    status: "completed",
    date: "2023-10-15",
  },
  {
    title: "Quote Approval",
    icon: <CheckCircle className="w-6 h-6" />,
    status: "completed",
    date: "2023-10-16",
  },
  {
    title: "Job Creation",
    icon: <Briefcase className="w-6 h-6" />,
    status: "completed",
    date: "2023-10-20",
  },
  {
    title: "Job Execution",
    icon: <Package className="w-6 h-6" />,
    status: "current",
    date: "2023-10-21",
  },
  {
    title: "Job Completion",
    icon: <CheckCircle className="w-6 h-6" />,
    status: "upcoming",
    date: "",
  },
];

export function Timeline() {
  // Find the current stage index
  const currentIdx = stages.findIndex((s) => s.status === "current");

  return (
    <div className="flex justify-center py-12 bg-slate-50 min-h-screen">
      <div className="relative flex flex-col items-center w-80">
        {/* Vertical line */}
        <div className="absolute left-1/2 top-0 h-full w-1 -translate-x-1/2 bg-gradient-to-b from-blue-100 via-blue-200 to-blue-100 z-0" />
        {/* Pulse for current stage */}
        {currentIdx !== -1 && (
          <div
            className="absolute left-1/2 w-3 h-24 -translate-x-1/2 animate-pulse-line z-10"
            style={{
              top: `calc(${currentIdx * 8}rem + 2.5rem)`, // 8rem per card + offset for icon
            }}
          />
        )}
        {/* Stages */}
        <div className="flex flex-col items-center w-full z-10">
          {stages.map((stage, idx) => (
            <div key={stage.title} className="flex flex-col items-center w-full">
              <JourneyStageCard
                icon={stage.icon}
                title={stage.title}
                status={stage.status}
                date={stage.date}
                isCurrent={stage.status === "current"}
              />
              {/* Spacer except after last */}
              {idx < stages.length - 1 && (
                <div className="h-32 w-1 bg-transparent" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 