import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Star, TrendingUp, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

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
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Star className="h-5 w-5 text-yellow-500" />
          Performance Rating
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Rating */}
        <div>
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Overall Rating</span>
            <div className="flex items-center gap-1">
              <span className="text-sm font-medium text-gray-900">{userStats.overallRating}</span>
              <span className="text-sm text-gray-500">/5</span>
            </div>
          </div>
          <Progress 
            value={userStats.overallRating * 20} 
            className="h-2 bg-gray-100" 
          />
        </div>
        
        {/* 5-Star Reviews */}
        <div>
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">5-Star Reviews</span>
            <div className="flex items-center gap-1">
              <span className="text-sm font-medium text-gray-900">{userStats.fiveStarReviews}</span>
              <span className="text-sm text-gray-500">/{userStats.totalJobs}</span>
            </div>
          </div>
          <Progress 
            value={userStats.fiveStarReviews / userStats.totalJobs * 100} 
            className="h-2 bg-gray-100" 
          />
        </div>
        
        {/* Response Rate */}
        <div>
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Response Rate</span>
            <div className="flex items-center gap-1">
              <span className="text-sm font-medium text-gray-900">{userStats.responseRate}</span>
              <span className="text-sm text-gray-500">%</span>
            </div>
          </div>
          <Progress 
            value={userStats.responseRate} 
            className="h-2 bg-gray-100" 
          />
        </div>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-gray-50 border">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className={cn(
                "h-4 w-4",
                userStats.ranking <= 10 ? "text-green-500" : "text-gray-400"
              )} />
              <div className="text-lg font-semibold text-gray-900">#{userStats.ranking}</div>
            </div>
            <div className="text-sm text-gray-600">Your Ranking</div>
          </div>
          
          <div className="p-4 rounded-lg bg-gray-50 border">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle className={cn(
                "h-4 w-4",
                userStats.totalJobs >= 50 ? "text-green-500" : "text-gray-400"
              )} />
              <div className="text-lg font-semibold text-gray-900">{userStats.totalJobs}</div>
            </div>
            <div className="text-sm text-gray-600">Jobs Completed</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};