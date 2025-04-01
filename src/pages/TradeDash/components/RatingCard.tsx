
import { Progress } from "@/components/ui/progress";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Star } from "lucide-react";

interface RatingCardProps {
  title: string;
  value: number;
  totalValue: number;
  description: string;
  showStars?: boolean;
}

export function RatingCard({ title, value, totalValue, description, showStars = false }: RatingCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {title}
        </CardTitle>
        {showStars && (
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className={`h-4 w-4 ${i < Math.floor(value) ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} 
              />
            ))}
          </div>
        )}
        {!showStars && <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />}
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          <div className="text-2xl font-bold">{value}</div>
          <Progress 
            value={showStars ? (value / 5) * 100 : (value / totalValue) * 100} 
            className="h-2 flex-1" 
          />
          {!showStars && (
            <div className="text-sm text-muted-foreground">
              {Math.round((value / totalValue) * 100)}%
            </div>
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          {description}
        </p>
      </CardContent>
    </Card>
  );
}
