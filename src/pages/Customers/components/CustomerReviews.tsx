import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Share2, MessageCircle, Link as LinkIcon } from "lucide-react";
import { Input } from "@/components/ui/input";

interface CustomerReviewsProps {
  customerId: string;
}

interface Review {
  id: string;
  platform: 'google' | 'facebook' | 'yelp' | 'other';
  rating: number;
  content: string;
  reviewer: string;
  date: string;
}

export function CustomerReviews({ customerId }: CustomerReviewsProps) {
  // Sample data - in a real app, fetch from your database
  const reviews: Review[] = [
    {
      id: '1',
      platform: 'google',
      rating: 5,
      content: "Excellent service! The team was professional, on time, and did a fantastic job.",
      reviewer: "John Doe",
      date: "2024-03-15"
    },
    {
      id: '2',
      platform: 'facebook',
      rating: 4,
      content: "Very good work, would recommend.",
      reviewer: "Jane Smith",
      date: "2024-02-20"
    }
  ];
  
  const [reviewLink, setReviewLink] = React.useState("");
  const [isCopied, setIsCopied] = React.useState(false);
  
  const generateReviewLink = () => {
    // In a real app, this would generate a unique link for the customer
    const baseUrl = window.location.origin;
    setReviewLink(`${baseUrl}/review?customer=${customerId}&ref=${Date.now()}`);
  };
  
  const copyToClipboard = () => {
    if (!reviewLink) return;
    
    navigator.clipboard.writeText(reviewLink).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };
  
  const renderStars = (rating: number) => {
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <Star 
          key={i} 
          className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
        />
      ));
  };
  
  const renderPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'google':
        return <span className="text-blue-500 text-xs font-medium">Google</span>;
      case 'facebook':
        return <span className="text-blue-600 text-xs font-medium">Facebook</span>;
      case 'yelp':
        return <span className="text-red-500 text-xs font-medium">Yelp</span>;
      default:
        return <span className="text-gray-500 text-xs font-medium">{platform}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Generate Review Link Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Generate Review Link</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-500">
            Create a custom link to send to your customer to request a review.
            They'll be directed to leave a review on Google, Facebook, or your platform of choice.
          </p>
          
          <div className="flex flex-wrap gap-2">
            <Button 
              variant="outline"
              size="sm" 
              className="flex items-center gap-1"
              onClick={generateReviewLink}
            >
              <LinkIcon className="h-4 w-4" />
              <span>Generate Link</span>
            </Button>
            
            <Button 
              variant="default"
              size="sm" 
              className="flex items-center gap-1"
              onClick={() => {
                // In a real app, this would prepare an email or message
                generateReviewLink();
              }}
            >
              <MessageCircle className="h-4 w-4" />
              <span>Send Request</span>
            </Button>
          </div>
          
          {reviewLink && (
            <div className="flex items-center gap-2 mt-4">
              <Input 
                value={reviewLink} 
                readOnly 
                className="font-mono text-sm"
              />
              <Button
                variant="secondary"
                size="sm"
                onClick={copyToClipboard}
              >
                {isCopied ? 'Copied!' : 'Copy'}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Existing Reviews */}
      <div>
        <h3 className="font-medium mb-4">Customer Reviews</h3>
        
        {reviews.length > 0 ? (
          <div className="space-y-4">
            {reviews.map((review) => (
              <Card key={review.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        {renderPlatformIcon(review.platform)}
                        <span className="text-gray-500 text-xs">•</span>
                        <span className="text-gray-500 text-xs">{formatDate(review.date)}</span>
                      </div>
                      <div className="flex items-center">
                        {renderStars(review.rating)}
                      </div>
                    </div>
                    <Button variant="ghost" size="icon">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{review.content}</p>
                  <p className="text-xs font-medium mt-2">- {review.reviewer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 bg-gray-50 rounded-lg border border-dashed">
            <Star className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <h3 className="font-medium mb-1">No Reviews Yet</h3>
            <p className="text-sm text-gray-500 mb-4">This customer hasn't left any reviews yet</p>
            <Button size="sm" className="mx-auto">Request a Review</Button>
          </div>
        )}
      </div>
    </div>
  );
}
