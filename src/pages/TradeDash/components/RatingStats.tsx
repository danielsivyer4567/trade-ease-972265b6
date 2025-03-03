
import { RatingCard } from "./RatingCard";

interface RatingStatsProps {
  fiveStarReviews: number;
  totalJobs: number;
  overallRating: number;
}

export function RatingStats({ fiveStarReviews, totalJobs, overallRating }: RatingStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <RatingCard
        title="5-Star Reviews"
        value={fiveStarReviews}
        totalValue={totalJobs}
        description={`${fiveStarReviews} out of ${totalJobs} jobs rated 5 stars`}
      />
      
      <RatingCard
        title="Overall Rating"
        value={overallRating}
        totalValue={5}
        description={`Based on ${totalJobs} completed jobs`}
        showStars={true}
      />
    </div>
  );
}
