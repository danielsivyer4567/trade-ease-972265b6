
import React from "react";
import { RankingsTable } from "./RankingsTable";

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
      <h2 className="text-2xl font-semibold">Top Tradespeople Rankings</h2>
      <RankingsTable rankings={rankings} />
    </div>
  );
};
