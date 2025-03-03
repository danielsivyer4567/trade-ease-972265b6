
import React from "react";
import { RankingsTable } from "./RankingsTable";
import { GlassCard } from "@/components/ui/GlassCard";
import { SectionHeader } from "@/components/ui/SectionHeader";

interface Ranking {
  id: number;
  tradeName: string;
  category: string;
  area: string;
  responseRate: number;
  jobsCompleted: number;
  rating: number;
}

interface RankingsTabProps {
  rankings: Ranking[];
}

export const RankingsTab: React.FC<RankingsTabProps> = ({ rankings }) => {
  return (
    <div className="space-y-4">
      <SectionHeader title="Top Tradespeople Rankings" />
      <GlassCard>
        <RankingsTable rankings={rankings} />
      </GlassCard>
    </div>
  );
};
