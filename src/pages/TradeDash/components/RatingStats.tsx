import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Star } from "lucide-react";
interface UserStats {
  totalJobs: number;
  fiveStarReviews: number;
  overallRating: number;
  ranking: number;
  responseRate: number;
  isTopTen: boolean;
  freeLeadsAvailable: number;
}
interface RatingStatsProps {
  userStats: UserStats;
}
export const RatingStats = ({
  userStats
}: RatingStatsProps) => {
  return <Card>
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <Star className="h-5 w-5 text-yellow-500" />
          Performance Rating
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 bg-slate-200">
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium">Overall Rating</span>
            <span className="text-sm font-medium">{userStats.overallRating}/5</span>
          </div>
          <Progress value={userStats.overallRating * 20} className="h-2" />
        </div>
        
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium">5-Star Reviews</span>
            <span className="text-sm font-medium">{userStats.fiveStarReviews}/{userStats.totalJobs}</span>
          </div>
          <Progress value={userStats.fiveStarReviews / userStats.totalJobs * 100} className="h-2" />
        </div>
        
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium">Response Rate</span>
            <span className="text-sm font-medium">{userStats.responseRate}%</span>
          </div>
          <Progress value={userStats.responseRate} className="h-2" />
        </div>
        
        <div className="grid grid-cols-2 gap-4 mt-4 bg-slate-200">
          <div className="p-3 rounded-md bg-slate-300">
            <div className="text-lg font-bold">{userStats.ranking}</div>
            <div className="text-xs text-black-500">Your Ranking</div>
          </div>
          <div className="p-3 rounded-md bg-slate-300">
            <div className="text-lg font-bold">{userStats.totalJobs}</div>
            <div className="text-xs text-black-500 bg-slate-300">Jobs Completed</div>
          </div>
        </div>
      </CardContent>
    </Card>;
};