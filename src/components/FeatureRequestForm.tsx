import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { FeatureRequestService, CreateFeatureRequestData } from '@/services/FeatureRequestService';
import { Loader2, Send, CheckCircle, AlertCircle } from 'lucide-react';

interface FeatureRequestFormProps {
  onRequestSubmitted?: () => void;
}

export const FeatureRequestForm: React.FC<FeatureRequestFormProps> = ({ onRequestSubmitted }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tradeType, setTradeType] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | 'urgent'>('medium');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [canRequest, setCanRequest] = useState(false);
  const [remainingRequests, setRemainingRequests] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const { toast } = useToast();

  useEffect(() => {
    checkPermissions();
  }, []);

  const checkPermissions = async () => {
    try {
      const [canRequestFeatures, requestLimit] = await Promise.all([
        FeatureRequestService.canRequestFeatures(),
        FeatureRequestService.getFeatureRequestLimit()
      ]);

      setCanRequest(canRequestFeatures);
      setRemainingRequests(requestLimit);
    } catch (error) {
      console.error('Error checking permissions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !description.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in both title and description.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const requestData: CreateFeatureRequestData = {
        title: title.trim(),
        description: description.trim(),
        trade_type: tradeType.trim() || undefined,
        priority
      };

      await FeatureRequestService.createFeatureRequest(requestData);

      toast({
        title: "Feature Request Submitted",
        description: "Your request has been submitted successfully. We'll review it and get back to you.",
      });

      // Reset form
      setTitle('');
      setDescription('');
      setTradeType('');
      setPriority('medium');

      // Update remaining requests
      await checkPermissions();

      // Notify parent component
      onRequestSubmitted?.();

    } catch (error) {
      console.error('Error submitting feature request:', error);
      toast({
        title: "Submission Failed",
        description: error instanceof Error ? error.message : "Failed to submit feature request. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-6">
          <Loader2 className="h-6 w-6 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  if (!canRequest) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-orange-500" />
            Feature Requests Not Available
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Feature requests are only available for Growing Pain Relief, Premium Edge, and Skeleton Key subscription tiers.
            Please upgrade your subscription to request new features.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Send className="h-5 w-5 text-blue-500" />
          Request New Feature
        </CardTitle>
        <div className="text-sm text-muted-foreground">
          {remainingRequests === -1 ? (
            <span className="flex items-center gap-1 text-green-600">
              <CheckCircle className="h-4 w-4" />
              Unlimited feature requests available
            </span>
          ) : (
            <span>
              {remainingRequests} feature request{remainingRequests !== 1 ? 's' : ''} remaining
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Feature Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Plumbing Cost Calculator"
              maxLength={100}
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the feature you'd like to see implemented..."
              rows={4}
              maxLength={1000}
              required
            />
          </div>

          <div>
            <Label htmlFor="tradeType">Trade Type (Optional)</Label>
            <Input
              id="tradeType"
              value={tradeType}
              onChange={(e) => setTradeType(e.target.value)}
              placeholder="e.g., Plumbing, Electrical, HVAC"
              maxLength={50}
            />
          </div>

          <div>
            <Label htmlFor="priority">Priority</Label>
            <Select value={priority} onValueChange={(value: 'low' | 'medium' | 'high' | 'urgent') => setPriority(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low - Nice to have</SelectItem>
                <SelectItem value="medium">Medium - Would be helpful</SelectItem>
                <SelectItem value="high">High - Important for workflow</SelectItem>
                <SelectItem value="urgent">Urgent - Critical for business</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button 
            type="submit" 
            disabled={isSubmitting || remainingRequests === 0}
            className="w-full"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Submit Request
              </>
            )}
          </Button>

          {remainingRequests === 0 && (
            <p className="text-sm text-orange-600 text-center">
              You have reached your feature request limit. Please wait for existing requests to be processed.
            </p>
          )}
        </form>
      </CardContent>
    </Card>
  );
}; 