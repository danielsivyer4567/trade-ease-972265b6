
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
      <h2 className="text-2xl font-semibold mb-4">Top Tradespeople Rankings</h2>
      <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-md p-4">
        <RankingsTable rankings={rankings} />
      </div>
    </div>
  );
};
