
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Mail, MessageSquare, Share2, Check, Upload, Image, Search } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { supabase } from '@/integrations/supabase/client';
import { AutomationIntegrationService } from '@/services/AutomationIntegrationService';

interface PhotoSharingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialSource?: 'job' | 'customer' | 'social';
  jobId?: string;
  customerId?: string;
}

export function PhotoSharingModal({ 
  isOpen, 
  onClose,
  initialSource = 'job',
  jobId,
  customerId
}: PhotoSharingModalProps) {
  const [source, setSource] = useState<'job' | 'customer' | 'social'>(initialSource);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]);
  const [photos, setPhotos] = useState<string[]>([]);
  const [recipientEmail, setRecipientEmail] = useState('');
  const [recipientPhone, setRecipientPhone] = useState('');
  const [shareMethod, setShareMethod] = useState<'email' | 'text' | 'cloud'>('email');
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const isMobile = useIsMobile();

  // Load photos based on source type and ID
  useEffect(() => {
    if (isOpen) {
      loadPhotos();
    }
  }, [isOpen, source, jobId, customerId, searchQuery]);

  const loadPhotos = async () => {
    setIsLoading(true);
    try {
      // In a real implementation, this would fetch from your storage
      // For now, we'll use mock data
      
      // Sample images for demonstration
      const mockPhotos = [
        '/lovable-uploads/147b0371-94bb-403e-a449-f6fc081c4d6c.png',
        '/lovable-uploads/30179ed7-1923-4ddf-8af0-c40f3280552e.png',
        '/lovable-uploads/34bca7f1-d63b-45a0-b1ca-a562443686ad.png',
        '/lovable-uploads/5c4f50cd-e5f8-49b9-ac5f-6ebd7daa4902.png',
        '/lovable-uploads/6a07dd00-f2c7-49da-8b00-48d960c13610.png',
      ];
      
      // Filter based on search query if any
      const filteredPhotos = searchQuery 
        ? mockPhotos.filter(photo => photo.toLowerCase().includes(searchQuery.toLowerCase()))
        : mockPhotos;
      
      setPhotos(filteredPhotos);
    } catch (error) {
      console.error('Error loading photos:', error);
      toast.error('Failed to load photos');
    } finally {
      setIsLoading(false);
    }
  };

  const togglePhotoSelection = (photoUrl: string) => {
    setSelectedPhotos(prev => 
      prev.includes(photoUrl) 
        ? prev.filter(url => url !== photoUrl)
        : [...prev, photoUrl]
    );
  };

  const handleShare = async () => {
    if (selectedPhotos.length === 0) {
      toast.error('Please select at least one photo to share');
      return;
    }

    setIsSending(true);
    try {
      switch (shareMethod) {
        case 'email': 
          if (!recipientEmail) {
            toast.error('Please enter recipient email');
            return;
          }
          await shareViaEmail();
          break;
        case 'text':
          if (!recipientPhone) {
            toast.error('Please enter recipient phone number');
            return;
          }
          await shareViaText();
          break;
        case 'cloud':
          await shareViaCloudStorage();
          break;
      }

      toast.success('Photos shared successfully');
      onClose();
      setSelectedPhotos([]);
    } catch (error) {
      console.error('Error sharing photos:', error);
      toast.error('Failed to share photos');
    } finally {
      setIsSending(false);
    }
  };

  const shareViaEmail = async () => {
    // Use the AutomationIntegrationService to send email with photos
    await AutomationIntegrationService.triggerAutomation(33, {
      targetType: source === 'job' ? 'job' : 'customer',
      targetId: source === 'job' ? jobId || '' : customerId || '',
      additionalData: {
        action: 'share_photos',
        method: 'email',
        recipient: recipientEmail,
        photos: selectedPhotos,
        timestamp: new Date().toISOString()
      }
    });
  };

  const shareViaText = async () => {
    // Use the AutomationIntegrationService to send SMS with photo links
    await AutomationIntegrationService.triggerAutomation(33, {
      targetType: source === 'job' ? 'job' : 'customer',
      targetId: source === 'job' ? jobId || '' : customerId || '',
      additionalData: {
        action: 'share_photos',
        method: 'sms',
        recipient: recipientPhone,
        photos: selectedPhotos,
        timestamp: new Date().toISOString()
      }
    });
  };

  const shareViaCloudStorage = async () => {
    // Use the AutomationIntegrationService to create a shared Google Drive folder
    await AutomationIntegrationService.triggerAutomation(33, {
      targetType: source === 'job' ? 'job' : 'customer',
      targetId: source === 'job' ? jobId || '' : customerId || '',
      additionalData: {
        action: 'share_photos',
        method: 'cloud',
        photos: selectedPhotos,
        timestamp: new Date().toISOString()
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={isOpen => !isOpen && onClose()}>
      <DialogContent className={`max-w-3xl h-[90vh] flex flex-col ${isMobile ? 'p-3' : ''}`}>
        <DialogHeader>
          <DialogTitle>Share Photos</DialogTitle>
          <DialogDescription>
            Select photos and choose how to share them
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 flex flex-col md:flex-row gap-4 overflow-hidden">
          <div className="flex-1 flex flex-col min-h-0">
            <div className="mb-4">
              <Tabs value={source} onValueChange={(v) => setSource(v as any)}>
                <TabsList className="grid grid-cols-3 mb-4">
                  <TabsTrigger value="job">Job Photos</TabsTrigger>
                  <TabsTrigger value="customer">Customer Photos</TabsTrigger>
                  <TabsTrigger value="social">Social Media</TabsTrigger>
                </TabsList>
              </Tabs>
              
              <div className="relative mb-4">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search photos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto border rounded-md p-4">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <p>Loading photos...</p>
                </div>
              ) : photos.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {photos.map((photo, index) => (
                    <div 
                      key={index} 
                      className={`relative aspect-square border rounded-md cursor-pointer overflow-hidden ${
                        selectedPhotos.includes(photo) ? 'ring-2 ring-primary' : ''
                      }`}
                      onClick={() => togglePhotoSelection(photo)}
                    >
                      <img 
                        src={photo} 
                        alt={`Photo ${index}`} 
                        className="w-full h-full object-cover"
                      />
                      {selectedPhotos.includes(photo) && (
                        <div className="absolute top-1 right-1 bg-primary rounded-full p-1">
                          <Check className="h-4 w-4 text-white" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <Image className="h-12 w-12 text-gray-400 mb-2" />
                  <p>No photos found</p>
                  <p className="text-sm text-gray-500">Try a different search or source</p>
                </div>
              )}
            </div>

            <div className="mt-3 text-sm text-gray-500">
              {selectedPhotos.length} photo{selectedPhotos.length !== 1 ? 's' : ''} selected
            </div>
          </div>

          <div className="w-full md:w-64 flex flex-col">
            <div className="border rounded-md p-4 space-y-4">
              <h3 className="font-medium">Share Options</h3>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="shareMethod">Share Method</Label>
                  <div className="grid grid-cols-3 gap-2">
                    <Button
                      type="button"
                      variant={shareMethod === 'email' ? 'default' : 'outline'}
                      className="flex flex-col items-center justify-center h-16 px-1 py-2"
                      onClick={() => setShareMethod('email')}
                    >
                      <Mail className="h-5 w-5 mb-1" />
                      <span className="text-xs">Email</span>
                    </Button>
                    <Button
                      type="button"
                      variant={shareMethod === 'text' ? 'default' : 'outline'}
                      className="flex flex-col items-center justify-center h-16 px-1 py-2"
                      onClick={() => setShareMethod('text')}
                    >
                      <MessageSquare className="h-5 w-5 mb-1" />
                      <span className="text-xs">Text</span>
                    </Button>
                    <Button
                      type="button"
                      variant={shareMethod === 'cloud' ? 'default' : 'outline'}
                      className="flex flex-col items-center justify-center h-16 px-1 py-2"
                      onClick={() => setShareMethod('cloud')}
                    >
                      <Share2 className="h-5 w-5 mb-1" />
                      <span className="text-xs">Cloud</span>
                    </Button>
                  </div>
                </div>

                {shareMethod === 'email' && (
                  <div className="space-y-2">
                    <Label htmlFor="email">Recipient Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="customer@example.com"
                      value={recipientEmail}
                      onChange={(e) => setRecipientEmail(e.target.value)}
                    />
                  </div>
                )}

                {shareMethod === 'text' && (
                  <div className="space-y-2">
                    <Label htmlFor="phone">Recipient Phone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                      value={recipientPhone}
                      onChange={(e) => setRecipientPhone(e.target.value)}
                    />
                  </div>
                )}

                {shareMethod === 'cloud' && (
                  <div className="space-y-2 text-center p-2 bg-muted/50 rounded-md">
                    <p className="text-xs text-muted-foreground">
                      Photos will be uploaded to a shared Google Drive folder and a link will be generated.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleShare} 
            disabled={selectedPhotos.length === 0 || isSending}
            className="ml-2"
          >
            {isSending ? 'Sharing...' : 'Share Photos'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
