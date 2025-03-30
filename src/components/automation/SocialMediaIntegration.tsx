
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Facebook, Instagram, Twitter, ArrowRight, Check } from 'lucide-react';
import { toast } from 'sonner';
import { AutomationIntegrationService } from '@/services/AutomationIntegrationService';

interface SocialMediaPlatform {
  id: string;
  name: string;
  icon: React.ReactNode;
  connected: boolean;
}

interface SocialMediaIntegrationProps {
  itemId: string;
  itemType: 'job' | 'quote';
  onPost?: (platforms: string[]) => void;
}

export function SocialMediaIntegration({ itemId, itemType, onPost }: SocialMediaIntegrationProps) {
  const [platforms, setPlatforms] = useState<SocialMediaPlatform[]>([
    { id: 'facebook', name: 'Facebook', icon: <Facebook className="h-5 w-5 text-blue-600" />, connected: true },
    { id: 'instagram', name: 'Instagram', icon: <Instagram className="h-5 w-5 text-pink-600" />, connected: true },
    { id: 'twitter', name: 'Twitter', icon: <Twitter className="h-5 w-5 text-blue-400" />, connected: false }
  ]);
  
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [isPosting, setIsPosting] = useState(false);
  
  const handleTogglePlatform = (platformId: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(platformId)
        ? prev.filter(id => id !== platformId)
        : [...prev, platformId]
    );
  };
  
  const handlePost = async () => {
    if (selectedPlatforms.length === 0) {
      toast.error('Please select at least one platform');
      return;
    }
    
    setIsPosting(true);
    try {
      // Create a post for this job/quote via automation
      const automationId = 4; // Social Media Post automation
      
      await AutomationIntegrationService.triggerAutomation(automationId, {
        targetType: itemType,
        targetId: itemId,
        additionalData: {
          platforms: selectedPlatforms
        }
      });
      
      toast.success('Content posted to selected platforms');
      
      if (onPost) {
        onPost(selectedPlatforms);
      }
      
      // Reset selection
      setSelectedPlatforms([]);
    } catch (error) {
      console.error('Failed to post to social media:', error);
      toast.error('Failed to post to social media');
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Social Media Sharing</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <p className="text-sm text-gray-500">Select platforms to share:</p>
          
          <div className="space-y-2">
            {platforms.map(platform => (
              <div 
                key={platform.id}
                className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer ${
                  platform.connected
                    ? selectedPlatforms.includes(platform.id)
                      ? 'bg-blue-50 border-blue-200'
                      : 'bg-slate-50 hover:bg-slate-100'
                    : 'bg-gray-100 opacity-60 cursor-not-allowed'
                }`}
                onClick={() => {
                  if (platform.connected) {
                    handleTogglePlatform(platform.id);
                  } else {
                    toast.info(`${platform.name} is not connected. Please connect it in Settings.`);
                  }
                }}
              >
                <div className="flex items-center gap-3">
                  {platform.icon}
                  <span className="font-medium">{platform.name}</span>
                </div>
                {platform.connected ? (
                  selectedPlatforms.includes(platform.id) ? (
                    <Check className="h-5 w-5 text-blue-500" />
                  ) : (
                    <ArrowRight className="h-4 w-4 text-gray-400" />
                  )
                ) : (
                  <Button variant="ghost" size="sm" onClick={(e) => {
                    e.stopPropagation();
                    toast.info(`Navigate to Settings > Integrations to connect ${platform.name}`);
                  }}>
                    Connect
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
        
        <Button 
          variant="default" 
          className="w-full" 
          disabled={selectedPlatforms.length === 0 || isPosting}
          onClick={handlePost}
        >
          {isPosting ? 'Posting...' : 'Share Content'}
        </Button>
      </CardContent>
    </Card>
  );
}
